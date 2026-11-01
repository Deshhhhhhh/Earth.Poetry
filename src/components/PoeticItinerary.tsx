import React from "react";
import { CuratedStory } from "../types";
import { 
  Sparkles, 
  MapPin, 
  Check, 
  Briefcase, 
  MessageSquare, 
  Trash2, 
  TrendingDown, 
  Download,
  AlertCircle
} from "lucide-react";

interface PoeticItineraryProps {
  story: CuratedStory;
  days: number;
  souls: number;
  destination: string;
  onClear: () => void;
  isDarkMode: boolean;
}

export default function PoeticItinerary({
  story,
  days,
  souls,
  destination,
  onClear,
  isDarkMode,
}: PoeticItineraryProps) {
  
  // Format sharing text
  const shareText = encodeURIComponent(
    `Hi Desh! I just generated a custom "${story.title}" itinerary on Earth.poetry. ` +
    `Destination: ${destination}, Souls: ${souls}, Days: ${days}. Let's make this happen!`
  );

  return (
    <div className={`glass-panel-heavy rounded-3xl p-6 md:p-10 border backdrop-blur-3xl relative overflow-hidden transition-all duration-500 animate-float ${isDarkMode ? 'border-white/30' : 'border-gray-200'}`}>
      {/* Glossy radial blur backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Dynamic Stanza Header */}
      <div className="relative z-10 space-y-6">
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-6 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="space-y-1">
            <span className={`font-mono text-[10px] font-bold tracking-widest uppercase block ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
              Chapter Curated by Desh
            </span>
            <h3 className={`font-serif text-3xl md:text-4xl italic font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {story.title}
            </h3>
          </div>
          
          <button
            id="clear-itinerary-btn"
            onClick={onClear}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-sans transition-all ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 text-gray-400 hover:text-rose-300' : 'bg-gray-100 border-gray-300 hover:bg-rose-50 hover:border-rose-200 text-gray-600 hover:text-rose-700'}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Trail Map
          </button>
        </div>

        {/* Poetic Prologue */}
        <div className={`border-l-2 pl-5 py-2 ${isDarkMode ? 'border-emerald-400/50' : 'border-emerald-500/50'}`}>
          <p className={`font-serif italic text-base md:text-lg leading-relaxed ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            "{story.poeticOpening}"
          </p>
        </div>

        {/* Story Grid: Left Itinerary Stanzas / Right Custom Advice & Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Day cards */}
          <div className="lg:col-span-8 space-y-6">
            <h4 className={`font-sans text-xs font-bold tracking-wider uppercase mb-2 ${isDarkMode ? 'text-sky-300' : 'text-sky-600'}`}>
              The Path Flow (Experiential Journey)
            </h4>
            
            <div className={`space-y-6 relative border-l pl-6 ml-3 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              {story.itinerary.map((item, index) => (
                <div key={index} className="relative group">
                  {/* Timeline Node Glow */}
                  <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full bg-emerald-400 border-4 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(16,185,129,0.5)] ${isDarkMode ? 'border-slate-950' : 'border-gray-50'}`}></div>
                  
                  <div className="space-y-2">
                    <span className={`font-mono text-xs font-bold tracking-wider ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      Day 0{item.day} — {item.title}
                    </span>
                    <p className={`text-sm leading-relaxed font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.experience}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Direct Connection */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Founder Advice */}
            {story.founderMessage && (
              <div className={`rounded-2xl p-5 text-xs space-y-2 leading-relaxed ${isDarkMode ? 'bg-sky-500/10 border border-sky-400/20 text-sky-200' : 'bg-sky-50 border border-sky-200 text-sky-800'}`}>
                <div className={`flex items-center gap-2 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Sparkles className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span>Desh's Trail Advice:</span>
                </div>
                <p className="italic">
                  "{story.founderMessage}"
                </p>
              </div>
            )}
            </div>

            {/* Direct Contact Action */}
            <div className="pt-2">
              <a
                href={`https://wa.me/9140280943?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-sans text-xs font-bold text-center gloss-btn flex items-center justify-center gap-2 text-white shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                Claim This Custom Map via WhatsApp
            </a>
            <span className={`block text-center text-[10px] font-mono mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Desh handles chats directly. No bots. No middleman markup.
            </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
