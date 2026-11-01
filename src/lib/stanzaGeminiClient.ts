import { GoogleGenAI, Type } from "@google/genai";
import { TravelItinerary, PromptInputParams } from "../types";
import { SAMPLE_BALI_ITINERARY } from "../data/stanzaSampleItineraries";

function createGoogleSearchUrl(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

const GEMINI_SYSTEM_INSTRUCTION = `You are Earth Poetry's Master Travel Curator (earthpoetry.online). Earth Poetry delivers honest, transparent, direct-vendor travel itineraries aimed at eliminating middleman markups and reducing trip costs.

Your primary goal is to convert the client's prompt into a clean, simple, highly realistic, and cost-conscious day-by-day travel plan:

1. **Keep Each Day Simple & Structured**:
   - Day Title & Route ("route"): "Where to Where" (e.g. "Day 1: Denpasar Airport (DPS) ➔ Ubud Center").
   - Transfers Options ("transfers"): Compare both Private Transport (taxi/private driver) AND Public Transport / Shared Options (local bus, train, ferry, or walking/scooter) with realistic prices in the requested currency.
   - Ground Buying & Trek/Walk Tips ("groundAndWalkingTips"): Explicitly mention where the client can buy things on ground (local markets, street stalls, local co-ops) or trek/walk to avoid paying for expensive tour packages or agency markups.
   - 3 Hotel Options ("hotelOptions"): Provide 3 distinct hotel options suited to the requested budget style (1. Budget / Hostel / Homestay, 2. Mid-Range Eco Lodge, 3. Boutique / Luxury Stay) with nightly rates in the selected currency and Google search/booking links.

2. **Realistic & Reasonable Budgets**:
   - NEVER overcharge or inflate prices! For solo travelers or budget-conscious clients, keep costs realistic (e.g. $25–$60 USD/day for budget solo trips; $60–$120 USD/day for mid-range solo trips).
   - Use the client's chosen currency (e.g., USD, EUR, GBP, INR, AUD, CAD, JPY) across ALL price strings and totals.

3. **Explore Highlights & Map Coordinates**:
   - Simple morning, afternoon, and evening activity slots.
   - Exact real-world latitude and longitude coordinates for map plotting.
   - Valid Google Search URLs for every activity, hotel, and transport link.`;

const ITINERARY_JSON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Catchy title for the trip" },
    destination: { type: Type.STRING, description: "City, Region or Country name" },
    durationDays: { type: Type.INTEGER, description: "Total number of days" },
    travelers: { type: Type.STRING, description: "e.g. Solo Traveler, Couple, Family of 4" },
    budgetTier: { type: Type.STRING, description: "Budget, Balanced Luxury, Eco-Luxury, or Ultra-VIP" },
    totalEstimatedCost: { type: Type.STRING, description: "Realistic total cost in requested currency e.g. $420 USD total" },
    currency: { type: Type.STRING, description: "Selected currency code e.g. USD, EUR, GBP, INR, AUD, CAD, JPY" },
    tagline: { type: Type.STRING, description: "One liner poetic summary" },
    coverImage: { type: Type.STRING, description: "Unsplash photo keyword or URL" },
    overview: { type: Type.STRING, description: "Inspiring 2-3 sentence overview" },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          dateOrTitle: { type: Type.STRING, description: "e.g. Day 1: Arrival & Exploring Ubud Center" },
          route: { type: Type.STRING, description: "Where to Where e.g. Airport ➔ Ubud Town Center" },
          summary: { type: Type.STRING, description: "Brief summary of the day" },
          transfers: {
            type: Type.OBJECT,
            properties: {
              privateTransport: { type: Type.STRING, description: "Private taxi / driver option & cost" },
              publicTransport: { type: Type.STRING, description: "Public bus / train / walk / shared option & cost" },
              recommendation: { type: Type.STRING, description: "Best option for budget vs comfort" }
            },
            required: ["privateTransport", "publicTransport", "recommendation"]
          },
          groundAndWalkingTips: { type: Type.STRING, description: "Where to buy on ground (local markets/street stalls) or trek/walk to save money" },
          hotelOptions: {
            type: Type.ARRAY,
            description: "3 hotel choices matching budget tier",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING, description: "Hostel/Homestay, Eco Lodge, or Boutique" },
                tier: { type: Type.STRING, description: "Budget, Mid-Range, or Boutique/Luxury" },
                pricePerNight: { type: Type.STRING, description: "Nightly price in chosen currency" },
                location: { type: Type.STRING },
                description: { type: Type.STRING },
                bookingUrl: { type: Type.STRING }
              },
              required: ["name", "type", "tier", "pricePerNight", "description", "bookingUrl"]
            }
          },
          morning: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              locationName: { type: Type.STRING },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              estimatedCost: { type: Type.STRING },
              category: { type: Type.STRING },
              bookingUrl: { type: Type.STRING }
            },
            required: ["time", "title", "description", "category"]
          },
          afternoon: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              locationName: { type: Type.STRING },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              estimatedCost: { type: Type.STRING },
              category: { type: Type.STRING },
              bookingUrl: { type: Type.STRING }
            },
            required: ["time", "title", "description", "category"]
          },
          evening: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              locationName: { type: Type.STRING },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              estimatedCost: { type: Type.STRING },
              category: { type: Type.STRING },
              bookingUrl: { type: Type.STRING }
            },
            required: ["time", "title", "description", "category"]
          },
          diningRecommendation: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              cuisine: { type: Type.STRING },
              description: { type: Type.STRING },
              priceRange: { type: Type.STRING },
              bookingUrl: { type: Type.STRING },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER }
            },
            required: ["name", "cuisine", "description"]
          },
          stayForNight: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              description: { type: Type.STRING },
              bookingUrl: { type: Type.STRING },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER }
            },
            required: ["name", "type", "description"]
          },
          dayTotalEstimatedCost: { type: Type.STRING },
          places: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                lat: { type: Type.NUMBER },
                lng: { type: Type.NUMBER },
                searchUrl: { type: Type.STRING }
              },
              required: ["name", "category", "lat", "lng"]
            }
          }
        },
        required: ["dayNumber", "dateOrTitle", "route", "summary", "transfers", "groundAndWalkingTips", "hotelOptions", "morning", "afternoon", "evening", "diningRecommendation", "stayForNight"]
      }
    },
    recommendedStays: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          type: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          pricePerNight: { type: Type.STRING },
          location: { type: Type.STRING },
          description: { type: Type.STRING },
          amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
          bookingUrl: { type: Type.STRING },
          lat: { type: Type.NUMBER },
          lng: { type: Type.NUMBER },
          imageUrl: { type: Type.STRING }
        },
        required: ["name", "type", "pricePerNight", "description", "bookingUrl", "lat", "lng"]
      }
    },
    transfersAndLogistics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING },
          route: { type: Type.STRING },
          estimatedCost: { type: Type.STRING },
          duration: { type: Type.STRING },
          details: { type: Type.STRING },
          bookingUrl: { type: Type.STRING }
        },
        required: ["type", "route", "estimatedCost", "details", "bookingUrl"]
      }
    },
    insiderTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    packingEssentials: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: [
    "title", "destination", "durationDays", "travelers", "budgetTier",
    "totalEstimatedCost", "currency", "tagline", "overview", "days",
    "recommendedStays", "transfersAndLogistics", "insiderTips", "packingEssentials"
  ]
};

