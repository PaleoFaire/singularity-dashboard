#!/usr/bin/env python3
"""
fetch_satellites.py - Pull satellite data from UCS and CelesTrak.

Primary source: CelesTrak SATCAT CSV (more reliable programmatic access).
Fallback: UCS Satellite Database (Excel file).
Counts active satellites and groups by launch year.
Outputs JSON to scripts/data/satellites.json.
"""

import json
import logging
import os
import sys
from datetime import datetime
from io import BytesIO, StringIO

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")

CELESTRAK_SATCAT_URL = "https://celestrak.org/pub/satcat.csv"
UCS_DATABASE_URL = "https://www.ucsusa.org/sites/default/files/2025-02/UCS-Satellite-Database-1-1-2025.xlsx"
# UCS changes the filename with each update; we try a few variants
UCS_FALLBACK_URLS = [
    "https://www.ucsusa.org/sites/default/files/2024-12/UCS-Satellite-Database-Update-12-1-2024.xlsx",
    "https://www.ucsusa.org/sites/default/files/2024-09/UCS-Satellite-Database-9-1-2024.xlsx",
]

try:
    import requests
except ImportError:
    logger.error("The 'requests' library is required. Install with: pip3 install requests")
    sys.exit(1)

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    import csv
    HAS_PANDAS = False
    logger.warning("pandas not found; falling back to csv module (UCS Excel won't be readable)")

# ---------------------------------------------------------------------------
# CelesTrak SATCAT
# ---------------------------------------------------------------------------

def fetch_celestrak() -> list[dict]:
    """Download CelesTrak SATCAT CSV and return parsed rows."""
    logger.info(f"Downloading CelesTrak SATCAT from {CELESTRAK_SATCAT_URL} ...")
    resp = requests.get(CELESTRAK_SATCAT_URL, timeout=120)
    resp.raise_for_status()
    logger.info(f"  -> {len(resp.text):,} bytes received")

    if HAS_PANDAS:
        df = pd.read_csv(StringIO(resp.text), low_memory=False)
        return df.to_dict(orient="records")
    else:
        reader = csv.DictReader(StringIO(resp.text))
        return list(reader)


def process_celestrak(rows: list[dict]) -> dict:
    """Process CelesTrak SATCAT data.

    Key columns (may vary):
      OBJECT_NAME, OBJECT_ID, NORAD_CAT_ID, OBJECT_TYPE,
      OPS_STATUS_CODE, LAUNCH_DATE, DECAY_DATE, PERIOD, ...

    OPS_STATUS_CODE:
      '+' = operational, '-' = non-operational, 'P' = partially operational,
      'B' = backup/standby, 'S' = spare, 'X' = extended mission,
      'D' = decayed, '?' = unknown
    """
    active_statuses = {"+", "P", "B", "S", "X"}

    total = 0
    active = 0
    by_year: dict[int, int] = {}
    active_by_year: dict[int, int] = {}
    by_type: dict[str, int] = {}

    for row in rows:
        total += 1

        ops = str(row.get("OPS_STATUS_CODE", "") or "").strip()
        is_active = ops in active_statuses
        if is_active:
            active += 1

        # Parse launch date  "2023-06-15" or "2023 Jun 15" etc.
        launch_date = str(row.get("LAUNCH_DATE", "") or "").strip()
        year = None
        if launch_date:
            try:
                year = int(launch_date[:4])
            except (ValueError, IndexError):
                pass

        if year:
            by_year[year] = by_year.get(year, 0) + 1
            if is_active:
                active_by_year[year] = active_by_year.get(year, 0) + 1

        obj_type = str(row.get("OBJECT_TYPE", "") or "").strip()
        if obj_type:
            by_type[obj_type] = by_type.get(obj_type, 0) + 1

    return {
        "source": "CelesTrak SATCAT",
        "total_objects": total,
        "active_satellites": active,
        "launches_by_year": [
            {"year": y, "count": by_year[y]}
            for y in sorted(by_year)
        ],
        "active_by_launch_year": [
            {"year": y, "count": active_by_year[y]}
            for y in sorted(active_by_year)
        ],
        "by_object_type": by_type,
    }

# ---------------------------------------------------------------------------
# UCS Satellite Database
# ---------------------------------------------------------------------------

