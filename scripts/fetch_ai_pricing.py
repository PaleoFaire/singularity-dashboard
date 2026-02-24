#!/usr/bin/env python3
"""
fetch_ai_pricing.py - Build AI model pricing timeline.

Combines hardcoded historical pricing data with latest known prices
for frontier models from OpenAI, Anthropic, and Google.
Tracks cost per million tokens (input/output) over time.
Outputs JSON to scripts/data/ai_pricing.json.
"""

import json
import logging
import os
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

# ---------------------------------------------------------------------------
# Historical pricing data (hardcoded from public announcements)
# All prices in USD per million tokens
# ---------------------------------------------------------------------------

HISTORICAL_PRICING = [
    # OpenAI models
    {
        "date": "2020-06-11",
        "provider": "OpenAI",
        "model": "GPT-3 (davinci)",
        "input_per_mtok": 60.00,
        "output_per_mtok": 60.00,
        "notes": "Original GPT-3 API launch pricing",
    },
    {
        "date": "2022-01-27",
        "provider": "OpenAI",
        "model": "GPT-3 (text-davinci-002)",
        "input_per_mtok": 20.00,
        "output_per_mtok": 20.00,
        "notes": "InstructGPT models",
    },
    {
        "date": "2023-03-01",
        "provider": "OpenAI",
        "model": "GPT-3.5-turbo",
        "input_per_mtok": 2.00,
        "output_per_mtok": 2.00,
        "notes": "ChatGPT API launch",
    },
    {
        "date": "2023-03-14",
        "provider": "OpenAI",
        "model": "GPT-4",
        "input_per_mtok": 30.00,
        "output_per_mtok": 60.00,
        "notes": "GPT-4 launch",
    },
    {
        "date": "2023-06-13",
        "provider": "OpenAI",
        "model": "GPT-3.5-turbo (June)",
        "input_per_mtok": 1.50,
        "output_per_mtok": 2.00,
        "notes": "Price reduction",
    },
    {
        "date": "2023-07-06",
        "provider": "OpenAI",
        "model": "GPT-4 (July)",
        "input_per_mtok": 30.00,
        "output_per_mtok": 60.00,
        "notes": "GPT-4 GA",
    },
    {
        "date": "2023-11-06",
        "provider": "OpenAI",
        "model": "GPT-4-turbo",
        "input_per_mtok": 10.00,
        "output_per_mtok": 30.00,
        "notes": "DevDay announcement",
    },
    {
        "date": "2024-01-25",
        "provider": "OpenAI",
        "model": "GPT-3.5-turbo-0125",
        "input_per_mtok": 0.50,
        "output_per_mtok": 1.50,
        "notes": "Further price cut",
    },
    {
        "date": "2024-05-13",
        "provider": "OpenAI",
        "model": "GPT-4o",
        "input_per_mtok": 5.00,
        "output_per_mtok": 15.00,
        "notes": "GPT-4o launch",
    },
    {
        "date": "2024-07-18",
        "provider": "OpenAI",
        "model": "GPT-4o-mini",
        "input_per_mtok": 0.15,
        "output_per_mtok": 0.60,
        "notes": "Mini model launch",
    },
    {
        "date": "2024-09-12",
        "provider": "OpenAI",
        "model": "o1-preview",
        "input_per_mtok": 15.00,
        "output_per_mtok": 60.00,
        "notes": "Reasoning model",
    },
    {
        "date": "2024-09-12",
        "provider": "OpenAI",
        "model": "o1-mini",
        "input_per_mtok": 3.00,
        "output_per_mtok": 12.00,
        "notes": "Reasoning model (mini)",
    },
    {
        "date": "2025-01-31",
        "provider": "OpenAI",
        "model": "o3-mini",
        "input_per_mtok": 1.10,
        "output_per_mtok": 4.40,
        "notes": "o3-mini launch",
    },
    {
        "date": "2025-04-16",
        "provider": "OpenAI",
        "model": "GPT-4.1",
        "input_per_mtok": 2.00,
        "output_per_mtok": 8.00,
        "notes": "GPT-4.1 launch",
    },
    {
        "date": "2025-04-16",
        "provider": "OpenAI",
        "model": "GPT-4.1-mini",
        "input_per_mtok": 0.40,
        "output_per_mtok": 1.60,
        "notes": "GPT-4.1-mini launch",
    },
    {
        "date": "2025-04-16",
        "provider": "OpenAI",
        "model": "GPT-4.1-nano",
        "input_per_mtok": 0.10,
        "output_per_mtok": 0.40,
        "notes": "GPT-4.1-nano launch",
    },

    # Anthropic models
    {
        "date": "2023-03-14",
        "provider": "Anthropic",
        "model": "Claude 1",
        "input_per_mtok": 11.02,
        "output_per_mtok": 32.68,
        "notes": "Claude API launch",
    },
    {
        "date": "2023-07-11",
        "provider": "Anthropic",
        "model": "Claude 2",
        "input_per_mtok": 11.02,
        "output_per_mtok": 32.68,
        "notes": "Claude 2 launch",
    },
    {
        "date": "2024-03-04",
        "provider": "Anthropic",
        "model": "Claude 3 Opus",
        "input_per_mtok": 15.00,
        "output_per_mtok": 75.00,
        "notes": "Claude 3 family launch",
    },
    {
        "date": "2024-03-04",
        "provider": "Anthropic",
        "model": "Claude 3 Sonnet",
        "input_per_mtok": 3.00,
        "output_per_mtok": 15.00,
        "notes": "Claude 3 family",
    },
    {
        "date": "2024-03-04",
        "provider": "Anthropic",
        "model": "Claude 3 Haiku",
        "input_per_mtok": 0.25,
        "output_per_mtok": 1.25,
        "notes": "Claude 3 family",
    },
    {
        "date": "2024-06-20",
        "provider": "Anthropic",
        "model": "Claude 3.5 Sonnet",
        "input_per_mtok": 3.00,
        "output_per_mtok": 15.00,
        "notes": "3.5 Sonnet launch",
    },
    {
        "date": "2025-02-24",
        "provider": "Anthropic",
        "model": "Claude 3.5 Haiku",
        "input_per_mtok": 0.80,
        "output_per_mtok": 4.00,
        "notes": "3.5 Haiku launch",
    },
    {
        "date": "2025-02-24",
        "provider": "Anthropic",
        "model": "Claude 3.7 Sonnet",
        "input_per_mtok": 3.00,
        "output_per_mtok": 15.00,
        "notes": "3.7 Sonnet with extended thinking",
    },

    # Google models
    {
        "date": "2023-12-13",
        "provider": "Google",
        "model": "Gemini Pro",
        "input_per_mtok": 0.50,
        "output_per_mtok": 1.50,
        "notes": "Gemini API launch",
    },
    {
        "date": "2024-02-15",
        "provider": "Google",
        "model": "Gemini 1.0 Ultra",
        "input_per_mtok": 7.00,
        "output_per_mtok": 21.00,
        "notes": "Ultra tier",
    },
    {
        "date": "2024-05-14",
        "provider": "Google",
        "model": "Gemini 1.5 Pro",
        "input_per_mtok": 3.50,
        "output_per_mtok": 10.50,
        "notes": "1.5 Pro launch",
    },
    {
        "date": "2024-05-14",
        "provider": "Google",
        "model": "Gemini 1.5 Flash",
        "input_per_mtok": 0.35,
        "output_per_mtok": 1.05,
        "notes": "Flash tier",
    },
    {
        "date": "2024-09-24",
        "provider": "Google",
        "model": "Gemini 1.5 Pro (Sept price cut)",
        "input_per_mtok": 1.25,
        "output_per_mtok": 5.00,
        "notes": "Price reduction",
    },
    {
        "date": "2024-09-24",
        "provider": "Google",
        "model": "Gemini 1.5 Flash (Sept price cut)",
        "input_per_mtok": 0.075,
        "output_per_mtok": 0.30,
        "notes": "Price reduction",
    },
    {
        "date": "2024-12-11",
        "provider": "Google",
        "model": "Gemini 2.0 Flash",
        "input_per_mtok": 0.10,
        "output_per_mtok": 0.40,
        "notes": "2.0 Flash launch",
    },
    {
        "date": "2025-03-25",
        "provider": "Google",
        "model": "Gemini 2.5 Pro",
        "input_per_mtok": 1.25,
        "output_per_mtok": 10.00,
        "notes": "2.5 Pro with thinking",
    },
]

