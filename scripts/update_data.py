#!/usr/bin/env python3
"""
update_data.py - Master orchestrator for Singularity Dashboard data.

Strategy:
  1. Run all fetch scripts → JSON files in scripts/data/
  2. Read those JSON files
  3. Read the existing data.js (which has rich hand-crafted content)
  4. MERGE fresh data into specific fields of data.js (sparklines, keyMetric,
     progressPercent, currentValue, dataTable updates, lastPull dates)
  5. Also write supplementary raw-data consts (LIVE_DATA) at the bottom
     of data.js for future charting features
  6. Update LAST_UPDATED timestamp

This preserves all hand-written descriptions, milestones, innovators, etc.

Usage:
    python3 scripts/update_data.py              # Full: fetch + merge
    python3 scripts/update_data.py --fetch-only  # Fetch only (don't touch data.js)
    python3 scripts/update_data.py --merge-only  # Merge existing JSON into data.js
"""

import argparse
import importlib
import json
import logging
import math
import os
import re
import sys
import traceback
from datetime import datetime, timezone

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_JS_PATH = os.path.join(PROJECT_DIR, "data.js")

# Fetcher definitions
FETCHERS = [
    {"name": "Epoch AI",        "module": "fetch_epoch_ai",        "function": "fetch_epoch_ai",        "json_file": "epoch_ai.json"},
    {"name": "Satellites",      "module": "fetch_satellites",      "function": "fetch_satellites",      "json_file": "satellites.json"},
    {"name": "Solar Energy",    "module": "fetch_solar_energy",    "function": "fetch_solar_energy",    "json_file": "solar_energy.json"},
    {"name": "SEC CapEx",       "module": "fetch_sec_capex",       "function": "fetch_sec_capex",       "json_file": "sec_capex.json"},
    {"name": "Transistors",     "module": "fetch_transistors",     "function": "fetch_transistors",     "json_file": "transistors.json"},
    {"name": "FDA Gene Therapy","module": "fetch_fda_gene_therapy","function": "fetch_fda_gene_therapy","json_file": "fda_gene_therapy.json"},
    {"name": "AI Pricing",      "module": "fetch_ai_pricing",      "function": "fetch_ai_pricing",      "json_file": "ai_pricing.json"},
]

# ─── Fetch phase ────────────────────────────────────────────

def run_all_fetchers() -> dict:
    results = {}
    for f in FETCHERS:
        logger.info(f"\n{'='*50}\nFETCHING: {f['name']}\n{'='*50}")
        try:
            sys.path.insert(0, SCRIPT_DIR)
            mod = importlib.import_module(f["module"])
            func = getattr(mod, f["function"])
            data = func()
            results[f["json_file"]] = data
            logger.info(f"  -> OK: {f['name']}")
        except Exception as exc:
            logger.error(f"  -> FAILED: {f['name']}\n{traceback.format_exc()}")
            results[f["json_file"]] = {"error": str(exc)}
    return results


def load_json_files() -> dict:
    results = {}
    for f in FETCHERS:
        path = os.path.join(DATA_DIR, f["json_file"])
        if os.path.exists(path):
            try:
                with open(path) as fh:
                    results[f["json_file"]] = json.load(fh)
                logger.info(f"  Loaded {f['json_file']}")
            except Exception as exc:
                logger.error(f"  Error loading {f['json_file']}: {exc}")
        else:
            logger.warning(f"  Missing: {f['json_file']}")
    return results


# ─── Helpers ────────────────────────────────────────────────

def fmt_number(n, precision=1):
    """Format a number with appropriate suffix."""
    if n >= 1e12:
        return f"${n/1e12:.{precision}f}T" if n >= 0 else f"{n/1e12:.{precision}f}T"
    if n >= 1e9:
        return f"${n/1e9:.{precision}f}B"
    if n >= 1e6:
        return f"${n/1e6:.{precision}f}M"
    if n >= 1e3:
        return f"${n/1e3:.{precision}f}K"
    return f"${n:.2f}"


