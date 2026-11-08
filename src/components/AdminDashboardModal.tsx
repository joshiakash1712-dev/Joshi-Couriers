import React, { useState } from 'react';
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
  Users, 
  Calendar, 
  FileText, 
  Copy, 
  Check, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  RotateCcw,
  Search,
  ChevronRight,
  ShieldCheck,
  AlertCircle
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
  const { parcels, analytics, updateParcelStatus, approveParcelOrder, markParcelPicked, markParcelShipped } = useAuthParcel();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'analytics' | 'manifest'>('analytics');
  const [manifestSearch, setManifestSearch] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('all');
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStatusChange = (parcelId: string, newStatus: ParcelStatus) => {
    updateParcelStatus(parcelId, newStatus);
    const friendlyStatus = newStatus.replace(/_/g, ' ');
    setStatusUpdateSuccess(`Updated #${parcelId} to ${friendlyStatus}`);
    toast.success(`Parcel ${parcelId} status updated to ${friendlyStatus}.`, {
      title: 'Status Updated',
      meta: { trackingId: parcelId },
      duration: 3500,
    });
    setTimeout(() => setStatusUpdateSuccess(null), 3000);
  };

  const copyTripManifest = () => {
    const activeParcels = parcels.filter(p => p.status !== 'delivered');
    let text = `*JOSHI COURIERS - MORNING RUN MANIFEST*\n`;
    text += `*Vehicle:* Mahindra Maxximo (MH21 V 6370)\n`;
    text += `*Operated by:* Anant Joshi & his son (Akash Joshi) (+91 94040 40606)\n`;
    text += `*Date:* ${new Date().toLocaleDateString('en-IN')}\n`;
    text += `*Route:* Jalna (4-5 AM) ➔ Partur (6-6:30 AM) ➔ Mantha (8:30 AM)\n`;
    text += `-------------------------------------------\n\n`;

    activeParcels.forEach((p, idx) => {
      text += `${idx + 1}. [${p.id}] ${p.fromCity} ➔ ${p.toCity}\n`;
      text += `   To: ${p.receiverName} (${p.receiverPhone})\n`;
      text += `   Drop: ${p.deliveryAddress}\n`;
      text += `   Item: ${p.parcelType} (${p.weightCategory})\n`;
      text += `   Fare: ₹${p.fare} (${p.paymentStatus === 'collected' ? 'PAID' : 'COLLECT COD'})\n\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedManifest(true);
    toast.info('Morning trip manifest copied to clipboard for driver dispatch.', {
      title: 'Manifest Copied',
      duration: 3500,
    });
    setTimeout(() => setCopiedManifest(false), 2500);
  };

  const filteredParcels = parcels.filter(p => {
    if (selectedRouteFilter !== 'all') {
      if (selectedRouteFilter === 'partur' && p.toLocationId !== 'partur') return false;
      if (selectedRouteFilter === 'mantha' && p.toLocationId !== 'mantha') return false;
    }
    if (manifestSearch.trim()) {
      const q = manifestSearch.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.senderName.toLowerCase().includes(q) ||
        p.receiverName.toLowerCase().includes(q) ||
        p.parcelType.toLowerCase().includes(q)
      );
    }
    return true;
  });

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-4 sm:my-8 max-h-[92dvh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Strip */}
        <div className="bg-[#002888] px-4 sm:px-6 py-4 sm:py-5 text-white shrink-0 relative">
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
                <ShieldCheck className="w-4 h-4" />
                <span>Joshi Couriers • Operations &amp; Admin Hub</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Fleet &amp; Business Analytics</span>
                <span className="text-[10px] bg-[#EF8E01] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                  Live View
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
                Vehicle: <strong className="text-white">Mahindra Maxximo (MH21 V 6370)</strong> • Operated by: Anant Joshi &amp; his son (Akash Joshi)
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={copyTripManifest}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20"
                title="Copy trip sheet for WhatsApp or printing"
              >
                {copiedManifest ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-[#EF8E01]" />}
                <span>{copiedManifest ? 'Manifest Copied!' : 'Copy Morning Manifest'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status notification toast */}
        {statusUpdateSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
            <span>✓ {statusUpdateSuccess}</span>
            <button onClick={() => setStatusUpdateSuccess(null)} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 pt-3 bg-slate-50 dark:bg-slate-950 shrink-0">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 mr-6 transition-colors flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'border-[#0038BD] text-[#0038BD] dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Business Analytics &amp; KPIs</span>
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'manifest'
                ? 'border-[#0038BD] text-[#0038BD] dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Live Parcel Manifest ({parcels.length})</span>
          </button>
        </div>

        {/* Tab 1: Analytics & KPIs View */}
        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Card 1: Total Freight Revenue */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
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
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Parcels
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
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Average Fare
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

              {/* Card 4: Morning On-Time Delivery Rate */}
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs transition-shadow">
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
                    const pct = Math.round((r.count / analytics.totalParcels) * 100) || 0;
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
                          <span>Avg: ₹{Math.round(r.revenue / r.count)} / parcel</span>
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
                <span>Live Pipeline Status Distribution</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { key: 'pickup_scheduled', label: 'Pickup Scheduled', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' },
                  { key: 'picked_up', label: 'Picked Up (In Van)', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800/60' },
                  { key: 'in_transit', label: 'In Transit (NH-752I)', color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60' },
                  { key: 'arrived_partur', label: 'Arrived Partur', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800/60' },
                  { key: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800/60' },
                  { key: 'delivered', label: 'Delivered', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' },
                ].map(item => (
                  <div 
                    key={item.key} 
                    className={`p-2.5 rounded-xl border ${item.color} text-center flex flex-col justify-center`}
                  >
                    <span className="text-lg font-black block">
                      {analytics.statusBreakdown[item.key as ParcelStatus] || 0}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider block leading-tight mt-0.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Live Parcel Manifest & Status Controls */}
        {activeTab === 'manifest' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter manifest by ID, sender, receiver, item..."
                  value={manifestSearch}
                  onChange={(e) => setManifestSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0038BD]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedRouteFilter}
                  onChange={(e) => setSelectedRouteFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <option value="all">All Destinations</option>
                  <option value="partur">Partur Drops Only</option>
                  <option value="mantha">Mantha Connections Only</option>
                </select>

                <button
                  onClick={copyTripManifest}
                  className="px-3 py-2 rounded-xl bg-[#EF8E01] hover:bg-[#d88001] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Trip Sheet</span>
                </button>
              </div>
            </div>

            {/* Manifest Items List */}
            <div className="space-y-3">
              {filteredParcels.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Package className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No shipments found on this manifest</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    New parcel bookings from Jalna to Partur/Mantha will automatically appear here in real-time.
                  </p>
                </div>
              ) : (
                filteredParcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-[#0038BD] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/60">
                        {parcel.id}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {parcel.fromCity} ➔ {parcel.toCity}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({parcel.deliverySlot})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        ₹{parcel.fare} ({parcel.paymentStatus === 'collected' ? 'PAID' : 'COD'})
                      </span>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-1.5">
                        {/* 3-Phase Direct Action Button */}
                        {parcel.status === 'pending_approval' && (
                          <button
                            type="button"
                            onClick={() => {
                              approveParcelOrder(parcel.id);
                              toast.success(`Parcel ${parcel.id} approved by admin. Status set to Ordered.`, {
                                title: 'Order Approved',
                                meta: { trackingId: parcel.id },
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve Order</span>
                          </button>
                        )}
                        {parcel.status === 'ordered' && (
                          <button
                            type="button"
                            onClick={() => {
                              markParcelPicked(parcel.id);
                              toast.success(`Parcel ${parcel.id} marked as Picked by transporter in MH21 V 6370.`, {
                                title: 'Transporter Received',
                                meta: { trackingId: parcel.id },
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Transporter Received (Picked)</span>
                          </button>
                        )}
                        {parcel.status === 'picked' && (
                          <button
                            type="button"
                            onClick={() => {
                              markParcelShipped(parcel.id);
                              toast.success(`Parcel ${parcel.id} marked as Shipped & Delivered to receiver.`, {
                                title: 'Delivery Completed',
                                meta: { trackingId: parcel.id },
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Shipped (Delivered)</span>
                          </button>
                        )}

                        <label className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                          Phase / Status:
                        </label>
                        <select
                          value={parcel.status}
                          onChange={(e) => handleStatusChange(parcel.id, e.target.value as ParcelStatus)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border cursor-pointer ${
                            parcel.status === 'shipped' || parcel.status === 'delivered'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                              : parcel.status === 'picked' || parcel.status === 'picked_up'
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                              : parcel.status === 'ordered'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                              : parcel.status === 'pending_approval'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          <option value="pending_approval">Pending Approval</option>
                          <option value="ordered">Phase 1: Ordered (Approved)</option>
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] block">
                        Sender Details
                      </span>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold block">
                        {parcel.senderName}
                      </strong>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {parcel.senderBusiness || parcel.pickupAddress}
                      </p>
                      <a href={`tel:${parcel.senderPhone}`} className="text-[#0038BD] dark:text-blue-400 font-medium flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{parcel.senderPhone}</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] block">
                        Receiver / Drop Point
                      </span>
                      <strong className="text-slate-900 dark:text-slate-100 font-bold block">
                        {parcel.receiverName}
                      </strong>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate flex items-center gap-1" title={parcel.deliveryAddress}>
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{parcel.deliveryAddress}</span>
                      </p>
                      <a href={`tel:${parcel.receiverPhone}`} className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{parcel.receiverPhone}</span>
                      </a>
                    </div>

                    <div>
                      <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] block">
                        Parcel / Commodity
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 font-semibold">
                        {parcel.parcelType}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Weight: {parcel.weightCategory}
                      </p>
                      {parcel.notes && (
                        <p className="text-amber-800 dark:text-amber-400 text-[10px] italic mt-0.5">
                          Note: {parcel.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )))}
            </div>

          </div>
        )}

        {/* Footer info & Reset option */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>Fleet: Mahindra Maxximo MH21 V 6370</span>
            <span>•</span>
            <span>Jalna (4-5 AM) ➔ Partur (6-6:30 AM) ➔ Mantha</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#EF8E01] text-white font-bold text-xs hover:bg-[#d88001] transition-colors"
            >
              + Create Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
