import React, { useState } from 'react';
import { BrandCandidate } from '../types';
import { ThumbsDown, X, ShieldAlert, Check } from 'lucide-react';

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: BrandCandidate;
  onConfirmReject: (brandId: string, reason: string) => void;
}

const COMMON_REASONS = [
  'Category already sold to another sponsor (Exclusivity conflict)',
  'Direct competitor to an existing headline partner',
  'Off-brand: Does not fit this event’s community aesthetic',
  'Sponsorship tier fee exceeds target budget',
];

export const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  brand,
  onConfirmReject,
}) => {
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !brand) return null;

  const handleConfirm = () => {
    const finalReason = customReason.trim() ? customReason.trim() : selectedReason;
    onConfirmReject(brand.id, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#101116] border border-white/[0.08] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
          <div className="flex items-center gap-2 text-red-400">
            <ThumbsDown className="w-5 h-5" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Reject Sponsor Brand</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rejecting <strong className="text-cyan-300">{brand.name}</strong> will record your constraint,
            re-run ranker and validator on existing Qloo evidence, and promote replacement candidates without extra API calls.
          </p>
        </div>

        {/* Reason Selector */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Select Rejection Constraint:
          </label>
          <div className="space-y-1.5">
            {COMMON_REASONS.map((reason) => {
              const isSelected = selectedReason === reason && !customReason.trim();
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    setSelectedReason(reason);
                    setCustomReason('');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all border ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-glow-cyan'
                      : 'bg-[#14151E] border-white/[0.06] text-slate-300 hover:bg-[#181926]'
                  }`}
                >
                  <span className="truncate pr-2">{reason}</span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Reason */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
            Or Type Custom Reason:
          </label>
          <input
            type="text"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="e.g. Contract signed with alternative beverage provider"
            className="w-full bg-[#0A0B10] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 transition-all uppercase tracking-wider"
          >
            Apply Constraint & Re-Rank
          </button>
        </div>
      </div>
    </div>
  );
};