def safe_pct_change(old, new):
    """Calculate percentage change, handling zero/None."""
    if not old or not new:
        return ""
    change = ((new - old) / abs(old)) * 100
    sign = "+" if change >= 0 else ""
    return f"{sign}{change:.0f}%"


def make_sparkline(data_points, n=11):
    """Create a normalized sparkline array of length n from data points."""
    if not data_points or len(data_points) < 2:
        return None
    # Take last n points if more available, or all if fewer
    pts = data_points[-n:] if len(data_points) >= n else data_points
    vals = [p if isinstance(p, (int, float)) else 0 for p in pts]
    if not vals:
        return None
    max_v = max(vals) or 1
    min_v = min(vals)
    rng = max_v - min_v or 1
    return [round(((v - min_v) / rng) * 100, 1) for v in vals]


# ─── JS field replacement ──────────────────────────────────

def replace_js_field(js_text, tech_id, field_name, new_value):
    """Replace a specific field value inside a technology object in data.js.

    Handles fields like:
      currentValue: "14.5 hrs",
      progressPercent: 72,
      keyMetric: { label: "...", value: "...", change: "..." },
      sparkline: [1, 2, 3, ...],
      lastPull: "2026-02-24"
    """
    # First, find the technology block by its id
    id_pattern = rf'id:\s*"{re.escape(tech_id)}"'
    id_match = re.search(id_pattern, js_text)
    if not id_match:
        logger.warning(f"  Tech '{tech_id}' not found in data.js")
        return js_text

    # Find the start/end of this tech object (from { before id to },\n\n// next)
    # We work within the tech block to avoid replacing fields in other techs
    block_start = js_text.rfind('{', 0, id_match.start())
    # Find the closing of this object — look for },\n at proper nesting depth
    depth = 0
    block_end = block_start
    for i in range(block_start, len(js_text)):
        if js_text[i] == '{':
            depth += 1
        elif js_text[i] == '}':
            depth -= 1
            if depth == 0:
                block_end = i + 1
                break

    block = js_text[block_start:block_end]

    # Now replace the field within this block
    new_block = _replace_field_in_block(block, field_name, new_value)

    if new_block != block:
        js_text = js_text[:block_start] + new_block + js_text[block_end:]
        logger.info(f"    Updated {tech_id}.{field_name}")

    return js_text


def _replace_field_in_block(block, field_name, new_value):
    """Replace a field's value inside a JS object block."""
    if field_name == "sparkline":
        # sparkline: [1, 2, 3, ...]
        pattern = r'(sparkline:\s*)\[.*?\]'
        replacement = f'\\1{json.dumps(new_value)}'
        return re.sub(pattern, replacement, block, count=1, flags=re.DOTALL)

    elif field_name == "keyMetric":
        # keyMetric: { label: "...", value: "...", change: "..." }
        pattern = r'(keyMetric:\s*\{)[^}]+(})'
        label = new_value.get("label", "")
        value = new_value.get("value", "")
        change = new_value.get("change", "")
        inner = f' label: "{label}", value: "{value}", change: "{change}" '
        replacement = f'\\1{inner}\\2'
        return re.sub(pattern, replacement, block, count=1)

    elif field_name == "lastPull":
        # Inside dataSource object
        pattern = r'(lastPull:\s*")[^"]*(")'
        replacement = f'\\g<1>{new_value}\\2'
        return re.sub(pattern, replacement, block, count=1)

    elif field_name in ("currentValue", "targetValue", "startValue"):
        # String fields: currentValue: "14.5 hrs",
        pattern = rf'({re.escape(field_name)}:\s*")[^"]*(")'
        replacement = f'\\g<1>{new_value}\\2'
        return re.sub(pattern, replacement, block, count=1)

    elif field_name in ("progressPercent", "acceleration", "currentYear"):
        # Numeric fields: progressPercent: 72,
        pattern = rf'({re.escape(field_name)}:\s*)\d+(\s*[,\n])'
        replacement = f'\\g<1>{new_value}\\2'
        return re.sub(pattern, replacement, block, count=1)

    else:
        logger.warning(f"  Unknown field type: {field_name}")
        return block


