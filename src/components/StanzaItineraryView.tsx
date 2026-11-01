import React, { useState } from 'react';
import { TravelItinerary, DayItinerary } from '../types';
import {
  Compass, MapPin, Calendar, Users, DollarSign, Download, Share2,
  ExternalLink, Sparkles, Hotel, Utensils, Car, Sun, Moon, Sunset,
  Info, ShoppingBag, CheckCircle, ArrowLeft, RefreshCw, Layers, Map as MapIcon, ChevronDown, ChevronUp
} from 'lucide-react';
import { StanzaItineraryMap } from './StanzaItineraryMap';
import { StanzaStaysTransfersCard } from './StanzaStaysTransfersCard';
import { StanzaItineraryModifyModal } from './StanzaItineraryModifyModal';

interface ItineraryViewProps {
  itinerary: TravelItinerary;
  onBackToPrompt: () => void;
  onModifyItinerary: (prompt: string) => void;
  isModifying: boolean;
  onDownloadPdf: () => void;
  onOpenShare: () => void;
  isDarkMode?: boolean;
}

export const StanzaItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onBackToPrompt,
  onModifyItinerary,
  isModifying,
  onDownloadPdf,
  onOpenShare,
  isDarkMode = true,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'map' | 'stays' | 'tips'>('timeline');
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(0);

  const tc = (dark: string, light: string) => (isDarkMode ? dark : light);

  const toggleDayExpanded = (index: number) => {
    setExpandedDayIndex(expandedDayIndex === index ? null : index);
  };

  return (
    <div id="itinerary-pdf-content" className={`w-full max-w-6xl mx-auto px-4 py-6 space-y-8 ${tc('text-white', 'text-slate-900')}`}>
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToPrompt}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('border-[#1a2d42]', 'border-slate-200')} border text-xs font-bold ${tc('text-white', 'text-slate-900')} hover:border-[#20d09b] transition-all cursor-pointer`}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#20d09b]" />
          <span>New Stanza Prompt</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#20d09b]/10 text-[#20d09b] border border-[#20d09b]/30 text-xs font-bold hover:bg-[#20d09b]/20 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>

          <button
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#20d09b] text-[#08121e] text-xs font-extrabold hover:bg-[#2de3aa] transition-all cursor-pointer shadow-md shadow-[#20d09b]/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Cover Banner */}
      <div className={`relative rounded-3xl overflow-hidden ${tc('bg-[#0b1726]', 'bg-white')} ${tc('text-white', 'text-slate-900')} shadow-2xl ${tc('border-[#1a2d42]', 'border-slate-200')} border`}>
        <div className="absolute inset-0 z-0 opacity-50">
          <img
            src={itinerary.coverImage}
            alt={itinerary.destination}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-75 contrast-110"
          />
        </div>

        <div className={`relative z-10 p-6 sm:p-10 space-y-4 max-w-3xl ${isDarkMode ? 'bg-gradient-to-t from-[#0b1726] via-[#0b1726]/80 to-transparent' : 'bg-gradient-to-t from-white via-white/80 to-transparent'}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#20d09b] text-[#08121e] text-xs font-bold uppercase tracking-wider">
              {itinerary.destination}
            </span>
            <span className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-white/10 backdrop-blur-md text-white border border-white/20' : 'bg-slate-100 text-slate-800 border border-slate-200'} text-xs font-semibold`}>
              {itinerary.durationDays} Days • {itinerary.travelers}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#20d09b]/20 text-[#20d09b] text-xs font-semibold border border-[#20d09b]/30">
              {itinerary.budgetTier}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {itinerary.title}
          </h1>

          <p className="text-sm sm:text-base text-[#20d09b] italic font-serif leading-relaxed">
            "{itinerary.tagline}"
          </p>

          <p className={`text-xs sm:text-sm ${tc('text-[#cbd5e1]', 'text-slate-600')} leading-relaxed`}>
            {itinerary.overview}
          </p>

          {/* Quick Stats Grid */}
          <div className={`pt-4 ${tc('border-[#1a2d42]', 'border-slate-200')} border-t grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium`}>
            <div>
              <span className={`${tc('text-[#94a3b8]', 'text-slate-500')} block text-[10px] uppercase`}>Estimated Budget</span>
              <span className="text-sm font-bold text-[#20d09b]">{itinerary.totalEstimatedCost}</span>
            </div>
            <div>
              <span className={`${tc('text-[#94a3b8]', 'text-slate-500')} block text-[10px] uppercase`}>Curated Days</span>
              <span className={`text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>{itinerary.durationDays} Detailed Days</span>
            </div>
            <div>
              <span className={`${tc('text-[#94a3b8]', 'text-slate-500')} block text-[10px] uppercase`}>Key Stays</span>
              <span className={`text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>{itinerary.recommendedStays?.length || 3} Resorts</span>
            </div>
            <div>
              <span className={`${tc('text-[#94a3b8]', 'text-slate-500')} block text-[10px] uppercase`}>Booking Redirects</span>
              <span className={`text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>Google Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Refinement Prompt Bar */}
      <StanzaItineraryModifyModal
        onModify={onModifyItinerary}
        isModifying={isModifying}
        modificationsCount={itinerary.modificationsCount || 0}
        isDarkMode={isDarkMode}
      />

      {/* Navigation Tabs */}
      <div className={`flex ${tc('border-[#1a2d42]', 'border-slate-200')} border-b gap-2 overflow-x-auto pb-1`}>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'timeline'
              ? `${tc('bg-[#132235]', 'bg-slate-50')} text-[#20d09b] border-t-2 border-[#20d09b]`
              : `${tc('bg-[#0b1726]', 'bg-transparent')} ${tc('text-[#94a3b8]', 'text-slate-500')} ${tc('hover:bg-[#132235]', 'hover:bg-slate-50')}`
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#20d09b]" />
          <span>Day-by-Day Detailed Plan ({itinerary.days.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'map'
              ? `${tc('bg-[#132235]', 'bg-slate-50')} text-[#20d09b] border-t-2 border-[#20d09b]`
              : `${tc('bg-[#0b1726]', 'bg-transparent')} ${tc('text-[#94a3b8]', 'text-slate-500')} ${tc('hover:bg-[#132235]', 'hover:bg-slate-50')}`
          }`}
        >
          <MapIcon className="w-3.5 h-3.5 text-[#20d09b]" />
          <span>Interactive Map & Places</span>
        </button>

        <button
          onClick={() => setActiveTab('stays')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'stays'
              ? `${tc('bg-[#132235]', 'bg-slate-50')} text-[#20d09b] border-t-2 border-[#20d09b]`
              : `${tc('bg-[#0b1726]', 'bg-transparent')} ${tc('text-[#94a3b8]', 'text-slate-500')} ${tc('hover:bg-[#132235]', 'hover:bg-slate-50')}`
          }`}
        >
          <Hotel className="w-3.5 h-3.5 text-[#20d09b]" />
          <span>Stays & Transfers Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tips'
              ? `${tc('bg-[#132235]', 'bg-slate-50')} text-[#20d09b] border-t-2 border-[#20d09b]`
              : `${tc('bg-[#0b1726]', 'bg-transparent')} ${tc('text-[#94a3b8]', 'text-slate-500')} ${tc('hover:bg-[#132235]', 'hover:bg-slate-50')}`
          }`}
        >
          <Info className="w-3.5 h-3.5 text-[#20d09b]" />
          <span>Insider Secrets & Packing</span>
        </button>
      </div>

      {/* TAB 1: TIMELINE DAY BY DAY */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          
          <StanzaItineraryMap itinerary={itinerary} isDarkMode={isDarkMode} />

          <div className="space-y-4">
            {itinerary.days.map((day: DayItinerary, idx: number) => {
              const isExpanded = expandedDayIndex === idx || expandedDayIndex === null;

              return (
                <div
                  key={day.dayNumber || idx}
                  className={`${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} border rounded-2xl overflow-hidden shadow-lg transition-all hover:border-[#20d09b]`}
                >
                  {/* Day Header Accordion Toggle */}
                  <div
                    onClick={() => toggleDayExpanded(idx)}
                    className={`p-4 sm:p-5 ${tc('bg-[#132235]', 'bg-slate-50')} flex items-center justify-between cursor-pointer ${tc('hover:bg-[#182a40]', 'hover:bg-slate-100')} transition-colors ${tc('border-[#1a2d42]', 'border-slate-200')} border-b`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-[#20d09b] text-[#08121e] flex items-center justify-center font-bold text-sm shrink-0">
                        {day.dayNumber}
                      </span>
                      <div>
                        <h3 className={`font-serif text-base sm:text-lg font-bold ${tc('text-white', 'text-slate-900')}`}>
                          {day.dateOrTitle}
                        </h3>
                        <p className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')} line-clamp-1`}>
                          {day.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block text-xs font-bold text-[#20d09b] bg-[#20d09b]/10 px-2.5 py-1 rounded-full border border-[#20d09b]/20">
                        Est: {day.dayTotalEstimatedCost}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#20d09b]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#20d09b]" />
                      )}
                    </div>
                  </div>

                  {/* Day Body Content */}
                  {isExpanded && (
                    <div className={`p-4 sm:p-6 space-y-6 ${tc('bg-[#0b1726]', 'bg-white')}`}>
                      
                      {/* Day Routing & Transfers Breakdown */}
                      <div className={`p-4 rounded-xl ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('border-[#1a2d42]', 'border-slate-200')} border space-y-3`}>
                        <div className={`flex flex-wrap items-center justify-between gap-2 ${tc('border-[#1a2d42]', 'border-slate-200')} border-b pb-2`}>
                          <span className="text-xs font-bold text-[#20d09b] flex items-center gap-1.5 uppercase tracking-wider">
                            <Compass className="w-4 h-4 text-[#20d09b]" /> Route: {day.route || day.summary}
                          </span>
                          <span className={`text-[11px] ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                            Transfers Breakdown
                          </span>
                        </div>

                        {day.transfers && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {/* Public Transport */}
                            <div className={`p-3 rounded-lg ${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} border space-y-1`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                                  <Car className="w-3.5 h-3.5" /> Public / Bus / Train / Ferry
                                </span>
                              </div>
                              <p className={`text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')}`}>
                                {typeof day.transfers.publicTransport === 'string'
                                  ? day.transfers.publicTransport
                                  : 'Public transit available'}
                              </p>
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(
                                  (day.route || day.summary) + ' public transit bus ferry'
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-[#20d09b] hover:underline inline-flex items-center gap-1 pt-1"
                              >
                                <span>Search Public Route on Google</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>

                            {/* Private Transport */}
                            <div className={`p-3 rounded-lg ${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} border space-y-1`}>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                                  <Car className="w-3.5 h-3.5" /> Private Taxi / Driver
                                </span>
                              </div>
                              <p className={`text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')}`}>
                                {typeof day.transfers.privateTransport === 'string'
                                  ? day.transfers.privateTransport
                                  : 'Private driver available'}
                              </p>
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(
                                  (day.route || day.summary) + ' private driver transfer'
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold text-[#20d09b] hover:underline inline-flex items-center gap-1 pt-1"
                              >
                                <span>Book Driver on Google</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Ground & Walking Money Savers */}
                        {day.groundAndWalkingTips && (
                          <div className={`p-3 rounded-lg bg-[#20d09b]/10 border border-[#20d09b]/20 text-xs text-[#20d09b] flex items-start gap-2 mt-2`}>
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">Ground & Walking Cost Saver: </strong>
                              <span className={tc('text-white/90', 'text-slate-800')}>{day.groundAndWalkingTips}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3 Hotel Options According to Budget */}
                      <div className="space-y-3">
                        <div className={`flex items-center justify-between ${tc('border-[#1a2d42]', 'border-slate-200')} border-b pb-1.5`}>
                          <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')} flex items-center gap-2`}>
                            <Hotel className="w-4 h-4 text-[#20d09b]" />
                            3 Hotel Options for Day {day.dayNumber} (Matching Budget)
                          </h4>
                          <span className={`text-[11px] ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                            Direct Booking Links
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {(day.hotelOptions && day.hotelOptions.length > 0
                            ? day.hotelOptions
                            : day.stayForNight
                            ? [
                                {
                                  tier: 'Budget Friendly',
                                  name: day.stayForNight.name,
                                  type: day.stayForNight.type,
                                  pricePerNight: '$30 - $60 / night',
                                  description: day.stayForNight.description,
                                  bookingUrl: day.stayForNight.bookingUrl,
                                },
                                {
                                  tier: 'Mid-Range Heritage',
                                  name: `${day.stayForNight.name} Villa`,
                                  type: 'Boutique Homestay',
                                  pricePerNight: '$65 - $110 / night',
                                  description: 'Comfortable stay with garden views and organic breakfast included.',
                                  bookingUrl: day.stayForNight.bookingUrl,
                                },
                                {
                                  tier: 'Eco-Luxury Resort',
                                  name: `${day.stayForNight.name} Sanctuary`,
                                  type: 'Luxury Eco-Lodge',
                                  pricePerNight: '$120 - $220 / night',
                                  description: 'Prime location with infinity pool and private transfers.',
                                  bookingUrl: day.stayForNight.bookingUrl,
                                }
                              ]
                            : []
                          ).map((hotel, hIdx) => {
                            const googleUrl = hotel.bookingUrl || `https://www.google.com/search?q=${encodeURIComponent(hotel.name + ' hotel booking')}`;

                            return (
                              <div
                                key={hIdx}
                                className={`p-3.5 rounded-xl ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('border-[#1a2d42]', 'border-slate-200')} border flex flex-col justify-between space-y-2 hover:border-[#20d09b] transition-all`}
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-[#08121e] bg-[#20d09b] px-2 py-0.5 rounded-md uppercase tracking-wider">
                                      {hotel.tier || 'Option ' + (hIdx + 1)}
                                    </span>
                                    <span className="text-[11px] font-bold text-[#20d09b]">
                                      {hotel.pricePerNight}
                                    </span>
                                  </div>
                                  <h5 className={`font-serif text-xs font-bold ${tc('text-white', 'text-slate-900')} pt-1`}>
                                    {hotel.name}
                                  </h5>
                                  <p className={`text-[11px] ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                                    {hotel.type}
                                  </p>
                                  <p className={`text-[11px] ${tc('text-[#cbd5e1]', 'text-slate-600')} line-clamp-2 leading-relaxed`}>
                                    {hotel.description}
                                  </p>
                                </div>

                                <a
                                  href={googleUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`w-full py-1.5 rounded-lg ${tc('bg-[#0b1726]', 'bg-white')} ${tc('hover:bg-[#182a40]', 'hover:bg-slate-100')} text-[#20d09b] text-[11px] font-bold ${tc('border-[#1a2d42]', 'border-slate-200')} border inline-flex items-center justify-center gap-1 transition-colors`}
                                >
                                  <span>View on Google</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3 Activity Time Slots: Morning, Afternoon, Evening */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Morning Slot */}
                        <div className={`p-4 rounded-xl ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('border-[#1a2d42]', 'border-slate-200')} border flex flex-col justify-between space-y-3`}>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-amber-400 flex items-center gap-1">
                                <Sun className="w-3.5 h-3.5" /> Morning
                              </span>
                              <span className={`text-[11px] ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                                {day.morning.time}
                              </span>
                            </div>

                            <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>
                              {day.morning.title}
                            </h4>

                            <p className={`text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')} leading-relaxed`}>
                              {day.morning.description}
                            </p>

                            {day.morning.locationName && (
                              <p className="text-[11px] text-[#20d09b] font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#20d09b]" /> {day.morning.locationName}
                              </p>
                            )}
                          </div>

                          <div className={`pt-2 ${tc('border-[#1a2d42]', 'border-slate-200')} border-t flex items-center justify-between`}>
                            <span className="text-[11px] font-bold text-[#20d09b]">
                              {day.morning.estimatedCost || 'Direct Pricing'}
                            </span>
                            <a
                              href={day.morning.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-[#20d09b] hover:underline inline-flex items-center gap-1"
                            >
                              <span>Book on Google</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Afternoon Slot */}
                        <div className={`p-4 rounded-xl ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('border-[#1a2d42]', 'border-slate-200')} border flex flex-col justify-between space-y-3`}>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-sky-400 flex items-center gap-1">
                                <Compass className="w-3.5 h-3.5" /> Afternoon
                              </span>
                              <span className={`text-[11px] ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                                {day.afternoon.time}
                              </span>
                            </div>

                            <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>
                              {day.afternoon.title}
                            </h4>

                            <p className={`text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')} leading-relaxed`}>
                              {day.afternoon.description}
                            </p>

                            {day.afternoon.locationName && (
                              <p className="text-[11px] text-[#20d09b] font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#20d09b]" /> {day.afternoon.locationName}
                              </p>
                            )}
                          </div>

                          <div className={`pt-2 ${tc('border-[#1a2d42]', 'border-slate-200')} border-t flex items-center justify-between`}>
                            <span className="text-[11px] font-bold text-[#20d09b]">
                              {day.afternoon.estimatedCost || 'Direct Pricing'}
                            </span>
                            <a
                              href={day.afternoon.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-[#20d09b] hover:underline inline-flex items-center gap-1"
                            >
                              <span>Book on Google</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                        {/* Evening Slot */}
                        <div className={`p-4 rounded-xl ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('border-[#1a2d42]', 'border-slate-200')} border flex flex-col justify-between space-y-3`}>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-purple-400 flex items-center gap-1">
                                <Sunset className="w-3.5 h-3.5" /> Evening
                              </span>
                              <span className={`text-[11px] ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                                {day.evening.time}
                              </span>
                            </div>

                            <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>
                              {day.evening.title}
                            </h4>

                            <p className={`text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')} leading-relaxed`}>
                              {day.evening.description}
                            </p>

                            {day.evening.locationName && (
                              <p className="text-[11px] text-[#20d09b] font-medium flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#20d09b]" /> {day.evening.locationName}
                              </p>
                            )}
                          </div>

                          <div className={`pt-2 ${tc('border-[#1a2d42]', 'border-slate-200')} border-t flex items-center justify-between`}>
                            <span className="text-[11px] font-bold text-[#20d09b]">
                              {day.evening.estimatedCost || 'Direct Pricing'}
                            </span>
                            <a
                              href={day.evening.bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-[#20d09b] hover:underline inline-flex items-center gap-1"
                            >
                              <span>Book on Google</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>

                      </div>

                      {/* Dining Card */}
                      {day.diningRecommendation && (
                        <div className={`p-4 rounded-xl ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('border-[#1a2d42]', 'border-slate-200')} border flex items-start justify-between gap-3`}>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#20d09b]">
                              <Utensils className="w-3.5 h-3.5" />
                              <span>Curated Dining: {day.diningRecommendation.name}</span>
                              <span className={`text-[10px] ${tc('bg-[#0b1726]', 'bg-white')} px-1.5 py-0.2 rounded ${tc('border-[#1a2d42]', 'border-slate-200')} border`}>
                                {day.diningRecommendation.priceRange}
                              </span>
                            </div>
                            <p className={`text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')}`}>
                              {day.diningRecommendation.cuisine} • {day.diningRecommendation.description}
                            </p>
                          </div>

                          <a
                            href={day.diningRecommendation.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#20d09b] text-[#08121e] text-[11px] font-extrabold shrink-0 hover:bg-[#2de3aa] transition-colors inline-flex items-center gap-1"
                          >
                            <span>Reserve</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE MAP */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <StanzaItineraryMap itinerary={itinerary} isDarkMode={isDarkMode} />
        </div>
      )}

      {/* TAB 3: STAYS & TRANSFERS HUB */}
      {activeTab === 'stays' && (
        <StanzaStaysTransfersCard
          stays={itinerary.recommendedStays || []}
          transfers={itinerary.transfersAndLogistics || []}
          destination={itinerary.destination}
          isDarkMode={isDarkMode}
        />
      )}

      {/* TAB 4: INSIDER TIPS & PACKING */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Insider Secrets */}
          <div className={`${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} border rounded-2xl p-6 space-y-4 shadow-lg`}>
            <div className={`flex items-center gap-2 ${tc('border-[#1a2d42]', 'border-slate-200')} border-b pb-3`}>
              <Sparkles className="w-5 h-5 text-[#20d09b]" />
              <h3 className={`font-serif text-lg font-bold ${tc('text-white', 'text-slate-900')}`}>
                Earth Poetry Local Insider Secrets
              </h3>
            </div>

            <ul className="space-y-3">
              {(itinerary.insiderTips || []).map((tip, idx) => (
                <li key={idx} className={`flex items-start gap-2.5 text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20d09b] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Packing Essentials */}
          <div className={`${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} border rounded-2xl p-6 space-y-4 shadow-lg`}>
            <div className={`flex items-center gap-2 ${tc('border-[#1a2d42]', 'border-slate-200')} border-b pb-3`}>
              <ShoppingBag className="w-5 h-5 text-[#20d09b]" />
              <h3 className={`font-serif text-lg font-bold ${tc('text-white', 'text-slate-900')}`}>
                Packing & Seasonal Essentials
              </h3>
            </div>

            <ul className="space-y-3">
              {(itinerary.packingEssentials || []).map((item, idx) => (
                <li key={idx} className={`flex items-start gap-2.5 text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')}`}>
                  <CheckCircle className="w-4 h-4 text-[#20d09b] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
};
