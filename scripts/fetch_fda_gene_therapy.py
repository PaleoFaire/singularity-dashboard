#!/usr/bin/env python3
"""
fetch_fda_gene_therapy.py - Pull gene therapy approval data from openFDA and FDA.

Queries the openFDA Drug API for gene/cell therapy approvals.
Also includes a curated list of FDA-approved gene therapies as backup.
Counts approved gene/cell therapies by year.
Outputs JSON to scripts/data/fda_gene_therapy.json.
"""

import json
import logging
import os
import re
import sys
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

# openFDA endpoints
OPENFDA_DRUGS_URL = "https://api.fda.gov/drug/drugsfda.json"

# Gene therapy search terms for openFDA
GENE_THERAPY_SEARCH_TERMS = [
    "gene+therapy",
    "cell+therapy",
    "CAR-T",
    "gene+transfer",
    "viral+vector",
    "AAV",
    "lentiviral",
]

# Curated list of FDA-approved gene and cell therapies
# This serves as ground truth / fallback data
# Sources: FDA CBER, various public databases
CURATED_GENE_THERAPIES = [
    {
        "name": "Kymriah (tisagenlecleucel)",
        "company": "Novartis",
        "approval_date": "2017-08-30",
        "type": "CAR-T cell therapy",
        "indication": "B-cell ALL",
    },
    {
        "name": "Yescarta (axicabtagene ciloleucel)",
        "company": "Kite/Gilead",
        "approval_date": "2017-10-18",
        "type": "CAR-T cell therapy",
        "indication": "Large B-cell lymphoma",
    },
    {
        "name": "Luxturna (voretigene neparvovec)",
        "company": "Spark Therapeutics",
        "approval_date": "2017-12-19",
        "type": "AAV gene therapy",
        "indication": "Inherited retinal dystrophy",
    },
    {
        "name": "Tecartus (brexucabtagene autoleucel)",
        "company": "Kite/Gilead",
        "approval_date": "2020-07-24",
        "type": "CAR-T cell therapy",
        "indication": "Mantle cell lymphoma",
    },
    {
        "name": "Breyanzi (lisocabtagene maraleucel)",
        "company": "Bristol Myers Squibb",
        "approval_date": "2021-02-05",
        "type": "CAR-T cell therapy",
        "indication": "Large B-cell lymphoma",
    },
    {
        "name": "Abecma (idecabtagene vicleucel)",
        "company": "Bristol Myers Squibb",
        "approval_date": "2021-03-26",
        "type": "CAR-T cell therapy",
        "indication": "Multiple myeloma",
    },
    {
        "name": "Zynteglo (betibeglogene autotemcel)",
        "company": "bluebird bio",
        "approval_date": "2022-08-17",
        "type": "Gene therapy (lentiviral)",
        "indication": "Beta-thalassemia",
    },
    {
        "name": "Skysona (elivaldogene autotemcel)",
        "company": "bluebird bio",
        "approval_date": "2022-09-16",
        "type": "Gene therapy (lentiviral)",
        "indication": "Cerebral adrenoleukodystrophy",
    },
    {
        "name": "Adstiladrin (nadofaragene firadenovec)",
        "company": "Ferring",
        "approval_date": "2022-12-16",
        "type": "Gene therapy (adenoviral)",
        "indication": "Bladder cancer",
    },
    {
        "name": "Carvykti (ciltacabtagene autoleucel)",
        "company": "Janssen/Legend Biotech",
        "approval_date": "2022-02-28",
        "type": "CAR-T cell therapy",
        "indication": "Multiple myeloma",
    },
    {
        "name": "Hemgenix (etranacogene dezaparvovec)",
        "company": "CSL Behring",
        "approval_date": "2022-11-22",
        "type": "AAV gene therapy",
        "indication": "Hemophilia B",
    },
    {
        "name": "Elevidys (delandistrogene moxeparvovec)",
        "company": "Sarepta Therapeutics",
        "approval_date": "2023-06-22",
        "type": "AAV gene therapy",
        "indication": "Duchenne muscular dystrophy",
    },
    {
        "name": "Roctavian (valoctocogene roxaparvovec)",
        "company": "BioMarin",
        "approval_date": "2023-06-29",
        "type": "AAV gene therapy",
        "indication": "Hemophilia A",
    },
    {
        "name": "Casgevy (exagamglogene autotemcel)",
        "company": "Vertex/CRISPR Therapeutics",
        "approval_date": "2023-12-08",
        "type": "CRISPR gene-edited cell therapy",
        "indication": "Sickle cell disease",
    },
    {
        "name": "Lyfgenia (lovotibeglogene autotemcel)",
        "company": "bluebird bio",
        "approval_date": "2023-12-08",
        "type": "Gene therapy (lentiviral)",
        "indication": "Sickle cell disease",
    },
    {
        "name": "Lantidra (donislecel)",
        "company": "CellTrans",
        "approval_date": "2023-06-28",
        "type": "Allogeneic cell therapy",
        "indication": "Type 1 diabetes",
    },
    {
        "name": "Omisirge (omidubicel)",
        "company": "Gamida Cell",
        "approval_date": "2023-04-17",
        "type": "Cell therapy",
        "indication": "Hematopoietic stem cell transplant",
    },
    {
        "name": "Vyjuvek (beremagene geperpavec)",
        "company": "Krystal Biotech",
        "approval_date": "2023-05-19",
        "type": "Gene therapy (HSV-1 vector)",
        "indication": "Dystrophic epidermolysis bullosa",
    },
    {
        "name": "Amtagvi (lifileucel)",
        "company": "Iovance",
        "approval_date": "2024-02-16",
        "type": "TIL cell therapy",
        "indication": "Melanoma",
    },
    {
        "name": "Tecelra (afamitresgene autoleucel)",
        "company": "Adaptimmune",
        "approval_date": "2024-08-02",
        "type": "TCR-T cell therapy",
        "indication": "Synovial sarcoma",
    },
]

