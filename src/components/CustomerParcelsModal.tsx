import React, { useState, useMemo } from 'react';
import { 
  X, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  ArrowRight, 
  Search, 
  Copy, 
  Share2, 
  RefreshCw, 
  Phone, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Plus,
  BarChart3,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  Download
} from 'lucide-react';
import { useAuthParcel } from '../context/AuthParcelContext';
import { useToast } from '../hooks/useToast';
import { ParcelItem, ParcelStatus } from '../types';

interface CustomerParcelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onOpenAuth: () => void;
}

export const CustomerParcelsModal: React.FC<CustomerParcelsModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onOpenAuth,
}) => {
  const { currentUser, userParcels, logout, getClientReports } = useAuthParcel();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<'consignments' | 'reports'>('consignments');
  const [reportTimeframe, setReportTimeframe] = useState<'this_month' | 'past_6_months' | 'yearly' | 'all_time'>('this_month');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [expandedParcelId, setExpandedParcelId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  const clientReport = useMemo(() => {
    return getClientReports(reportTimeframe);
  }, [getClientReports, reportTimeframe]);

  const handleCopyReportStatement = () => {
    const rep = clientReport;
    let text = `*JOSHI COURIERS - CLIENT DELIVERY REPORT*\n`;
    text += `*Client / Merchant:* ${currentUser?.name || 'Customer'}\n`;
    if (currentUser?.businessName) text += `*Firm:* ${currentUser.businessName}\n`;
    text += `*Registered Mobile:* ${currentUser?.phone || 'On File'}\n`;
    text += `*Reporting Window:* ${rep.timeframeLabel}\n`;
    text += `*Generated On:* ${new Date().toLocaleDateString('en-IN')}\n`;
    text += `-------------------------------------------\n`;
    text += `Total Parcels Booked: ${rep.totalOrders}\n`;
    text += `Total Logistics Spend: ₹${rep.totalSpend}\n`;
    text += `• Phase 3 (Shipped & Delivered): ${rep.shippedCount}\n`;
    text += `• Phase 2 (Picked - In Van Transit): ${rep.pickedCount}\n`;
    text += `• Phase 1 (Ordered - Approved): ${rep.orderedCount}\n`;
    text += `-------------------------------------------\n`;
    text += `Monthly Delivery Summary:\n`;
    rep.monthlyTrend.forEach((m) => {
      text += `• ${m.monthLabel}: ${m.orderCount} orders | Spend: ₹${m.totalSpend} (Delivered: ${m.shipped})\n`;
    });
    text += `\n*Corridor Fleet:* Mahindra Maxximo (MH21 V 6370)\n`;
    text += `*Direct Handover:* Anant Joshi & Akash Joshi (+91 94040 40606)\n`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    toast.success(`Delivery report for ${rep.timeframeLabel} copied to clipboard.`, {
      title: 'Report Copied',
      duration: 3500,
    });
    setTimeout(() => setCopiedReport(false), 2500);
  };

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.info(`Tracking ID ${text} copied to clipboard.`, {
      title: 'Tracking Code Copied',
      meta: { trackingId: text },
      duration: 3000,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: ParcelStatus) => {
    switch (status) {
      case 'pending_approval':
        return {
          label: 'Pending Admin Approval',
          bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
          icon: Clock,
        };
      case 'ordered':
        return {
          label: 'Phase 1: Ordered (Admin Approved)',
          bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700',
          icon: CheckCircle2,
        };
      case 'picked':
        return {
          label: 'Phase 2: Picked (Transporter Received)',
          bg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
          icon: Truck,
        };
      case 'shipped':
        return {
          label: 'Phase 3: Shipped (Delivered to Receiver)',
          bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
          icon: CheckCircle2,
        };
      case 'pickup_scheduled':
        return {
          label: 'Pickup Scheduled Today',
          bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
          icon: Clock,
        };
      case 'picked_up':
        return {
          label: 'Picked Up (In Vehicle MH21 V 6370)',
          bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700',
          icon: Package,
        };
      case 'in_transit':
        return {
          label: 'In Transit (NH-752I Jalna ➔ Partur)',
          bg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
          icon: Truck,
        };
      case 'arrived_partur':
        return {
          label: 'Arrived Partur (6:15 AM)',
          bg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
          icon: MapPin,
        };
      case 'out_for_delivery':
        return {
          label: 'Out For Delivery (6:30-8:30 AM Slot)',
          bg: 'bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700',
          icon: Truck,
        };
      case 'delivered':
        return {
          label: 'Delivered Hand-to-Hand',
          bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
          icon: CheckCircle2,
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
          icon: Package,
        };
    }
  };

  // Filter parcels
  const filteredParcels = userParcels.filter(p => {
    // Status filter
    if (statusFilter === 'active' && p.status === 'delivered') return false;
    if (statusFilter === 'delivered' && p.status !== 'delivered') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = p.id.toLowerCase().includes(q);
      const matchReceiver = p.receiverName.toLowerCase().includes(q);
      const matchTo = p.toCity.toLowerCase().includes(q);
      const matchType = p.parcelType.toLowerCase().includes(q);
      return matchId || matchReceiver || matchTo || matchType;
    }
    return true;
  });

  const activeCount = userParcels.filter(p => p.status !== 'delivered').length;
  const deliveredCount = userParcels.filter(p => p.status === 'delivered').length;
  const totalFreight = userParcels.reduce((sum, p) => sum + p.fare, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-4 sm:my-8 max-h-[90dvh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="bg-[#0038BD] px-4 sm:px-6 py-4 sm:py-5 text-white shrink-0 relative">
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-10">
            <div>
              <div className="flex items-center gap-2 text-[#EF8E01] font-bold text-xs uppercase tracking-wider mb-1">
                <Package className="w-4 h-4" />
                <span>Regular Sender Dashboard</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>My Parcels &amp; Shipments</span>
              </h2>
              {currentUser ? (
                <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                  Showing shipments for <strong className="text-white">{currentUser.name}</strong>
                  {currentUser.businessName ? ` (${currentUser.businessName})` : ''}
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                  Sign in to view your business parcel history.
                </p>
              )}
            </div>

            {/* Quick Action in Header */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#EF8E01] hover:bg-[#d88001] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Pickup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick User State Strip */}
        <div className="bg-blue-50 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 px-4 sm:px-6 py-3 shrink-0 flex flex-wrap items-center justify-between gap-2">
          {currentUser ? (
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                <span>Phone: <strong className="text-slate-900 dark:text-slate-100">{currentUser.phone}</strong></span>
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium hidden sm:inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#EF8E01]" />
                <span>Default Pickup: <strong className="text-slate-900 dark:text-slate-100">{currentUser.defaultAddress}</strong></span>
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-700 dark:text-slate-300">
                Sign in with Google or Email to view and track your registered shipments.
              </span>
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-[#0038BD] dark:text-blue-400 hover:underline"
              >
                Sign In Now
              </button>
            </div>
          )}

          {currentUser && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-[#0038BD] dark:text-blue-400 hover:underline"
              >
                Switch Account
              </button>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <button
                onClick={logout}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Tab Switcher: Consignments vs Delivery Reports */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('consignments')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              viewMode === 'consignments'
                ? 'border-[#0038BD] text-[#0038BD] dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Consignments ({userParcels.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setViewMode('reports')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              viewMode === 'reports'
                ? 'border-[#0038BD] text-[#0038BD] dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#EF8E01]" />
            <span>Delivery Reports &amp; Analytics</span>
          </button>
        </div>

        {viewMode === 'consignments' ? (
          <>
            {/* Metrics Grid */}
            <div className="px-4 sm:px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Total Shipments
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 block">
                  {userParcels.length}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Jalna ➔ Partur/Mantha</span>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Active / In Transit
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-300 mt-0.5 block">
                  {activeCount}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400/80 font-medium">Tomorrow 6:30-8:30 AM drop</span>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Delivered
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-300 mt-0.5 block">
                  {deliveredCount}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 font-medium">100% Hand-to-hand</span>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Total Freight Value
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0038BD] dark:text-blue-400 mt-0.5 block">
                  ₹{totalFreight}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Cash / UPI on delivery</span>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by Tracking ID (e.g. JC-74891), Receiver, or City..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0038BD] focus:border-transparent bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-[#0038BD] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  All ({userParcels.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter('delivered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    statusFilter === 'delivered'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Delivered ({deliveredCount})
                </button>
              </div>
            </div>

            {/* Parcel List (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredParcels.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No parcels found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                {searchQuery
                  ? `No shipments match "${searchQuery}". Try a different keyword.`
                  : "You don't have any parcels under this filter."}
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="px-4 py-2 rounded-xl bg-[#EF8E01] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Book a Doorstep Pickup Now</span>
              </button>
            </div>
          ) : (
            filteredParcels.map(parcel => {
              const badge = getStatusBadge(parcel.status);
              const BadgeIcon = badge.icon;
              const isExpanded = expandedParcelId === parcel.id;

              return (
                <div
                  key={parcel.id}
                  className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all overflow-hidden"
                >
                  {/* Top Bar of Card */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0038BD]/10 dark:bg-blue-950/60 text-[#0038BD] dark:text-blue-400 flex items-center justify-center font-black text-sm shrink-0">
                        <Package className="w-5 h-5 text-[#0038BD] dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                            {parcel.id}
                          </span>
                          <button
                            onClick={() => handleCopy(parcel.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                            title="Copy Tracking ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedId === parcel.id && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              Copied!
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Booked: {new Date(parcel.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                        <BadgeIcon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </span>
                      <span className="text-sm font-black text-[#0038BD] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900/60">
                        ₹{parcel.fare}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Route Info */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] block">
                        Route Corridor
                      </span>
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
                        <span>{parcel.fromCity}</span>
                        <ArrowRight className="w-4 h-4 text-[#EF8E01]" />
                        <span>{parcel.toCity}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Slot: <strong className="text-slate-700 dark:text-slate-300">{parcel.deliverySlot}</strong>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Pickup: {parcel.pickupAddress}
                      </p>
                    </div>

                    {/* Receiver Info */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] block">
                        Receiver / Drop Details
                      </span>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {parcel.receiverName}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{parcel.receiverPhone}</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate flex items-center gap-1" title={parcel.deliveryAddress}>
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{parcel.deliveryAddress}</span>
                      </p>
                    </div>

                    {/* Parcel Details & Payment */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] block">
                        Package Description
                      </span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {parcel.parcelType}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Weight: {parcel.weightCategory}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          parcel.paymentStatus === 'collected'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {parcel.paymentStatus === 'collected' ? 'Payment Received' : 'COD: Pay on Delivery'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Tracking Timeline */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 py-4 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                        <span>Shipment Journey &amp; Milestones</span>
                      </h4>
                      
                      <div className="space-y-3 border-l-2 border-blue-200 dark:border-blue-900/80 ml-2.5 pl-4 text-xs">
                        {parcel.history.map((hist, idx) => (
                          <div key={idx} className="relative">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#0038BD] dark:bg-blue-500 absolute -left-[21px] top-1 ring-4 ring-blue-100 dark:ring-blue-950" />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <strong className="text-slate-900 dark:text-slate-100 font-bold">
                                {hist.note}
                              </strong>
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                                {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {hist.location}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Carried directly by Akash Joshi &amp; Father in Mahindra Maxximo MH21 V 6370 without hub rerouting.</span>
                      </div>
                    </div>
                  )}

                  {/* Card Bottom Actions */}
                  <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setExpandedParcelId(isExpanded ? null : parcel.id)}
                      className="text-xs font-bold text-[#0038BD] dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Timeline' : 'View Live Timeline'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `*Joshi Couriers Parcel Tracking*%0A` +
                          `Tracking ID: ${parcel.id}%0A` +
                          `Route: ${parcel.fromCity} ➔ ${parcel.toCity}%0A` +
                          `Receiver: ${parcel.receiverName}%0A` +
                          `Delivery Window: ${parcel.deliverySlot}%0A` +
                          `Courier: Akash Joshi (+91 94040 40606)`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="hidden sm:inline">WhatsApp Receipt</span>
                      </a>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenBooking();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#EF8E01] hover:bg-[#d88001] text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-book Pickup</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
          </>
        ) : (
          /* Delivery Reports & Analytics View */
          <div className="p-4 sm:p-6 space-y-5 flex-1 overflow-y-auto">
            {/* Timeframe selector header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-amber-50/50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700">
              <div>
                <span className="text-[11px] font-bold text-[#0038BD] dark:text-blue-400 uppercase tracking-wider block">
                  Reporting Period
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {clientReport.timeframeLabel}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Synchronised dispatch records for {currentUser?.name || 'Registered Account'}
                </p>
              </div>

              {/* Timeframe Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: 'this_month', label: 'This Month' },
                  { key: 'past_6_months', label: 'Past 6 Months' },
                  { key: 'yearly', label: 'Yearly (2026)' },
                  { key: 'all_time', label: 'All Time' },
                ].map((tf) => (
                  <button
                    key={tf.key}
                    type="button"
                    onClick={() => setReportTimeframe(tf.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      reportTimeframe === tf.key
                        ? 'bg-[#0038BD] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleCopyReportStatement}
                  className="px-3 py-1.5 rounded-xl bg-[#EF8E01] hover:bg-[#d88001] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors ml-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedReport ? 'Copied' : 'Copy Statement'}</span>
                </button>
              </div>
            </div>

            {/* 4 Report Summary KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  <Package className="w-4 h-4 text-[#0038BD]" />
                  <span>Total Ordered</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 block">
                  {clientReport.totalOrders}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Consignments booked
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Total Freight</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-[#0038BD] dark:text-blue-400 mt-1 block">
                  ₹{clientReport.totalSpend}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Logistics investment
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Phase 3: Shipped</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-300 mt-1 block">
                  {clientReport.shippedCount}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {clientReport.totalOrders > 0
                    ? `${Math.round((clientReport.shippedCount / clientReport.totalOrders) * 100)}% delivered safely`
                    : 'Delivered to receiver'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/60 shadow-2xs">
                <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Active In-Transit</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-blue-800 dark:text-blue-300 mt-1 block">
                  {clientReport.orderedCount + clientReport.pickedCount}
                </span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 block mt-0.5">
                  {clientReport.orderedCount} ordered, {clientReport.pickedCount} in van
                </span>
              </div>
            </div>

            {/* Monthly Trend Visualizer */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#EF8E01]" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Monthly Parcel Delivery Activity
                  </h4>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {clientReport.monthlyTrend.length} months tracked
                </span>
              </div>

              {clientReport.monthlyTrend.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No delivery data available for this timeframe.
                </p>
              ) : (
                <div className="space-y-3">
                  {clientReport.monthlyTrend.map((m) => {
                    const maxOrders = Math.max(...clientReport.monthlyTrend.map((x) => x.orderCount), 1);
                    const pct = Math.round((m.orderCount / maxOrders) * 100) || 0;
                    return (
                      <div key={m.monthKey} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {m.monthLabel}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">
                              {m.orderCount} parcels ({m.shipped} shipped)
                            </span>
                            <span className="font-mono font-bold text-[#0038BD] dark:text-blue-400">
                              ₹{m.totalSpend}
                            </span>
                          </div>
                        </div>

                        {/* Visual Bar */}
                        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden flex">
                          <div
                            className="h-full bg-gradient-to-r from-[#0038BD] to-[#EF8E01] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 6)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Itemized Consignments in this Period */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#0038BD]" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Orders in {clientReport.timeframeLabel} ({clientReport.ordersInPeriod.length})
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('consignments')}
                  className="text-xs font-bold text-[#0038BD] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Manage All &rarr;
                </button>
              </div>

              {clientReport.ordersInPeriod.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No orders recorded during this period.
                </p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {clientReport.ordersInPeriod.map((ord) => {
                    const badge = getStatusBadge(ord.status);
                    const BadgeIcon = badge.icon;
                    return (
                      <div key={ord.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                              {ord.id}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500">•</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">
                              {ord.fromCity} ➔ {ord.toCity}
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                            Receiver: {ord.receiverName} ({ord.receiverPhone}) • {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            ₹{ord.fare}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                            <BadgeIcon className="w-3 h-3 shrink-0" />
                            <span>{badge.label}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Dispatch Corridor Note */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0038BD] shrink-0" />
                <span>
                  All consignments delivered on the Jalna ➔ Partur (6:30-8:30 AM) &amp; Mantha morning run in Mahindra Maxximo MH21 V 6370.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('consignments')}
                className="text-[#0038BD] dark:text-blue-400 font-bold hover:underline shrink-0 cursor-pointer"
              >
                View Consignments &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <p>
            Daily Morning Delivery: <strong className="text-slate-800 dark:text-slate-200">Partur 6:30 - 8:30 AM</strong> • Mantha 8:30 - 10:00 AM.
          </p>
          <a
            href="tel:+919404040606"
            className="font-bold text-[#0038BD] dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Driver Hotline: +91 94040 40606</span>
          </a>
        </div>
      </div>
    </div>
  );
};
