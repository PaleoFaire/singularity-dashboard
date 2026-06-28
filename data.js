/* ═══════════════════════════════════════════════════════════
   THE SINGULARITY DASHBOARD — Data Layer
   20 Technologies Bending Toward Vertical
   Rational Optimist Society © 2026

   LAST UPDATED: 2026-06-28 (manual baseline)
   AUTO-UPDATE: scripts/update_data.py refreshes automatable fields
   ═══════════════════════════════════════════════════════════ */

const LAST_UPDATED = "2026-06-28";

const TECHNOLOGIES = [

// ═══════════════════════════════════════════════════════════
// CATEGORY: AI & COMPUTE (8 metrics)
// ═══════════════════════════════════════════════════════════

// ─── 1. AI TASK HORIZON ───────────────────────────────────
{
  id: "ai-task-horizon",
  name: "AI Task Horizon",
  icon: "🧠",
  category: "ai",
  tagline: "The length of tasks AI can autonomously complete has gone from minutes to days.",
  accentColor: "#a78bfa",

  metric: "Reliable Autonomous Task Duration",
  startValue: "~2 min",
  startYear: 2020,
  currentValue: "14.5 hrs",
  currentYear: 2026,
  targetValue: "~1 week",
  targetLabel: "Full Work-Week Autonomy",
  progressPercent: 72,

  keyMetric: { label: "Task Horizon", value: "14.5 hrs", change: "+900% in 6 months" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [2, 3, 4, 5, 7, 10, 15, 25, 48, 80, 100],

  // Data source for automation
  dataSource: {
    name: "METR Time Horizons",
    url: "https://metr.org/time-horizons/",
    type: "scrape",
    frequency: "When new models launch (~monthly)",
    automated: false,
    lastPull: "2026-02-24"
  },

  whatItIs: "AI 'task horizon' measures the length and complexity of tasks an AI can reliably complete without human intervention. METR (Model Evaluation & Threat Research) tracks this rigorously. In 2023, frontier models handled requests taking a few minutes of human effort. By February 2026, Claude Opus 4.6 can autonomously complete tasks that would take a human expert 14.5 hours — nearly two full workdays. The doubling time post-2023 is approximately 4.3 months.",

  whyItMatters: "Every time the task horizon doubles, entirely new categories of work become automatable. At 1 hour, AI drafts and edits. At 8 hours, it completes a full workday of coding. At 1 week, it manages projects. A company of 10 wielding week-long AI agents has the productive capacity of a company of 1,000. Nvidia is 20x more valuable than IBM in the 1980s with 1/10th the staff. This metric explains why.",

  whatItUnlocks: [
    "Autonomous software development — entire features built, tested, and deployed by AI",
    "Scientific research acceleration — AI running multi-day experiment cycles",
    "Every knowledge worker becomes a 'company of one' with AI teams",
    "Recursive self-improvement: AI models helping build better AI models",
    "The end of the Great Stagnation in productivity growth"
  ],

  milestones: [
    { year: "2020", text: "GPT-3 — ~2 minutes of useful autonomous work", past: true },
    { year: "2022", text: "ChatGPT — ~30 minute task horizon", past: true },
    { year: "2023", text: "GPT-4 / Claude 2 — ~2 hour task horizon", past: true },
    { year: "2024", text: "Claude 3.5 / GPT-4o — ~4 hour task horizon", past: true },
    { year: "2025", text: "Agent frameworks — ~8 hour task horizon", past: true },
    { year: "Feb 2026", text: "Claude Opus 4.6 — 14.5 hour task horizon", past: true },
    { year: "2027", text: "Full work-week autonomy (projected)", past: false },
  ],

  innovators: [
    { name: "Anthropic", desc: "Claude Opus 4.6 — the current frontier. 14.5-hour task horizon.", tag: "$14B run-rate" },
    { name: "OpenAI", desc: "GPT-5 and o-series reasoning models pushing agent capabilities. $20B+ ARR.", tag: "$20B+ ARR" },
    { name: "Google DeepMind", desc: "Gemini Ultra + Project Astra building always-on AI assistants.", tag: "$Trillion lab" },
    { name: "xAI", desc: "Grok trained on the world's largest GPU cluster (Memphis).", tag: "100K H100s" },
  ],

  dataTable: [
    { period: "2020", value: "~2 min", context: "GPT-3: Answer a question" },
    { period: "2022", value: "~30 min", context: "ChatGPT: Draft an essay" },
    { period: "2023", value: "~2 hrs", context: "GPT-4: Write a codebase section" },
    { period: "2024", value: "~4 hrs", context: "Claude 3.5: Full project work" },
    { period: "2025", value: "~8 hrs", context: "Agents: Full workday tasks" },
    { period: "Feb 2026", value: "14.5 hrs", context: "Opus 4.6: Two-day tasks" },
  ]
},

// ─── 2. AI INFERENCE COST ─────────────────────────────────
{
  id: "ai-cost",
  name: "AI Inference Cost",
  icon: "💰",
  category: "ai",
  tagline: "The cost to run AI has collapsed 400x in four years — and it's still falling.",
  accentColor: "#60a5fa",

  metric: "Cost per Million Tokens (Frontier)",
  startValue: "$60",
  startYear: 2020,
  currentValue: "$0.07",
  currentYear: 2026,
  targetValue: "$0.001",
  targetLabel: "Effectively Free Intelligence",
  progressPercent: 68,

  keyMetric: { label: "Cost/1M tokens", value: "$0.07", change: "30x cheaper since 2020" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [0.0, 66.8, 96.8, 97.6, 99.3, 99.7, 99.9, 100.0],

  dataSource: {
    name: "Provider Pricing Pages",
    url: "https://openai.com/api/pricing/",
    type: "scrape",
    frequency: "Monthly",
    automated: true,
    script: "fetch_ai_pricing.py",
    lastPull: "2026-06-28"
  },

  whatItIs: "Inference cost measures how much it costs to generate AI responses. In 2020, frontier-quality inference cost ~$60 per million tokens (GPT-3 Davinci). By February 2026, equivalent capability costs $0.15/M tokens — a 400x decline. Budget models run at fractions of a penny. This is arguably the most important price curve in the global economy right now.",

  whyItMatters: "When something drops 1,000x in price, everything built on top of it transforms. Electricity dropping in cost gave us modern civilization. AI inference dropping in cost is giving us machine intelligence as a utility. At current trajectories, by 2028, running a PhD-level AI assistant for a full year will cost less than a Netflix subscription.",

  whatItUnlocks: [
    "AI embedded in every product, service, and workflow — not just chatbots",
    "Developing nations leapfrog straight to AI-augmented economies",
    "Personalized tutoring, medical diagnosis, and legal counsel for everyone",
    "AI agents running 24/7 on every business process at negligible cost",
    "The marginal cost of intelligence approaches zero"
  ],

  milestones: [
    { year: "2020", text: "$60/M tokens — GPT-3 Davinci (launch pricing)", past: true },
    { year: "2023", text: "$30/M — GPT-4 launch pricing", past: true },
    { year: "Jun 2024", text: "$3/M input — Claude 3.5 Sonnet", past: true },
    { year: "Dec 2024", text: "$0.40/M — Multi-provider competition", past: true },
    { year: "Feb 2026", text: "$0.15/M — Frontier models", past: true },
    { year: "2028", text: "Target: $0.001/M — effectively free", past: false },
  ],

  innovators: [
    { name: "Anthropic", desc: "Claude Haiku delivers frontier-adjacent quality at a fraction of the cost.", tag: "100x cheaper" },
    { name: "Google", desc: "Gemini Flash models optimized for cost-efficient inference at massive scale.", tag: "Cloud scale" },
    { name: "Groq", desc: "Custom LPU chips designed for fast, cheap LLM inference.", tag: "Hardware play" },
    { name: "DeepSeek", desc: "Open-source models achieving GPT-4 level performance at 10-50x lower cost.", tag: "Open source" },
  ],

  dataTable: [
    { period: "2020", value: "$60.00", context: "GPT-3 Davinci (launch)" },
    { period: "Mar 2023", value: "$30.00", context: "GPT-4 launch" },
    { period: "Jun 2024", value: "$3.00", context: "Claude 3.5 Sonnet (input)" },
    { period: "Dec 2024", value: "$0.40", context: "Competition drives down" },
    { period: "Feb 2026", value: "$0.15", context: "Current frontier" },
  ]
},

// ─── 3. FRONTIER AI TRAINING COMPUTE ──────────────────────
{
  id: "ai-compute",
  name: "Frontier AI Training Compute",
  icon: "⚡",
  category: "ai",
  tagline: "The compute used to train frontier AI models is doubling every 5-6 months.",
  accentColor: "#f472b6",

  metric: "Training FLOP (Frontier Models)",
  startValue: "10^18",
  startYear: 2012,
  currentValue: "5e+26 FLOP",
  currentYear: 2025,
  targetValue: "10^30+",
  targetLabel: "Trillion-Dollar Training Runs",
  progressPercent: 62,

  keyMetric: { label: "Largest Run", value: "10^27 FLOP", change: "Grok 4 (2025)" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [0.0, 20.3, 5.7, 22.2, 40.0, 47.7, 60.9, 63.1, 83.7, 81.7, 100.0],

  dataSource: {
    name: "Epoch AI Notable Models",
    url: "https://epoch.ai/data/notable_ai_models.csv",
    type: "csv",
    frequency: "Monthly",
    automated: true,
    script: "fetch_epoch_ai.py",
    lastPull: "2026-03-06"
  },

  whatItIs: "Training compute measures the total number of floating-point operations (FLOP) used to train a frontier AI model. Epoch AI tracks this rigorously across 3,000+ models. AlexNet (2012) used ~10^18 FLOP. GPT-4 (2023) used an estimated ~10^25 FLOP. Current frontier models are approaching 10^27 FLOP. The compute used for frontier training has been doubling approximately every 5-6 months since 2010 — far faster than Moore's Law.",

  whyItMatters: "Training compute is the raw fuel of AI capability. More compute → more capable models. The scaling laws discovered by OpenAI and others show that model capability improves predictably with more compute, data, and parameters. As long as this scaling continues — and the $325B/year datacenter buildout ensures it will — AI will keep getting dramatically more capable. This is the physical substrate of the singularity.",

  whatItUnlocks: [
    "Models with genuine reasoning, planning, and multi-step problem solving",
    "AI systems that can conduct novel scientific research autonomously",
    "Multimodal models that see, hear, speak, and manipulate the physical world",
    "The potential for artificial general intelligence (AGI) within this decade",
    "Recursive improvement: more compute → better models → models design better chips → more compute"
  ],

  milestones: [
    { year: "2012", text: "AlexNet: ~10^18 FLOP — deep learning begins", past: true },
    { year: "2017", text: "Transformer / AlphaGo: ~10^20 FLOP", past: true },
    { year: "2020", text: "GPT-3: ~10^23 FLOP", past: true },
    { year: "2023", text: "GPT-4: ~10^25 FLOP (estimated)", past: true },
    { year: "2025", text: "Frontier models: ~10^26 FLOP", past: true },
    { year: "2026", text: "Current frontier: approaching 10^27 FLOP", past: true },
    { year: "2030", text: "Target: 10^30 FLOP — trillion-dollar training runs", past: false },
  ],

  innovators: [
    { name: "OpenAI", desc: "Pioneered scaling laws. GPT series pushed compute frontiers with each generation.", tag: "Scaling pioneer" },
    { name: "Google DeepMind", desc: "Gemini Ultra and AlphaFold demonstrate compute-intensive breakthroughs.", tag: "Science + scale" },
    { name: "xAI", desc: "Memphis Supercluster: 100K+ H100 GPUs. One of the world's largest training clusters.", tag: "100K GPUs" },
    { name: "Anthropic", desc: "Claude model family trained on Amazon Trainium + NVIDIA clusters.", tag: "Safety + scale" },
  ],

  dataTable: [
    { period: "2012", value: "~10^18", context: "AlexNet" },
    { period: "2017", value: "~10^20", context: "Transformer paper" },
    { period: "2020", value: "~10^23", context: "GPT-3" },
    { period: "2023", value: "~10^25", context: "GPT-4 (estimated)" },
    { period: "2025", value: "~10^26", context: "Claude 3.5 / Gemini Ultra" },
    { period: "2026", value: "~10^27", context: "Current frontier" },
  ]
},

// ─── 4. AI FRONTIER CAPABILITY (BENCHMARKS) ──────────────
{
  id: "ai-capability",
  name: "AI Frontier Capability",
  icon: "🎯",
  category: "ai",
  tagline: "AI benchmark scores are climbing a staircase toward — and past — human expert level.",
  accentColor: "#818cf8",

  metric: "Chatbot Arena Elo Rating (Top Model)",
  startValue: "~1000",
  startYear: 2023,
  currentValue: "~1400",
  currentYear: 2026,
  targetValue: "1600+",
  targetLabel: "Superhuman Across All Domains",
  progressPercent: 65,

  keyMetric: { label: "Arena Elo (top)", value: "~1400", change: "+400 pts in 3 years" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [5, 10, 18, 28, 40, 52, 62, 72, 82, 92, 100],

  dataSource: {
    name: "LMSYS Chatbot Arena",
    url: "https://lmarena.ai/leaderboard",
    type: "scrape",
    frequency: "Weekly",
    automated: false,
    lastPull: "2026-02-24"
  },

  whatItIs: "The LMSYS Chatbot Arena uses blind head-to-head comparisons where humans pick which AI response is better — generating Elo ratings (like chess). This is widely considered the most reliable measure of overall AI capability because it's immune to benchmark gaming. Top models have climbed from ~1000 Elo in early 2023 to ~1400 in 2026. Separately, on GPQA (graduate-level science), frontier models now score 75%+, approaching human PhD-level performance.",

  whyItMatters: "Elo ratings provide a single, trusted number showing that AI capability is genuinely and rapidly improving — not just on narrow benchmarks, but on the tasks real humans actually care about. The rate of improvement shows no sign of slowing. Each 100-point Elo gain represents a qualitative leap in usefulness. And importantly: AI is approaching human-expert level on tasks that were considered impossible for machines just 3 years ago.",

  whatItUnlocks: [
    "AI systems that can genuinely assist in scientific research and discovery",
    "Expert-level coding, writing, analysis, and reasoning available to everyone",
    "Compound capability: models good enough to improve themselves",
    "Human-AI collaboration where AI is a true intellectual partner, not just a tool",
    "Economic transformation: expert-level intelligence at commodity pricing"
  ],

  milestones: [
    { year: "2023 Q1", text: "Chatbot Arena launches — GPT-4 leads at ~1100 Elo", past: true },
    { year: "2023 Q4", text: "Claude 2 / GPT-4 Turbo: ~1150 Elo", past: true },
    { year: "2024 Q2", text: "Claude 3 Opus / GPT-4o: ~1250 Elo", past: true },
    { year: "2025 Q1", text: "Reasoning models (o1, Claude): ~1350 Elo", past: true },
    { year: "2026 Q1", text: "Frontier models: ~1400 Elo", past: true },
    { year: "2028", text: "Target: 1600+ — superhuman across all domains", past: false },
  ],

  innovators: [
    { name: "Anthropic", desc: "Claude consistently ranks #1 or #2 on Arena. Leading on safety + capability.", tag: "Top-2 Arena" },
    { name: "OpenAI", desc: "GPT-4o and o-series models. Pioneered the frontier capability race.", tag: "Top-2 Arena" },
    { name: "Google DeepMind", desc: "Gemini models competitive on benchmarks; AlphaFold 3 dominates biology.", tag: "Science leader" },
    { name: "LMSYS / LM Arena", desc: "The organization running the Arena — the most trusted AI evaluation.", tag: "The referee" },
  ],

  dataTable: [
    { period: "2023 Q1", value: "~1100", context: "Arena launches, GPT-4 leads" },
    { period: "2023 Q4", value: "~1150", context: "GPT-4 Turbo" },
    { period: "2024 Q2", value: "~1250", context: "Claude 3 Opus era" },
    { period: "2024 Q4", value: "~1300", context: "o1 reasoning models" },
    { period: "2025 Q2", value: "~1350", context: "Multi-provider competition" },
    { period: "2026 Q1", value: "~1400", context: "Current frontier" },
  ]
},

// ─── 5. AI REVENUE EXPLOSION ──────────────────────────────
{
  id: "ai-revenue",
  name: "Time to $100M ARR",
  icon: "📈",
  category: "ai",
  tagline: "AI companies are reaching $100M in revenue faster than any technology in history.",
  accentColor: "#c084fc",

  metric: "Months to $100M ARR",
  startValue: "60+ months",
  startYear: 2010,
  currentValue: "~11 months",
  currentYear: 2026,
  targetValue: "<6 months",
  targetLabel: "Instant Scale",
  progressPercent: 70,

  keyMetric: { label: "Fastest to $100M", value: "~11 mo", change: "vs 60+ mo (pre-AI era)" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [5, 8, 12, 18, 28, 38, 48, 60, 75, 88, 100],

  dataSource: {
    name: "Epoch AI Revenue + Public Reporting",
    url: "https://epoch.ai/data/ai_companies_revenue_reports.csv",
    type: "csv",
    frequency: "Monthly",
    automated: true,
    script: "fetch_epoch_ai.py",
    lastPull: "2026-02-24"
  },

  whatItIs: "The speed at which companies reach $100 million in annual recurring revenue is the ultimate proof of product-market fit. Historically, even the fastest SaaS companies (Slack, Shopify, Twilio) took 5+ years. ChatGPT reached $100M ARR in approximately 11 months. Anthropic went from near-zero to $14 billion ARR in ~3 years. For context: it took Google 8 years, Facebook 6 years, and AWS 10 years to hit $10B.",

  whyItMatters: "Revenue velocity proves this isn't hype. When enterprises pay billions for AI in 3 years, it means AI is delivering measurable ROI at scale — not experimentation, but production deployment. This creates a self-reinforcing cycle: revenue funds more research, better models drive more revenue. The AI economy is being built in real-time at a pace never seen before.",

  whatItUnlocks: [
    "A new template for company building — AI-native businesses scale 10x faster",
    "The fastest wealth creation cycle in history",
    "AI R&D budgets exceeding many nations' GDP",
    "Every industry being rebuilt around AI-first workflows",
    "Proof that the singularity has economic substance, not just technological promise"
  ],

  milestones: [
    { year: "2008", text: "Dropbox: ~60 months to $100M ARR", past: true },
    { year: "2014", text: "Slack: ~24 months to $100M ARR", past: true },
    { year: "2020", text: "Zoom (COVID boost): ~18 months", past: true },
    { year: "2023", text: "ChatGPT: ~11 months to $100M ARR", past: true },
    { year: "2025", text: "Anthropic: ~$10B ARR in ~2.5 years", past: true },
    { year: "2026", text: "Anthropic: $14B ARR. OpenAI: $20B+ ARR.", past: true },
  ],

  innovators: [
    { name: "Anthropic", desc: "From zero to $14B ARR in ~3 years. Fastest enterprise software ramp ever.", tag: "$14B ARR" },
    { name: "OpenAI", desc: "ChatGPT + API. $20B+ ARR. 800M+ weekly active users.", tag: "$20B+ ARR" },
    { name: "NVIDIA", desc: "The 'picks and shovels.' $130.5B revenue in FY2025, on pace for $200B+ in FY2026.", tag: "$3T+ market cap" },
    { name: "Cursor", desc: "AI code editor: $100M+ ARR in roughly 18 months. AI-native from day one.", tag: "AI-native" },
  ],

  dataTable: [
    { period: "Dropbox (2008)", value: "~60 mo", context: "Traditional SaaS pace" },
    { period: "Slack (2014)", value: "~24 mo", context: "Viral SaaS" },
    { period: "Zoom (2020)", value: "~18 mo", context: "COVID acceleration" },
    { period: "ChatGPT (2023)", value: "~11 mo", context: "AI blitz-scaling" },
    { period: "Cursor (2024)", value: "~18 mo", context: "AI-native startup" },
    { period: "Anthropic (2026)", value: "$14B ARR", context: "Total in ~3 years" },
  ]
},

// ─── 6. DATACENTER SCALE (POWER) ──────────────────────────
{
  id: "datacenter-power",
  name: "Frontier Datacenter Scale",
  icon: "🏗️",
  category: "ai",
  tagline: "Individual AI datacenter campuses now draw more power than entire cities.",
  accentColor: "#f59e0b",

  metric: "Annual Hyperscaler AI CapEx",
  startValue: "~$15B",
  startYear: 2015,
  currentValue: "$226B/yr",
  currentYear: 2025,
  targetValue: "5+ GW",
  targetLabel: "Gigawatt-Scale AI Campuses",
  progressPercent: 50,

  keyMetric: { label: "Hyperscaler CapEx", value: "$226B/yr", change: "Microsoft: $80B, Alphabet: $36B, Amazon: $7B, Meta: $19B" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [6.7, 0.9, 0.0, 11.5, 12.4, 12.5, 18.1, 29.7, 30.1, 53.7, 100.0],

  dataSource: {
    name: "SEC EDGAR (CapEx) + Industry Reports",
    url: "https://data.sec.gov/api/xbrl/companyfacts/",
    type: "api",
    frequency: "Quarterly",
    automated: true,
    script: "fetch_sec_capex.py",
    lastPull: "2026-06-28"
  },

  whatItIs: "The physical scale of AI infrastructure is unprecedented. The largest datacenter campuses under construction now draw 500-700+ MW of power — enough to power a city of 400,000+ people. Amazon ($125B), Alphabet ($91B), Meta ($66-72B), and Microsoft ($80B+) are each spending massive sums on AI infrastructure in 2025. xAI's Memphis Supercluster houses 100,000+ H100 GPUs. Plans for gigawatt-scale (1,000+ MW) campuses are actively being developed, requiring dedicated power plants — often nuclear.",

  whyItMatters: "This spending is the physical proof that AI is real. Companies don't invest $450 billion/year in science experiments. The scale creates a self-reinforcing cycle: more compute enables more capable models, which drives more demand. It's reshaping energy markets (nuclear PPAs), real estate, and geopolitics. Whoever controls compute infrastructure controls AI supremacy.",

  whatItUnlocks: [
    "AI models 100-1,000x more capable than today's frontier systems",
    "Nuclear energy renaissance — driven by datacenter power demand",
    "A new geography of power: datacenter clusters as economic anchors",
    "National security infrastructure — compute supremacy = AI supremacy",
    "The physical substrate for artificial general intelligence"
  ],

  milestones: [
    { year: "2015", text: "Largest DCs: ~50 MW. Total global DC power: ~40 GW", past: true },
    { year: "2020", text: "Hyperscaler campuses: ~100-200 MW", past: true },
    { year: "2023", text: "AI boom begins; 300+ MW campuses planned", past: true },
    { year: "2024", text: "xAI Memphis: 150 MW; Stargate announced at 500 MW+", past: true },
    { year: "2026", text: "Multiple 500-700 MW campuses; $450B+ annual capex", past: true },
    { year: "2030", text: "Target: 5+ GW single campuses with dedicated nuclear", past: false },
  ],

  innovators: [
    { name: "Microsoft", desc: "Spending $80B+ on AI infrastructure in 2025-2026. Stargate partnership with OpenAI.", tag: "$80B+ capex" },
    { name: "Amazon (AWS)", desc: "Project Rainier + Trainium custom chips. Massive campus builds.", tag: "Custom silicon" },
    { name: "Google", desc: "TPU v6 custom silicon. Nuclear PPAs signed for DC power.", tag: "Nuclear-powered AI" },
    { name: "xAI", desc: "Memphis Supercluster: 100K+ H100s. One of the world's largest GPU clusters.", tag: "100K GPUs" },
  ],

  dataTable: [
    { period: "2015", value: "~50 MW", context: "Pre-AI era campus scale" },
    { period: "2020", value: "~150 MW", context: "Cloud growth phase" },
    { period: "2023", value: "~300 MW", context: "AI boom begins" },
    { period: "2024", value: "~500 MW", context: "Stargate announced" },
    { period: "2026", value: "~700 MW", context: "Multiple mega-campuses" },
    { period: "2030 (est)", value: "5,000+ MW", context: "Gigawatt era" },
  ]
},

// ─── 7. TRANSISTOR COST ───────────────────────────────────
{
  id: "transistor-cost",
  name: "Transistor Cost",
  icon: "🔬",
  category: "ai",
  tagline: "The cost per transistor has fallen a trillion-fold — the foundation of everything digital.",
  accentColor: "#14b8a6",

  metric: "Transistors per Microprocessor",
  startValue: "2,300",
  startYear: 1971,
  currentValue: "100+ billion",
  currentYear: 2026,
  targetValue: "1 trillion",
  targetLabel: "Trillion-Transistor Chips",
  progressPercent: 75,

  keyMetric: { label: "Transistors/chip", value: "55M", change: "~23827662x since 1971" },
  acceleration: 3,
  accelerationLabel: "Steady",
  sparkline: [0.0, 44.2, 0.0, 48.8, 0.0, 81.4, 67.4, 34.9, 100.0, 100.0, 97.7],

  dataSource: {
    name: "Karl Rupp Microprocessor Trend Data",
    url: "https://raw.githubusercontent.com/karlrupp/microprocessor-trend-data/master/50yrs/transistors.dat",
    type: "csv",
    frequency: "Annual",
    automated: true,
    script: "fetch_transistors.py",
    lastPull: "2026-06-28"
  },

  whatItIs: "Intel's 4004 (1971) had 2,300 transistors. Apple's M4 Ultra (2025) has over 100 billion. That's a 43-million-fold increase. The cost per transistor has fallen from ~$1 to less than a billionth of a cent. This is the most sustained exponential in human history — 50+ years of Moore's Law and its successors. Even as traditional transistor scaling slows, 3D chip stacking (TSMC's SoIC), chiplets, and advanced packaging keep the trajectory going.",

  whyItMatters: "Cheaper transistors are the foundational exponential. Every other technology on this dashboard — AI, genomics, space, energy — depends on cheap compute. The smartphone in your pocket has more processing power than all of NASA had during the Apollo program. This curve is why AI became possible: training GPT-4 would have been economically impossible with 1990s chip costs. The transistor cost curve IS the master curve of the singularity.",

  whatItUnlocks: [
    "AI training at scale — only possible because compute got cheap enough",
    "Ubiquitous sensors: $0.01 chips embedded in everything",
    "Autonomous vehicles, robots, drones — all depend on cheap, powerful chips",
    "The smartphone revolution — 5 billion people with supercomputers in their pockets",
    "Trillion-transistor chips enabling on-device AI and real-time reasoning"
  ],

  milestones: [
    { year: "1971", text: "Intel 4004: 2,300 transistors", past: true },
    { year: "1989", text: "Intel 486: 1.2 million transistors", past: true },
    { year: "2006", text: "Core 2 Duo: 291 million transistors", past: true },
    { year: "2015", text: "Skylake: 1.75 billion transistors", past: true },
    { year: "2022", text: "Apple M1 Ultra: 114 billion transistors", past: true },
    { year: "2025", text: "NVIDIA B200: 200+ billion transistors", past: true },
    { year: "2030", text: "Target: Trillion-transistor chips", past: false },
  ],

  innovators: [
    { name: "TSMC", desc: "Manufactures 90%+ of cutting-edge chips. 2nm in production 2025.", tag: "The foundry" },
    { name: "NVIDIA", desc: "Blackwell B200: 200B+ transistors. Defines the AI compute frontier.", tag: "$3T+ market cap" },
    { name: "Apple", desc: "M-series chips: the most efficient compute per watt. M4 Ultra: 100B+ transistors.", tag: "Efficiency king" },
    { name: "ASML", desc: "The only maker of EUV lithography machines. No ASML = no advanced chips.", tag: "Monopoly" },
  ],

  dataTable: [
    { period: "1971", value: "2,300", context: "Intel 4004" },
    { period: "1989", value: "1,200,000", context: "Intel 486" },
    { period: "2006", value: "291,000,000", context: "Core 2 Duo" },
    { period: "2015", value: "1,750,000,000", context: "Intel Skylake" },
    { period: "2022", value: "114,000,000,000", context: "Apple M1 Ultra" },
    { period: "2025", value: "200,000,000,000+", context: "NVIDIA B200" },
  ]
},

// ─── 8. AI TOKENS SERVED ─────────────────────────────────
{
  id: "ai-tokens",
  name: "AI Tokens Served",
  icon: "🌐",
  category: "ai",
  tagline: "Global AI inference has gone from zero to trillions of tokens per day in under three years.",
  accentColor: "#06b6d4",

  metric: "Global Tokens Processed per Day",
  startValue: "~1B",
  startYear: 2022,
  currentValue: "~50T+",
  currentYear: 2026,
  targetValue: "1 Quadrillion",
  targetLabel: "Always-On AI for Everyone",
  progressPercent: 55,

  keyMetric: { label: "Tokens/Day", value: "~50T+", change: "50,000x since ChatGPT launch" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [0.5, 1, 2, 5, 10, 18, 30, 42, 60, 80, 100],

  dataSource: {
    name: "OpenAI / Azure / Provider Reports",
    url: "https://openai.com/",
    type: "manual",
    frequency: "Quarterly (earnings reports)",
    automated: false,
    lastPull: "2026-02-24"
  },

  whatItIs: "AI inference tokens measure how much AI is actually being used globally. In late 2022, daily global token processing was negligible. By late 2025, OpenAI alone processes 6 billion tokens per minute (8.6 trillion/day). Microsoft Azure hit 100 trillion tokens in a single quarter. Google processes estimated 10-17 trillion tokens/day across all services. The total global figure likely exceeds 50 trillion tokens daily — and it's doubling roughly every 6 months.",

  whyItMatters: "This is the true measure of the AI revolution's impact. Training gets headlines, but inference is where AI touches the real world — every ChatGPT conversation, every code completion, every AI-generated image. The fact that inference now consumes 80-90% of all AI compute (up from 33% in 2023) tells you AI has moved from research to production. Agentic workflows multiply token usage exponentially: a single Deep Research query uses ~1 million tokens.",

  whatItUnlocks: [
    "AI becomes ambient — always-on, embedded in every product and service",
    "Agentic AI: autonomous multi-step reasoning using 10-100M tokens per task",
    "AI shifts from a tool to an infrastructure layer, like electricity",
    "Cost-per-query crashes toward zero, enabling AI for 8 billion people",
    "The feedback loop: more usage → more revenue → more investment → better models"
  ],

  milestones: [
    { year: "Nov 2022", text: "ChatGPT launches — AI inference goes mainstream", past: true },
    { year: "Feb 2024", text: "OpenAI: ~133B tokens/day (100B words)", past: true },
    { year: "Mid 2024", text: "ChatGPT: 400M weekly active users", past: true },
    { year: "Oct 2025", text: "OpenAI API: 6B tokens/minute (~8.6T/day)", past: true },
    { year: "Dec 2025", text: "ChatGPT: 800M+ weekly users; Azure: 100T tokens/quarter", past: true },
    { year: "2027", text: "Projected: 1 quadrillion tokens/day (ambient AI)", past: false },
  ],

  innovators: [
    { name: "OpenAI", desc: "ChatGPT: 800M+ weekly users, 6B tokens/min. 81% consumer AI market share.", tag: "$20B+ ARR" },
    { name: "Google DeepMind", desc: "Gemini across Search (2B+ MAU), Workspace, Cloud. Processes more tokens than anyone.", tag: "2B+ AI users" },
    { name: "Anthropic", desc: "Claude hit $14B ARR in Feb 2026. 500+ customers paying $1M+/year.", tag: "$14B ARR" },
    { name: "Microsoft/Azure", desc: "100T tokens/quarter. AI infused into every Microsoft product for 400M+ users.", tag: "100T/quarter" },
  ],

  dataTable: [
    { period: "Nov 2022", value: "~1B/day", context: "ChatGPT launch week" },
    { period: "Feb 2024", value: "~133B/day", context: "OpenAI (Sam Altman)" },
    { period: "Late 2024", value: "~1-2T/day", context: "OpenAI est." },
    { period: "Q3 2025", value: "~8.6T/day", context: "OpenAI API: 6B/min" },
    { period: "Q3 2025", value: "100T/quarter", context: "Azure alone" },
    { period: "Late 2025", value: "50T+/day", context: "All providers est." },
  ]
},

// ═══════════════════════════════════════════════════════════
// CATEGORY: ENERGY (6 metrics)
// ═══════════════════════════════════════════════════════════

// ─── 9. SOLAR COST ──────────────────────────────────────
{
  id: "solar-cost",
  name: "Solar Energy Cost",
  icon: "☀️",
  category: "energy",
  tagline: "Solar is now the cheapest energy source in history. And it's still getting cheaper.",
  accentColor: "#facc15",

  metric: "Cost per Watt (Solar Module)",
  startValue: "$76.00",
  startYear: 1977,
  currentValue: "$0.10/W",
  currentYear: 2026,
  targetValue: "$0.05",
  targetLabel: "Near-Zero Marginal Energy",
  progressPercent: 85,

  keyMetric: { label: "Module Cost", value: "$0.10/W", change: "-99.7% since 1976" },
  acceleration: 4,
  accelerationLabel: "Accelerating",
  sparkline: [0.0, 5.9, 50.0, 82.4, 86.8, 92.4, 95.9, 97.1, 95.3, 99.1, 100.0],

  dataSource: {
    name: "Our World in Data (IRENA-sourced)",
    url: "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv",
    type: "csv",
    frequency: "Annual",
    automated: true,
    script: "fetch_solar_energy.py",
    lastPull: "2026-06-28"
  },

  whatItIs: "Solar PV module costs have fallen from $76/watt in 1977 to ~$0.14/watt in 2026 — a decline of more than 99.8%. This follows Swanson's Law: every doubling of cumulative production reduces price by ~20-25%. Global solar installations hit over 500 GW in 2024 alone — more than all nuclear power ever built, in a single year.",

  whyItMatters: "Energy is the master resource. When energy becomes abundant and cheap, everything built on top of it — computing, manufacturing, transportation — gets cheaper too. Solar's cost trajectory means that within a decade, the marginal cost of daytime electricity in most of the world will approach zero.",

  whatItUnlocks: [
    "Energy abundance in the developing world",
    "Cheap desalination: unlimited fresh water from the oceans",
    "Economical direct air carbon capture at planetary scale",
    "Green hydrogen for industrial processes and shipping",
    "AI datacenter power at fractions of today's cost"
  ],

  milestones: [
    { year: "1977", text: "$76/watt — solar is a lab curiosity", past: true },
    { year: "2000", text: "$5/watt — still 10x more expensive than fossil fuels", past: true },
    { year: "2010", text: "$1.50/watt — grid parity begins in sunny regions", past: true },
    { year: "2020", text: "$0.25/watt — cheapest electricity in history", past: true },
    { year: "2024", text: "$0.17/watt — 500 GW installed in one year", past: true },
    { year: "2030", text: "Target: $0.05/watt — near-zero marginal energy", past: false },
  ],

  innovators: [
    { name: "LONGi Green", desc: "World's largest solar manufacturer, driving cost through massive scale.", tag: "100+ GW/yr" },
    { name: "First Solar", desc: "American thin-film leader; key US domestic manufacturing play.", tag: "US champion" },
    { name: "Oxford PV", desc: "Perovskite-silicon tandems hitting 29%+ efficiency in commercial panels.", tag: "Next gen" },
    { name: "Heliogen", desc: "Concentrated solar for industrial heat — replacing fossil fuels in cement/steel.", tag: "Industrial" },
  ],

  dataTable: [
    { period: "1977", value: "$76.00", context: "First commercial panels" },
    { period: "2000", value: "$5.00", context: "Germany feed-in tariff era" },
    { period: "2010", value: "$1.50", context: "Chinese scale manufacturing" },
    { period: "2020", value: "$0.25", context: "Cheapest electricity ever" },
    { period: "2024", value: "$0.17", context: "500 GW installed in 1 year" },
    { period: "2026", value: "$0.14", context: "Current module price" },
  ]
},

// ─── 9. SOLAR DEPLOYMENTS ─────────────────────────────────
{
  id: "solar-deploy",
  name: "Solar Deployments",
  icon: "🌍",
  category: "energy",
  tagline: "More solar was installed in 2024 than all nuclear power ever built — in one year.",
  accentColor: "#fbbf24",

  metric: "Annual Solar GW Installed",
  startValue: "~0.3 GW",
  startYear: 2000,
  currentValue: "2,779 TWh",
  currentYear: 2024,
  targetValue: "2,000+ GW",
  targetLabel: "Terawatt-Scale Solar",
  progressPercent: 55,

  keyMetric: { label: "Solar Generation", value: "2,779 TWh", change: "+30% YoY" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [0.0, 2.8, 7.5, 12.7, 17.5, 23.7, 31.6, 42.7, 55.8, 74.8, 100.0],

  dataSource: {
    name: "Our World in Data / IRENA",
    url: "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv",
    type: "csv",
    frequency: "Annual",
    automated: true,
    script: "fetch_solar_energy.py",
    lastPull: "2026-06-28"
  },

  whatItIs: "Annual solar PV installations have gone from 0.3 GW in 2000 to over 500 GW in 2024 — a 1,600x increase. China alone added 278 GW in 2024. Total global cumulative solar capacity now exceeds 1,866 GW, representing 42% of all renewable energy capacity. The deployment curve is classic S-curve acceleration — the steep part of the S is happening right now.",

  whyItMatters: "Deployment volume is what actually changes the energy system, not just cost. 500 GW in a single year is equivalent to building 500 nuclear reactors' worth of generation capacity — but doing it in 12 months instead of 12 years. At current growth rates, solar alone could provide the majority of global electricity by the early 2030s.",

  whatItUnlocks: [
    "Solar as the dominant global electricity source within a decade",
    "Energy independence for nations currently dependent on fossil imports",
    "Cheap, abundant electricity enabling AI datacenter expansion",
    "Decentralized power: rooftop solar + batteries = energy freedom",
    "The economic foundation for 10 billion people to live well"
  ],

  milestones: [
    { year: "2000", text: "0.3 GW installed — a rounding error", past: true },
    { year: "2010", text: "17 GW — Germany leads the way", past: true },
    { year: "2015", text: "50 GW — China overtakes Europe", past: true },
    { year: "2020", text: "134 GW — acceleration begins", past: true },
    { year: "2024", text: "500+ GW — more than all nuclear ever built, in one year", past: true },
    { year: "2030", text: "Target: 2,000+ GW/year — terawatt scale", past: false },
  ],

  innovators: [
    { name: "LONGi / JA Solar / Trina", desc: "Chinese solar giants driving 80%+ of global panel production.", tag: "Scale machines" },
    { name: "Enphase Energy", desc: "Microinverters making rooftop solar smarter and more efficient.", tag: "Rooftop enabler" },
    { name: "Nextracker", desc: "Solar tracking systems that increase output 20-30% per installation.", tag: "Tracking tech" },
    { name: "IRENA", desc: "Tracks global deployment data. Their stats prove the acceleration.", tag: "The scorekeeper" },
  ],

  dataTable: [
    { period: "2000", value: "0.3 GW", context: "Negligible" },
    { period: "2010", value: "17 GW", context: "Feed-in tariff era" },
    { period: "2015", value: "50 GW", context: "China ramp" },
    { period: "2020", value: "134 GW", context: "COVID dip then surge" },
    { period: "2023", value: "420 GW", context: "Acceleration" },
    { period: "2024", value: "500+ GW", context: "Record year" },
  ]
},

// ─── 10. BATTERY COST ─────────────────────────────────────
{
  id: "battery-cost",
  name: "Battery Cost",
  icon: "🔋",
  category: "energy",
  tagline: "Batteries crashing below $100/kWh — unlocking the electrification of everything.",
  accentColor: "#22c55e",

  metric: "Cost per kWh (Li-ion Pack)",
  startValue: "$1,200",
  startYear: 2010,
  currentValue: "$89",
  currentYear: 2026,
  targetValue: "$30",
  targetLabel: "Cheaper than Gas Tanks",
  progressPercent: 74,

  keyMetric: { label: "$/kWh", value: "$89", change: "-93% since 2010" },
  acceleration: 4,
  accelerationLabel: "Accelerating",
  sparkline: [100, 88, 72, 58, 44, 33, 24, 17, 12, 9, 7.5],

  dataSource: {
    name: "Our World in Data / BNEF",
    url: "https://ourworldindata.org/grapher/lithium-ion-battery-pack-cost",
    type: "csv",
    frequency: "Annual",
    automated: true,
    script: "fetch_solar_energy.py",
    lastPull: "2026-02-24"
  },

  whatItIs: "Lithium-ion battery pack prices have fallen from $1,200/kWh in 2010 to approximately $89/kWh in 2026 — a decline of over 93%. LFP packs from Chinese manufacturers are quoting below $55/kWh for grid storage. This is crashing through the $100/kWh barrier long considered the threshold for mass EV adoption.",

  whyItMatters: "Cheap batteries + cheap solar = 24/7 clean energy. Below $50/kWh, EVs become cheaper than gas cars without subsidies, grid storage undercuts peaker plants, and the entire energy system can electrify. This is the key enabler for the energy transition.",

  whatItUnlocks: [
    "EVs cheaper to buy AND operate than gas cars at every price point",
    "Grid-scale storage making solar/wind reliable 24/7 baseload",
    "Electrification of trucks, buses, ships, and eventually aircraft",
    "Off-grid living becomes practical anywhere in the world",
    "Energy independence for developing nations"
  ],

  milestones: [
    { year: "2010", text: "$1,200/kWh — EVs are expensive toys", past: true },
    { year: "2015", text: "$350/kWh — Tesla Model S proves the concept", past: true },
    { year: "2020", text: "$137/kWh — mass market EVs emerge", past: true },
    { year: "2024", text: "$115/kWh avg; LFP at ~$70/kWh in China", past: true },
    { year: "2026", text: "$89/kWh average; leaders below $55/kWh", past: true },
    { year: "2030", text: "Target: $30/kWh — solid-state at scale", past: false },
  ],

  innovators: [
    { name: "CATL", desc: "World's largest battery maker. Condensed battery for aviation. Sodium-ion for ultra-low cost.", tag: "37% share" },
    { name: "BYD", desc: "Blade Battery (LFP). Vertically integrated EV + battery champion.", tag: "#1 EV maker" },
    { name: "QuantumScape", desc: "Solid-state lithium-metal: 2x energy density, fast-charging, no fire risk.", tag: "Solid-state" },
    { name: "Form Energy", desc: "Iron-air batteries: 100-hour grid storage at 1/10th lithium cost.", tag: "Multi-day" },
  ],

  dataTable: [
    { period: "2010", value: "$1,200", context: "Early EV era" },
    { period: "2015", value: "$350", context: "Tesla Gigafactory" },
    { period: "2020", value: "$137", context: "Mass market crossover" },
    { period: "2023", value: "$139", context: "Materials spike" },
    { period: "2025", value: "$100", context: "Below the magic threshold" },
    { period: "2026", value: "$89", context: "LFP leaders at ~$55" },
  ]
},

// ─── 11. BATTERY DEPLOYMENTS ──────────────────────────────
{
  id: "battery-deploy",
  name: "Battery Storage Deployments",
  icon: "⚡",
  category: "energy",
  tagline: "Grid battery installations grew 12x in four years. The storage revolution is here.",
  accentColor: "#84cc16",

  metric: "Annual Grid Storage Deployed (GWh)",
  startValue: "~3 GWh",
  startYear: 2017,
  currentValue: "~200 GWh",
  currentYear: 2025,
  targetValue: "1,500 GWh/yr",
  targetLabel: "COP29 2030 Target",
  progressPercent: 42,

  keyMetric: { label: "Annual Deploy", value: "~200 GWh", change: "12x since 2020" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [1, 2, 3, 5, 7, 12, 20, 36, 60, 85, 100],

  dataSource: {
    name: "IEA / BloombergNEF / Rho Motion",
    url: "https://www.iea.org/energy-system/electricity/grid-scale-storage",
    type: "manual",
    frequency: "Annual + quarterly updates",
    automated: false,
    lastPull: "2026-02-24"
  },

  whatItIs: "Global battery energy storage deployments have gone vertical. In 2020, grid-scale battery capacity was under 10 GW globally. By end of 2024, cumulative capacity reached 124 GW / ~375 GWh — a 12x increase in four years. In 2024 alone, a record ~200 GWh of new battery storage was installed. China accounts for 61% of the global total. Tesla Energy deployed 31.4 GWh in 2024 (up 114% YoY) and already exceeded that through Q3 2025.",

  whyItMatters: "Batteries solve the intermittency problem of solar and wind. With BNEF reporting installed system costs at $117/kWh globally (and $73/kWh in China), grid storage now undercuts gas peaker plants. Dispatchable solar (solar + storage) is viable at ~$76/MWh. This means renewable energy can provide reliable 24/7 baseload power — the final piece of the energy transition puzzle.",

  whatItUnlocks: [
    "24/7 reliable renewable energy — solar and wind work at night and on calm days",
    "The death of gas peaker plants — batteries respond in milliseconds vs minutes",
    "Grid resilience: decentralized storage buffers against extreme weather outages",
    "Energy arbitrage: charge when cheap (midday solar), discharge when expensive (evening peak)",
    "Enabling developing nations to leapfrog fossil fuel grids entirely"
  ],

  milestones: [
    { year: "2017", text: "Tesla's 100MW South Australia battery proves the concept", past: true },
    { year: "2020", text: "~10 GW cumulative. Still a niche market", past: true },
    { year: "2022", text: "11 GW added in one year — 75% YoY growth", past: true },
    { year: "2023", text: "42 GW added — deployments double again", past: true },
    { year: "2024", text: "Record ~200 GWh deployed; 124 GW cumulative", past: true },
    { year: "2030", text: "COP29 target: 1,500 GW (6x current capacity)", past: false },
  ],

  innovators: [
    { name: "Tesla Energy", desc: "31.4 GWh deployed in 2024 (+114%). Megapack factories in Lathrop (40 GWh) and Shanghai (40 GWh).", tag: "$10.1B revenue" },
    { name: "CATL", desc: "World's largest battery cell maker for ESS. 37.9% global EV battery share. Sodium-ion for ultra-low cost.", tag: "#1 cell maker" },
    { name: "Fluence", desc: "7.4 GWh delivered FY2025. $5.3B record backlog, $23B pipeline. Siemens + AES joint venture.", tag: "$5.3B backlog" },
    { name: "BYD", desc: "Vertically integrated from cells to systems. 2.6 GWh Saudi Arabia project. #2 global battery maker.", tag: "17.2% share" },
  ],

  dataTable: [
    { period: "2020", value: "~16 GWh", context: "Market baseline" },
    { period: "2021", value: "~27 GWh", context: "Rystad est." },
    { period: "2022", value: "~43 GWh", context: "11 GW added (IEA)" },
    { period: "2023", value: "~80 GWh", context: "42 GW added, doubled YoY" },
    { period: "2024", value: "~200 GWh", context: "Record year (IEA/BNEF)" },
    { period: "2025 YTD", value: "~156 GWh", context: "Through Oct; +38% YoY" },
  ]
},

// ─── 12. FUSION PROGRESS ──────────────────────────────────
{
  id: "fusion",
  name: "Fusion Energy Progress",
  icon: "🌟",
  category: "energy",
  tagline: "53 funded fusion companies. $9.8 billion in private investment. The joke is ending.",
  accentColor: "#e879f9",

  metric: "Private Fusion Investment (Cumulative)",
  startValue: "$0.3B",
  startYear: 2015,
  currentValue: "$9.8B",
  currentYear: 2025,
  targetValue: "$50B+",
  targetLabel: "Commercial Pilot Plants",
  progressPercent: 35,

  keyMetric: { label: "Private investment", value: "$9.8B", change: "+3,167% since 2015" },
  acceleration: 4,
  accelerationLabel: "Accelerating",
  sparkline: [3, 4, 6, 10, 15, 22, 35, 52, 70, 88, 100],

  dataSource: {
    name: "Fusion Industry Association Annual Report",
    url: "https://www.fusionindustryassociation.org/fusion-industry-reports/",
    type: "pdf",
    frequency: "Annual (July)",
    automated: false,
    lastPull: "2026-02-24"
  },

  whatItIs: "Fusion — the energy source of the sun — has been '30 years away' for 60 years. That joke is ending. The Fusion Industry Association now tracks 53 funded private fusion companies with $9.8 billion in cumulative private investment (up 5x since 2021). NIF achieved ignition (Q > 1) in December 2022. Multiple companies target commercial pilot plants by the mid-2030s. The convergence of AI (for plasma control), advanced magnets (HTS), and cheap compute is breaking through decades-old barriers.",

  whyItMatters: "Fusion would be the ultimate energy source: clean, safe, virtually unlimited fuel (hydrogen from seawater), no meltdown risk, no long-lived waste. A single fusion plant could power a city indefinitely. If fusion becomes commercial, energy scarcity — the constraint behind most of human suffering — effectively ends. Even the progress toward fusion (superconducting magnets, plasma physics) generates valuable spinoff technologies.",

  whatItUnlocks: [
    "Unlimited clean baseload power — the end of energy scarcity",
    "Desalination at scale: clean water for the entire world",
    "Space propulsion: fusion drives for interplanetary travel",
    "Industrial processes running on effectively free energy",
    "The ultimate answer to 'how do we power 10 billion AI data centers?'"
  ],

  milestones: [
    { year: "2015", text: "~10 private fusion companies; $0.3B total investment", past: true },
    { year: "2021", text: "23 companies; $1.9B. CFS demonstrates HTS magnets.", past: true },
    { year: "2022", text: "NIF achieves fusion ignition (Q > 1) for the first time", past: true },
    { year: "2024", text: "45 companies; $7.1B. Investment up 178% YoY.", past: true },
    { year: "2025", text: "53 companies; $9.8B. 84% target commercial by late 2030s.", past: true },
    { year: "2035", text: "Target: First commercial fusion pilot plants", past: false },
  ],

  innovators: [
    { name: "Commonwealth Fusion Systems", desc: "MIT spinout. SPARC tokamak. HTS magnets. $2B+ raised. The frontrunner.", tag: "$2B+ raised" },
    { name: "TAE Technologies", desc: "Field-reversed configuration. 30+ years of R&D. $1.2B+ raised.", tag: "FRC approach" },
    { name: "Helion Energy", desc: "Pulsed fusion. Microsoft signed a PPA for fusion electricity by 2028.", tag: "Microsoft PPA" },
    { name: "Zap Energy", desc: "Sheared-flow Z-pinch. Simpler, cheaper approach. No magnets needed.", tag: "No magnets" },
  ],

  dataTable: [
    { period: "2015", value: "$0.3B", context: "~10 companies" },
    { period: "2021", value: "$1.9B", context: "23 companies" },
    { period: "2022", value: "$4.9B", context: "NIF ignition milestone" },
    { period: "2023", value: "$6.3B", context: "35 companies" },
    { period: "2024", value: "$7.1B", context: "45 companies" },
    { period: "2025", value: "$9.8B", context: "53 companies" },
  ]
},

// ═══════════════════════════════════════════════════════════
// CATEGORY: BIOLOGY & HEALTH (2 metrics)
// ═══════════════════════════════════════════════════════════

// ─── 12. GENOMIC SEQUENCING ───────────────────────────────
{
  id: "genome-cost",
  name: "Genomic Sequencing Cost",
  icon: "🧬",
  category: "bio",
  tagline: "The $100 genome is here. Biology has officially become computable.",
  accentColor: "#f472b6",

  metric: "Cost per Human Genome",
  startValue: "$100M",
  startYear: 2001,
  currentValue: "$100",
  currentYear: 2026,
  targetValue: "$10",
  targetLabel: "Genome as Routine Test",
  progressPercent: 88,

  keyMetric: { label: "Cost/Genome", value: "$100", change: "-99.9999%" },
  acceleration: 4,
  accelerationLabel: "Accelerating",
  sparkline: [100, 85, 60, 35, 18, 8, 3, 1.5, 0.8, 0.3, 0.1],

  dataSource: {
    name: "NHGRI Sequencing Cost Data",
    url: "https://www.genome.gov/about-genomics/fact-sheets/DNA-Sequencing-Costs-Data",
    type: "excel",
    frequency: "Historical (stale since 2022)",
    automated: false,
    lastPull: "2026-06-28"
  },

  whatItIs: "The cost to sequence a complete human genome dropped from $100 million (Human Genome Project, 2001) to $100 in February 2026. This decline — the Carlson Curve — outpaced Moore's Law by 10x. The first genome took 13 years and $3 billion. Today: hours and less than a nice dinner.",

  whyItMatters: "Cheap genomic sequencing does to biology what cheap compute did to information. When every patient's genome costs less than a blood test, medicine becomes personalized. Cancer treatments target your tumor's specific mutations. Rare diseases get diagnosed in hours, not years. Biology has become a data science.",

  whatItUnlocks: [
    "Routine genomic screening at birth",
    "Precision oncology: treatments matched to your tumor's mutations",
    "Pharmacogenomics: right drug, right dose, first time",
    "Population-scale genomic databases for AI-driven drug discovery",
    "Agricultural genomics: designer crops in years, not decades"
  ],

  milestones: [
    { year: "2001", text: "$100M — Human Genome Project completes", past: true },
    { year: "2007", text: "$1M — Second-generation sequencing", past: true },
    { year: "2014", text: "$1,000 — Illumina HiSeq X breaks the barrier", past: true },
    { year: "2022", text: "$200 — NovaSeq X Plus", past: true },
    { year: "2026", text: "$100 — The $100 genome officially arrives", past: true },
    { year: "2030", text: "Target: $10 — cheaper than a blood panel", past: false },
  ],

  innovators: [
    { name: "Illumina", desc: "Dominant platform. NovaSeq X Plus enabled the $100 genome.", tag: "80% share" },
    { name: "Oxford Nanopore", desc: "Pocket-sized sequencers. Real-time, long-read, anywhere in the world.", tag: "Portable DNA" },
    { name: "Ultima Genomics", desc: "Novel architecture targeting sub-$100 genomes at massive throughput.", tag: "Breaking $100" },
    { name: "PacBio", desc: "Long-read sequencing for structural variants and complex regions.", tag: "Long reads" },
  ],

  dataTable: [
    { period: "2001", value: "$100,000,000", context: "Human Genome Project" },
    { period: "2007", value: "$1,000,000", context: "Next-gen sequencing" },
    { period: "2014", value: "$1,000", context: "Illumina HiSeq X" },
    { period: "2020", value: "$400", context: "Continued decline" },
    { period: "2024", value: "$150", context: "NovaSeq X Plus era" },
    { period: "2026", value: "$100", context: "The target is hit" },
  ]
},

// ─── 13. GLP-1 REVOLUTION ─────────────────────────────────
{
  id: "glp1",
  name: "GLP-1 Revolution",
  icon: "💊",
  category: "bio",
  tagline: "Ozempic and its successors are rewriting obesity, heart disease, and addiction medicine.",
  accentColor: "#f97316",

  metric: "Patients on GLP-1 Drugs (US)",
  startValue: "~1M",
  startYear: 2020,
  currentValue: "~30M",
  currentYear: 2026,
  targetValue: "100M+",
  targetLabel: "Standard of Care",
  progressPercent: 55,

  keyMetric: { label: "US Patients", value: "~30M", change: "+2,900% since 2020" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [3, 4, 6, 10, 18, 30, 48, 65, 78, 90, 100],

  dataSource: {
    name: "CMS Medicare Part D API",
    url: "https://data.cms.gov/provider-summary-by-type-of-service/medicare-part-d-prescribers/",
    type: "api",
    frequency: "Annual (18-month lag)",
    automated: true,
    script: "fetch_glp1.py",
    lastPull: "2026-02-24"
  },

  whatItIs: "GLP-1 receptor agonists (Ozempic, Mounjaro, Wegovy) are the most impactful drug class in a generation. Originally for type 2 diabetes, they produce 15-25% sustained weight loss with remarkable benefits across cardiovascular disease, liver disease, kidney disease, sleep apnea, and — emerging data suggests — addiction and Alzheimer's. ~30 million Americans are now on GLP-1 drugs, up from ~1 million in 2020.",

  whyItMatters: "Obesity is the root cause of the majority of chronic disease. A drug producing 20%+ weight loss doesn't just help individuals; it restructures healthcare systems. Morgan Stanley estimates $105 billion annual revenue by 2030. Second-order effects: reduced hospitalizations, lower insurance premiums, longer lifespans, higher productivity.",

  whatItUnlocks: [
    "First effective pharmaceutical treatment for obesity at scale",
    "Potential to reduce cardiovascular deaths by 20%+",
    "Oral formulations (pills instead of injections) arriving 2026-2027",
    "Emerging evidence for treating addiction, Alzheimer's, inflammation",
    "Restructuring of food, fitness, healthcare, and insurance industries"
  ],

  milestones: [
    { year: "2017", text: "Ozempic approved for type 2 diabetes", past: true },
    { year: "2021", text: "Wegovy approved for weight loss — 15% avg", past: true },
    { year: "2023", text: "Mounjaro shows 22.5% weight loss in trials", past: true },
    { year: "2024", text: "Cardiovascular benefits confirmed; supply eases", past: true },
    { year: "2026", text: "~30M patients; oral semaglutide in late-stage trials", past: true },
    { year: "2030", text: "Target: 100M+ patients; oral pills standard of care", past: false },
  ],

  innovators: [
    { name: "Novo Nordisk", desc: "Ozempic/Wegovy. Europe's most valuable company.", tag: "$500B+" },
    { name: "Eli Lilly", desc: "Mounjaro/Zepbound. Best-in-class 22.5% weight loss.", tag: "$700B+" },
    { name: "Amgen", desc: "MariTide — next-gen GLP-1 requiring only monthly injection.", tag: "Monthly dose" },
    { name: "Viking Therapeutics", desc: "VK2735 — oral GLP-1 showing 8% loss in 28 days.", tag: "Oral pill" },
  ],

  dataTable: [
    { period: "2020", value: "~1M", context: "Primarily diabetes" },
    { period: "2022", value: "~5M", context: "TikTok goes viral" },
    { period: "2023", value: "~12M", context: "Weight loss era" },
    { period: "2024", value: "~20M", context: "Supply catches up" },
    { period: "2025", value: "~25M", context: "Insurance expands" },
    { period: "2026", value: "~30M", context: "Oral approaching" },
  ]
},

// ═══════════════════════════════════════════════════════════
// CATEGORY: SPACE & ROBOTICS (5 metrics)
// ═══════════════════════════════════════════════════════════

// ─── 14. SPACE LAUNCH COST ────────────────────────────────
{
  id: "space-launch",
  name: "Space Launch Cost",
  icon: "🚀",
  category: "space",
  tagline: "Reusable rockets cut launch costs 100x — opening the final frontier.",
  accentColor: "#22d3ee",

  metric: "Cost per kg to LEO",
  startValue: "$54,500",
  startYear: 1981,
  currentValue: "$1,500",
  currentYear: 2026,
  targetValue: "$100",
  targetLabel: "Space Cargo ≈ Air Freight",
  progressPercent: 65,

  keyMetric: { label: "$/kg to LEO", value: "$1,500", change: "-97% since Shuttle" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [100, 98, 95, 92, 88, 70, 40, 20, 10, 5, 3],

  dataSource: {
    name: "CSIS + Our World in Data",
    url: "https://ourworldindata.org/grapher/cost-space-launches-low-earth-orbit",
    type: "csv",
    frequency: "Annual",
    automated: false,
    lastPull: "2026-02-24"
  },

  whatItIs: "The cost per kg to LEO has plummeted from $54,500 (Space Shuttle) to ~$1,500 (Falcon 9). SpaceX alone launches more mass than the rest of the world combined. Starship, when fully operational, targets $100/kg or less — equivalent to air freight rates.",

  whyItMatters: "Cheap access to space transforms communications (Starlink: 4M+ users), manufacturing (zero-gravity pharma), and planetary defense. When launching costs the same as shipping a container, space becomes a business environment.",

  whatItUnlocks: [
    "Global broadband via satellite constellations",
    "Space-based manufacturing: fiber optics, pharmaceuticals",
    "Orbital data centers for AI",
    "Asteroid mining — platinum group metals worth trillions",
    "Permanent settlements on Moon and Mars"
  ],

  milestones: [
    { year: "1981", text: "$54,500/kg — Space Shuttle era", past: true },
    { year: "2010", text: "$10,000/kg — Falcon 9 first launch", past: true },
    { year: "2017", text: "$2,700/kg — reusable first stage", past: true },
    { year: "2024", text: "$1,500/kg — fully optimized Falcon 9", past: true },
    { year: "2025", text: "Starship orbital launches begin", past: true },
    { year: "2030", text: "Target: $100/kg with Starship", past: false },
  ],

  innovators: [
    { name: "SpaceX", desc: "Falcon 9 (300+ flights) + Starship. Most ambitious launch system ever.", tag: "90% of mass" },
    { name: "Rocket Lab", desc: "Electron + Neutron. IPO'd. Reliable, reusable, growing.", tag: "Public ($RKLB)" },
    { name: "Relativity Space", desc: "Terran R: world's first 3D-printed reusable rocket.", tag: "3D-printed" },
    { name: "Blue Origin", desc: "New Glenn + Orbital Reef. Bezos-scale capital.", tag: "$10B+" },
  ],

  dataTable: [
    { period: "1981", value: "$54,500", context: "Space Shuttle" },
    { period: "2000", value: "$20,000", context: "Proton / Ariane" },
    { period: "2013", value: "$4,600", context: "Early Falcon 9" },
    { period: "2020", value: "$2,600", context: "Reusable F9" },
    { period: "2024", value: "$1,500", context: "Optimized F9" },
    { period: "2026", value: "~$500", context: "Starship early ops (est)" },
  ]
},

// ─── 15. MASS TO ORBIT ────────────────────────────────────
{
  id: "mass-orbit",
  name: "Mass to Orbit",
  icon: "📦",
  category: "space",
  tagline: "More mass was launched to orbit in 2024 than in all of the 1990s combined.",
  accentColor: "#06b6d4",

  metric: "Total Mass to Orbit (tonnes/year)",
  startValue: "~200 t",
  startYear: 2015,
  currentValue: "~2,500 t",
  currentYear: 2025,
  targetValue: "50,000+ t",
  targetLabel: "Industrial Space Era",
  progressPercent: 40,

  keyMetric: { label: "Tonnes to orbit/yr", value: "~2,500", change: "+1,150% since 2015" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [5, 6, 8, 12, 18, 28, 40, 55, 72, 88, 100],

  dataSource: {
    name: "Space-Track.org + BryceTech",
    url: "https://www.space-track.org/",
    type: "api",
    frequency: "Monthly",
    automated: true,
    script: "fetch_satellites.py",
    lastPull: "2026-02-24"
  },

  whatItIs: "Total mass delivered to orbit per year is the most meaningful measure of space activity. In 2015, humanity launched ~200 tonnes to orbit. By 2025, that number exceeded 2,500 tonnes — a 12x increase driven overwhelmingly by SpaceX. Starship, with its 100+ tonne capacity per flight, could single-handedly deliver 10,000+ tonnes per year once operational. When Starship reaches full cadence, we could be launching more mass in a single month than in the entire Space Shuttle era.",

  whyItMatters: "Mass to orbit is the fundamental bottleneck of the space economy. You can't build space stations, manufacture in orbit, or settle other worlds without getting material there affordably. The current hockey stick in mass-to-orbit is the foundation for a trillion-dollar orbital economy.",

  whatItUnlocks: [
    "Space station construction and orbital habitats at scale",
    "In-space manufacturing of fiber optics, semiconductors, and pharmaceuticals",
    "Satellite mega-constellations for global connectivity",
    "Lunar base construction and resource utilization",
    "Mars cargo delivery — precursor to human settlement"
  ],

  milestones: [
    { year: "2015", text: "~200 tonnes/year to orbit globally", past: true },
    { year: "2020", text: "~500 tonnes/year — Starlink begins", past: true },
    { year: "2023", text: "~1,500 tonnes/year — SpaceX dominance", past: true },
    { year: "2025", text: "~2,500 tonnes/year — Starship first orbital", past: true },
    { year: "2028", text: "Target: ~10,000 tonnes/year with Starship cadence", past: false },
    { year: "2035", text: "Target: 50,000+ tonnes/year — industrial space era", past: false },
  ],

  innovators: [
    { name: "SpaceX", desc: "Responsible for 80%+ of mass to orbit. Starship: 100+ t per flight.", tag: "Dominant" },
    { name: "Rocket Lab", desc: "Electron + Neutron. Growing share of small/medium payloads.", tag: "Growing" },
    { name: "ULA (Vulcan)", desc: "Vulcan Centaur for heavy national security payloads.", tag: "Nat security" },
    { name: "Blue Origin", desc: "New Glenn targets heavy-lift market from 2025.", tag: "Heavy lift" },
  ],

  dataTable: [
    { period: "2015", value: "~200 t", context: "Pre-reusability" },
    { period: "2018", value: "~350 t", context: "Falcon 9 reuse begins" },
    { period: "2020", value: "~500 t", context: "Starlink ramp" },
    { period: "2023", value: "~1,500 t", context: "Record launch year" },
    { period: "2025", value: "~2,500 t", context: "Starship begins" },
    { period: "2028 (est)", value: "~10,000 t", context: "Starship cadence" },
  ]
},

// ─── 16. OBJECTS IN ORBIT ─────────────────────────────────
{
  id: "objects-orbit",
  name: "Objects in Orbit",
  icon: "🛰️",
  category: "space",
  tagline: "More satellites launched in 2024 than in the first 50 years of spaceflight combined.",
  accentColor: "#38bdf8",

  metric: "Active Satellites in Orbit",
  startValue: "2,200",
  startYear: 2019,
  currentValue: "16,368",
  currentYear: 2026,
  targetValue: "100,000+",
  targetLabel: "Orbital Infrastructure Era",
  progressPercent: 48,

  keyMetric: { label: "Active Satellites", value: "16,368", change: "69,611 total objects tracked" },
  acceleration: 5,
  accelerationLabel: "Going Vertical",
  sparkline: [0.0, 0.9, 2.3, 3.3, 6.3, 13.1, 24.8, 39.9, 56.7, 85.4, 100.0],

  dataSource: {
    name: "UCS Satellite Database + CelesTrak",
    url: "https://celestrak.org/pub/satcat.csv",
    type: "csv",
    frequency: "Daily (CelesTrak) / Quarterly (UCS)",
    automated: true,
    script: "fetch_satellites.py",
    lastPull: "2026-06-28"
  },

  whatItIs: "Active satellites in orbit exploded from ~2,200 (2019) to 13,000+ (2026). In 2024 alone, 2,800+ satellites were launched — more than the entire 20th century. Starlink dominates with 7,000+ satellites. This is the early phase of building an orbital infrastructure layer around Earth.",

  whyItMatters: "Satellites are becoming infrastructure — as fundamental as cell towers. Starlink provides broadband to 4M+ users in 100+ countries. Earth observation enables precision agriculture and disaster response in real time. The space economy is projected at $1.8 trillion by 2035.",

  whatItUnlocks: [
    "Global broadband for every human on Earth",
    "Real-time Earth observation: weather, crops, deforestation",
    "Direct-to-device satellite connectivity (phone service anywhere)",
    "Space-based communications resilient to terrestrial failure",
    "Orbital manufacturing and data centers"
  ],

  milestones: [
    { year: "2019", text: "~2,200 active satellites", past: true },
    { year: "2020", text: "Starlink beta; launches double", past: true },
    { year: "2022", text: "~5,000 active; Starlink crosses 1M users", past: true },
    { year: "2024", text: "~10,000 active; 2,800 launched in one year", past: true },
    { year: "2026", text: "13,000+ active; Starlink at 4M+ users", past: true },
    { year: "2030", text: "Target: 100,000+ active satellites", past: false },
  ],

  innovators: [
    { name: "SpaceX (Starlink)", desc: "7,000+ sats. 4M+ users. Building direct-to-cell.", tag: "90% of new sats" },
    { name: "Amazon (Kuiper)", desc: "3,236-sat constellation for global broadband.", tag: "$10B+" },
    { name: "Astranis", desc: "Small GEO broadband satellites. Connecting the unconnected.", tag: "GEO broadband" },
    { name: "Planet Labs", desc: "200+ Earth observation satellites. Daily global imaging.", tag: "Daily scan" },
  ],

  dataTable: [
    { period: "2019", value: "2,200", context: "Pre-megaconstellation" },
    { period: "2020", value: "3,300", context: "Starlink begins" },
    { period: "2022", value: "5,400", context: "Rapid deployment" },
    { period: "2024", value: "10,000", context: "2,800 launched" },
    { period: "2025", value: "11,500", context: "Kuiper joins" },
    { period: "2026", value: "13,000+", context: "Still accelerating" },
  ]
},

// ─── 17. ROBOTAXI RIDES ───────────────────────────────────
{
  id: "robotaxi",
  name: "Robotaxi Rides",
  icon: "🚗",
  category: "space",
  tagline: "Robotaxis went from zero to 400,000+ paid rides per week in 4 years.",
  accentColor: "#fb923c",

  metric: "Robotaxi Rides per Week (US)",
  startValue: "~0",
  startYear: 2022,
  currentValue: "400,000+",
  currentYear: 2026,
  targetValue: "10M+",
  targetLabel: "Majority of Urban Rides",
  progressPercent: 52,

  keyMetric: { label: "Rides/week", value: "400K+", change: "From zero in 2022" },
  acceleration: 4,
  accelerationLabel: "Accelerating",
  sparkline: [0, 0, 1, 3, 8, 15, 28, 42, 60, 80, 100],

  dataSource: {
    name: "Waymo Press + CPUC Filings",
    url: "https://waymo.com/blog/",
    type: "manual",
    frequency: "Quarterly",
    automated: false,
    lastPull: "2026-02-24"
  },

  whatItIs: "Autonomous vehicles went from perpetual vaporware to real commercial service. Waymo operates fully driverless robotaxis in San Francisco, Phoenix, Los Angeles, Austin, Atlanta, and Miami — completing 400,000+ paid rides per week across 6 cities. No safety driver. Waymo delivered 15 million rides in 2025 alone, quadrupling 2024 volume.",

  whyItMatters: "Road accidents kill 1.35 million people annually. Human error causes 94% of crashes. AVs even 2x safer save 600,000+ lives per year. Economics: robotaxis cost ~$0.25-0.50/mile vs ~$2-3/mile for Uber. This makes car ownership optional for urban residents.",

  whatItUnlocks: [
    "600,000+ lives saved annually when AVs are 2x safer",
    "Transportation costs drop 80%+",
    "Autonomous trucking: 24/7 freight, solving driver shortages",
    "Cities redesigned: fewer parking lots, more green space",
    "Mobility for elderly, disabled, and non-drivers"
  ],

  milestones: [
    { year: "2020", text: "Waymo begins limited driverless rides in Phoenix", past: true },
    { year: "2023", text: "Waymo opens SF to public; 50K rides/week", past: true },
    { year: "2024", text: "100K+ rides/week; expands to LA and Austin", past: true },
    { year: "2025", text: "15M rides in 2025; expands to Atlanta, Miami", past: true },
    { year: "2026", text: "400K+ rides/week across 6 cities; targeting 1M/week", past: true },
    { year: "2030", text: "Target: Robotaxis in most major US cities", past: false },
  ],

  innovators: [
    { name: "Waymo", desc: "Clear leader. 400K+ weekly rides across 6 cities. Targeting 1M/week in 2026.", tag: "Market leader" },
    { name: "Tesla", desc: "FSD in millions of cars. Unmatched data moat.", tag: "Billions of miles" },
    { name: "Zoox (Amazon)", desc: "Purpose-built robotaxi — no steering wheel.", tag: "Amazon-backed" },
    { name: "Aurora Innovation", desc: "Aurora Driver for robotrucking.", tag: "Trucking focus" },
  ],

  dataTable: [
    { period: "2020", value: "~200/wk", context: "Phoenix suburbs" },
    { period: "2022", value: "~5,000/wk", context: "Limited commercial" },
    { period: "2023", value: "~50,000/wk", context: "SF opens" },
    { period: "2024", value: "~100,000/wk", context: "Multi-city" },
    { period: "2025", value: "~250,000/wk", context: "15M rides total in 2025" },
    { period: "2026", value: "400,000+/wk", context: "6 cities, targeting 1M/wk" },
  ]
},

// ─── 18. COMMERCIAL DRONE DELIVERIES ──────────────────────
{
  id: "drone-delivery",
  name: "Commercial Drone Deliveries",
  icon: "📦",
  category: "space",
  tagline: "Zipline has completed 12 million+ autonomous drone deliveries across 7 countries.",
  accentColor: "#64748b",

  metric: "Cumulative Commercial Deliveries",
  startValue: "~1,000",
  startYear: 2017,
  currentValue: "12M+",
  currentYear: 2026,
  targetValue: "1B+",
  targetLabel: "Drone Delivery at Scale",
  progressPercent: 32,

  keyMetric: { label: "Total deliveries", value: "12M+", change: "+12,000x since 2017" },
  acceleration: 4,
  accelerationLabel: "Accelerating",
  sparkline: [1, 2, 4, 8, 15, 25, 38, 52, 68, 84, 100],

  dataSource: {
    name: "Company Reporting (Zipline, Wing)",
    url: "https://www.flyzipline.com/",
    type: "manual",
    frequency: "Quarterly",
    automated: false,
    lastPull: "2026-02-24"
  },

  whatItIs: "Autonomous drone delivery is scaling rapidly. Zipline leads with 12+ million completed deliveries across 7 countries, delivering medical supplies, meals, and packages. Wing (Alphabet) operates in the US and Australia. Amazon Prime Air is ramping. The technology works: autonomous flight, precision delivery, all-weather operation. The remaining barriers are regulatory (airspace approval), not technological.",

  whyItMatters: "Drone delivery achieves last-mile logistics at a fraction of the cost of ground vehicles — no driver, no traffic, no road infrastructure needed. This is transformative for developing nations (medical supply delivery to remote areas), urban logistics (30-minute delivery windows), and emergency response. It's also the civilian edge of the same autonomous drone technology reshaping military strategy.",

  whatItUnlocks: [
    "Medical supply delivery to remote areas — blood, vaccines, antivenom",
    "30-minute delivery for any small package, anywhere",
    "Logistics costs drop by 80%+ for last-mile delivery",
    "Emergency response: disaster area supply delivery within hours",
    "Infrastructure-light commerce for developing nations"
  ],

  milestones: [
    { year: "2017", text: "Zipline begins blood deliveries in Rwanda (~1K)", past: true },
    { year: "2020", text: "Zipline: 1M+ deliveries; Wing launches in US", past: true },
    { year: "2022", text: "Amazon Prime Air begins testing; FAA Part 135 approvals", past: true },
    { year: "2024", text: "Zipline: 8M+ deliveries; Wing expanding", past: true },
    { year: "2026", text: "12M+ deliveries; multiple countries and operators", past: true },
    { year: "2030", text: "Target: 1B+ annual deliveries globally", past: false },
  ],

  innovators: [
    { name: "Zipline", desc: "12M+ deliveries. 7 countries. Medical supplies, meals, packages.", tag: "Category leader" },
    { name: "Wing (Alphabet)", desc: "US and Australia drone delivery. Integrating with retailers.", tag: "Google-backed" },
    { name: "Amazon Prime Air", desc: "Ramping drone delivery in US metro areas.", tag: "Amazon scale" },
    { name: "Matternet", desc: "Hospital-to-hospital medical drone delivery networks.", tag: "Medical focus" },
  ],

  dataTable: [
    { period: "2017", value: "~1,000", context: "Rwanda blood deliveries" },
    { period: "2020", value: "~1,000,000", context: "Zipline scales" },
    { period: "2022", value: "~3,000,000", context: "Multi-country" },
    { period: "2024", value: "~8,000,000", context: "Rapid growth" },
    { period: "2025", value: "~10,000,000", context: "US expansion" },
    { period: "2026", value: "12,000,000+", context: "Still accelerating" },
  ]
},

]; // END TECHNOLOGIES ARRAY


// ═══════════════════════════════════════════════════════════
// LIVE_DATA — Raw API data for charts (auto-generated 2026-06-28)
// Do not edit manually — regenerated by update_data.py
// ═══════════════════════════════════════════════════════════
const LIVE_DATA = {
  "frontierCompute": [
    {
      "year": 2010,
      "max_flop": 5.396e+16,
      "max_flop_log10": 16.73
    },
    {
      "year": 2011,
      "max_flop": 5.2e+16,
      "max_flop_log10": 16.72
    },
    {
      "year": 2012,
      "max_flop": 6e+17,
      "max_flop_log10": 17.78
    },
    {
      "year": 2013,
      "max_flop": 2.612736e+18,
      "max_flop_log10": 18.42
    },
    {
      "year": 2014,
      "max_flop": 2.97600000001e+20,
      "max_flop_log10": 20.47
    },
    {
      "year": 2015,
      "max_flop": 3.8e+20,
      "max_flop_log10": 20.58
    },
    {
      "year": 2016,
      "max_flop": 6.620000000001e+21,
      "max_flop_log10": 21.82
    },
    {
      "year": 2017,
      "max_flop": 8.43e+20,
      "max_flop_log10": 20.93
    },
    {
      "year": 2018,
      "max_flop": 8.74395e+21,
      "max_flop_log10": 21.94
    },
    {
      "year": 2019,
      "max_flop": 1.0773400001e+23,
      "max_flop_log10": 23.03
    },
    {
      "year": 2020,
      "max_flop": 3.14e+23,
      "max_flop_log10": 23.5
    },
    {
      "year": 2021,
      "max_flop": 2.047e+24,
      "max_flop_log10": 24.31
    },
    {
      "year": 2022,
      "max_flop": 2.7415e+24,
      "max_flop_log10": 24.44
    },
    {
      "year": 2023,
      "max_flop": 5.0000000001e+25,
      "max_flop_log10": 25.7
    },
    {
      "year": 2024,
      "max_flop": 3.8e+25,
      "max_flop_log10": 25.58
    },
    {
      "year": 2025,
      "max_flop": 5.0000000000001e+26,
      "max_flop_log10": 26.7
    },
    {
      "year": 2026,
      "max_flop": 3.87e+25,
      "max_flop_log10": 25.59
    }
  ],
  "activeSatellites": [
    {
      "year": 1964,
      "cumulative_active": 2
    },
    {
      "year": 1965,
      "cumulative_active": 5
    },
    {
      "year": 1967,
      "cumulative_active": 9
    },
    {
      "year": 1971,
      "cumulative_active": 10
    },
    {
      "year": 1974,
      "cumulative_active": 11
    },
    {
      "year": 1975,
      "cumulative_active": 12
    },
    {
      "year": 1976,
      "cumulative_active": 13
    },
    {
      "year": 1977,
      "cumulative_active": 15
    },
    {
      "year": 1978,
      "cumulative_active": 16
    },
    {
      "year": 1983,
      "cumulative_active": 17
    },
    {
      "year": 1984,
      "cumulative_active": 18
    },
    {
      "year": 1986,
      "cumulative_active": 19
    },
    {
      "year": 1988,
      "cumulative_active": 20
    },
    {
      "year": 1989,
      "cumulative_active": 23
    },
    {
      "year": 1990,
      "cumulative_active": 26
    },
    {
      "year": 1991,
      "cumulative_active": 27
    },
    {
      "year": 1992,
      "cumulative_active": 28
    },
    {
      "year": 1993,
      "cumulative_active": 34
    },
    {
      "year": 1994,
      "cumulative_active": 38
    },
    {
      "year": 1995,
      "cumulative_active": 42
    },
    {
      "year": 1996,
      "cumulative_active": 49
    },
    {
      "year": 1997,
      "cumulative_active": 56
    },
    {
      "year": 1998,
      "cumulative_active": 78
    },
    {
      "year": 1999,
      "cumulative_active": 86
    },
    {
      "year": 2000,
      "cumulative_active": 99
    },
    {
      "year": 2001,
      "cumulative_active": 112
    },
    {
      "year": 2002,
      "cumulative_active": 125
    },
    {
      "year": 2003,
      "cumulative_active": 152
    },
    {
      "year": 2004,
      "cumulative_active": 176
    },
    {
      "year": 2005,
      "cumulative_active": 199
    },
    {
      "year": 2006,
      "cumulative_active": 222
    },
    {
      "year": 2007,
      "cumulative_active": 264
    },
    {
      "year": 2008,
      "cumulative_active": 308
    },
    {
      "year": 2009,
      "cumulative_active": 366
    },
    {
      "year": 2010,
      "cumulative_active": 432
    },
    {
      "year": 2011,
      "cumulative_active": 503
    },
    {
      "year": 2012,
      "cumulative_active": 572
    },
    {
      "year": 2013,
      "cumulative_active": 673
    },
    {
      "year": 2014,
      "cumulative_active": 793
    },
    {
      "year": 2015,
      "cumulative_active": 905
    },
    {
      "year": 2016,
      "cumulative_active": 995
    },
    {
      "year": 2017,
      "cumulative_active": 1141
    },
    {
      "year": 2018,
      "cumulative_active": 1354
    },
    {
      "year": 2019,
      "cumulative_active": 1505
    },
    {
      "year": 2020,
      "cumulative_active": 1966
    },
    {
      "year": 2021,
      "cumulative_active": 3016
    },
    {
      "year": 2022,
      "cumulative_active": 4811
    },
    {
      "year": 2023,
      "cumulative_active": 7124
    },
    {
      "year": 2024,
      "cumulative_active": 9707
    },
    {
      "year": 2025,
      "cumulative_active": 14121
    },
    {
      "year": 2026,
      "cumulative_active": 16368
    }
  ],
  "satelliteLaunches": [
    {
      "year": 2000,
      "count": 730
    },
    {
      "year": 2001,
      "count": 582
    },
    {
      "year": 2002,
      "count": 395
    },
    {
      "year": 2003,
      "count": 243
    },
    {
      "year": 2004,
      "count": 216
    },
    {
      "year": 2005,
      "count": 195
    },
    {
      "year": 2006,
      "count": 1168
    },
    {
      "year": 2007,
      "count": 360
    },
    {
      "year": 2008,
      "count": 419
    },
    {
      "year": 2009,
      "count": 388
    },
    {
      "year": 2010,
      "count": 413
    },
    {
      "year": 2011,
      "count": 665
    },
    {
      "year": 2012,
      "count": 474
    },
    {
      "year": 2013,
      "count": 432
    },
    {
      "year": 2014,
      "count": 542
    },
    {
      "year": 2015,
      "count": 338
    },
    {
      "year": 2016,
      "count": 355
    },
    {
      "year": 2017,
      "count": 524
    },
    {
      "year": 2018,
      "count": 963
    },
    {
      "year": 2019,
      "count": 783
    },
    {
      "year": 2020,
      "count": 1436
    },
    {
      "year": 2021,
      "count": 2006
    },
    {
      "year": 2022,
      "count": 3534
    },
    {
      "year": 2023,
      "count": 3151
    },
    {
      "year": 2024,
      "count": 3680
    },
    {
      "year": 2025,
      "count": 4664
    },
    {
      "year": 2026,
      "count": 2342
    }
  ],
  "solarElectricityTWh": [
    {
      "year": 2000,
      "solar_electricity_twh": 1.02
    },
    {
      "year": 2001,
      "solar_electricity_twh": 1.36
    },
    {
      "year": 2002,
      "solar_electricity_twh": 1.72
    },
    {
      "year": 2003,
      "solar_electricity_twh": 2.11
    },
    {
      "year": 2004,
      "solar_electricity_twh": 2.78
    },
    {
      "year": 2005,
      "solar_electricity_twh": 3.95
    },
    {
      "year": 2006,
      "solar_electricity_twh": 5.42
    },
    {
      "year": 2007,
      "solar_electricity_twh": 7.29
    },
    {
      "year": 2008,
      "solar_electricity_twh": 11.85
    },
    {
      "year": 2009,
      "solar_electricity_twh": 19.82
    },
    {
      "year": 2010,
      "solar_electricity_twh": 32.21
    },
    {
      "year": 2011,
      "solar_electricity_twh": 63.56
    },
    {
      "year": 2012,
      "solar_electricity_twh": 96.92
    },
    {
      "year": 2013,
      "solar_electricity_twh": 131.75
    },
    {
      "year": 2014,
      "solar_electricity_twh": 197.74
    },
    {
      "year": 2015,
      "solar_electricity_twh": 256.01
    },
    {
      "year": 2016,
      "solar_electricity_twh": 327.47
    },
    {
      "year": 2017,
      "solar_electricity_twh": 444.65
    },
    {
      "year": 2018,
      "solar_electricity_twh": 575.16
    },
    {
      "year": 2019,
      "solar_electricity_twh": 697.94
    },
    {
      "year": 2020,
      "solar_electricity_twh": 853.39
    },
    {
      "year": 2021,
      "solar_electricity_twh": 1053.99
    },
    {
      "year": 2022,
      "solar_electricity_twh": 1333.12
    },
    {
      "year": 2023,
      "solar_electricity_twh": 1664.14
    },
    {
      "year": 2024,
      "solar_electricity_twh": 2142.65
    },
    {
      "year": 2025,
      "solar_electricity_twh": 2778.64
    }
  ],
  "solarModuleCost": [
    {
      "year": 1976,
      "cost_per_watt_usd": 106.0
    },
    {
      "year": 1980,
      "cost_per_watt_usd": 30.0
    },
    {
      "year": 1985,
      "cost_per_watt_usd": 12.0
    },
    {
      "year": 1990,
      "cost_per_watt_usd": 8.0
    },
    {
      "year": 1995,
      "cost_per_watt_usd": 5.5
    },
    {
      "year": 2000,
      "cost_per_watt_usd": 4.5
    },
    {
      "year": 2005,
      "cost_per_watt_usd": 3.5
    },
    {
      "year": 2008,
      "cost_per_watt_usd": 3.3
    },
    {
      "year": 2010,
      "cost_per_watt_usd": 1.8
    },
    {
      "year": 2012,
      "cost_per_watt_usd": 0.7
    },
    {
      "year": 2014,
      "cost_per_watt_usd": 0.55
    },
    {
      "year": 2016,
      "cost_per_watt_usd": 0.36
    },
    {
      "year": 2018,
      "cost_per_watt_usd": 0.24
    },
    {
      "year": 2020,
      "cost_per_watt_usd": 0.2
    },
    {
      "year": 2022,
      "cost_per_watt_usd": 0.26
    },
    {
      "year": 2023,
      "cost_per_watt_usd": 0.13
    },
    {
      "year": 2024,
      "cost_per_watt_usd": 0.1
    }
  ],
  "solarSharePct": [
    {
      "year": 2000,
      "solar_share_energy_pct": 0.003
    },
    {
      "year": 2001,
      "solar_share_energy_pct": 0.004
    },
    {
      "year": 2002,
      "solar_share_energy_pct": 0.004
    },
    {
      "year": 2003,
      "solar_share_energy_pct": 0.005
    },
    {
      "year": 2004,
      "solar_share_energy_pct": 0.007
    },
    {
      "year": 2005,
      "solar_share_energy_pct": 0.009
    },
    {
      "year": 2006,
      "solar_share_energy_pct": 0.012
    },
    {
      "year": 2007,
      "solar_share_energy_pct": 0.015
    },
    {
      "year": 2008,
      "solar_share_energy_pct": 0.025
    },
    {
      "year": 2009,
      "solar_share_energy_pct": 0.041
    },
    {
      "year": 2010,
      "solar_share_energy_pct": 0.063
    },
    {
      "year": 2011,
      "solar_share_energy_pct": 0.118
    },
    {
      "year": 2012,
      "solar_share_energy_pct": 0.179
    },
    {
      "year": 2013,
      "solar_share_energy_pct": 0.238
    },
    {
      "year": 2014,
      "solar_share_energy_pct": 0.334
    },
    {
      "year": 2015,
      "solar_share_energy_pct": 0.429
    },
    {
      "year": 2016,
      "solar_share_energy_pct": 0.538
    },
    {
      "year": 2017,
      "solar_share_energy_pct": 0.712
    },
    {
      "year": 2018,
      "solar_share_energy_pct": 0.891
    },
    {
      "year": 2019,
      "solar_share_energy_pct": 1.076
    },
    {
      "year": 2020,
      "solar_share_energy_pct": 1.35
    },
    {
      "year": 2021,
      "solar_share_energy_pct": 1.573
    },
    {
      "year": 2022,
      "solar_share_energy_pct": 1.937
    },
    {
      "year": 2023,
      "solar_share_energy_pct": 2.357
    },
    {
      "year": 2024,
      "solar_share_energy_pct": 2.939
    }
  ],
  "hyperscalerCapex": [
    {
      "year": 2009,
      "total_capex_usd": 930000000,
      "total_capex_usd_billions": 0.93
    },
    {
      "year": 2010,
      "total_capex_usd": 9257000000,
      "total_capex_usd_billions": 9.26
    },
    {
      "year": 2011,
      "total_capex_usd": 4166000000,
      "total_capex_usd_billions": 4.17
    },
    {
      "year": 2012,
      "total_capex_usd": 8224000000,
      "total_capex_usd_billions": 8.22
    },
    {
      "year": 2013,
      "total_capex_usd": 9063000000,
      "total_capex_usd_billions": 9.06
    },
    {
      "year": 2014,
      "total_capex_usd": 12209000000,
      "total_capex_usd_billions": 12.21
    },
    {
      "year": 2015,
      "total_capex_usd": 41288000000,
      "total_capex_usd_billions": 41.29
    },
    {
      "year": 2016,
      "total_capex_usd": 29783000000,
      "total_capex_usd_billions": 29.78
    },
    {
      "year": 2017,
      "total_capex_usd": 28046000000,
      "total_capex_usd_billions": 28.05
    },
    {
      "year": 2018,
      "total_capex_usd": 50686000000,
      "total_capex_usd_billions": 50.69
    },
    {
      "year": 2019,
      "total_capex_usd": 52575000000,
      "total_capex_usd_billions": 52.58
    },
    {
      "year": 2020,
      "total_capex_usd": 52837000000,
      "total_capex_usd_billions": 52.84
    },
    {
      "year": 2021,
      "total_capex_usd": 63829000000,
      "total_capex_usd_billions": 63.83
    },
    {
      "year": 2022,
      "total_capex_usd": 86802000000,
      "total_capex_usd_billions": 86.8
    },
    {
      "year": 2023,
      "total_capex_usd": 87624000000,
      "total_capex_usd_billions": 87.62
    },
    {
      "year": 2024,
      "total_capex_usd": 134268000000,
      "total_capex_usd_billions": 134.27
    },
    {
      "year": 2025,
      "total_capex_usd": 225689000000,
      "total_capex_usd_billions": 225.69
    }
  ],
  "latestQuarterlyCapex": {
    "Microsoft": {
      "period": "2026 Q3",
      "capex_usd_billions": 80.15
    },
    "Alphabet": {
      "period": "2026 Q1",
      "capex_usd_billions": 35.67
    },
    "Amazon": {
      "period": "2017 Q1",
      "capex_usd_billions": 7.42
    },
    "Meta": {
      "period": "2026 Q1",
      "capex_usd_billions": 19.0
    }
  },
  "transistorCounts": [
    {
      "year": 1971.9,
      "transistor_count": 2.30824152676,
      "transistor_count_log10": 0.36
    },
    {
      "year": 1972.3,
      "transistor_count": 3.55452235561,
      "transistor_count_log10": 0.55
    },
    {
      "year": 1974.3,
      "transistor_count": 6.09756235221,
      "transistor_count_log10": 0.79
    },
    {
      "year": 1979.6,
      "transistor_count": 29.1637757405,
      "transistor_count_log10": 1.46
    },
    {
      "year": 1982.3,
      "transistor_count": 135.772714211,
      "transistor_count_log10": 2.13
    },
    {
      "year": 1985.9,
      "transistor_count": 273.841963426,
      "transistor_count_log10": 2.44
    },
    {
      "year": 1986.2,
      "transistor_count": 109.411381058,
      "transistor_count_log10": 2.04
    },
    {
      "year": 1988.7,
      "transistor_count": 121.881418484,
      "transistor_count_log10": 2.09
    },
    {
      "year": 1989.5,
      "transistor_count": 1207.90074743,
      "transistor_count_log10": 3.08
    },
    {
      "year": 1990.6,
      "transistor_count": 1207.90074743,
      "transistor_count_log10": 3.08
    },
    {
      "year": 1992.4,
      "transistor_count": 1207.90074743,
      "transistor_count_log10": 3.08
    },
    {
      "year": 1992.7,
      "transistor_count": 3105.90022362,
      "transistor_count_log10": 3.49
    },
    {
      "year": 1992.7,
      "transistor_count": 1113.97385999,
      "transistor_count_log10": 3.05
    },
    {
      "year": 1993.0,
      "transistor_count": 1715.43789634,
      "transistor_count_log10": 3.23
    },
    {
      "year": 1993.4,
      "transistor_count": 3105.90022362,
      "transistor_count_log10": 3.49
    },
    {
      "year": 1993.4,
      "transistor_count": 922.239565104,
      "transistor_count_log10": 2.96
    },
    {
      "year": 1994.7,
      "transistor_count": 1910.95297497,
      "transistor_count_log10": 3.28
    },
    {
      "year": 1994.7,
      "transistor_count": 2788.12666541,
      "transistor_count_log10": 3.45
    },
    {
      "year": 1995.4,
      "transistor_count": 9646.61619911,
      "transistor_count_log10": 3.98
    },
    {
      "year": 1995.7,
      "transistor_count": 3105.90022362,
      "transistor_count_log10": 3.49
    },
    {
      "year": 1996.2,
      "transistor_count": 5473.70326288,
      "transistor_count_log10": 3.74
    },
    {
      "year": 1996.3,
      "transistor_count": 6792.52507006,
      "transistor_count_log10": 3.83
    },
    {
      "year": 1996.3,
      "transistor_count": 3651.74127255,
      "transistor_count_log10": 3.56
    },
    {
      "year": 1996.4,
      "transistor_count": 4293.51021008,
      "transistor_count_log10": 3.63
    },
    {
      "year": 1996.8,
      "transistor_count": 9646.61619911,
      "transistor_count_log10": 3.98
    },
    {
      "year": 1997.4,
      "transistor_count": 5473.70326288,
      "transistor_count_log10": 3.74
    },
    {
      "year": 1997.5,
      "transistor_count": 3554.52235561,
      "transistor_count_log10": 3.55
    },
    {
      "year": 1997.5,
      "transistor_count": 8896.4911282,
      "transistor_count_log10": 3.95
    },
    {
      "year": 1997.6,
      "transistor_count": 7566.6953714,
      "transistor_count_log10": 3.88
    },
    {
      "year": 1998.9,
      "transistor_count": 15261.3780258,
      "transistor_count_log10": 4.18
    },
    {
      "year": 1999.1,
      "transistor_count": 9389.79801048,
      "transistor_count_log10": 3.97
    },
    {
      "year": 1999.2,
      "transistor_count": 6978.3058486,
      "transistor_count_log10": 3.84
    },
    {
      "year": 1999.5,
      "transistor_count": 9389.79801048,
      "transistor_count_log10": 3.97
    },
    {
      "year": 1999.5,
      "transistor_count": 21673.9216957,
      "transistor_count_log10": 4.34
    },
    {
      "year": 2000.2,
      "transistor_count": 22266.7201035,
      "transistor_count_log10": 4.35
    },
    {
      "year": 2000.7,
      "transistor_count": 28387.3596476,
      "transistor_count_log10": 4.45
    },
    {
      "year": 2000.7,
      "transistor_count": 37180.2666391,
      "transistor_count_log10": 4.57
    },
    {
      "year": 2001.1,
      "transistor_count": 29163.7757405,
      "transistor_count_log10": 4.46
    },
    {
      "year": 2001.2,
      "transistor_count": 42550.6550247,
      "transistor_count_log10": 4.63
    },
    {
      "year": 2001.7,
      "transistor_count": 25482.9674798,
      "transistor_count_log10": 4.41
    },
    {
      "year": 2001.8,
      "transistor_count": 37180.2666391,
      "transistor_count_log10": 4.57
    },
    {
      "year": 2002.4,
      "transistor_count": 55730.6040127,
      "transistor_count_log10": 4.75
    },
    {
      "year": 2002.8,
      "transistor_count": 38197.1754928,
      "transistor_count_log10": 4.58
    },
    {
      "year": 2002.9,
      "transistor_count": 220673.406908,
      "transistor_count_log10": 5.34
    },
    {
      "year": 2003.4,
      "transistor_count": 151247.254531,
      "transistor_count_log10": 5.18
    },
    {
      "year": 2003.5,
      "transistor_count": 54246.9093701,
      "transistor_count_log10": 4.73
    },
    {
      "year": 2003.7,
      "transistor_count": 106498.563535,
      "transistor_count_log10": 5.03
    },
    {
      "year": 2004.8,
      "transistor_count": 125214.968907,
      "transistor_count_log10": 5.1
    },
    {
      "year": 2004.8,
      "transistor_count": 106498.563535,
      "transistor_count_log10": 5.03
    },
    {
      "year": 2004.8,
      "transistor_count": 273841.963426,
      "transistor_count_log10": 5.44
    },
    {
      "year": 2005.7,
      "transistor_count": 232909.659246,
      "transistor_count_log10": 5.37
    },
    {
      "year": 2005.8,
      "transistor_count": 112403.866377,
      "transistor_count_log10": 5.05
    },
    {
      "year": 2006.0,
      "transistor_count": 305052.789027,
      "transistor_count_log10": 5.48
    },
    {
      "year": 2006.1,
      "transistor_count": 115478.198469,
      "transistor_count_log10": 5.06
    },
    {
      "year": 2006.9,
      "transistor_count": 378551.524926,
      "transistor_count_log10": 5.58
    },
    {
      "year": 2006.9,
      "transistor_count": 155383.983127,
      "transistor_count_log10": 5.19
    },
    {
      "year": 2006.9,
      "transistor_count": 245824.406892,
      "transistor_count_log10": 5.39
    },
    {
      "year": 2007.0,
      "transistor_count": 296931.48482,
      "transistor_count_log10": 5.47
    },
    {
      "year": 2007.0,
      "transistor_count": 582941.534714,
      "transistor_count_log10": 5.77
    },
    {
      "year": 2007.1,
      "transistor_count": 151247.254531,
      "transistor_count_log10": 5.18
    },
    {
      "year": 2007.6,
      "transistor_count": 582941.534714,
      "transistor_count_log10": 5.77
    },
    {
      "year": 2007.7,
      "transistor_count": 232909.659246,
      "transistor_count_log10": 5.37
    },
    {
      "year": 2007.8,
      "transistor_count": 805842.187761,
      "transistor_count_log10": 5.91
    },
    {
      "year": 2007.8,
      "transistor_count": 115478.198469,
      "transistor_count_log10": 5.06
    },
    {
      "year": 2008.0,
      "transistor_count": 509367.521678,
      "transistor_count_log10": 5.71
    },
    {
      "year": 2008.2,
      "transistor_count": 445079.406236,
      "transistor_count_log10": 5.65
    },
    {
      "year": 2008.5,
      "transistor_count": 410469.838044,
      "transistor_count_log10": 5.61
    },
    {
      "year": 2009.2,
      "transistor_count": 457252.669897,
      "transistor_count_log10": 5.66
    },
    {
      "year": 2009.3,
      "transistor_count": 784388.558145,
      "transistor_count_log10": 5.89
    },
    {
      "year": 2009.7,
      "transistor_count": 2308241.52676,
      "transistor_count_log10": 6.36
    },
    {
      "year": 2009.7,
      "transistor_count": 1910952.97497,
      "transistor_count_log10": 6.28
    },
    {
      "year": 2010.2,
      "transistor_count": 410469.838044,
      "transistor_count_log10": 5.61
    },
    {
      "year": 2010.4,
      "transistor_count": 1309747.2643,
      "transistor_count_log10": 6.12
    },
    {
      "year": 2011.2,
      "transistor_count": 1170000.0,
      "transistor_count_log10": 6.07
    },
    {
      "year": 2011.3,
      "transistor_count": 2600000.0,
      "transistor_count_log10": 6.41
    },
    {
      "year": 2011.9,
      "transistor_count": 1200000.0,
      "transistor_count_log10": 6.08
    },
    {
      "year": 2012.4,
      "transistor_count": 2400000.0,
      "transistor_count_log10": 6.38
    },
    {
      "year": 2012.4,
      "transistor_count": 2300000.0,
      "transistor_count_log10": 6.36
    },
    {
      "year": 2012.7,
      "transistor_count": 2100000.0,
      "transistor_count_log10": 6.32
    },
    {
      "year": 2012.9,
      "transistor_count": 1200000.0,
      "transistor_count_log10": 6.08
    },
    {
      "year": 2013.4,
      "transistor_count": 5000000.0,
      "transistor_count_log10": 6.7
    },
    {
      "year": 2013.8,
      "transistor_count": 4300000.0,
      "transistor_count_log10": 6.63
    },
    {
      "year": 2014.2,
      "transistor_count": 4300000.0,
      "transistor_count_log10": 6.63
    },
    {
      "year": 2014.5,
      "transistor_count": 4200000.0,
      "transistor_count_log10": 6.62
    },
    {
      "year": 2014.8,
      "transistor_count": 2600000.0,
      "transistor_count_log10": 6.41
    },
    {
      "year": 2014.8,
      "transistor_count": 3800000.0,
      "transistor_count_log10": 6.58
    },
    {
      "year": 2014.8,
      "transistor_count": 5700000.0,
      "transistor_count_log10": 6.76
    },
    {
      "year": 2016.3,
      "transistor_count": 7200000.0,
      "transistor_count_log10": 6.86
    },
    {
      "year": 2016.7,
      "transistor_count": 8000000.0,
      "transistor_count_log10": 6.9
    },
    {
      "year": 2017.5,
      "transistor_count": 19200000.0,
      "transistor_count_log10": 7.28
    },
    {
      "year": 2018.4,
      "transistor_count": 8000000.0,
      "transistor_count_log10": 6.9
    },
    {
      "year": 2018.5,
      "transistor_count": 21100000.0,
      "transistor_count_log10": 7.32
    },
    {
      "year": 2019.3,
      "transistor_count": 8000000.0,
      "transistor_count_log10": 6.9
    },
    {
      "year": 2019.8,
      "transistor_count": 39500000.0,
      "transistor_count_log10": 7.6
    },
    {
      "year": 2020.1,
      "transistor_count": 30400000.0,
      "transistor_count_log10": 7.48
    },
    {
      "year": 2020.9,
      "transistor_count": 16000000.0,
      "transistor_count_log10": 7.2
    },
    {
      "year": 2021.8,
      "transistor_count": 57000000.0,
      "transistor_count_log10": 7.76
    },
    {
      "year": 2021.9,
      "transistor_count": 58200000.0,
      "transistor_count_log10": 7.76
    },
    {
      "year": 2021.9,
      "transistor_count": 55000000.0,
      "transistor_count_log10": 7.74
    }
  ],
  "clockFrequencyMHz": [
    {
      "year": 1971.9,
      "value": 0.704135515486
    },
    {
      "year": 1972.3,
      "value": 0.509367521678
    },
    {
      "year": 1974.3,
      "value": 2.01691455473
    },
    {
      "year": 1979.6,
      "value": 5.04806571667
    },
    {
      "year": 1982.3,
      "value": 6.09756235221
    },
    {
      "year": 1985.9,
      "value": 16.1076153462
    },
    {
      "year": 1986.2,
      "value": 16.1076153462
    },
    {
      "year": 1988.7,
      "value": 40.3151936286
    },
    {
      "year": 1989.5,
      "value": 24.8045441431
    },
    {
      "year": 1990.6,
      "value": 33.3762469429
    },
    {
      "year": 1992.4,
      "value": 65.5248823737
    },
    {
      "year": 1992.7,
      "value": 60.4296390238
    },
    {
      "year": 1992.7,
      "value": 100.903504484
    },
    {
      "year": 1993.0,
      "value": 198.095677855
    },
    {
      "year": 1993.4,
      "value": 67.3170382414
    },
    {
      "year": 1993.4,
      "value": 40.3151936286
    },
    {
      "year": 1994.7,
      "value": 151.247254531
    },
    {
      "year": 1994.7,
      "value": 296.93148482
    },
    {
      "year": 1995.4,
      "value": 296.93148482
    },
    {
      "year": 1995.7,
      "value": 90.5797775943
    },
    {
      "year": 1996.1,
      "value": 198.095677855
    },
    {
      "year": 1996.3,
      "value": 198.095677855
    },
    {
      "year": 1996.4,
      "value": 90.5797775943
    },
    {
      "year": 1996.8,
      "value": 509.367521678
    },
    {
      "year": 1997.4,
      "value": 252.547893258
    },
    {
      "year": 1997.5,
      "value": 537.611747456
    },
    {
      "year": 1997.5,
      "value": 232.909659246
    },
    {
      "year": 1997.6,
      "value": 296.93148482
    },
    {
      "year": 1998.8,
      "value": 495.806824168
    },
    {
      "year": 1999.1,
      "value": 296.93148482
    },
    {
      "year": 1999.2,
      "value": 399.542055895
    },
    {
      "year": 1999.5,
      "value": 457.252669897
    },
    {
      "year": 1999.5,
      "value": 509.367521678
    },
    {
      "year": 2000.2,
      "value": 743.179548784
    },
    {
      "year": 2000.7,
      "value": 1000.0
    },
    {
      "year": 2001.1,
      "value": 897.687132447
    },
    {
      "year": 2001.2,
      "value": 2016.91455473
    },
    {
      "year": 2001.7,
      "value": 805.842187761
    },
    {
      "year": 2001.8,
      "value": 1420.18116969
    },
    {
      "year": 2002.4,
      "value": 2246.79009181
    },
    {
      "year": 2002.8,
      "value": 1810.55824303
    },
    {
      "year": 2002.9,
      "value": 1000.0
    },
    {
      "year": 2003.4,
      "value": 1175.74326592
    },
    {
      "year": 2003.5,
      "value": 2186.97465501
    },
    {
      "year": 2003.6,
      "value": 1810.55824303
    },
    {
      "year": 2004.8,
      "value": 2641.64832039
    },
    {
      "year": 2004.8,
      "value": 1910.95297497
    },
    {
      "year": 2004.9,
      "value": 3651.74127255
    },
    {
      "year": 2005.7,
      "value": 3190.84898063
    },
    {
      "year": 2005.9,
      "value": 2788.12666541
    },
    {
      "year": 2006.0,
      "value": 1207.90074743
    },
    {
      "year": 2006.0,
      "value": 2246.79009181
    },
    {
      "year": 2006.9,
      "value": 3651.74127255
    },
    {
      "year": 2006.9,
      "value": 2641.64832039
    },
    {
      "year": 2007.0,
      "value": 2713.89943121
    },
    {
      "year": 2007.1,
      "value": 2308.24152676
    },
    {
      "year": 2007.6,
      "value": 2942.72717621
    },
    {
      "year": 2007.7,
      "value": 4655.52593116
    },
    {
      "year": 2007.7,
      "value": 4067.94432108
    },
    {
      "year": 2007.8,
      "value": 2016.91455473
    },
    {
      "year": 2008.0,
      "value": 1420.18116969
    },
    {
      "year": 2008.2,
      "value": 2016.91455473
    },
    {
      "year": 2008.2,
      "value": 2308.24152676
    },
    {
      "year": 2008.5,
      "value": 3023.21302502
    },
    {
      "year": 2009.2,
      "value": 2502.86543117
    },
    {
      "year": 2009.3,
      "value": 3278.12115139
    },
    {
      "year": 2009.4,
      "value": 2641.64832039
    },
    {
      "year": 2009.7,
      "value": 2641.64832039
    },
    {
      "year": 2009.7,
      "value": 3278.12115139
    },
    {
      "year": 2010.2,
      "value": 2308.24152676
    },
    {
      "year": 2011.2,
      "value": 3470.0
    },
    {
      "year": 2011.3,
      "value": 2400.0
    },
    {
      "year": 2011.9,
      "value": 3000.0
    },
    {
      "year": 2012.4,
      "value": 3100.0
    },
    {
      "year": 2012.4,
      "value": 2900.0
    },
    {
      "year": 2012.7,
      "value": 3700.0
    },
    {
      "year": 2012.9,
      "value": 2500.0
    },
    {
      "year": 2013.4,
      "value": 1200.0
    },
    {
      "year": 2013.8,
      "value": 2700.0
    },
    {
      "year": 2014.2,
      "value": 2800.0
    },
    {
      "year": 2014.5,
      "value": 3700.0
    },
    {
      "year": 2014.8,
      "value": 3200.0
    },
    {
      "year": 2014.8,
      "value": 2600.0
    },
    {
      "year": 2014.8,
      "value": 2300.0
    },
    {
      "year": 2016.3,
      "value": 2200.0
    },
    {
      "year": 2016.5,
      "value": 1500.0
    },
    {
      "year": 2016.7,
      "value": 4000.0
    },
    {
      "year": 2017.5,
      "value": 2200.0
    },
    {
      "year": 2017.6,
      "value": 2100.0
    },
    {
      "year": 2017.6,
      "value": 2500.0
    },
    {
      "year": 2018.4,
      "value": 3400.0
    },
    {
      "year": 2018.5,
      "value": 1200.0
    },
    {
      "year": 2019.3,
      "value": 2700.0
    },
    {
      "year": 2019.8,
      "value": 2250.0
    },
    {
      "year": 2020.1,
      "value": 2900.0
    },
    {
      "year": 2020.2,
      "value": 2700.0
    },
    {
      "year": 2020.9,
      "value": 3200.0
    },
    {
      "year": 2021.3,
      "value": 2300.0
    },
    {
      "year": 2021.8,
      "value": 3200.0
    },
    {
      "year": 2021.9,
      "value": 1000.0
    },
    {
      "year": 2021.9,
      "value": 2600.0
    }
  ],
  "coreCount": [
    {
      "year": 1971.9,
      "value": 1.0
    },
    {
      "year": 1972.3,
      "value": 1.0
    },
    {
      "year": 1974.3,
      "value": 1.0
    },
    {
      "year": 1979.6,
      "value": 1.0
    },
    {
      "year": 1982.3,
      "value": 1.0
    },
    {
      "year": 1985.9,
      "value": 1.0
    },
    {
      "year": 1986.2,
      "value": 1.0
    },
    {
      "year": 1988.7,
      "value": 1.0
    },
    {
      "year": 1989.5,
      "value": 1.0
    },
    {
      "year": 1990.6,
      "value": 1.0
    },
    {
      "year": 1992.4,
      "value": 1.0
    },
    {
      "year": 1992.7,
      "value": 1.0
    },
    {
      "year": 1993.0,
      "value": 1.0
    },
    {
      "year": 1993.4,
      "value": 1.0
    },
    {
      "year": 1994.7,
      "value": 1.0
    },
    {
      "year": 1995.4,
      "value": 1.0
    },
    {
      "year": 1995.8,
      "value": 1.0
    },
    {
      "year": 1996.1,
      "value": 1.0
    },
    {
      "year": 1996.5,
      "value": 1.0
    },
    {
      "year": 1996.9,
      "value": 1.0
    },
    {
      "year": 1997.3,
      "value": 1.0
    },
    {
      "year": 1997.5,
      "value": 1.0
    },
    {
      "year": 1997.7,
      "value": 1.0
    },
    {
      "year": 1998.8,
      "value": 1.0
    },
    {
      "year": 1999.2,
      "value": 1.0
    },
    {
      "year": 1999.5,
      "value": 1.0
    },
    {
      "year": 2000.2,
      "value": 1.0
    },
    {
      "year": 2000.7,
      "value": 1.0
    },
    {
      "year": 2001.1,
      "value": 1.0
    },
    {
      "year": 2001.6,
      "value": 1.0
    },
    {
      "year": 2001.8,
      "value": 1.0
    },
    {
      "year": 2002.4,
      "value": 1.0
    },
    {
      "year": 2002.7,
      "value": 1.0
    },
    {
      "year": 2002.9,
      "value": 1.0
    },
    {
      "year": 2003.3,
      "value": 1.0
    },
    {
      "year": 2003.5,
      "value": 1.0
    },
    {
      "year": 2003.7,
      "value": 1.0
    },
    {
      "year": 2004.8,
      "value": 2.0
    },
    {
      "year": 2004.9,
      "value": 1.0
    },
    {
      "year": 2005.7,
      "value": 2.0
    },
    {
      "year": 2005.8,
      "value": 1.0
    },
    {
      "year": 2006.0,
      "value": 8.0
    },
    {
      "year": 2006.1,
      "value": 2.0
    },
    {
      "year": 2006.8,
      "value": 2.0
    },
    {
      "year": 2007.1,
      "value": 2.0
    },
    {
      "year": 2007.6,
      "value": 4.0
    },
    {
      "year": 2007.7,
      "value": 9.0
    },
    {
      "year": 2007.7,
      "value": 2.0
    },
    {
      "year": 2007.9,
      "value": 2.0
    },
    {
      "year": 2008.0,
      "value": 8.0
    },
    {
      "year": 2008.2,
      "value": 4.0
    },
    {
      "year": 2008.5,
      "value": 2.0
    },
    {
      "year": 2009.2,
      "value": 3.0
    },
    {
      "year": 2009.2,
      "value": 4.0
    },
    {
      "year": 2009.5,
      "value": 4.0
    },
    {
      "year": 2009.6,
      "value": 3.0
    },
    {
      "year": 2009.7,
      "value": 8.0
    },
    {
      "year": 2009.7,
      "value": 6.0
    },
    {
      "year": 2010.2,
      "value": 16.0
    },
    {
      "year": 2011.2,
      "value": 12.0
    },
    {
      "year": 2011.3,
      "value": 20.0
    },
    {
      "year": 2011.9,
      "value": 8.0
    },
    {
      "year": 2012.4,
      "value": 16.0
    },
    {
      "year": 2012.4,
      "value": 16.0
    },
    {
      "year": 2012.7,
      "value": 32.0
    },
    {
      "year": 2012.9,
      "value": 16.0
    },
    {
      "year": 2013.4,
      "value": 240.0
    },
    {
      "year": 2013.8,
      "value": 24.0
    },
    {
      "year": 2014.2,
      "value": 30.0
    },
    {
      "year": 2014.5,
      "value": 64.0
    },
    {
      "year": 2014.8,
      "value": 16.0
    },
    {
      "year": 2014.8,
      "value": 24.0
    },
    {
      "year": 2014.8,
      "value": 36.0
    },
    {
      "year": 2016.3,
      "value": 44.0
    },
    {
      "year": 2016.5,
      "value": 272.0
    },
    {
      "year": 2016.7,
      "value": 96.0
    },
    {
      "year": 2017.5,
      "value": 64.0
    },
    {
      "year": 2017.6,
      "value": 44.0
    },
    {
      "year": 2017.6,
      "value": 56.0
    },
    {
      "year": 2018.4,
      "value": 88.0
    },
    {
      "year": 2018.5,
      "value": 80.0
    },
    {
      "year": 2019.3,
      "value": 56.0
    },
    {
      "year": 2019.8,
      "value": 128.0
    },
    {
      "year": 2020.1,
      "value": 128.0
    },
    {
      "year": 2020.2,
      "value": 56.0
    },
    {
      "year": 2020.9,
      "value": 8.0
    },
    {
      "year": 2021.3,
      "value": 80.0
    },
    {
      "year": 2021.8,
      "value": 10.0
    },
    {
      "year": 2021.9,
      "value": 208.0
    },
    {
      "year": 2021.9,
      "value": 64.0
    }
  ],
  "aiPricingHistory": [
    {
      "date": "2020-06-11",
      "provider": "OpenAI",
      "model": "GPT-3 (davinci)",
      "input_per_mtok": 60.0,
      "output_per_mtok": 60.0,
      "notes": "Original GPT-3 API launch pricing"
    },
    {
      "date": "2022-01-27",
      "provider": "OpenAI",
      "model": "GPT-3 (text-davinci-002)",
      "input_per_mtok": 20.0,
      "output_per_mtok": 20.0,
      "notes": "InstructGPT models"
    },
    {
      "date": "2023-03-01",
      "provider": "OpenAI",
      "model": "GPT-3.5-turbo",
      "input_per_mtok": 2.0,
      "output_per_mtok": 2.0,
      "notes": "ChatGPT API launch"
    },
    {
      "date": "2023-03-14",
      "provider": "OpenAI",
      "model": "GPT-4",
      "input_per_mtok": 30.0,
      "output_per_mtok": 60.0,
      "notes": "GPT-4 launch"
    },
    {
      "date": "2023-03-14",
      "provider": "Anthropic",
      "model": "Claude 1",
      "input_per_mtok": 11.02,
      "output_per_mtok": 32.68,
      "notes": "Claude API launch"
    },
    {
      "date": "2023-06-13",
      "provider": "OpenAI",
      "model": "GPT-3.5-turbo (June)",
      "input_per_mtok": 1.5,
      "output_per_mtok": 2.0,
      "notes": "Price reduction"
    },
    {
      "date": "2023-07-06",
      "provider": "OpenAI",
      "model": "GPT-4 (July)",
      "input_per_mtok": 30.0,
      "output_per_mtok": 60.0,
      "notes": "GPT-4 GA"
    },
    {
      "date": "2023-07-11",
      "provider": "Anthropic",
      "model": "Claude 2",
      "input_per_mtok": 11.02,
      "output_per_mtok": 32.68,
      "notes": "Claude 2 launch"
    },
    {
      "date": "2023-11-06",
      "provider": "OpenAI",
      "model": "GPT-4-turbo",
      "input_per_mtok": 10.0,
      "output_per_mtok": 30.0,
      "notes": "DevDay announcement"
    },
    {
      "date": "2023-12-13",
      "provider": "Google",
      "model": "Gemini Pro",
      "input_per_mtok": 0.5,
      "output_per_mtok": 1.5,
      "notes": "Gemini API launch"
    },
    {
      "date": "2024-01-25",
      "provider": "OpenAI",
      "model": "GPT-3.5-turbo-0125",
      "input_per_mtok": 0.5,
      "output_per_mtok": 1.5,
      "notes": "Further price cut"
    },
    {
      "date": "2024-02-15",
      "provider": "Google",
      "model": "Gemini 1.0 Ultra",
      "input_per_mtok": 7.0,
      "output_per_mtok": 21.0,
      "notes": "Ultra tier"
    },
    {
      "date": "2024-03-04",
      "provider": "Anthropic",
      "model": "Claude 3 Opus",
      "input_per_mtok": 15.0,
      "output_per_mtok": 75.0,
      "notes": "Claude 3 family launch"
    },
    {
      "date": "2024-03-04",
      "provider": "Anthropic",
      "model": "Claude 3 Sonnet",
      "input_per_mtok": 3.0,
      "output_per_mtok": 15.0,
      "notes": "Claude 3 family"
    },
    {
      "date": "2024-03-04",
      "provider": "Anthropic",
      "model": "Claude 3 Haiku",
      "input_per_mtok": 0.25,
      "output_per_mtok": 1.25,
      "notes": "Claude 3 family"
    },
    {
      "date": "2024-05-13",
      "provider": "OpenAI",
      "model": "GPT-4o",
      "input_per_mtok": 5.0,
      "output_per_mtok": 15.0,
      "notes": "GPT-4o launch"
    },
    {
      "date": "2024-05-14",
      "provider": "Google",
      "model": "Gemini 1.5 Pro",
      "input_per_mtok": 3.5,
      "output_per_mtok": 10.5,
      "notes": "1.5 Pro launch"
    },
    {
      "date": "2024-05-14",
      "provider": "Google",
      "model": "Gemini 1.5 Flash",
      "input_per_mtok": 0.35,
      "output_per_mtok": 1.05,
      "notes": "Flash tier"
    },
    {
      "date": "2024-06-20",
      "provider": "Anthropic",
      "model": "Claude 3.5 Sonnet",
      "input_per_mtok": 3.0,
      "output_per_mtok": 15.0,
      "notes": "3.5 Sonnet launch"
    },
    {
      "date": "2024-07-18",
      "provider": "OpenAI",
      "model": "GPT-4o-mini",
      "input_per_mtok": 0.15,
      "output_per_mtok": 0.6,
      "notes": "Mini model launch"
    },
    {
      "date": "2024-09-12",
      "provider": "OpenAI",
      "model": "o1-preview",
      "input_per_mtok": 15.0,
      "output_per_mtok": 60.0,
      "notes": "Reasoning model"
    },
    {
      "date": "2024-09-12",
      "provider": "OpenAI",
      "model": "o1-mini",
      "input_per_mtok": 3.0,
      "output_per_mtok": 12.0,
      "notes": "Reasoning model (mini)"
    },
    {
      "date": "2024-09-24",
      "provider": "Google",
      "model": "Gemini 1.5 Pro (Sept price cut)",
      "input_per_mtok": 1.25,
      "output_per_mtok": 5.0,
      "notes": "Price reduction"
    },
    {
      "date": "2024-09-24",
      "provider": "Google",
      "model": "Gemini 1.5 Flash (Sept price cut)",
      "input_per_mtok": 0.075,
      "output_per_mtok": 0.3,
      "notes": "Price reduction"
    },
    {
      "date": "2024-12-11",
      "provider": "Google",
      "model": "Gemini 2.0 Flash",
      "input_per_mtok": 0.1,
      "output_per_mtok": 0.4,
      "notes": "2.0 Flash launch"
    },
    {
      "date": "2025-01-31",
      "provider": "OpenAI",
      "model": "o3-mini",
      "input_per_mtok": 1.1,
      "output_per_mtok": 4.4,
      "notes": "o3-mini launch"
    },
    {
      "date": "2025-02-24",
      "provider": "Anthropic",
      "model": "Claude 3.5 Haiku",
      "input_per_mtok": 0.8,
      "output_per_mtok": 4.0,
      "notes": "3.5 Haiku launch"
    },
    {
      "date": "2025-02-24",
      "provider": "Anthropic",
      "model": "Claude 3.7 Sonnet",
      "input_per_mtok": 3.0,
      "output_per_mtok": 15.0,
      "notes": "3.7 Sonnet with extended thinking"
    },
    {
      "date": "2025-03-25",
      "provider": "Google",
      "model": "Gemini 2.5 Pro",
      "input_per_mtok": 1.25,
      "output_per_mtok": 10.0,
      "notes": "2.5 Pro with thinking"
    },
    {
      "date": "2025-04-16",
      "provider": "OpenAI",
      "model": "GPT-4.1",
      "input_per_mtok": 2.0,
      "output_per_mtok": 8.0,
      "notes": "GPT-4.1 launch"
    },
    {
      "date": "2025-04-16",
      "provider": "OpenAI",
      "model": "GPT-4.1-mini",
      "input_per_mtok": 0.4,
      "output_per_mtok": 1.6,
      "notes": "GPT-4.1-mini launch"
    },
    {
      "date": "2025-04-16",
      "provider": "OpenAI",
      "model": "GPT-4.1-nano",
      "input_per_mtok": 0.1,
      "output_per_mtok": 0.4,
      "notes": "GPT-4.1-nano launch"
    }
  ],
  "aiCheapestTimeline": [
    {
      "date": "2020-06-11",
      "model": "GPT-3 (davinci)",
      "provider": "OpenAI",
      "input_per_mtok": 60.0,
      "output_per_mtok": 60.0
    },
    {
      "date": "2022-01-27",
      "model": "GPT-3 (text-davinci-002)",
      "provider": "OpenAI",
      "input_per_mtok": 20.0,
      "output_per_mtok": 20.0
    },
    {
      "date": "2023-03-01",
      "model": "GPT-3.5-turbo",
      "provider": "OpenAI",
      "input_per_mtok": 2.0,
      "output_per_mtok": 2.0
    },
    {
      "date": "2023-06-13",
      "model": "GPT-3.5-turbo (June)",
      "provider": "OpenAI",
      "input_per_mtok": 1.5,
      "output_per_mtok": 2.0
    },
    {
      "date": "2023-12-13",
      "model": "Gemini Pro",
      "provider": "Google",
      "input_per_mtok": 0.5,
      "output_per_mtok": 1.5
    },
    {
      "date": "2024-03-04",
      "model": "Claude 3 Haiku",
      "provider": "Anthropic",
      "input_per_mtok": 0.25,
      "output_per_mtok": 1.25
    },
    {
      "date": "2024-07-18",
      "model": "GPT-4o-mini",
      "provider": "OpenAI",
      "input_per_mtok": 0.15,
      "output_per_mtok": 0.6
    },
    {
      "date": "2024-09-24",
      "model": "Gemini 1.5 Flash (Sept price cut)",
      "provider": "Google",
      "input_per_mtok": 0.075,
      "output_per_mtok": 0.3
    }
  ],
  "geneTherapyByYear": [
    {
      "year": 2017,
      "new_approvals": 3,
      "cumulative": 3
    },
    {
      "year": 2020,
      "new_approvals": 1,
      "cumulative": 4
    },
    {
      "year": 2021,
      "new_approvals": 2,
      "cumulative": 6
    },
    {
      "year": 2022,
      "new_approvals": 5,
      "cumulative": 11
    },
    {
      "year": 2023,
      "new_approvals": 7,
      "cumulative": 18
    },
    {
      "year": 2024,
      "new_approvals": 2,
      "cumulative": 20
    }
  ],
  "geneTherapyList": [
    {
      "name": "Kymriah (tisagenlecleucel)",
      "company": "Novartis",
      "approval_date": "2017-08-30",
      "year": 2017,
      "type": "CAR-T cell therapy",
      "indication": "B-cell ALL"
    },
    {
      "name": "Yescarta (axicabtagene ciloleucel)",
      "company": "Kite/Gilead",
      "approval_date": "2017-10-18",
      "year": 2017,
      "type": "CAR-T cell therapy",
      "indication": "Large B-cell lymphoma"
    },
    {
      "name": "Luxturna (voretigene neparvovec)",
      "company": "Spark Therapeutics",
      "approval_date": "2017-12-19",
      "year": 2017,
      "type": "AAV gene therapy",
      "indication": "Inherited retinal dystrophy"
    },
    {
      "name": "Tecartus (brexucabtagene autoleucel)",
      "company": "Kite/Gilead",
      "approval_date": "2020-07-24",
      "year": 2020,
      "type": "CAR-T cell therapy",
      "indication": "Mantle cell lymphoma"
    },
    {
      "name": "Breyanzi (lisocabtagene maraleucel)",
      "company": "Bristol Myers Squibb",
      "approval_date": "2021-02-05",
      "year": 2021,
      "type": "CAR-T cell therapy",
      "indication": "Large B-cell lymphoma"
    },
    {
      "name": "Abecma (idecabtagene vicleucel)",
      "company": "Bristol Myers Squibb",
      "approval_date": "2021-03-26",
      "year": 2021,
      "type": "CAR-T cell therapy",
      "indication": "Multiple myeloma"
    },
    {
      "name": "Carvykti (ciltacabtagene autoleucel)",
      "company": "Janssen/Legend Biotech",
      "approval_date": "2022-02-28",
      "year": 2022,
      "type": "CAR-T cell therapy",
      "indication": "Multiple myeloma"
    },
    {
      "name": "Zynteglo (betibeglogene autotemcel)",
      "company": "bluebird bio",
      "approval_date": "2022-08-17",
      "year": 2022,
      "type": "Gene therapy (lentiviral)",
      "indication": "Beta-thalassemia"
    },
    {
      "name": "Skysona (elivaldogene autotemcel)",
      "company": "bluebird bio",
      "approval_date": "2022-09-16",
      "year": 2022,
      "type": "Gene therapy (lentiviral)",
      "indication": "Cerebral adrenoleukodystrophy"
    },
    {
      "name": "Hemgenix (etranacogene dezaparvovec)",
      "company": "CSL Behring",
      "approval_date": "2022-11-22",
      "year": 2022,
      "type": "AAV gene therapy",
      "indication": "Hemophilia B"
    },
    {
      "name": "Adstiladrin (nadofaragene firadenovec)",
      "company": "Ferring",
      "approval_date": "2022-12-16",
      "year": 2022,
      "type": "Gene therapy (adenoviral)",
      "indication": "Bladder cancer"
    },
    {
      "name": "Omisirge (omidubicel)",
      "company": "Gamida Cell",
      "approval_date": "2023-04-17",
      "year": 2023,
      "type": "Cell therapy",
      "indication": "Hematopoietic stem cell transplant"
    },
    {
      "name": "Vyjuvek (beremagene geperpavec)",
      "company": "Krystal Biotech",
      "approval_date": "2023-05-19",
      "year": 2023,
      "type": "Gene therapy (HSV-1 vector)",
      "indication": "Dystrophic epidermolysis bullosa"
    },
    {
      "name": "Elevidys (delandistrogene moxeparvovec)",
      "company": "Sarepta Therapeutics",
      "approval_date": "2023-06-22",
      "year": 2023,
      "type": "AAV gene therapy",
      "indication": "Duchenne muscular dystrophy"
    },
    {
      "name": "Lantidra (donislecel)",
      "company": "CellTrans",
      "approval_date": "2023-06-28",
      "year": 2023,
      "type": "Allogeneic cell therapy",
      "indication": "Type 1 diabetes"
    },
    {
      "name": "Roctavian (valoctocogene roxaparvovec)",
      "company": "BioMarin",
      "approval_date": "2023-06-29",
      "year": 2023,
      "type": "AAV gene therapy",
      "indication": "Hemophilia A"
    },
    {
      "name": "Casgevy (exagamglogene autotemcel)",
      "company": "Vertex/CRISPR Therapeutics",
      "approval_date": "2023-12-08",
      "year": 2023,
      "type": "CRISPR gene-edited cell therapy",
      "indication": "Sickle cell disease"
    },
    {
      "name": "Lyfgenia (lovotibeglogene autotemcel)",
      "company": "bluebird bio",
      "approval_date": "2023-12-08",
      "year": 2023,
      "type": "Gene therapy (lentiviral)",
      "indication": "Sickle cell disease"
    },
    {
      "name": "Amtagvi (lifileucel)",
      "company": "Iovance",
      "approval_date": "2024-02-16",
      "year": 2024,
      "type": "TIL cell therapy",
      "indication": "Melanoma"
    },
    {
      "name": "Tecelra (afamitresgene autoleucel)",
      "company": "Adaptimmune",
      "approval_date": "2024-08-02",
      "year": 2024,
      "type": "TCR-T cell therapy",
      "indication": "Synovial sarcoma"
    }
  ]
};
