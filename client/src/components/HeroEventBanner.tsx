import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Target,
  Tag,
  Pencil,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { RunState } from '../types';

interface HeroEventBannerProps {
  run: RunState;
  onBackToEvents: () => void;
  onEditEvent: () => void;
}

export const HeroEventBanner: React.FC<HeroEventBannerProps> = ({
  run,
  onBackToEvents,
  onEditEvent,
}) => {
  const isSonar = run.input.eventName.toLowerCase().includes('sónar') || run.input.eventName.toLowerCase().includes('sonar');
  const isDesert = run.input.eventName.toLowerCase().includes('desert');

  // Dates and cultural tags
  const dates = isSonar
    ? 'Jun 18–20, 2026'
    : isDesert
    ? 'Oct 10–12, 2026'
    : 'Oct 11, 2026';

  const venueLocation = run.input.venue && run.input.city
    ? `${run.input.venue}, ${run.input.city}`
    : run.input.venue || run.input.city || 'Barcelona, Spain';

  const categoryPills = isSonar
    ? ['Music', 'Arts & Culture', 'Technology']
    : isDesert
    ? ['Music', 'Psychedelic Art', 'Camping']
    : ['Athletics', 'Endurance', 'Wellness'];

  const description = isSonar
    ? "Electronic music, digital art and innovation across multiple venues in Barcelona's Fira Gran Via."
    : isDesert
    ? "Iconic independent music gathering at Moreno Beach featuring mind-bending visual arts, analog synthesizers, and lakeside camping."
    : "Premier global road race uniting 50,000 international runners across 29 Chicago neighborhoods with high-intensity community support.";

  const attendance = isSonar ? '40,000' : isDesert ? '25,000' : '50,000';
  const primaryAudience = isSonar
    ? 'Music lovers, 25–44'
    : isDesert
    ? 'Indie music & psych fans, 21–38'
    : 'Endurance athletes & runners, 25–54';

  const culturalTags = isSonar
    ? ['Electronic', 'Tech', 'Art', 'Barcelona', 'Nightlife']
    : isDesert
    ? ['Psychedelic', 'Analog Synth', 'Indie', 'Desert', 'Vinyl']
    : ['Marathon', 'Running', 'Fitness', 'Chicago', 'Endurance'];

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#0a0f1d]">
      {/* Background concert photo with atmospheric gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      {/* Multi-stop gradient overlay for deep dark midnight tone */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d] via-[#0a0f1d]/90 to-[#0a0f1d]/75 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent pointer-events-none" />

      {/* Top action links */}
      <div className="relative z-10 px-8 pt-6 pb-2 flex items-center justify-between">
        <button
          onClick={onBackToEvents}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to events</span>
        </button>

        <button
          onClick={onEditEvent}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141b2d]/90 hover:bg-[#1a233a] border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
        >
          <Pencil className="w-3.5 h-3.5 text-slate-300" />
          <span>Edit Event</span>
        </button>
      </div>

      {/* Main Hero Grid */}
      <div className="relative z-10 p-8 pt-3 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Event Identity (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#321c56]/80 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>Live Event Analysis</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {run.input.eventName}
          </h1>

          {/* Date & Location */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{dates}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{venueLocation}</span>
            </div>
          </div>

          {/* Category Pill Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categoryPills.map((pill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-[#131d35]/90 text-slate-200 border border-white/[0.08]"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right Event Snapshot Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-[#0c1322]/85 backdrop-blur-md border border-white/[0.09] rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Event Snapshot
            </h3>

            <div className="space-y-3.5">
              {/* Expected Attendance */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Expected Attendance</div>
                  <div className="text-sm font-bold text-white">{attendance}</div>
                </div>
              </div>

              {/* Primary Audience */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Primary Audience</div>
                  <div className="text-sm font-bold text-white">{primaryAudience}</div>
                </div>
              </div>

              {/* Top Cultural Tags */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                  <Tag className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium mb-1.5">Top Cultural Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {culturalTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#141b2c] text-slate-300 border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
