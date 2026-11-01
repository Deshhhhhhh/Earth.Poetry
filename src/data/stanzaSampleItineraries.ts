import { TravelItinerary } from '../types';

export const SAMPLE_BALI_ITINERARY: TravelItinerary = {
  id: "earth-poetry-bali-01",
  title: "7-Day Authentic Eco-Luxe Bali Explorer",
  destination: "Bali, Indonesia",
  durationDays: 7,
  travelers: "Solo / Couple",
  budgetTier: "Balanced Luxury",
  totalEstimatedCost: "$680 USD",
  currency: "USD",
  tagline: "Cascading rice terraces, direct ground-vendor stays, scenic treks & honest local culinary spots.",
  coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  overview: "Direct-from-source travel planning designed to save money while experiencing Bali's rich heart. Includes public vs private transfers, 3 budget-customized hotel options per day, and ground-buying money savers.",
  days: [
    {
      dayNumber: 1,
      dateOrTitle: "Day 1: Airport Arrival to Ubud Center",
      route: "Ngurah Rai Airport (DPS) ➔ Ubud Art Market & Center",
      summary: "Arrive at Denpasar Airport. Choose between a shared local airport bus or a direct private taxi. Settle into Ubud and walk the scenic Campuhan Ridge at sunset.",
      transfers: {
        privateTransport: "Private Airport Driver: $25 USD (Direct, AC, 75 mins)",
        publicTransport: "Kura-Kura Airport Shuttle Bus: $4.50 USD (Departs hourly)",
        recommendation: "Take the $4.50 Kura-Kura shuttle or share a ride via GoJek app on ground to save over 70%!"
      },
      groundAndWalkingTips: "💡 Money Saver: Buy fresh organic coconuts ($1) and mineral water ($0.40) directly at local warungs on ground instead of airport or hotel lobbies. Walk Campuhan Ridge for free!",
      hotelOptions: [
        {
          id: "h1-1",
          name: "Puri Garden Hostel & Pool Bar",
          type: "Hostel / Budget Homestay",
          tier: "Budget",
          pricePerNight: "$18 USD / night",
          location: "Ubud Center",
          description: "Free daily yoga, puppy lounge, swimming pool, and organic breakfast included.",
          bookingUrl: "https://www.google.com/search?q=Puri+Garden+Hostel+Ubud+booking"
        },
        {
          id: "h1-2",
          name: "Sungei Bamboo Eco Lodge",
          type: "Eco Lodge / Mid-Range",
          tier: "Mid-Range",
          pricePerNight: "$55 USD / night",
          location: "Penestanan, Ubud",
          description: "Open-air bamboo suites overlooking rice paddies with natural river spring water.",
          bookingUrl: "https://www.google.com/search?q=Sungei+Bamboo+Eco+Lodge+Ubud"
        },
        {
          id: "h1-3",
          name: "Bambu Indah Sanctuary",
          type: "Boutique / Luxury Resort",
          tier: "Boutique/Luxury",
          pricePerNight: "$190 USD / night",
          location: "Sayan Ridge, Ubud",
          description: "Iconic hand-carved bamboo treehouses with natural filtered pools and organic farm dining.",
          bookingUrl: "https://www.google.com/search?q=Bambu+Indah+Resort+Ubud"
        }
      ],
      morning: {
        time: "10:00 AM - 01:00 PM",
        title: "Airport Arrival & Transport Choice",
        description: "Arrive at Ngurah Rai Airport (DPS). Pick up a local SIM card at arrival hall and hop on the airport bus or private ride.",
        locationName: "Ngurah Rai International Airport (DPS)",
        lat: -8.7482,
        lng: 115.1672,
        estimatedCost: "$4.50 - $25 USD",
        category: "transfer",
        bookingUrl: "https://www.google.com/search?q=airport+transfer+denpasar+to+ubud"
      },
      afternoon: {
        time: "02:30 PM - 05:00 PM",
        title: "Ubud Market Walk & Herbal Tasting",
        description: "Explore local artisan markets in Ubud center. Sample fresh jamu herbal tonics ($1) prepared by local elders.",
        locationName: "Ubud Art Market",
        lat: -8.5069,
        lng: 115.2625,
        estimatedCost: "$3 USD",
        category: "sight",
        bookingUrl: "https://www.google.com/search?q=Ubud+Art+Market+Bali"
      },
      evening: {
        time: "05:30 PM - 08:30 PM",
        title: "Sunset Campuhan Ridge Hike & Local Warung Dinner",
        description: "Enjoy a peaceful self-guided walking trek along Campuhan Ridge, followed by authentic Nasi Campur at Warung Sun Sun.",
        locationName: "Campuhan Ridge Walk",
        lat: -8.5032,
        lng: 115.2545,
        estimatedCost: "$6 USD",
        category: "dining",
        bookingUrl: "https://www.google.com/search?q=Warung+Sun+Sun+Ubud"
      },
      diningRecommendation: {
        name: "Warung Sun Sun Ubud",
        cuisine: "Authentic Balinese Family Recipes",
        description: "Award-winning local warung serving organic balinese tasting platters on banana leaves.",
        priceRange: "$",
        bookingUrl: "https://www.google.com/search?q=Warung+Sun+Sun+Ubud+menu",
        lat: -8.5055,
        lng: 115.2618
      },
      stayForNight: {
        name: "Sungei Bamboo Eco Lodge",
        type: "Mid-Range Eco Stay",
        description: "Peaceful bamboo suite surrounded by organic banana palms.",
        bookingUrl: "https://www.google.com/search?q=Sungei+Bamboo+Eco+Lodge+Ubud",
        lat: -8.5069,
        lng: 115.2415
      },
      dayTotalEstimatedCost: "$38 USD",
      places: [
        {
          id: "p1-1",
          name: "Ngurah Rai Airport DPS",
          category: "transfer",
          description: "Denpasar Airport Terminal",
          lat: -8.7482,
          lng: 115.1672,
          searchUrl: "https://www.google.com/maps/search/?api=1&query=Ngurah+Rai+Airport+DPS"
        },
        {
          id: "p1-2",
          name: "Campuhan Ridge Walk",
          category: "attraction",
          description: "Scenic free hilltop walking trail in Ubud",
          lat: -8.5032,
          lng: 115.2545,
          searchUrl: "https://www.google.com/maps/search/?api=1&query=Campuhan+Ridge+Walk"
        }
      ]
    },
    {
      dayNumber: 2,
      dateOrTitle: "Day 2: Emerald Rice Terraces & Hidden Waterfalls",
      route: "Ubud Town ➔ Tegallalang Terraces ➔ Leke Leke Waterfall",
      summary: "Trek through misty UNESCO rice paddies at dawn and swim at Leke Leke waterfall. Save money by buying entry tickets directly on ground.",
      transfers: {
        privateTransport: "Scooter Rental: $6 USD / day OR Private Car Driver: $30 USD / day",
        publicTransport: "Shared Shuttle Van: $5 USD / trip or rented bicycle",
        recommendation: "Rent a clean scooter ($6/day) or take a shared local shuttle to keep ground transport cheap!"
      },
      groundAndWalkingTips: "💡 Money Saver: Pay waterfall entrance fees ($2) directly at the local village kiosk. Pack your own refillable water flask.",
      hotelOptions: [
        {
          id: "h2-1",
          name: "Inna Rice Field Homestay",
          type: "Hostel / Budget Homestay",
          tier: "Budget",
          pricePerNight: "$15 USD / night",
          location: "Tegallalang",
          description: "Traditional Balinese family homestay with tropical garden & breakfast.",
          bookingUrl: "https://www.google.com/search?q=Inna+Homestay+Tegallalang"
        },
        {
          id: "h2-2",
          name: "Pramana Giri Kusuma",
          type: "Eco Lodge / Mid-Range",
          tier: "Mid-Range",
          pricePerNight: "$68 USD / night",
          location: "Payangan, Ubud",
          description: "Serene jungle sanctuary with infinity river view pool.",
          bookingUrl: "https://www.google.com/search?q=Pramana+Giri+Kusuma+Ubud"
        },
        {
          id: "h2-3",
          name: "Viceroy Bali Villas",
          type: "Boutique / Luxury Resort",
          tier: "Boutique/Luxury",
          pricePerNight: "$320 USD / night",
          location: "Valley of the Kings",
          description: "Private heated pool villas overlooking lush jungle ravine.",
          bookingUrl: "https://www.google.com/search?q=Viceroy+Bali+rates"
        }
      ],
      morning: {
        time: "06:30 AM - 10:00 AM",
        title: "Tegallalang Sunrise Self-Guided Trek",
        description: "Beat the morning heat and tour buses. Walk the subak irrigation paths directly through the rice fields.",
        locationName: "Tegallalang Rice Terraces",
        lat: -8.4312,
        lng: 115.2810,
        estimatedCost: "$1.50 USD (Village Entry)",
        category: "sight",
        bookingUrl: "https://www.google.com/search?q=Tegallalang+Rice+Terraces+entry"
      },
      afternoon: {
        time: "11:30 AM - 03:00 PM",
        title: "Leke Leke Waterfall Dip & Coconut Break",
        description: "Hike down the shaded bamboo canyon to swim in the crystal cool pool under Leke Leke waterfall.",
        locationName: "Leke Leke Waterfall",
        lat: -8.3725,
        lng: 115.2014,
        estimatedCost: "$3.50 USD",
        category: "adventure",
        bookingUrl: "https://www.google.com/search?q=Leke+Leke+Waterfall+entry"
      },
      evening: {
        time: "05:00 PM - 08:30 PM",
        title: "Alchemy Plant-Based Bistro & Garden Rest",
        description: "Enjoy raw organic salad bowls and fresh cold-pressed juices in a bamboo open-air canopy.",
        locationName: "Alchemy Ubud",
        lat: -8.5011,
        lng: 115.2492,
        estimatedCost: "$12 USD",
        category: "dining",
        bookingUrl: "https://www.google.com/search?q=Alchemy+Ubud+menu"
      },
      diningRecommendation: {
        name: "Alchemy Ubud",
        cuisine: "Organic Plant-Based Culinary",
        description: "100% organic custom salad bar and raw chocolate desserts.",
        priceRange: "$$",
        bookingUrl: "https://www.google.com/search?q=Alchemy+Ubud",
        lat: -8.5011,
        lng: 115.2492
      },
      stayForNight: {
        name: "Pramana Giri Kusuma",
        type: "Mid-Range Eco Stay",
        description: "Riverside pool lodge in Payangan valley.",
        bookingUrl: "https://www.google.com/search?q=Pramana+Giri+Kusuma",
        lat: -8.4312,
        lng: 115.2810
      },
      dayTotalEstimatedCost: "$23 USD",
      places: [
        {
          id: "p2-1",
          name: "Tegallalang Rice Terraces",
          category: "attraction",
          description: "UNESCO rice terraces",
          lat: -8.4312,
          lng: 115.2810,
          searchUrl: "https://www.google.com/maps/search/?api=1&query=Tegallalang+Rice+Terraces"
        },
        {
          id: "p2-2",
          name: "Leke Leke Waterfall",
          category: "adventure",
          description: "Secluded jungle waterfall",
          lat: -8.3725,
          lng: 115.2014,
          searchUrl: "https://www.google.com/maps/search/?api=1&query=Leke+Leke+Waterfall"
        }
      ]
    }
  ],
  recommendedStays: [
    {
      id: "stay-1",
      name: "Sungei Bamboo Eco Lodge",
      type: "Eco Lodge / Mid-Range Stay",
      rating: 4.8,
      pricePerNight: "$55 USD",
      location: "Ubud Rainforest, Bali",
      description: "Organic bamboo architecture, natural spring water pool, local breakfast included.",
      amenities: ["Free High-speed Wi-Fi", "Organic Breakfast", "Natural Pool", "Scooter Rental"],
      bookingUrl: "https://www.google.com/search?q=Sungei+Bamboo+Eco+Lodge+Ubud",
      lat: -8.5069,
      lng: 115.2415,
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
    }
  ],
  transfersAndLogistics: [
    {
      id: "tr-1",
      type: "Airport Express Bus / GoJek Shared Ride",
      route: "Denpasar Airport (DPS) ➔ Ubud Center",
      estimatedCost: "$4.50 USD",
      duration: "75 mins",
      details: "Air-conditioned local express bus or ride-hailing app directly on ground.",
      bookingUrl: "https://www.google.com/search?q=airport+bus+denpasar+to+ubud"
    }
  ],
  insiderTips: [
    "Buy fresh fruit and bottled water at local morning markets to cut daily food expenses by 50%.",
    "Use GoJek or Grab mobile apps on ground for transparent scooter and car fares without middleman markups.",
    "Walk or trek along local ridge walks for free panoramic views without paying expensive tour operators."
  ],
  packingEssentials: [
    "Refillable water flask with built-in filter",
    "Breathable lightweight hiking or walking shoes",
    "Reef-safe sunscreen and hat"
  ],
  createdAt: new Date().toISOString(),
  modificationsCount: 0
};

