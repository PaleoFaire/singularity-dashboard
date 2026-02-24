#!/usr/bin/env python3
"""
fetch_sec_capex.py - Pull datacenter capex from SEC EDGAR XBRL API.

Fetches CapEx data (PaymentsToAcquirePropertyPlantAndEquipment) for
major cloud/AI companies: Microsoft, Alphabet, Amazon, Meta.
Outputs JSON to scripts/data/sec_capex.json.

IMPORTANT: SEC EDGAR requires a User-Agent header with your name and email.
"""

import json
import logging
import os
import sys
import time
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")

try:
    import requests
except ImportError:
    logger.error("The 'requests' library is required. Install with: pip3 install requests")
    sys.exit(1)

# SEC EDGAR API base
EDGAR_COMPANY_FACTS_URL = "https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"

# Company CIK numbers (zero-padded to 10 digits)
COMPANIES = {
    "Microsoft": "0000789019",
    "Alphabet": "0001652044",
    "Amazon": "0001018724",
    "Meta": "0001326801",
}

# SEC requires a proper User-Agent with name + email
SEC_USER_AGENT = "SingularityDashboard/1.0 (data-collection; singularity-dashboard@example.com)"

# XBRL concept for CapEx
CAPEX_CONCEPT = "PaymentsToAcquirePropertyPlantAndEquipment"
# Alternative concepts that some companies use
ALT_CAPEX_CONCEPTS = [
    "PaymentsToAcquirePropertyPlantAndEquipment",
    "PaymentsForCapitalImprovements",
    "PurchaseOfPropertyPlantAndEquipment",
    "CapitalExpenditures",
]

# Rate limit: SEC asks for max 10 requests per second
REQUEST_DELAY = 0.15  # seconds between requests

# ---------------------------------------------------------------------------
# Fetching
# ---------------------------------------------------------------------------

def fetch_company_facts(cik: str) -> dict | None:
    """Fetch company facts from SEC EDGAR XBRL API."""
    url = EDGAR_COMPANY_FACTS_URL.format(cik=cik)
    headers = {
        "User-Agent": SEC_USER_AGENT,
        "Accept": "application/json",
    }
    logger.info(f"  Fetching {url} ...")
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.HTTPError as exc:
        logger.error(f"  HTTP error: {exc}")
        return None
    except Exception as exc:
        logger.error(f"  Error fetching {url}: {exc}")
        return None


def extract_capex(facts: dict, company_name: str) -> list[dict]:
    """Extract CapEx quarterly data from EDGAR company facts.

    The structure is:
      facts -> us-gaap -> ConceptName -> units -> USD -> [...]
    Each entry has: end, val, accn, fy, fp, form, filed, frame
    """
    us_gaap = facts.get("facts", {}).get("us-gaap", {})
    if not us_gaap:
        logger.warning(f"  No us-gaap data for {company_name}")
        return []

    capex_entries = []

    for concept in ALT_CAPEX_CONCEPTS:
        concept_data = us_gaap.get(concept, {})
        units = concept_data.get("units", {})
        usd_entries = units.get("USD", [])
        if usd_entries:
            logger.info(f"  Found {len(usd_entries)} entries under {concept}")
            capex_entries = usd_entries
            break

    if not capex_entries:
        logger.warning(f"  No CapEx data found for {company_name}")
        return []

    # Filter to quarterly (10-Q) and annual (10-K) filings
    results = []
    seen = set()

    for entry in capex_entries:
        form = entry.get("form", "")
        if form not in ("10-K", "10-Q", "10-K/A", "10-Q/A"):
            continue

        end_date = entry.get("end", "")
        val = entry.get("val")
        fy = entry.get("fy")
        fp = entry.get("fp", "")  # FY, Q1, Q2, Q3, Q4
        frame = entry.get("frame", "")

        if val is None:
            continue

        # Deduplicate by (end_date, fp) — amendments can cause duplicates
        key = (end_date, fp)
        if key in seen:
            continue
        seen.add(key)

        # Parse the period
        year = None
        quarter = None
        if fy:
            year = int(fy)
        if fp:
            if fp == "FY":
                quarter = "FY"
            elif fp.startswith("Q"):
                quarter = fp

        results.append({
            "end_date": end_date,
            "fiscal_year": year,
            "fiscal_period": fp,
            "form": form,
            "capex_usd": val,
            "capex_usd_billions": round(val / 1e9, 2) if val else None,
            "frame": frame,
        })

    # Sort by end date
    results.sort(key=lambda r: r["end_date"])
    logger.info(f"  Extracted {len(results)} CapEx data points for {company_name}")
    return results


