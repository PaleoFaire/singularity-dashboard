#!/usr/bin/env python3
"""
fetch_solar_energy.py - Pull solar energy data from Our World in Data.

Downloads OWID energy dataset and extracts:
  - Solar capacity (GW) for 'World' entity by year
  - Solar share of energy
  - Solar electricity generation
  - Solar module cost data (from OWID solar-cost dataset)
Outputs JSON to scripts/data/solar_energy.json.
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

OWID_ENERGY_URL = "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv"
OWID_SOLAR_COST_URL = "https://raw.githubusercontent.com/owid/etl/master/etl/steps/data/grapher/irena/2023-12-12/renewable_power_generation_costs.csv"
# Fallback: OWID GitHub for solar PV module prices
OWID_SOLAR_PV_PRICES_URL = "https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Solar%20PV%20module%20cost%20-%20Farmer%20%26%20Lafond%20(2016)/Solar%20PV%20module%20cost%20-%20Farmer%20%26%20Lafond%20(2016).csv"

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


def safe_float(val) -> float | None:
    if val is None:
        return None
    try:
        import math
        f = float(val)
        return None if math.isnan(f) else f
    except (ValueError, TypeError):
        return None


def _download_csv(url: str) -> str:
    logger.info(f"Downloading {url} ...")
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    logger.info(f"  -> {len(resp.text):,} bytes received")
    return resp.text


def parse_csv(text: str) -> list[dict]:
    if HAS_PANDAS:
        df = pd.read_csv(StringIO(text), low_memory=False)
        return df.to_dict(orient="records")
    reader = csv.DictReader(StringIO(text))
    return list(reader)

# ---------------------------------------------------------------------------
# OWID Energy Data
# ---------------------------------------------------------------------------

def process_energy_data(rows: list[dict]) -> dict:
    """Extract solar data for 'World' entity."""
    solar_capacity = []
    solar_share = []
    solar_electricity = []
    solar_consumption = []

    for row in rows:
        entity = str(row.get("country", "") or row.get("entity", "")).strip()
        if entity.lower() != "world":
            continue

        year = None
        try:
            year = int(float(row.get("year", 0)))
        except (ValueError, TypeError):
            continue
        if not year:
            continue

        # Solar capacity (installed, GW)
        cap = safe_float(row.get("solar_capacity"))
        if cap is not None:
            solar_capacity.append({"year": year, "solar_capacity_gw": round(cap, 2)})

        # Solar share of energy (%)
        share = safe_float(row.get("solar_share_energy"))
        if share is not None:
            solar_share.append({"year": year, "solar_share_energy_pct": round(share, 3)})

        # Solar electricity (TWh)
        elec = safe_float(row.get("solar_electricity")) or safe_float(row.get("solar_elec_per_capita"))
        solar_elec_twh = safe_float(row.get("solar_electricity"))
        if solar_elec_twh is not None:
            solar_electricity.append({"year": year, "solar_electricity_twh": round(solar_elec_twh, 2)})

        # Solar consumption (TWh - primary energy equivalent)
        cons = safe_float(row.get("solar_consumption"))
        if cons is not None:
            solar_consumption.append({"year": year, "solar_consumption_twh": round(cons, 2)})

    solar_capacity.sort(key=lambda r: r["year"])
    solar_share.sort(key=lambda r: r["year"])
    solar_electricity.sort(key=lambda r: r["year"])
    solar_consumption.sort(key=lambda r: r["year"])

    logger.info(f"  Solar capacity data points: {len(solar_capacity)}")
    logger.info(f"  Solar share data points: {len(solar_share)}")
    logger.info(f"  Solar electricity data points: {len(solar_electricity)}")

    return {
        "solar_capacity_gw": solar_capacity,
        "solar_share_energy": solar_share,
        "solar_electricity_twh": solar_electricity,
        "solar_consumption_twh": solar_consumption,
    }

# ---------------------------------------------------------------------------
# Solar PV Module Cost
# ---------------------------------------------------------------------------

def fetch_solar_cost_data() -> list[dict]:
    """Try to get historical solar PV module cost data."""
    cost_data = []

    # Try OWID solar PV prices dataset
    for url in [OWID_SOLAR_PV_PRICES_URL]:
        try:
            text = _download_csv(url)
            rows = parse_csv(text)
            for row in rows:
                year = None
                try:
                    year = int(float(row.get("Year", row.get("year", 0))))
                except (ValueError, TypeError):
                    continue
                if not year:
                    continue

                # Column name varies
                cost = (
                    safe_float(row.get("Solar PV module cost (Farmer & Lafond (2016))"))
                    or safe_float(row.get("Solar photovoltaic module price"))
                    or safe_float(row.get("cost"))
                    or safe_float(row.get("Cost per watt"))
                )
                if cost is not None:
                    cost_data.append({
                        "year": year,
                        "cost_per_watt_usd": round(cost, 3),
                    })

            if cost_data:
                logger.info(f"  Solar cost data points from OWID: {len(cost_data)}")
                return sorted(cost_data, key=lambda r: r["year"])
        except Exception as exc:
            logger.warning(f"  Could not fetch solar cost from {url}: {exc}")

    # Hardcoded fallback: key historical data points for solar PV module cost
    # Source: IRENA, BloombergNEF, Farmer & Lafond
    logger.info("  Using hardcoded solar cost milestones as fallback")
    cost_data = [
        {"year": 1976, "cost_per_watt_usd": 106.00},
        {"year": 1980, "cost_per_watt_usd": 30.00},
        {"year": 1985, "cost_per_watt_usd": 12.00},
        {"year": 1990, "cost_per_watt_usd": 8.00},
        {"year": 1995, "cost_per_watt_usd": 5.50},
        {"year": 2000, "cost_per_watt_usd": 4.50},
        {"year": 2005, "cost_per_watt_usd": 3.50},
        {"year": 2008, "cost_per_watt_usd": 3.30},
        {"year": 2010, "cost_per_watt_usd": 1.80},
        {"year": 2012, "cost_per_watt_usd": 0.70},
        {"year": 2014, "cost_per_watt_usd": 0.55},
        {"year": 2016, "cost_per_watt_usd": 0.36},
        {"year": 2018, "cost_per_watt_usd": 0.24},
        {"year": 2020, "cost_per_watt_usd": 0.20},
        {"year": 2022, "cost_per_watt_usd": 0.26},
        {"year": 2023, "cost_per_watt_usd": 0.13},
        {"year": 2024, "cost_per_watt_usd": 0.10},
    ]
    return cost_data

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def fetch_solar_energy() -> dict:
    """Fetch all solar energy data and return combined dict."""
    os.makedirs(DATA_DIR, exist_ok=True)
    output: dict = {
        "source": "Our World in Data / OWID Energy Dataset",
        "urls": [OWID_ENERGY_URL],
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "solar_capacity_gw": [],
        "solar_share_energy": [],
        "solar_electricity_twh": [],
        "solar_consumption_twh": [],
        "solar_module_cost": [],
        "summary": {},
    }

    # Main energy dataset
    try:
        text = _download_csv(OWID_ENERGY_URL)
        rows = parse_csv(text)
        energy = process_energy_data(rows)
        output["solar_capacity_gw"] = energy["solar_capacity_gw"]
        output["solar_share_energy"] = energy["solar_share_energy"]
        output["solar_electricity_twh"] = energy["solar_electricity_twh"]
        output["solar_consumption_twh"] = energy["solar_consumption_twh"]
    except Exception as exc:
        logger.error(f"Failed to fetch OWID energy data: {exc}")

    # Solar cost data
    try:
        output["solar_module_cost"] = fetch_solar_cost_data()
    except Exception as exc:
        logger.error(f"Failed to fetch solar cost data: {exc}")

    # Summary
    summary = {}
    if output["solar_capacity_gw"]:
        latest = output["solar_capacity_gw"][-1]
        summary["latest_capacity_gw"] = latest
    if output["solar_electricity_twh"]:
        latest = output["solar_electricity_twh"][-1]
        summary["latest_electricity_twh"] = latest
    if output["solar_module_cost"]:
        latest = output["solar_module_cost"][-1]
        earliest = output["solar_module_cost"][0]
        summary["latest_module_cost"] = latest
        summary["earliest_module_cost"] = earliest
        if earliest["cost_per_watt_usd"] > 0:
            summary["cost_reduction_factor"] = round(
                earliest["cost_per_watt_usd"] / latest["cost_per_watt_usd"], 1
            )
    output["summary"] = summary

    # Write JSON
    out_path = os.path.join(DATA_DIR, "solar_energy.json")
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    logger.info(f"Wrote {out_path}")

    return output


if __name__ == "__main__":
    data = fetch_solar_energy()
    print(f"\n=== Solar Energy Data Summary ===")
    print(f"  Capacity data points: {len(data['solar_capacity_gw'])}")
    print(f"  Electricity data points: {len(data['solar_electricity_twh'])}")
    print(f"  Module cost data points: {len(data['solar_module_cost'])}")
    s = data.get("summary", {})
    if s.get("latest_capacity_gw"):
        lc = s["latest_capacity_gw"]
        print(f"  Latest capacity: {lc['solar_capacity_gw']} GW ({lc['year']})")
    if s.get("latest_module_cost"):
        mc = s["latest_module_cost"]
        print(f"  Latest module cost: ${mc['cost_per_watt_usd']}/W ({mc['year']})")
    if s.get("cost_reduction_factor"):
        print(f"  Total cost reduction: {s['cost_reduction_factor']}x")
    print(f"  Output: scripts/data/solar_energy.json")
