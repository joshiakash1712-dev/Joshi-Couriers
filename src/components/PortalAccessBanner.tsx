import React, { useRef } from 'react';
import { 
  Package, 
  BarChart3, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Users,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { useAuthParcel } from '../context/AuthParcelContext';
import { gsap, useGSAP } from '../lib/gsap';

interface PortalAccessBannerProps {
  onOpenCustomerParcels: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onOpenBooking: () => void;
}

export const PortalAccessBanner: React.FC<PortalAccessBannerProps> = ({
  onOpenCustomerParcels,
  onOpenAdmin,
  onOpenAuth,
}) => {
  const { currentUser, userParcels, analytics } = useAuthParcel();
  const bannerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Safe GSAP enhancement: never hide content with autoAlpha: 0
        // Elements are 100% visible immediately, animations only provide gentle polish
        gsap.from('.portal-card', {
          y: 16,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          clearProps: 'all',
        });
      });
    },
    { scope: bannerRef }
  );

  return (
    <div 
      ref={bannerRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full"
    >
      {/* Card 1: Regular Senders & Merchant Parcel Hub */}
      <div className="portal-card bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0038BD] dark:text-blue-400 border border-blue-100 dark:border-blue-900/60">
              <Store className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
              <span>Merchant &amp; Sender Hub</span>
            </span>
            {currentUser && currentUser.role === 'customer' ? (
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Signed In
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                Jalna Merchants
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Track Daily Dispatches &amp; History
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            Wholesalers, cloth shops, and distributors sending daily shipments from Jalna can view their complete dispatch records, active morning runs, and instant repeat bookings.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
              <span className="text-slate-500 dark:text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Active Shipments</span>
              <span className="text-lg font-black text-[#0038BD] dark:text-blue-400 mt-0.5 block">
                {currentUser && currentUser.role === 'customer' 
                  ? userParcels.filter(p => p.status !== 'delivered').length 
                  : `${userParcels.length} Registered`}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block mt-0.5">
                Morning 6:30-8:30 AM drop
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
              <span className="text-slate-500 dark:text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Hand-to-Hand Delivery</span>
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                100% Zero Loss
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                Akash Joshi direct handling
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {currentUser && currentUser.role === 'customer' ? (
            <button
              onClick={onOpenCustomerParcels}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0038BD] hover:bg-[#002d99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>View My Entire Parcel List ({userParcels.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-[#0038BD] hover:bg-[#002d99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Sign In as Regular Sender</span>
              </button>
              <button
                onClick={onOpenCustomerParcels}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                View Parcel Hub
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card 2: Operations & Admin Analytics Control */}
      <div className="portal-card bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
              <Truck className="w-3.5 h-3.5 text-[#EF8E01]" />
              <span>Fleet Operations &amp; Intelligence</span>
            </span>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              Mahindra Maxximo
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Courier Admin &amp; Live Manifest
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
            Operations control for Anant Joshi &amp; his son (Akash Joshi): monitor total morning dispatches, Partur/Mantha route volume breakdowns, freight collections, and live trip manifests.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
              <span className="text-slate-500 dark:text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Total Freight Value</span>
              <span className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5 block">
                ₹{analytics.totalRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block mt-0.5">
                ₹{analytics.revenueCollected} collected on arrival
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70">
              <span className="text-slate-500 dark:text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Corridor Volume</span>
              <span className="text-lg font-black text-[#EF8E01] mt-0.5 block">
                {analytics.totalParcels} Total Parcels
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
                Vehicle MH21 V 6370 load
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onOpenAdmin}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#EF8E01] hover:bg-[#d88001] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Open Admin Analytics &amp; Manifest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Status controls &amp; WhatsApp trip sheet
          </span>
        </div>
      </div>
    </div>
  );
};
