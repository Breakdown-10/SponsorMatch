import { RunState } from '../types';

export function exportRunToMarkdown(run: RunState): void {
  const dateStr = new Date(run.createdAt).toLocaleDateString();
  let md = `# SponsorMatch AI — Sponsorship Discovery Deck\n\n`;
  md += `**Event**: ${run.input.eventName}\n`;
  if (run.input.city) md += `**Location**: ${run.input.city}\n`;
  if (run.input.venue) md += `**Venue**: ${run.input.venue}\n`;
  md += `**Date**: ${dateStr}\n`;
  md += `**Audience Intelligence Source**: Qloo Taste Graph (100% Grounded)\n\n`;

  md += `---\n\n`;

  // Resolved Entities
  md += `## 1. Lineup & Cultural Identity\n\n`;
  for (const ent of run.resolvedEntities) {
    md += `- **${ent.name}** (${ent.type}) — Qloo Resolved\n`;
  }
  md += `\n`;

  // Cross Domain Taste Profile
  md += `## 2. Audience Cross-Domain Taste Profile\n\n`;
  for (const [domain, affinities] of Object.entries(run.tasteProfile)) {
    if (affinities.length > 0) {
      md += `### ${domain.toUpperCase()}\n`;
      for (const aff of affinities.slice(0, 4)) {
        md += `- ${aff.name} (Affinity: ${Math.round(aff.affinityScore * 100)}%)\n`;
      }
      md += `\n`;
    }
  }

  // Top Ranked Brands Table
  md += `## 3. Ranked Sponsor Recommendations (Lift-Normalized)\n\n`;
  md += `| Rank | Brand | Category | Lift Ratio | Raw Affinity | General Popularity | Classification | Confidence |\n`;
  md += `|---|---|---|---|---|---|---|---|\n`;

  const valid = run.candidates.filter(c => c.status === 'VALIDATED');
  valid.forEach((brand, idx) => {
    const classification = brand.isObvious ? 'Obvious Giant' : 'Non-Obvious High-Lift';
    md += `| ${idx + 1} | **${brand.name}** | ${brand.category} | **${brand.liftMultiple}x** | ${Math.round(brand.rawAffinity * 100)}% | ${Math.round(brand.generalPopularity * 100)}% | ${classification} | ${brand.confidence} |\n`;
  });
  md += `\n---\n\n`;

  // Top Brand Pitches & Activations
  md += `## 4. Top CMO Pitch Decks & On-Site Activations\n\n`;
  for (const pitch of Object.values(run.pitches)) {
    md += `### Partnership Proposal: ${pitch.brandName} (${pitch.category})\n\n`;
    md += `**${pitch.headline}**\n\n`;
    md += `> ${pitch.executiveSummary}\n\n`;
    md += `**Why This Audience:**\n${pitch.whyThisAudience}\n\n`;

    md += `#### On-Site Experiential Activations:\n\n`;
    for (const act of pitch.activations) {
      md += `- **${act.title}** (Cost Tier: ${act.costTier})\n`;
      md += `  - *Description*: ${act.description}\n`;
      md += `  - *Footprint*: ${act.footprint}\n`;
      md += `  - *Cultural Link*: ${act.culturalRationale}\n`;
    }

    if (pitch.evidenceFootnotes.length > 0) {
      md += `\n#### Verifiable Evidence Citations:\n`;
      for (const fn of pitch.evidenceFootnotes) {
        md += `- [Evidence ${fn.evidenceId}]: ${fn.claim} (${fn.metric})\n`;
      }
    }
    md += `\n---\n\n`;
  }

  // Limitations Statement (PRD Section 8.1 & Kit Requirement)
  md += `## 5. Limitations & Regulatory Disclaimer\n\n`;
  md += `SponsorMatch results reflect aggregate statistical affinities derived from Qloo's cultural taste graph. They describe audience over-indexing and cultural resonance. They do not constitute individual-level tracking, demographic surveillance, or causal conversion guarantees.\n`;

  // Download blob
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SponsorMatch-${run.input.eventName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
