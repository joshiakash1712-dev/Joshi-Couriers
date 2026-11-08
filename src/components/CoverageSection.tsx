import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Pill, 
  ShoppingBag, 
  Wrench, 
  Package, 
  ArrowRight, 
  ChevronRight
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { ROUTE_LOCATIONS, RouteLocation } from '../data/locations';

interface CoverageSectionProps {
  onOpenBooking: (fromId?: string, toId?: string) => void;
}

export const CoverageSection: React.FC<CoverageSectionProps> = ({ onOpenBooking }) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedLocation, setSelectedLocation] = useState<RouteLocation>(ROUTE_LOCATIONS[0]);
  const [filterTaluka, setFilterTaluka] = useState<'all' | 'Jalna' | 'Partur' | 'Mantha'>('all');

  const filteredLocations = filterTaluka === 'all' 
    ? ROUTE_LOCATIONS 
    : ROUTE_LOCATIONS.filter(l => l.taluka === filterTaluka);

  const parcelCategories = [
    { 
      icon: <Pill className="w-5 h-5 text-emerald-600" />, 
      label: 'Medicines & Medical Samples', 
      desc: 'Urgent prescriptions, lab diagnostic kits, tablets & hospital items',
      rate: 'From ₹50'
    },
    { 
      icon: <ShoppingBag className="w-5 h-5 text-[#EF8E01]" />, 
      label: 'Retail & Wholesale Bundles', 
      desc: 'Garment bundles, readymade suits, shoes, packaged stock & merchandise',
      rate: 'From ₹60'
    },
    { 
      icon: <Wrench className="w-5 h-5 text-slate-700" />, 
      label: 'Machinery & Auto Spares', 
      desc: 'Automobile, tractor, motor pump, workshop tools & hardware components',
      rate: 'From ₹70'
    },
    { 
      icon: <Package className="w-5 h-5 text-[#0038BD]" />, 
      label: 'Express Regional Parcels', 
      desc: 'Commercial boxed goods, shop supplies & priority corridor transfers',
      rate: 'From ₹50'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <section id="coverage" className="py-16 sm:py-20 bg-[#F8FAFC] blueprint-grid overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0038BD]/10 text-[#0038BD] text-xs font-bold uppercase tracking-wider mb-2">
            <Navigation className="w-3.5 h-3.5" />
            <span>NH-752I &amp; SH-176 CORRIDOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Complete Route &amp; Village Delivery Network
          </h2>
          <div className="w-12 h-1 bg-[#EF8E01] rounded-full mx-auto mt-3" />
          <p className="text-base sm:text-lg text-slate-600 mt-3">
            Covering all cities, market towns, and village phatas across Jalna, Partur, and Mantha talukas with daily doorstep courier pickups and deliveries.
          </p>
        </motion.div>

        {/* Interactive Highway Ribbon Visual */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-12 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0038BD]">
                INTERACTIVE HIGHWAY CORRIDOR (65 KM)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Jalna ➔ Watur Phata ➔ Partur ➔ Mantha
              </h3>
            </div>
            <button
              onClick={() => onOpenBooking('jalna', 'mantha')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EF8E01] hover:bg-[#d88001] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <span>Book Full Route Pickup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sequential Waypoint Map Scroll */}
          <div className="mt-6 overflow-x-auto pb-4 pt-2">
            <div className="flex items-center min-w-[900px] justify-between relative px-4">
              {/* Connecting Dashed Line */}
              <div className="absolute top-[28px] left-10 right-10 h-1 bg-gradient-to-r from-[#0038BD] via-[#EF8E01] to-[#0038BD] rounded-full -z-0 opacity-80" />

              {ROUTE_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                const isHub = loc.type === 'hub';
                const isJunction = loc.type === 'junction';

                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedLocation(loc)}
                    className="flex flex-col items-center group relative z-10 focus:outline-none"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                        isSelected
                          ? 'bg-[#EF8E01] text-white ring-4 ring-[#EF8E01]/30 scale-110'
                          : isHub
                          ? 'bg-[#0038BD] text-white group-hover:scale-105'
                          : isJunction
                          ? 'bg-slate-900 text-[#EF8E01] group-hover:scale-105'
                          : 'bg-white text-slate-700 border-2 border-slate-300 group-hover:border-[#0038BD]'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    
                    <span className={`text-xs font-black mt-2 text-center whitespace-nowrap ${isSelected ? 'text-[#EF8E01]' : 'text-slate-900'}`}>
                      {loc.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 font-hindi">
                      {loc.marathiName}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      {loc.distanceKm} km
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Location Quick Detail Bar */}
          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0038BD] text-white flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#EF8E01]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {selectedLocation.name} ({selectedLocation.marathiName})
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#0038BD]">
                    Taluka: {selectedLocation.taluka}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    PIN: {selectedLocation.pincode}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">
                  Popular Pickup Points: {selectedLocation.popularLandmarks?.join(', ')}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenBooking(selectedLocation.id, selectedLocation.id === 'jalna' ? 'mantha' : 'jalna')}
              className="px-4 py-2 bg-[#0038BD] hover:bg-[#002d99] text-white font-bold rounded-xl transition-all shadow-2xs active:scale-95 shrink-0"
            >
              Book from {selectedLocation.name} ➔
            </button>
          </div>
        </motion.div>

        {/* Taluka Filter Buttons */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-xs font-bold text-slate-500 mr-2">Filter by Taluka:</span>
          {(['all', 'Jalna', 'Partur', 'Mantha'] as const).map((taluka) => (
            <button
              key={taluka}
              onClick={() => setFilterTaluka(taluka)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTaluka === taluka
                  ? 'bg-[#0038BD] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {taluka === 'all' ? `All ${ROUTE_LOCATIONS.length} Locations` : `${taluka} Taluka`}
            </button>
          ))}
        </div>

        {/* 15 Verified Locations Master Grid with Staggered Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14"
        >
          {filteredLocations.map((loc) => {
            const isHub = loc.type === 'hub';
            const isJunction = loc.type === 'junction';

            return (
              <motion.div
                key={loc.id}
                variants={itemVariants}
                id={`loc-card-${loc.id}`}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#0038BD] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-2xs ${
                        isHub ? 'bg-[#0038BD]' : isJunction ? 'bg-slate-900 text-[#EF8E01]' : 'bg-orange-500'
                      }`}>
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900 leading-snug">
                          {loc.name}
                        </h4>
                        <span className="text-xs font-bold text-[#0038BD]">
                          {loc.marathiName}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      isHub 
                        ? 'bg-blue-50 text-[#0038BD] border border-blue-200' 
                        : isJunction
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {loc.type === 'hub' ? 'City Hub' : loc.type === 'junction' ? 'Main Junction' : 'Village Point'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Taluka / Tehsil:</span>
                      <strong className="text-slate-800">{loc.taluka}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">PIN Code:</span>
                      <span className="font-mono font-semibold text-slate-800">{loc.pincode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Distance from Jalna:</span>
                      <span className="font-bold text-[#EF8E01]">~{loc.distanceKm} km</span>
                    </div>
                  </div>

                  {loc.popularLandmarks && loc.popularLandmarks.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Landmarks &amp; Drop Phatas:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {loc.popularLandmarks.slice(0, 3).map((lm, i) => (
                          <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            {lm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Doorstep Pickup Available
                  </span>
                  <button
                    onClick={() => onOpenBooking(loc.id, loc.id === 'jalna' ? 'mantha' : 'jalna')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0038BD] hover:text-[#EF8E01] transition-colors"
                  >
                    <span>Book</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Accepted Parcel Types Band */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0038BD] bg-[#0038BD]/10 px-3 py-1 rounded-md">
                ACCEPTED ITEMS
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">What Can You Send Along the Corridor?</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Standard packages and bundles up to 25 kg accepted for regular runs.</p>
            </div>
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-[#0038BD] hover:bg-[#002d99] px-5 py-3 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <span>Book Parcel Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {parcelCategories.map((cat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200">
                      {cat.icon}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {cat.rate}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 leading-snug mb-1">{cat.label}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
