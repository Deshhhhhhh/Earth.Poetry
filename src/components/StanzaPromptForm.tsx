import React, { useState } from 'react';
import { Sparkles, Compass, MapPin, Calendar, Users, DollarSign, ArrowRight, Zap, Coffee, Plane, Heart, RefreshCw, ShieldCheck, Lock } from 'lucide-react';
import { PromptInputParams } from '../types';
import { PRESET_PROMPTS } from '../data/stanzaSampleItineraries';

interface PromptFormProps {
  onSubmitPrompt: (params: PromptInputParams) => void;
  isLoading: boolean;
  onSelectSample: () => void;
  user: { emailOrPhone: string; name?: string } | null;
  onRequireAuth: () => void;
  isDarkMode: boolean;
}

export const StanzaPromptForm: React.FC<PromptFormProps> = ({
  onSubmitPrompt,
  isLoading,
  onSelectSample,
  user,
  onRequireAuth,
  isDarkMode,
}) => {
  const tc = (dark: string, light: string) => (isDarkMode ? dark : light);
  const [promptText, setPromptText] = useState(
    '5 days solo travel in Bali on a realistic budget. Want public buses, local homestays, self-guided walking treks, waterfall dips, street food warungs, and clear daily hotel options.'
  );
  const [durationDays, setDurationDays] = useState(5);
  const [travelerType, setTravelerType] = useState('Solo');
  const [budgetTier, setBudgetTier] = useState('Budget-Conscious');
  const [currency, setCurrency] = useState('USD');
  const [specificPlaces, setSpecificPlaces] = useState('');
  const [hotelPreferences, setHotelPreferences] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Boutique Stays',
    'Gastronomy & Wine',
    'Nature & Scenic Walks'
  ]);

  const currencyOptions = [
    { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
    { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
    { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
    { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
    { code: 'AUD', symbol: 'A$', label: 'AUD (A$) - Australian Dollar' },
    { code: 'CAD', symbol: 'C$', label: 'CAD (C$) - Canadian Dollar' },
    { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen' },
  ];

  const interestOptions = [
    'Boutique Stays',
    'Gastronomy & Wine',
    'Private Charters',
    'Nature & Scenic Walks',
    'Cultural Heritage',
    'Wellness & Spa',
    'Scuba & Watersports',
    'Hidden Gems'
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    if (!user) {
      onRequireAuth();
      return;
    }

    onSubmitPrompt({
      destinationPrompt: promptText,
      durationDays,
      travelerType,
      budgetTier,
      currency,
      interests: selectedInterests,
      specificPlaces,
      hotelPreferences,
    });
  };

  const handleApplyPreset = (preset: typeof PRESET_PROMPTS[0]) => {
    setPromptText(preset.promptText);
    setDurationDays(preset.durationDays);
    setTravelerType(preset.travelerType);
    setBudgetTier(preset.budgetTier);
  };

  return (
    <div className={`w-full ${tc('text-white', 'text-slate-900')}`}>
      
      {/* Earth Poetry Hero Banner matching the user's front page screenshot */}
      <div className={`relative min-h-[480px] ${tc('bg-[#08121e]', 'bg-gradient-to-b from-[#f8fafc] to-[#eef2f7]')} flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden border-b ${tc('border-[#132235]', 'border-slate-200')}`}>
        
        {/* Background Dark Mountain Overlay */}
        <div className={`absolute inset-0 z-0 ${tc('opacity-30', 'opacity-20')} pointer-events-none`}>
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
            alt="Earth Poetry Mountains"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover ${tc('filter contrast-125 brightness-50', 'filter contrast-110 brightness-90')}`}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          
          {/* Badge from Screenshot */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${tc('bg-[#132235]/80', 'bg-white/70')} border border-[#20d09b]/40 text-[#20d09b] text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md`}>
            <span>≈ DIRECT VENDOR PRICING • 0% CORPORATE MARKUPS</span>
          </div>

          {/* Headline Quote from Screenshot */}
          <h1 className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight ${tc('text-white', 'text-slate-900')} tracking-tight`}>
            “The Earth is <span className="italic font-normal text-[#20d09b]">Poetry</span>. <br className="hidden sm:inline" />
            Why should reading it cost a fortune?”
          </h1>

          {/* Subtitle from Screenshot */}
          <p className={`text-sm sm:text-base ${tc('text-[#94a3b8]', 'text-slate-500')} max-w-2xl mx-auto leading-relaxed font-light`}>
            No middleman margins. No hidden agency cuts. Pay exactly what the local drivers, homestays, and co-ops charge. It’s not just a vacation—it is an act of wandering honesty.
          </p>

          {/* AI Planner Unique Name Badge */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-[#20d09b]/10 border border-[#20d09b]/30 text-[#20d09b] text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Stanza AI - Ethical Itinerary Curator (100% Free Access)
            </span>
          </div>

        </div>
      </div>

      {/* Main Workspace Workspace Form Container */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20 pb-16">
        <div className={`${tc('bg-[#0b1726]', 'bg-white')} border ${tc('border-[#1a2d42]', 'border-slate-200')} rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8`}>
          
          {/* Section Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${tc('border-[#1a2d42]', 'border-slate-200')} pb-4`}>
            <div>
              <h2 className={`font-serif text-2xl font-bold ${tc('text-white', 'text-slate-900')} flex items-center gap-2`}>
                <Compass className="w-6 h-6 text-[#20d09b]" />
                Stanza AI Itinerary Engine
              </h2>
              <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                Describe your dream journey. Our AI curates detailed day-by-day plans, boutique stays, local drivers & Google booking links.
              </p>
            </div>

            {user ? (
              <span className="text-xs text-[#20d09b] font-semibold flex items-center gap-1 bg-[#20d09b]/10 px-3 py-1 rounded-full border border-[#20d09b]/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Logged in as {user.name || user.emailOrPhone}
              </span>
            ) : (
              <button
                type="button"
                onClick={onRequireAuth}
                className="text-xs text-[#20d09b] font-bold hover:underline flex items-center gap-1 bg-[#20d09b]/10 px-3 py-1 rounded-full border border-[#20d09b]/30 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" /> Sign in with Mail/Phone to Generate
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Main Freeform Travel Prompt */}
            <div className="space-y-2">
              <label className={`flex items-center justify-between text-xs font-bold ${tc('text-[#e2e8f0]', 'text-slate-800')} uppercase tracking-wider`}>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#20d09b]" /> What is your dream destination & experience?
                </span>
                <span className="text-xs font-normal text-[#20d09b]">Prompt-driven Engine</span>
              </label>
              <textarea
                id="prompt-input-textarea"
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g. 7 days in Amalfi Coast for a couple, eco-luxury budget around $4000. Cliffside boutique hotels, private sunset boat charter to Capri, lemons & pasta making class, secret beach coves..."
                className={`w-full p-4 rounded-2xl border ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('text-white', 'text-slate-900')} ${tc('placeholder-[#64748b]', 'placeholder-slate-400')} focus:outline-none focus:ring-2 focus:ring-[#20d09b] text-sm leading-relaxed font-normal shadow-inner transition-all`}
                required
              />
            </div>

            {/* Quick Specifications Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl ${tc('bg-[#132235]', 'bg-slate-50')} border ${tc('border-[#1a2d42]', 'border-slate-200')}`}>
              
              {/* Duration Days */}
              <div className="space-y-2">
                <label className={`text-xs font-bold ${tc('text-[#94a3b8]', 'text-slate-500')} flex items-center gap-1.5 uppercase tracking-wider`}>
                  <Calendar className="w-3.5 h-3.5 text-[#20d09b]" /> Duration
                </label>
                <div className={`flex items-center gap-3 ${tc('bg-[#0b1726]', 'bg-white')} p-2.5 rounded-xl border ${tc('border-[#1a2d42]', 'border-slate-200')}`}>
                  <input
                    id="duration-days-input"
                    type="range"
                    min={2}
                    max={14}
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                    className="w-full accent-[#20d09b] cursor-pointer"
                  />
                  <span className={`text-xs font-bold text-[#20d09b] w-14 text-center ${tc('bg-[#132235]', 'bg-slate-50')} px-2 py-1 rounded-lg border border-[#20d09b]/30`}>
                    {durationDays} Days
                  </span>
                </div>
              </div>

              {/* Traveler Group */}
              <div className="space-y-2">
                <label className={`text-xs font-bold ${tc('text-[#94a3b8]', 'text-slate-500')} flex items-center gap-1.5 uppercase tracking-wider`}>
                  <Users className="w-3.5 h-3.5 text-[#20d09b]" /> Traveler Type
                </label>
                <select
                  id="traveler-type-select"
                  value={travelerType}
                  onChange={(e) => setTravelerType(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('bg-[#0b1726]', 'bg-white')} text-xs font-semibold ${tc('text-white', 'text-slate-900')} focus:outline-none focus:ring-1 focus:ring-[#20d09b]`}
                >
                  <option value="Solo">Solo Traveler</option>
                  <option value="Couple">Couple / Romantic</option>
                  <option value="Family with Kids">Family with Kids</option>
                  <option value="Group of Friends">Group of Friends</option>
                  <option value="Luxury Honeymooners">Luxury Honeymooners</option>
                </select>
              </div>

              {/* Currency Selection */}
              <div className="space-y-2">
                <label className={`text-xs font-bold ${tc('text-[#94a3b8]', 'text-slate-500')} flex items-center gap-1.5 uppercase tracking-wider`}>
                  <DollarSign className="w-3.5 h-3.5 text-[#20d09b]" /> Currency
                </label>
                <select
                  id="currency-type-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('bg-[#0b1726]', 'bg-white')} text-xs font-semibold text-[#20d09b] focus:outline-none focus:ring-1 focus:ring-[#20d09b]`}
                >
                  {currencyOptions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Tier */}
              <div className="space-y-2">
                <label className={`text-xs font-bold ${tc('text-[#94a3b8]', 'text-slate-500')} flex items-center gap-1.5 uppercase tracking-wider`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#20d09b]" /> Budget Style
                </label>
                <select
                  id="budget-tier-select"
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('bg-[#0b1726]', 'bg-white')} text-xs font-semibold ${tc('text-white', 'text-slate-900')} focus:outline-none focus:ring-1 focus:ring-[#20d09b]`}
                >
                  <option value="Budget-Conscious">Budget / Solo Ground Saver ($)</option>
                  <option value="Balanced Luxury">Authentic Mid-Range ($$)</option>
                  <option value="Eco-Luxury">Direct Eco-Resorts ($$$)</option>
                  <option value="Ultra-VIP">Private Estate & Yacht ($$$$)</option>
                </select>
              </div>

            </div>

            {/* Direct Cost Reduction Info Callout */}
            <div className="p-3.5 rounded-xl bg-[#20d09b]/10 border border-[#20d09b]/30 text-xs text-[#20d09b] flex items-center gap-2">
              <Zap className="w-4 h-4 shrink-0 text-[#20d09b]" />
              <span>
                <strong>Cost Reduction Guarantee:</strong> Every itinerary automatically details public vs private transfers, ground-buying tips (local markets, warungs), self-guided walking/trekking routes, and 3 hotel options according to budget.
              </span>
            </div>

            {/* Specific Places / Hotels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`text-xs font-semibold ${tc('text-[#94a3b8]', 'text-slate-500')} block mb-1`}>
                  Must-Visit Places or Restaurants (Optional)
                </label>
                <input
                  id="specific-places-input"
                  type="text"
                  value={specificPlaces}
                  onChange={(e) => setSpecificPlaces(e.target.value)}
                  placeholder="e.g. Positano Beach, Da Paolino Lemon Trees, Blue Grotto"
                  className={`w-full p-3 rounded-xl border ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('bg-[#132235]', 'bg-slate-50')} text-xs ${tc('text-white', 'text-slate-900')} ${tc('placeholder-[#64748b]', 'placeholder-slate-400')} focus:outline-none focus:ring-1 focus:ring-[#20d09b]`}
                />
              </div>

              <div>
                <label className={`text-xs font-semibold ${tc('text-[#94a3b8]', 'text-slate-500')} block mb-1`}>
                  Stay & Eco-Resort Preferences (Optional)
                </label>
                <input
                  id="hotel-preferences-input"
                  type="text"
                  value={hotelPreferences}
                  onChange={(e) => setHotelPreferences(e.target.value)}
                  placeholder="e.g. Cliffside boutique resort with organic breakfast"
                  className={`w-full p-3 rounded-xl border ${tc('border-[#1a2d42]', 'border-slate-200')} ${tc('bg-[#132235]', 'bg-slate-50')} text-xs ${tc('text-white', 'text-slate-900')} ${tc('placeholder-[#64748b]', 'placeholder-slate-400')} focus:outline-none focus:ring-1 focus:ring-[#20d09b]`}
                />
              </div>
            </div>

            {/* Special Interests Chips */}
            <div className="space-y-2">
              <span className={`text-xs font-bold ${tc('text-[#94a3b8]', 'text-slate-500')} uppercase tracking-wider block`}>
                Curated Experience Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#20d09b] text-[#08121e] border-[#20d09b] font-bold shadow-md shadow-[#20d09b]/20'
                          : `${tc('bg-[#132235]', 'bg-slate-50')} ${tc('text-[#94a3b8]', 'text-slate-500')} ${tc('border-[#1a2d42]', 'border-slate-200')} hover:border-[#20d09b] ${tc('hover:text-white', 'hover:text-slate-900')}`
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className={`pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t ${tc('border-[#1a2d42]', 'border-slate-200')}`}>
              
              <button
                id="instant-sample-btn"
                type="button"
                onClick={user ? onSelectSample : onRequireAuth}
                className="text-xs font-bold text-[#20d09b] hover:text-[#2de3aa] flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#20d09b]" /> Preview Sample Stanza (Bali 7-Day)
              </button>

              <button
                id="generate-itinerary-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#20d09b] to-[#10b981] hover:brightness-110 text-[#08121e] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#20d09b]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#08121e]" />
                    <span>Curating Your Stanza AI Itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#08121e]" />
                    <span>{user ? 'Curate Stanza AI Itinerary (Free)' : 'Sign In Mail/Phone to Curate'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>

          </form>
        </div>

        {/* Preset Inspiration Prompts */}
        <div className="mt-12 space-y-4">
          <h3 className={`text-xs font-bold uppercase tracking-widest ${tc('text-[#64748b]', 'text-slate-400')} text-center`}>
            Or Choose A Featured Earth Poetry Stanza Inspiration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_PROMPTS.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className={`p-5 rounded-2xl ${tc('bg-[#0b1726]', 'bg-white')} border ${tc('border-[#1a2d42]', 'border-slate-200')} hover:border-[#20d09b] hover:shadow-xl cursor-pointer transition-all space-y-2 group`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#20d09b] bg-[#20d09b]/10 px-2.5 py-0.5 rounded-full border border-[#20d09b]/20">
                    {preset.durationDays} Days
                  </span>
                  <span className={`text-[11px] ${tc('text-[#64748b]', 'text-slate-400')}`}>{preset.budgetTier}</span>
                </div>
                <h4 className={`font-serif text-base font-bold ${tc('text-white', 'text-slate-900')} group-hover:text-[#20d09b] transition-colors`}>
                  {preset.title}
                </h4>
                <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')} line-clamp-2 leading-relaxed`}>
                  {preset.promptText}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
