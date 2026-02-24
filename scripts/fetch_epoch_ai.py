#!/usr/bin/env python3
"""
fetch_epoch_ai.py - Pull data from Epoch AI CSVs.

Downloads notable AI models, frontier AI models, and AI company revenue data.
Extracts frontier model training compute (FLOP) over time and revenue data.
Outputs JSON to scripts/data/epoch_ai.json.
"""

import json
import logging
import os
import sys
from datetime import datetime
from io import StringIO

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")

NOTABLE_MODELS_URL = "https://epoch.ai/data/notable_ai_models.csv"
FRONTIER_MODELS_URL = "https://epoch.ai/data/generated/frontier_ai_models.csv"
REVENUE_URL = "https://epoch.ai/data/ai_companies_revenue_reports.csv"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

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
    logger.warning("pandas not found; falling back to csv module")


def _download_csv(url: str) -> str:
    """Download a CSV from *url* and return its text content."""
    logger.info(f"Downloading {url} ...")
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    logger.info(f"  -> {len(resp.text):,} bytes received")
    return resp.text


def _parse_csv_pandas(text: str) -> list[dict]:
    df = pd.read_csv(StringIO(text), low_memory=False)
    return df.to_dict(orient="records")


def _parse_csv_stdlib(text: str) -> list[dict]:
    reader = csv.DictReader(StringIO(text))
    return list(reader)


def parse_csv(text: str) -> list[dict]:
    if HAS_PANDAS:
        return _parse_csv_pandas(text)
    return _parse_csv_stdlib(text)


def safe_float(val) -> float | None:
    """Convert a value to float, returning None on failure."""
    if val is None:
        return None
    try:
        if HAS_PANDAS:
            import math
            f = float(val)
            return None if math.isnan(f) else f
        return float(val)
    except (ValueError, TypeError):
        return None


def safe_int(val) -> int | None:
    f = safe_float(val)
    if f is None:
        return None
    return int(f)

# ---------------------------------------------------------------------------
# Processing
# ---------------------------------------------------------------------------

def process_notable_models(rows: list[dict]) -> list[dict]:
    """Extract training compute data from notable AI models."""
    results = []
    for row in rows:
        # Column names vary; try common variants
        name = row.get("System") or row.get("system") or row.get("Model") or row.get("model") or ""
        year_raw = row.get("Publication date") or row.get("publication_date") or row.get("Year") or row.get("year") or ""
        flop_raw = (
            row.get("Training compute (FLOP)")
            or row.get("training_compute__flop_")
            or row.get("Training compute")
            or row.get("training_compute")
            or ""
        )
        org = row.get("Organization") or row.get("organization") or row.get("Organisation") or ""

        flop = safe_float(flop_raw)
        if flop is None or flop <= 0:
            continue

        # Parse year — could be "2023-06-15" or just "2023"
        year = None
        year_str = str(year_raw).strip()
        if year_str:
            try:
                year = int(float(year_str[:4]))
            except (ValueError, IndexError):
                pass

        if year and name:
            results.append({
                "name": str(name).strip(),
                "year": year,
                "date": year_str[:10] if len(year_str) >= 10 else str(year),
                "training_flop": flop,
                "training_flop_log10": round(
                    __import__("math").log10(flop), 2
                ) if flop > 0 else None,
                "organization": str(org).strip(),
            })

    results.sort(key=lambda r: (r["year"], r.get("training_flop", 0)))
    logger.info(f"  Notable models with compute data: {len(results)}")
    return results


def process_frontier_models(rows: list[dict]) -> list[dict]:
    """Extract frontier model training compute over time."""
    results = []
    for row in rows:
        name = row.get("System") or row.get("system") or row.get("Model") or row.get("model") or ""
        year_raw = row.get("Publication date") or row.get("publication_date") or row.get("Year") or row.get("year") or ""
        flop_raw = (
            row.get("Training compute (FLOP)")
            or row.get("training_compute__flop_")
            or row.get("Training compute")
            or row.get("training_compute")
            or ""
        )
        org = row.get("Organization") or row.get("organization") or row.get("Organisation") or ""
        domain = row.get("Domain") or row.get("domain") or ""

        flop = safe_float(flop_raw)
        if flop is None or flop <= 0:
            continue

        year = None
        year_str = str(year_raw).strip()
        if year_str:
            try:
                year = int(float(year_str[:4]))
            except (ValueError, IndexError):
                pass

        if year and name:
            results.append({
                "name": str(name).strip(),
                "year": year,
                "date": year_str[:10] if len(year_str) >= 10 else str(year),
                "training_flop": flop,
                "training_flop_log10": round(
                    __import__("math").log10(flop), 2
                ) if flop > 0 else None,
                "organization": str(org).strip(),
                "domain": str(domain).strip(),
            })

    results.sort(key=lambda r: (r["year"], r.get("training_flop", 0)))
    logger.info(f"  Frontier models with compute data: {len(results)}")
    return results