def fetch_ucs() -> list[dict] | None:
    """Try downloading UCS Satellite Database Excel file."""
    if not HAS_PANDAS:
        logger.warning("Skipping UCS download (pandas/openpyxl required for Excel)")
        return None

    urls = [UCS_DATABASE_URL] + UCS_FALLBACK_URLS
    for url in urls:
        try:
            logger.info(f"Trying UCS URL: {url}")
            resp = requests.get(url, timeout=120, allow_redirects=True)
            if resp.status_code == 200 and len(resp.content) > 10000:
                logger.info(f"  -> {len(resp.content):,} bytes received")
                try:
                    df = pd.read_excel(BytesIO(resp.content), engine="openpyxl")
                    logger.info(f"  -> {len(df)} rows parsed")
                    return df.to_dict(orient="records")
                except Exception as exc:
                    logger.warning(f"  Could not parse Excel: {exc}")
            else:
                logger.warning(f"  HTTP {resp.status_code}, body {len(resp.content)} bytes")
        except Exception as exc:
            logger.warning(f"  Failed: {exc}")

    logger.warning("Could not download UCS database from any URL")
    return None


def process_ucs(rows: list[dict]) -> dict:
    """Process UCS Satellite Database rows."""
    by_year: dict[int, int] = {}
    by_country: dict[str, int] = {}
    by_purpose: dict[str, int] = {}

    for row in rows:
        # Date of Launch or Launch Date column
        launch = (
            row.get("Date of Launch")
            or row.get("Launch Date")
            or row.get("date_of_launch")
            or ""
        )
        year = None
        launch_str = str(launch).strip()
        if launch_str:
            try:
                year = int(float(launch_str[:4]))
            except (ValueError, IndexError):
                pass

        if year and 1957 <= year <= 2030:
            by_year[year] = by_year.get(year, 0) + 1

        country = str(
            row.get("Country of Operator/Owner")
            or row.get("Country/Org of UN Registry")
            or row.get("country")
            or ""
        ).strip()
        if country:
            by_country[country] = by_country.get(country, 0) + 1

        purpose = str(row.get("Purpose") or row.get("purpose") or "").strip()
        if purpose:
            by_purpose[purpose] = by_purpose.get(purpose, 0) + 1

    return {
        "source": "UCS Satellite Database",
        "total_active_satellites": len(rows),
        "by_launch_year": [
            {"year": y, "count": by_year[y]} for y in sorted(by_year)
        ],
        "by_country": dict(sorted(by_country.items(), key=lambda x: -x[1])[:30]),
        "by_purpose": dict(sorted(by_purpose.items(), key=lambda x: -x[1])),
    }

# ---------------------------------------------------------------------------
# Cumulative active satellite count over time
# ---------------------------------------------------------------------------

def build_cumulative_series(active_by_year: list[dict]) -> list[dict]:
    """Build a cumulative count of active satellites over time."""
    cumulative = []
    total = 0
    for entry in active_by_year:
        total += entry["count"]
        cumulative.append({"year": entry["year"], "cumulative_active": total})
    return cumulative

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def fetch_satellites() -> dict:
    """Fetch satellite data and return combined dict."""
    os.makedirs(DATA_DIR, exist_ok=True)
    output: dict = {
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "celestrak": {},
        "ucs": {},
        "cumulative_active_satellites": [],
    }

    # CelesTrak
    try:
        rows = fetch_celestrak()
        output["celestrak"] = process_celestrak(rows)
        if output["celestrak"].get("active_by_launch_year"):
            output["cumulative_active_satellites"] = build_cumulative_series(
                output["celestrak"]["active_by_launch_year"]
            )
    except Exception as exc:
        logger.error(f"CelesTrak fetch failed: {exc}")

    # UCS
    try:
        ucs_rows = fetch_ucs()
        if ucs_rows:
            output["ucs"] = process_ucs(ucs_rows)
    except Exception as exc:
        logger.error(f"UCS fetch failed: {exc}")

    # Write JSON
    out_path = os.path.join(DATA_DIR, "satellites.json")
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    logger.info(f"Wrote {out_path}")

    return output


if __name__ == "__main__":
    data = fetch_satellites()
    ct = data.get("celestrak", {})
    ucs = data.get("ucs", {})
    print(f"\n=== Satellite Data Summary ===")
    if ct:
        print(f"  CelesTrak total objects: {ct.get('total_objects', 'N/A')}")
        print(f"  CelesTrak active satellites: {ct.get('active_satellites', 'N/A')}")
    if ucs:
        print(f"  UCS active satellites: {ucs.get('total_active_satellites', 'N/A')}")
    if data.get("cumulative_active_satellites"):
        latest = data["cumulative_active_satellites"][-1]
        print(f"  Cumulative active (latest): {latest['cumulative_active']} (through {latest['year']})")
    print(f"  Output: scripts/data/satellites.json")
