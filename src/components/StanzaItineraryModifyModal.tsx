import React, { useState } from 'react';
import { Sparkles, RefreshCw, Send } from 'lucide-react';

interface ItineraryModifyModalProps {
  onModify: (prompt: string) => void;
  isModifying: boolean;
  modificationsCount: number;
  isDarkMode?: boolean;
}

export const StanzaItineraryModifyModal: React.FC<ItineraryModifyModalProps> = ({
  onModify,
  isModifying,
  modificationsCount,
  isDarkMode = true,
}) => {
  const [modifyInput, setModifyInput] = useState('');

  const tc = (dark: string, light: string) => (isDarkMode ? dark : light);

  const presetModifiers = [
    '🏨 Upgrade stays to 5-star oceanfront resorts',
    '💰 Adjust budget to $2,000 max',
    '🌊 Add private yacht snorkeling adventure',
    '🧘 Make Day 2 more relaxed & spa focused',
    '🍷 Swap Day 3 dinner to Michelin fine dining',
    '👶 Add family-friendly activities'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modifyInput.trim() || isModifying) return;
    onModify(modifyInput);
    setModifyInput('');
  };

  const handleApplyPreset = (preset: string) => {
    onModify(preset.replace(/^[^\s]+\s/, ''));
  };

  return (
    <div className={`${tc('bg-[#0b1726]', 'bg-white')} ${tc('text-white', 'text-slate-900')} rounded-3xl p-5 sm:p-6 shadow-2xl ${tc('border-[#1a2d42]', 'border-slate-200')} border`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#20d09b]/10 rounded-xl text-[#20d09b] border border-[#20d09b]/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`font-serif text-base font-bold ${tc('text-white', 'text-slate-900')}`}>
              Dynamic Stanza Refinement Engine
            </h3>
            <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
              Request changes, hotel upgrades, or budget adjustments in natural language.
            </p>
          </div>
        </div>

        {modificationsCount > 0 && (
          <span className="text-[10px] font-bold bg-[#20d09b]/10 text-[#20d09b] px-2.5 py-1 rounded-full border border-[#20d09b]/30">
            {modificationsCount} Revision{modificationsCount > 1 ? 's' : ''} Applied
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            id="modify-itinerary-input"
            type="text"
            value={modifyInput}
            onChange={(e) => setModifyInput(e.target.value)}
            placeholder="Type your revision e.g. 'Upgrade hotel to 5-star beachfront' or 'Make Day 3 more relaxed'..."
            className={`w-full pl-4 pr-28 py-3.5 rounded-xl ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('border-[#1a2d42]', 'border-slate-200')} border ${tc('text-white', 'text-slate-900')} ${tc('placeholder-[#64748b]', 'placeholder-slate-400')} focus:outline-none focus:ring-2 focus:ring-[#20d09b] text-xs sm:text-sm font-medium`}
            disabled={isModifying}
          />

          <button
            id="modify-itinerary-submit-btn"
            type="submit"
            disabled={!modifyInput.trim() || isModifying}
            className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-lg bg-[#20d09b] hover:bg-[#2de3aa] text-[#08121e] text-xs font-extrabold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shadow-md"
          >
            {isModifying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Update</span>
                <Send className="w-3 h-3 text-[#08121e]" />
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className={`text-[11px] ${tc('text-[#94a3b8]', 'text-slate-500')} font-semibold self-center mr-1`}>
            Quick Refinements:
          </span>
          {presetModifiers.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isModifying}
              onClick={() => handleApplyPreset(preset)}
              className={`text-[11px] ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('hover:bg-[#1f3248]', 'hover:bg-slate-100')} ${tc('text-[#cbd5e1]', 'text-slate-600')} px-2.5 py-1 rounded-full ${tc('border-[#1a2d42]', 'border-slate-200')} border transition-all cursor-pointer disabled:opacity-50 ${tc('hover:text-white', 'hover:text-slate-900')} hover:border-[#20d09b]`}
            >
              {preset}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
