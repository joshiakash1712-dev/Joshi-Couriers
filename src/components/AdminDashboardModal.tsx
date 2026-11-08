import React, { useState, useMemo } from 'react';
import { 
  X, 
  TrendingUp, 
  DollarSign, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  FileText, 
  Copy, 
  Check, 
  BarChart3, 
  PieChart, 
  Search, 
  ShieldCheck, 
  AlertCircle,
  Filter,
  Printer,
  ChevronDown,
  RefreshCw,
  ArrowRight,
  Send
} from 'lucide-react';
import { useAuthParcel } from '../context/AuthParcelContext';
import { useToast } from '../hooks/useToast';
import { ParcelItem, ParcelStatus } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const { 
    parcels, 
    analytics, 
    updateParcelStatus, 
    approveParcelOrder, 
    markParcelPicked, 
    markParcelShipped,
    updateParcelPayment,
    bulkApproveOrders,
    bulkMarkPicked
  } = useAuthParcel();
  
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'manifest' | 'analytics' | 'tripsheet'>('manifest');
  const [manifestSearch, setManifestSearch] = useState('');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<'all' | 'pending_approval' | 'ordered' | 'picked' | 'shipped'>('all');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<'all' | 'pending' | 'collected'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'fare_desc'>('newest');
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Phase counts
  const phaseCounts = useMemo(() => {
    return {
      all: parcels.length,
      pending_approval: parcels.filter(p => p.status === 'pending_approval').length,
      ordered: parcels.filter(p => p.status === 'ordered').length,
      picked: parcels.filter(p => p.status === 'picked' || p.status === 'picked_up' || p.status === 'in_transit' || p.status === 'arrived_partur' || p.status === 'out_for_delivery').length,
      shipped: parcels.filter(p => p.status === 'shipped' || p.status === 'delivered').length,
    };
  }, [parcels]);

  // Pending COD calculation
  const totalPendingCOD = useMemo(() => {
    return parcels
      .filter(p => p.paymentStatus !== 'collected')
      .reduce((sum, p) => sum + (p.fare || 0), 0);
  }, [parcels]);

  // Filtered and sorted parcels
  const filteredParcels = useMemo(() => {
    return parcels
      .filter(p => {
        // Phase filter
        if (selectedPhaseFilter !== 'all') {
          if (selectedPhaseFilter === 'pending_approval' && p.status !== 'pending_approval') return false;
          if (selectedPhaseFilter === 'ordered' && p.status !== 'ordered') return false;
          if (selectedPhaseFilter === 'picked') {
            const isPicked = p.status === 'picked' || p.status === 'picked_up' || p.status === 'in_transit' || p.status === 'arrived_partur' || p.status === 'out_for_delivery';
            if (!isPicked) return false;
          }
          if (selectedPhaseFilter === 'shipped') {
            const isShipped = p.status === 'shipped' || p.status === 'delivered';
            if (!isShipped) return false;
          }
        }

        // Route filter
        if (selectedRouteFilter !== 'all') {
          if (selectedRouteFilter === 'partur' && p.toLocationId !== 'partur') return false;
          if (selectedRouteFilter === 'mantha' && p.toLocationId !== 'mantha') return false;
        }

        // Payment filter
        if (selectedPaymentFilter !== 'all') {
          if (selectedPaymentFilter === 'pending' && p.paymentStatus === 'collected') return false;
          if (selectedPaymentFilter === 'collected' && p.paymentStatus !== 'collected') return false;
        }

        // Text search
        if (manifestSearch.trim()) {
          const q = manifestSearch.toLowerCase().trim();
          const matchId = p.id.toLowerCase().includes(q);
          const matchSender = p.senderName.toLowerCase().includes(q) || (p.senderPhone && p.senderPhone.includes(q)) || (p.senderBusiness && p.senderBusiness.toLowerCase().includes(q));
          const matchReceiver = p.receiverName.toLowerCase().includes(q) || (p.receiverPhone && p.receiverPhone.includes(q)) || (p.deliveryAddress && p.deliveryAddress.toLowerCase().includes(q));
          const matchItem = p.parcelType.toLowerCase().includes(q) || (p.notes && p.notes.toLowerCase().includes(q));
          if (!matchId && !matchSender && !matchReceiver && !matchItem) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'fare_desc') {
          return (b.fare || 0) - (a.fare || 0);
        }
        return 0;
      });
  }, [parcels, selectedPhaseFilter, selectedRouteFilter, selectedPaymentFilter, manifestSearch, sortBy]);

  if (!isOpen) return null;

  const handleStatusChange = async (parcelId: string, newStatus: ParcelStatus) => {
    await updateParcelStatus(parcelId, newStatus);
    const friendly = newStatus.replace(/_/g, ' ');
    toast.success(`Consignment ${parcelId} updated to ${friendly}.`, {
      title: 'Status Updated',
      meta: { trackingId: parcelId },
      duration: 3000,
    });
  };

  const handlePaymentToggle = async (parcel: ParcelItem) => {
    const nextStatus = parcel.paymentStatus === 'collected' ? 'pending' : 'collected';
    await updateParcelPayment(parcel.id, nextStatus);
    toast.success(
      nextStatus === 'collected' 
        ? `Marked ₹${parcel.fare} collected for ${parcel.id}.` 
        : `Marked ₹${parcel.fare} pending for ${parcel.id}.`,
      {
        title: nextStatus === 'collected' ? 'Payment Collected' : 'Payment Marked Pending',
        meta: { trackingId: parcel.id },
        duration: 3000,
      }
    );
  };

  const handleBulkApprove = async () => {
    const pendingIds = parcels.filter(p => p.status === 'pending_approval').map(p => p.id);
    if (pendingIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await bulkApproveOrders(pendingIds);
      toast.success(`Approved ${pendingIds.length} orders. Scheduled for corridor dispatch.`, {
        title: 'Bulk Approval Complete',
        duration: 4000,
      });
    } catch {
      toast.error('Failed to complete bulk approval. Please try again.');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkMarkPicked = async () => {
    const orderedIds = parcels.filter(p => p.status === 'ordered').map(p => p.id);
    if (orderedIds.length === 0) return;
    setIsBulkProcessing(true);
    try {
      await bulkMarkPicked(orderedIds);
      toast.success(`Marked ${orderedIds.length} parcels as Picked in Mahindra Maxximo MH21 V 6370.`, {
        title: 'Loaded in Vehicle',
        duration: 4000,
      });
    } catch {
      toast.error('Failed to update parcels. Please try again.');
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const copyTripManifest = () => {
    const activeParcels = parcels.filter(p => p.status !== 'shipped' && p.status !== 'delivered');
    const parcelList = activeParcels.length > 0 ? activeParcels : parcels;

    let text = `*JOSHI COURIERS - DAILY CORRIDOR DISPATCH SHEET*\n`;
    text += `*Fleet Vehicle:* Mahindra Maxximo (MH21 V 6370)\n`;
    text += `*Transporter Team:* Anant Joshi & Akash Joshi (+91 94040 40606)\n`;
    text += `*Dispatch Date:* ${new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}\n`;
    text += `*Corridor:* Jalna (4:00-5:00 AM) ➔ Partur (6:00-6:30 AM) ➔ Mantha\n`;
    text += `*Delivery Window:* 6:30 - 8:30 AM Doorstep Delivery\n`;
    text += `===========================================\n\n`;

    let totalCOD = 0;
    parcelList.forEach((p, idx) => {
      const isPaid = p.paymentStatus === 'collected';
      if (!isPaid) totalCOD += p.fare;
      text += `${idx + 1}. [${p.id}] ${p.fromCity} ➔ ${p.toCity} (${p.status.toUpperCase()})\n`;
      text += `   *To:* ${p.receiverName} (${p.receiverPhone})\n`;
      text += `   *Drop Address:* ${p.deliveryAddress}\n`;
      text += `   *Item:* ${p.parcelType} [${p.weightCategory}]\n`;
      text += `   *Fare:* ₹${p.fare} [${isPaid ? 'PAID ONLINE/DIRECT' : 'COLLECT CASH ON DELIVERY'}]\n`;
      if (p.notes) text += `   *Note:* ${p.notes}\n`;
      text += `\n`;
    });

    text += `===========================================\n`;
    text += `*TOTAL CONSIGNMENTS:* ${parcelList.length}\n`;
    text += `*TOTAL CASH TO COLLECT:* ₹${totalCOD}\n`;
    text += `_Joshi Couriers: Trusted Hand-to-Hand Morning Delivery._\n`;

    navigator.clipboard.writeText(text);
    setCopiedManifest(true);
    toast.info('Trip manifest copied to clipboard. Ready to paste in WhatsApp group or driver chat.', {
      title: 'Manifest Copied',
      duration: 3500,
    });
    setTimeout(() => setCopiedManifest(false), 2500);
  };

  const getSenderWhatsAppUrl = (parcel: ParcelItem) => {
    const text = `*Joshi Couriers - Booking Update* [${parcel.id}]\n\n` +
      `Hello ${parcel.senderName},\n` +
      `Your parcel *${parcel.id}* to ${parcel.receiverName} (${parcel.toCity}) is currently: *${parcel.status.replace(/_/g, ' ').toUpperCase()}*.\n` +
      `Transporter: Anant Joshi & Akash Joshi in vehicle MH21 V 6370.\n` +
      `Expected morning delivery window: 6:30 AM - 8:30 AM.\n\n` +
      `Thank you for shipping with Joshi Couriers Jalna.`;
    const cleanPhone = parcel.senderPhone ? parcel.senderPhone.replace(/\D/g, '') : '';
    const phoneParam = cleanPhone.length >= 10 ? cleanPhone : '';
    return `https://wa.me/${phoneParam}?text=${encodeURIComponent(text)}`;
  };

  const getReceiverWhatsAppUrl = (parcel: ParcelItem) => {
    const text = `*Joshi Couriers - Delivery Notification* [${parcel.id}]\n\n` +
      `Hello ${parcel.receiverName},\n` +
      `A parcel from *${parcel.senderName}* (Jalna) is dispatched for you via Joshi Couriers.\n\n` +
      `📦 *Tracking ID:* ${parcel.id}\n` +
      `📍 *Drop Location:* ${parcel.deliveryAddress}\n` +
      `💰 *Amount Due:* ₹${parcel.fare} (${parcel.paymentStatus === 'collected' ? 'Already Paid' : 'Cash on Delivery'})\n` +
      `🚚 *Vehicle:* MH21 V 6370 (Mahindra Maxximo)\n` +
      `⏰ *Delivery Window:* Tomorrow morning 6:30 AM - 8:30 AM\n\n` +
      `Driver Contact: Akash Joshi (+91 94040 40606)`;
    const cleanPhone = parcel.receiverPhone ? parcel.receiverPhone.replace(/\D/g, '') : '';
    const phoneParam = cleanPhone.length >= 10 ? cleanPhone : '';
    return `https://wa.me/${phoneParam}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto min-h-[100dvh]">
      <div 
        className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[94dvh] flex flex-col transition-all duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-dialog-title"
      >
        {/* Header Strip with Joshi Couriers Logistics Identity */}
        <div className="bg-[#002888] dark:bg-slate-950 border-b border-blue-900/60 dark:border-slate-800 px-4 sm:px-6 py-4 text-white shrink-0 relative">
          <button 
            onClick={onClose}
            aria-label="Close admin dashboard"
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer min-w-[44px] min-h-[44px]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pr-12">
            <div>
              <div className="flex items-center gap-2 text-[#EF8E01] font-black text-xs uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Joshi Couriers: Central Operations &amp; Admin Console</span>
              </div>
              <h2 id="admin-dialog-title" className="text-xl sm:text-2xl font-black tracking-tight text-white flex flex-wrap items-center gap-2">
                <span>Fleet &amp; Dispatch Control</span>
                <span className="text-[10px] bg-emerald-500 text-white px-2.5 py-0.5 rounded-full font-bold uppercase whitespace-nowrap">
                  Live Corridor Sync
                </span>
              </h2>
              <p className="text-xs text-blue-100 dark:text-slate-300 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>Vehicle: <strong className="text-white">Mahindra Maxximo (MH21 V 6370)</strong></span>
                <span>•</span>
                <span>Crew: Anant Joshi &amp; Akash Joshi (+91 94040 40606)</span>
                <span>•</span>
                <span className="text-emerald-300 font-semibold">Morning Route: Jalna ➔ Partur ➔ Mantha</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
              <button
                onClick={copyTripManifest}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20 shadow-xs cursor-pointer min-h-[44px]"
                title="Copy formatted trip manifest for WhatsApp dispatch"
              >
                {copiedManifest ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span className="text-emerald-300">Manifest Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#EF8E01]" />
                    <span>Copy WhatsApp Manifest</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#EF8E01] hover:bg-[#d88001] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer min-h-[44px]"
              >
                <Package className="w-4 h-4" />
                <span>+ New Booking</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time KPI Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 shrink-0 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Total Freight Revenue
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                ₹{analytics.totalRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                (₹{analytics.revenueCollected} collected)
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Pending COD Collection
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-lg sm:text-xl font-black ${totalPendingCOD > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}`}>
                ₹{totalPendingCOD.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">to collect</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Daily Corridor Run
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-[#0038BD] dark:text-blue-400">
                {phaseCounts.all} Parcels
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                ({phaseCounts.picked} in van)
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">
              Morning Delivery Window
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                6:30 - 8:30 AM
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                {analytics.onTimeRatePercent}% On-Time
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 pt-2 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('manifest')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeTab === 'manifest'
                ? 'border-[#0038BD] text-[#0038BD] dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Live Parcel Manifest ({parcels.length})</span>
            {phaseCounts.pending_approval > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black leading-none animate-pulse">
                {phaseCounts.pending_approval} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeTab === 'analytics'
                ? 'border-[#0038BD] text-[#0038BD] dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Business Analytics &amp; KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('tripsheet')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeTab === 'tripsheet'
                ? 'border-[#0038BD] text-[#0038BD] dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Driver Trip Sheet (Print / Dispatch)</span>
          </button>
        </div>

        {/* Tab 1: Live Parcel Manifest & Status Controls */}
        {activeTab === 'manifest' && (
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4">
            
            {/* Quick Phase Filter Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] mr-1 hidden sm:inline">
                Corridor Phase:
              </span>
              
              <button
                type="button"
                onClick={() => setSelectedPhaseFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                  selectedPhaseFilter === 'all'
                    ? 'bg-[#0038BD] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>All Parcels</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {phaseCounts.all}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPhaseFilter('pending_approval')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                  selectedPhaseFilter === 'pending_approval'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Needs Approval</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-white">
                  {phaseCounts.pending_approval}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPhaseFilter('ordered')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                  selectedPhaseFilter === 'ordered'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Phase 1: Ordered</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500 text-white">
                  {phaseCounts.ordered}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPhaseFilter('picked')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                  selectedPhaseFilter === 'picked'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Phase 2: In Van (Picked)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500 text-white">
                  {phaseCounts.picked}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPhaseFilter('shipped')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                  selectedPhaseFilter === 'shipped'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Phase 3: Shipped (Delivered)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
                  {phaseCounts.shipped}
                </span>
              </button>
            </div>

            {/* Batch Action Alerts for Daily Morning Corridor Run */}
            {phaseCounts.pending_approval > 0 && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold">
                    !
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-950 dark:text-amber-200 text-sm">
                      {phaseCounts.pending_approval} Customer Bookings Awaiting Admin Confirmation
                    </h4>
                    <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-0.5">
                      Confirming will transition orders into Phase 1 (Ordered) for tomorrow morning's 4:00 AM dispatch.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isBulkProcessing}
                  onClick={handleBulkApprove}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-60 min-h-[44px]"
                >
                  {isBulkProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Approve All ({phaseCounts.pending_approval})</span>
                </button>
              </div>
            )}

            {phaseCounts.ordered > 0 && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0038BD] text-white flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950 dark:text-blue-200 text-sm">
                      {phaseCounts.ordered} Orders Confirmed for Jalna Pickup &amp; Loading
                    </h4>
                    <p className="text-blue-800 dark:text-blue-300 text-[11px] mt-0.5">
                      Transporter (Anant Joshi) receiving consignments into vehicle Mahindra Maxximo MH21 V 6370.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isBulkProcessing}
                  onClick={handleBulkMarkPicked}
                  className="px-4 py-2 bg-[#0038BD] hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-60 min-h-[44px]"
                >
                  {isBulkProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                  <span>Mark All Loaded (In Van)</span>
                </button>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs">
              {/* Search input */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search tracking ID, sender, receiver, phone, commodity..."
                  value={manifestSearch}
                  onChange={(e) => setManifestSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0038BD] min-h-[38px]"
                />
                {manifestSearch && (
                  <button 
                    onClick={() => setManifestSearch('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Destination filter */}
              <div className="sm:col-span-2">
                <select
                  value={selectedRouteFilter}
                  onChange={(e) => setSelectedRouteFilter(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#0038BD] min-h-[38px]"
                >
                  <option value="all">All Destinations</option>
                  <option value="partur">Partur Drops Only</option>
                  <option value="mantha">Mantha Connections Only</option>
                </select>
              </div>

              {/* Payment filter */}
              <div className="sm:col-span-2">
                <select
                  value={selectedPaymentFilter}
                  onChange={(e) => setSelectedPaymentFilter(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#0038BD] min-h-[38px]"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">COD Pending</option>
                  <option value="collected">Paid / Collected</option>
                </select>
              </div>

              {/* Sort filter */}
              <div className="sm:col-span-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-[#0038BD] min-h-[38px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="fare_desc">Highest Fare</option>
                </select>
              </div>
            </div>

            {/* Manifest Items List */}
            <div className="space-y-3">
              {filteredParcels.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    No consignments matching filters
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Try clearing search criteria or select another corridor phase.
                  </p>
                  {(manifestSearch || selectedPhaseFilter !== 'all' || selectedRouteFilter !== 'all' || selectedPaymentFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setManifestSearch('');
                        setSelectedPhaseFilter('all');
                        setSelectedRouteFilter('all');
                        setSelectedPaymentFilter('all');
                      }}
                      className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>
              ) : (
                filteredParcels.map((parcel) => {
                  const isDelivered = parcel.status === 'shipped' || parcel.status === 'delivered';
                  const isPicked = parcel.status === 'picked' || parcel.status === 'picked_up' || parcel.status === 'in_transit' || parcel.status === 'arrived_partur' || parcel.status === 'out_for_delivery';
                  const isOrdered = parcel.status === 'ordered';
                  const isPending = parcel.status === 'pending_approval';

                  return (
                    <div
                      key={parcel.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all space-y-3.5"
                    >
                      {/* Top Bar with Tracking ID, Route, Slot & Actions */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/80 pb-3">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                          {/* Tracking ID Badge */}
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80">
                            <span className="font-mono font-black text-xs sm:text-sm text-[#0038BD] dark:text-blue-300">
                              {parcel.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(parcel.id);
                                toast.info(`Copied ${parcel.id} to clipboard.`);
                              }}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-0.5"
                              title="Copy tracking ID"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Route Tag */}
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <MapPin className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                            <span>{parcel.fromCity}</span>
                            <span>➔</span>
                            <span>{parcel.toCity}</span>
                          </div>

                          {/* Delivery Slot */}
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3 text-[#EF8E01]" />
                            <span>{parcel.deliverySlot}</span>
                          </div>
                        </div>

                        {/* Top Right: Payment Badge + Direct Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Payment Toggle Pill */}
                          <button
                            type="button"
                            onClick={() => handlePaymentToggle(parcel)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                              parcel.paymentStatus === 'collected'
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                            }`}
                            title="Click to toggle payment status"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>₹{parcel.fare}</span>
                            <span className="text-[10px] uppercase font-bold ml-0.5">
                              {parcel.paymentStatus === 'collected' ? 'PAID' : 'COLLECT COD'}
                            </span>
                          </button>

                          {/* 3-Phase Direct Step Progression Action */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => {
                                approveParcelOrder(parcel.id);
                                toast.success(`Order ${parcel.id} approved by admin. Status set to Ordered.`, {
                                  title: 'Order Approved',
                                  meta: { trackingId: parcel.id },
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors min-h-[38px]"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approve Order</span>
                            </button>
                          )}

                          {isOrdered && (
                            <button
                              type="button"
                              onClick={() => {
                                markParcelPicked(parcel.id);
                                toast.success(`Parcel ${parcel.id} marked as Picked in Mahindra Maxximo MH21 V 6370.`, {
                                  title: 'Transporter Received',
                                  meta: { trackingId: parcel.id },
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors min-h-[38px]"
                            >
                              <Truck className="w-4 h-4" />
                              <span>Transporter Received (Picked)</span>
                            </button>
                          )}

                          {isPicked && (
                            <button
                              type="button"
                              onClick={() => {
                                markParcelShipped(parcel.id);
                                toast.success(`Parcel ${parcel.id} delivered safely to receiver. Handover complete.`, {
                                  title: 'Delivery Completed',
                                  meta: { trackingId: parcel.id },
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors min-h-[38px]"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Mark Shipped (Delivered)</span>
                            </button>
                          )}

                          {/* Status Dropdown Selector */}
                          <div className="flex items-center gap-1">
                            <select
                              value={parcel.status}
                              onChange={(e) => handleStatusChange(parcel.id, e.target.value as ParcelStatus)}
                              className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border cursor-pointer min-h-[38px] ${
                                isDelivered
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                  : isPicked
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                                  : isOrdered
                                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                                  : isPending
                                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                              }`}
                            >
                              <option value="pending_approval">Pending Approval</option>
                              <option value="ordered">Phase 1: Ordered (Confirmed)</option>
                              <option value="picked">Phase 2: Picked (In Van)</option>
                              <option value="shipped">Phase 3: Shipped (Delivered)</option>
                              <option value="pickup_scheduled">Pickup Scheduled (Legacy)</option>
                              <option value="picked_up">Picked Up (Legacy)</option>
                              <option value="in_transit">In Transit (Legacy)</option>
                              <option value="arrived_partur">Arrived Partur (Legacy)</option>
                              <option value="out_for_delivery">Out for Delivery (Legacy)</option>
                              <option value="delivered">Delivered (Legacy)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 3-Column Detailed Logistics Information */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs">
                        {/* Sender details with 1-click Contact */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750">
                          <span className="text-slate-400 dark:text-slate-400 font-bold uppercase text-[10px] block">
                            Sender Information (Jalna)
                          </span>
                          <strong className="text-slate-900 dark:text-slate-100 font-bold block mt-0.5">
                            {parcel.senderName}
                          </strong>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                            {parcel.senderBusiness ? `${parcel.senderBusiness} • ` : ''}{parcel.pickupAddress}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-700">
                            <a 
                              href={`tel:${parcel.senderPhone}`} 
                              className="inline-flex items-center gap-1 text-[#0038BD] dark:text-blue-400 hover:underline font-bold text-[11px]"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{parcel.senderPhone}</span>
                            </a>

                            <a
                              href={getSenderWhatsAppUrl(parcel)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold hover:bg-emerald-100"
                              title="Send WhatsApp update to sender"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>

                        {/* Receiver details with 1-click Contact & ETA */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750">
                          <span className="text-slate-400 dark:text-slate-400 font-bold uppercase text-[10px] block">
                            Receiver &amp; Drop Location ({parcel.toCity})
                          </span>
                          <strong className="text-slate-900 dark:text-slate-100 font-bold block mt-0.5">
                            {parcel.receiverName}
                          </strong>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{parcel.deliveryAddress}</span>
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-700">
                            {parcel.receiverPhone ? (
                              <>
                                <a 
                                  href={`tel:${parcel.receiverPhone}`} 
                                  className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-bold text-[11px]"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{parcel.receiverPhone}</span>
                                </a>

                                <a
                                  href={getReceiverWhatsAppUrl(parcel)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold hover:bg-emerald-100"
                                  title="Send WhatsApp ETA alert to receiver"
                                >
                                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                                  <span>WhatsApp</span>
                                </a>
                              </>
                            ) : (
                              <span className="text-slate-400 text-[11px]">No receiver phone listed</span>
                            )}
                          </div>
                        </div>

                        {/* Cargo & Notes details */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750 flex flex-col justify-between">
                          <div>
                            <span className="text-slate-400 dark:text-slate-400 font-bold uppercase text-[10px] block">
                              Commodity &amp; Packaging
                            </span>
                            <div className="flex items-center justify-between mt-0.5">
                              <strong className="text-slate-900 dark:text-slate-100 font-bold">
                                {parcel.parcelType}
                              </strong>
                              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                                {parcel.weightCategory}
                              </span>
                            </div>

                            {parcel.notes && (
                              <p className="text-amber-800 dark:text-amber-400 text-[11px] italic mt-1.5 bg-amber-50 dark:bg-amber-950/30 p-1.5 rounded border border-amber-200/60 dark:border-amber-800/40">
                                Note: {parcel.notes}
                              </p>
                            )}
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                            <span>Created: {new Date(parcel.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              MH21 V 6370 Run
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Analytics & KPIs View */}
        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Card 1: Total Freight Revenue */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Freight
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    ₹
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    ₹{analytics.totalRevenue.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>₹{analytics.revenueCollected} collected • ₹{analytics.revenuePending} pending</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Total Parcels Handled */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Consignments
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0038BD] dark:text-blue-400 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {analytics.totalParcels}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                    <span className="text-amber-700 dark:text-amber-400 font-bold">{analytics.activeParcels} active</span>
                    <span>•</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{analytics.deliveredParcels} delivered</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Average Parcel Fare */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Average Ticket
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-[#EF8E01] dark:text-amber-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    ₹{analytics.averageFare}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Transparent range: ₹70 to ₹130
                  </p>
                </div>
              </div>

              {/* Card 4: Morning Delivery On-Time Rate */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Morning Window
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    {analytics.onTimeRatePercent}%
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                    6:30 - 8:30 AM in Partur
                  </p>
                </div>
              </div>

            </div>

            {/* Vehicle & Trip Schedule Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-[#0038BD] text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#EF8E01] text-xs font-black uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Daily Morning Corridor Run: MH21 V 6370</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  Next Trip: Tomorrow Morning 4:00 - 5:00 AM Departure
                </h3>
                <p className="text-xs text-blue-100 max-w-xl">
                  Parcels collected today from Jalna shops will arrive in Partur by 6:00 - 6:30 AM. Doorstep deliveries will be completed between 6:30 AM and 8:30 AM before market opening.
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                  ● Vehicle Ready
                </span>
                <span className="text-[11px] text-blue-200">Roof Carrier + Secure Cabin</span>
              </div>
            </div>

            {/* Two-Column Analytics Charts & Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Route Breakdown */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0038BD] dark:text-blue-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Route Volume &amp; Revenue Breakdown
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Corridor share</span>
                </div>

                <div className="space-y-3">
                  {analytics.routeBreakdown.map((r, idx) => {
                    const pct = Math.round((r.count / (analytics.totalParcels || 1)) * 100) || 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                          <span>{r.route}</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {r.count} parcels (₹{r.revenue})
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex">
                          <div
                            className={`h-full rounded-full ${
                              idx === 0 ? 'bg-[#0038BD]' : idx === 1 ? 'bg-[#EF8E01]' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                          <span>{pct}% of total volume</span>
                          <span>Avg: ₹{Math.round(r.revenue / (r.count || 1))} / parcel</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-[#EF8E01]" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Merchant Cargo Categories
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">By commodity</span>
                </div>

                <div className="space-y-3">
                  {analytics.categoryBreakdown.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>{cat.category}</span>
                        <span className="text-[#0038BD] dark:text-blue-400 font-bold">
                          {cat.count} shipments ({cat.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-[#EF8E01] rounded-full"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Stage Status Pipeline */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Live Corridor Status Distribution</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {[
                  { key: 'pending_approval', label: 'Pending Approval', count: phaseCounts.pending_approval, color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' },
                  { key: 'ordered', label: 'Phase 1: Ordered', count: phaseCounts.ordered, color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800/60' },
                  { key: 'picked', label: 'Phase 2: In Van (Picked)', count: phaseCounts.picked, color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60' },
                  { key: 'shipped', label: 'Phase 3: Delivered', count: phaseCounts.shipped, color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' },
                  { key: 'cod_pending', label: 'COD Uncollected', count: parcels.filter(p => p.paymentStatus !== 'collected').length, color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border-rose-200 dark:border-rose-800/60' },
                ].map(item => (
                  <div 
                    key={item.key} 
                    className={`p-3 rounded-xl border ${item.color} text-center flex flex-col justify-center`}
                  >
                    <span className="text-xl font-black block">
                      {item.count}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider block leading-tight mt-1">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Driver Trip Sheet & WhatsApp Dispatch View */}
        {activeTab === 'tripsheet' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0038BD] dark:text-blue-400" />
                  <span>Daily Morning Corridor Run Sheet (Mahindra Maxximo MH21 V 6370)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sequential delivery run for Anant Joshi &amp; Akash Joshi. Formatted for instant WhatsApp dispatch or printout.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyTripManifest}
                  className="px-3.5 py-2 rounded-xl bg-[#0038BD] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer min-h-[44px]"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedManifest ? 'Copied!' : 'Copy for WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer min-h-[44px]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Sheet</span>
                </button>
              </div>
            </div>

            {/* Printable Trip Manifest Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs">
              <div className="p-4 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span>Departure: Jalna (4:00 - 5:00 AM)</span>
                  <span>➔</span>
                  <span>Arrival: Partur (6:00 - 6:30 AM)</span>
                </div>
                <div className="font-bold text-emerald-700 dark:text-emerald-400">
                  Total Consignments: {parcels.length} | Pending COD to Collect: ₹{totalPendingCOD}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Tracking ID</th>
                      <th className="py-2.5 px-3">Receiver &amp; Drop Address</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3">COD Due</th>
                      <th className="py-2.5 px-3">Phase Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {parcels.map((parcel, idx) => (
                      <tr key={parcel.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-black text-[#0038BD] dark:text-blue-300">
                            {parcel.id}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {parcel.fromCity} ➔ {parcel.toCity}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <strong className="text-slate-900 dark:text-slate-100 block">
                            {parcel.receiverName}
                          </strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block max-w-xs truncate">
                            {parcel.deliveryAddress}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <a href={`tel:${parcel.receiverPhone}`} className="text-[#0038BD] dark:text-blue-400 hover:underline">
                            {parcel.receiverPhone || 'N/A'}
                          </a>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {parcel.parcelType}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {parcel.weightCategory}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold">
                          {parcel.paymentStatus === 'collected' ? (
                            <span className="text-emerald-600 dark:text-emerald-400">PAID (₹{parcel.fare})</span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 font-black">₹{parcel.fare} COD</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {parcel.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Footer info & Controls */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span>Fleet: Mahindra Maxximo MH21 V 6370</span>
            <span>•</span>
            <span>Morning Route: Jalna (4:00 - 5:00 AM) ➔ Partur (6:00 - 6:30 AM) ➔ Mantha</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Doorstep Delivery: 6:30 - 8:30 AM</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="px-4 py-2 rounded-xl bg-[#EF8E01] text-white font-bold text-xs hover:bg-[#d88001] transition-colors cursor-pointer min-h-[44px]"
            >
              + Create Booking
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
