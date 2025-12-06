import { Plane, Train, Bus, Car, ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface TransportConnectorProps {
  mode: string; // "Flight", "Train", "Bus", "Car"
  duration: string;
  cost: string;
  isVertical?: boolean; // To switch between desktop/mobile layouts
}

export default function TransportConnector({ mode, duration, cost, isVertical = false }: TransportConnectorProps) {
  
  // 1. Dynamic Icon Selection
  const getIcon = () => {
    switch (mode.toLowerCase()) {
      case "flight": return <Plane className="w-4 h-4 text-blue-600" />;
      case "train": return <Train className="w-4 h-4 text-emerald-600" />;
      case "bus": return <Bus className="w-4 h-4 text-amber-600" />;
      default: return <Car className="w-4 h-4 text-slate-600" />;
    }
  };

  // 2. The Layout Logic
  return (
    <div className={`flex items-center justify-center ${isVertical ? "flex-col h-24" : "flex-row w-full px-4"}`}>
      
      {/* First half of the dashed line */}
      <div className={`border-slate-300 border-dashed ${isVertical ? "h-full border-l-2" : "w-full border-t-2"}`}></div>
      
      {/* The Transport Badge (Floating in the middle) */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center min-w-[120px] mx-2 z-10"
      >
        <div className="bg-white p-2 rounded-full shadow-sm border border-slate-200 mb-1">
          {getIcon()}
        </div>
        
        {/* Details Pill */}
        <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-600 whitespace-nowrap flex gap-2">
          <span>{duration}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-900">{cost}</span>
        </div>
      </motion.div>

      {/* Second half of the dashed line (with arrow) */}
      <div className={`border-slate-300 border-dashed relative ${isVertical ? "h-full border-l-2" : "w-full border-t-2"}`}>
        {/* The Arrow Head */}
        <div className={`absolute ${isVertical ? "bottom-0 -left-[5px]" : "right-0 -top-[7px]"} text-slate-300`}>
          {isVertical ? <ArrowDown size={14} /> : <ArrowRight size={14} />}
        </div>
      </div>

    </div>
  );
}