# ─── Technology-specific merge logic ────────────────────────

def merge_ai_compute(js_text, epoch_data):
    """Update 'ai-compute' (Frontier AI Training Compute) from Epoch AI data."""
    tech_id = "ai-compute"
    summary = epoch_data.get("summary", {})
    largest = summary.get("largest_training_run", {})

    if not largest:
        return js_text

    flop = largest.get("flop", 0)
    flop_log = largest.get("flop_log10", 0)
    model_name = largest.get("name", "Unknown")
    year = largest.get("year", 2025)

    if flop > 0:
        # Update currentValue
        flop_str = f"{flop:.0e} FLOP"
        js_text = replace_js_field(js_text, tech_id, "currentValue", flop_str)
        js_text = replace_js_field(js_text, tech_id, "currentYear", year)

        # Build sparkline from frontier compute by year (log10 values, recent years)
        frontier_by_year = summary.get("frontier_compute_by_year", [])
        # Filter to post-2010 for meaningful sparkline
        recent = [d for d in frontier_by_year if d.get("year", 0) >= 2012]
        if recent:
            log_vals = [d.get("max_flop_log10", 0) for d in recent]
            spark = make_sparkline(log_vals)
            if spark:
                js_text = replace_js_field(js_text, tech_id, "sparkline", spark)

        # Update key metric
        js_text = replace_js_field(js_text, tech_id, "keyMetric", {
            "label": "Largest Run",
            "value": f"10^{flop_log:.0f} FLOP",
            "change": f"{model_name} ({year})"
        })

        js_text = replace_js_field(js_text, tech_id, "lastPull", _today())

    return js_text


def merge_ai_pricing(js_text, pricing_data):
    """Update 'ai-cost' (AI Inference Cost) from pricing data."""
    tech_id = "ai-cost"
    history = pricing_data.get("pricing_history", [])
    trends = pricing_data.get("trends", {})

    if not history:
        return js_text

    # Find cheapest current frontier input price
    cheapest_timeline = trends.get("cheapest_option_timeline", [])
    if cheapest_timeline:
        latest = cheapest_timeline[-1]
        price = latest.get("input_per_mtok", 0)
        if price > 0:
            js_text = replace_js_field(js_text, tech_id, "currentValue", f"${price:.2f}")
            js_text = replace_js_field(js_text, tech_id, "keyMetric", {
                "label": "Cost/1M tokens",
                "value": f"${price:.2f}",
                "change": f"{trends.get('frontier_price_decline', {}).get('decline_factor', 0):.0f}x cheaper since 2020"
            })

        # Sparkline from cheapest option timeline
        prices = [d.get("input_per_mtok", 0) for d in cheapest_timeline]
        if prices:
            # Invert (lower is better) — use max - val for visual
            max_p = max(prices) or 1
            inverted = [max_p - p for p in prices]
            spark = make_sparkline(inverted)
            if spark:
                js_text = replace_js_field(js_text, tech_id, "sparkline", spark)

    js_text = replace_js_field(js_text, tech_id, "lastPull", _today())
    return js_text


