"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Map,
  CalendarDays,
  Train,
  Plane,
  Clock,
  Wallet,
  ChevronRight,
  Landmark,
  UtensilsCrossed,
  Palette,
  Ship,
  Church,
  Footprints,
  TreePine,
  Castle,
  Mountain,
  Sparkles,
  Car,
  Umbrella,
  MapPin,
} from "lucide-react";
import { MOCK_MULTI_CITY_TRIP } from "@/lib/mockData";

type TabType = "roadmap" | "daily";

// Type definitions for roadmap items
interface CityItem {
  type: "city";
  id: string;
  name: string;
  days: number;
  image: string;
  stats: { stay: string; food: string; activity: string };
}

interface TransportItem {
  type: "transport";
  mode: string;
  duration: string;
  cost: string;
  icon: string;
}

type RoadmapItem = CityItem | TransportItem;

const iconMap: Record<string, React.ElementType> = {
  landmark: Landmark,
  utensils: UtensilsCrossed,
  palette: Palette,
  ship: Ship,
  church: Church,
  footprints: Footprints,
  tree: TreePine,
  castle: Castle,
  train: Train,
  mountain: Mountain,
  sparkles: Sparkles,
  car: Car,
  umbrella: Umbrella,
};

// Type guard functions
function isCity(item: RoadmapItem): item is CityItem {
  return item.type === "city";
}

function isTransport(item: RoadmapItem): item is TransportItem {
  return item.type === "transport";
}

