import React from 'react';
import { StayOption, TransferOption } from '../types';
import { Hotel, ExternalLink, Star, Car, Check, ShieldCheck, MapPin } from 'lucide-react';

interface StaysTransfersCardProps {
  stays: StayOption[];
  transfers: TransferOption[];
  destination: string;
  isDarkMode?: boolean;
}

export const StanzaStaysTransfersCard: React.FC<StaysTransfersCardProps> = ({
  stays,
  transfers,
  destination,
  isDarkMode = true,
}) => {
  const tc = (dark: string, light: string) => (isDarkMode ? dark : light);

  return (
    <div className={`space-y-8 ${tc('text-white', 'text-slate-900')}`}>
      
      {/* Recommended Stays Section */}
      <div className="space-y-4">
        <div className={`flex items-center justify-between ${tc('border-[#1a2d42]', 'border-slate-200')} border-b pb-3`}>
          <div className="flex items-center gap-2">
            <Hotel className="w-5 h-5 text-[#20d09b]" />
            <h3 className={`font-serif text-lg font-bold ${tc('text-white', 'text-slate-900')}`}>
              Curated Stays & Luxury Eco-Resorts
            </h3>
          </div>
          <span className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
            Direct Vendor Pricing via Google Redirect
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stays.map((stay) => {
            const googleSearchUrl = stay.bookingUrl || `https://www.google.com/search?q=${encodeURIComponent(stay.name + ' ' + stay.location + ' booking')}`;

            return (
              <div
                key={stay.id || stay.name}
                className={`${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} border rounded-2xl overflow-hidden hover:border-[#20d09b] transition-all shadow-xl flex flex-col justify-between group`}
              >
                <div>
                  {/* Image Header */}
                  <div className={`relative h-44 ${tc('bg-[#132235]', 'bg-slate-50')} overflow-hidden`}>
                    <img
                      src={stay.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(stay.name)}/600/400`}
                      alt={stay.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-3 right-3 ${isDarkMode ? 'bg-[#08121e]/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'} px-2.5 py-1 rounded-full text-xs font-bold ${tc('text-white', 'text-slate-900')} flex items-center gap-1 shadow-sm ${tc('border-white/10', 'border-slate-200')} border`}>
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{stay.rating || 4.9}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#20d09b] text-[#08121e] px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                      {stay.type}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-serif text-base font-bold ${tc('text-white', 'text-slate-900')}`}>
                        {stay.name}
                      </h4>
                    </div>

                    <div className={`flex items-center gap-1 text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
                      <MapPin className="w-3.5 h-3.5 text-[#20d09b]" />
                      <span>{stay.location}</span>
                    </div>

                    <p className={`text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')} line-clamp-3 leading-relaxed`}>
                      {stay.description}
                    </p>

                    {/* Amenities list */}
                    {stay.amenities && stay.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {stay.amenities.slice(0, 4).map((amenity, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] ${tc('bg-[#132235]', 'bg-slate-50')} text-[#20d09b] px-2 py-0.5 rounded ${tc('border-[#1a2d42]', 'border-slate-200')} border`}
                          >
                            ✓ {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className={`p-4 ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('border-[#1a2d42]', 'border-slate-200')} border-t flex items-center justify-between`}>
                  <div>
                    <span className={`text-[10px] uppercase tracking-wider ${tc('text-[#94a3b8]', 'text-slate-500')} block`}>
                      Direct Rate
                    </span>
                    <span className="text-xs font-bold text-[#20d09b]">
                      {stay.pricePerNight}
                    </span>
                  </div>

                  <a
                    href={googleSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#20d09b] hover:bg-[#2de3aa] text-[#08121e] text-xs font-extrabold transition-all shadow-md"
                  >
                    <span>Check Rates</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Transfers & Logistics Section */}
      <div className={`space-y-4 pt-4 ${tc('border-[#1a2d42]', 'border-slate-200')} border-t`}>
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-[#20d09b]" />
            <h3 className={`font-serif text-lg font-bold ${tc('text-white', 'text-slate-900')}`}>
              Curated Transfers & Transport Options
            </h3>
          </div>
          <span className={`text-xs ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
            Door-to-Door Local Drivers & Ferries
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {transfers.map((tr) => {
            const transferSearchUrl = tr.bookingUrl || `https://www.google.com/search?q=${encodeURIComponent(tr.type + ' ' + tr.route)}`;

            return (
              <div
                key={tr.id || tr.type}
                className={`${tc('bg-[#0b1726]', 'bg-white')} ${tc('border-[#1a2d42]', 'border-slate-200')} border p-5 rounded-2xl flex flex-col justify-between hover:border-[#20d09b] transition-all space-y-3 shadow-lg`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#20d09b] bg-[#20d09b]/10 px-2.5 py-0.5 rounded-full border border-[#20d09b]/20">
                      {tr.duration}
                    </span>
                    <span className={`text-xs font-bold ${tc('text-white', 'text-slate-900')}`}>
                      {tr.estimatedCost}
                    </span>
                  </div>

                  <h4 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>
                    {tr.type}
                  </h4>

                  <p className={`text-xs font-medium text-[#20d09b] ${tc('bg-[#132235]', 'bg-slate-50')} p-2 rounded-xl ${tc('border-[#1a2d42]', 'border-slate-200')} border`}>
                    📍 Route: {tr.route}
                  </p>

                  <p className={`text-xs ${tc('text-[#cbd5e1]', 'text-slate-600')} leading-relaxed`}>
                    {tr.details}
                  </p>
                </div>

                <a
                  href={transferSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl ${tc('bg-[#132235]', 'bg-slate-50')} ${tc('hover:bg-[#1f3248]', 'hover:bg-slate-100')} text-[#20d09b] text-xs font-bold ${tc('border-[#1a2d42]', 'border-slate-200')} border transition-all`}
                >
                  <span>Book Transfer on Google</span>
                  <ExternalLink className="w-3 h-3 text-[#20d09b]" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