def merge_satellites(js_text, sat_data):
    """Update 'objects-orbit' from CelesTrak data."""
    tech_id = "objects-orbit"
    celestrak = sat_data.get("celestrak", {})
    cumulative = sat_data.get("cumulative_active_satellites", [])

    if not celestrak:
        return js_text

    active = celestrak.get("active_satellites", 0)
    total_objects = celestrak.get("total_objects", 0)

    if active > 0:
        js_text = replace_js_field(js_text, tech_id, "currentValue", f"{active:,}")
        js_text = replace_js_field(js_text, tech_id, "keyMetric", {
            "label": "Active Satellites",
            "value": f"{active:,}",
            "change": f"{total_objects:,} total objects tracked"
        })

        # Sparkline from cumulative active (recent years)
        if cumulative:
            recent = [d for d in cumulative if d.get("year", 0) >= 2010]
            vals = [d.get("cumulative_active", 0) for d in recent]
            spark = make_sparkline(vals)
            if spark:
                js_text = replace_js_field(js_text, tech_id, "sparkline", spark)

    js_text = replace_js_field(js_text, tech_id, "lastPull", _today())
    return js_text


def merge_solar_energy(js_text, solar_data):
    """Update 'solar-cost' and 'solar-deploy' from OWID data."""

    # Solar Cost
    cost_data = solar_data.get("solar_module_cost", [])
    if cost_data:
        latest_cost = cost_data[-1]
        cost = latest_cost.get("cost_per_watt_usd", 0)
        if cost > 0:
            js_text = replace_js_field(js_text, "solar-cost", "currentValue", f"${cost:.2f}/W")
            js_text = replace_js_field(js_text, "solar-cost", "keyMetric", {
                "label": "Module Cost",
                "value": f"${cost:.2f}/W",
                "change": f"-99.7% since 1976"
            })
            # Sparkline (inverted — lower cost = more progress)
            costs = [d.get("cost_per_watt_usd", 0) for d in cost_data]
            max_c = max(costs) or 1
            inverted = [max_c - c for c in costs]
            spark = make_sparkline(inverted)
            if spark:
                js_text = replace_js_field(js_text, "solar-cost", "sparkline", spark)

        js_text = replace_js_field(js_text, "solar-cost", "lastPull", _today())

    # Solar Deployments
    elec_data = solar_data.get("solar_electricity_twh", [])
    if elec_data:
        latest = elec_data[-1]
        twh = latest.get("solar_electricity_twh", 0)
        if twh > 0:
            js_text = replace_js_field(js_text, "solar-deploy", "currentValue", f"{twh:,.0f} TWh")
            js_text = replace_js_field(js_text, "solar-deploy", "keyMetric", {
                "label": "Solar Generation",
                "value": f"{twh:,.0f} TWh",
                "change": f"+{twh/elec_data[-2].get('solar_electricity_twh', 1)*100 - 100:.0f}% YoY" if len(elec_data) >= 2 else ""
            })
            # Sparkline from recent generation
            recent = [d for d in elec_data if d.get("year", 0) >= 2010]
            vals = [d.get("solar_electricity_twh", 0) for d in recent]
            spark = make_sparkline(vals)
            if spark:
                js_text = replace_js_field(js_text, "solar-deploy", "sparkline", spark)

        js_text = replace_js_field(js_text, "solar-deploy", "lastPull", _today())

    return js_text


def merge_sec_capex(js_text, capex_data):
    """Update 'datacenter-power' from SEC EDGAR data."""
    tech_id = "datacenter-power"
    summary = capex_data.get("summary", {})
    combined = summary.get("combined_annual_capex", [])

    if not combined:
        return js_text

    latest = combined[-1] if combined else {}
    capex_b = latest.get("total_capex_usd_billions", 0)
    year = latest.get("year", 2025)

    if capex_b > 0:
        js_text = replace_js_field(js_text, tech_id, "currentValue", f"${capex_b:.0f}B/yr")
        js_text = replace_js_field(js_text, tech_id, "currentYear", year)

        # Latest quarterly breakdown
        latest_q = summary.get("latest_quarterly_by_company", {})
        quarter_detail = []
        for company, info in latest_q.items():
            q_capex = info.get("capex_usd_billions", 0)
            quarter_detail.append(f"{company}: ${q_capex:.0f}B")
        detail_str = ", ".join(quarter_detail[:4])

        js_text = replace_js_field(js_text, tech_id, "keyMetric", {
            "label": "Hyperscaler CapEx",
            "value": f"${capex_b:.0f}B/yr",
            "change": detail_str if detail_str else f"FY{year}"
        })

        # Sparkline from annual combined capex (recent years)
        recent = [d for d in combined if d.get("year", 0) >= 2015]
        vals = [d.get("total_capex_usd_billions", 0) for d in recent]
        spark = make_sparkline(vals)
        if spark:
            js_text = replace_js_field(js_text, tech_id, "sparkline", spark)

    js_text = replace_js_field(js_text, tech_id, "lastPull", _today())
    return js_text


