export interface ServiceOffer {
  id: string;
  num: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
  iconName: string;
}

export interface StatItem {
  value: string;
  label: string;
  desc: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  location: string;
  category: string;
  date: string;
}

export interface PickupFormData {
  fromLocationId: string;
  toLocationId: string;
  fromCity?: string;
  toCity?: string;
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  receiverName?: string;
  receiverPhone?: string;
  deliveryAddress?: string;
  parcelType: string;
  weightCategory: string;
  notes: string;
}

export type UserRole = 'customer' | 'admin' | 'team';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  businessName?: string;
  city: string;
  defaultAddress: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type TrackingPhase = 'ordered' | 'picked' | 'shipped';

export type ParcelStatus = 
  | 'pending_approval'
  | 'ordered'
  | 'picked'
  | 'shipped'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'in_transit'
  | 'arrived_partur'
  | 'out_for_delivery'
  | 'delivered';

export interface ParcelStatusHistory {
  status: ParcelStatus;
  timestamp: string;
  location: string;
  note: string;
}

export interface ParcelItem {
  id: string; // e.g. JC-91024
  userId: string; // user id or 'guest'
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  senderBusiness?: string;
  pickupAddress: string;
  fromLocationId: string;
  fromCity: string;
  toLocationId: string;
  toCity: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  deliveryAddress: string;
  parcelType: string;
  weightCategory: string;
  notes?: string;
  fare: number;
  paymentMode: 'cash_on_delivery' | 'upi_on_delivery';
  paymentStatus: 'pending' | 'collected';
  status: ParcelStatus;
  createdAt: string;
  scheduledDeliveryDate: string;
  deliverySlot: string; // e.g. "Tomorrow 6:30-8:30 AM"
  history: ParcelStatusHistory[];
}

export interface ClientMonthlyStat {
  monthKey: string; // e.g. '2026-09'
  monthLabel: string; // e.g. 'Sep 2026'
  orderCount: number;
  totalSpend: number;
  ordered: number;
  picked: number;
  shipped: number;
}

export interface ClientReportSummary {
  timeframe: 'this_month' | 'past_6_months' | 'yearly' | 'all_time';
  timeframeLabel: string;
  totalOrders: number;
  totalSpend: number;
  orderedCount: number;
  pickedCount: number;
  shippedCount: number;
  monthlyTrend: ClientMonthlyStat[];
}

export interface AnalyticsSummary {
  totalParcels: number;
  activeParcels: number;
  deliveredParcels: number;
  totalRevenue: number;
  averageFare: number;
  revenueCollected: number;
  revenuePending: number;
  onTimeRatePercent: number;
  routeBreakdown: { route: string; count: number; revenue: number }[];
  categoryBreakdown: { category: string; count: number; percentage: number }[];
  statusBreakdown: Record<ParcelStatus, number>;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastMeta {
  trackingId?: string;
  route?: string;
  fee?: number;
  pincode?: string;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
  meta?: ToastMeta;
  createdAt: number;
}

export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
  meta?: ToastMeta;
}
