#!/usr/bin/env python3
"""
fetch_transistors.py - Pull transistor count data from Karl Rupp's GitHub.

Downloads the 50-year microprocessor trend data (transistors.dat).
Parses tab-separated data: Year, Transistor Count.
Outputs JSON to scripts/data/transistors.json.
"""

import json
import logging
import math
import os
import sys
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")

TRANSISTORS_URL = "https://raw.githubusercontent.com/karlrupp/microprocessor-trend-data/master/50yrs/transistors.dat"

# Also try to get other trend data from the same repo
FREQUENCY_URL = "https://raw.githubusercontent.com/karlrupp/microprocessor-trend-data/master/50yrs/frequency.dat"
SINGLE_THREAD_URL = "https://raw.githubusercontent.com/karlrupp/microprocessor-trend-data/master/50yrs/single-thread.dat"
CORES_URL = "https://raw.githubusercontent.com/karlrupp/microprocessor-trend-data/master/50yrs/cores.dat"
TDP_URL = "https://raw.githubusercontent.com/karlrupp/microprocessor-trend-data/master/50yrs/tdp.dat"

try:
    import requests
except ImportError:
    logger.error("The 'requests' library is required. Install with: pip3 install requests")
    sys.exit(1)


def _download_dat(url: str) -> str:
    """Download a .dat file and return its text content."""
    logger.info(f"Downloading {url} ...")
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    logger.info(f"  -> {len(resp.text):,} bytes received")
    return resp.text


def parse_dat_file(text: str) -> list[dict]:
    """Parse tab/whitespace-separated .dat file.

    Expected format (after skipping comments/headers):
        Year    Value
    Lines starting with '#' are comments.
    """
    results = []
    for line in text.strip().splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue

        parts = line.split()
        if len(parts) < 2:
            continue

        try:
            year = float(parts[0])
            value = float(parts[1])
            results.append({"year": round(year, 1), "value": value})
        except (ValueError, IndexError):
            continue

    results.sort(key=lambda r: r["year"])
    return results


def process_transistors(data_points: list[dict]) -> list[dict]:
    """Process transistor count data, adding log10 and processor name if available."""
    results = []
    for dp in data_points:
        entry = {
            "year": dp["year"],
            "transistor_count": dp["value"],
        }
        if dp["value"] > 0:
            entry["transistor_count_log10"] = round(math.log10(dp["value"]), 2)
        results.append(entry)
    return results


def compute_moores_law_comparison(transistors: list[dict]) -> list[dict]:
    """Compare actual transistor counts to Moore's Law prediction.

    Moore's Law: doubling every ~2 years.
    Baseline: ~2,300 transistors in 1971 (Intel 4004).
    """
    if not transistors:
        return []

    baseline_year = 1971
    baseline_count = 2300
    doubling_period = 2.0  # years

    comparison = []
    for t in transistors:
        year = t["year"]
        actual = t["transistor_count"]
        years_elapsed = year - baseline_year
        predicted = baseline_count * (2 ** (years_elapsed / doubling_period))

        ratio = actual / predicted if predicted > 0 else None

        comparison.append({
            "year": year,
            "actual": actual,
            "moores_law_predicted": round(predicted, 0),
            "ratio_actual_to_predicted": round(ratio, 2) if ratio else None,
        })

    return comparison


def fetch_supplementary_data() -> dict:
    """Fetch additional microprocessor trend data (frequency, cores, TDP, single-thread)."""
    supplementary = {}

    datasets = {
        "clock_frequency_mhz": FREQUENCY_URL,
        "single_thread_performance": SINGLE_THREAD_URL,
        "core_count": CORES_URL,
        "tdp_watts": TDP_URL,
    }

    for name, url in datasets.items():
        try:
            text = _download_dat(url)
            data_points = parse_dat_file(text)
            supplementary[name] = data_points
            logger.info(f"  {name}: {len(data_points)} data points")
        except Exception as exc:
            logger.warning(f"  Could not fetch {name}: {exc}")
            supplementary[name] = []

    return supplementary

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def fetch_transistors() -> dict:
    """Fetch transistor and microprocessor trend data."""
    os.makedirs(DATA_DIR, exist_ok=True)
    output: dict = {
        "source": "Karl Rupp - Microprocessor Trend Data (GitHub)",
        "urls": [TRANSISTORS_URL],
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "transistors": [],
        "moores_law_comparison": [],
        "supplementary": {},
        "summary": {},
    }

    # Main transistor data
    try:
        text = _download_dat(TRANSISTORS_URL)
        data_points = parse_dat_file(text)
        output["transistors"] = process_transistors(data_points)
        output["moores_law_comparison"] = compute_moores_law_comparison(output["transistors"])
        logger.info(f"  Transistor data points: {len(output['transistors'])}")
    except Exception as exc:
        logger.error(f"Failed to fetch transistor data: {exc}")

    # Supplementary data
    try:
        output["supplementary"] = fetch_supplementary_data()
    except Exception as exc:
        logger.error(f"Failed to fetch supplementary data: {exc}")

    # Summary
    if output["transistors"]:
        earliest = output["transistors"][0]
        latest = output["transistors"][-1]
        output["summary"] = {
            "total_data_points": len(output["transistors"]),
            "earliest": earliest,
            "latest": latest,
            "year_range": f"{earliest['year']}-{latest['year']}",
            "total_increase_factor": round(
                latest["transistor_count"] / earliest["transistor_count"], 0
            ) if earliest["transistor_count"] > 0 else None,
        }

    # Write JSON
    out_path = os.path.join(DATA_DIR, "transistors.json")
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    logger.info(f"Wrote {out_path}")

    return output


if __name__ == "__main__":
    data = fetch_transistors()
    print(f"\n=== Transistor Data Summary ===")
    s = data.get("summary", {})
    print(f"  Data points: {s.get('total_data_points', 'N/A')}")
    print(f"  Year range: {s.get('year_range', 'N/A')}")
    if s.get("earliest"):
        print(f"  Earliest: {s['earliest']['transistor_count']:,.0f} transistors ({s['earliest']['year']})")
    if s.get("latest"):
        print(f"  Latest: {s['latest']['transistor_count']:,.0f} transistors ({s['latest']['year']})")
    if s.get("total_increase_factor"):
        print(f"  Total increase: {s['total_increase_factor']:,.0f}x")
    sup = data.get("supplementary", {})
    for key, vals in sup.items():
        print(f"  {key}: {len(vals)} data points")
    print(f"  Output: scripts/data/transistors.json")
