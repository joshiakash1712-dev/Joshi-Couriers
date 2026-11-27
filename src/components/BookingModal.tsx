import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  MapPin, 
  Package, 
  ShieldCheck, 
  Calculator, 
  ArrowRightLeft,
  Navigation,
  Lock,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PickupFormData } from '../types';
import { ROUTE_LOCATIONS } from '../data/locations';
import { LocationSearchSelect } from './LocationSearchSelect';
import { useAuthParcel } from '../context/AuthParcelContext';
import { useToast } from '../hooks/useToast';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFromId?: string;
  initialToId?: string;
  onViewMyParcels?: () => void;
  onOpenAuth?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose,
  initialFromId = 'jalna',
  initialToId = 'partur',
  onViewMyParcels,
  onOpenAuth
}) => {
  const { currentUser, createParcelBooking, signInWithGoogle } = useAuthParcel();
  const toast = useToast();
  const [createdParcelId, setCreatedParcelId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [formData, setFormData] = useState<PickupFormData>({
    fromLocationId: initialFromId,
    toLocationId: initialToId,
    senderName: '',
    senderPhone: '',
    pickupAddress: '',
    receiverName: '',
    receiverPhone: '',
    deliveryAddress: '',
    parcelType: 'Documents / Legal Papers',
    weightCategory: 'Under 1 kg (Light)',
    notes: '',
  });

  // Autofill sender details if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        senderName: prev.senderName || currentUser.name,
        senderPhone: prev.senderPhone || currentUser.phone,
        pickupAddress: prev.pickupAddress || currentUser.defaultAddress,
      }));
    }
  }, [currentUser, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const [submitted, setSubmitted] = useState(false);

  const fromLocation = ROUTE_LOCATIONS.find(l => l.id === formData.fromLocationId) || ROUTE_LOCATIONS[0];
  const toLocation = ROUTE_LOCATIONS.find(l => l.id === formData.toLocationId) || ROUTE_LOCATIONS[ROUTE_LOCATIONS.length - 1];

  const handleSwapLocations = () => {
    setFormData(prev => ({
      ...prev,
      fromLocationId: prev.toLocationId,
      toLocationId: prev.fromLocationId,
    }));
  };

  const calculateDistance = () => {
    return Math.abs(toLocation.distanceKm - fromLocation.distanceKm) || 15;
  };

  const getEstimatedFee = () => {
    let fee = 70;
    if (formData.parcelType.includes('Documents')) fee = 70;
    else if (formData.parcelType.includes('Medicines')) fee = 75;
    else if (formData.parcelType.includes('Clothing')) fee = 80;
    else if (formData.parcelType.includes('Auto') || formData.parcelType.includes('Machinery')) fee = 100;
    else if (formData.parcelType.includes('Food') || formData.parcelType.includes('Sweets')) fee = 75;
    else fee = 70;

    if (formData.weightCategory.includes('1 to 3')) fee += 15;
    else if (formData.weightCategory.includes('3 to 5')) fee += 30;
    else if (formData.weightCategory.includes('5 to 15') || formData.weightCategory.includes('5 to 10')) fee += 45;
    else if (formData.weightCategory.includes('10+') || formData.weightCategory.includes('15 to 25')) fee += 60;

    return Math.min(Math.max(fee, 70), 130);
  };

  const generateWhatsAppUrl = (trackingId?: string | null) => {
    const text = `*New Parcel Pickup Request - Joshi Couriers*` + (trackingId ? ` [%23${trackingId}]` : '') + `%0A%0A` +
      `Pickup Point: ${fromLocation.name} (${fromLocation.marathiName}) [PIN: ${fromLocation.pincode}]%0A` +
      `Delivery Destination: ${toLocation.name} (${toLocation.marathiName}) [PIN: ${toLocation.pincode}]%0A` +
      `Route: NH-752I Jalna-Partur corridor (~${calculateDistance()} km)%0A%0A` +
      `Sender Name: ${formData.senderName || 'Customer'}%0A` +
      `Sender Phone: ${formData.senderPhone || 'Not provided'}%0A` +
      `Pickup Address in ${fromLocation.name}: ${formData.pickupAddress || 'To be shared on call'}%0A%0A` +
      (formData.receiverName ? `Receiver Name: ${formData.receiverName}%0A` : '') +
      (formData.receiverPhone ? `Receiver Phone: ${formData.receiverPhone}%0A` : '') +
      (formData.deliveryAddress ? `Drop Address in ${toLocation.name}: ${formData.deliveryAddress}%0A` : '') +
      `Contents: ${formData.parcelType}%0A` +
      `Weight Bracket: ${formData.weightCategory}%0A` +
      `Est. Delivery Fee: ₹${getEstimatedFee()} (Pay on Safe Delivery)%0A` +
      (formData.notes ? `Special Instructions: ${formData.notes}%0A` : '') +
      `%0APlease confirm pickup time slot and driver dispatch.`;
    return `https://wa.me/919404040606?text=${text}`;
  };

  const handleQuickGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in successfully. You can now submit your parcel booking.', {
        title: 'Account Verified',
        duration: 3500,
      });
    } catch (err: any) {
      toast.error(err?.message || 'Could not complete Google Sign-In. Please try again.', {
        title: 'Sign In Cancelled',
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please sign in first so your parcel booking is saved securely in your account.', {
        title: 'Sign In Required',
      });
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (formData.fromLocationId === formData.toLocationId) {
      toast.error('Pickup point and delivery destination must be different locations.', {
        title: 'Invalid Route Selection',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const fee = getEstimatedFee();
      const created = await createParcelBooking(formData, fee);
      setCreatedParcelId(created.id);

      toast.success(
        `Pickup request for parcel ${created.id} saved for morning dispatch from ${fromLocation.name} to ${toLocation.name}.`,
        {
          title: 'Pickup Request Confirmed',
          duration: 7000,
          meta: {
            trackingId: created.id,
            route: `${fromLocation.name} to ${toLocation.name}`,
            fee: fee,
          },
          action: onViewMyParcels
            ? {
                label: 'View in My Parcels',
                onClick: () => {
                  onClose();
                  onViewMyParcels();
                },
              }
            : undefined,
        }
      );

      setSubmitted(true);
    } catch (err: any) {
      if (err?.message === 'AUTH_REQUIRED') {
        toast.error('Please sign in to save your parcel booking.', {
          title: 'Authentication Required',
        });
        if (onOpenAuth) onOpenAuth();
      } else {
        toast.error('Could not save your parcel booking to the database. Please check your connection and try again.', {
          title: 'Booking Save Failed',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="booking-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 min-h-[100dvh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div 
            key="booking-modal-card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4"
          >
            
            {/* Modal Header */}
            <div className="bg-[#0038BD] text-white p-5 sm:p-7 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-[#EF8E01] uppercase tracking-wider mb-1">
                <Package className="w-4 h-4" />
                <span>Doorstep Courier Booking</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Book Parcel Pickup</h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1">
                Pickup today in Jalna ➔ Next morning delivery (6:30-8:30 AM) in Partur • Cash / UPI on Delivery
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="booking-success-view"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 sm:p-8 text-center space-y-4"
                >
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: [0.85, 1.35, 1.45], opacity: [0.5, 0.2, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.8 }}
                      className="absolute inset-0 bg-emerald-400 rounded-full pointer-events-none"
                    />
                    <motion.div 
                      initial={{ scale: 0, rotate: -25 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.08 }}
                      className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shadow-xs relative z-10"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                  </div>
                  
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 text-[#0038BD] dark:text-blue-300 px-3.5 py-1 rounded-full text-xs font-mono font-bold mb-2 border border-blue-100 dark:border-blue-800 shadow-2xs">
                      <Package className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                      <span>Tracking ID: {createdParcelId || 'JC-REGISTERED'}</span>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-slate-100">Pickup Request Confirmed</h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Your shipment record is saved permanently in the corridor database under your account.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl text-xs text-slate-700 dark:text-slate-300 text-left space-y-2 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    <p><strong>Route:</strong> {fromLocation.name} ➔ {toLocation.name}</p>
                    <p><strong>Delivery Slot:</strong> Tomorrow Morning 6:30-8:30 AM</p>
                    <p><strong>Sender:</strong> {formData.senderName || 'Customer'} ({formData.senderPhone})</p>
                    <p><strong>Receiver:</strong> {formData.receiverName || 'Shop owner'} ({formData.receiverPhone || 'N/A'})</p>
                    <p><strong>Delivery Fee:</strong> ₹{getEstimatedFee()} (Cash / UPI on safe delivery)</p>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-2">
                    <a
                      href={generateWhatsAppUrl(createdParcelId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1fb858] rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors min-h-[44px]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send Dispatch Copy on WhatsApp</span>
                    </a>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {onViewMyParcels && (
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false);
                            onClose();
                            onViewMyParcels();
                          }}
                          className="w-full py-3 px-4 text-xs font-bold text-white bg-[#0038BD] hover:bg-[#002d99] rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors min-h-[44px] cursor-pointer"
                        >
                          <Package className="w-4 h-4" />
                          <span>View in My Parcels</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          onClose();
                        }}
                        className={`w-full py-3 px-4 text-xs font-bold rounded-xl transition-colors min-h-[44px] cursor-pointer ${
                          onViewMyParcels 
                            ? 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700' 
                            : 'text-white bg-[#0038BD] hover:bg-[#002d99]'
                        }`}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  key="booking-form-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit} 
                  className="p-5 sm:p-7 space-y-4 text-left max-h-[80dvh] overflow-y-auto"
                >
                  {/* Authentication Gate Banner when Signed Out */}
                  {!currentUser && (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-2.5 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-amber-950 dark:text-amber-200 text-sm">
                            Sign in required to save your booking
                          </h4>
                          <p className="text-amber-900/90 dark:text-amber-300/90 text-[11px] mt-0.5 leading-relaxed">
                            All shipments are stored permanently under your verified account so records stay preserved and trackable until cleared by an admin.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={handleQuickGoogleSignIn}
                          disabled={isSigningIn}
                          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center gap-2 shadow-2xs cursor-pointer min-h-[40px] disabled:opacity-60"
                        >
                          {isSigningIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                          <span>{isSigningIn ? 'Connecting Google...' : 'Continue with Google'}</span>
                        </button>
                        {onOpenAuth && (
                          <button
                            type="button"
                            onClick={onOpenAuth}
                            className="px-3.5 py-2 rounded-xl bg-[#0038BD] hover:bg-[#002d99] text-white font-bold text-xs cursor-pointer min-h-[40px]"
                          >
                            Sign In with Email
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Location Selector (From -> To with swap) */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                        <span>1. Select Pickup &amp; Delivery Locations</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSwapLocations}
                        className="text-[11px] font-bold text-[#0038BD] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Swap Pickup and Delivery Locations"
                      >
                        <ArrowRightLeft className="w-3 h-3 text-[#EF8E01]" />
                        <span>Swap</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <LocationSearchSelect
                        id="booking-pickup-location"
                        label="Pickup Location (From)"
                        value={formData.fromLocationId}
                        onChange={(locId) => setFormData(prev => ({ ...prev, fromLocationId: locId }))}
                        excludeId={formData.toLocationId}
                        required
                      />

                      <LocationSearchSelect
                        id="booking-delivery-destination"
                        label="Delivery Destination (To)"
                        value={formData.toLocationId}
                        onChange={(locId) => setFormData(prev => ({ ...prev, toLocationId: locId }))}
                        excludeId={formData.fromLocationId}
                        required
                      />
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                        Popular Route Pairs:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { from: 'jalna', to: 'partur', label: 'Jalna ↔ Partur' },
                          { from: 'jalna', to: 'watur-phata', label: 'Jalna ↔ Watur Phata' },
                          { from: 'jalna', to: 'watur', label: 'Jalna ↔ Watur' },
                          { from: 'jalna', to: 'viregaon', label: 'Jalna ↔ Viregaon' },
                          { from: 'jalna', to: 'ramnagar', label: 'Jalna ↔ Ramnagar' },
                          { from: 'watur-phata', to: 'partur', label: 'Watur Phata ↔ Partur' },
                        ].map((pair) => (
                          <button
                            key={pair.label}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, fromLocationId: pair.from, toLocationId: pair.to }))}
                            className={`text-[10px] font-semibold px-2 py-0.8 rounded-md border transition-all cursor-pointer ${
                              formData.fromLocationId === pair.from && formData.toLocationId === pair.to
                                ? 'bg-[#0038BD] text-white border-[#0038BD]'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            {pair.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
                        <span><strong>Route:</strong> {fromLocation.name} ➔ {toLocation.name}</span>
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        Approx. {calculateDistance()} km via NH-752I
                      </span>
                    </div>
                  </div>

                  {/* Sender Details */}
                  <div className="space-y-3">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      2. Sender Information (Pickup Point)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Your Name / Business Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sunil / Anand Medical"
                          value={formData.senderName}
                          onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0038BD] font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 98220XXXXX"
                          value={formData.senderPhone}
                          onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0038BD] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Pickup Address / Shop / Phata in {fromLocation.name} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`e.g. Near Bus Stand, Main Market Road, ${fromLocation.name}`}
                        value={formData.pickupAddress}
                        onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0038BD] font-medium"
                      />
                    </div>
                  </div>

                  {/* Optional Receiver Info */}
                  <div className="pt-1">
                    <details className="group border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                      <summary className="cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between select-none">
                        <span>+ Add Receiver Details in {toLocation.name} (Optional)</span>
                        <span className="text-[10px] text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="p-3.5 space-y-3 bg-white dark:bg-slate-800/40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Receiver Name"
                            value={formData.receiverName || ''}
                            onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0038BD]"
                          />
                          <input
                            type="tel"
                            placeholder="Receiver Phone Number"
                            value={formData.receiverPhone || ''}
                            onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0038BD]"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder={`Receiver Address / Shop / Phata in ${toLocation.name}`}
                          value={formData.deliveryAddress || ''}
                          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0038BD]"
                        />
                      </div>
                    </details>
                  </div>

                  {/* Parcel Type & Weight Category */}
                  <div className="space-y-3 pt-1">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      3. Parcel Specifications
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Parcel Contents
                        </label>
                        <select
                          value={formData.parcelType}
                          onChange={(e) => setFormData({ ...formData, parcelType: e.target.value })}
                          className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0038BD] font-medium"
                        >
                          <option value="Documents / Legal Papers">Documents / Legal Papers</option>
                          <option value="Medicines / Medical Samples">Medicines / Medical Samples</option>
                          <option value="Retail & Wholesale Bundles (Garments / Goods)">Retail &amp; Wholesale Bundles (Garments / Goods)</option>
                          <option value="Auto / Machinery Spare Parts">Auto / Machinery Spare Parts</option>
                          <option value="General Box / Other">General Box / Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Estimated Weight
                        </label>
                        <select
                          value={formData.weightCategory}
                          onChange={(e) => setFormData({ ...formData, weightCategory: e.target.value })}
                          className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0038BD] font-medium"
                        >
                          <option value="Under 1 kg (Light)">Under 1 kg (Light)</option>
                          <option value="1 to 3 kg (Medium)">1 to 3 kg (Medium)</option>
                          <option value="3 to 5 kg (Standard)">3 to 5 kg (Standard)</option>
                          <option value="5 to 15 kg (Heavy)">5 to 15 kg (Heavy)</option>
                          <option value="15 to 25 kg (Bulk/Commercial)">15 to 25 kg (Bulk/Commercial)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Rate Preview Banner */}
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                      <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-bold">Estimated Delivery Fee:</span>
                    </div>
                    <span className="text-base font-black text-emerald-700 dark:text-emerald-300">₹{getEstimatedFee()}</span>
                  </div>

                  {/* Trust Note */}
                  <div className="p-3 bg-blue-50/80 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 flex items-center gap-2 text-xs text-[#0038BD] dark:text-blue-300">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#0038BD] dark:text-blue-400" />
                    <span>Zero Advance Payment. Pay only upon delivery via Cash or UPI.</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      id="modal-submit-whatsapp"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#EF8E01] hover:bg-[#d88001] shadow-lg shadow-[#EF8E01]/25 transition-all cursor-pointer disabled:opacity-60 min-h-[48px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Saving Pickup Booking...</span>
                        </>
                      ) : (
                        <>
                          <Package className="w-4 h-4 text-white" />
                          <span>{currentUser ? 'Confirm Pickup Booking' : 'Sign In & Confirm Booking'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <a
                      href="tel:+919404040606"
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0038BD] dark:hover:text-blue-400 inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Prefer to call directly? +91 94040 40606</span>
                    </a>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