function getGeminiApiKey(): string | null {
  const key = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
    return key.trim();
  }
  return null;
}

function createGeminiClient(): GoogleGenAI | null {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function enrichItinerary(generatedItinerary: any): TravelItinerary {
  const enrichedItinerary: TravelItinerary = {
    ...generatedItinerary,
    id: `earth-poetry-${Date.now()}`,
    createdAt: new Date().toISOString(),
    modificationsCount: 0,
    coverImage: generatedItinerary.coverImage && generatedItinerary.coverImage.startsWith('http')
      ? generatedItinerary.coverImage
      : `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80`
  };

  enrichedItinerary.days = (enrichedItinerary.days || []).map((day: any) => ({
    ...day,
    morning: {
      ...day.morning,
      bookingUrl: day.morning?.bookingUrl || createGoogleSearchUrl(`${day.morning?.title || ''} ${enrichedItinerary.destination}`)
    },
    afternoon: {
      ...day.afternoon,
      bookingUrl: day.afternoon?.bookingUrl || createGoogleSearchUrl(`${day.afternoon?.title || ''} ${enrichedItinerary.destination}`)
    },
    evening: {
      ...day.evening,
      bookingUrl: day.evening?.bookingUrl || createGoogleSearchUrl(`${day.evening?.title || ''} ${enrichedItinerary.destination}`)
    },
    diningRecommendation: {
      ...day.diningRecommendation,
      bookingUrl: day.diningRecommendation?.bookingUrl || createGoogleSearchUrl(`${day.diningRecommendation?.name || ''} restaurant ${enrichedItinerary.destination}`)
    },
    stayForNight: {
      ...day.stayForNight,
      bookingUrl: day.stayForNight?.bookingUrl || createGoogleSearchUrl(`${day.stayForNight?.name || ''} hotel ${enrichedItinerary.destination}`)
    }
  }));

  return enrichedItinerary;
}

export async function generateItineraryClient(params: PromptInputParams): Promise<{
  success: boolean;
  itinerary?: TravelItinerary;
  error?: string;
  usedFallback: boolean;
  sampleItinerary?: TravelItinerary;
}> {
  const {
    destinationPrompt,
    durationDays = 5,
    travelerType = 'Solo',
    budgetTier = 'Budget',
    currency = 'USD',
    interests = [],
    specificPlaces = '',
    hotelPreferences = ''
  } = params;

  if (!destinationPrompt) {
    return { success: false, error: 'Please provide a travel prompt or destination.', usedFallback: false };
  }

  const aiClient = createGeminiClient();
  if (!aiClient) {
    console.warn('[Stanza] No GEMINI_API_KEY available. Using sample Bali itinerary.');
    return {
      success: false,
      error: 'Gemini API key not configured. Using sample itinerary.',
      usedFallback: true,
      sampleItinerary: SAMPLE_BALI_ITINERARY
    };
  }

  const userPromptText = `
Generate a curated, simple, and realistic travel itinerary for Earth Poetry client with these exact preferences:
- Trip Requirements: "${destinationPrompt}"
- Duration: ${durationDays} Days
- Traveler Type: ${travelerType}
- Requested Budget Tier: ${budgetTier}
- Target Currency: ${currency}
${interests.length ? `- Key Interests: ${interests.join(', ')}` : ''}
${specificPlaces ? `- Specific Places / Sights: ${specificPlaces}` : ''}
${hotelPreferences ? `- Hotel preferences: ${hotelPreferences}` : ''}

CRITICAL DIRECTIVES:
1. CURRENCY: All prices, daily totals, and overall estimates MUST use the currency "${currency}".
2. REALISTIC & ACCESSIBLE BUDGET: For ${travelerType} on ${budgetTier} budget, keep costs realistic! Avoid overcharging. Focus on reducing costs where client can buy things on ground or trek/walk.
3. FOR EACH DAY ("route"): State clearly "Where to Where" (e.g. "Airport DPS ➔ Ubud Center").
4. TRANSFERS: Show both Private Transport (taxi/driver) AND Public Transport (bus/train/walk/scooter) with realistic prices.
5. GROUND & WALKING TIPS: Mention where to buy food/water on ground (local market, street food) or trek/walk to cut tour/transfer fees.
6. 3 HOTEL OPTIONS: For each day, provide 3 budget-matched hotel choices (Budget/Hostel, Mid-range, Boutique) with nightly rates in ${currency}.
7. Map & Links: Exact lat/lng coordinates and Google search/booking links for every place.
`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPromptText,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: ITINERARY_JSON_SCHEMA,
        temperature: 0.7,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini AI');
    }

    const generatedItinerary = JSON.parse(responseText);
    const enrichedItinerary = enrichItinerary(generatedItinerary);

    return {
      success: true,
      itinerary: enrichedItinerary,
      usedFallback: false
    };
  } catch (error: any) {
    console.error('Error generating itinerary (client-side):', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate itinerary with Gemini.',
      usedFallback: true,
      sampleItinerary: SAMPLE_BALI_ITINERARY
    };
  }
}