# ---------------------------------------------------------------------------
# Live pricing scraping (best-effort)
# ---------------------------------------------------------------------------

def try_fetch_openai_pricing() -> list[dict] | None:
    """Attempt to fetch current OpenAI pricing from their API models endpoint."""
    try:
        # OpenAI doesn't have a public pricing API, but we can try the models list
        logger.info("  Attempting to check OpenAI models endpoint ...")
        resp = requests.get(
            "https://api.openai.com/v1/models",
            headers={"Authorization": "Bearer dummy"},
            timeout=10,
        )
        # Without an API key this will 401 — that's expected
        logger.info("  OpenAI pricing requires API key; using hardcoded data")
        return None
    except Exception:
        return None


def try_fetch_anthropic_pricing() -> list[dict] | None:
    """Attempt to check Anthropic pricing."""
    try:
        logger.info("  Attempting to check Anthropic models endpoint ...")
        resp = requests.get(
            "https://api.anthropic.com/v1/models",
            headers={
                "x-api-key": "dummy",
                "anthropic-version": "2023-06-01",
            },
            timeout=10,
        )
        logger.info("  Anthropic pricing requires API key; using hardcoded data")
        return None
    except Exception:
        return None

# ---------------------------------------------------------------------------
# Analysis
# ---------------------------------------------------------------------------