def merge_transistors(js_text, trans_data):
    """Update 'transistor-cost' from Karl Rupp data."""
    tech_id = "transistor-cost"
    transistors = trans_data.get("transistors", [])
    summary = trans_data.get("summary", {})

    if not transistors:
        return js_text

    latest = summary.get("latest", {})
    count = latest.get("transistor_count", 0)
    year = latest.get("year", 0)

    if count > 0:
        # The metric is about cost per million transistors decreasing
        # Latest chip: ~55 billion transistors on a single die
        count_str = f"{count/1e9:.0f}B" if count >= 1e9 else f"{count/1e6:.0f}M"
        js_text = replace_js_field(js_text, tech_id, "keyMetric", {
            "label": "Transistors/chip",
            "value": count_str,
            "change": f"~{summary.get('total_increase_factor', 0):.0f}x since 1971"
        })

        # Sparkline from transistor counts (log scale, recent decades)
        recent = [d for d in transistors if d.get("year", 0) >= 1990]
        vals = [d.get("transistor_count_log10", 0) for d in recent]
        spark = make_sparkline(vals)
        if spark:
            js_text = replace_js_field(js_text, tech_id, "sparkline", spark)

    js_text = replace_js_field(js_text, tech_id, "lastPull", _today())
    return js_text


def merge_gene_therapy(js_text, gene_data):
    """Update 'genome-cost' gene therapy data. Note: this maps to gene therapy approvals."""
    # We actually have two genome/gene metrics. The FDA data goes to gene therapy milestones.
    # The genome-cost tech tracks sequencing cost separately (manual data currently).
    # Let's at least update the gene therapy approval counts if we have a tech for it.
    # For now, just mark lastPull on genome-cost since the FDA data is supplementary.
    curated = gene_data.get("curated", {})
    total = curated.get("total_approved", 0)
    if total > 0:
        logger.info(f"  Gene therapy: {total} total FDA-approved therapies")
        # This data supplements the genome-cost card indirectly
        js_text = replace_js_field(js_text, "genome-cost", "lastPull", _today())
    return js_text


def _today():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


# ─── Build supplementary LIVE_DATA constant ─────────────────