export async function modifyItineraryClient(
  existingItinerary: TravelItinerary,
  modificationPrompt: string
): Promise<{
  success: boolean;
  itinerary?: TravelItinerary;
  error?: string;
}> {
  if (!existingItinerary || !modificationPrompt) {
    return { success: false, error: 'Missing existing itinerary or modification prompt.' };
  }

  const aiClient = createGeminiClient();
  if (!aiClient) {
    return {
      success: false,
      error: 'Gemini API key is not configured. Cannot modify itinerary without AI.'
    };
  }

  const modificationUserPrompt = `
You are modifying an existing travel itinerary for an Earth Poetry client based on their request.

CURRENT ITINERARY OBJECT:
${JSON.stringify(existingItinerary)}

CLIENT'S MODIFICATION REQUEST:
"${modificationPrompt}"

INSTRUCTIONS:
1. Revise and update the itinerary to seamlessly integrate the user's requested changes (e.g. hotel upgrades, budget adjustments, adding/swapping activities, changing pace, adding family-friendly options).
2. Keep the overall structure and JSON format intact while updating relevant days, stays, prices, or activities.
3. Ensure exact geographic lat/lng coordinates and valid Google search/booking URLs for modified or new places.
4. Maintain high-level Earth Poetry luxury quality and tone.
`;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: modificationUserPrompt,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: ITINERARY_JSON_SCHEMA,
        temperature: 0.7,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini AI');
    }

    const updatedItinerary = JSON.parse(responseText);
    const enrichedUpdated: TravelItinerary = {
      ...updatedItinerary,
      id: existingItinerary.id,
      createdAt: existingItinerary.createdAt || new Date().toISOString(),
      modificationsCount: (existingItinerary.modificationsCount || 0) + 1,
      coverImage: existingItinerary.coverImage || updatedItinerary.coverImage
    };

    return {
      success: true,
      itinerary: enrichItinerary(enrichedUpdated)
    };
  } catch (error: any) {
    console.error('Error modifying itinerary (client-side):', error);
    return {
      success: false,
      error: error?.message || 'Failed to modify itinerary with Gemini.'
    };
  }
}

