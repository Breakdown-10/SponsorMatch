import React from 'react';
import { PipelineStage } from '../types';
import { CheckCircle2, CircleDashed, AlertTriangle, Terminal, Zap } from 'lucide-react';

interface StageTrackerProps {
  currentStage: PipelineStage;
  progress: number;
  statusMessage: string;
  activeCall?: string;
  isAbstained?: boolean;
}

const STAGES: { key: PipelineStage; label: string }[] = [
  { key: 'PLANNING', label: '1. Plan' },
  { key: 'RESOLVING', label: '2. Resolve' },
  { key: 'PROFILING', label: '3. Profile' },
  { key: 'FINDING_BRANDS', label: '4. Brands' },
  { key: 'RANKING', label: '5. Rank' },
  { key: 'VALIDATING', label: '6. Guardrails' },
  { key: 'WRITING', label: '7. Pitch' },
  { key: 'AUDITING', label: '8. Audit' },
];

export const StageTracker: React.FC<StageTrackerProps> = ({
  currentStage,
  progress,
  statusMessage,
  activeCall,
  isAbstained,
}) => {
  const getStageStatus = (stageKey: PipelineStage) => {
    if (isAbstained && stageKey === 'VALIDATING') return 'abstained';
    const stageOrder: PipelineStage[] = [
      'PLANNING',
      'RESOLVING',
      'PROFILING',
      'FINDING_BRANDS',
      'RANKING',
      'VALIDATING',
      'WRITING',
      'AUDITING',
      'COMPLETED',
    ];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stageIndex = stageOrder.indexOf(stageKey);

    if (currentStage === 'COMPLETED') return 'completed';
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-[#101116] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStage === 'COMPLETED' ? (
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
          ) : isAbstained ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
          )}
          <span className="text-xs font-black uppercase tracking-wider text-white">
            {currentStage === 'COMPLETED'
              ? 'Pipeline Execution Complete'
              : isAbstained
              ? 'Agent Grounding Halt'
              : `Executing Stage: ${currentStage.replace('_', ' ')}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeCall && (
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-2 py-0.5 rounded-lg">
              <Terminal className="w-3 h-3" />
              {activeCall}
            </span>
          )}
          <span className="text-xs font-black text-cyan-400 font-mono">{progress}%</span>
        </div>
      </div>

      {/* Progress Bar with neon gradient glow */}
      <div className="w-full bg-[#14151E] rounded-full h-2 overflow-hidden border border-white/[0.04]">
        <div
          className={`h-full transition-all duration-300 ${
            isAbstained
              ? 'bg-amber-500'
              : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shadow-glow-cyan'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 8-Stage Pill List */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
        {STAGES.map((st) => {
          const status = getStageStatus(st.key);
          return (
            <div
              key={st.key}
              className={`py-1.5 px-2 rounded-lg text-center text-[10px] font-mono font-bold tracking-tight transition-all border ${
                status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : status === 'active'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-glow-cyan'
                  : status === 'abstained'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#14151E]/60 text-slate-500 border-white/[0.04]'
              }`}
            >
              {st.label}
            </div>
          );
        })}
      </div>

      {/* Status Message */}
      <p className="text-[11px] text-slate-400 font-medium">
        {statusMessage}
      </p>
    </div>
  );
};
