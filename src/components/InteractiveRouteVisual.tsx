import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  ArrowRightLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Navigation, 
  Compass, 
  Zap, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ROUTE_LOCATIONS, RouteLocation } from '../data/locations';

interface InteractiveRouteVisualProps {
  onSelectLocation?: (fromId: string, toId: string) => void;
}

export const InteractiveRouteVisual: React.FC<InteractiveRouteVisualProps> = ({ onSelectLocation }) => {
  const [direction, setDirection] = useState<'jalna-to-mantha' | 'mantha-to-jalna'>('jalna-to-mantha');
  const [selectedHub, setSelectedHub] = useState<string>('jalna');

  const isJalnaOrigin = direction === 'jalna-to-mantha';
  const activeLocation = ROUTE_LOCATIONS.find(l => l.id === selectedHub) || ROUTE_LOCATIONS[0];

  return (
    <div className="relative w-full rounded-3xl bg-white border border-slate-200/90 shadow-xl p-5 sm:p-7 overflow-hidden blueprint-grid" id="interactive-route-card">
      
      {/* Top Architectural Badge & Direction Toggle */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0038BD] bg-[#0038BD]/10 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
              <Navigation className="w-3 h-3 text-[#0038BD]" />
              CORRIDOR NH-752I &amp; SH-176
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#EF8E01]" />
              65 KM REGIONAL EXPRESS
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1.5 flex items-center gap-2">
            <span>{isJalnaOrigin ? 'Jalna City ➔ Watur ➔ Partur ➔ Mantha' : 'Mantha ➔ Partur ➔ Watur ➔ Jalna City'}</span>
          </h3>
        </div>

        <button
          onClick={() => setDirection(isJalnaOrigin ? 'mantha-to-jalna' : 'jalna-to-mantha')}
          id="toggle-route-direction-btn"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#0038BD] hover:text-white rounded-xl transition-all border border-slate-200 shadow-2xs active:scale-95 shrink-0"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Switch Direction</span>
        </button>
      </div>

      {/* Visual Route Corridor Track with 4 Major Hub Pillars */}
      <div className="relative z-10 my-3 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80">
        
        {/* Geographic Coordinates & Corridor Status Header */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-4 uppercase tracking-wider">
          <span>LAT 19.8347° N (Jalna)</span>
          <span className="text-[#0038BD] font-bold">15 PICKUP &amp; DELIVERY HUBS</span>
          <span>LAT 19.5312° N (Mantha)</span>
        </div>

        {/* Node Waypoints Bar (Jalna -> Watur -> Partur -> Mantha) */}
        <div className="grid grid-cols-4 gap-2 text-center relative py-2">
          {/* Track Line behind */}
          <div className="absolute top-7 left-8 right-8 h-1 bg-gradient-to-r from-[#0038BD] via-[#EF8E01] to-[#0038BD] rounded-full -z-0 opacity-70" />

          {/* 1. Jalna */}
          <div 
            className="flex flex-col items-center cursor-pointer relative z-10 group"
            onClick={() => setSelectedHub('jalna')}
          >
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
              selectedHub === 'jalna' ? 'bg-[#0038BD] text-white ring-4 ring-blue-500/20 scale-105' : 'bg-white text-slate-700 border border-slate-300 shadow-2xs'
            }`}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900 mt-1.5">Jalna</span>
            <span className="text-[10px] text-slate-500 font-bold">Origin (0 km)</span>
          </div>

          {/* 2. Watur Phata */}
          <div 
            className="flex flex-col items-center cursor-pointer relative z-10 group"
            onClick={() => setSelectedHub('watur-phata')}
          >
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
              selectedHub === 'watur-phata' ? 'bg-slate-900 text-[#EF8E01] ring-4 ring-amber-500/20 scale-105' : 'bg-white text-slate-700 border border-slate-300 shadow-2xs'
            }`}>
              <Navigation className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900 mt-1.5">Watur</span>
            <span className="text-[10px] text-slate-500 font-bold">Junction (38 km)</span>
          </div>

          {/* 3. Partur */}
          <div 
            className="flex flex-col items-center cursor-pointer relative z-10 group"
            onClick={() => setSelectedHub('partur')}
          >
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
              selectedHub === 'partur' ? 'bg-[#EF8E01] text-white ring-4 ring-orange-500/20 scale-105' : 'bg-white text-slate-700 border border-slate-300 shadow-2xs'
            }`}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900 mt-1.5">Partur</span>
            <span className="text-[10px] text-slate-500 font-bold">Taluka (50 km)</span>
          </div>

          {/* 4. Mantha */}
          <div 
            className="flex flex-col items-center cursor-pointer relative z-10 group"
            onClick={() => setSelectedHub('mantha')}
          >
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
              selectedHub === 'mantha' ? 'bg-[#0038BD] text-white ring-4 ring-blue-500/20 scale-105' : 'bg-white text-slate-700 border border-slate-300 shadow-2xs'
            }`}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-slate-900 mt-1.5">Mantha</span>
            <span className="text-[10px] text-slate-500 font-bold">Terminus (65 km)</span>
          </div>
        </div>

        {/* Selected Hub Highlights */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              <strong>Selected:</strong> {activeLocation.name} ({activeLocation.marathiName}) • PIN: {activeLocation.pincode} • Taluka: {activeLocation.taluka}
            </span>
          </div>
          {onSelectLocation && (
            <button
              onClick={() => onSelectLocation(activeLocation.id, activeLocation.id === 'jalna' ? 'mantha' : 'jalna')}
              className="text-[11px] font-bold text-[#0038BD] hover:text-[#EF8E01] flex items-center gap-1"
            >
              <span>Book from {activeLocation.name}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Daily Runs Quick Schedule Ribbon */}
      <div className="relative z-10 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-100 text-[#0038BD] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900">Run 1: Morning Run</span>
              <span className="text-[10px] font-bold text-[#0038BD] bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">10:30 AM</span>
            </div>
            <p className="text-slate-500 mt-0.5">Jalna ➔ Watur ➔ Partur ➔ Mantha</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-orange-100 text-[#EF8E01] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900">Run 2: Afternoon Run</span>
              <span className="text-[10px] font-bold text-[#EF8E01] bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">03:30 PM</span>
            </div>
            <p className="text-slate-500 mt-0.5">Jalna ➔ Watur ➔ Partur ➔ Mantha</p>
          </div>
        </div>
      </div>

      {/* Trust Handover Guarantee Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-[#0038BD]/5 rounded-xl px-3.5 py-2 border border-[#0038BD]/10">
        <div className="flex items-center gap-1.5 text-[#0038BD] font-semibold text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0038BD]" />
          <span>Doorstep Courier Service across All 15 Route Stops</span>
        </div>
        <span className="text-[10px] font-bold text-slate-800">Zero Advance • Pay on Delivery</span>
      </div>

    </div>
  );
};
