# SponsorMatch AI 🎯
> **Qloo Agentic Hackathon Entry**  
> *Transforming live event cultural identity into evidence-backed, non-obvious sponsor partnerships and activation decks via Qloo's taste graph.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Qloo Taste Graph](https://img.shields.io/badge/Powered%20By-Qloo%20Taste%20Graph-505a64)](https://docs.qloo.com)
[![Grounding Rate](https://img.shields.io/badge/Grounding%20Rate-100%25-emerald)](eval/benchmark_report.md)
[![Sub-Second Cached](https://img.shields.io/badge/Judge%20First--Run-%3C%202s-amber)]()

---

## 1. Executive Summary & The Problem

Traditional event sponsorship is sold using blunt demographic decks (*"60% Male, 18–34, \$75k HHI"*). These decks say virtually nothing about what attendees actually buy, wear, drink, and love. As a result:
- Event organizers pitch the same ubiquitous mega-brands (Red Bull, Nike, Heineken).
- Challenger brands cannot verify if an audience genuinely aligns with their subculture.
- Plain LLMs guess brand fit using lazy stereotypes, fabricating ungrounded statistics.

### The Qloo Difference (The Golden Rule)
**SponsorMatch AI** replaces guesswork with mathematical cultural intelligence. By traversing Qloo’s taste graph across artists, dining, fashion, media, and brands:
1. **100% Evidence Grounded**: Every sponsor claim links directly to a verifiable Qloo query record.
2. **Obvious vs. Non-Obvious Classification**: Separates global behemoths from boutique brands with extreme cultural lift for this specific crowd.
3. **With / Without Qloo Comparison (F8)**: Side-by-side audit exposing plain LLM hallucinations against Qloo-grounded evidence.
4. **Honest Abstention (F6)**: Visibly abstains when taste data is thin rather than inventing fictional affinities.

---

## 2. 8-Stage Agentic Architecture

SponsorMatch executes an auditable, deterministic-and-agentic pipeline with typed inputs and isolated stages:

```
[Event Input] 
      │
      ▼
1. PLANNER      ───> Determines minimum Qloo queries & quota budget (≤ 8 calls)
      │
      ▼
2. RESOLVER     ───> Disambiguates artists & venue via Qloo GET /search
      │
      ▼
3. PROFILER     ───> Discovers cross-domain affinities (dining, music, lifestyle)
      │
      ▼
4. BRAND FINDER ───> Discovers candidate brands via GET /v2/insights (urn:entity:brand)
      │
      ▼
5. RANKER       ───> Computes Lift via log-scale popularity normalization
      │
      ▼
6. VALIDATOR    ───> Enforces category exclusivity & budget guardrails; checks data sufficiency
      │
      ▼
7. WRITER       ───> Generates CMO pitch letters & on-site activation concepts (strictly evidence-bounded)
      │
      ▼
8. AUDITOR      ───> Validates all claims against evidence store (100% grounding rate)
      │
      ▼
[Interactive B2B Pitch Deck, Evidence Trace & With/Without Qloo Audit]
```

---

## 3. Mathematical Scoring & Normalization Methodology

To satisfy judges and prevent ubiquitous brands from dominating every recommendation, SponsorMatch applies log-scale popularity normalization:

1. **Raw Affinity Score ($S_{\text{raw}}$)**: The relevance score returned by Qloo ($0.00$ to $1.00$).
2. **General Popularity Index ($P$)**: The brand's general fame returned by Qloo ($0.01$ to $1.00$).
3. **Cultural Lift / Over-Indexing Ratio**:
   $$\text{Lift} = \frac{S_{\text{raw}}}{\max(P, 0.05)^{0.65}}$$
4. **Obvious vs. Non-Obvious Tagging**:
   - **Obvious Giant**: $P \ge 0.75$ and $S_{\text{raw}} \ge 0.75$ (e.g. Red Bull, Nike, Heineken).
   - **Non-Obvious High-Lift**: $\text{Lift} \ge 1.35$ and $P < 0.65$ (e.g. Liquid Death, Teenage Engineering, Topo Chico, Maurten, Aesop).
5. **Confidence Tiers**:
   - **High**: Supported by $\ge 2$ resolved entities, raw affinity $\ge 0.75$, explainability contribution $\ge 0.20$.
   - **Medium**: Supported by 1 resolved entity, raw affinity $\ge 0.60$.
   - **Low**: Thin signal margin.

---

## 4. Qloo API Endpoints Used

| Endpoint | Method | Key Parameters | Role in SponsorMatch |
|---|---|---|---|
| `/search` | `GET` | `query`, `types` (`urn:entity:artist`, `urn:entity:place`), `take=5` | Entity resolution & interactive disambiguation |
| `/v2/insights` | `GET` | `filter.type=urn:entity:place`, `signal.interests.entities`, `take=8` | Cross-domain dining & venue culture profiling |
| `/v2/insights` | `GET` | `filter.type=urn:entity:artist`, `signal.interests.entities`, `take=8` | Sonic & performer lifestyle profiling |
| `/v2/insights` | `GET` | `filter.type=urn:entity:brand`, `signal.interests.entities`, `feature.explainability=true`, `take=40` | Brand discovery with mathematical entity attribution |

### Authentication & Security
- Hackathon API Base URL: `https://hackathon.api.qloo.com`
- Header: `X-Api-Key: YOUR_API_KEY`
- **Zero Client Exposure**: The browser never sees the Qloo API key. All calls route through our backend server.

---

## 5. Judge Walkthrough & One-Click Presets

Judges can evaluate SponsorMatch in under 60 seconds with **zero setup**:
1. **Click a Sample Event Card**:
   - **Desert Daze Festival 2026** (Neo-Psychedelia, Krautrock, Lake Perris CA) $\rightarrow$ surfaces *Liquid Death*, *Teenage Engineering*, *Topo Chico*, *Aesop*.
   - **Sónar Festival Barcelona 2026** (Advanced Electronic & Creative AI) $\rightarrow$ surfaces *Pioneer DJ*, *Club-Mate*, *Sennheiser*, *Polestar*.
   - **Chicago Marathon 2026** (World Marathon Major Athletics) $\rightarrow$ surfaces *Maurten Hydrogel*, *On Running*, *WHOOP*, *Athletic Brewing*.
2. **Instant Pre-Warmed Results**: Loads in under 2 seconds from server cache with 0 Qloo quota consumed.
3. **Inspect the Evidence Trace**: Open the drawer in the top nav to inspect the exact redacted requests, timestamps, and raw score snippets.
4. **Compare With/Without Qloo (F8)**: Click *"With vs. Without Qloo"* to see how an LLM hallucinates fake metrics (*"68% drink energy drinks"*) while SponsorMatch cites verified affinities.
5. **Test Closed-Loop Feedback (F10)**: Click the thumbs-down icon on any brand, select a constraint (e.g. *"Category already sold"*), and watch the agent re-rank existing evidence instantly with zero extra API calls.

---

## 6. Evaluation Benchmark Results (10 Events)

We executed an automated repeatable benchmark across 10 diverse events (festivals, urban marathons, motorsport, and adversarial thin-data tests). See [`eval/benchmark_report.md`](eval/benchmark_report.md) for full traces:

| Metric | SponsorMatch AI Agent | Plain LLM Baseline | Hackathon Target |
|---|---|---|---|
| **Quantitative Grounding Rate** | **100%** (All numbers footnoted) | ~15% (Hallucinated demographics) | $\ge 95\%$ |
| **Unverifiable Claim Count** | **0** | Multiple per generation | Near 0 |
| **Non-Obvious Brand Share** | **> 60%** | $< 10\%$ (Generic mega-brands) | $\ge 50\%$ |
| **Abstention Accuracy** | **100%** (Halts on unresolvable entities) | 0% (Hallucinates fake sponsors) | 100% |
| **Average Run Latency** | **< 20ms** (Cached) / **< 3s** (Live) | ~5,000ms | $< 5,000ms |

---

## 7. Clean Environment Setup & Run Instructions

### Prerequisites
- Node.js 20+ (Node 22 or 24 recommended)
- npm 10+

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/SponsorMatch.git
cd SponsorMatch
```

### Step 2: Configure Environment
Copy `.env.example` to `server/.env` (optional: add your Qloo hackathon API key; if omitted, the app runs in full offline pre-warmed mode):
```bash
cp .env.example server/.env
```

### Step 3: Install & Start Everything
```bash
# Install root and workspace dependencies
npm install

# Run backend (port 3001) and frontend (port 5173) concurrently:
npm run dev
```

Open your browser to:
**http://localhost:5173**

### Option B: Unified Production Build (Single Port 3001)
```bash
npm run build
npm start
# Serves both production frontend and API on http://localhost:3001
```

### Option C: Docker Containerization
```bash
docker build -t sponsormatch .
docker run -p 3001:3001 -e QLOO_API_KEY="your_api_key_here" sponsormatch
```

### Option D: 1-Click Cloud Deployment (Render / Railway / Fly.io)
This repository includes a `render.yaml` Blueprint and multi-stage `Dockerfile`.
1. Push repo to GitHub.
2. In Render / Railway, select "Deploy from GitHub repo".
3. Add `QLOO_API_KEY` in environment variables.
4. Your live app is instantly accessible on the web!

To run the automated evaluation suite:
```bash
npm run eval
```

---

## 8. Known Limitations & Regulatory Statement

- **Aggregate Affinities, Not Individual Surveillance**: Qloo's data represents aggregate cultural affinities across populations. SponsorMatch describes cultural over-indexing and taste overlap; it does not track or profile individual event attendees.
- **Affinity vs. Causal Conversion**: We demonstrate subcultural alignment and lift, not guaranteed purchase conversion or contract pricing.
- **Brand Entity Coverage**: Qloo's brand graph is strongest in consumer packaged goods, beverages, audio tech, fashion, and lifestyle. For highly localized regional B2B services, the agent visibly marks candidates with Low Confidence or abstains.

---

## 9. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
