import React, { useState } from "react";
import { DESTINATIONS } from "../data";
import { Sparkles, ArrowRight, TrendingDown, Landmark, CheckCircle } from "lucide-react";

interface ComparisonSliderProps {
  onSelectDestination: (key: string) => void;
  isDarkMode: boolean;
}

export default function ComparisonSlider({ onSelectDestination, isDarkMode }: ComparisonSliderProps) {
  const [selectedKey, setSelectedKey] = useState("ladakh");
  const [days, setDays] = useState(5);
  const [souls, setSouls] = useState(2);

  const dest = DESTINATIONS.find((d) => d.key === selectedKey) || DESTINATIONS[1];
  
  // Calculate relative prices and savings
  const isUSD = dest.startingPrice.includes("$");
  const currencySymbol = isUSD ? "$" : "₹";
  
  const startingRate = parseInt(dest.startingPrice.replace(/[^0-9]/g, "")) || 10000;
  const baseMarketRate = parseInt(dest.marketPrice.replace(/[^0-9]/g, "")) || 15000;

  // Compute dynamic scaling based on days and souls
  // Days scale: base days is 5.
  const daysFactor = days / 5;
  // Souls scale: co-op transport is shared, homestay increases. 
  const soulsFactor = 0.6 + souls * 0.4;

  const directVendorCost = Math.round(startingRate * daysFactor * soulsFactor);
  const curationFee = isUSD ? 30 : 2500;
  const earthPoetryTotal = directVendorCost + curationFee;
  
  // Market rates have 38% middleman margin
  const marketTotal = Math.round(baseMarketRate * daysFactor * soulsFactor * 1.05);
  const savings = marketTotal - earthPoetryTotal;

  return (
    <div className={`glass-panel rounded-3xl p-6 md:p-8 max-w-4xl mx-auto border transition-all duration-300 relative overflow-hidden ${isDarkMode ? 'border-white/20' : 'border-gray-200'}`}>
      {/* Glossy Aurora background glow inside card */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <span className={`font-mono text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-sky-300' : 'text-sky-700'}`}>
            The Live Transparency Engine
          </span>
        </div>

        <h3 className={`font-serif text-2xl md:text-3xl mb-2 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Witness the Poetry of Pricing
        </h3>
        <p className={`text-sm mb-8 font-sans ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Select a destination, adjust your trail parameters, and see precisely where your money travels.
        </p>

        {/* Destination Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DESTINATIONS.map((d) => (
            <button
              id={`tab-selection-${d.key}`}
              key={d.key}
              onClick={() => setSelectedKey(d.key)}
              className={`px-4 py-2 rounded-full font-sans text-xs font-semibold tracking-wide transition-all border ${
                selectedKey === d.key
                  ? (isDarkMode ? "bg-gradient-to-r from-emerald-500/20 to-sky-500/20 text-white border-emerald-400/50 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.25)]" : "bg-gradient-to-r from-emerald-100 to-sky-100 text-gray-900 border-emerald-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.25)]")
                  : (isDarkMode ? "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white" : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:text-gray-900")
              }`}
            >
              {d.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Sliders Area */}
          <div className="space-y-6">
            {/* Days Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`text-xs font-semibold font-sans tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Days on the Road
                </label>
                <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md ${isDarkMode ? 'text-emerald-300 bg-emerald-500/10' : 'text-emerald-800 bg-emerald-100'}`}>
                  {days} Days
                </span>
              </div>
              <input
                id="days-slider"
                type="range"
                min="3"
                max="14"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none ${isDarkMode ? 'bg-white/10 accent-emerald-400' : 'bg-gray-200 accent-emerald-500'}`}
              />
              <div className={`flex justify-between text-[10px] font-mono mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <span>3 Days</span>
                <span>14 Days</span>
              </div>
            </div>

            {/* Passengers Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className={`text-xs font-semibold font-sans tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Souls Traveling
                </label>
                <span className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md ${isDarkMode ? 'text-sky-300 bg-sky-500/10' : 'text-sky-800 bg-sky-100'}`}>
                  {souls} {souls === 1 ? "Soul" : "Souls"}
                </span>
              </div>
              <input
                id="souls-slider"
                type="range"
                min="1"
                max="10"
                value={souls}
                onChange={(e) => setSouls(Number(e.target.value))}
                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none ${isDarkMode ? 'bg-white/10 accent-sky-400' : 'bg-gray-200 accent-sky-500'}`}
              />
              <div className={`flex justify-between text-[10px] font-mono mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <span>1 Traveler</span>
                <span>10 Travelers</span>
              </div>
            </div>

            {/* Pricing Caveat */}
            <div className={`rounded-2xl p-4 border text-xs font-sans leading-relaxed flex gap-3 ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
              <Landmark className={`w-5 h-5 shrink-0 mt-0.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <div>
                <p className={`font-bold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Local Union Drivers & Village Cooperatives</p>
                Our prices correspond directly to co-op union fees hand-settled upon arrival. No middlemen are taking cuts from drivers, horsemen, or hosts.
              </div>
            </div>
          </div>

          {/* Cost Comparison Visualizer Card */}
          <div className={`glass-panel-heavy rounded-2xl border p-6 flex flex-col justify-between h-full relative overflow-hidden ${isDarkMode ? 'border-white/30' : 'border-gray-200'}`}>
            <div className={`absolute top-0 right-0 p-3 font-mono text-[9px] font-bold tracking-wider uppercase rounded-bl-2xl ${isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
              0% MARKUP
            </div>

            {/* Standard Markup Price */}
            <div className="mb-6 opacity-60 hover:opacity-100 transition-opacity">
              <div className={`flex items-center gap-1.5 text-xs font-medium font-sans mb-1 ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>
                <span>Standard Booking Agency Rate</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-mono font-bold line-through ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                  {currencySymbol}{marketTotal.toLocaleString()}
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>incl. ~35% hidden markup</span>
              </div>
            </div>

            {/* Earth Poetry Transparent cost breakdown */}
            <div className={`rounded-xl p-4 border mb-6 space-y-2 text-xs ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`flex justify-between ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>Direct Local Stays & Transports</span>
                <span className={`font-mono font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{currencySymbol}{directVendorCost.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                <span>Transparent Curation Fee</span>
                <span className="font-mono font-semibold">+{currencySymbol}{curationFee}</span>
              </div>
              <div className={`h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
              <div className={`flex justify-between items-baseline pt-1`}>
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Earth.poetry Direct Rate</span>
                <span className={`font-mono text-xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  {currencySymbol}{earthPoetryTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Savings highlight widget */}
            <div className={`mb-6 flex items-center justify-between rounded-xl p-3 border ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="flex items-center gap-2">
                <TrendingDown className={`w-4 h-4 animate-bounce ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>Wanderer Honest Savings</span>
              </div>
              <span className={`font-mono font-bold text-sm ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                Saved {currencySymbol}{savings.toLocaleString()}
              </span>
            </div>

            {/* Call to action */}
            <button
              id={`curate-comparison-cta-${dest.key}`}
              onClick={() => onSelectDestination(dest.key)}
              className="w-full py-3 rounded-xl font-sans text-xs font-bold text-center gloss-btn flex items-center justify-center gap-2 text-white"
            >
              Explore and Lock Direct Price
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
