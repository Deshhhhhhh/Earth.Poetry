import React, { useState, useEffect } from 'react';
import { TravelItinerary, PromptInputParams } from '../types';
import { SAMPLE_BALI_ITINERARY, PRESET_PROMPTS } from '../data/stanzaSampleItineraries';
import { StanzaPromptForm } from './StanzaPromptForm';
import { StanzaItineraryView } from './StanzaItineraryView';
import { StanzaSharePdfModal } from './StanzaSharePdfModal';
import { StanzaAuthModal } from './StanzaAuthModal';
import { StanzaEmbedGuideModal } from './StanzaEmbedGuideModal';
import { downloadItineraryAsPdf } from '../utils/stanzaPdfExport';
import { generateItineraryClient, modifyItineraryClient } from '../lib/stanzaGeminiClient';
import { Bookmark, Sparkles, Compass, Trash2, ArrowRight, X, ShieldCheck, Sun, Moon } from 'lucide-react';

interface StanzaPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const StanzaPlannerModal: React.FC<StanzaPlannerModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [currentItinerary, setCurrentItinerary] = useState<TravelItinerary | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'view'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);

  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showEmbedGuideModal, setShowEmbedGuideModal] = useState(false);

  const [user, setUser] = useState<{ emailOrPhone: string; name?: string } | null>(() => {
    try {
      const savedUser = localStorage.getItem('earth_poetry_stanza_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to parse stanza user:', e);
    }
    return null;
  });

  const [savedItineraries, setSavedItineraries] = useState<TravelItinerary[]>(() => {
    try {
      const stored = localStorage.getItem('earth_poetry_stanza_saved');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored stanza itineraries:', e);
    }
    return [SAMPLE_BALI_ITINERARY];
  });

  useEffect(() => {
    try {
      localStorage.setItem('earth_poetry_stanza_saved', JSON.stringify(savedItineraries));
    } catch (e) {
      console.error('Failed to store stanza itineraries:', e);
    }
  }, [savedItineraries]);

  const handleLoginSuccess = (userData: { emailOrPhone: string; name?: string }) => {
    setUser(userData);
    try {
      localStorage.setItem('earth_poetry_stanza_user', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save stanza user:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('earth_poetry_stanza_user');
  };

  const saveItineraryToList = (itinerary: TravelItinerary) => {
    setSavedItineraries((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === itinerary.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = itinerary;
        return updated;
      }
      return [itinerary, ...prev];
    });
  };

  const handleGeneratePrompt = async (params: PromptInputParams) => {
    setIsLoading(true);
    try {
      const data = await generateItineraryClient(params);

      if (data.success && data.itinerary) {
        setCurrentItinerary(data.itinerary);
        saveItineraryToList(data.itinerary);
        setViewMode('view');
      } else if (data.sampleItinerary) {
        const msg = data.error && data.error.includes('key not configured')
          ? '⚠️ Gemini API key not configured. Go to Netlify → Site settings → Environment variables and add VITE_GEMINI_API_KEY with your Google AI Studio key. Showing sample Bali itinerary for now.'
          : (data.error || 'AI generation unavailable. Using sample fallback.');
        if (data.error?.includes('key not configured')) alert(msg);
        setCurrentItinerary(data.sampleItinerary);
        saveItineraryToList(data.sampleItinerary);
        setViewMode('view');
      } else {
        alert(data.error || 'Failed to generate itinerary. Using sample fallback.');
        setCurrentItinerary(SAMPLE_BALI_ITINERARY);
        saveItineraryToList(SAMPLE_BALI_ITINERARY);
        setViewMode('view');
      }
    } catch (err: any) {
      console.error('Stanza client generation failed, falling back to sample itinerary:', err);
      setCurrentItinerary(SAMPLE_BALI_ITINERARY);
      saveItineraryToList(SAMPLE_BALI_ITINERARY);
      setViewMode('view');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyItinerary = async (modificationPrompt: string) => {
    if (!currentItinerary) return;
    setIsModifying(true);

    try {
      const data = await modifyItineraryClient(currentItinerary, modificationPrompt);

      if (data.success && data.itinerary) {
        setCurrentItinerary(data.itinerary);
        saveItineraryToList(data.itinerary);
      } else {
        alert(data.error || 'Could not update itinerary. Make sure your VITE_GEMINI_API_KEY is set in Netlify environment variables.');
      }
    } catch (err) {
      console.error('Failed to modify stanza itinerary:', err);
      alert('Error while modifying itinerary. Check that VITE_GEMINI_API_KEY is set in Netlify → Environment variables.');
    } finally {
      setIsModifying(false);
    }
  };

  const handleSelectSample = () => {
    setCurrentItinerary(SAMPLE_BALI_ITINERARY);
    saveItineraryToList(SAMPLE_BALI_ITINERARY);
    setViewMode('view');
  };

  const handleDownloadPdf = () => {
    if (currentItinerary) {
      downloadItineraryAsPdf(currentItinerary, 'itinerary-pdf-content');
    }
  };

  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedItineraries(savedItineraries.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    setCurrentItinerary(null);
    setViewMode('form');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Theme color helpers (match App.tsx patterns)
  const tc = (dark: string, light: string) => (isDarkMode ? dark : light);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className={`absolute inset-0 backdrop-blur-xl ${tc('bg-black/90', 'bg-black/60')}`}
        onClick={onClose}
      />

      <div className={`relative w-full h-full md:w-[96vw] md:h-[94vh] md:max-w-[1500px] md:rounded-3xl overflow-hidden flex flex-col font-sans shadow-2xl border md:${tc('border-[#1a2d42]', 'border-slate-300/70')} ${tc('bg-[#08121e] text-[#e2e8f0]', 'bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] text-slate-800')}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0 ${tc('border-[#132235] bg-[#0b1726]', 'border-slate-200 bg-white/80')}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-white/20">
              <Compass className="w-4.5 h-4.5 text-white animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`font-serif text-lg tracking-tight font-extrabold flex items-baseline ${tc('text-white', 'text-slate-900')}`}>
                  Stanza <span className="text-[#20d09b] italic font-semibold">AI Planner</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#20d09b]/10 border border-[#20d09b]/20 text-[9px] font-bold uppercase tracking-wider text-[#20d09b]">
                  <Sparkles className="w-3 h-3" /> Beta
                </span>
              </div>
              <p className={`text-[10px] font-mono ${tc('text-[#64748b]', 'text-slate-500')}`}>
                Interactive Maps • Direct Google Bookings • Unlimited PDF Exports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* In-modal Theme Toggle (so users can switch day/night even inside Stanza) */}
            <div
              className={`p-2 rounded-full cursor-pointer transition-all ${tc('bg-[#132235] border border-[#1a2d42] hover:border-amber-400/50 hover:bg-[#1a2d42] text-amber-300', 'bg-white border border-slate-200 hover:border-indigo-400/50 hover:bg-slate-50 text-indigo-600')}`}
              title={isDarkMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              onClick={() => {
                // Tell the parent window/App to toggle theme via custom event
                window.dispatchEvent(new CustomEvent('app:toggle-theme'));
              }}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            {viewMode === 'view' && currentItinerary && (
              <>
                <button
                  onClick={handleReset}
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${tc('bg-[#132235] border-[#1a2d42] text-white hover:border-[#20d09b]', 'bg-white border-slate-200 text-slate-700 hover:border-[#20d09b] hover:text-emerald-700')}`}
                >
                  <Compass className="w-3.5 h-3.5 text-[#20d09b]" />
                  <span>New Stanza</span>
                </button>
                <button
                  onClick={() => setShowSavedModal(true)}
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${tc('bg-[#132235] border-[#1a2d42] text-white hover:border-[#20d09b]', 'bg-white border-slate-200 text-slate-700 hover:border-[#20d09b] hover:text-emerald-700')}`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#20d09b]" />
                  <span>Saved ({savedItineraries.length})</span>
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#20d09b]/10 text-[#20d09b] border border-[#20d09b]/30 text-xs font-bold hover:bg-[#20d09b]/20 transition-all cursor-pointer"
                >
                  Share & PDF
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className={`p-2.5 rounded-full border transition-all cursor-pointer group ${tc('bg-[#132235] hover:bg-[#1a2d42] border-[#1a2d42] hover:border-rose-500/40 text-[#94a3b8] hover:text-rose-300', 'bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-300 text-slate-500 hover:text-rose-500')}`}
              title="Close Stanza AI Planner (Esc)"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 w-full overflow-y-auto">
          {viewMode === 'form' ? (
            <StanzaPromptForm
              onSubmitPrompt={handleGeneratePrompt}
              isLoading={isLoading}
              onSelectSample={handleSelectSample}
              user={user}
              onRequireAuth={() => setShowAuthModal(true)}
              isDarkMode={isDarkMode}
            />
          ) : (
            currentItinerary && (
              <StanzaItineraryView
                itinerary={currentItinerary}
                onBackToPrompt={handleReset}
                onModifyItinerary={handleModifyItinerary}
                isModifying={isModifying}
                onDownloadPdf={handleDownloadPdf}
                onOpenShare={() => setShowShareModal(true)}
                isDarkMode={isDarkMode}
              />
            )
          )}
        </main>

        {/* Footer */}
        <footer className={`border-t py-4 text-center text-[10px] shrink-0 px-4 ${tc('border-[#132235] bg-[#0b1726] text-[#64748b]', 'border-slate-200 bg-white/60 text-slate-500')}`}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20d09b]" />
              <span className="font-mono">Direct vendor links • No middleman markup</span>
            </div>
            <span className={tc('text-[#475569]', 'text-slate-400')}>Stanza AI Ethical Travel Curator</span>
          </div>
        </footer>

        {/* Sub-modals */}
        {showAuthModal && (
          <StanzaAuthModal
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={handleLoginSuccess}
            isDarkMode={isDarkMode}
          />
        )}

        {showEmbedGuideModal && (
          <StanzaEmbedGuideModal onClose={() => setShowEmbedGuideModal(false)} isDarkMode={isDarkMode} />
        )}

        {showShareModal && currentItinerary && (
          <StanzaSharePdfModal
            itinerary={currentItinerary}
            onClose={() => setShowShareModal(false)}
            onDownloadPdf={handleDownloadPdf}
            isDarkMode={isDarkMode}
          />
        )}

        {showSavedModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className={`${tc('bg-[#0b1726] border-[#1a2d42] text-white', 'bg-white border-slate-200 text-slate-800')} border rounded-3xl w-full max-w-xl p-6 shadow-2xl relative space-y-4 max-h-[85vh] flex flex-col`}>
              <div className={`flex items-center justify-between border-b pb-3 ${tc('border-[#1a2d42]', 'border-slate-200')}`}>
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#20d09b]" />
                  <h3 className={`font-serif text-lg font-bold ${tc('text-white', 'text-slate-900')}`}>
                    Saved Stanzas ({savedItineraries.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowSavedModal(false)}
                  className={`p-1.5 rounded-full ${tc('bg-[#132235] hover:bg-[#1a2d42] text-[#94a3b8]', 'bg-slate-100 hover:bg-slate-200 text-slate-500')} cursor-pointer`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {savedItineraries.length === 0 ? (
                  <p className={`text-xs text-center py-8 ${tc('text-[#64748b]', 'text-slate-500')}`}>
                    No saved itineraries yet. Curate a Stanza to save here!
                  </p>
                ) : (
                  savedItineraries.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentItinerary(item);
                        setViewMode('view');
                        setShowSavedModal(false);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 group ${tc('bg-[#132235] border-[#1a2d42] hover:border-[#20d09b]', 'bg-slate-50 border-slate-200 hover:border-[#20d09b]')}`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[#20d09b] bg-[#20d09b]/10 px-2.5 py-0.5 rounded-full border border-[#20d09b]/20">
                          {item.destination} • {item.durationDays} Days
                        </span>
                        <h4 className={`font-serif text-sm font-bold group-hover:text-[#20d09b] ${tc('text-white', 'text-slate-800')}`}>
                          {item.title}
                        </h4>
                        <p className={`text-[11px] ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                          Budget: {item.totalEstimatedCost} • {item.travelers}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDeleteSaved(item.id, e)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${tc('text-[#64748b] hover:text-red-400 hover:bg-red-500/10', 'text-slate-400 hover:text-red-500 hover:bg-red-50')}`}
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-[#20d09b]" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