export const PRESET_PROMPTS = [
  {
    title: "Solo Budget Explorer in Bali (5 Days)",
    destination: "Bali, Indonesia",
    durationDays: 5,
    travelerType: "Solo",
    budgetTier: "Budget",
    promptText: "5 days solo travel in Bali on a budget. Want public buses, local homestays, self-guided walking treks, waterfall dips, street food warungs, and clear daily hotel options."
  },
  {
    title: "Romantic Amalfi Coast & Capri (6 Days)",
    destination: "Amalfi Coast, Italy",
    durationDays: 6,
    travelerType: "Couple",
    budgetTier: "Balanced Luxury",
    promptText: "6 days in Amalfi Coast & Capri. Scenic ferry options, boutique guesthouses, limoncello tasting, path of the gods walking hike, and realistic seafood trattoria dining."
  },
  {
    title: "Kyoto & Tokyo Heritage Escapade (8 Days)",
    destination: "Japan (Kyoto & Tokyo)",
    durationDays: 8,
    travelerType: "Solo / Couple",
    budgetTier: "Balanced Luxury",
    promptText: "8 days exploring Tokyo modern food markets & Kyoto serene temples. Local train pass, ramen alley street food, bamboo grove morning walk, and budget-friendly ryokans."
  },
  {
    title: "Swiss Alps & Scenic Express Trains (5 Days)",
    destination: "Switzerland (Zermatt & Lucerne)",
    durationDays: 5,
    travelerType: "Couple / Friends",
    budgetTier: "Balanced Luxury",
    promptText: "5 days alpine travel in Switzerland. Scenic train passes, budget alpine lodges with Matterhorn views, fondue dining, self-guided mountain hikes."
  }
];
