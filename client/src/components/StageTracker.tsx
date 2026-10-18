import React from 'react';
import { PipelineStage } from '../types';
import { CheckCircle2, CircleDashed, AlertTriangle, Terminal } from 'lucide-react';

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStage === 'COMPLETED' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : isAbstained ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <CircleDashed className="w-4 h-4 text-brand-400 animate-spin" />
          )}
          <span className="text-xs font-bold text-slate-200">
            {currentStage === 'COMPLETED'
              ? 'Pipeline Execution Complete'
              : isAbstained
              ? 'Agent Abstained (Thin Data)'
              : 'Taste Graph Traversal in Progress'}
          </span>
        </div>

        <span className="text-xs font-mono font-bold text-brand-400">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isAbstained
              ? 'bg-amber-400'
              : currentStage === 'COMPLETED'
              ? 'bg-emerald-400'
              : 'bg-gradient-to-r from-brand-600 to-indigo-500'
          }`}
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      {/* Stage Steps */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
        {STAGES.map((s) => {
          const status = getStageStatus(s.key);
          return (
            <div
              key={s.key}
              className={`px-2 py-1.5 rounded-lg text-center text-[10px] font-semibold border transition-all ${
                status === 'completed'
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50'
                  : status === 'active'
                  ? 'bg-brand-950 text-brand-300 border-brand-500/80 shadow-sm shadow-brand-500/20'
                  : status === 'abstained'
                  ? 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                  : 'bg-slate-950/50 text-slate-500 border-slate-800'
              }`}
            >
              {s.label}
            </div>
          );
        })}
      </div>

      {/* Live Status Message & Current Qloo API Call */}
      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-slate-800/60">
        <span className="text-slate-300 font-medium truncate">{statusMessage}</span>
        {activeCall && (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded shrink-0">
            <Terminal className="w-3 h-3 text-cyan-400" />
            {activeCall}
          </span>
        )}
      </div>
    </div>
  );
};