def build_live_data_block(all_data):
    """Build a LIVE_DATA JavaScript constant with raw API data for charts."""
    live = {}

    # Epoch AI — frontier compute timeline
    epoch = all_data.get("epoch_ai.json", {})
    frontier = epoch.get("summary", {}).get("frontier_compute_by_year", [])
    if frontier:
        # Post-2010 only for charting
        live["frontierCompute"] = [d for d in frontier if d.get("year", 0) >= 2010]

    # Satellites — cumulative active
    sat = all_data.get("satellites.json", {})
    cumulative = sat.get("cumulative_active_satellites", [])
    if cumulative:
        live["activeSatellites"] = cumulative

    # Satellite launches by year
    launches = sat.get("celestrak", {}).get("launches_by_year", [])
    if launches:
        live["satelliteLaunches"] = [d for d in launches if d.get("year", 0) >= 2000]

    # Solar
    solar = all_data.get("solar_energy.json", {})
    if solar.get("solar_electricity_twh"):
        live["solarElectricityTWh"] = [d for d in solar["solar_electricity_twh"] if d.get("year", 0) >= 2000]
    if solar.get("solar_module_cost"):
        live["solarModuleCost"] = solar["solar_module_cost"]
    if solar.get("solar_share_energy"):
        live["solarSharePct"] = [d for d in solar["solar_share_energy"] if d.get("year", 0) >= 2000]

    # SEC CapEx
    capex = all_data.get("sec_capex.json", {})
    combined = capex.get("summary", {}).get("combined_annual_capex", [])
    if combined:
        live["hyperscalerCapex"] = combined
    latest_q = capex.get("summary", {}).get("latest_quarterly_by_company", {})
    if latest_q:
        live["latestQuarterlyCapex"] = latest_q

    # Transistors
    trans = all_data.get("transistors.json", {})
    if trans.get("transistors"):
        live["transistorCounts"] = [d for d in trans["transistors"] if d.get("year", 0) >= 1970]
    sup = trans.get("supplementary", {})
    if sup.get("clock_frequency_mhz"):
        live["clockFrequencyMHz"] = sup["clock_frequency_mhz"]
    if sup.get("core_count"):
        live["coreCount"] = sup["core_count"]

    # AI Pricing
    pricing = all_data.get("ai_pricing.json", {})
    if pricing.get("pricing_history"):
        live["aiPricingHistory"] = pricing["pricing_history"]
    if pricing.get("trends", {}).get("cheapest_option_timeline"):
        live["aiCheapestTimeline"] = pricing["trends"]["cheapest_option_timeline"]

    # Gene therapy
    gene = all_data.get("fda_gene_therapy.json", {})
    curated = gene.get("curated", {})
    if curated.get("by_year"):
        live["geneTherapyByYear"] = curated["by_year"]
    if curated.get("therapies"):
        live["geneTherapyList"] = curated["therapies"]

    return live


# ─── Main merge ─────────────────────────────────────────────

def merge_into_data_js(all_data):
    """Read existing data.js, merge fresh data, write back."""

    if not os.path.exists(DATA_JS_PATH):
        logger.error(f"data.js not found at {DATA_JS_PATH}")
        return False

    with open(DATA_JS_PATH, "r") as f:
        js_text = f.read()

    original_size = len(js_text)
    logger.info(f"Read data.js: {original_size:,} bytes")

    # Update LAST_UPDATED
    today = _today()
    js_text = re.sub(
        r'(const LAST_UPDATED\s*=\s*")[^"]*(")',
        f'\\g<1>{today}\\2',
        js_text,
        count=1
    )
    # Also update the comment header
    js_text = re.sub(
        r'(LAST UPDATED:\s*)\S+(\s)',
        f'\\g<1>{today}\\2',
        js_text,
        count=1
    )

    # Run each merger
    epoch_data = all_data.get("epoch_ai.json", {})
    if "error" not in epoch_data:
        logger.info("Merging Epoch AI data ...")
        js_text = merge_ai_compute(js_text, epoch_data)

    pricing_data = all_data.get("ai_pricing.json", {})
    if "error" not in pricing_data:
        logger.info("Merging AI pricing data ...")
        js_text = merge_ai_pricing(js_text, pricing_data)

    sat_data = all_data.get("satellites.json", {})
    if "error" not in sat_data:
        logger.info("Merging satellite data ...")
        js_text = merge_satellites(js_text, sat_data)

    solar_data = all_data.get("solar_energy.json", {})
    if "error" not in solar_data:
        logger.info("Merging solar energy data ...")
        js_text = merge_solar_energy(js_text, solar_data)

    capex_data = all_data.get("sec_capex.json", {})
    if "error" not in capex_data:
        logger.info("Merging SEC CapEx data ...")
        js_text = merge_sec_capex(js_text, capex_data)

    trans_data = all_data.get("transistors.json", {})
    if "error" not in trans_data:
        logger.info("Merging transistor data ...")
        js_text = merge_transistors(js_text, trans_data)

    gene_data = all_data.get("fda_gene_therapy.json", {})
    if "error" not in gene_data:
        logger.info("Merging gene therapy data ...")
        js_text = merge_gene_therapy(js_text, gene_data)

    # ─── Append/replace LIVE_DATA block ───
    live_data = build_live_data_block(all_data)
    live_data_js = (
        f"\n\n// ═══════════════════════════════════════════════════════════\n"
        f"// LIVE_DATA — Raw API data for charts (auto-generated {today})\n"
        f"// Do not edit manually — regenerated by update_data.py\n"
        f"// ═══════════════════════════════════════════════════════════\n"
        f"const LIVE_DATA = {json.dumps(live_data, indent=2, default=str)};\n"
    )

    # Remove existing LIVE_DATA block if present
    live_pattern = r'\n*// ═+\n// LIVE_DATA —.*?const LIVE_DATA = .*?;\n'
    js_text = re.sub(live_pattern, '', js_text, flags=re.DOTALL)

    # Append at the end
    js_text = js_text.rstrip() + "\n" + live_data_js

    # Backup
    backup_path = DATA_JS_PATH + f".backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    try:
        import shutil
        shutil.copy2(DATA_JS_PATH, backup_path)
        logger.info(f"Backed up to {backup_path}")
    except Exception as exc:
        logger.warning(f"Backup failed: {exc}")

    # Write
    with open(DATA_JS_PATH, "w") as f:
        f.write(js_text)

    new_size = len(js_text)
    logger.info(f"Wrote data.js: {new_size:,} bytes (was {original_size:,})")
    return True


