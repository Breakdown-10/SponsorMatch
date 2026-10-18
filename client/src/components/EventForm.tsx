import React, { useState } from 'react';
import { EventInput, SampleEventDefinition } from '../types';
import { Play, Sparkles, X, Plus, MapPin, Building, ShieldAlert, DollarSign } from 'lucide-react';

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Sample Presets Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              One-Click Judge Presets (Sub-Second Pre-Warmed)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Zero quota used • Instant load</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {samples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              disabled={isLoading}
              className="text-left p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-500/50 transition-all group relative overflow-hidden disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 group-hover:text-brand-300 transition-colors">
                  {sample.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-medium">
                  Instant
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 mt-1 font-medium">{sample.tagline}</p>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{sample.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Or Analyze Any Custom Live Event
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Event Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Desert Daze Festival, Sónar Barcelona, Chicago Marathon..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Lineup / Artists / Performers */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleAddEntity}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {entities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {entities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-brand-950 border border-brand-700/60 text-brand-200"
                  >
                    <span>{ent}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEntity(idx)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Venue & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-400" />
                Venue (Optional)
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Lake Perris, Fira Gran Via, Grant Park"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                Host City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Austin, TX or Barcelona, Spain"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Exclusions & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-slate-400" />
                Excluded Categories (Exclusivity)
              </label>
              <div className="flex gap-1.5">
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
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={handleAddExclusion}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs border border-slate-700"
                >
                  Add
                </button>
              </div>
              {excludedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {excludedCategories.map((ex, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-red-950/60 border border-red-800/60 text-red-300"
                    >
                      {ex}
                      <button type="button" onClick={() => handleRemoveExclusion(i)}>
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-slate-400" />
                Sponsor Budget Tier
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['BUDGET', 'MID', 'PREMIUM'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setBudgetTier(tier)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-colors ${
                      budgetTier === tier
                        ? 'bg-brand-600 border-brand-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-slate-200'
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
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isLoading ? 'Running Qloo Pipeline...' : 'Run SponsorMatch Discovery'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
