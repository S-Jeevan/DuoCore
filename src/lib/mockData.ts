// src/lib/mockData.ts

export const MOCK_MULTI_CITY_TRIP = {
  tripTitle: "The European Grand Tour",
  totalDuration: "9 Days",
  totalCost: "€1,850 / person",

  // 1. The Roadmap (Visual Chain)
  roadmap: [
    {
      type: "city",
      id: "paris",
      name: "Paris, France",
      days: 3,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      stats: { stay: "€400", food: "€200", activity: "€150" }
    },
    {
      type: "transport",
      mode: "High-Speed Train (Thalys)",
      duration: "3h 20m",
      cost: "€85",
      icon: "train"
    },
    {
      type: "city",
      id: "amsterdam",
      name: "Amsterdam, Netherlands",
      days: 2,
      image: "https://images.unsplash.com/photo-1512470876302-ac68773045ce?w=800",
      stats: { stay: "€250", food: "€150", activity: "€100" }
    },
    {
      type: "transport",
      mode: "Flight (Vueling)",
      duration: "2h 10m",
      cost: "€120",
      icon: "plane"
    },
    {
      type: "city",
      id: "barcelona",
      name: "Barcelona, Spain",
      days: 4,
      image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
      stats: { stay: "€500", food: "€300", activity: "€200" }
    }
  ],

  // 2. The Daily Details (Scrolls to these)
  dailyItinerary: {
    paris: [
      {
        day: 1,
        title: "Arrival & The Iron Lady",
        activities: [
          { time: "14:00", title: "Check-in Hotel", icon: "castle", cost: "N/A", description: "Drop bags at Montmartre View Hotel." },
          { time: "17:30", title: "Eiffel Tower Sunset", icon: "landmark", cost: "€25", description: "Skip-the-line tickets to 2nd floor." },
          { time: "20:00", title: "Dinner at Le Relais", icon: "utensils", cost: "€40", description: "Famous steak frites." }
        ]
      },
      {
        day: 2,
        title: "Art & History",
        activities: [
          { time: "09:00", title: "Louvre Museum", icon: "palette", cost: "€17", description: "See Mona Lisa early." },
          { time: "13:00", title: "Lunch in Marais", icon: "utensils", cost: "€25", description: "Best Falafel in town." }
        ]
      },
      {
        day: 3,
        title: "Versailles Day Trip",
        activities: [
          { time: "10:00", title: "Palace of Versailles", icon: "castle", cost: "€30", description: "Hall of Mirrors tour." }
        ]
      }
    ],
    amsterdam: [
      {
        day: 1,
        title: "Canals & Culture",
        activities: [
          { time: "11:00", title: "Canal Cruise", icon: "ship", cost: "€20", description: "1-hour boat tour with cheese tasting." },
          { time: "15:00", title: "Van Gogh Museum", icon: "palette", cost: "€22", description: "Pre-booked slot required." }
        ]
      },
      {
        day: 2,
        title: "Bikes & Parks",
        activities: [
          { time: "10:00", title: "Vondelpark Bike Ride", icon: "tree", cost: "€10", description: "Rent bikes near entrance." }
        ]
      }
    ],
    barcelona: [
      {
        day: 1,
        title: "Gaudi's Masterpieces",
        activities: [
          { time: "10:00", title: "Sagrada Familia", icon: "church", cost: "€26", description: "Tower access included." },
          { time: "14:00", title: "Park Güell", icon: "tree", cost: "€10", description: "Walk the monumental zone." }
        ]
      },
      {
        day: 2,
        title: "Gothic Quarter",
        activities: [
          { time: "16:00", title: "Walking Tour", icon: "footprints", cost: "Free", description: "Explore hidden alleys." }
        ]
      }
    ]
  }
};