# ---------------------------------------------------------------------------
# openFDA queries
# ---------------------------------------------------------------------------

def query_openfda(search_term: str, limit: int = 100) -> list[dict]:
    """Query openFDA Drug API for a search term."""
    params = {
        "search": f'openfda.pharm_class_epc:"{search_term}" OR products.brand_name:"{search_term}"',
        "limit": limit,
    }
    try:
        resp = requests.get(OPENFDA_DRUGS_URL, params=params, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            return data.get("results", [])
        else:
            logger.warning(f"  openFDA returned {resp.status_code} for '{search_term}'")
            return []
    except Exception as exc:
        logger.warning(f"  openFDA query failed for '{search_term}': {exc}")
        return []


def search_openfda_gene_therapy() -> list[dict]:
    """Search openFDA for gene therapy products using multiple queries."""
    all_results = []
    seen_app_numbers = set()

    # Try different search strategies
    search_queries = [
        'products.brand_name:"gene"',
        'openfda.pharm_class_epc:"gene+therapy"',
        'submissions.submission_type:"BLA"',
    ]

    for query in search_queries:
        try:
            params = {"search": query, "limit": 100}
            logger.info(f"  Querying openFDA: {query}")
            resp = requests.get(OPENFDA_DRUGS_URL, params=params, timeout=30)
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("results", [])
                logger.info(f"    -> {len(results)} results")
                for r in results:
                    app_no = r.get("application_number", "")
                    if app_no and app_no not in seen_app_numbers:
                        seen_app_numbers.add(app_no)
                        all_results.append(r)
            else:
                logger.warning(f"    HTTP {resp.status_code}")
        except Exception as exc:
            logger.warning(f"    Failed: {exc}")

    logger.info(f"  Total unique openFDA results: {len(all_results)}")
    return all_results


def extract_openfda_approvals(results: list[dict]) -> list[dict]:
    """Extract approval information from openFDA results."""
    approvals = []
    for r in results:
        app_no = r.get("application_number", "")
        sponsor = r.get("sponsor_name", "")

        products = r.get("products", [])
        brand_names = []
        for p in products:
            bn = p.get("brand_name", "")
            if bn:
                brand_names.append(bn)

        submissions = r.get("submissions", [])
        for s in submissions:
            sub_type = s.get("submission_type", "")
            sub_status = s.get("submission_status", "")
            sub_date = s.get("submission_status_date", "")

            if sub_status.upper() == "AP" and sub_date:
                approvals.append({
                    "application_number": app_no,
                    "brand_names": brand_names,
                    "sponsor": sponsor,
                    "submission_type": sub_type,
                    "approval_date": sub_date,
                })

    return approvals

# ---------------------------------------------------------------------------
# Processing
# ---------------------------------------------------------------------------

def build_curated_data() -> dict:
    """Process the curated list of gene therapies."""
    by_year: dict[int, int] = {}
    by_type: dict[str, int] = {}
    therapies = []

    for therapy in CURATED_GENE_THERAPIES:
        date_str = therapy["approval_date"]
        year = int(date_str[:4])
        therapy_type = therapy["type"]

        by_year[year] = by_year.get(year, 0) + 1
        by_type[therapy_type] = by_type.get(therapy_type, 0) + 1

        therapies.append({
            "name": therapy["name"],
            "company": therapy["company"],
            "approval_date": therapy["approval_date"],
            "year": year,
            "type": therapy["type"],
            "indication": therapy["indication"],
        })

    # Build cumulative count
    cumulative = []
    total = 0
    for year in sorted(by_year):
        total += by_year[year]
        cumulative.append({"year": year, "new_approvals": by_year[year], "cumulative": total})

    return {
        "therapies": sorted(therapies, key=lambda t: t["approval_date"]),
        "by_year": cumulative,
        "by_type": dict(sorted(by_type.items(), key=lambda x: -x[1])),
        "total_approved": len(therapies),
    }

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def fetch_fda_gene_therapy() -> dict:
    """Fetch gene therapy approval data."""
    os.makedirs(DATA_DIR, exist_ok=True)
    output: dict = {
        "source": "FDA / openFDA / Curated data",
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "curated": {},
        "openfda_results": [],
        "summary": {},
    }

    # Curated data (always available)
    try:
        output["curated"] = build_curated_data()
        logger.info(f"Curated gene therapies: {output['curated']['total_approved']}")
    except Exception as exc:
        logger.error(f"Failed to process curated data: {exc}")

    # openFDA query
    try:
        logger.info("Querying openFDA for gene therapy data ...")
        fda_results = search_openfda_gene_therapy()
        approvals = extract_openfda_approvals(fda_results)
        output["openfda_results"] = approvals
        logger.info(f"openFDA approvals found: {len(approvals)}")
    except Exception as exc:
        logger.error(f"openFDA query failed: {exc}")

    # Summary
    curated = output.get("curated", {})
    output["summary"] = {
        "total_curated_approvals": curated.get("total_approved", 0),
        "approvals_by_year": curated.get("by_year", []),
        "approvals_by_type": curated.get("by_type", {}),
        "latest_approval": curated.get("therapies", [{}])[-1] if curated.get("therapies") else None,
        "openfda_results_count": len(output.get("openfda_results", [])),
    }

    # Write JSON
    out_path = os.path.join(DATA_DIR, "fda_gene_therapy.json")
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    logger.info(f"Wrote {out_path}")

    return output


if __name__ == "__main__":
    data = fetch_fda_gene_therapy()
    print(f"\n=== FDA Gene Therapy Data Summary ===")
    s = data.get("summary", {})
    print(f"  Total curated approvals: {s.get('total_curated_approvals', 0)}")
    print(f"  openFDA results: {s.get('openfda_results_count', 0)}")
    if s.get("approvals_by_year"):
        for entry in s["approvals_by_year"]:
            print(f"    {entry['year']}: {entry['new_approvals']} new (cumulative: {entry['cumulative']})")
    if s.get("latest_approval"):
        la = s["latest_approval"]
        print(f"  Latest: {la.get('name', 'N/A')} ({la.get('approval_date', 'N/A')})")
    if s.get("approvals_by_type"):
        print(f"  By type:")
        for t, c in s["approvals_by_type"].items():
            print(f"    {t}: {c}")
    print(f"  Output: scripts/data/fda_gene_therapy.json")
