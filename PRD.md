SponsorMatch AI: Product Requirements Document
Qloo Agentic Hackathon entry. Draft v1, October 18, 2026. Submission deadline: October 30, 2026, 11:45pm EDT.
1. Summary
One-liner: SponsorMatch is an agent that turns an event's cultural identity (lineup, venue, speakers) into a ranked, evidence-backed list of non-obvious sponsor brands, plus a ready-to-send pitch and on-site activation concepts for each.
The problem. Sponsorship is sold with demographic decks ("60% male, 18-34") that say nothing about what attendees actually buy, wear, drink or love. Organizers pitch the same obvious brands, and brands cannot tell which events truly reach their customer.
Why Qloo is the core. Qloo's taste graph links entities across music, film, dining, fashion, brands and more. SponsorMatch traverses it from event to audience affinities to brands. An LLM alone cannot produce this: it guesses brand fit from stereotypes. Every sponsor claim in SponsorMatch is tied to a Qloo result the user can inspect. If Qloo is removed, the product has nothing to say, which satisfies the hackathon's golden rule.
Primary buyer: event organizers, venues and sports/entertainment teams with a sponsorship sales function. Secondary buyer: brand and agency partnership teams evaluating events (phase 2).
2. Hackathon constraints (from the official pages and kit)
These are hard requirements. The PRD is designed around them.
Requirement
Source
Implication
Live, hosted, fully published demo that judges can use end to end
Devpost "What to Submit"
No local-only app. Must work for a stranger with no setup.
Public repo with all source, assets and run instructions
Devpost
Clean README, no secrets, reproducible from clean environment.
Open-source license file visible in the repo's About section
Devpost
Add MIT or Apache-2.0 on day 1 and confirm it shows in About.
Text description of what it does and what makes it Qloo-powered
Devpost
Draft in week 1, not on the last night.
Demo video not required
Devpost
Judges use the live app, so first-run experience is the product.
Judging: Technological Implementation, Design, Potential Impact, Quality of the Idea
Devpost
Each maps to a section below (see section 14).
Credential is individual: never in source control, a browser app, public MCP config or a demo
Kit API_ACCESS
All Qloo calls go through our backend. Never ship a key to the client.
Supported surfaces: qloo explore, qloo exec, qloo api, qloo mcp from @qloo/qloo-harness (Node 22.19+, version 0.1.26+)
Kit README / API_ACCESS
Backend must be able to start a local process, so use a host with a long-running Node server, not edge-only serverless.
Event quota and rate limit apply; use smallest request, cache what you need, bounded retries, no bulk scraping
Kit API_ACCESS
Caching, request budgets and graceful degradation are core features.
Results are aggregate affinities, not evidence about an individual
Kit README
Copy and UI must never claim to know a specific person's behavior.
Submission guide: problem statement, workflows used, redacted request-to-result trace, screenshots, clean-environment setup, known limitations
Kit SUBMISSION
Built into the product as an Evidence Trace view and a LIMITATIONS section.
The harness exposes workflows to find Qloo tags, describe an entity, discover recommendations, compare audiences, rank a shortlist, and investigate trends and geographic popularity. Open item: exact workflow names, input schemas and brand-entity coverage must be confirmed in the Day 1 spike (section 12). This PRD names capabilities, not command syntax, on purpose.
3. Users and jobs to be done
Persona A: Sponsorship sales lead at a festival, venue or sports team (primary).
• Job: "Give me a shortlist of brands that genuinely fit my crowd, with a pitch I can send today."
• Pain: relies on gut feel, last year's sponsors, and generic decks.
• Success: finds 2-3 sponsor categories they had not considered, each with defensible evidence.
Persona B: Brand partnerships manager or agency planner (secondary, phase 2).
• Job: "Tell me which of these 10 events overlaps most with my customer."
• Pain: cannot verify audience claims in sponsorship decks.
Persona C: Hackathon judge (the real first user).
• Job: "Let me try it in 60 seconds and see why this could not be done without Qloo."
• Implication: one-click sample events, instant results from cache, a visible with/without-Qloo comparison, and an evidence trace.
4. Goals, non-goals and success metrics
Goals
1. Convert an event (or lineup) into 5 ranked sponsor categories and 10-15 specific brand candidates, each with cited Qloo evidence.
2. Generate a one-page pitch and 2-3 activation concepts per top brand, with every quantitative claim traceable.
3. Abstain visibly when data is thin rather than inventing a match.
4. Prove value against an LLM-only baseline with a repeatable evaluation.
5. Ship a polished, hosted, judge-ready product by October 29.
Non-goals (v1)
• No real sponsor contact data, outreach sending, or CRM integration.
• No individual-level attendee data or profiling.
• No contract, pricing or budget negotiation engine (a budget filter only).
• No mobile app; responsive web only.
• No claim of causal ROI. We claim cultural affinity, not purchase conversion.
Success metrics (hackathon)
Metric
Target
Time from sample event click to first results
under 5 seconds (cached), under 60 seconds (live)
Claims in the final report with a linked Qloo evidence ID
100% of quantitative claims
Ungrounded/unverifiable brand claims, agent vs LLM-only baseline, on 10 test events
agent at or near 0; baseline measurably higher
Live demo uptime during judging window
no failures on the 3 sample events; clear error state otherwise
Clean-environment setup from README
works in under 15 minutes
5. Product scope
5.1 Core user flow
1. Describe the event. User enters an event name, or builds one manually: headliners/artists, venue, city, expected attendance, budget range for sponsors, and categories already sold (exclusivity).
2. Entity resolution. Agent searches Qloo for each named entity. If ambiguous (two artists with the same name), it shows a disambiguation chooser. Nothing proceeds on a guessed entity.
3. Audience profile. Agent builds a cross-domain taste profile of the event's crowd: music neighbors, dining, fashion, media, and brand affinities, with confidence levels.
4. Sponsor discovery. Agent traverses from the profile into brand territory, ranks candidate brands and categories, and separates obvious (high popularity everywhere) from non-obvious (high lift for this crowd).
5. Validation. Guardrails check exclusivity conflicts, budget fit, and data sufficiency. Weak candidates are dropped or labeled low-confidence.
6. Synthesis. Agent writes pitches and activation concepts using only the validated evidence.
7. Review and export. User reviews, thumbs-up/down individual brands, triggers re-planning, and exports the report.
5.2 Feature list and priority
ID
Feature
Priority
F1
Event input form plus 3 one-click sample events
P0
F2
Qloo entity resolution with disambiguation dialog
P0
F3
Cross-domain audience profile (music, dining, fashion, media)
P0
F4
Brand and category ranking with obvious vs non-obvious split
P0
F5
Evidence Trace panel: every claim links to a redacted request-to-result record
P0
F6
Abstention and confidence labels (High / Medium / Low / Insufficient data)
P0
F7
Per-brand pitch (one page) and 2-3 activation concepts
P0
F8
With/without-Qloo comparison view (LLM-only baseline side by side)
P0
F9
Exclusivity and budget guardrails
P1
F10
Feedback loop: reject a brand, agent re-ranks and explains the change
P1
F11
Export report as PDF or Markdown
P1
F12
Geographic angle: local trend and popularity check for the venue's city
P1
F13
Compare two events for one brand (brand-side persona)
P2
F14
Shareable report link
P2
Cut order if time runs short: F14, F13, F12, F11, F10. Never cut F5, F6 or F8: they carry the judging story.
6. Agent architecture
6.1 Pipeline
A staged, supervised pipeline rather than one free-roaming agent. Each stage has typed inputs and outputs, so failures are isolated and every step is loggable.
1. Planner. Reads the event input, decides the minimum set of Qloo requests needed, and sets a request budget for this run.
2. Resolver. Resolves each entity (and relevant tags) in Qloo. Returns resolved IDs, or a disambiguation request.
3. Profiler. Builds the audience taste profile from the resolved entities: related music, dining, fashion and media affinities.
4. Brand Finder. Traverses into brand-type results from the profile, producing a candidate pool with scores.
5. Ranker. Applies the scoring method in section 7 and splits obvious from non-obvious.
6. Validator. Checks evidence sufficiency, exclusivity, budget fit. Emits keep / downgrade / drop with reasons.
7. Writer. An LLM that generates pitch text and activation ideas. It receives only validated, structured evidence and is forbidden from adding brand facts or numbers not in that input.
8. Auditor. A final pass that checks every number and brand claim in the Writer output against the evidence store, and strips or flags anything unmatched.
The LLM is used for planning, summarizing and writing. All brand and affinity facts come from Qloo results. This separation is the main hallucination control and the thing to emphasize to Nicole Seligman's and Mike Diolosa's angles.
6.2 Tools exposed to the agent
Thin wrappers over the harness, each returning a normalized result with provenance:
• resolve_entity(name, type_hint)
• profile_audience(entity_ids, domains)
• discover_brands(profile, filters)
• compare_audience(entity_set_a, entity_set_b) for lift against a reference baseline, if supported
• rank_shortlist(candidates, signals) if supported
• local_popularity(entity, city) if supported (F12)
Every tool call writes an evidence record: tool name, redacted parameters, entity IDs, returned scores, timestamp, cache hit or miss. No credential or personal data is ever stored.
6.3 State and memory
Per-run state: resolved entities, evidence records, candidate pool, ranking, validator decisions, user feedback. Persist per run in a lightweight store so the Evidence Trace and report can be re-opened.
6.4 Closed loop (F10)
When a user rejects a brand ("we already have a beverage partner" or "not on brand"), the agent records the reason as a constraint, re-runs Ranker and Validator on the existing evidence (no new Qloo calls where avoidable), and shows what changed and why.
7. Scoring and evidence methodology
This is the technical heart of the project. The principle: we only state what Qloo returned or what we computed from two returned numbers, and we show the arithmetic.
1. Affinity. Use the affinity or relevance score Qloo returns for each candidate brand against the event's audience profile. Do not invent or rescale it silently.
2. Popularity normalization. Brands that are popular everywhere will always rank high. Apply log-scale popularity normalization (the technique the strongest competing entries used) so the ranking reflects over-indexing for this crowd, not general fame.
3. Lift versus baseline. Where the harness supports audience comparison, compute lift of this event's audience against a clearly named reference audience (for example a generic live-music audience). If a comparable baseline is not available, report affinity only and do not state a multiple. Never publish a statement like "3.2x" unless both underlying numbers are in the evidence store.
4. Obvious vs non-obvious. Label a candidate non-obvious when its normalized lift is high and its general popularity rank is not top-tier.
5. Confidence. Derive High / Medium / Low / Insufficient from (a) how many independent audience signals support the candidate, (b) the score margin over the cutoff, (c) the number of resolved entities backing the profile. Thresholds are set in the Day 1 spike from real data and documented in the repo.
6. Abstention. If the entity cannot be resolved, the profile is too thin, or brand coverage for the category is sparse, the agent says so, shows what it tried, and declines to recommend. Abstention is a feature, shown prominently.
7. Aggregate framing. All language refers to "this crowd's taste profile" and "over-indexes," never to what a specific attendee will do.
8. Output specification
8.1 Sponsor report
• Event snapshot: resolved entities, city, budget range, exclusivity constraints.
• Audience taste profile: top affinities across music, dining, fashion, media, with confidence tags.
• Sponsor categories (5): each with a one-sentence rationale and linked evidence.
• Brand candidates (10-15): score, lift (if computed), obvious/non-obvious tag, confidence, status after validation.
• Top 3 brand pitches: one page each, written for a brand CMO, with every number footnoted to an evidence record.
• Activation concepts (2-3 per top brand): concrete on-site ideas derived from shared affinities (for example, a craft coffee lounge tied to a dining affinity), including footprint, staffing and a rough cost tier, flagged as estimates.
• Limitations and what this does not establish: auto-included on every report.
8.2 Evidence Trace view
A collapsible panel listing every Qloo request used in the report, redacted: tool, entities, tags, returned scores, cache status. Satisfies the kit's "redacted request-to-result explanation" and gives Diolosa a direct look at API depth.
8.3 With/without-Qloo comparison (F8)
Same event input, two columns: SponsorMatch vs a plain LLM prompt. Highlight in the baseline column any brand or statistic with no source. This is the single most persuasive screen in the demo.
9. UX and design requirements
Judges score Design as a complete, coherent product, not a proof of concept.
• First screen: one input, three sample-event cards (pick events with a clear musical or sports identity and plenty of Qloo coverage after the spike), and a one-line value statement.
• Run view: a live stage tracker (Resolving, Profiling, Finding brands, Validating, Writing) with the current Qloo call visible. Streamed progress makes a 30-60 second run feel purposeful.
• Results view: category cards on top, brand table with sortable score and confidence, side panel for evidence, pitch view in a reading layout.
• States to design explicitly: disambiguation dialog, abstention ("not enough data to recommend"), quota reached, partial results, and error with retry.
• Visual identity: a restrained editorial look suited to a B2B sales tool; clear confidence badges; no stock-AI aesthetics.
• Accessibility: keyboard navigable, sufficient contrast, readable on phone.
• Copy rules: plain English, no unsupported superlatives, "over-indexes" rather than "will buy."
10. Technical design
10.1 Recommended stack
• Frontend: React with TypeScript and a component library, streaming UI via server-sent events.
• Backend: Node 22.19+ with TypeScript (matches the harness requirement). Orchestration in plain TypeScript with a typed state machine, or a light agent framework if the team already knows one.
• Qloo access: the @qloo/qloo-harness package invoked from the backend (qloo exec or the MCP server) with the credential in a server-side secret. The browser never sees it.
• LLM: any capable model for the Planner, Writer and Auditor, behind a thin provider interface so it can be swapped.
• Storage: SQLite or Postgres for runs, evidence records and the response cache.
• Hosting: a host that runs a persistent Node process (for example Fly.io, Railway or Render). Avoid edge-only serverless, since the backend must start the harness process.
10.2 Quota, caching and resilience
The public demo shares one quota, so this is a first-class feature.
• Pre-warmed samples: run the three sample events ahead of time and cache all evidence. First-click results are instant and use no quota.
• Response cache: key by tool plus normalized parameters, with a sensible TTL. Re-planning and re-ranking reuse cached evidence.
• Request budget per run: the Planner sets a cap and the run stops cleanly at the cap.
• Bounded retries: exponential backoff with a small maximum; surface auth and rate-limit errors plainly. Never fall back silently to another credential or endpoint.
• Per-visitor limits: a small number of live runs per visitor per day; beyond that, offer cached samples.
• No bulk scraping: requests are scoped to the user's question only.
10.3 Data model (core tables)
• runs (id, event_input, status, created_at, request_count)
• entities (run_id, qloo_id, name, type, resolution_status)
• evidence (id, run_id, tool, redacted_params, result_json, cache_hit, timestamp)
• candidates (run_id, brand_id, affinity, normalized_lift, popularity, confidence, validator_status, reason)
• outputs (run_id, kind, content, evidence_refs)
• feedback (run_id, brand_id, action, reason)
10.4 Security and privacy
• Credential only in server environment variables; verify it never appears in the repo, client bundle, logs or screenshots. Add a secret scanner to CI.
• No personal data collected. Event inputs are public entities.
• Redact parameters in the Evidence Trace.
• Honest language about aggregate data in the UI and README.
11. Evaluation plan
Nicole Seligman and Mike Diolosa will look for rigor, so build a small, repeatable eval and publish it in the repo.
1. Test set: 10 events across festivals, venues and sports teams, including at least two niche ones and one that should trigger abstention.
2. Baseline: the same task given to the LLM with no Qloo data.
3. Metrics:
    ◦ Grounding rate: share of brand and numeric claims traceable to an evidence record.
    ◦ Unverifiable claim count: claims with no source (expected near zero for the agent).
    ◦ Non-obviousness: share of recommended brands not in the top tier of general popularity.
    ◦ Abstention correctness: does it decline on the thin-data event.
    ◦ Cost and latency: Qloo requests and seconds per run.
