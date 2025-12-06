"use client";

import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Wallet, Users, X, Loader2, Sparkles, Minus, Plus } from "lucide-react";

interface TripInputCardProps {
  onGenerate: () => void;
}

type BudgetOption = "Cheap" | "Moderate" | "Luxury";

export default function TripInputCard({ onGenerate }: TripInputCardProps) {
  const [destinations, setDestinations] = useState<string[]>([]);
  const [destinationInput, setDestinationInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState<BudgetOption>("Moderate");
  const [travelers, setTravelers] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && destinationInput.trim()) {
      e.preventDefault();
      if (!destinations.includes(destinationInput.trim())) {
        setDestinations([...destinations, destinationInput.trim()]);
      }
      setDestinationInput("");
    }
  };

  const removeDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    onGenerate();
  };

  const budgetOptions: BudgetOption[] = ["Cheap", "Moderate", "Luxury"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <div className="backdrop-blur-xl bg-white/70 rounded-xl shadow-lg border border-white/20 p-6 space-y-6">
        {/* Destination Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <MapPin className="w-4 h-4 text-blue-600" />
            Destinations
          </label>
          <div className="relative">
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a destination and press Enter"
              className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            />
          </div>
          <AnimatePresence>
            {destinations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 pt-2"
              >
                {destinations.map((dest, index) => (
                  <motion.span
                    key={dest}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full"
                  >
                    {dest}
                    <button
                      onClick={() => removeDestination(index)}
                      className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date Picker Row */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <Calendar className="w-4 h-4 text-blue-600" />
            Travel Dates
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none hidden">
                Start Date
              </span>
            </div>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Budget Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <Wallet className="w-4 h-4 text-blue-600" />
            Budget
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/80 rounded-lg">
            {budgetOptions.map((option) => (
              <button
                key={option}
                onClick={() => setBudget(option)}
                className={`py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  budget === option
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Travelers Counter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-900">
            <Users className="w-4 h-4 text-blue-600" />
            Travelers
          </label>
          <div className="flex items-center justify-between bg-white/50 border border-slate-200 rounded-lg px-4 py-2">
            <span className="text-slate-600 text-sm">Number of travelers</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                disabled={travelers <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-lg font-semibold text-slate-900">
                {travelers}
              </span>
              <button
                onClick={() => setTravelers(travelers + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          onClick={handleGenerate}
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.01 }}
          whileTap={{ scale: isLoading ? 1 : 0.99 }}
          className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600 text-white font-medium rounded-lg shadow-md shadow-blue-600/20 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Planning your trip...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Itinerary
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