const CURATE_STORY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    poeticOpening: { type: Type.STRING },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          experience: { type: Type.STRING },
          vendorDetails: { type: Type.STRING },
        },
        required: ["day", "title", "experience", "vendorDetails"],
      },
    },
    vendorCostSheet: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          cost: { type: Type.STRING },
        },
        required: ["category", "description", "cost"],
      },
    },
    earthPoetryCurationFee: { type: Type.STRING },
    totalPrice: { type: Type.STRING },
    marketPriceEstimate: { type: Type.STRING },
    savings: { type: Type.STRING },
    founderMessage: { type: Type.STRING },
  },
  required: [
    "title",
    "poeticOpening",
    "itinerary",
    "vendorCostSheet",
    "earthPoetryCurationFee",
    "totalPrice",
    "marketPriceEstimate",
    "savings",
    "founderMessage",
  ],
};

function generateMockStory(destination: string, vibe: string, souls: number, date: string, days: number) {
  const isUSD = destination.toLowerCase().includes("sri lanka");
  const currencySymbol = isUSD ? "$" : "₹";

  const formattedOpening = `Written on the trail for ${souls} soul(s). Your journey to ${destination} on ${date} is wrapped in the quiet mood of ${vibe}. We met the local families, hiked the paths, and structured this direct-to-vendor stanza for you.`;

  const items = [];
  for (let d = 1; d <= days; d++) {
    items.push({
      day: d,
      title: `Stanza ${d}: The Unwritten Whispers`,
      experience: `A slow morning observing the quiet mist, followed by custom paths curated through years of personal wandering. Sharing a hot cup of wild-herb tea with old friends.`,
      vendorDetails: `Local guide services by Tenzing / Yasin at standard direct community wage, settled transparently.`,
    });
  }

  const mockCostSheet = [
    {
      category: "Boutique Stays",
      description: "Organic homestays and heritage family cottages",
      cost: isUSD ? `${120 * days}` : `${2500 * days}`,
    },
    {
      category: "Path Transport",
      description: "Direct village co-op driver union rate",
      cost: isUSD ? `${80 * days}` : `${1800 * days}`,
    },
    {
      category: "Local Guidance",
      description: "Native hosts and trail guardians",
      cost: isUSD ? "50" : "1500",
    },
  ];

  const curationFee = isUSD ? "30" : "2500";
  const subTotal = mockCostSheet.reduce((acc, item) => {
    const numeric = parseInt(item.cost.replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);
  const total = subTotal + (parseInt(curationFee) || 0);
  const marketPrice = Math.round(total * 1.38);
  const saved = marketPrice - total;

  return {
    title: `The Story of the Wild: ${destination}`,
    poeticOpening: formattedOpening,
    itinerary: items,
    vendorCostSheet: mockCostSheet,
    earthPoetryCurationFee: `${currencySymbol}${curationFee}`,
    totalPrice: `${currencySymbol}${total}`,
    marketPriceEstimate: `${currencySymbol}${marketPrice}`,
    savings: `${currencySymbol}${saved}`,
    founderMessage: `Hey under the stars. I've walked these trails myself. Hand-settling accounts with the locals is how we preserve travel. Talk to me on the WhatsApp drop if you want to twist this route! — Desh.`,
  };
}

export async function generateCuratedStoryClient(
  destination: string,
  vibe: string,
  souls: number,
  date: string,
  days: number = 5
): Promise<any> {
  const aiClient = createGeminiClient();
  if (!aiClient) {
    console.warn('[Curate Story] No GEMINI_API_KEY available. Using mock story.');
    return generateMockStory(destination, vibe, souls, date, days);
  }

  const prompt = `
    You are Desh, the 24-year-old wanderer from Lucknow and founder of "Earth.poetry", a radical travel platform that sells travel at direct-to-vendor honest pricing with 0% corporate markup.
    A traveler has submitted an inquiry to begin their personalized chapter.
    
    Details:
    - Destination: ${destination}
    - Travel Vibe: ${vibe} (e.g., Adventure, Peace, Luxury)
    - Souls Traveling: ${souls} person(s)
    - Date: ${date}
    - Days Count: ${days} days
    
    Please curate an authentic, deeply sensory, and poetic travel stanza. Keep it storytelling-focused, personal, and honest. Avoid generic corporate "itineraries" with standard sightseeing checklists. Highlight local interactions, raw experiences, and specific direct-to-vendor breakdowns.
    
    Return a single JSON object with the following schema:
    - title: The name of the custom travel stanza, e.g., "The Mist-Clad Quietude" or "The Golden Horizon".
    - poeticOpening: A 2-to-3 line poetic sensory prologue about this specific trip tailored to the destination and vibe.
    - itinerary: An array of ${days} items, each having:
      - day: Number (1 to ${days})
      - title: A beautifully evocative day title.
      - experience: Poetic description focusing on feeling and landscape (e.g., "Walking on cedar needles," "Drinking salty Mirissa spray").
      - vendorDetails: Specific honest local vendor information (e.g., "Bhagat's small wooden cabin stay", "Yasin's heritage family shikara boat"). Direct vendor prices should be mentioned.
    - vendorCostSheet: An array of object parts displaying direct-to-vendor categories, descriptions, and fair rates:
      - category: string
      - description: string
      - cost: string (e.g., "₹X,XXX" or "$XXX")
    - earthPoetryCurationFee: string (A flat, honest fee for your curation effort, typically "₹2,500" or "$30")
    - totalPrice: string (The sum of all actual direct costs + curation fee)
    - marketPriceEstimate: string (What typical corporate middleman platforms charge, which is 35% to 40% higher)
    - savings: string (The money saved by paying direct vendor pricing)
    - founderMessage: A short, warm, human sign-off from Desh, sharing a custom travel tip for this specific itinerary.
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: CURATE_STORY_SCHEMA,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text returned from Gemini API");
    }

    return JSON.parse(responseText.trim());
  } catch (err: any) {
    console.error("Gemini storytelling generation failed (client-side):", err);
    return generateMockStory(destination, vibe, souls, date, days);
  }
}
