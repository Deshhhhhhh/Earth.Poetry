export interface ItineraryItem {
  day: number;
  title: string;
  experience: string;
  vendorDetails: string;
}

export interface CostItem {
  category: string;
  description: string;
  cost: string;
}

export interface CuratedStory {
  title: string;
  poeticOpening: string;
  itinerary: ItineraryItem[];
  vendorCostSheet: CostItem[];
  earthPoetryCurationFee: string;
  totalPrice: string;
  marketPriceEstimate: string;
  savings: string;
  founderMessage: string;
}

export interface Destination {
  key: string;
  title: string;
  subtitle: string;
  story: string;
  imageUrl: string;
  startingPrice: string;
  marketPrice: string;
  vibe: string;
  experienceStory: string;
  placesToSee: string[];
  foodToTry: string[];
  treksAndTrails: string[];
  detailImages: string[];
  excitementLabel: string;
}

export interface Testimonial {
  name: string;
  trip: string;
  quote: string;
  marketPrice: string;
  vendorPrice: string;
  savings: string;
  avatarSeed: string;
}

export interface PlaceLocation {
  id: string;
  name: string;
  category: 'hotel' | 'restaurant' | 'attraction' | 'adventure' | 'transfer';
  description: string;
  lat: number;
  lng: number;
  address?: string;
  priceLevel?: string;
  rating?: number;
  searchUrl: string;
  imageQuery?: string;
}

export interface ActivitySlot {
  time: string;
  title: string;
  description: string;
  locationName?: string;
  lat?: number;
  lng?: number;
  estimatedCost?: string;
  category: 'sight' | 'dining' | 'adventure' | 'transfer' | 'relaxation' | 'stay';
  bookingUrl: string;
  imageQuery?: string;
}

export interface HotelOption {
  id: string;
  name: string;
  type: string;
  tier: 'Budget' | 'Mid-Range' | 'Boutique/Luxury';
  pricePerNight: string;
  location: string;
  description: string;
  bookingUrl: string;
  rating?: number;
}

export interface TransferBreakdown {
  privateTransport: string;
  publicTransport: string;
  recommendation: string;
}

export interface DayItinerary {
  dayNumber: number;
  dateOrTitle: string;
  route: string;
  summary: string;
  transfers: TransferBreakdown;
  groundAndWalkingTips: string;
  hotelOptions: HotelOption[];
  morning: ActivitySlot;
  afternoon: ActivitySlot;
  evening: ActivitySlot;
  diningRecommendation: {
    name: string;
    cuisine: string;
    description: string;
    priceRange: string;
    bookingUrl: string;
    lat?: number;
    lng?: number;
  };
  stayForNight: {
    name: string;
    type: string;
    description: string;
    bookingUrl: string;
    lat?: number;
    lng?: number;
  };
  dayTotalEstimatedCost: string;
  places: PlaceLocation[];
}

export interface StayOption {
  id: string;
  name: string;
  type: string;
  rating: number;
  pricePerNight: string;
  location: string;
  description: string;
  amenities: string[];
  bookingUrl: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}

export interface TransferOption {
  id: string;
  type: string;
  route: string;
  estimatedCost: string;
  duration: string;
  details: string;
  bookingUrl: string;
}

export interface TravelItinerary {
  id: string;
  title: string;
  destination: string;
  durationDays: number;
  travelers: string;
  budgetTier: 'Budget' | 'Balanced Luxury' | 'Eco-Luxury' | 'Ultra-VIP';
  totalEstimatedCost: string;
  currency: string;
  tagline: string;
  coverImage: string;
  overview: string;
  days: DayItinerary[];
  recommendedStays: StayOption[];
  transfersAndLogistics: TransferOption[];
  insiderTips: string[];
  packingEssentials: string[];
  createdAt: string;
  modificationsCount: number;
}

export interface PromptInputParams {
  destinationPrompt: string;
  durationDays: number;
  travelerType: string;
  budgetTier: string;
  currency: string;
  interests: string[];
  specificPlaces?: string;
  hotelPreferences?: string;
}

export interface TrekDayItinerary {
  day: number;
  title: string;
  altitude: string;
  trekDrive: string;
  meals: string;
  stay: string;
  activities: string[];
}

export interface Trek {
  key: string;
  name: string;
  tagline: string;
  location: string;
  duration: string;
  difficulty: string;
  maxAltitude: string;
  trekDistance: string;
  bestSeason: string;
  startEnd: string;
  reachBy: string;
  stay: string;
  idealFor: string;
  highlights: string[];
  imageUrl: string;
  galleryImages: string[];
  itinerary: TrekDayItinerary[];
  inclusions: string[];
  exclusions: string[];
  safetyStandards: string[];
  whatToCarry: string[];
  importantNotes: string[];
}