export default function ItineraryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("roadmap");
  const cityRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { tripTitle, totalDuration, totalCost, roadmap, dailyItinerary } = MOCK_MULTI_CITY_TRIP;

  const typedRoadmap = roadmap as RoadmapItem[];
  const cities = typedRoadmap.filter(isCity);

  const scrollToCity = (cityId: string) => {
    setActiveTab("daily");
    setTimeout(() => {
      cityRefs.current[cityId]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const getEstimatedBudget = (stats: { stay: string; food: string; activity: string }) => {
    const parseEuro = (s: string) => parseInt(s.replace("€", "").replace(",", ""), 10) || 0;
    return parseEuro(stats.stay) + parseEuro(stats.food) + parseEuro(stats.activity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Decorative Grid Background */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-6 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              {tripTitle}
            </h1>
            <div className="flex items-center justify-center gap-4 text-slate-300">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" />
                {totalDuration}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                {totalCost}
              </span>
            </div>
          </motion.div>

          {/* Tab Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="inline-flex p-1.5 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab("roadmap")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "roadmap"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Map className="w-4 h-4" />
                Overview (Roadmap)
              </button>
              <button
                onClick={() => setActiveTab("daily")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "daily"
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Daily Itinerary
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-6 pb-16">
        {activeTab === "roadmap" ? (
          <RoadmapView roadmap={typedRoadmap} onCityClick={scrollToCity} getEstimatedBudget={getEstimatedBudget} />
        ) : (
          <DailyView cities={cities} dailyItinerary={dailyItinerary} cityRefs={cityRefs} />
        )}
      </main>
    </div>
  );
}

// ============================================
// ROADMAP VIEW
// ============================================

interface RoadmapViewProps {
  roadmap: RoadmapItem[];
  onCityClick: (cityId: string) => void;
  getEstimatedBudget: (stats: { stay: string; food: string; activity: string }) => number;
}

function RoadmapView({ roadmap, onCityClick, getEstimatedBudget }: RoadmapViewProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Desktop: Horizontal Timeline */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative pt-8"
        >
          {/* Animated Path Background */}
          <svg
            className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 overflow-visible"
            style={{ top: "180px" }}
          >
            <motion.path
              d={`M 50 10 ${roadmap.map((_, i) => `L ${50 + i * 280} 10`).join(" ")}`}
              stroke="url(#roadGradient)"
              strokeWidth="4"
              strokeDasharray="12 8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Roadmap Items */}
          <div className="flex items-start justify-center gap-0">
            {roadmap.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
              >
                {isCity(item) ? (
                  <CityCard
                    city={item}
                    onClick={() => onCityClick(item.id)}
                    estimatedBudget={getEstimatedBudget(item.stats)}
                    index={index}
                  />
                ) : (
                  <TransportConnector transport={item} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="lg:hidden">
        <div className="relative">
          {/* Animated Vertical Line */}
          <motion.div
            className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ originY: 0 }}
          />

          <div className="space-y-6 pl-16">
            {roadmap.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                {/* Node on timeline */}
                <motion.div
                  className={`absolute -left-16 top-4 w-12 h-12 rounded-full flex items-center justify-center ${
                    isCity(item)
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
                      : "bg-slate-700 border-2 border-slate-600"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  {isCity(item) ? (
                    <MapPin className="w-5 h-5 text-white" />
                  ) : isTransport(item) && item.icon === "train" ? (
                    <Train className="w-5 h-5 text-slate-300" />
                  ) : (
                    <Plane className="w-5 h-5 text-slate-300" />
                  )}
                </motion.div>

                {isCity(item) ? (
                  <MobileCityCard
                    city={item}
                    onClick={() => onCityClick(item.id)}
                    estimatedBudget={getEstimatedBudget(item.stats)}
                  />
                ) : (
                  <MobileTransportCard transport={item} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-12 flex justify-center"
      >
        <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 text-sm text-slate-400">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            Click a city to view details
          </span>
          <span className="flex items-center gap-2">
            <Train className="w-4 h-4 text-slate-400" />
            Transportation
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// City Card (Desktop)
interface CityCardProps {
  city: CityItem;
  onClick: () => void;
  estimatedBudget: number;
  index: number;
}

function CityCard({ city, onClick, estimatedBudget }: CityCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="group relative w-64 text-left"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Days Badge */}
          <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-900">
            {city.days} Days
          </div>

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {city.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Wallet className="w-4 h-4" />
              <span className="text-sm">€{estimatedBudget}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              View details
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Floating Marker */}
        <motion.div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-slate-900 shadow-lg"
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </div>
    </motion.button>
  );
}

// Transport Connector (Desktop)
interface TransportConnectorProps {
  transport: TransportItem;
}

function TransportConnector({ transport }: TransportConnectorProps) {
  const Icon = transport.icon === "train" ? Train : Plane;

  return (
    <div className="flex flex-col items-center justify-center w-32 pt-24">
      {/* Transport Info Bubble */}
      <motion.div
        className="relative px-4 py-3 bg-slate-800/80 backdrop-blur-lg rounded-xl border border-slate-700 text-center mb-4"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium text-white">{transport.cost}</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
          <Clock className="w-3 h-3" />
          {transport.duration}
        </div>

        {/* Connector dots */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-600" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-600" />
      </motion.div>

      {/* Dashed Line */}
      <motion.div
        className="w-full h-0.5 border-t-2 border-dashed border-slate-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
    </div>
  );
}

// Mobile City Card
interface MobileCityCardProps {
  city: CityItem;
  onClick: () => void;
  estimatedBudget: number;
}

function MobileCityCard({ city, onClick, estimatedBudget }: MobileCityCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left group"
    >
      <div className="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        <div className="relative h-32 overflow-hidden">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-900">
            {city.days} Days
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1">{city.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />€{estimatedBudget}
            </span>
            <span className="text-blue-400 text-sm font-medium flex items-center gap-1">
              View <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// Mobile Transport Card
interface MobileTransportCardProps {
  transport: TransportItem;
}

function MobileTransportCard({ transport }: MobileTransportCardProps) {
  const Icon = transport.icon === "train" ? Train : Plane;

  return (
    <div className="py-2">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700">
        <Icon className="w-5 h-5 text-blue-400" />
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{transport.mode}</p>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {transport.duration}
            </span>
            <span>•</span>
            <span>{transport.cost}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DAILY ITINERARY VIEW
// ============================================

interface DailyViewProps {
  cities: CityItem[];
  dailyItinerary: typeof MOCK_MULTI_CITY_TRIP.dailyItinerary;
  cityRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

function DailyView({ cities, dailyItinerary, cityRefs }: DailyViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {cities.map((city, cityIndex) => {
        const cityDays = dailyItinerary[city.id as keyof typeof dailyItinerary] || [];
        return (
          <motion.div
            key={city.id}
            ref={(el) => { cityRefs.current[city.id] = el; }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: cityIndex * 0.1 }}
          >
            {/* City Header */}
            <div className="relative overflow-hidden rounded-2xl mb-6">
              <div className="h-48 relative">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{city.name}</h2>
                  <div className="flex items-center gap-4 text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" />
                      {city.days} Days
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" />
                      {city.stats.stay} + {city.stats.food} + {city.stats.activity}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Days */}
            <div className="space-y-6">
              {cityDays.map((day, dayIndex) => (
                <motion.div
                  key={dayIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + dayIndex * 0.1 }}
                  className="relative"
                >
                  {/* Day Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                      D{day.day}
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Day {day.day}</p>
                      <h3 className="text-xl font-bold text-white">{day.title}</h3>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="ml-6 border-l-2 border-slate-700 pl-6 space-y-4">
                    {day.activities.map((activity, actIndex) => {
                      const ActivityIcon = iconMap[activity.icon] || Landmark;
                      return (
                        <motion.div
                          key={actIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + actIndex * 0.05 }}
                          className="relative group"
                        >
                          {/* Timeline Dot */}
                          <div className="absolute -left-[31px] top-3 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-600 group-hover:bg-blue-500 group-hover:border-blue-400 transition-colors" />
                          
                          <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                                <ActivityIcon className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4 mb-1">
                                  <h4 className="font-semibold text-white truncate">
                                    {activity.title}
                                  </h4>
                                  <span className="text-sm font-medium text-emerald-400 shrink-0">
                                    {activity.cost}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-400 mb-2">
                                  {activity.description}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <Clock className="w-3 h-3" />
                                  {activity.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