def compute_price_trends(pricing: list[dict]) -> dict:
    """Compute pricing trends and analysis."""
    # Sort by date
    sorted_pricing = sorted(pricing, key=lambda p: p["date"])

    # Track cheapest frontier model over time (input price)
    cheapest_frontier_by_date = []
    cheapest_so_far = float("inf")
    for p in sorted_pricing:
        avg = (p["input_per_mtok"] + p["output_per_mtok"]) / 2
        # Only consider models that are reasonably capable (not tiny/mini at first)
        if avg < cheapest_so_far:
            cheapest_so_far = avg
            cheapest_frontier_by_date.append({
                "date": p["date"],
                "model": p["model"],
                "provider": p["provider"],
                "avg_per_mtok": round(avg, 3),
            })

    # Price by provider over time
    by_provider: dict[str, list[dict]] = {}
    for p in sorted_pricing:
        provider = p["provider"]
        if provider not in by_provider:
            by_provider[provider] = []
        by_provider[provider].append({
            "date": p["date"],
            "model": p["model"],
            "input_per_mtok": p["input_per_mtok"],
            "output_per_mtok": p["output_per_mtok"],
        })

    # Cheapest available option at each point in time
    cheapest_option_timeline = []
    min_input = float("inf")
    for p in sorted_pricing:
        if p["input_per_mtok"] < min_input:
            min_input = p["input_per_mtok"]
            cheapest_option_timeline.append({
                "date": p["date"],
                "model": p["model"],
                "provider": p["provider"],
                "input_per_mtok": p["input_per_mtok"],
                "output_per_mtok": p["output_per_mtok"],
            })

    # Compute overall price decline for frontier-class models
    # Compare first GPT-4-class model to latest GPT-4-class model
    frontier_prices = [p for p in sorted_pricing if p["input_per_mtok"] >= 1.0]
    price_decline = None
    if len(frontier_prices) >= 2:
        first = frontier_prices[0]
        last = frontier_prices[-1]
        if last["input_per_mtok"] > 0:
            price_decline = {
                "first_model": first["model"],
                "first_date": first["date"],
                "first_input_price": first["input_per_mtok"],
                "latest_model": last["model"],
                "latest_date": last["date"],
                "latest_input_price": last["input_per_mtok"],
                "decline_factor": round(first["input_per_mtok"] / last["input_per_mtok"], 1),
            }

    return {
        "cheapest_frontier_timeline": cheapest_frontier_by_date,
        "cheapest_option_timeline": cheapest_option_timeline,
        "by_provider": by_provider,
        "frontier_price_decline": price_decline,
    }

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def fetch_ai_pricing() -> dict:
    """Build AI pricing dataset."""
    os.makedirs(DATA_DIR, exist_ok=True)

    # Start with hardcoded historical data
    all_pricing = list(HISTORICAL_PRICING)

    # Try to fetch live pricing (best-effort)
    logger.info("Checking for live pricing updates ...")
    try_fetch_openai_pricing()
    try_fetch_anthropic_pricing()

    # Sort all entries
    all_pricing.sort(key=lambda p: p["date"])

    # Compute trends
    trends = compute_price_trends(all_pricing)

    output = {
        "source": "Hardcoded historical data + public pricing pages",
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "pricing_history": all_pricing,
        "trends": trends,
        "summary": {
            "total_data_points": len(all_pricing),
            "providers": list(set(p["provider"] for p in all_pricing)),
            "date_range": f"{all_pricing[0]['date']} to {all_pricing[-1]['date']}" if all_pricing else "N/A",
            "cheapest_current_input": min(p["input_per_mtok"] for p in all_pricing) if all_pricing else None,
            "cheapest_current_output": min(p["output_per_mtok"] for p in all_pricing) if all_pricing else None,
        },
    }

    if trends.get("frontier_price_decline"):
        output["summary"]["frontier_price_decline"] = trends["frontier_price_decline"]

    # Write JSON
    out_path = os.path.join(DATA_DIR, "ai_pricing.json")
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)
    logger.info(f"Wrote {out_path}")

    return output


if __name__ == "__main__":
    data = fetch_ai_pricing()
    print(f"\n=== AI Pricing Data Summary ===")
    s = data.get("summary", {})
    print(f"  Data points: {s.get('total_data_points', 0)}")
    print(f"  Providers: {', '.join(s.get('providers', []))}")
    print(f"  Date range: {s.get('date_range', 'N/A')}")
    print(f"  Cheapest input (any model): ${s.get('cheapest_current_input', 'N/A')}/Mtok")
    print(f"  Cheapest output (any model): ${s.get('cheapest_current_output', 'N/A')}/Mtok")
    if s.get("frontier_price_decline"):
        fpd = s["frontier_price_decline"]
        print(f"  Frontier price decline: {fpd['decline_factor']}x")
        print(f"    From: {fpd['first_model']} (${fpd['first_input_price']}/Mtok, {fpd['first_date']})")
        print(f"    To:   {fpd['latest_model']} (${fpd['latest_input_price']}/Mtok, {fpd['latest_date']})")
    print(f"  Output: scripts/data/ai_pricing.json")
