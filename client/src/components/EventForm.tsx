import React, { useState } from 'react';
import { EventInput, SampleEventDefinition } from '../types';
import { Play, Sparkles, X, Plus, MapPin, Building, ShieldAlert, DollarSign, Zap } from 'lucide-react';

interface EventFormProps {
  onSubmit: (input: EventInput) => void;
  onSelectSample: (sample: SampleEventDefinition) => void;
  samples: SampleEventDefinition[];
  isLoading: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onSelectSample,
  samples,
  isLoading,
}) => {
  const [eventName, setEventName] = useState('');
  const [entityInput, setEntityInput] = useState('');
  const [entities, setEntities] = useState<string[]>([]);
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [budgetTier, setBudgetTier] = useState<'BUDGET' | 'MID' | 'PREMIUM'>('MID');
  const [exclusionInput, setExclusionInput] = useState('');
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);

  const handleAddEntity = () => {
    if (entityInput.trim() && !entities.includes(entityInput.trim())) {
      setEntities([...entities, entityInput.trim()]);
      setEntityInput('');
    }
  };

  const handleRemoveEntity = (idx: number) => {
    setEntities(entities.filter((_, i) => i !== idx));
  };

  const handleAddExclusion = () => {
    if (exclusionInput.trim() && !excludedCategories.includes(exclusionInput.trim())) {
      setExcludedCategories([...excludedCategories, exclusionInput.trim()]);
      setExclusionInput('');
    }
  };

  const handleRemoveExclusion = (idx: number) => {
    setExcludedCategories(excludedCategories.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    onSubmit({
      eventName: eventName.trim(),
      entities: entities.length > 0 ? entities : [eventName.trim()],
      venue: venue.trim() || undefined,
      city: city.trim() || undefined,
      budgetTier,
      excludedCategories,
      excludedBrands: [],
    });
  };

  return (
    <div className="bg-[#101116] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Sample Presets Header */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse-glow" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              One-Click Judge Presets (Sub-Second Pre-Warmed)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-cyan-400/80">0 Quota Used • Instant Load</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {samples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              disabled={isLoading}
              className="text-left p-4 rounded-xl bg-[#14151E] hover:bg-[#181926] border border-white/[0.08] hover:border-cyan-500/40 hover:shadow-glow-cyan transition-all group relative overflow-hidden disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {sample.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Instant
                </span>
              </div>
              <p className="text-[11px] text-amber-300/90 mt-1.5 font-medium">{sample.tagline}</p>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{sample.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-5">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Or Analyze Any Custom Live Event</span>
          <span className="text-[10px] font-normal text-slate-500">(Traverses live Qloo taste graph)</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Event Name <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Desert Daze Festival, Sónar Barcelona, Chicago Marathon..."
              className="w-full bg-[#0A0B10] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Lineup / Artists / Performers */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Lineup / Headliners / Performer Entities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={entityInput}
                onChange={(e) => setEntityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEntity();
                  }
                }}
                placeholder="Type artist/athlete name and press Enter..."
                className="flex-1 bg-[#0A0B10] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={handleAddEntity}
                className="px-4 py-2 bg-[#14151E] hover:bg-[#191A26] border border-white/[0.08] hover:border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Entity tags */}
            {entities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {entities.map((ent, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                  >
                    <span>{ent}</span>
                    <button type="button" onClick={() => handleRemoveEntity(i)} className="hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Venue & Host City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Building className="w-3 h-3 text-cyan-400" />
                Venue (Optional)
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Lake Perris, Fira Gran Via, Grant Park"
                className="w-full bg-[#0A0B10] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                Host City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Austin, TX or Barcelona, Spain"
                className="w-full bg-[#0A0B10] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* Excluded Categories & Budget Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                Excluded Categories (Exclusivity)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={exclusionInput}
                  onChange={(e) => setExclusionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExclusion();
                    }
                  }}
                  placeholder="e.g. Energy Drink, Beer..."
                  className="flex-1 bg-[#0A0B10] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddExclusion}
                  className="px-3 py-2 bg-[#14151E] hover:bg-[#191A26] border border-white/[0.08] hover:border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Add
                </button>
              </div>

              {excludedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {excludedCategories.map((cat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    >
                      <span>{cat}</span>
                      <button type="button" onClick={() => handleRemoveExclusion(i)}>
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                Sponsor Budget Tier
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['BUDGET', 'MID', 'PREMIUM'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setBudgetTier(tier)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-colors ${
                      budgetTier === tier
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-glow-cyan'
                        : 'bg-[#0A0B10] border-white/[0.08] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tier === 'BUDGET' ? 'Emerging ($)' : tier === 'MID' ? 'Growth ($$)' : 'Flagship ($$$)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !eventName.trim()}
              className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black shadow-glow-cyan flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isLoading ? 'Traversing Qloo Taste Graph...' : 'Run SponsorMatch Discovery'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
