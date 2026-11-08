import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  Building2, 
  ArrowRight, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink, 
  X, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck,
  Calendar,
  CreditCard,
  User,
  Radio,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuthParcel } from '../context/AuthParcelContext';
import { useToast } from '../hooks/useToast';
import { ParcelItem, ParcelStatus } from '../types';

export const LiveParcelTracker: React.FC = () => {
  const { parcels, userParcels, fetchParcelByTrackingId, subscribeToParcel } = useAuthParcel();
  const toast = useToast();

  const [trackingInput, setTrackingInput] = useState('');
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);
  const [trackedParcel, setTrackedParcel] = useState<ParcelItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Real-time synchronization when activeTrackingId is set
  useEffect(() => {
    if (!activeTrackingId) {
      setTrackedParcel(null);
      return;
    }

    setIsLoading(true);

    // Initial fetch to get parcel immediately
    fetchParcelByTrackingId(activeTrackingId).then((parcel) => {
      setTrackedParcel(parcel);
      setIsLoading(false);
      setHasSearched(true);
    });

    // Subscribe to real-time changes in Firestore or local state
    const unsubscribe = subscribeToParcel(activeTrackingId, (liveParcel) => {
      if (liveParcel) {
        setTrackedParcel(liveParcel);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [activeTrackingId, fetchParcelByTrackingId, subscribeToParcel]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = trackingInput.trim().toUpperCase();
    if (!cleanId) {
      toast.warning('Please enter a tracking ID (e.g. JC-84920)', {
        title: 'Tracking ID Required',
      });
      inputRef.current?.focus();
      return;
    }

    setActiveTrackingId(cleanId);
  };

  const handleClear = () => {
    setTrackingInput('');
    setActiveTrackingId(null);
    setTrackedParcel(null);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleSelectQuickId = (id: string) => {
    setTrackingInput(id);
    setActiveTrackingId(id);
  };

  const handleCopyTrackingId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    toast.info(`Tracking code ${id} copied to clipboard.`, {
      title: 'Tracking Code Copied',
      meta: { trackingId: id },
      duration: 3000,
    });
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getStatusDetails = (status: ParcelStatus) => {
    switch (status) {
      case 'pickup_scheduled':
        return {
          label: 'Pickup Scheduled',
          badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
          dotBg: 'bg-amber-500',
          icon: Clock,
          stepIndex: 0,
          description: 'Doorstep pickup registered in Jalna. Driver assigned for collection.',
        };
      case 'picked_up':
        return {
          label: 'Picked Up by Driver',
          badgeBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
          dotBg: 'bg-blue-500',
          icon: Package,
          stepIndex: 1,
          description: 'Collected hand-to-hand in Jalna and securely loaded in Mahindra Maxximo MH21 V 6370.',
        };
      case 'in_transit':
        return {
          label: 'In Transit on Corridor',
          badgeBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
          dotBg: 'bg-indigo-500',
          icon: Navigation,
          stepIndex: 2,
          description: 'Moving along NH-752I / SH-176 corridor towards Partur and Mantha.',
        };
      case 'arrived_partur':
        return {
          label: 'Arrived at Partur Hub',
          badgeBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
          dotBg: 'bg-cyan-500',
          icon: Building2,
          stepIndex: 3,
          description: 'Arrived at Partur corridor hub (6:00 AM - 6:30 AM). Sorting for doorstep drop.',
        };
      case 'out_for_delivery':
        return {
          label: 'Out for Doorstep Delivery',
          badgeBg: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
          dotBg: 'bg-orange-500',
          icon: Truck,
          stepIndex: 4,
          description: 'With driver on delivery round. Morning doorstep drop in progress (6:30 AM - 8:30 AM).',
        };
      case 'delivered':
        return {
          label: 'Delivered Safely',
          badgeBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          dotBg: 'bg-emerald-500',
          icon: CheckCircle2,
          stepIndex: 5,
          description: 'Handed directly to recipient. Safe morning delivery completed.',
        };
      default:
        return {
          label: status,
          badgeBg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
          dotBg: 'bg-slate-500',
          icon: Package,
          stepIndex: 0,
          description: 'Processing shipment.',
        };
    }
  };

  const routeSteps = [
    { title: 'Jalna Pickup', sub: 'Afternoon / Evening' },
    { title: 'Loaded in Van', sub: 'MH21 V 6370' },
    { title: 'Corridor Transit', sub: '4:00 - 5:00 AM' },
    { title: 'Partur Arrival', sub: '6:00 - 6:30 AM' },
    { title: 'Doorstep Drop', sub: '6:30 - 8:30 AM' },
  ];

  // Quick suggestion IDs from existing parcels
  const suggestedParcels = React.useMemo(() => {
    const list = userParcels.length > 0 ? userParcels : parcels;
    return list.slice(0, 4);
  }, [userParcels, parcels]);

  const generateWhatsAppInquiryUrl = (parcel: ParcelItem) => {
    const text = `*Parcel Tracking Inquiry - Joshi Couriers* [%23${parcel.id}]%0A%0A` +
      `📦 *Tracking ID:* ${parcel.id}%0A` +
      `📍 *Route:* ${parcel.fromCity} ➔ ${parcel.toCity}%0A` +
      `👤 *Receiver:* ${parcel.receiverName}%0A` +
      `📊 *Current Status:* ${parcel.status.replace(/_/g, ' ')}%0A%0A` +
      `_Hello Akash Bhai, please share the latest morning delivery update for this parcel._`;
    return `https://wa.me/919404040606?text=${text}`;
  };

  const statusInfo = trackedParcel ? getStatusDetails(trackedParcel.status) : null;
  const StatusIcon = statusInfo?.icon || Package;

  return (
    <section 
      id="live-tracking" 
      aria-label="Parcel live tracking search and status" 
      className="w-full relative"
    >
      {/* Outer Card with Logistics Blueprint styling */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
        
        {/* Top Header Strip */}
        <div className="p-5 sm:p-7 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-blue-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div>
              {/* Live Signal Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0038BD]/10 dark:bg-blue-500/15 border border-[#0038BD]/20 dark:border-blue-400/30 text-[#0038BD] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Radio className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                <span>Live Corridor Tracking</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Track Your Shipment Status
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Enter your booking ID to view live vehicle status, corridor progression, and early morning doorstep delivery milestones between Jalna, Partur, and Mantha.
              </p>
            </div>

            {/* Direct Driver Contact Pill */}
            <div className="hidden lg:flex items-center gap-3 bg-white dark:bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#0038BD]/10 dark:bg-blue-500/20 text-[#0038BD] dark:text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Daily Vehicle
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  MH21 V 6370 (Maxximo)
                </span>
              </div>
            </div>

          </div>

          {/* Search Input Field */}
          <form onSubmit={handleSearch} className="mt-5 sm:mt-6">
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-[#0038BD] dark:text-blue-400">
                  <Search className="w-5 h-5" />
                </div>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter Tracking ID (e.g. JC-84920 or paste ID)"
                  aria-label="Enter parcel tracking ID"
                  className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-mono font-bold text-sm sm:text-base uppercase tracking-wider placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038BD] focus:border-transparent transition-all shadow-inner"
                />

                {trackingInput && (
                  <button
                    type="button"
                    onClick={() => setTrackingInput('')}
                    aria-label="Clear tracking input"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-[#0038BD] hover:bg-[#002888] active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#0038BD] focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <span>Track Parcel</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {activeTrackingId && (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Reset search"
                    className="p-3 sm:p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

            </div>
          </form>

          {/* Quick Suggestions / Available Tracking IDs */}
          {suggestedParcels.length > 0 && !activeTrackingId && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Active Bookings:
              </span>
              {suggestedParcels.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectQuickId(p.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-slate-700 hover:text-[#0038BD] dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 font-mono text-[11px] transition-all cursor-pointer"
                >
                  <Package className="w-3 h-3 text-[#EF8E01]" />
                  <span>{p.id}</span>
                  <span className="text-[10px] text-slate-400">({p.fromCity} ➔ {p.toCity})</span>
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Live Tracking Result View */}
        <div className="p-5 sm:p-7">
          <AnimatePresence mode="wait">
            
            {/* 1. Active Parcel Details Display */}
            {trackedParcel && statusInfo && (
              <motion.div
                key={`tracked-${trackedParcel.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                
                {/* Status Bar with Tracking ID, Live Indicator & Status Badge */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Tracking ID Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      <Package className="w-4 h-4 text-[#0038BD] dark:text-blue-400" />
                      <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                        {trackedParcel.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTrackingId(trackedParcel.id)}
                        aria-label="Copy tracking ID"
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors ml-1 cursor-pointer"
                      >
                        {copiedId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Corridor Route Tag */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0038BD] dark:text-blue-300 border border-blue-100 dark:border-blue-800/80 text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{trackedParcel.fromCity}</span>
                      <span>➔</span>
                      <span>{trackedParcel.toCity}</span>
                    </div>

                    {/* Live Firestore Sync Dot */}
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span>Real-time Sync</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-bold shadow-2xs self-start md:self-auto ${statusInfo.badgeBg}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span>{statusInfo.label}</span>
                  </div>

                </div>

                {/* Corridor Progression Stepper (5 Milestones) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 sm:mb-6">
                    Route Milestones &amp; Dispatch Timeline
                  </h4>

                  <div className="relative">
                    {/* Connecting Bar */}
                    <div className="hidden md:block absolute top-4 left-6 right-6 h-1 bg-slate-100 dark:bg-slate-700 -z-0">
                      <div 
                        className="h-full bg-[#0038BD] dark:bg-blue-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, (statusInfo.stepIndex / 4) * 100))}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2 relative z-10">
                      {routeSteps.map((step, idx) => {
                        const isCompleted = idx < statusInfo.stepIndex;
                        const isCurrent = idx === statusInfo.stepIndex;

                        return (
                          <div 
                            key={step.title}
                            className={`flex md:flex-col items-center md:text-center gap-3 md:gap-2 p-2.5 rounded-xl transition-colors ${
                              isCurrent ? 'bg-blue-50/70 dark:bg-blue-950/30' : ''
                            }`}
                          >
                            {/* Milestone Dot / Icon */}
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                                isCompleted 
                                  ? 'bg-emerald-500 text-white shadow-xs'
                                  : isCurrent
                                  ? 'bg-[#0038BD] text-white ring-4 ring-blue-100 dark:ring-blue-900/60 shadow-md'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>

                            {/* Label */}
                            <div className="min-w-0 flex-1 md:flex-initial">
                              <span className={`text-xs font-bold block ${
                                isCurrent 
                                  ? 'text-[#0038BD] dark:text-blue-300' 
                                  : isCompleted 
                                  ? 'text-slate-800 dark:text-slate-200' 
                                  : 'text-slate-400 dark:text-slate-500'
                              }`}>
                                {step.title}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                                {step.sub}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Current Stage Description */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-[#0038BD] dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Current Milestone: </strong>
                      {statusInfo.description}
                    </p>
                  </div>
                </div>

                {/* Key Consignment Details Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* Delivery Slot */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Arrival Slot</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {trackedParcel.deliverySlot || 'Tomorrow 6:30 - 8:30 AM'}
                    </p>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Guaranteed morning drop
                    </span>
                  </div>

                  {/* Consignment Item */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                      <Package className="w-3.5 h-3.5 text-[#EF8E01]" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Consignment</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={trackedParcel.parcelType}>
                      {trackedParcel.parcelType}
                    </p>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
                      {trackedParcel.weightCategory}
                    </span>
                  </div>

                  {/* Delivery Fare */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Delivery Fee</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      ₹{trackedParcel.fare}
                    </p>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      {trackedParcel.paymentStatus === 'collected' ? 'Paid on Delivery' : 'Pay on Delivery (Cash / UPI)'}
                    </span>
                  </div>

                  {/* Vehicle & Custody */}
                  <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                      <Truck className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Assigned Van</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      MH21 V 6370
                    </p>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Anant &amp; Akash Joshi
                    </span>
                  </div>

                </div>

                {/* Recipient & Destination Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Destination Address &amp; Recipient
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {trackedParcel.receiverName} in {trackedParcel.toCity}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                      {trackedParcel.deliveryAddress}
                    </p>
                  </div>

                  {/* Actions (WhatsApp Driver & Share) */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <a
                      href={generateWhatsAppInquiryUrl(trackedParcel)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Contact Akash Joshi</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowFullHistory(!showFullHistory)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#0038BD] dark:hover:text-blue-400 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Activity History</span>
                      {showFullHistory ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Activity Timeline History */}
                <AnimatePresence>
                  {showFullHistory && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-900/50"
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                        <span>Shipment Checkpoint Logs</span>
                      </h4>

                      <div className="space-y-3 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                        {trackedParcel.history && trackedParcel.history.length > 0 ? (
                          trackedParcel.history.map((h, i) => (
                            <div key={i} className="relative pl-6 text-xs">
                              <div className="absolute left-0.5 top-1.5 w-3 h-3 rounded-full bg-[#0038BD] border-2 border-white dark:border-slate-900" />
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="font-bold text-slate-900 dark:text-white capitalize">
                                  {h.status.replace(/_/g, ' ')}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                  • {new Date(h.timestamp).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded">
                                  {h.location}
                                </span>
                              </div>
                              <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                {h.note}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 pl-6">
                            Initial registration logged. Awaiting driver departure scan.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* 2. Parcel Not Found State */}
            {hasSearched && !isLoading && !trackedParcel && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="p-6 sm:p-8 text-center rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 space-y-3"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Tracking ID Not Found
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  We could not find active records for <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 font-mono font-bold text-[#0038BD] dark:text-blue-400">{activeTrackingId}</code>. Please confirm the code format (e.g. JC-84920) or message Akash Joshi directly on WhatsApp.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={`https://wa.me/919404040606?text=Hello%20Akash%20Bhai,%20I%20am%20trying%20to%20track%20parcel%20${activeTrackingId}%20on%20the%20portal.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire with Akash (+91 94040 40606)</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Try Another ID
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. Default Idle Prompt (when no search performed yet) */}
            {!hasSearched && !trackedParcel && (
              <motion.div
                key="idle-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-4 px-2 text-center text-slate-500 dark:text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-time sync direct with driver device</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0038BD] dark:text-blue-400" />
                  <span>Morning delivery window: 6:30 AM - 8:30 AM</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#EF8E01]" />
                  <span>100% Hand-to-hand delivery guarantee</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
