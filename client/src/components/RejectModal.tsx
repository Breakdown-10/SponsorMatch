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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-red-400">
            <ThumbsDown className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Reject Sponsor Brand</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <p className="text-xs text-slate-300">
            Rejecting <strong className="text-white">{brand.name}</strong> will record your constraint,
            re-run ranker and validator on existing Qloo evidence, and promote replacement candidates.
          </p>
        </div>

        {/* Reason Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Rejection Constraint:
          </label>
          <div className="space-y-1.5">
            {COMMON_REASONS.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedReason(r);
                  setCustomReason('');
                }}
                className={`w-full text-left p-2.5 rounded-xl text-xs border transition-colors flex items-center justify-between ${
                  selectedReason === r && !customReason.trim()
                    ? 'bg-brand-950 border-brand-500 text-brand-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{r}</span>
                {selectedReason === r && !customReason.trim() && (
                  <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="text"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Or write a custom constraint reason..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
          >
            Apply Constraint & Re-Rank
          </button>
        </div>
      </div>
    </div>
  );
};
