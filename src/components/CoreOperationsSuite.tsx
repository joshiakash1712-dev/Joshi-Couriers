import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Calculator, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Package, 
  FileText, 
  Pill, 
  ShoppingBag, 
  Wrench, 
  Gift, 
  Phone, 
  Sparkles,
  RefreshCw,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { ROUTE_LOCATIONS, RouteLocation } from '../data/locations';

interface CoreOperationsSuiteProps {
  onOpenBooking: (fromId?: string, toId?: string) => void;
}

export const CoreOperationsSuite: React.FC<CoreOperationsSuiteProps> = ({ onOpenBooking }) => {
  const [activeTab, setActiveTab] = useState<'schedules' | 'tracking' | 'rates'>('schedules');
  
  // Rate Calculator State
  const [calcCategory, setCalcCategory] = useState<'docs' | 'pharma' | 'retail' | 'parts' | 'food'>('docs');
  const [calcWeight, setCalcWeight] = useState<string>('0.5-1kg');
  const [calcFromId, setCalcFromId] = useState<string>('jalna');
  const [calcToId, setCalcToId] = useState<string>('mantha');

  // Tracking State
  const [trackingId, setTrackingId] = useState<string>('JC-7041');
  const [searchedId, setSearchedId] = useState<string>('JC-7041');
  const [isSearching, setIsSearching] = useState(false);

  const sampleTrackingData: Record<string, {
    route: string;
    sender: string;
    receiver: string;
    item: string;
    status: string;
    progressPercent: number;
    steps: { title: string; location: string; time: string; done: boolean; current?: boolean }[];
  }> = {
    'JC-7041': {
      route: 'Jalna ➔ Watur ➔ Mantha',
      sender: 'Khandelwal Medicals, Jalna',
      receiver: 'Deshmukh Clinic, Mantha Market',
      item: 'Urgent Diagnostic Samples & Pharma Pack',
      status: 'Out for Doorstep Delivery in Mantha',
      progressPercent: 85,
      steps: [
        { title: 'Doorstep Pickup Completed', location: 'Station Road Hub, Jalna', time: '09:45 AM', done: true },
        { title: 'Highway Express Transit', location: 'NH-752I (Via Watur Phata & Belora)', time: '10:45 AM', done: true },
        { title: 'Arrived at Mantha Hub', location: 'Main Bus Stand Center, Mantha', time: '11:45 AM', done: true },
        { title: 'Out for Final Handover', location: 'Mantha Bazaar / Clinic Line', time: 'In Progress (ETA 12:15 PM)', done: false, current: true },
      ],
    },
    'JC-8820': {
      route: 'Partur ➔ Jalna',
      sender: 'Shri Balaji Sarees, Partur',
      receiver: 'Anand Matching Center, Jalna',
      item: 'Cloth & Saree Wholesale Sample Bundle (4.2 kg)',
      status: 'Delivered Safely (Hand-to-Hand)',
      progressPercent: 100,
      steps: [
        { title: 'Pickup from Shop', location: 'Cloth Market, Partur', time: 'Yesterday 02:15 PM', done: true },
        { title: 'Transit via Watur Phata', location: 'Watur Junction NH-752I', time: 'Yesterday 03:00 PM', done: true },
        { title: 'Delivered & Payment Collected', location: 'Gandhi Chaman, Jalna', time: 'Yesterday 04:30 PM', done: true },
      ],
    },
    'JC-1099': {
      route: 'Jalna ➔ Wazar Sarkate',
      sender: 'Mahavir Auto Spares, MIDC Jalna',
      receiver: 'Kisan Agro Center, Wazar Sarkate',
      item: 'Tractor Hydraulic Pump Spare (8.5 kg)',
      status: 'Scheduled for Afternoon Run',
      progressPercent: 30,
      steps: [
        { title: 'Booking Logged & Tagged', location: 'Jalna Hub Desk', time: 'Today 11:10 AM', done: true },
        { title: 'Pickup Assigned to Driver', location: 'MIDC Phase II, Jalna', time: 'Pickup Slot: 01:30 PM', done: false, current: true },
        { title: 'Afternoon Corridor Dispatch', location: 'Departing 03:30 PM', time: 'ETA Wazar 04:35 PM', done: false },
      ],
    },
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setSearchedId(trackingId.trim().toUpperCase());
      setIsSearching(false);
    }, 300);
  };

  const fromLoc = ROUTE_LOCATIONS.find(l => l.id === calcFromId) || ROUTE_LOCATIONS[0];
  const toLoc = ROUTE_LOCATIONS.find(l => l.id === calcToId) || ROUTE_LOCATIONS[ROUTE_LOCATIONS.length - 1];

  const calculateDistance = () => {
    return Math.abs(toLoc.distanceKm - fromLoc.distanceKm) || 15;
  };

  // Pricing Matrix
  const getPrice = () => {
    let base = 50;
    if (calcCategory === 'docs') base = 40;
    else if (calcCategory === 'pharma') base = 50;
    else if (calcCategory === 'retail') base = 60;
    else if (calcCategory === 'parts') base = 70;
    else if (calcCategory === 'food') base = 50;

    let weightMultiplier = 0;
    if (calcWeight === '0.5-1kg') weightMultiplier = 0;
    else if (calcWeight === '1-3kg') weightMultiplier = 20;
    else if (calcWeight === '3-5kg') weightMultiplier = 40;
    else if (calcWeight === '5-10kg') weightMultiplier = 70;
    else if (calcWeight === '10-20kg') weightMultiplier = 120;

    const dist = calculateDistance();
    const distanceExtra = dist > 45 ? 10 : 0;

    return base + weightMultiplier + distanceExtra;
  };

  const activeTracking = sampleTrackingData[searchedId] || sampleTrackingData['JC-7041'];

  return (
    <section id="operations-suite" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden blueprint-grid-dark">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-[#0038BD]/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#EF8E01]/15 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF8E01]/20 border border-[#EF8E01]/40 text-[#EF8E01] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>REGIONAL CORRIDOR CONSOLE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Daily Corridor Management
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-xl">
              Daily run timetable, instant village-to-city rate calculator, and direct parcel tracking across all 15 stops.
            </p>
          </div>

          {/* Tab Selection Navigation */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setActiveTab('schedules')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'schedules'
                  ? 'bg-[#0038BD] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Clock className="w-4 h-4 text-[#EF8E01]" />
              <span>Daily Runs</span>
            </button>

            <button
              onClick={() => setActiveTab('rates')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'rates'
                  ? 'bg-[#0038BD] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calculator className="w-4 h-4 text-[#EF8E01]" />
              <span>Rate Estimator</span>
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'tracking'
                  ? 'bg-[#0038BD] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Search className="w-4 h-4 text-[#EF8E01]" />
              <span>Live Tracker</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Schedules & Daily Timetable */}
        {activeTab === 'schedules' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Col: Timetable Cards */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Run 1: Morning Run */}
              <div className="bg-slate-800/80 rounded-2xl p-5 sm:p-6 border border-slate-700 hover:border-[#0038BD] transition-all relative overflow-hidden group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0038BD]/30 border border-[#0038BD]/60 flex items-center justify-center text-[#EF8E01] shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Morning Corridor Run</span>
                        </span>
                        <span className="text-xs text-slate-400">Run #01</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Morning Express Run (10:30 AM Dispatch)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Jalna ➔ Sindhi Kalegaon ➔ Viregaon ➔ Watur ➔ Partur ➔ Mantha
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-700">
                    <span className="text-xs text-slate-400 block">Cutoff for Pickup Booking:</span>
                    <span className="text-sm font-extrabold text-[#EF8E01]">09:30 AM (Same Day)</span>
                    <div className="mt-2">
                      <button
                        onClick={() => onOpenBooking('jalna', 'mantha')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EF8E01] hover:bg-[#d88001] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                      >
                        <span>Book Morning Slot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Route</span>
                    <span className="font-semibold text-white">NH-752I (65 km)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Stops Covered</span>
                    <span className="font-semibold text-white">All 15 Villages/Hubs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Transit Time</span>
                    <span className="font-semibold text-white">60-80 Minutes</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Handover</span>
                    <span className="font-semibold text-emerald-400">Direct Doorstep</span>
                  </div>
                </div>
              </div>

              {/* Run 2: Afternoon Run */}
              <div className="bg-slate-800/80 rounded-2xl p-5 sm:p-6 border border-slate-700 hover:border-[#EF8E01] transition-all relative overflow-hidden group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EF8E01]/20 border border-[#EF8E01]/40 flex items-center justify-center text-[#EF8E01] shrink-0">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          <span>Afternoon Commercial Run</span>
                        </span>
                        <span className="text-xs text-slate-400">Run #02</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Afternoon Commercial Run (03:30 PM Dispatch)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Covers Jalna MIDC ➔ Watur Phata ➔ Belora ➔ Wazar ➔ Mantha
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-700">
                    <span className="text-xs text-slate-400 block">Cutoff for Pickup Booking:</span>
                    <span className="text-sm font-extrabold text-[#EF8E01]">02:30 PM (Same Day)</span>
                    <div className="mt-2">
                      <button
                        onClick={() => onOpenBooking('jalna', 'mantha')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0038BD] hover:bg-[#002d99] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors border border-blue-400/30"
                      >
                        <span>Book Afternoon Slot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Vehicle</span>
                    <span className="font-semibold text-white">Dedicated Van + Bike</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Coverage</span>
                    <span className="font-semibold text-white">All 3 Talukas &amp; APMC</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Weight Limit</span>
                    <span className="font-semibold text-white">Up to 25 kg/parcel</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Payment</span>
                    <span className="font-semibold text-emerald-400">Cash / UPI on Delivery</span>
                  </div>
                </div>
              </div>

              {/* Return Runs info */}
              <div className="bg-slate-800/40 rounded-2xl p-4 sm:p-5 border border-slate-700/60 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-[#EF8E01] shrink-0" />
                  <span><strong>Return Direction (Mantha / Partur ➔ Jalna):</strong> Daily dispatches at <strong>12:30 PM</strong> and <strong>05:30 PM</strong>.</span>
                </div>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded">Daily Bidirectional</span>
              </div>
            </div>

            {/* Right Col: Operations Overview & Driver Direct */}
            <div className="lg:col-span-4 bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">NETWORK SUMMARY</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Route Live
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">Total Corridor Span</span>
                  <span className="text-xl font-extrabold text-white">65 Kilometers</span>
                  <span className="text-xs text-slate-500 block mt-0.5">Jalna ➔ Watur ➔ Partur ➔ Mantha</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">15 Verified Delivery Points</span>
                  <span className="text-sm font-bold text-white">Full Doorstep Reach</span>
                  <span className="text-xs text-emerald-400 block mt-0.5">Zero central warehouse rerouting</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0038BD]/20 border border-[#0038BD]/40 text-center">
                <span className="text-xs text-blue-200 block mb-1">Direct Courier Helpline</span>
                <a
                  href="tel:+919404040606"
                  className="text-base font-extrabold text-white hover:text-[#EF8E01] transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#EF8E01]" />
                  <span>+91 94040 40606</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Rate Estimator with 15 Locations */}
        {activeTab === 'rates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Col: Rate Options */}
            <div className="lg:col-span-7 bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-700 space-y-5">
              
              {/* Pickup & Delivery Location Dropdowns */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  1. Select Pickup &amp; Destination Points
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">From Location:</label>
                    <select
                      value={calcFromId}
                      onChange={(e) => setCalcFromId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-semibold focus:outline-none focus:border-[#0038BD]"
                    >
                      {ROUTE_LOCATIONS.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.marathiName}) - {loc.taluka}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">To Destination:</label>
                    <select
                      value={calcToId}
                      onChange={(e) => setCalcToId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-semibold focus:outline-none focus:border-[#0038BD]"
                    >
                      {ROUTE_LOCATIONS.map(loc => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.marathiName}) - {loc.taluka}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#EF8E01]" />
                  <span>Route distance: ~{calculateDistance()} km along NH-752I</span>
                </div>
              </div>

              {/* Parcel Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  2. Select Parcel Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'docs', label: 'Documents / Law', icon: <FileText className="w-4 h-4" /> },
                    { id: 'pharma', label: 'Medicines / Samples', icon: <Pill className="w-4 h-4" /> },
                    { id: 'retail', label: 'Clothes / Retail', icon: <ShoppingBag className="w-4 h-4" /> },
                    { id: 'parts', label: 'Machinery Spares', icon: <Wrench className="w-4 h-4" /> },
                    { id: 'food', label: 'Homemade Sweets', icon: <Gift className="w-4 h-4" /> },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCalcCategory(cat.id as any)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all text-left ${
                        calcCategory === cat.id
                          ? 'bg-[#0038BD]/40 text-white border-blue-400 ring-1 ring-blue-400'
                          : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-[#EF8E01]">{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  3. Select Weight Bracket
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '0.5-1kg', label: '< 1 kg (Light)' },
                    { id: '1-3kg', label: '1 to 3 kg' },
                    { id: '3-5kg', label: '3 to 5 kg' },
                    { id: '5-10kg', label: '5 to 10 kg' },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setCalcWeight(w.id)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                        calcWeight === w.id
                          ? 'bg-[#EF8E01] text-white border-[#EF8E01] font-bold'
                          : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Price Breakdown Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0038BD] to-blue-900 rounded-2xl p-7 text-white shadow-xl relative overflow-hidden space-y-5">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EF8E01]">
                  TRANSPARENT LOCAL RATE
                </span>
                <span className="text-xs text-blue-200">No Hidden Charges</span>
              </div>

              <div>
                <span className="text-xs text-blue-200 block">
                  Estimated Fare ({fromLoc.name} ➔ {toLoc.name})
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    ₹{getPrice()}
                  </span>
                  <span className="text-xs text-blue-200 font-medium">/ parcel</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-blue-100/90 pt-2 border-t border-white/15">
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Doorstep Pickup Charge:</span>
                  <span className="font-bold text-emerald-300">FREE</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/10">
                  <span>Advance Surcharge:</span>
                  <span className="font-bold text-emerald-300">₹0 (Zero Advance)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Payment Method:</span>
                  <span className="font-bold text-white">Cash / UPI on Delivery</span>
                </div>
              </div>

              <button
                onClick={() => onOpenBooking(calcFromId, calcToId)}
                className="w-full py-3.5 px-4 bg-[#EF8E01] hover:bg-[#d88001] text-white rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Book Pickup at this Rate</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-blue-200/70 text-center">
                *Commercial &amp; bulk merchant accounts receive monthly billing support.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Live Parcel Tracker */}
        {activeTab === 'tracking' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Col: Search bar & Quick Sample IDs */}
            <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-700 space-y-5">
              <h3 className="text-lg font-bold text-white">
                Check Parcel Status
              </h3>
              <p className="text-xs text-slate-400">
                Enter your Joshi Couriers receipt number (e.g., JC-7041) provided on WhatsApp or phone call.
              </p>

              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. JC-7041)"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0038BD]"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-3.5 bg-[#0038BD] hover:bg-[#002d99] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Track</span>
                  </button>
                </div>
              </form>

              {/* Sample Demo Buttons */}
              <div className="pt-3 border-t border-slate-700">
                <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                  Try live sample parcel IDs:
                </span>
                <div className="flex flex-wrap gap-2">
                  {['JC-7041', 'JC-8820', 'JC-1099'].map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setTrackingId(id);
                        setSearchedId(id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                        searchedId === id
                          ? 'bg-[#EF8E01] text-white'
                          : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct driver dispatch photo shared on WhatsApp on delivery.</span>
              </div>
            </div>

            {/* Right Col: Timeline visual */}
            <div className="lg:col-span-7 bg-slate-800 rounded-2xl p-6 sm:p-7 border border-slate-700 space-y-6">
              
              {/* Header with Route & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-700">
                <div>
                  <span className="text-xs text-slate-400 font-mono block">TRACKING ID: {searchedId}</span>
                  <h4 className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
                    <span>{activeTracking.route}</span>
                    <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {activeTracking.status}
                    </span>
                  </h4>
                </div>
                <div className="text-xs text-slate-400">
                  <span>Item: </span>
                  <strong className="text-slate-200">{activeTracking.item}</strong>
                </div>
              </div>

              {/* Visual Step-by-Step Milestones */}
              <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                {activeTracking.steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        step.done
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : step.current
                          ? 'bg-[#EF8E01] border-[#EF8E01] text-white animate-pulse'
                          : 'bg-slate-900 border-slate-600'
                      }`}
                    >
                      {step.done && <CheckCircle2 className="w-3 h-3" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${step.done ? 'text-white' : step.current ? 'text-[#EF8E01]' : 'text-slate-500'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">({step.time})</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {step.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Driver Contact Link */}
              <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <span>Sender: {activeTracking.sender}</span>
                <a
                  href="https://wa.me/919404040606"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EF8E01] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Query Driver on WhatsApp</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