4. Report: a table in the README and a summary screen in the app. Report honestly, including where the agent underperformed.
5. Regression: run the eval in CI against cached fixtures.
12. Delivery plan (October 18-30, 2026)
Twelve days, with one day of buffer. Submit by October 29.
Day
Date
Deliverable
1
Sun Oct 18
Spike gate. Get credential, install harness, confirm: brand entities exist and return meaningful affinities for 3 candidate events; entity resolution works; quota and rate limits known. Repo created with license. Decide go / fallback (see section 13).
2
Mon Oct 19
Tool wrappers, evidence records, response cache. Resolver and disambiguation.
3
Tue Oct 20
Profiler and Brand Finder. First end-to-end data path in the terminal.
4
Wed Oct 21
Ranker with popularity normalization, lift where supported, confidence tiers, abstention logic.
5
Thu Oct 22
Validator and guardrails. Writer and Auditor with evidence-only constraint.
6
Fri Oct 23
Frontend shell, event form, sample cards, streaming run view. Deploy early to the real host.
7
Sat Oct 24
Results view, Evidence Trace panel, pitch view.
8
Sun Oct 25
With/without-Qloo comparison (F8). Eval harness and test set.
9
Mon Oct 26
Feedback loop (F10), export (F11), design polish, empty and error states.
10
Tue Oct 27
Pre-warm cache, run eval, write README, LIMITATIONS, setup from clean environment.
11
Wed Oct 28
Test as a stranger: fresh browser, phone, slow network, quota exhausted. Fix. Draft Devpost text.
12
Thu Oct 29
Freeze. Verify license in About, repo public, demo URL live, secret scan. Submit.
Buffer
Fri Oct 30
Deadline is 11:45pm EDT. Use only for emergencies.
13. Risks and fallbacks
Risk
Likelihood
Mitigation
Qloo brand coverage is thin or low-signal for events
Medium
Day 1 spike decides. If brands are weak, broaden "sponsor" to categories and venues/dining/fashion entities, or pivot to CuisineCraft, which sits on Qloo's strongest data.
Shared quota exhausted by judges
Medium
Pre-warmed samples, per-visitor limits, clear quota message, cached fallbacks.
Writer output includes ungrounded claims
Medium
Evidence-only input, Auditor pass, tests that fail the build on unmatched numbers.
Hosting cannot run the harness process
Low-Medium
Choose a persistent-process host on day 1; test deployment on day 1-2, not day 11.
Lift baseline not supported by the harness
Medium
Report affinity only; do not state multiples. The honest version is still strong.
Credential leak
Low, high impact
Server-only secret, CI secret scan, never in screenshots or logs.
Scope creep
High
Priority table in section 5.2; cut in the stated order.
Another entry covers sponsorship
Unknown
Check the project gallery on day 1 and on day 8; sharpen the differentiators (evidence trace, abstention, eval) rather than adding features.
14. Mapping to judging criteria and judges
Criterion / judge
What they will see
Technological Implementation (Mike Diolosa)
Multi-hop traversal across domains, entity disambiguation, caching and bounded retries, Evidence Trace with real requests.
Design
Complete flow from input to exported report, designed empty/error/abstain states, streaming run view.
Potential Impact (Jason Calacanis)
Named buyer, concrete workflow, pitch output a salesperson can use, business model below.
Quality of the Idea (Michael Abrams, Todd Boehly)
Sponsorship is core revenue for live events and sports; non-obvious sponsor discovery and on-site activations.
Grounding and safety (Nicole Seligman)
Evidence-only writing, Auditor pass, abstention, published eval including failures.
15. Business model (hypotheses to state in the pitch, not claims)
• Organizers and venues: per-event report pricing, or a monthly subscription for teams with many events.
• Brands and agencies (phase 2): event-evaluation subscription (rank events for a brand), plus a premium tier with audience comparison.
• Moat: evidence-backed reports that buyers can defend internally, built on a taste graph competitors do not have.
• Next steps after the hackathon: pilot with two or three regional organizers, validate whether affinity-based pitches improve reply and close rates, then add outreach workflow.
Present these as hypotheses to test. Do not cite market-size or willingness-to-pay figures unless you have a source.
16. Submission checklist
Devpost requirements
[ ] Live demo URL, publicly accessible, works end to end with no login
[ ] Public repository with all source, assets and run instructions
[ ] Open-source license file, visible in the repo's About section
[ ] Text description: what it does and what makes it Qloo-powered
Kit submission guide
[ ] Problem statement
[ ] Qloo workflows or MCP tools used, and why each fits
[ ] Redacted request-to-result explanation with entity and tag choices
[ ] Screenshots (no credential, no personal data)
[ ] Setup steps that work from a clean environment
[ ] Known limitations, including what results do not establish
Final checks
[ ] Secret scan clean; credential not in repo history
[ ] Cached sample events load in under 5 seconds
[ ] Tested on phone and a fresh browser profile
[ ] Eval table in the README, including honest weaknesses
[ ] Devpost text mentions the evidence trace, abstention and the baseline comparison
17. Judge walkthrough (the first 90 seconds)
1. Click a sample event. Cached results appear within seconds.
2. Show the stage tracker and one live Qloo call from the Evidence Trace.
3. Open a non-obvious brand: show its score, popularity-normalized lift and the linked evidence.
4. Open its pitch: every number is footnoted.
5. Toggle the with/without-Qloo view: the baseline column lights up with unverifiable claims.
6. Try a thin-data event: the agent abstains and explains why.
7. Reject one brand: the agent re-ranks and explains the change.
18. Open questions to close on Day 1
1. Exact harness workflow names, parameters and result shape for tags, entity lookup, recommendations, audience comparison and shortlist ranking.
2. Does Qloo return brand-type entities with usable affinity for live-event entities? How deep is coverage by category?
3. Event quota, rate limit and expiration for our credential, and the support path.
4. Can the harness be run reliably as a subprocess or MCP server on our chosen host?
5. Which three sample events give the best coverage and the clearest story?
6. Which model and provider for the Writer, and the cost per run?
7. Is the hackathon's project gallery showing any sponsorship-related entries we need to differentiate from?