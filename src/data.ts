import { Destination, Testimonial } from "./types";

export const DESTINATIONS: Destination[] = [
  {
    key: "himachal",
    title: "Himachal",
    subtitle: "The Mist-Clad Whisper",
    story: "Wander through old Deodar forests in Dharamkot or Jibhi where the morning air smells of fresh cedar and silence. Pay what the local homestay owner charges, and drive through the valley with co-op union cabs.",
    imageUrl: "/images/deodar_forest_1782050550883.jpg",
    startingPrice: "₹12,500",
    marketPrice: "₹18,200",
    vibe: "Peace",
    excitementLabel: "Ethereal Quiet & Forest Mystique",
    experienceStory: "When I left Lucknow in the heat of June, the first breath of cedar in Dharamkot felt like a baptism. I lived in a wooden attic tucked away on the quiet edges of Jibhi. Every morning, mist would crawl through the floorboards. I ate warm Siddu dipped in clarified local ghee, cooked over an open firewood oven by Aunty Maya. One afternoon, we set out on the steep hemlock trail up to Serolsar Lake. The lake lay flat and silent, like a heavy sheet of dynamic glass reflecting pine needles. No massive hotels exist here. I sat down with Bhagat, our driver, who shared hot salt tea from his steel flask and told stories of the winter snow. This is the Himachal no agency can sell you—raw, cold, and entirely true.",
    placesToSee: ["Dharamkot Pines", "Jibhi Miniature Streams", "Serolsar Wilderness Basin", "Old Chehni Kothi Tower"],
    foodToTry: ["Stuffed Siddu with wild walnuts", "Chha Gosht (Slow lamb in buttermilk)", "Spiced Red Rice", "Fresh Apricot Mead"],
    treksAndTrails: ["Kheerganga Sulfur Springs Hike", "Serolsar High Ridge Walk", "Kareri Glacial Stream Scramble"],
    detailImages: [
      "/images/deodar_forest_1782050550883.jpg"
    ]
  },
  {
    key: "ladakh",
    title: "Leh Ladakh",
    subtitle: "The High-Altitude Prayer",
    story: "Cross the highest passes where prayer flags flutter under skies so deep they look like glass. See Ladakh as the villagers see it—sleeping in quiet stone houses right under Pangong Lake's clouds.",
    imageUrl: "/images/pangong_lake_1782050534216.jpg",
    startingPrice: "₹21,000",
    marketPrice: "₹31,500",
    vibe: "Adventure",
    excitementLabel: "Heart-pounding Glacial Elevation",
    experienceStory: "Ladakh breaks you first, then reconstructs you with starlight. Reaching Khardung La on the back of an old cooperative bike felt like standing on the border of our atmosphere. Your breath runs thin, and the sky becomes a blinding, electric turquoise. My guide, Dorje, took me to his stone settlement in Then. We dined on hot bowls of Thukpa filled with hand-shaved flat noodles and fresh mountain chives, washed down with thick, salty yak butter tea. The next day, we trekked along the stark brown ridges of the Sham Valley. When Pangong Lake finally unfurled, its deep, mirror-glass blue water reflecting massive puffy white clouds, I sat on the gravel shore for hours in pure silence. Traditional tourists pay double to sleep in massive pre-fabricated luxury tents. I paid exactly Dorje's family rate, sleeping on their sheepskins under a sky so clear you could count the arms of the Milky Way.",
    placesToSee: ["Pangong Lake Mirror-Waters", "Diskit Hanging Monastery", "Nubra Cold Dunes", "Magnetic Valley Ridges"],
    foodToTry: ["Dorje's mom's steamed cheese Momos", "Salty Yak Butter Tea", "Hearty mutton Thukpa noodle broth"],
    treksAndTrails: ["Sham Valley Baby Trek", "Markha Valley Alpine Crossing", "Stok Kangri Base Boulder Scramble"],
    detailImages: [
      "/images/pangong_lake_1782050534216.jpg"
    ]
  },
  {
    key: "kashmir",
    title: "Kashmir",
    subtitle: "The Earth’s Masterpiece",
    story: "Float slowly on Dal Lake in a real cedar shikara at dusk. Stay in hand-built houseboats run by local families, eating collard greens and hot transit kahwa by the fireside.",
    imageUrl: "/images/dal_lake_1782050567385.jpg",
    startingPrice: "₹18,500",
    marketPrice: "₹27,000",
    vibe: "Peace",
    excitementLabel: "Poetic Grace & Floating Senses",
    experienceStory: "I came to Srinagar looking for the quietest corner of the planet and found it on the rear deck of a century-old cedar houseboat. Away from the commercial tourist piers, our family hosts hand-carved this boat themselves. In the cold mountain dusk, we sat over a warm brass samovar brewing saffron Kahwa, eating traditional Kashmiri Wazwan dishes like buttery Rogan Josh and tender Gushtaba. Our days were slow. We paddled through the floating lotus gardens of Dal Lake in a handmade wooden shikara, watching the Zabarwan peaks turn a deep purple. Then local guides led us on the epic pine ridge trail to the meadow of Sonamarg, walking over absolute snow bridges. Paying agencies means paying commissions to desk agents in Delhi. Settle accounts directly with our host family, and sleep with the soft lap of lake water humming you to bed.",
    placesToSee: ["Floating Lily Lotus Gardens", "Shalimar Mughal Terraces", "Sonamarg Glacial Meadows", "Dachigam Forest Sanctuary"],
    foodToTry: ["Slow saffron Kahwa with crushed almonds", "Gushtaba (Yogurt-braised mutton meatballs)", "Hakh (Collard greens cooked in mustard oil)", "Sheermal bread"],
    treksAndTrails: ["Great Lakes High Pass Trek", "Thajiwas Glacier Glacier Scramble", "Naranag Ancient Ruins Trail"],
    detailImages: [
      "/images/dal_lake_1782050567385.jpg"
    ]
  },
  {
    key: "northeast",
    title: "The North East",
    subtitle: "The Unwritten Chapter",
    story: "Discover hidden waterfalls in Cherrapunji and the ancient, double-decker living root bridges. Sleep in bamboo huts, taking roots of the Earth as our natural guides.",
    imageUrl: "/images/meghalaya_roots_1782050584900.jpg",
    startingPrice: "₹24,000",
    marketPrice: "₹34,800",
    vibe: "Adventure",
    excitementLabel: "Lush Moss & Living Nature",
    experienceStory: "Down in the emerald valleys of Nongriat, the forest literally breathes. We trekked down 3,500 mossy stone steps, through thick tropical humidity, to find the living root bridges. These aren't built; they are grown by the Khasi ancestors over centuries, guiding rubber tree roots across turquoise mountain rivers. We slept in a simple bamboo hut run by Byron, falling asleep to the rumble of a hidden waterfall. For breakfast, Byron served traditional Jadoh—a flavorful red rice dish cooked in local herbs—paired with wild honey and strong tea. The raw thrill of looking down from the edges of Wei Sawdong waterfall, where the water tumbles into perfect turquoise stone bowls, is unforgettable. The big travel portals markup this pristine region by 40%. Settle with Byron and local village trail keepers directly, and let the living roots show you how to stand.",
    placesToSee: ["Nongriat Double-Decker Bridge", "Wei Sawdong Turquoise Pools", "Mawsmai Limestone Caverns", "Dawki Glass-Water River"],
    foodToTry: ["Traditional Jadoh (Khasi rice)", "Smoked pork with bamboo shoots", "Fermented Tungrymbai herbs", "Wild Cherrapunji Honey tea"],
    treksAndTrails: ["Nongriat 3,000 Steps Descend", "Wei Sawdong Waterfall Scramble", "David Scott Historical Trail Walk"],
    detailImages: [
      "/images/meghalaya_roots_1782050584900.jpg"
    ]
  },
  {
    key: "srilanka",
    title: "Sri Lanka",
    subtitle: "The Island Poem",
    story: "Traverse golden surf spray of Mirissa to deep emerald highlands of Ella. Ride local blue trains looping slowly above hills with absolute transparent local rates.",
    imageUrl: "/images/sri_lanka_coast_1782050601605.jpg",
    startingPrice: "$350",
    marketPrice: "$520",
    vibe: "Luxury",
    excitementLabel: "Salty Seas & Mountain Emeralds",
    experienceStory: "Sri Lanka is a tropical loop of absolute saltwater magic and endless emerald hills. We started on the coast of Mirissa, watching local fishing crafts carve through the golden surf spray. In the hot afternoon, we ate fresh Coconut Sambol with crispy Hopper bowls from a small wooden kitchen shack run by Nilupa. The true soul of the island revealed itself when we took the slow blue mountain train up to Ella. The tracks snake through tea estates where the afternoon fog blankets the hills. We hiked up Ella Rock at 4 AM, crawling through tall lemon-grass fields under a full copper moon. Big aggregators charge heavy premiums for luxury resort desks. We share the direct phone numbers of Nilupa and our favorite beach tuck-shop, so you pay exactly the local rates for a glorious tropical wander.",
    placesToSee: ["Ella Rock Lemon-Grass Peak", "Nine Arch Stone Train Viaduct", "Mirissa Secret Beach Surf", "Galle Fort Colonial Remnants"],
    foodToTry: ["Crispy Coconut Hoppers", "Pol Sambol (Fresh grated spiced coconut)", "Lankan Sour Fish Curry", "Toddy (Traditional palm nectar)"],
    treksAndTrails: ["Ella Rock Sunrise Scale", "Little Adam's Peak Ridge Walk", "Diyaluma Falls Cliff Scramble"],
    detailImages: [
      "/images/sri_lanka_coast_1782050601605.jpg"
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aarav Mehta",
    trip: "Leh Ladakh Solo",
    quote: "Standard travel operators quoted ₹32,000 with mass hotels. Desh shared his direct taxi receipt and homestay card. I spent ₹21,000, ate butter tea with locals, and felt like part of the family.",
    marketPrice: "₹32,000",
    vendorPrice: "₹21,000",
    savings: "₹11,000",
    avatarSeed: "aarav"
  },
  {
    name: "Riya Sen",
    trip: "Himachal Forest Stay",
    quote: "paying direct vendor pricing was an eye-opener. Homestay owner got every rupee of my stay, and earth.poetry's curation fee is so transparent. I saved ₹5,700 and got raw honest nature.",
    marketPrice: "₹18,200",
    vendorPrice: "₹12,500",
    savings: "₹5,700",
    avatarSeed: "riya"
  },
  {
    name: "Daniel Silva",
    trip: "Sri Lanka Wander",
    quote: "I am stunned. The absolute purity of knowing exactly what the Ella resort charged and having the co-op driver union breakdown. Honestly worth 10 times what they ask as an advisory fee.",
    marketPrice: "$520",
    vendorPrice: "$350",
    savings: "$170",
    avatarSeed: "daniel"
  }
];