def build_quarterly_series(entries: list[dict]) -> list[dict]:
    """Filter to quarterly entries only (exclude FY aggregates)."""
    quarterly = []
    for e in entries:
        fp = e.get("fiscal_period", "")
        if fp in ("Q1", "Q2", "Q3", "Q4"):
            quarterly.append(e)
    return quarterly


def build_annual_series(entries: list[dict]) -> list[dict]:
    """Extract annual CapEx (FY entries or sum of quarters)."""
    # First try FY entries directly
    fy_entries = [e for e in entries if e.get("fiscal_period") == "FY"]
    if fy_entries:
        return fy_entries

    # Otherwise sum quarters by fiscal year
    by_year: dict[int, float] = {}
    quarter_count: dict[int, int] = {}
    for e in entries:
        fp = e.get("fiscal_period", "")
        fy = e.get("fiscal_year")
        if fp in ("Q1", "Q2", "Q3", "Q4") and fy:
            by_year[fy] = by_year.get(fy, 0) + (e.get("capex_usd", 0) or 0)
            quarter_count[fy] = quarter_count.get(fy, 0) + 1

    results = []
    for y in sorted(by_year):
        if quarter_count.get(y, 0) == 4:
            results.append({
                "fiscal_year": y,
                "fiscal_period": "FY",
                "capex_usd": by_year[y],
                "capex_usd_billions": round(by_year[y] / 1e9, 2),
                "note": "sum_of_quarters",
            })
    return results

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def fetch_sec_capex() -> dict:
    """Fetch SEC EDGAR capex data for all companies."""
    os.makedirs(DATA_DIR, exist_ok=True)
    output: dict = {
        "source": "SEC EDGAR XBRL API",
        "concept": CAPEX_CONCEPT,
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "companies": {},
        "summary": {},
    }

    for company_name, cik in COMPANIES.items():
        logger.info(f"Fetching {company_name} (CIK: {cik}) ...")
        facts = fetch_company_facts(cik)
        if not facts:
            output["companies"][company_name] = {"error": "Failed to fetch data", "cik": cik}
            time.sleep(REQUEST_DELAY)
            continue

        all_entries = extract_capex(facts, company_name)
        quarterly = build_quarterly_series(all_entries)
        annual = build_annual_series(all_entries)

        company_data = {
            "cik": cik,
            "entity_name": facts.get("entityName", company_name),
            "all_filings": all_entries,
            "quarterly": quarterly,
            "annual": annual,
        }

        # Latest quarterly CapEx
        if quarterly:
            latest_q = quarterly[-1]
            company_data["latest_quarterly"] = latest_q
        if annual:
            latest_a = annual[-1]
            company_data["latest_annual"] = latest_a

        output["companies"][company_name] = company_data
        time.sleep(REQUEST_DELAY)

    # Build summary: total capex by year across all companies
    annual_totals: dict[int, float] = {}
    for company_name, cdata in output["companies"].items():
        if "error" in cdata:
            continue
        for a in cdata.get("annual", []):
            fy = a.get("fiscal_year")
            val = a.get("capex_usd", 0)
            if fy and val:
                annual_totals[fy] = annual_totals.get(fy, 0) + val

    output["summary"]["combined_annual_capex"] = [
        {"year": y, "total_capex_usd": annual_totals[y], "total_capex_usd_billions": round(annual_totals[y] / 1e9, 2)}
        for y in sorted(annual_totals)
    ]

    # Latest quarter for each company
    latest_quarters = {}
    for company_name, cdata in output["companies"].items():
        if "error" in cdata:
            continue
        lq = cdata.get("latest_quarterly")
        if lq:
            latest_quarters[company_name] = {
                "period": f"{lq.get('fiscal_year')} {lq.get('fiscal_period')}",
                "capex_usd_billions": lq.get("capex_usd_billions"),
            }
    output["summary"]["latest_quarterly_by_company"] = latest_quarters

    # Write JSON
    out_path = os.path.join(DATA_DIR, "sec_capex.json")
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    logger.info(f"Wrote {out_path}")

    return output


if __name__ == "__main__":
    data = fetch_sec_capex()
    print(f"\n=== SEC CapEx Data Summary ===")
    for company, cdata in data["companies"].items():
        if "error" in cdata:
            print(f"  {company}: ERROR - {cdata['error']}")
        else:
            n_q = len(cdata.get("quarterly", []))
            n_a = len(cdata.get("annual", []))
            lq = cdata.get("latest_quarterly", {})
            print(f"  {company}: {n_q} quarters, {n_a} annual | Latest Q: ${lq.get('capex_usd_billions', '?')}B")
    if data["summary"].get("combined_annual_capex"):
        latest = data["summary"]["combined_annual_capex"][-1]
        print(f"  Combined latest annual: ${latest['total_capex_usd_billions']}B ({latest['year']})")
    print(f"  Output: scripts/data/sec_capex.json")
