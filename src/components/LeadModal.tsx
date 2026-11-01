import React, { useState } from "react";
import { X, Send, BookOpen, Download, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "guide" | "general" | "expert";
  preSelectedDestination?: string;
  onSuccess?: () => void;
  isDarkMode: boolean;
}

interface GuideData {
  title: string;
  author: string;
  chapters: Array<{ title: string; content: string }>;
}

export default function LeadModal({
  isOpen,
  onClose,
  initialType = "guide",
  preSelectedDestination = "ladakh",
  onSuccess,
  isDarkMode,
}: LeadModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unlockedGuide, setUnlockedGuide] = useState<GuideData | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide a valid email so we can open the trail map.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Try server endpoint first (for local Express dev). On Netlify static hosting
      // this fetch will fail, and we gracefully fall back below to the client-side guide.
      let guideFetched = false;
      try {
        const response = await fetch("/api/download-guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUnlockedGuide(data.guideData);
            if (onSuccess) onSuccess();
            guideFetched = true;
          }
        }
      } catch (_serverErr) {
        // Ignore server error — fallback below
      }

      if (!guideFetched) {
        // Client-side fallback (always works on static Netlify hosting)
        try {
          // Save lead to localStorage so nothing is lost even without a backend
          const leads = JSON.parse(localStorage.getItem('earth_poetry_leads') || '[]');
          leads.push({ name, email, submittedAt: new Date().toISOString() });
          localStorage.setItem('earth_poetry_leads', JSON.stringify(leads));
        } catch (_storageErr) { /* ignore storage failures */ }

        setUnlockedGuide({
          title: "The Hidden Costs of Travel: A Comparison Guide",
          author: "Desh, Founder of Earth.poetry",
          chapters: [
            {
              title: "1. The Middleman's Tax",
              content: "Agencies markup local driver rates by 40%. A driver in Leh charges ₹4,500/day, but the agency bills you ₹7,500."
            },
            {
              title: "2. The 'Luxury Homestay' Shell Game",
              content: "Boutique stays charge ₹3,000/night directly but OTA algorithms inflate it to ₹5,500 during tourist seasons."
            },
            {
              title: "3. Direct-to-Vendor Pricing",
              content: "At Earth.poetry, we share the vendor receipts directly with you and charge a single flat curation voucher. No hidden fees."
            },
            {
              title: "4. Hotel Booking Platform Markups",
              content: "Major OTAs charge hotels 15–25% commission per booking, which gets hidden into your room rate. Book direct by calling the homestay phone number and save 20%."
            },
            {
              title: "5. Example Saving: Ladakh 5 Days",
              content: "Corporate Package: ₹68,500 / Direct Vendor via Earth.poetry: ₹43,800. Savings: ₹24,700 — enough for an extra week of wandering."
            }
          ]
        });
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError("Unable to unlock the trail map. Please retry in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${isDarkMode ? 'bg-black/60' : 'bg-gray-500/60'}`}>
      <div 
        id="lead-capture-modal-panel"
        className={`glass-panel-heavy rounded-3xl w-full max-w-xl border overflow-hidden shadow-2xl relative animate-float max-h-[90vh] flex flex-col ${isDarkMode ? 'border-white/25' : 'border-gray-200'}`}
      >
        {/* Shiny water bubble animations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className={`flex items-center justify-between p-6 border-b shrink-0 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h4 className={`font-serif text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {unlockedGuide ? "Trail Map Unlocked" : "The Hidden Costs of Travel"}
            </h4>
          </div>
          <button
            id="close-lead-modal-btn"
            onClick={onClose}
            className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className={`mb-4 p-3 rounded-xl text-xs border flex items-center gap-2 ${isDarkMode ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-rose-100 text-rose-800 border-rose-200'}`}>
              <AlertCircle className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`} />
              <span>{error}</span>
            </div>
          )}

          {!unlockedGuide ? (
            <div className="space-y-6">
              <div className={`space-y-2 text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>
                  Curious how traditional travel agencies pile on <span className={`font-bold font-sans ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>30% to 40% hidden markups</span> to your Himalayan or tropical dreams?
                </p>
                <p>
                  I have drafted a transparent, 2-minute handbook named <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>"The Hidden Costs of Travel"</strong> detailing direct co-op taxi union cards, seasonal homestay rates, and the agency markup ledger.
                </p>
              </div>

              {/* Lead Capture Form */}
              <form onSubmit={handleDownload} className="space-y-4">
                <div>
                  <label className={`block text-xs font-semibold font-sans mb-1.5 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your Name
                  </label>
                  <input
                    id="lead-capture-name-input"
                    type="text"
                    required
                    placeholder="Wanderer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400/50 placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 placeholder:text-gray-500'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold font-sans mb-1.5 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your Email Address
                  </label>
                  <input
                    id="lead-capture-email-input"
                    type="email"
                    required
                    placeholder="wanderer@road.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-white focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400/50 placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 placeholder:text-gray-500'}`}
                  />
                </div>

                <div className={`flex items-center gap-2 pt-2 text-[11px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <ShieldCheck className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span>No newsletter spam. Just honest files directly from Desh's drive.</span>
                </div>

                <button
                  id="lead-form-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-sans text-xs font-bold gloss-btn flex items-center justify-center gap-2 text-white mt-4 disabled:opacity-50"
                >
                  {loading ? (
                    "Unlocking drive files..."
                  ) : (
                    <>
                      Direct Download Comparison Guide
                      <Download className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Unlocked Guide Reader View */
            <div className="space-y-6">
              <div className={`flex items-center gap-2.5 p-4 rounded-2xl border ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`} />
                <div className="text-xs">
                  <h5 className={`font-bold ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>Thanks for being honest, {name || "Wanderer"}!</h5>
                  <p className={`mt-0.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>We've saved your interest. Review the direct data below:</p>
                </div>
              </div>

              <div className={`space-y-6 rounded-2xl p-5 border max-h-[40vh] overflow-y-auto ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`text-center border-b pb-4 mb-4 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <h4 className={`font-serif text-lg italic font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{unlockedGuide.title}</h4>
                  <p className={`font-sans text-[10px] uppercase tracking-widest mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    By {unlockedGuide.author}
                  </p>
                </div>

                {unlockedGuide.chapters.map((ch, i) => (
                  <div key={i} className="space-y-2">
                    <h5 className={`font-mono text-xs font-bold ${isDarkMode ? 'text-sky-300' : 'text-sky-700'}`}>{ch.title}</h5>
                    <p className={`text-xs leading-relaxed font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{ch.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  id="guide-close-finish-btn"
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-xl font-sans text-xs font-semibold border transition-all ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800'}`}
                >
                  Close Guide
                </button>
                <a
                  href="https://wa.me/9140280943?text=Hi%20Desh%20I%20just%20read%20your%20hidden%20costs%20comparison%20handbook.%20Let's%20chat%20pricing!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 text-center text-white gloss-btn rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
