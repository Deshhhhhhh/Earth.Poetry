import React, { useState } from 'react';
import { Download, Share2, Copy, Check, X, Mail, MessageSquare } from 'lucide-react';
import { TravelItinerary } from '../types';

interface SharePdfModalProps {
  itinerary: TravelItinerary;
  onClose: () => void;
  onDownloadPdf: () => void;
  isDarkMode?: boolean;
}

export const StanzaSharePdfModal: React.FC<SharePdfModalProps> = ({
  itinerary,
  onClose,
  onDownloadPdf,
  isDarkMode = true,
}) => {
  const tc = (dark: string, light: string) => (isDarkMode ? dark : light);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}${window.location.pathname}?itineraryId=${encodeURIComponent(itinerary.id)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('text-white', 'text-slate-900')} rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative space-y-6 border`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${tc('bg-[#132235]', 'bg-slate-100')} ${tc('hover:bg-[#1a2d42]', 'hover:bg-slate-200')} ${tc('text-[#94a3b8]', 'text-slate-500')} transition-colors cursor-pointer`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#20d09b] bg-[#20d09b]/10 px-2.5 py-0.5 rounded-full border border-[#20d09b]/20">
            Earth Poetry Share Studio
          </span>
          <h3 className={`font-serif text-xl font-bold ${tc('text-white', 'text-slate-900')}`}>
            Share Stanza & Download PDF
          </h3>
          <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
            Share this curated itinerary with fellow wanderers or export unlimited PDF copies for free.
          </p>
        </div>

        {/* Action 1: Direct Download PDF */}
        <div className={`${tc('bg-[#132235]', 'bg-slate-100')} p-4 rounded-2xl border ${tc('border-[#1a2d42]', 'border-slate-200')} space-y-3`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>
                📄 Free PDF Export
              </h4>
              <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                Includes full day-by-day plan, hotel rates, and Google booking links.
              </p>
            </div>
            <button
              onClick={onDownloadPdf}
              className="px-4 py-2 rounded-xl bg-[#20d09b] hover:bg-[#2de3aa] text-[#08121e] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PDF</span>
            </button>
          </div>
        </div>

        {/* Action 2: Shareable Link */}
        <div className={`${tc('bg-[#132235]', 'bg-slate-100')} p-4 rounded-2xl border ${tc('border-[#1a2d42]', 'border-slate-200')} space-y-3`}>
          <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>
            🔗 Direct Shareable Link
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className={`w-full p-2.5 rounded-xl ${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} text-xs font-mono text-[#20d09b] focus:outline-none border`}
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-[#20d09b] hover:bg-[#2de3aa] text-[#08121e] text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Social Shares */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Check out my Earth Poetry travel itinerary: ${itinerary.title} - ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold hover:bg-green-500/20 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-green-400" /> WhatsApp
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(`Earth Poetry Travel Itinerary: ${itinerary.title}`)}&body=${encodeURIComponent(`Here is our travel plan created with Earth Poetry: ${shareUrl}`)}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold hover:bg-blue-500/20 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-blue-400" /> Email
          </a>
        </div>

      </div>
    </div>
  );
};
