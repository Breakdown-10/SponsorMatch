import React from 'react';
import { X, Sparkles, Sliders } from 'lucide-react';
import { EventForm } from './EventForm';
import { StageTracker } from './StageTracker';
import { EventInput, SampleEventDefinition, PipelineStage } from '../types';

interface CustomEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: EventInput) => void;
  onSelectSample: (sample: SampleEventDefinition) => void;
  samples: SampleEventDefinition[];
  isLoading: boolean;
  currentStage?: PipelineStage;
  progress?: number;
  statusMessage?: string;
  isAbstained?: boolean;
}

export const CustomEventModal: React.FC<CustomEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSelectSample,
  samples,
  isLoading,
  currentStage,
  progress = 0,
  statusMessage = '',
  isAbstained = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c1322] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#090e1c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5 fill-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Event Analysis & Sponsorship Discovery
              </h3>
              <p className="text-xs text-slate-400">
                Choose a pre-warmed judge preset or analyze any custom event via Qloo taste graph
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Live pipeline tracker if loading */}
          {isLoading && currentStage && (
            <div className="bg-[#090e1c] p-4 rounded-2xl border border-teal-500/30">
              <StageTracker
                currentStage={currentStage}
                progress={progress}
                statusMessage={statusMessage}
                isAbstained={isAbstained}
              />
            </div>
          )}

          {/* Event Form */}
          <EventForm
            onSubmit={(input) => {
              onSubmit(input);
            }}
            onSelectSample={(sample) => {
              onSelectSample(sample);
              onClose();
            }}
            samples={samples}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