# ─── Update log ─────────────────────────────────────────────

def write_update_log(all_data):
    log_path = os.path.join(DATA_DIR, "update_log.json")
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "sources": {},
    }

    for f in FETCHERS:
        jf = f["json_file"]
        data = all_data.get(jf, {})
        status = "error" if "error" in data else "ok"
        entry["sources"][jf] = {"name": f["name"], "status": status}

    # Load existing log
    existing = []
    if os.path.exists(log_path):
        try:
            with open(log_path) as fh:
                existing = json.load(fh)
                if not isinstance(existing, list):
                    existing = [existing]
        except Exception:
            pass

    existing.append(entry)
    existing = existing[-50:]  # Keep last 50

    with open(log_path, "w") as fh:
        json.dump(existing, fh, indent=2)
    logger.info(f"Wrote update log: {log_path}")


# ─── Main ───────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Singularity Dashboard data updater")
    parser.add_argument("--fetch-only", action="store_true", help="Fetch only, don't update data.js")
    parser.add_argument("--merge-only", action="store_true", help="Merge existing JSON, skip fetching")
    args = parser.parse_args()

    os.makedirs(DATA_DIR, exist_ok=True)
    start = datetime.now()
    logger.info(f"Singularity Dashboard update started at {start.isoformat()}")

    if args.merge_only:
        logger.info("Mode: merge-only")
        all_data = load_json_files()
    else:
        logger.info("Mode: full fetch")
        all_data = run_all_fetchers()

    if not args.fetch_only:
        logger.info("\nMerging data into data.js ...")
        merge_into_data_js(all_data)

    write_update_log(all_data)

    elapsed = (datetime.now() - start).total_seconds()

    # Summary
    print(f"\n{'='*60}")
    print(f"  SINGULARITY DASHBOARD DATA UPDATE")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")
    for f in FETCHERS:
        data = all_data.get(f["json_file"], {})
        ok = "error" not in data
        print(f"  [{'✓' if ok else '✗'}] {f['name']}: {'OK' if ok else 'FAILED'}")
    if not args.fetch_only and os.path.exists(DATA_JS_PATH):
        print(f"\n  data.js: {os.path.getsize(DATA_JS_PATH):,} bytes")
    print(f"  Elapsed: {elapsed:.1f}s")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
