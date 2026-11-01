import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TravelItinerary, DayItinerary, PlaceLocation } from '../types';
import { MapPin, Navigation, ExternalLink, Hotel, Utensils, Compass } from 'lucide-react';

interface ItineraryMapProps {
  itinerary: TravelItinerary;
  selectedDayIndex?: number | null;
  isDarkMode?: boolean;
}

export const StanzaItineraryMap: React.FC<ItineraryMapProps> = ({ itinerary, selectedDayIndex, isDarkMode = true }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const tc = (dark: string, light: string) => (isDarkMode ? dark : light);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Collect all valid locations
    interface MapMarkerData {
      name: string;
      category: string;
      description?: string;
      lat: number;
      lng: number;
      dayNum?: number;
      bookingUrl?: string;
    }

    const markersData: MapMarkerData[] = [];

    // Filter by selected day or all days
    const activeDays = selectedDayIndex !== undefined && selectedDayIndex !== null && selectedDayIndex >= 0
      ? [itinerary.days[selectedDayIndex]].filter(Boolean)
      : itinerary.days;

    activeDays.forEach((day: DayItinerary) => {
      // Morning
      if (day.morning?.lat && day.morning?.lng) {
        markersData.push({
          name: day.morning.title,
          category: day.morning.category || 'sight',
          description: day.morning.description,
          lat: day.morning.lat,
          lng: day.morning.lng,
          dayNum: day.dayNumber,
          bookingUrl: day.morning.bookingUrl
        });
      }
      // Afternoon
      if (day.afternoon?.lat && day.afternoon?.lng) {
        markersData.push({
          name: day.afternoon.title,
          category: day.afternoon.category || 'adventure',
          description: day.afternoon.description,
          lat: day.afternoon.lat,
          lng: day.afternoon.lng,
          dayNum: day.dayNumber,
          bookingUrl: day.afternoon.bookingUrl
        });
      }
      // Evening
      if (day.evening?.lat && day.evening?.lng) {
        markersData.push({
          name: day.evening.title,
          category: day.evening.category || 'relaxation',
          description: day.evening.description,
          lat: day.evening.lat,
          lng: day.evening.lng,
          dayNum: day.dayNumber,
          bookingUrl: day.evening.bookingUrl
        });
      }
      // Dining
      if (day.diningRecommendation?.lat && day.diningRecommendation?.lng) {
        markersData.push({
          name: day.diningRecommendation.name,
          category: 'dining',
          description: `${day.diningRecommendation.cuisine} • ${day.diningRecommendation.description}`,
          lat: day.diningRecommendation.lat,
          lng: day.diningRecommendation.lng,
          dayNum: day.dayNumber,
          bookingUrl: day.diningRecommendation.bookingUrl
        });
      }
      // Stay
      if (day.stayForNight?.lat && day.stayForNight?.lng) {
        markersData.push({
          name: day.stayForNight.name,
          category: 'hotel',
          description: day.stayForNight.description,
          lat: day.stayForNight.lat,
          lng: day.stayForNight.lng,
          dayNum: day.dayNumber,
          bookingUrl: day.stayForNight.bookingUrl
        });
      }
      // Places
      if (day.places && day.places.length) {
        day.places.forEach((p: PlaceLocation) => {
          if (p.lat && p.lng) {
            markersData.push({
              name: p.name,
              category: p.category || 'sight',
              description: p.description,
              lat: p.lat,
              lng: p.lng,
              dayNum: day.dayNumber,
              bookingUrl: p.searchUrl
            });
          }
        });
      }
    });

    // Add recommended stays
    (itinerary.recommendedStays || []).forEach((stay) => {
      if (stay.lat && stay.lng) {
        markersData.push({
          name: stay.name,
          category: 'hotel',
          description: `${stay.type} • ${stay.pricePerNight}`,
          lat: stay.lat,
          lng: stay.lng,
          bookingUrl: stay.bookingUrl
        });
      }
    });

    // Deduplicate markers close to each other
    const uniqueMarkers: MapMarkerData[] = [];
    markersData.forEach((item) => {
      const exists = uniqueMarkers.some(
        (u) => Math.abs(u.lat - item.lat) < 0.001 && Math.abs(u.lng - item.lng) < 0.001
      );
      if (!exists) uniqueMarkers.push(item);
    });

    if (uniqueMarkers.length === 0) return;

    // Center point
    const centerLat = uniqueMarkers.reduce((acc, curr) => acc + curr.lat, 0) / uniqueMarkers.length;
    const centerLng = uniqueMarkers.reduce((acc, curr) => acc + curr.lng, 0) / uniqueMarkers.length;

    // Clean up existing map if re-rendering
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileAttribution = isDarkMode
      ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
      : '&copy; OpenStreetMap contributors';

    L.tileLayer(tileUrl, {
      attribution: tileAttribution,
      maxZoom: 19,
    }).addTo(map);

    const bounds = L.latLngBounds([]);
    const polylineCoords: L.LatLngExpression[] = [];

    uniqueMarkers.forEach((m) => {
      const point: L.LatLngExpression = [m.lat, m.lng];
      bounds.extend(point);
      polylineCoords.push(point);

      // Color coding based on category
      let badgeBg = '#8c5d25'; // Terracotta
      let iconLabel = '📍';
      if (m.category === 'hotel' || m.category === 'stay') {
        badgeBg = '#2c402e'; // Emerald
        iconLabel = '🏨';
      } else if (m.category === 'dining') {
        badgeBg = '#b45309'; // Amber
        iconLabel = '🍽️';
      } else if (m.category === 'adventure') {
        badgeBg = '#0284c7'; // Sky
        iconLabel = '🌊';
      }

      const customDivIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${badgeBg};
            color: white;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 2px solid white;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>${iconLabel}</span>
            <span>${m.name.length > 18 ? m.name.substring(0, 16) + '...' : m.name}</span>
          </div>
        `,
        iconSize: [120, 26],
        iconAnchor: [60, 13],
      });

      const googleMapsSearch = m.bookingUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.name + ' ' + itinerary.destination)}`;

      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px;">
          <div style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: ${badgeBg};">
            ${m.dayNum ? `Day ${m.dayNum} • ` : ''}${m.category}
          </div>
          <div style="font-weight: bold; font-size: 13px; color: ${isDarkMode ? '#e2e8f0' : '#1c281d'}; margin-top: 2px;">
            ${m.name}
          </div>
          ${m.description ? `<p style="font-size: 11px; color: ${isDarkMode ? '#94a3b8' : '#52574c'}; margin: 4px 0;">${m.description}</p>` : ''}
          <a href="${googleMapsSearch}" target="_blank" rel="noopener noreferrer" style="
            display: inline-block;
            margin-top: 6px;
            padding: 4px 10px;
            background-color: #20d09b;
            color: #08121e;
            text-decoration: none;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
          ">
            Explore on Google Maps ↗
          </a>
        </div>
      `;

      L.marker(point, { icon: customDivIcon }).addTo(map).bindPopup(popupHtml);
    });

    // Draw route polyline
    if (polylineCoords.length > 1) {
      L.polyline(polylineCoords, {
        color: '#8c5d25',
        weight: 3,
        opacity: 0.7,
        dashArray: '6, 8',
      }).addTo(map);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [itinerary, selectedDayIndex, isDarkMode]);

  return (
    <div className={`w-full ${tc('bg-[#0b1726]', 'bg-gradient-to-b from-[#f8fafc] to-[#eef2f7]')} ${tc('border-[#1a2d42]', 'border-slate-200')} border rounded-2xl overflow-hidden shadow-xs`}>
      <div className={`p-4 ${tc('border-[#1a2d42]', 'border-slate-200')} border-b flex items-center justify-between ${tc('bg-[#132235]', 'bg-slate-50')}`}>
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#8c5d25]" />
          <h3 className={`font-serif text-sm font-bold ${tc('text-white', 'text-slate-900')}`}>
            Interactive Travel Map & Recommended Places
          </h3>
        </div>
        <div className={`flex items-center gap-3 text-[11px] font-medium ${tc('text-[#94a3b8]', 'text-slate-500')}`}>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2c402e]"></span> Stays
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></span> Dining
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8c5d25]"></span> Sights & Activities
          </span>
        </div>
      </div>
      
      {/* Leaflet Container */}
      <div
        id="leaflet-map-canvas"
        ref={mapContainerRef}
        className={`w-full h-[380px] sm:h-[450px] z-0 ${tc('bg-[#08121e]', 'bg-white')}`}
      />
    </div>
  );
};
