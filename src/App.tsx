import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  Download, 
  BookOpen, 
  MessageSquare, 
  Check, 
  Trash2, 
  Waves,
  Eye,
  Menu,
  X,
  Volume2,
  TrendingDown,
  ChevronDown,
  Instagram,
  Sun,
  Moon,
  Layers,
  Mountain,
  Snowflake,
  Shield,
  Phone,
  Star
} from "lucide-react";
import "leaflet/dist/leaflet.css";

import { DESTINATIONS, TESTIMONIALS } from "./data";
import { HIMACHAL_TREKS } from "./data/himachalTreks";
import { CuratedStory, Destination, Trek } from "./types";
import ComparisonSlider from "./components/ComparisonSlider";
import LeadModal from "./components/LeadModal";
import PoeticItinerary from "./components/PoeticItinerary";
import DestinationDetail from "./components/DestinationDetail";
import TrekDetailModal from "./components/TrekDetailModal";
import { StanzaPlannerModal } from "./components/StanzaPlannerModal";
import { db, collection, addDoc, serverTimestamp } from "./lib/firebase";
import { generateCuratedStoryClient } from "./lib/stanzaGeminiClient";

export default function App() {
  // Mobile Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Listen for theme toggle events from inside Stanza modal
  useEffect(() => {
    const onToggleTheme = () => setIsDarkMode((prev) => !prev);
    window.addEventListener('app:toggle-theme', onToggleTheme);
    return () => window.removeEventListener('app:toggle-theme', onToggleTheme);
  }, []);

  // Fix browser tab title (hardcoded to override stale dist/index.html)
  useEffect(() => {
    document.title = 'Earth Poetry — Ethical AI Travel Itineraries, Direct Vendor Prices';
  }, []);

  // Form States
  const [targetDestination, setTargetDestination] = useState("Leh Ladakh");
  const [vibe, setVibe] = useState("Peace");
  const [souls, setSouls] = useState(2);
  const [departureDate, setDepartureDate] = useState("2026-07-20");
  const [daysCount, setDaysCount] = useState(5);

  // Direct Lead database form metadata
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [querySaved, setQuerySaved] = useState(false);

  // Lead modal trigger
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Stanza AI Planner Modal
  const [isStanzaModalOpen, setIsStanzaModalOpen] = useState(false);

  // AI curation response
  const [aiStory, setAiStory] = useState<CuratedStory | null>(null);
  const [isCurating, setIsCurating] = useState(false);
  const [curationError, setCurationError] = useState("");
  const [selectedDestinationDetail, setSelectedDestinationDetail] = useState<Destination | null>(null);

  // Upcoming Himachal Treks
  const [isTrekModalOpen, setIsTrekModalOpen] = useState(false);
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);

  // Synchronize selectedDestinationDetail state with browser history (back button support)
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ view: "home" }, "");
    }
  }, []);

  useEffect(() => {
    if (selectedDestinationDetail) {
      if (window.history.state?.view !== "detail") {
        window.history.pushState({ view: "detail" }, "");
      }
    }
  }, [selectedDestinationDetail]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If we popped back to home (or any state that isn't detail), close the detail panel
      if (event.state?.view !== "detail") {
        setSelectedDestinationDetail(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Refs for smooth navigation/scroll
  const destinationsRef = useRef<HTMLDivElement>(null);
  const treksRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  const inquiryRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  // Preset quick fill for destinations
  const handleCuratePreset = (destName: string, destVibe: string) => {
    setTargetDestination(destName);
    setVibe(destVibe);
    scrollTo(inquiryRef);
  };

  // Submit flow key API curation
  const handleCurateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setCurationError("Precious details missing. Desh needs your Name, Email, and Phone to register this honest chapter query.");
      return;
    }

    setIsCurating(true);
    setCurationError("");
    setAiStory(null);
    setQuerySaved(false);

    // Scroll to results container area smoothly
    setTimeout(() => {
      if (inquiryRef.current) {
        inquiryRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);

    // 1. Persist query directly in Firestore
    try {
      await addDoc(collection(db, "queries"), {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        destination: targetDestination,
        vibe,
        souls,
        departureDate,
        daysCount,
        inspiration: inspiration || "None provided",
        createdAt: serverTimestamp()
      });
      setQuerySaved(true);
    } catch (fbErr) {
      console.error("Firestore submission failed: ", fbErr);
      // We don't block the curation flow, but we can log it.
    }

    try {
      const data = await generateCuratedStoryClient(
        targetDestination,
        vibe,
        souls,
        departureDate,
        daysCount
      );
      setAiStory(data);
    } catch (err: any) {
      console.error(err);
      setCurationError("We had a temporary issue connecting to our direct vendor grids. Please click 'Generate' again to build with our hand-settled fallback.");
    } finally {
      setIsCurating(false);
    }
  };

  if (selectedDestinationDetail) {
    return (
      <DestinationDetail
              isDarkMode={isDarkMode}
              destination={selectedDestinationDetail}
              onBack={() => {
                setSelectedDestinationDetail(null);
                if (window.history.state?.view === "detail") {
                  window.history.back();
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onSelectAndCurate={(destName, destVibe) => {
                setSelectedDestinationDetail(null);
                if (window.history.state?.view === "detail") {
                  window.history.back();
                }
                // Small delay to let component transition gracefully
                setTimeout(() => {
                  handleCuratePreset(destName, destVibe);
                }, 150);
              }}
            />
    );
  }

  return (
    <div className={`min-h-screen font-sans relative overflow-x-hidden ${isDarkMode ? 'bg-slate-950 text-white selection:bg-emerald-400 selection:text-slate-950' : 'bg-gray-50 text-gray-900 selection:bg-emerald-400 selection:text-gray-900'}`}>
      
      {/* Absolute background visual bubble spheres representing Frutiger Aero aesthetic */}
      <div className={`absolute top-10 left-5 w-40 h-40 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${isDarkMode ? 'bg-sky-500/10 hover:bg-sky-500/20' : 'bg-sky-400/15 hover:bg-sky-400/25'}`}></div>
      <div className={`absolute top-[20%] right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20' : 'bg-emerald-400/15 hover:bg-emerald-400/25'}`}></div>
      <div className={`absolute top-[50%] left-[-100px] w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDarkMode ? 'bg-lime-500/5' : 'bg-lime-400/10'}`}></div>
      <div className={`absolute bottom-40 right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-400/15'}`}></div>

      {/* Frutiger Aero rising glassy background bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute bottom-0 left-[10%] w-8 h-8 rounded-full blur-[1px] animate-bubble-1 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-900/5 border border-gray-900/10'}`}></div>
        <div className={`absolute bottom-0 left-[45%] w-12 h-12 rounded-full blur-[1px] animate-bubble-2 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-900/5 border border-gray-900/10'}`}></div>
        <div className={`absolute bottom-0 left-[80%] w-6 h-6 rounded-full blur-[2px] animate-bubble-3 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-900/5 border border-gray-900/10'}`}></div>
      </div>

      {/* Floating navigation bar */}
      <nav className={`fixed top-0 inset-x-0 z-40 backdrop-blur-md border-b ${isDarkMode ? 'bg-slate-950/60 border-white/10' : 'bg-white/70 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-white/20">
              <Compass className="w-4.5 h-4.5 text-white animate-spin" style={{ animationDuration: "12s" }} />
            </div>
            <span className={`font-serif text-xl tracking-tight font-extrabold flex items-baseline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Earth<span className="text-emerald-500 italic font-semibold">.poetry</span>
            </span>
          </div>

          {/* Desktop Nav Items */}
          <div className={`hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <button onClick={() => scrollTo(treksRef)} className={`hover:text-sky-400 transition-colors cursor-pointer font-bold relative ${isDarkMode ? 'hover:text-sky-300' : 'hover:text-sky-600'}`}>
              <span className="absolute -top-1.5 -right-3 inline-flex items-center justify-center px-1.5 py-0.5 text-[7px] font-bold leading-none text-white bg-gradient-to-r from-rose-500 to-orange-500 rounded-full animate-pulse">NEW</span>
              Himalayan Odyssey
            </button>
            <button onClick={() => scrollTo(destinationsRef)} className={`hover:text-emerald-400 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-emerald-300' : 'hover:text-emerald-600'}`}>The Stanzas</button>
            <button onClick={() => scrollTo(comparisonRef)} className={`hover:text-emerald-400 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-emerald-300' : 'hover:text-emerald-600'}`}>Pricing Ethics</button>
            <button onClick={() => scrollTo(founderRef)} className={`hover:text-emerald-400 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-emerald-300' : 'hover:text-emerald-600'}`}>Founder's Path</button>
            <button onClick={() => scrollTo(inquiryRef)} className={`hover:text-emerald-400 transition-colors cursor-pointer ${isDarkMode ? 'hover:text-emerald-300' : 'hover:text-emerald-600'}`}>Begin Chapter</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full border border-white/10 hover:border-emerald-400 hover:bg-white/5 transition-all"
              title="Toggle day/night mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-gray-300 hover:text-emerald-300" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700 hover:text-emerald-600" />
              )}
            </button>
            <a
              href="https://www.instagram.com/earth_poetry_travels?igsh=MWFudGpzbjlpdHprcw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-white/10 hover:border-emerald-400 hover:bg-white/5 transition-all"
              title="Follow us on Instagram"
            >
              <Instagram className={`w-4 h-4 ${isDarkMode ? 'text-gray-300 hover:text-emerald-300' : 'text-gray-600 hover:text-emerald-600'}`} />
            </a>
            <button
              id="top-nav-download-cta"
              onClick={() => setIsLeadModalOpen(true)}
              className={`px-4 py-2 rounded-full font-sans text-xs font-bold border transition-all flex items-center gap-1.5 ${isDarkMode ? 'text-gray-200 border-white/10 hover:border-emerald-400 hover:text-emerald-300 bg-white/5 hover:bg-white/10' : 'text-gray-800 border-gray-300 hover:border-emerald-500 hover:text-emerald-700 bg-white/70 hover:bg-white'}`}
            >
              <Download className="w-3.5 h-3.5" />
              Direct Pricing Guide
            </button>
            <button
              id="top-nav-stanza-ai-cta"
              onClick={() => setIsStanzaModalOpen(true)}
              className={`px-4 py-2 rounded-full font-sans text-xs font-bold border transition-all flex items-center gap-1.5 ${isDarkMode ? 'text-sky-200 border-sky-400/30 hover:border-sky-400 bg-sky-500/10 hover:bg-sky-500/20 hover:text-sky-100' : 'text-sky-800 border-sky-400/50 hover:border-sky-500 bg-sky-50 hover:bg-sky-100 hover:text-sky-900'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              Stanza AI
            </button>
            <button
              id="top-nav-curate-cta"
              onClick={() => scrollTo(inquiryRef)}
              className="px-5 py-2.5 rounded-full font-sans text-xs font-bold shadow-md gloss-btn flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Curate
            </button>
          </div>

          {/* Mobile responsive toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1 rounded-lg"
              title="Toggle day/night mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile full screen drawer */}
        {mobileMenuOpen && (
          <div className={`md:hidden backdrop-blur-lg border-b px-4 py-6 space-y-4 text-sm font-semibold tracking-wide ${isDarkMode ? 'bg-slate-950/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
            <button onClick={() => scrollTo(treksRef)} className={`block w-full text-left py-2 flex items-center gap-2 ${isDarkMode ? 'text-sky-300 hover:text-sky-200' : 'text-sky-700 hover:text-sky-600'}`}>
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[7px] font-bold leading-none text-white bg-gradient-to-r from-rose-500 to-orange-500 rounded-full">NEW</span>
              Himalayan Odyssey — Upcoming Treks
            </button>
            <button onClick={() => scrollTo(destinationsRef)} className={`block w-full text-left py-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>The Stanzas / Destinations</button>
            <button onClick={() => scrollTo(comparisonRef)} className={`block w-full text-left py-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>Pricing Comparison</button>
            <button onClick={() => scrollTo(founderRef)} className={`block w-full text-left py-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>Started at 16 (Desh's Story)</button>
            <button onClick={() => scrollTo(inquiryRef)} className={`block w-full text-left py-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>Begin Inquiry Chapter</button>
            <div className={`h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} my-2`}></div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-2 w-full py-2"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Switch to Dark Mode</span>
                </>
              )}
            </button>
            <a
              href="https://www.instagram.com/earth_poetry_travels?igsh=MWFudGpzbjlpdHprcw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 w-full py-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
            >
              <Instagram className="w-4 h-4" />
              Follow us on Instagram
            </a>
            <div className="flex flex-col gap-2">
              <button
                id="mobile-nav-stanza-ai-cta"
                onClick={() => { setIsStanzaModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 shadow-md"
              >
                ✨ Stanza AI Itinerary Builder
              </button>
              <button
                _id="mobile-nav-download-cta"
                onClick={() => { setIsLeadModalOpen(true); setMobileMenuOpen(false); }}
                className={`w-full py-2.5 rounded-xl border text-center text-xs font-bold ${isDarkMode ? 'border-white/10 text-gray-300 bg-white/5' : 'border-gray-300 text-gray-700 bg-gray-100'}`}
              >
                Download Cost Guide
              </button>
              <button
                _id="mobile-nav-curate-cta"
                onClick={() => scrollTo(inquiryRef)}
                className="w-full py-3 rounded-xl text-center text-xs font-bold text-white gloss-btn"
              >
                Curate Personal Map
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Section 1: Hero Block */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        
        {/* Pangong Lake pan background. Image is dynamic and floats behind */}
        <div className="absolute inset-0 z-0 opacity-25 md:opacity-35 scale-105 pointer-events-none">
          <img
            src="/images/pangong_lake_1782050534216.jpg"
            alt="Pangong Lake"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none filter brightness-75 contrast-125"
          />
          {/* Emerald-blue fading gradients */}
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-b from-slate-950/20 via-slate-950/50 to-slate-950' : 'bg-gradient-to-b from-gray-50/30 via-gray-50/60 to-gray-50'}`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-mono tracking-widest uppercase mb-4 ${isDarkMode ? 'bg-white/5 border-white/10 text-sky-300' : 'bg-gray-100 border-gray-300 text-sky-600'}`}
          >
            <Waves className="w-3.5 h-3.5 text-emerald-500 rotate-12 animate-pulse" />
            DIRECT VENDOR PRICING • 0% CORPORATE MARKUPS
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className={`font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-4xl mx-auto leading-tight sm:leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            “The Earth is <span className="text-emerald-500 italic font-medium">Poetry</span>.<br />
            Why should reading it cost a fortune?”
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`font-sans text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            No middleman margins. No hidden agency cuts. Pay exactly what the local drivers, homestays, and co-ops charge. It’s not just a vacation—it is an act of wandering honesty.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              id="hero-himalayan-odyssey-btn"
              onClick={() => scrollTo(treksRef)}
              className="px-8 py-4.5 rounded-full font-sans text-sm font-bold text-white shadow-[0_0_30px_rgba(56,189,248,0.4)] bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 hover:from-sky-400 hover:via-cyan-400 hover:to-emerald-400 transition-all flex items-center justify-center gap-2 w-full sm:w-auto border border-white/20"
            >
              <Mountain className="w-4.5 h-4.5 animate-pulse" />
              ⛰ Himalayan Odyssey
            </button>
            <button
              id="hero-stanza-ai-cta-btn"
              onClick={() => setIsStanzaModalOpen(true)}
              className="px-8 py-4.5 rounded-full font-sans text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] gloss-btn flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Layers className="w-4.5 h-4.5" />
              ✨ Stanza AI Itinerary Builder
            </button>
          </motion.div>
          
          <div className="pt-10 flex justify-center">
            <button 
              id="scroll-indicators-chevron"
              onClick={() => scrollTo(destinationsRef)} 
              className={`transition-colors cursor-pointer animate-bounce ${isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <ChevronDown className="w-6 h-6 text-emerald-500" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Poetry of Pricing (The USP) */}
      <section ref={comparisonRef} className={`py-20 md:py-24 border-t relative ${isDarkMode ? 'border-white/5 bg-slate-950/40' : 'border-gray-200 bg-gray-50/60'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="font-mono text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}">The Poetry of Pricing</span>
            <h2 className={`font-serif text-3xl md:text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Why pay traditional margins to corporate travel desks?
            </h2>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Traditional tourism aggregators add a <span className="text-rose-500 font-bold">30% to 40% margin</span> on local services. We shared the raw spreadsheet receipts. At Earth.poetry, pay exactly what the local team asks, settled directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            
            {/* USP Card 1 */}
            <div className={`glass-panel rounded-2xl p-6 border relative ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="text-emerald-500 font-serif text-3xl font-extrabold mb-3">01</div>
              <h4 className={`font-sans font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Direct Local Accounts</h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                We settle payments straight into local driver bank lists and host accounts. No third-party hotel agencies slice commission.
              </p>
            </div>

            {/* USP Card 2 */}
            <div className={`glass-panel rounded-2xl p-6 border relative ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="text-sky-500 font-serif text-3xl font-extrabold mb-3">02</div>
              <h4 className={`font-sans font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Transparent Curation Fee</h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                We charge a flat curation advisory fee to map your trail and share direct local vendor details. Honest booking starts with clear pay.
              </p>
            </div>

            {/* USP Card 3 */}
            <div className={`glass-panel rounded-2xl p-6 border relative ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="text-lime-500 font-serif text-3xl font-extrabold mb-3">03</div>
              <h4 className={`font-sans font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Unfiltered Wanderlust</h4>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Stay in co-op homestays, explore tracks built by wanderers who know local streams, and live the sensory poem of real nature.
              </p>
            </div>

          </div>

          {/* Mount the Live quote comparison Engine slider component here */}
          <ComparisonSlider isDarkMode={isDarkMode} onSelectDestination={(key) => {
            const matched = DESTINATIONS.find(d => d.key === key);
            if (matched) {
              handleCuratePreset(matched.title, matched.vibe);
            }
          }} />

        </div>
      </section>

      {/* Section 2.5: Himalayan Odyssey — Upcoming Himachal Treks */}
      <section ref={treksRef} className={`py-20 md:py-28 border-t relative overflow-hidden ${isDarkMode ? 'border-white/5 bg-gradient-to-b from-slate-950/40 via-sky-950/20 to-slate-950/40' : 'border-gray-200 bg-gradient-to-b from-gray-50/60 via-sky-50/30 to-gray-50/60'}`}>

        {/* Decorative gradient orbs */}
        <div className={`absolute top-20 -left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-60 ${isDarkMode ? 'bg-sky-500/10' : 'bg-sky-400/15'}`}></div>
        <div className={`absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-60 ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-400/15'}`}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Himalayan Odyssey Hero CTA Button Banner */}
          <div className="mb-14">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-mono tracking-widest uppercase ${isDarkMode ? 'bg-gradient-to-r from-sky-500/15 to-emerald-500/15 border-sky-400/30 text-sky-300' : 'bg-gradient-to-r from-sky-50 to-emerald-50 border-sky-300 text-sky-700'}`}>
                <Snowflake className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                Limited Seats • Batches Open Now
              </div>

              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className={`bg-gradient-to-r ${isDarkMode ? 'from-sky-400 via-cyan-400 to-emerald-400' : 'from-sky-600 via-cyan-600 to-emerald-600'} bg-clip-text text-transparent`}>Himalayan Odyssey</span>
                <br className="hidden sm:block" />
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Upcoming Himachal Expeditions</span>
              </h2>

              <p className={`font-sans text-sm md:text-base max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Five handpicked treks with day-wise plans, comfortable stays, and a safety-first approach. 
                Wander the Dhauladhars and Pir Panjals with verified local guides — the raw mountain way.
              </p>

              {/* Giant Himalayan Odyssey Banner Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    document.getElementById('trek-cards-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`group relative inline-flex items-center gap-4 px-8 sm:px-12 py-5 sm:py-6 rounded-3xl font-extrabold tracking-wide text-white shadow-2xl overflow-hidden border transition-all duration-300
                    ${isDarkMode
                      ? 'bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 border-white/20 shadow-[0_0_50px_rgba(56,189,248,0.25)] hover:shadow-[0_0_60px_rgba(16,185,129,0.35)]'
                      : 'bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 border-white/40 shadow-[0_10px_40px_rgba(56,189,248,0.3)] hover:shadow-[0_15px_50px_rgba(16,185,129,0.4)]'
                    }`}
                >
                  {/* Glossy sheen overlay */}
                  <span className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none"></span>

                  {/* Animated pulse glow */}
                  <span className={`absolute -inset-1 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none ${isDarkMode ? 'bg-gradient-to-r from-sky-400 to-emerald-400' : 'bg-gradient-to-r from-sky-400 to-emerald-400'}`}></span>

                  <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
                      <Mountain className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow" />
                    </div>
                    <div className="text-left">
                      <div className="font-serif text-xl sm:text-2xl md:text-3xl leading-none">
                        Explore 5 Treks
                      </div>
                      <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-1 text-white/80">
                        Triund → Kheerganga → Beas Kund → Bhrigu → Hampta Pass
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 ml-2">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 absolute"></span>
                        <span className="font-mono text-[9px] uppercase tracking-wider ml-3">₹10,000 Onwards</span>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-white/90 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </motion.button>

                <div className="flex items-center justify-center gap-3 sm:gap-6 mt-5 flex-wrap">
                  {[
                    { icon: Users, label: "Max 10 per Guide", value: "Small Groups" },
                    { icon: Shield, label: "Medical Kit + O2", value: "Safety First" },
                    { icon: Star, label: "Verified Local", value: "Handpicked Stays" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Icon className={`w-4 h-4 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`} />
                        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider">
                          <span className={`font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.value}</span>
                          <span className="mx-1">•</span>{item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trek Cards Grid */}
          <div id="trek-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {HIMACHAL_TREKS.map((trek, idx) => {
              const difficultyColor = trek.difficulty.toLowerCase().includes("easy") && !trek.difficulty.toLowerCase().includes("moderate")
                ? (isDarkMode ? "text-emerald-300 bg-emerald-500/15 border-emerald-400/30" : "text-emerald-700 bg-emerald-50 border-emerald-300")
                : trek.difficulty.toLowerCase().includes("moderate")
                ? (isDarkMode ? "text-sky-300 bg-sky-500/15 border-sky-400/30" : "text-sky-700 bg-sky-50 border-sky-300")
                : (isDarkMode ? "text-amber-300 bg-amber-500/15 border-amber-400/30" : "text-amber-700 bg-amber-50 border-amber-300");

              return (
                <motion.div
                  key={trek.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  onClick={() => { setSelectedTrek(trek); setIsTrekModalOpen(true); }}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer h-[480px] transition-all duration-500
                    ${isDarkMode
                      ? 'bg-gradient-to-b from-slate-900/60 via-slate-950/70 to-slate-950/80 border border-white/10 hover:border-sky-400/40 hover:shadow-[0_20px_60px_rgba(56,189,248,0.15)]'
                      : 'bg-white/70 border border-gray-200 hover:border-sky-400 hover:shadow-[0_20px_60px_rgba(56,189,248,0.2)]'
                    } backdrop-blur-xl`}
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={trek.imageUrl}
                      alt={trek.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                    />
                    {/* Glass blur overlay */}
                    <div className={`absolute inset-0 transition-all duration-700 ${isDarkMode
                      ? 'bg-gradient-to-b from-slate-950/10 via-slate-950/30 to-slate-950/90 group-hover:from-slate-950/5 group-hover:via-slate-950/20 group-hover:to-slate-950/85'
                      : 'bg-gradient-to-b from-gray-900/5 via-gray-900/25 to-gray-900/85 group-hover:from-gray-900/0 group-hover:via-gray-900/15 group-hover:to-gray-900/80'
                    }`}></div>
                    {/* Vibrant glass gradient overlay */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isDarkMode
                      ? 'bg-gradient-to-tr from-sky-500/10 via-transparent to-emerald-500/10'
                      : 'bg-gradient-to-tr from-sky-400/8 via-transparent to-emerald-400/8'
                    }`}></div>
                  </div>

                  {/* Ribbon badge */}
                  <div className="absolute top-0 right-0 z-20">
                    <div className={`transform rotate-0 translate-x-0 translate-y-0`}>
                      <div className={`px-4 py-1.5 text-[9px] font-mono font-extrabold uppercase tracking-widest rounded-bl-2xl border-t-0 border-r-0 ${
                        idx === 4
                          ? (isDarkMode ? 'bg-gradient-to-r from-rose-500/80 to-orange-500/80 text-white border-rose-400/50' : 'bg-gradient-to-r from-rose-500 to-orange-500 text-white')
                          : (isDarkMode ? 'bg-slate-950/70 text-sky-300 border-sky-400/30 backdrop-blur-md border-l border-b' : 'bg-white/85 text-sky-700 border-sky-200 backdrop-blur-md border-l border-b')
                      }`}>
                        {idx === 4 ? "✨ Signature Trek" : idx === 0 ? "Beginner Pick" : idx === 1 ? "Hot Spring Trek" : idx === 2 ? "Glacial Lake" : "High Altitude"}
                      </div>
                    </div>
                  </div>

                  {/* Card Top: Difficulty + Duration Badges */}
                  <div className="relative z-10 p-4 sm:p-5 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase tracking-wider border backdrop-blur-md ${difficultyColor}`}>
                        {trek.difficulty}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase tracking-wider border backdrop-blur-md ${
                        isDarkMode ? 'text-white bg-white/10 border-white/20' : 'text-gray-800 bg-white/70 border-gray-300'
                      }`}>
                        {trek.duration}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Content + CTA */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5 space-y-3">
                    <div className="space-y-1.5 cursor-pointer" onClick={() => { setSelectedTrek(trek); setIsTrekModalOpen(true); }}>
                      <p className={`font-mono text-[9px] uppercase tracking-[0.2em] font-semibold drop-shadow ${isDarkMode ? 'text-sky-300' : 'text-sky-200'}`}>
                        {trek.location}
                      </p>
                      <h3 className={`font-serif text-xl sm:text-2xl font-extrabold leading-tight drop-shadow-lg ${isDarkMode ? 'text-white' : 'text-white'}`}>
                        {trek.name}
                      </h3>
                      <p className={`font-sans text-xs italic leading-snug line-clamp-2 drop-shadow ${isDarkMode ? 'text-gray-200' : 'text-gray-100'}`}>
                        {trek.tagline}
                      </p>
                    </div>

                    {/* CTA Row */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex flex-col items-start">
                        <span className={`font-mono text-[8px] uppercase tracking-widest leading-none ${isDarkMode ? 'text-gray-500' : 'text-gray-200/80'}`}>
                          Starting
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`font-serif text-lg sm:text-xl font-extrabold drop-shadow ${isDarkMode ? 'text-emerald-400' : 'text-emerald-400'}`}>
                            ₹10K
                          </span>
                          <span className={`font-mono text-[9px] leading-none ${isDarkMode ? 'text-gray-400' : 'text-gray-200/80'}`}>
                            /person
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedTrek(trek); setIsTrekModalOpen(true); }}
                        className={`px-4 py-2.5 rounded-xl font-sans text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all border shadow-lg
                          ${isDarkMode
                            ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white border-white/20 hover:shadow-[0_0_25px_rgba(56,189,248,0.35)]'
                            : 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white border-white/40 hover:shadow-[0_10px_30px_rgba(56,189,248,0.4)]'
                          }`}
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Glass shine reflection */}
                  <div className={`absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDarkMode ? 'bg-gradient-to-br from-white/5 via-transparent to-transparent' : 'bg-gradient-to-br from-white/10 via-transparent to-transparent'}`}></div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Call Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mt-14 rounded-3xl p-6 sm:p-8 md:p-10 border overflow-hidden relative ${
              isDarkMode
                ? 'bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-transparent border-emerald-400/20'
                : 'bg-gradient-to-r from-emerald-50 via-sky-50 to-white border-emerald-200'
            }`}
          >
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-50 bg-emerald-500/20"></div>
            <div className="grid md:grid-cols-12 items-center gap-6 relative z-10">
              <div className="md:col-span-7 space-y-2">
                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest ${isDarkMode ? 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'}`}>
                  <Phone className="w-3 h-3 animate-pulse" />
                  Direct Line With Desh
                </div>
                <h3 className={`font-serif text-2xl sm:text-3xl font-extrabold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Custom Group? Family Trek? Corporate Batch?
                </h3>
                <p className={`font-sans text-xs sm:text-sm max-w-2xl leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Starting prices are <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>₹10,000 per head</span>, but every journey is negotiable. 
                  Pick up the phone and have a honest chat about dates, group size, and your dream route.
                </p>
              </div>
              <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-3 md:items-end">
                <a
                  href="tel:+919140280943"
                  className="flex-1 md:w-full px-6 sm:px-8 py-4 sm:py-4.5 rounded-2xl font-sans text-sm font-extrabold uppercase tracking-wider text-white gloss-btn-blue flex items-center justify-center gap-2 shadow-xl"
                >
                  <Phone className="w-5 h-5" />
                  Call +91 91402 80943
                </a>
                <button
                  onClick={() => scrollTo(inquiryRef)}
                  className={`flex-1 md:w-full px-6 sm:px-8 py-4 rounded-2xl font-sans text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                    isDarkMode
                      ? 'bg-white/5 border-white/10 text-gray-200 hover:border-emerald-400/40 hover:text-emerald-300 hover:bg-white/10'
                      : 'bg-white border-gray-200 text-gray-800 hover:border-emerald-400 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Fill Inquiry Form
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Section 3: The Stanzas (Destinations) */}
      <section ref={destinationsRef} className="py-20 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <span className={`font-mono text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>The Destinations</span>
              <h2 className={`font-serif text-3xl md:text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                The Stanzas of the Road
              </h2>
              <p className={`text-sm max-w-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Hover over each glass canopy to clear the mist and inspect high-contrast unfiltered nature. Click "Curate My Path" to begin tailoring costs instantly.
              </p>
            </div>

            <div className={`font-mono text-xs border rounded-2xl px-4 py-2 ${isDarkMode ? 'text-gray-500 border-white/5 bg-white/5' : 'text-gray-600 border-gray-200 bg-gray-100'}`}>
              Showing <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>5 raw trails</span> settled directly
            </div>
          </div>

          {/* Interactive Cards list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DESTINATIONS.map((dest) => (
              <div
                id={`destination-card-${dest.key}`}
                key={dest.key}
                className={`group rounded-3xl p-4 border relative overflow-hidden flex flex-col justify-between h-[450px] transition-all hover:shadow-2xl ${isDarkMode ? 'bg-slate-900/40 border-white/10 hover:border-white/25' : 'bg-white/60 border-gray-200 hover:border-gray-300'}`}
              >
                {/* Image Backdrop Container with Interactive Glass hover clearing effect */}
                <div 
                  className="absolute inset-0 z-0 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedDestinationDetail(dest)}
                >
                  <img
                    src={dest.imageUrl}
                    alt={dest.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Glassmorphic semi-transparent blur background layer that CLEARS on hover, lighter on mobile */}
                  <div className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'backdrop-blur-[6px] md:backdrop-blur-[12px] bg-slate-950/40 md:bg-slate-950/60 group-hover:backdrop-blur-[2px] group-hover:bg-slate-950/30' : 'backdrop-blur-[6px] md:backdrop-blur-[12px] bg-gray-900/30 md:bg-gray-900/40 group-hover:backdrop-blur-[2px] group-hover:bg-gray-900/20'}`}></div>
                  {/* Direct bottom linear shade */}
                  <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent' : 'bg-gradient-to-t from-gray-50 via-gray-50/45 to-transparent'}`}></div>
                  
                  {/* Click indicator - visible on mobile, with hover animation on desktop */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <span className={`px-3.5 py-2 rounded-full backdrop-blur-md border text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 shadow-lg transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300 ${isDarkMode ? 'bg-slate-950/80 border-emerald-400/40 text-emerald-300' : 'bg-white/80 border-emerald-500/40 text-emerald-700'}`}>
                      <BookOpen className={`w-3.5 h-3.5 animate-pulse ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      Read Desh's Story
                    </span>
                  </div>
                </div>

                {/* Card Top: Metadata tags */}
                <div className="relative z-10 flex items-center justify-between pointer-events-none">
                  <span className={`font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isDarkMode ? 'text-emerald-300 bg-emerald-500/20' : 'text-emerald-700 bg-emerald-500/20'}`}>
                    {dest.vibe} Trail
                  </span>
                  <div className="flex flex-col items-end">
                    <span className={`font-sans text-[9px] uppercase tracking-widest line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Market: {dest.marketPrice}
                    </span>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border backdrop-blur-md ${isDarkMode ? 'text-white bg-white/10 border-white/20' : 'text-gray-900 bg-white/70 border-gray-300'}`}>
                      Direct: {dest.startingPrice}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Text and CTA details */}
                <div className="relative z-10 space-y-4 pt-16">
                  <div className="cursor-pointer" onClick={() => setSelectedDestinationDetail(dest)}>
                    <h3 className={`font-mono text-xs font-extrabold tracking-widest uppercase mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dest.title}
                    </h3>
                    <h4 className={`font-serif italic text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {dest.subtitle}
                    </h4>
                  </div>
                  
                  <p 
                    className={`text-xs leading-relaxed font-sans min-h-[64px] cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    onClick={() => setSelectedDestinationDetail(dest)}
                  >
                    {dest.story}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      id={`dest-card-story-btn-${dest.key}`}
                      onClick={() => setSelectedDestinationDetail(dest)}
                      className={`py-2.5 rounded-xl font-sans text-[10px] font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-emerald-300' : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-emerald-700'}`}
                    >
                      <BookOpen className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      Desh's Story & Pics
                    </button>

                    <button
                      id={`dest-card-cta-${dest.key}`}
                      onClick={() => handleCuratePreset(dest.title, dest.vibe)}
                      className="py-2.5 rounded-xl font-sans text-[10px] font-extrabold tracking-wide uppercase bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Curate Path Price
                      <ArrowRight className="w-3 h-3 text-slate-950" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 4: Founder's Story (The Soul) */}
      <section ref={founderRef} className={`py-20 md:py-24 border-t relative overflow-hidden ${isDarkMode ? 'border-white/5 bg-slate-950/30' : 'border-gray-200 bg-gray-50/50'}`}>
        
        {/* Abstract decorative water element overlay behind founder */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border rounded-full pointer-events-none scale-75 select-none ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Part: Grayscale to Color hover transition */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div 
                id="founder-photo-card"
                className={`group glass-panel rounded-3xl p-3 border max-w-sm w-full relative overflow-hidden shadow-2xl animate-float cursor-crosshair ${isDarkMode ? 'border-white/25' : 'border-gray-200'}`}
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src="/images/desh_founder_1782051983877.jpg"
                    alt="Desh - Earth Poetry Trail"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto select-none filter contrast-125 hover:scale-105 transition-all duration-700 ease-out md:grayscale md:group-hover:grayscale-0"
                  />
                  {/* Shadow glow overlay representation */}
                  <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-slate-950/80 via-transparent to-transparent' : 'bg-gradient-to-t from-gray-50/80 via-transparent to-transparent'}`}></div>
                  
                  {/* Subtle info label on picture */}
                  <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>Desh under starry peaks</span>
                    <span className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} animate-pulse`}>● GRACEFUL CO-OP TRAILS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Part */}
            <div className="lg:col-span-7 space-y-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-mono tracking-widest uppercase ${isDarkMode ? 'bg-white/5 border-white/10 text-sky-300' : 'bg-gray-100 border-gray-300 text-sky-600'}`}>
                THE FOUNDER'S STORY
              </div>

              <h3 className={`font-serif text-3xl md:text-4xl italic font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                “Started at 16, Still Wandering.”
              </h3>

              <div className={`space-y-4 text-sm leading-relaxed font-sans font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>
                  I didn’t choose travel; it chose me when I was 16, growing up in Lucknow. While others were stuck in classrooms studying textbooks, I was finding myself in the back of local Himachal co-op buses and under high altitude Himalayan stars with drivers.
                </p>
                <p>
                  After years of working from inside the machine at travel giants like <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>Thrillophilia</strong>, I saw the truth: travel was becoming an over-packaged corporate commodity marked up with heavy price tags. Local drivers got pennies while middlemen pocketed commission fees.
                </p>
                <p>
                  I started <span className={`font-serif italic font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Earth.poetry</span> to return travel to those who live for the road. I’ve walked these trails, shaken hands with co-op driver union heads, and drank butter tea in local homes.
                </p>
                <p className={`border-t pt-4 font-serif italic ${isDarkMode ? 'border-white/10 text-gray-200' : 'border-gray-200 text-gray-800'}`}>
                  "I'm not selling you a typical package or booking desk, traveler. I'm sharing my verified maps with you—at the exact direct price I pay."
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <div>
                  <h5 className={`font-serif italic text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Desh</h5>
                  <p className={`font-mono text-[10px] uppercase tracking-widest font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Founder & Wanderer • Lucknow</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Section 4.5: Cofounder's Story */}
      <section className={`py-20 md:py-24 border-t relative overflow-hidden ${isDarkMode ? 'border-white/5 bg-slate-950/30' : 'border-gray-200 bg-gray-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Narrative Part (left for cofounder) */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-mono tracking-widest uppercase ${isDarkMode ? 'bg-white/5 border-white/10 text-sky-300' : 'bg-gray-100 border-gray-300 text-sky-600'}`}>
                THE COFOUNDER'S STORY
              </div>

              <h3 className={`font-serif text-3xl md:text-4xl italic font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                “20+ States. Thousands of memories. One India.”
              </h3>

              <div className={`space-y-4 text-sm leading-relaxed font-sans font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>
                  India is not a destination—it's a thousand worlds woven together by stories, cultures, and landscapes.
                </p>
                <p>
                  Having traveled across 20+ states, from the Himalayas to the deserts, coastlines, villages, and vibrant cities, each journey left a lasting lesson. The mountains taught patience, the deserts resilience, the oceans freedom, and the people humanity.
                </p>
                <p>
                  Earth Poetry was born from these experiences—a collection of stories gathered from roads less traveled. We believe travel is more than visiting places; it's about connecting with cultures, gaining new perspectives, and discovering yourself along the way.
                </p>
                <p className={`border-t pt-4 font-serif italic ${isDarkMode ? 'border-white/10 text-gray-200' : 'border-gray-200 text-gray-800'}`}>
                  "20+ States. Thousands of memories. One India. Infinite stories."
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <div>
                  <h5 className={`font-serif italic text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shivam Kumar</h5>
                  <p className={`font-mono text-[10px] uppercase tracking-widest font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Cofounder & Storyteller</p>
                </div>
              </div>

            </div>

            {/* Visual Part (right for cofounder) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
              <div 
                id="cofounder-photo-card"
                className={`group glass-panel rounded-3xl p-3 border max-w-sm w-full relative overflow-hidden shadow-2xl animate-float cursor-crosshair ${isDarkMode ? 'border-white/25' : 'border-gray-200'}`}
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src="/images/shivam-cofounder.jpg"
                    alt="Shivam Kumar - Earth Poetry Trail"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto select-none filter contrast-125 hover:scale-105 transition-all duration-700 ease-out md:grayscale md:group-hover:grayscale-0"
                  />
                  {/* Shadow glow overlay representation */}
                  <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-slate-950/80 via-transparent to-transparent' : 'bg-gradient-to-t from-gray-50/80 via-transparent to-transparent'}`}></div>
                  
                  {/* Subtle info label on picture */}
                  <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>Wandering through India</span>
                    <span className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} animate-pulse`}>● INFINITE STORIES</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 5: Interactive Lead Gen ("Begin Your Chapter") & Form */}
      <section ref={inquiryRef} className={`py-20 md:py-24 border-t relative ${isDarkMode ? 'border-white/5 bg-slate-950/50' : 'border-gray-200 bg-gray-50/70'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center space-y-4 mb-12">
            <span className={`font-mono text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>Curate Your Stanza</span>
            <h2 className={`font-serif text-3xl md:text-4xl font-extrabold italic ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Begin Your Chapter
            </h2>
            <p className={`text-sm max-w-xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Tell us your heart's pull. Desh and our custom Gemini-powered assistant will curate a direct local map itinerary with genuine receipt cost breakdowns instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Form Left layout */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <form 
                id="chapter-curation-form"
                onSubmit={handleCurateStory} 
                className={`glass-panel p-6 sm:p-8 rounded-3xl border space-y-6 flex-1 flex flex-col justify-between ${isDarkMode ? 'border-white/20' : 'border-gray-200'}`}
              >
                <div className="space-y-4">
                  {/* Contact / Traveler Passport Details */}
                  <div className={`border-b pb-4 mb-2 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <span className={`font-mono text-[9px] uppercase tracking-widest block mb-3 font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      Traveler Information (Saved to Secure Database)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider font-sans mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Full Name
                        </label>
                        <input
                          id="form-client-name"
                          type="text"
                          required
                          placeholder="Your Name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 font-medium ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider font-sans mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Email Address
                        </label>
                        <input
                          id="form-client-email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wider font-sans mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          WhatsApp / Phone
                        </label>
                        <input
                          id="form-client-phone"
                          type="tel"
                          required
                          placeholder="Phone Number"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 font-mono ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dest Select */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider font-sans mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Where does your heart pull you? / Place to Cover
                    </label>
                    <select
                      id="form-destination-selector"
                      value={targetDestination}
                      onChange={(e) => setTargetDestination(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition-colors ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    >
                      <option className={isDarkMode ? 'bg-slate-950' : 'bg-white'} value="Himachal">Himachal — The Mist-Clad Whisper</option>
                      <option className={isDarkMode ? 'bg-slate-950' : 'bg-white'} value="Leh Ladakh">Leh Ladakh — The High-Altitude Prayer</option>
                      <option className={isDarkMode ? 'bg-slate-950' : 'bg-white'} value="Kashmir">Kashmir — The Earth’s Masterpiece</option>
                      <option className={isDarkMode ? 'bg-slate-950' : 'bg-white'} value="The North East">The North East — The Unwritten Chapter</option>
                      <option className={isDarkMode ? 'bg-slate-950' : 'bg-white'} value="Sri Lanka">Sri Lanka — The Island Poem</option>
                    </select>
                  </div>

                  {/* Vibe & Souls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider font-sans mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Your Travel Vibe
                      </label>
                      <select
                        id="form-vibe-selector"
                        value={vibe}
                        onChange={(e) => setVibe(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition-colors ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option className={isDarkMode ? 'bg-slate-950' : 'bg-white'} value="Peace">Peace & Silence</option>
                        <option className={isDarkMode ? 'bg-slate-950' : 'bg-white'} value="Adventure">Raw Adventure</option>
                        <option className={isDarkMode ? 'bg-slate-950' : 'bg-white'} value="Luxury">Honest Comfort (Luxury)</option>
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider font-sans mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Souls on the Road
                      </label>
                      <input
                        id="form-souls-input"
                        type="number"
                        min="1"
                        max="14"
                        value={souls}
                        onChange={(e) => setSouls(Number(e.target.value))}
                        className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition-colors ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>
                  </div>

                  {/* Date & Days */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider font-sans mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        When do you leave?
                      </label>
                      <input
                        id="form-date-input"
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wider font-sans mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Trail Days Count
                      </label>
                      <input
                        id="form-days-input"
                        type="number"
                        min="3"
                        max="14"
                        value={daysCount}
                        onChange={(e) => setDaysCount(Number(e.target.value))}
                        className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 font-semibold ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>
                  </div>

                  {/* Inspiration and Story field */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider font-sans mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Your Inspiration / Story to Travel
                    </label>
                    <textarea
                      id="form-inspiration-textarea"
                      rows={3}
                      placeholder="Share your travel vision or inspiration... Why this trip? What sights, local foods, or secret trails draw you to this path?"
                      value={inspiration}
                      onChange={(e) => setInspiration(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border font-sans text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/30 cursor-text resize-none ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>
                </div>

                {querySaved && (
                  <div className={`p-4 rounded-xl text-xs font-sans flex items-start gap-2.5 mt-4 ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'}`}>
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <div>
                      <p className="font-bold">Inquiry Transmitted to Desh's Database!</p>
                      <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Your receipt has been secure-logged. Dispatching Instant Gemini custom map estimate...</p>
                    </div>
                  </div>
                )}

                <button
                  id="form-submit-curate-btn"
                  type="submit"
                  disabled={isCurating}
                  className="w-full py-4 rounded-xl font-sans text-xs font-extrabold tracking-wide uppercase shadow-lg gloss-btn text-white mt-6 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isCurating ? (
                    <>
                      <Waves className="w-4 h-4 animate-spin" />
                      Saving to Database & Tracing Vendor Grids...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Submit Query & Craft My Story
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Author Snippet Right Card */}
            <div className={`md:col-span-4 glass-panel-heavy rounded-3xl p-6 border flex flex-col justify-between relative overflow-hidden ${isDarkMode ? 'border-white/25' : 'border-gray-200'}`}>
              <div className={`absolute top-0 right-0 p-2 font-mono text-[7px] font-bold tracking-widest uppercase ${isDarkMode ? 'bg-sky-400/20 text-sky-300' : 'bg-sky-100 text-sky-700'}`}>
                CO-OP VERIFIED
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg shrink-0">
                  <img
                    src="/images/desh_founder_1782051983877.jpg"
                    alt="Desh Profile"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                </div>

                <div>
                  <h4 className={`font-serif italic text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Desh says:</h4>
                  <p className={`font-mono text-[9px] uppercase tracking-widest font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Founder of Earth.poetry</p>
                </div>

                <p className={`text-xs leading-relaxed font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  "Hey! Fill out this card. I’ve personally hand-settled accounts with co-op local homestays across Kashmir to Ella. 
                  My assistant will draft your honest ledger instantly so you pay what I pay."
                </p>
              </div>

              <div className={`border-t pt-4 ${isDarkMode ? 'border-white/15' : 'border-gray-200'}`}>
                <div className={`flex items-center gap-2 text-[10px] font-mono leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <Check className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span>100% Direct Rates Sourced</span>
                </div>
              </div>
            </div>

          </div>

          {/* Render Result Container */}
          <div className="mt-12">
            <AnimatePresence mode="wait">
              {isCurating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`glass-panel p-8 rounded-3xl border text-center space-y-4 flex flex-col items-center py-16 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}
                >
                  <Waves className={`w-10 h-10 animate-bounce ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <div className="space-y-2">
                    <h4 className={`font-serif text-xl italic font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>"Consulting with local co-op drivers..."</h4>
                    <p className={`text-xs font-sans tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Desh is pulling the direct union rates, homestay ledgers, and setting up your honest direct pricing stanza.
                    </p>
                  </div>
                </motion.div>
              )}

              {curationError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-6 rounded-3xl text-xs font-sans space-y-2 text-center ${isDarkMode ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300' : 'bg-rose-50 border border-rose-200 text-rose-800'}`}
                >
                  <p>{curationError}</p>
                  <button
                    onClick={handleCurateStory}
                    className={`px-4 py-2 border rounded-xl ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
                  >
                    Retry Connection
                  </button>
                </motion.div>
              )}

              {aiStory && !isCurating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <PoeticItinerary
                    isDarkMode={isDarkMode}
                    story={aiStory}
                    days={daysCount}
                    souls={souls}
                    destination={targetDestination}
                    onClear={() => setAiStory(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Section 6: Glassy Testimonials */}
      <section className={`py-20 md:py-24 border-t relative overflow-hidden ${isDarkMode ? 'border-white/5 bg-slate-950/20' : 'border-gray-200 bg-gray-50/40'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <span className={`font-mono text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Traveler Chapters</span>
            <h2 className={`font-serif text-3xl md:text-4xl font-extrabold italic ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Saved Millions. Gained Soul.
            </h2>
            <p className={`text-sm max-w-xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Real wanderers who rebelled against agency markups, and spent their days in natural honesty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                id={`testimonial-card-${idx}`}
                key={idx}
                className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between relative overflow-hidden space-y-6 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}
              >
                {/* Highlight direct savings rate */}
                <div className={`absolute top-0 right-0 px-3 py-1.5 font-mono text-[9px] font-semibold tracking-wider rounded-bl-2xl uppercase ${isDarkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                  Saved {t.savings}
                </div>

                <div className="space-y-4">
                  {/* Rating or decorative stars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Sparkles key={s} className={`w-3 h-3 shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    ))}
                  </div>

                  <p className={`text-xs italic leading-relaxed font-serif ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    “{t.quote}”
                  </p>
                </div>

                <div className={`flex items-center gap-3 pt-4 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-200'}`}>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400/20 to-emerald-400/20 border flex items-center justify-center font-serif font-extrabold text-sm shrink-0 uppercase ${isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-900'}`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <h5 className={`font-sans font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.name}</h5>
                    <p className={`font-mono text-[9px] tracking-wider font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Floating Fresh water drop bubble Action Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          id="whatsapp-bubble"
          href="https://wa.me/9140280943?text=Hi%20Desh!%20I%20have%20discovered%20Earth.poetry%20and%20would%20love%20to%20wander%20at%20direct%20vendor%20prices."
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-15 h-15 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-[0_4px_30px_rgba(16,185,129,0.35)] hover:scale-105 transition-all duration-300 border border-white/30"
          title="Direct message with Desh"
        >
          {/* Glowing water shine drop layers */}
          <span className="absolute inset-2 bg-gradient-to-tr from-white/30 to-transparent rounded-full filter blur-[1px]"></span>
          <MessageSquare className="w-6 h-6 z-10 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
        </a>
      </div>

      {/* Footer */}
      <footer className={`border-t py-12 relative ${isDarkMode ? 'bg-slate-950 border-white/10' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 flex items-center justify-center border border-white/20">
              <Compass className="w-3 h-3 text-white" />
            </div>
            <span className={`font-serif text-lg tracking-tight font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Earth<span className="text-emerald-500 italic">.poetry</span>
            </span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/earth_poetry_travels?igsh=MWFudGpzbjlpdHprcw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-xs font-mono tracking-wide transition-colors ${isDarkMode ? 'text-gray-300 hover:text-emerald-300' : 'text-gray-600 hover:text-emerald-600'}`}
            >
              <Instagram className="w-4 h-4" />
              @earth_poetry_travels
            </a>
          </div>

          <p className={`text-xs font-mono tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2026 Earth.poetry • CURATED BY INDEPENDENT WANDERERS • NOT FOR MIDDLEMEN
          </p>
          <p className={`text-[10px] max-w-lg mx-auto font-sans leading-relaxed ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
            All prices correspond directly to local village cooperatives, union driver charts, and regional homestay owners. 
            We settled payments straight, charging a transparent flat fee representing honest human curation.
          </p>
        </div>
      </footer>

      {/* Dynamic Comparison Guide Lead Modal */}
      <LeadModal
        isDarkMode={isDarkMode}
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        initialType="guide"
      />

      {/* Stanza AI Itinerary Planner Modal */}
      <StanzaPlannerModal
        isDarkMode={isDarkMode}
        isOpen={isStanzaModalOpen}
        onClose={() => setIsStanzaModalOpen(false)}
      />

      {/* Himalayan Trek Detail Modal */}
      <TrekDetailModal
        isDarkMode={isDarkMode}
        isOpen={isTrekModalOpen}
        onClose={() => setIsTrekModalOpen(false)}
        trek={selectedTrek}
      />

    </div>
  );
}
