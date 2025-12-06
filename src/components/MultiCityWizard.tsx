"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Calendar,
  ArrowDown,
  Plus,
  X,
  Users,
  Wallet,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Landmark,
  Coffee,
  UtensilsCrossed,
  Hotel,
  Home,
  Building2,
} from "lucide-react";

interface Destination {
  city: string;
  days: number;
}

interface TripData {
  destinations: Destination[];
  startDate: string;
  travelers: number;
  budget: number;
  vibes: string[];
  accommodation: string[];
}

interface MultiCityWizardProps {
  onGenerate: (data: TripData) => void;
}

const vibeOptions = [
  { id: "nightlife", label: "Nightlife", icon: PartyPopper },
  { id: "history", label: "History", icon: Landmark },
  { id: "relaxing", label: "Relaxing", icon: Coffee },
  { id: "foodie", label: "Foodie", icon: UtensilsCrossed },
];

const accommodationOptions = [
  { id: "hotel", label: "Hotel", icon: Hotel },
  { id: "hostel", label: "Hostel", icon: Building2 },
  { id: "airbnb", label: "Airbnb", icon: Home },
];

export default function MultiCityWizard({ onGenerate }: MultiCityWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  // Step 1 state
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [pendingCity, setPendingCity] = useState<string | null>(null);
  const [daysInput, setDaysInput] = useState("");
  const daysInputRef = useRef<HTMLInputElement>(null);

  // Step 2 state
  const [startDate, setStartDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState(50);

  // Step 3 state
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const totalDays = destinations.reduce((sum, d) => sum + d.days, 0);

  useEffect(() => {
    if (pendingCity && daysInputRef.current) {
      daysInputRef.current.focus();
    }
  }, [pendingCity]);

  const handleCityKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && cityInput.trim()) {
      e.preventDefault();
      setPendingCity(cityInput.trim());
      setCityInput("");
    }
  };

  const handleDaysKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && pendingCity && daysInput) {
      e.preventDefault();
      const days = parseInt(daysInput, 10);
      if (days > 0) {
        setDestinations([...destinations, { city: pendingCity, days }]);
        setPendingCity(null);
        setDaysInput("");
      }
    }
    if (e.key === "Escape") {
      setPendingCity(null);
      setDaysInput("");
    }
  };

  const handleDaysConfirm = () => {
    if (pendingCity && daysInput) {
      const days = parseInt(daysInput, 10);
      if (days > 0) {
        setDestinations([...destinations, { city: pendingCity, days }]);
        setPendingCity(null);
        setDaysInput("");
      }
    }
  };

  const removeDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const toggleVibe = (id: string) => {
    setSelectedVibes((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleAccommodation = (id: string) => {
    setSelectedAccommodation((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    onGenerate({
      destinations,
      startDate,
      travelers,
      budget,
      vibes: selectedVibes,
      accommodation: selectedAccommodation,
    });
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const canProceed = () => {
    if (currentStep === 1) return destinations.length > 0;
    if (currentStep === 2) return startDate !== "";
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-xl border border-white/30 overflow-hidden">
        {/* Progress Steps */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    step === currentStep
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : step < currentStep
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-all duration-300 ${
                      step < currentStep ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 px-1">
            <span>Route</span>
            <span>Details</span>
            <span>Preferences</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 pb-6 min-h-[380px] relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {/* Step 1: Build the Route */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Map className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Build Your Route</h2>
                </div>

                {/* City Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    onKeyDown={handleCityKeyDown}
                    placeholder="Add a destination..."
                    disabled={pendingCity !== null}
                    className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-50"
                  />
                  <Plus className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>

                {/* Days Popover */}
                <AnimatePresence>
                  {pendingCity && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-xl"
                    >
                      <p className="text-sm text-blue-800 font-medium mb-2">
                        How many days in <span className="font-bold">{pendingCity}</span>?
                      </p>
                      <div className="flex gap-2">
                        <input
                          ref={daysInputRef}
                          type="number"
                          min="1"
                          value={daysInput}
                          onChange={(e) => setDaysInput(e.target.value)}
                          onKeyDown={handleDaysKeyDown}
                          placeholder="Days"
                          className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                        />
                        <button
                          onClick={handleDaysConfirm}
                          disabled={!daysInput || parseInt(daysInput, 10) <= 0}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setPendingCity(null);
                            setDaysInput("");
                          }}
                          className="px-3 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Route Chain */}
                {destinations.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3">
                      Your Route
                    </p>
                    <div className="space-y-0">
                      {destinations.map((dest, index) => (
                        <div key={index}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-3 bg-white/70 border border-slate-200 rounded-xl group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{dest.city}</p>
                                <p className="text-xs text-slate-500">{dest.days} day{dest.days > 1 ? "s" : ""}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeDestination(index)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                          {index < destinations.length - 1 && (
                            <div className="flex justify-center py-1">
                              <ArrowDown className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Duration */}
                {destinations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                  >
                    <span className="text-sm font-medium text-blue-800">Total Trip Duration</span>
                    <span className="text-lg font-bold text-blue-600">
                      {totalDays} day{totalDays !== 1 ? "s" : ""}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Trip Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Trip Details</h2>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    When do you start?
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
                  />
                </div>

                {/* Travelers */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Users className="w-4 h-4 text-blue-600" />
                    Number of Travelers
                  </label>
                  <div className="flex items-center justify-between bg-white/60 border border-slate-200 rounded-xl px-4 py-3">
                    <span className="text-slate-600">How many people?</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        disabled={travelers <= 1}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-lg font-bold text-slate-900">
                        {travelers}
                      </span>
                      <button
                        onClick={() => setTravelers(travelers + 1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Budget Slider */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    Daily Budget per Person
                  </label>
                  <div className="bg-white/60 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Budget</span>
                      <span className="text-lg font-bold text-blue-600">${budget}/day</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="500"
                      step="10"
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>$20</span>
                      <span>$500</span>
                    </div>
                  </div>
                </div>

                {/* Trip Summary */}
                <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-500 mb-2">Trip Summary</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Estimated total budget:</span>
                    <span className="font-bold text-slate-900">
                      ${budget * totalDays * travelers}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Your Preferences</h2>
                </div>

                {/* Vibes */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">
                    What vibe are you looking for?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {vibeOptions.map((vibe) => {
                      const Icon = vibe.icon;
                      const isSelected = selectedVibes.includes(vibe.id);
                      return (
                        <button
                          key={vibe.id}
                          onClick={() => toggleVibe(vibe.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "bg-white/60 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{vibe.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accommodation */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">
                    Accommodation Style?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {accommodationOptions.map((acc) => {
                      const Icon = acc.icon;
                      const isSelected = selectedAccommodation.includes(acc.id);
                      return (
                        <button
                          key={acc.id}
                          onClick={() => toggleAccommodation(acc.id)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20"
                              : "bg-white/60 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium text-xs">{acc.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Final Summary */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl space-y-2">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                    Ready to Generate
                  </p>
                  <div className="text-sm text-slate-700 space-y-1">
                    <p>
                      <span className="font-medium">{destinations.length} cities</span> over{" "}
                      <span className="font-medium">{totalDays} days</span>
                    </p>
                    <p>
                      <span className="font-medium">{travelers} traveler{travelers > 1 ? "s" : ""}</span>
                      {" · "}
                      <span className="font-medium">${budget}/day budget</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          {currentStep > 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={prevStep}
              className="flex items-center justify-center gap-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </motion.button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg shadow-blue-600/20 transition-colors"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <motion.button
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={handleGenerate}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-600 disabled:to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Planning your adventure...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Itinerary
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

