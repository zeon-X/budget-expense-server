export const categories = [
  // ========== TOP RANKED (Food & Travel first) ==========
  {
    name: "Food & Dining",
    slug: "food-dining",
    icon: "restaurant",
    sortOrder: 1,
    children: [
      {
        name: "Restaurants",
        slug: "restaurants",
        icon: "restaurant-menu",
        sortOrder: 3,
      },
      {
        name: "Groceries",
        slug: "groceries",
        icon: "shopping-cart",
        sortOrder: 4,
      },
      { name: "Fast Food", slug: "fast-food", icon: "fastfood", sortOrder: 5 },
      {
        name: "Food Delivery",
        slug: "food-delivery",
        icon: "delivery-dining",
        sortOrder: 6,
      },
      {
        name: "Cafes & Bakeries",
        slug: "cafes-bakeries",
        icon: "local-cafe",
        sortOrder: 7,
      },
      {
        name: "Office Canteen",
        slug: "office-canteen",
        icon: "lunch-dining",
        sortOrder: 8,
      },
      { name: "Meal Kits", slug: "meal-kits", icon: "kitchen", sortOrder: 9 },
    ],
  },
  {
    name: "Travel",
    slug: "travel",
    icon: "flight",
    sortOrder: 2,
    children: [
      {
        name: "Flights",
        slug: "flights",
        icon: "flight-takeoff",
        sortOrder: 10,
      },
      { name: "Hotels", slug: "hotels", icon: "hotel", sortOrder: 11 },
      { name: "Trains", slug: "trains", icon: "train", sortOrder: 12 },
      { name: "Buses", slug: "buses", icon: "directions-bus", sortOrder: 13 },
      {
        name: "Vacation Rentals",
        slug: "vacation-rentals",
        icon: "beach-access",
        sortOrder: 14,
      },
      {
        name: "Car Rentals",
        slug: "car-rentals",
        icon: "car-rental",
        sortOrder: 15,
      },
      {
        name: "Road Trips",
        slug: "road-trips",
        icon: "rv-hookup",
        sortOrder: 16,
      },
      {
        name: "Travel Insurance",
        slug: "travel-insurance",
        icon: "travel-explore",
        sortOrder: 17,
      },
    ],
  },

  // ========== TRANSPORTATION ==========
  {
    name: "Transportation",
    slug: "transportation",
    icon: "directions-car",
    sortOrder: 18,
    children: [
      { name: "Fuel", slug: "fuel", icon: "local-gas-station", sortOrder: 19 },
      {
        name: "Public Transit",
        slug: "public-transit",
        icon: "directions-bus",
        sortOrder: 20,
      },
      {
        name: "Auto / Taxi",
        slug: "auto-taxi",
        icon: "local-taxi",
        sortOrder: 21,
      },
      {
        name: "Parking & Tolls",
        slug: "parking-tolls",
        icon: "local-parking",
        sortOrder: 22,
      },
      {
        name: "Vehicle Maintenance",
        slug: "vehicle-maintenance",
        icon: "car-repair",
        sortOrder: 23,
      },
      {
        name: "Vehicle Insurance",
        slug: "vehicle-insurance",
        icon: "car-crash",
        sortOrder: 24,
      },
      {
        name: "Car Wash",
        slug: "car-wash",
        icon: "local-car-wash",
        sortOrder: 25,
      },
      {
        name: "Bicycle Maintenance",
        slug: "bicycle-maintenance",
        icon: "pedal-bike",
        sortOrder: 26,
      },
    ],
  },

  // ========== HOUSING ==========
  {
    name: "Housing",
    slug: "housing",
    icon: "home",
    sortOrder: 27,
    children: [
      { name: "Rent", slug: "rent", icon: "other-houses", sortOrder: 28 },
      { name: "Mortgage", slug: "mortgage", icon: "house", sortOrder: 29 },
      { name: "Electricity", slug: "electricity", icon: "bolt", sortOrder: 30 },
      { name: "Water", slug: "water", icon: "water-drop", sortOrder: 31 },
      { name: "Gas (LPG)", slug: "gas", icon: "fireplace", sortOrder: 32 },
      { name: "Internet", slug: "internet", icon: "wifi", sortOrder: 33 },
      { name: "Cable TV", slug: "cable-tv", icon: "tv", sortOrder: 34 },
      {
        name: "Maintenance Fees",
        slug: "maintenance-fees",
        icon: "apartment",
        sortOrder: 35,
      },
      {
        name: "Property Tax",
        slug: "property-tax",
        icon: "receipt",
        sortOrder: 36,
      },
      {
        name: "Home Insurance",
        slug: "home-insurance",
        icon: "home",
        sortOrder: 37,
      },
      { name: "Repairs", slug: "repairs", icon: "construction", sortOrder: 38 },
    ],
  },

  // ========== SHOPPING ==========
  {
    name: "Shopping",
    slug: "shopping",
    icon: "shopping-bag",
    sortOrder: 39,
    children: [
      { name: "Clothing", slug: "clothing", icon: "checkroom", sortOrder: 40 },
      { name: "Footwear", slug: "footwear", icon: "steps", sortOrder: 41 },
      {
        name: "Electronics",
        slug: "electronics",
        icon: "devices",
        sortOrder: 42,
      },
      {
        name: "Online Shopping",
        slug: "online-shopping",
        icon: "shopping-bag",
        sortOrder: 43,
      },
      { name: "Jewelry", slug: "jewelry", icon: "diamond", sortOrder: 44 },
      {
        name: "Home Furniture",
        slug: "home-furniture",
        icon: "chair",
        sortOrder: 45,
      },
      {
        name: "Kitchenware",
        slug: "kitchenware",
        icon: "kitchen",
        sortOrder: 46,
      },
      { name: "Books", slug: "books", icon: "library-books", sortOrder: 47 },
    ],
  },

  // ========== HEALTH & WELLNESS ==========
  {
    name: "Health & Wellness",
    slug: "health-wellness",
    icon: "health-and-safety",
    sortOrder: 48,
    children: [
      {
        name: "Doctor Consultation",
        slug: "doctor-consultation",
        icon: "healing",
        sortOrder: 49,
      },
      { name: "Pharmacy", slug: "pharmacy", icon: "medication", sortOrder: 50 },
      {
        name: "Health Insurance",
        slug: "health-insurance",
        icon: "shield",
        sortOrder: 51,
      },
      {
        name: "Gym / Fitness",
        slug: "gym-fitness",
        icon: "fitness-center",
        sortOrder: 52,
      },
      { name: "Dental", slug: "dental", icon: "dentistry", sortOrder: 53 },
      {
        name: "Medical Tests",
        slug: "medical-tests",
        icon: "science",
        sortOrder: 54,
      },
      {
        name: "Yoga & Meditation",
        slug: "yoga-meditation",
        icon: "spa",
        sortOrder: 55,
      },
      {
        name: "Alternative Therapies",
        slug: "alternative-therapies",
        icon: "healing",
        sortOrder: 56,
      },
      {
        name: "Vision Care",
        slug: "vision-care",
        icon: "visibility",
        sortOrder: 57,
      },
    ],
  },

  // ========== EDUCATION ==========
  {
    name: "Education",
    slug: "education",
    icon: "school",
    sortOrder: 58,
    children: [
      {
        name: "School Fees",
        slug: "school-fees",
        icon: "menu-book",
        sortOrder: 59,
      },
      {
        name: "College Fees",
        slug: "college-fees",
        icon: "cast-for-education",
        sortOrder: 60,
      },
      { name: "Tuition", slug: "tuition", icon: "history-edu", sortOrder: 61 },
      { name: "Coaching", slug: "coaching", icon: "quiz", sortOrder: 62 },
      {
        name: "Books & Supplies",
        slug: "books-supplies",
        icon: "library-books",
        sortOrder: 63,
      },
      {
        name: "Online Courses",
        slug: "online-courses",
        icon: "computer",
        sortOrder: 64,
      },
      { name: "Workshops", slug: "workshops", icon: "group", sortOrder: 65 },
      {
        name: "Educational Apps",
        slug: "educational-apps",
        icon: "app-settings-alt",
        sortOrder: 66,
      },
    ],
  },

  // ========== ENTERTAINMENT ==========
  {
    name: "Entertainment",
    slug: "entertainment",
    icon: "movie",
    sortOrder: 67,
    children: [
      {
        name: "OTT Subscriptions",
        slug: "ott-subscriptions",
        icon: "smart-display",
        sortOrder: 68,
      },
      {
        name: "Movies (Theatre)",
        slug: "movies-theatre",
        icon: "local-movies",
        sortOrder: 69,
      },
      { name: "Gaming", slug: "gaming", icon: "sports-esports", sortOrder: 70 },
      {
        name: "Music Streaming",
        slug: "music-streaming",
        icon: "music-note",
        sortOrder: 71,
      },
      { name: "Concerts", slug: "concerts", icon: "festival", sortOrder: 72 },
      {
        name: "Sports Events",
        slug: "sports-events",
        icon: "sports",
        sortOrder: 73,
      },
      {
        name: "Amusement Parks",
        slug: "amusement-parks",
        icon: "attractions",
        sortOrder: 74,
      },
      { name: "Hobbies", slug: "hobbies", icon: "brush", sortOrder: 75 },
    ],
  },

  // ========== COMMUNICATION ==========
  {
    name: "Communication",
    slug: "communication",
    icon: "wifi",
    sortOrder: 76,
    children: [
      {
        name: "Mobile Recharge",
        slug: "mobile-recharge",
        icon: "phone-android",
        sortOrder: 77,
      },
      { name: "Broadband", slug: "broadband", icon: "wifi", sortOrder: 78 },
      { name: "Landline", slug: "landline", icon: "phone", sortOrder: 79 },
      { name: "Postal Services", slug: "postal", icon: "mail", sortOrder: 80 },
    ],
  },

  // ========== FINANCIAL ==========
  {
    name: "Financial",
    slug: "financial",
    icon: "savings",
    sortOrder: 81,
    children: [
      {
        name: "SIP / Mutual Funds",
        slug: "sip-mutual-funds",
        icon: "trending-up",
        sortOrder: 82,
      },
      { name: "Stocks", slug: "stocks", icon: "show-chart", sortOrder: 83 },
      {
        name: "Loan EMI",
        slug: "loan-emi",
        icon: "credit-card",
        sortOrder: 84,
      },
      {
        name: "Fixed Deposits",
        slug: "fixed-deposits",
        icon: "account-balance",
        sortOrder: 85,
      },
      {
        name: "Credit Card Fees",
        slug: "credit-card-fees",
        icon: "payments",
        sortOrder: 86,
      },
      {
        name: "Bank Charges",
        slug: "bank-charges",
        icon: "account-balance",
        sortOrder: 87,
      },
      {
        name: "Remittances",
        slug: "remittances",
        icon: "send-money",
        sortOrder: 88,
      },
      {
        name: "Cryptocurrency",
        slug: "cryptocurrency",
        icon: "currency-bitcoin",
        sortOrder: 89,
      },
    ],
  },

  // ========== PERSONAL CARE ==========
  {
    name: "Personal Care",
    slug: "personal-care",
    icon: "favorite",
    sortOrder: 90,
    children: [
      {
        name: "Haircut / Salon",
        slug: "haircut-salon",
        icon: "cut",
        sortOrder: 91,
      },
      {
        name: "Spa / Massage",
        slug: "spa-massage",
        icon: "spa",
        sortOrder: 92,
      },
      {
        name: "Laundry",
        slug: "laundry",
        icon: "local-laundry-service",
        sortOrder: 93,
      },
      {
        name: "Beauty Products",
        slug: "beauty-products",
        icon: "makeup",
        sortOrder: 94,
      },
      {
        name: "Personal Grooming",
        slug: "personal-grooming",
        icon: "face",
        sortOrder: 95,
      },
      { name: "Tailor", slug: "tailor", icon: "dry-cleaning", sortOrder: 96 },
      {
        name: "Shoe Repair",
        slug: "shoe-repair",
        icon: "cleaning-services",
        sortOrder: 97,
      },
    ],
  },

  // ========== BUSINESS & PROFESSIONAL ==========
  {
    name: "Business & Professional",
    slug: "business-professional",
    icon: "work",
    sortOrder: 98,
    children: [
      {
        name: "Office Supplies",
        slug: "office-supplies",
        icon: "inventory",
        sortOrder: 99,
      },
      {
        name: "Software Subscriptions",
        slug: "software-subscriptions",
        icon: "apps",
        sortOrder: 100,
      },
      {
        name: "Professional Development",
        slug: "professional-development",
        icon: "assignment",
        sortOrder: 101,
      },
      {
        name: "Marketing / Advertising",
        slug: "marketing-advertising",
        icon: "campaign",
        sortOrder: 102,
      },
      {
        name: "Business Travel",
        slug: "business-travel",
        icon: "flight",
        sortOrder: 103,
      },
      {
        name: "Client Entertainment",
        slug: "client-entertainment",
        icon: "people",
        sortOrder: 104,
      },
      { name: "Legal Fees", slug: "legal-fees", icon: "gavel", sortOrder: 105 },
      {
        name: "Accounting / Audit",
        slug: "accounting-audit",
        icon: "account-balance",
        sortOrder: 106,
      },
      {
        name: "Conference Fees",
        slug: "conference-fees",
        icon: "emoji-events",
        sortOrder: 107,
      },
    ],
  },

  // ========== LIFESTYLE & SOCIAL (includes smoking & drinking) ==========
  {
    name: "Lifestyle & Social",
    slug: "lifestyle-social",
    icon: "celebration",
    sortOrder: 108,
    children: [
      {
        name: "Alcohol & Bars",
        slug: "alcohol-bars",
        icon: "local-bar",
        sortOrder: 109,
      },
      {
        name: "Wine / Spirits",
        slug: "wine-spirits",
        icon: "wine-bar",
        sortOrder: 110,
      },
      {
        name: "Tobacco / Cigarettes",
        slug: "tobacco-cigarettes",
        icon: "smoke-free",
        sortOrder: 111,
      },
      {
        name: "Hookah / Vaping",
        slug: "hookah-vaping",
        icon: "smoking-rooms",
        sortOrder: 112,
      },
      {
        name: "Nightclubs",
        slug: "nightclubs",
        icon: "nightlife",
        sortOrder: 113,
      },
      {
        name: "Social Gatherings",
        slug: "social-gatherings",
        icon: "group",
        sortOrder: 114,
      },
      {
        name: "Dating Expenses",
        slug: "dating-expenses",
        icon: "favorite",
        sortOrder: 115,
      },
      { name: "Gifts", slug: "gifts", icon: "card-giftcard", sortOrder: 116 },
      {
        name: "Charitable Donations",
        slug: "charitable-donations",
        icon: "volunteer-activism",
        sortOrder: 117,
      },
      {
        name: "Membership Clubs",
        slug: "membership-clubs",
        icon: "vip",
        sortOrder: 118,
      },
    ],
  },

  // ========== MISCELLANEOUS (always last) ==========
  {
    name: "Miscellaneous",
    slug: "miscellaneous",
    icon: "more-horiz",
    sortOrder: 119,
    children: [
      {
        name: "Uncategorized",
        slug: "uncategorized",
        icon: "help-outline",
        sortOrder: 120,
      },
      {
        name: "Cash Withdrawals",
        slug: "cash-withdrawals",
        icon: "attach-money",
        sortOrder: 121,
      },
      {
        name: "Tax Payments",
        slug: "tax-payments",
        icon: "receipt-long",
        sortOrder: 122,
      },
      {
        name: "Fines / Penalties",
        slug: "fines-penalties",
        icon: "warning",
        sortOrder: 123,
      },
      { name: "Others", slug: "others", icon: "more-horiz", sortOrder: 124 },
    ],
  },
];
