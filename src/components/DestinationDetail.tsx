import React from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  MapPin, 
  Utensils, 
  Compass, 
  Heart, 
  MessageSquare, 
  Mail, 
  Phone, 
  Sparkles, 
  TrendingDown,
  Waves
} from "lucide-react";
import { Destination } from "../types";

interface DestinationDetailProps {
  destination: Destination;
  onBack: () => void;
  onSelectAndCurate: (destName: string, destVibe: string) => void;
  isDarkMode: boolean;
}

export default function DestinationDetail({
  destination,
  onBack,
  onSelectAndCurate,
  isDarkMode
}: DestinationDetailProps) {
  
  // Format WhatsApp Link
  const waLink = `https://wa.me/9140280943?text=${encodeURIComponent(
    `Hi Desh! I just read your beautiful direct-pricing story about ${destination.title} ("${destination.subtitle}"). I am extremely excited about the food, the treks, and the honest local prices. Let's talk about curating my path!`
  )}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen relative z-50 pb-24 overflow-x-hidden ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}
    >
      {/* Dynamic Background Blurs */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[40%] right-[10%] w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-[20%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Massive 4K Image Backdrop Block */}
      <div className={`relative h-[65vh] w-full overflow-hidden border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <img 
          src={destination.imageUrl} 
          alt={destination.title}
          className="w-full h-full object-cover scale-105 filter brightness-75 contrast-110 select-none animate-pulse-slow"
        />
        {/* Dynamic Dark Fades and Gloss Overlay */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20' : 'bg-gradient-to-t from-gray-50 via-gray-50/40 to-gray-50/20'}`}></div>
        
        {/* Top Navbar overlay inside the page */}
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border transition-all text-xs font-semibold cursor-pointer shadow-lg ${isDarkMode ? 'bg-slate-900/85 border-white/10 hover:border-emerald-400 hover:text-emerald-300' : 'bg-white/85 border-gray-300 hover:border-emerald-500 hover:text-emerald-700'}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Verse List
          </button>
          
          <span className={`font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-inner ${isDarkMode ? 'text-emerald-300 bg-emerald-500/20' : 'text-emerald-700 bg-emerald-100'}`}>
            {destination.vibe} Vibe
          </span>
        </div>

        {/* Big Title Header Block */}
        <div className="absolute bottom-10 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="space-y-1">
            <span className={`font-mono font-bold text-xs tracking-widest uppercase block ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              Curated Walkthrough by Desh (Lucknow)
            </span>
            <h1 className={`font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {destination.title}
            </h1>
            <h2 className={`font-serif text-xl sm:text-2xl italic font-semibold ${isDarkMode ? 'text-emerald-100' : 'text-emerald-800'}`}>
              "{destination.subtitle}"
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <span className={`px-3 py-1 rounded-full border text-xs font-sans flex items-center gap-1.5 font-medium ${isDarkMode ? 'bg-white/5 border-white/10 text-sky-200' : 'bg-gray-100 border-gray-300 text-sky-800'}`}>
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              {destination.excitementLabel}
            </span>
            <span className={`px-3 py-1 rounded-full border text-xs font-mono flex items-center gap-1.5 font-bold ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-emerald-100 border-emerald-200 text-emerald-800'}`}>
              Direct Price Starts from {destination.startingPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Sensory Essay & Media */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Story Teller Intro */}
            <div className={`flex items-center gap-4 border-b pb-6 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400 shadow-xl shrink-0">
                <img 
                  src="/images/desh_founder_1782051983877.jpg" 
                  alt="Desh - Founder" 
                  className="w-full h-full object-cover md:grayscale contrast-125"
                />
              </div>
              <div className="space-y-0.5">
                <h4 className={`font-serif font-extrabold italic text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Experience & Story</h4>
                <p className={`font-mono text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Written firsthand by <strong className={isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}>Desh</strong> • Adventurer from Lucknow
                </p>
              </div>
            </div>

            {/* The Essay Paragraph */}
            <div className={`space-y-6 font-serif text-lg leading-relaxed italic ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-emerald-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                {destination.experienceStory}
              </p>
            </div>

            {/* Bullet Curation Lists (Places, Food, Treks) */}
            <div className={`h-px my-8 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
            
            <div className="space-y-8">
              <h3 className={`font-serif text-2xl font-bold italic flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Compass className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                The Curation Dossier
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Places */}
                <div className={`glass-panel rounded-2xl p-5 border space-y-4 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <h5 className={`font-sans font-bold text-sm uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? 'text-sky-300' : 'text-sky-700'}`}>
                    <MapPin className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    Places to Lose Yourself
                  </h5>
                  <ul className={`space-y-2.5 text-xs font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {destination.placesToSee.map((place, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{place}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Local Food */}
                <div className={`glass-panel rounded-2xl p-5 border space-y-4 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <h5 className={`font-sans font-bold text-sm uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? 'text-sky-300' : 'text-sky-700'}`}>
                    <Utensils className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    Sensory Local Food
                  </h5>
                  <ul className={`space-y-2.5 text-xs font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {destination.foodToTry.map((food, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hikes and Treks */}
                <div className={`glass-panel rounded-2xl p-5 border space-y-4 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <h5 className={`font-sans font-bold text-sm uppercase tracking-wider flex items-center gap-1.5 ${isDarkMode ? 'text-sky-300' : 'text-sky-700'}`}>
                    <Compass className={`w-4 h-4 animate-spin ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} style={{ animationDuration: "12s" }} />
                    Trails & Hikes
                  </h5>
                  <ul className={`space-y-2.5 text-xs font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {destination.treksAndTrails.map((trek, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{trek}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

            {/* 4K Famous Pictures block */}
            <div className="space-y-4">
              <h4 className={`font-serif text-xl italic font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>4K Famous Perspectives</h4>
              <div className={`relative group overflow-hidden rounded-3xl border h-80 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <img 
                  src={destination.imageUrl} 
                  alt={`${destination.title} landscape`}
                  className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-700 select-none"
                />
                <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t p-4 text-center ${isDarkMode ? 'from-slate-950' : 'from-gray-50'}`}>
                  <p className={`font-mono text-[9px] uppercase tracking-widest ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Captured on authentic local expeditions • High contrast natural focus
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Price lock & Direct Contact Actions */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            
            {/* Curation Price card */}
            <div className={`glass-panel-heavy rounded-3xl p-6 border relative overflow-hidden space-y-6 ${isDarkMode ? 'border-white/20' : 'border-gray-200'}`}>
              <div className={`absolute top-0 right-0 p-2.5 font-mono text-[8px] font-bold tracking-widest rounded-bl-xl uppercase ${isDarkMode ? 'bg-emerald-400/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                Direct Pricing Sourced
              </div>

              <div className="space-y-1">
                <span className={`font-mono text-[9px] tracking-wider block uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cooperative Valuation</span>
                <div className="flex items-baseline justify-between">
                  <span className={`font-serif text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Starting Base:</span>
                  <span className={`font-mono text-3xl font-extrabold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{destination.startingPrice}</span>
                </div>
              </div>

              <div className={`h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>

              <div className={`space-y-2 text-xs leading-relaxed font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className={`flex justify-between items-center font-medium font-sans ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>
                  <span>Traditional Middleman Price:</span>
                  <span className="line-through">{destination.marketPrice}</span>
                </div>
                <div className={`flex justify-between items-center font-bold font-mono ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                  <span>Rebel Savings Estimate:</span>
                  <span>~35% Saved</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectAndCurate(destination.title, destination.vibe)}
                  className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider gloss-btn text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Waves className="w-4 h-4" />
                  Map Itinerary With This Path
                </button>
              </div>
            </div>

            {/* Direct contact info */}
            <div className={`glass-panel rounded-3xl p-6 border space-y-5 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <h5 className={`font-serif italic text-base font-extrabold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Heart className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                Contact Earth.poetry
              </h5>

              <div className={`space-y-3.5 text-xs font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <a 
                  href={waLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex items-center gap-3 transition-colors ${isDarkMode ? 'hover:text-emerald-300' : 'hover:text-emerald-700'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${isDarkMode ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-gray-100 border-gray-300 text-emerald-600'}`}>
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className={`text-[10px] block uppercase font-mono tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Direct WhatsApp Chat</span>
                    <span className={`font-medium font-mono ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>+91 9140280943</span>
                  </div>
                </a>

                <a 
                  href="mailto:earth.poetry.insta@gmail.com" 
                  className={`flex items-center gap-3 transition-colors ${isDarkMode ? 'hover:text-emerald-300' : 'hover:text-emerald-700'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${isDarkMode ? 'bg-white/5 border-white/10 text-sky-400' : 'bg-gray-100 border-gray-300 text-sky-600'}`}>
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className={`text-[10px] block uppercase font-mono tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Direct Mailbox</span>
                    <span className={`font-medium font-mono ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>earth.poetry.insta@gmail.com</span>
                  </div>
                </a>
              </div>

              <div className={`h-px ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`}></div>

              <div className="pt-1">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl font-sans text-xs font-bold text-center flex items-center justify-center gap-2 border transition-all ${isDarkMode ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask Desh on WhatsApp
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>

    </motion.div>
  );
}