def process_revenue(rows: list[dict]) -> list[dict]:
    """Extract AI company revenue data."""
    results = []
    for row in rows:
        company = row.get("Company") or row.get("company") or row.get("Entity") or ""
        revenue_raw = row.get("Revenue") or row.get("revenue") or row.get("Revenue (USD)") or ""
        period = row.get("Period") or row.get("period") or row.get("Date") or row.get("date") or ""
        quarter = row.get("Quarter") or row.get("quarter") or ""

        revenue = safe_float(revenue_raw)
        if revenue is None:
            continue

        company_str = str(company).strip()
        if not company_str:
            continue

        results.append({
            "company": company_str,
            "revenue_usd": revenue,
            "period": str(period).strip(),
            "quarter": str(quarter).strip(),
        })

    results.sort(key=lambda r: r.get("period", ""))
    logger.info(f"  Revenue data points: {len(results)}")
    return results


def compute_summary(notable: list[dict], frontier: list[dict]) -> dict:
    """Build summary statistics."""
    summary = {
        "total_notable_models": len(notable),
        "total_frontier_models": len(frontier),
    }
    if frontier:
        latest = max(frontier, key=lambda r: r.get("training_flop", 0))
        summary["largest_training_run"] = {
            "name": latest["name"],
            "flop": latest["training_flop"],
            "flop_log10": latest.get("training_flop_log10"),
            "year": latest["year"],
        }
    # Compute by-year max FLOP (frontier envelope)
    by_year: dict[int, float] = {}
    for row in (frontier or notable):
        y = row["year"]
        f = row.get("training_flop", 0)
        if y not in by_year or f > by_year[y]:
            by_year[y] = f
    summary["frontier_compute_by_year"] = [
        {"year": y, "max_flop": by_year[y], "max_flop_log10": round(__import__("math").log10(by_year[y]), 2) if by_year[y] > 0 else None}
        for y in sorted(by_year)
    ]
    return summary

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def fetch_epoch_ai() -> dict:
    """Fetch all Epoch AI data and return combined dict."""
    os.makedirs(DATA_DIR, exist_ok=True)
    output: dict = {
        "source": "Epoch AI",
        "urls": [NOTABLE_MODELS_URL, FRONTIER_MODELS_URL, REVENUE_URL],
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "notable_models": [],
        "frontier_models": [],
        "revenue": [],
        "summary": {},
    }

    # --- Notable models ---
    try:
        text = _download_csv(NOTABLE_MODELS_URL)
        rows = parse_csv(text)
        output["notable_models"] = process_notable_models(rows)
    except Exception as exc:
        logger.error(f"Failed to fetch notable models: {exc}")

    # --- Frontier models ---
    try:
        text = _download_csv(FRONTIER_MODELS_URL)
        rows = parse_csv(text)
        output["frontier_models"] = process_frontier_models(rows)
    except Exception as exc:
        logger.error(f"Failed to fetch frontier models: {exc}")

    # --- Revenue ---
    try:
        text = _download_csv(REVENUE_URL)
        rows = parse_csv(text)
        output["revenue"] = process_revenue(rows)
    except Exception as exc:
        logger.error(f"Failed to fetch revenue data: {exc}")

    output["summary"] = compute_summary(
        output["notable_models"], output["frontier_models"]
    )

    # Write JSON
    out_path = os.path.join(DATA_DIR, "epoch_ai.json")
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    logger.info(f"Wrote {out_path}")

    return output


if __name__ == "__main__":
    data = fetch_epoch_ai()
    print(f"\n=== Epoch AI Data Summary ===")
    print(f"  Notable models: {len(data['notable_models'])}")
    print(f"  Frontier models: {len(data['frontier_models'])}")
    print(f"  Revenue records: {len(data['revenue'])}")
    if data["summary"].get("largest_training_run"):
        ltr = data["summary"]["largest_training_run"]
        print(f"  Largest training run: {ltr['name']} ({ltr['flop']:.2e} FLOP, {ltr['year']})")
    print(f"  Output: scripts/data/epoch_ai.json")
