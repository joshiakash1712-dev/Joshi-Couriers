import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  ParcelItem, 
  ParcelStatus, 
  ParcelStatusHistory,
  AnalyticsSummary, 
  PickupFormData,
  TrackingPhase,
  ClientMonthlyStat,
  ClientReportSummary,
  UserRole
} from '../types';
import { ROUTE_LOCATIONS } from '../data/locations';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInAnonymously,
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc,
  OperationType,
  handleFirestoreError
} from '../lib/firebase';

export function getCanonicalPhase(status: string): TrackingPhase {
  if (status === 'shipped' || status === 'delivered') return 'shipped';
  if (status === 'picked' || status === 'picked_up' || status === 'in_transit' || status === 'arrived_partur' || status === 'out_for_delivery') return 'picked';
  return 'ordered'; // 'ordered', 'pending_approval', 'pickup_scheduled'
}

interface AuthParcelContextType {
  currentUser: UserProfile | null;
  authLoading: boolean;
  parcels: ParcelItem[];
  userParcels: ParcelItem[];
  analytics: AnalyticsSummary;
  signInWithGoogle: () => Promise<UserProfile | null>;
  signInWithEmail: (email: string, pass: string) => Promise<UserProfile | null>;
  signUpWithEmail: (email: string, pass: string, name: string, phone?: string, businessName?: string) => Promise<UserProfile | null>;
  sendPasswordReset: (email: string) => Promise<void>;
  demoSignIn: (role: 'admin' | 'team' | 'customer', customEmail?: string, customName?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  createParcelBooking: (data: PickupFormData, calculatedFare?: number) => Promise<ParcelItem>;
  updateParcelStatus: (parcelId: string, newStatus: ParcelStatus, note?: string) => Promise<void>;
  approveParcelOrder: (parcelId: string) => Promise<void>;
  markParcelPicked: (parcelId: string) => Promise<void>;
  updateParcelPayment: (parcelId: string, paymentStatus: 'pending' | 'collected') => Promise<void>;
  bulkApproveOrders: (parcelIds: string[]) => Promise<void>;
  bulkMarkPicked: (parcelIds: string[]) => Promise<void>;
  getClientReports: (timeframe: 'this_month' | 'past_6_months' | 'yearly' | 'all_time') => ClientReportSummary;
  getParcelById: (parcelId: string) => ParcelItem | undefined;
  fetchParcelByTrackingId: (parcelId: string) => Promise<ParcelItem | null>;
  subscribeToParcel: (parcelId: string, onUpdate: (parcel: ParcelItem | null) => void) => () => void;
}

const AuthParcelContext = createContext<AuthParcelContextType | undefined>(undefined);

// Admin emails list - app owners and administrators
const ADMIN_EMAILS = ['joshiakash1712@gmail.com', 'joshiakash1209@gmail.com', 'admin@joshicouriers.com'];

export const AuthParcelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [parcels, setParcels] = useState<ParcelItem[]>([]);

  // Clear legacy mock data from localStorage to ensure clean state
  useEffect(() => {
    try {
      localStorage.removeItem('jc_active_user_v2');
      localStorage.removeItem('jc_parcels_v2');
      localStorage.removeItem('jc_users_v2');
    } catch (err) {
      console.warn('Cleanup error', err);
    }
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setAuthLoading(true);
      if (!fbUser) {
        setCurrentUser(null);
        setParcels([]);
        setAuthLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userRef);
        const isOwnerEmail = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase().trim());

        let profile: UserProfile;
        if (snap.exists()) {
          profile = snap.data() as UserProfile;
          if (isOwnerEmail && profile.role !== 'admin') {
            profile.role = 'admin';
            await setDoc(userRef, { role: 'admin' }, { merge: true });
          }
        } else {
          profile = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Merchant',
            email: fbUser.email || undefined,
            phone: fbUser.phoneNumber || '',
            businessName: '',
            city: 'Jalna',
            defaultAddress: '',
            role: isOwnerEmail ? 'admin' : 'customer',
            avatarUrl: fbUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, profile);
        }
        setCurrentUser(profile);
      } catch (err) {
        console.error('Error fetching/creating user profile:', err);
        // Fallback profile if Firestore read fails
        const isOwnerEmail = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase().trim());
        setCurrentUser({
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || undefined,
          phone: fbUser.phoneNumber || '',
          city: 'Jalna',
          defaultAddress: '',
          role: isOwnerEmail ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        });
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for parcels based on authenticated user role
  useEffect(() => {
    if (!currentUser) {
      setParcels([]);
      return;
    }

    // Per Firebase Skill: Only attach onSnapshot listeners if auth is ready and user is authenticated
    if (!auth.currentUser) {
      return;
    }

    let q;
    const parcelsCol = collection(db, 'parcels');

    if (currentUser.role === 'admin' || currentUser.role === 'team') {
      // Admin and logistics team members see all parcels to manage tracking
      q = query(parcelsCol, orderBy('createdAt', 'desc'));
    } else {
      // Regular customer sees their own parcels
      q = query(parcelsCol, where('userId', '==', currentUser.id));
    }

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const loaded: ParcelItem[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push(docSnap.data() as ParcelItem);
        });
        // Sort descending by creation
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setParcels(loaded);
      },
      (err) => {
        console.warn('Real-time parcels listener notice:', err);
        if ((err as any).code === 'permission-denied') {
          try {
            handleFirestoreError(err, OperationType.LIST, 'parcels');
          } catch {
            // Handled and logged for diagnostics
          }
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser?.id, currentUser?.role]);

  // Real Google Sign In
  const signInWithGoogle = async (): Promise<UserProfile | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isOwnerEmail = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase().trim());

      const userRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userRef);

      let profile: UserProfile;
      if (snap.exists()) {
        profile = snap.data() as UserProfile;
        if (isOwnerEmail && profile.role !== 'admin') {
          profile.role = 'admin';
          await setDoc(userRef, { role: 'admin' }, { merge: true });
        }
      } else {
        profile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Merchant',
          email: fbUser.email || undefined,
          phone: fbUser.phoneNumber || '',
          businessName: '',
          city: 'Jalna',
          defaultAddress: '',
          role: isOwnerEmail ? 'admin' : 'customer',
          avatarUrl: fbUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, profile);
      }
      setCurrentUser(profile);
      return profile;
    } catch (error: any) {
      console.error('Google Sign In failed:', error);
      throw error;
    }
  };

  // Real Email Sign In
  const signInWithEmail = async (email: string, pass: string): Promise<UserProfile | null> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = cred.user;
      const isOwnerEmail = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase().trim());

      const userRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userRef);

      let profile: UserProfile;
      if (snap.exists()) {
        profile = snap.data() as UserProfile;
      } else {
        profile = {
          id: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0],
          email: fbUser.email || email,
          phone: '',
          city: 'Jalna',
          defaultAddress: '',
          role: isOwnerEmail ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, profile);
      }
      setCurrentUser(profile);
      return profile;
    } catch (error: any) {
      console.error('Email sign in failed:', error);
      throw error;
    }
  };

  // Real Email Sign Up
  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    phone = '', 
    businessName = ''
  ): Promise<UserProfile | null> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = cred.user;
      
      await updateProfile(fbUser, { displayName: name });
      const isOwnerEmail = fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase().trim());

      const profile: UserProfile = {
        id: fbUser.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        businessName: businessName.trim(),
        city: 'Jalna',
        defaultAddress: '',
        role: isOwnerEmail ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', fbUser.uid), profile);
      setCurrentUser(profile);
      return profile;
    } catch (error: any) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  // Password reset email request
  const sendPasswordReset = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error: any) {
      console.error('Password reset email failed:', error);
      throw error;
    }
  };

  // Instant 1-click test sign-in for preview testing (Admin or Merchant)
  const demoSignIn = async (role: 'admin' | 'team' | 'customer', customEmail?: string, customName?: string): Promise<UserProfile> => {
    const isOwner = role === 'admin' || (customEmail && ADMIN_EMAILS.includes(customEmail.toLowerCase().trim()));
    const isTeam = role === 'team';
    const profileRole: UserRole = isOwner ? 'admin' : isTeam ? 'team' : 'customer';

    const profile: UserProfile = {
      id: isOwner ? 'admin-akash-joshi' : isTeam ? 'team-transporter-anant' : 'merchant-anand-patel',
      name: customName || (isOwner ? 'Akash Joshi' : isTeam ? 'Anant Joshi (Transporter)' : 'Anand Patel'),
      email: customEmail || (isOwner ? 'joshiakash1712@gmail.com' : isTeam ? 'transporter@joshicouriers.com' : 'anand.patel@jalnatextiles.in'),
      phone: isOwner ? '+91 94040 40606' : isTeam ? '+91 94222 55566' : '+91 98220 12345',
      businessName: isOwner 
        ? 'Joshi Couriers Head Operations' 
        : isTeam 
        ? 'Joshi Corridor Fleet (MH21 V 6370)' 
        : 'Patel Cloth Wholesalers, Jalna',
      city: 'Jalna',
      defaultAddress: isOwner 
        ? 'Station Road, Old Jalna' 
        : isTeam 
        ? 'Transport Nagar, Jalna' 
        : 'Cloth Market, Subhash Road, Jalna',
      role: profileRole,
      avatarUrl: isOwner 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' 
        : undefined,
      createdAt: new Date().toISOString(),
    };

    // Attempt to persist profile to Firestore if auth user exists
    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, { ...profile, id: auth.currentUser.uid }, { merge: true });
        profile.id = auth.currentUser.uid;
      }
    } catch (e) {
      console.warn('Could not persist demo user to firestore:', e);
    }

    setCurrentUser(profile);
    return profile;
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setParcels([]);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.id);
      await setDoc(userRef, data, { merge: true });
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      if (err?.code === 'permission-denied') {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.id}`);
        } catch {
          // Handled and reported
        }
      }
      throw err;
    }
  };

  // Create real parcel booking in Firestore
  const createParcelBooking = async (data: PickupFormData, calculatedFare = 75): Promise<ParcelItem> => {
    const fromLoc = ROUTE_LOCATIONS.find(l => l.id === data.fromLocationId) || ROUTE_LOCATIONS[0];
    const toLoc = ROUTE_LOCATIONS.find(l => l.id === data.toLocationId) || ROUTE_LOCATIONS[ROUTE_LOCATIONS.length - 1];

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const trackingId = `JC-${randomDigits}`;

    const isStaffUser = currentUser?.role === 'admin' || currentUser?.role === 'team';
    // When created by client on website, starts in 'pending_approval'
    // If created directly by staff, starts in 'ordered'
    const initialStatus: ParcelStatus = isStaffUser ? 'ordered' : 'pending_approval';

    const newParcel: ParcelItem = {
      id: trackingId,
      userId: currentUser ? currentUser.id : 'guest',
      senderName: data.senderName || (currentUser ? currentUser.name : 'Sender'),
      senderPhone: data.senderPhone || (currentUser?.phone || '+91 94040 40606'),
      senderEmail: currentUser?.email,
      senderBusiness: currentUser?.businessName,
      pickupAddress: data.pickupAddress || (currentUser?.defaultAddress || 'Jalna Pickup Location'),
      fromLocationId: data.fromLocationId,
      fromCity: fromLoc.name,
      toLocationId: data.toLocationId,
      toCity: toLoc.name,
      receiverName: data.receiverName || 'Receiver in ' + toLoc.name,
      receiverPhone: data.receiverPhone || '',
      deliveryAddress: data.deliveryAddress || `${toLoc.name} Delivery Address`,
      parcelType: data.parcelType,
      weightCategory: data.weightCategory,
      notes: data.notes,
      fare: calculatedFare,
      paymentMode: 'cash_on_delivery',
      paymentStatus: 'pending',
      status: initialStatus,
      createdAt: new Date().toISOString(),
      scheduledDeliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliverySlot: toLoc.id === 'partur' ? 'Tomorrow 6:30-8:30 AM' : 'Tomorrow 8:30-10:00 AM (via Partur)',
      history: [
        {
          status: initialStatus,
          timestamp: new Date().toISOString(),
          location: fromLoc.name,
          note: isStaffUser 
            ? 'Parcel order created and approved by logistics team. Scheduled for corridor dispatch.'
            : `Parcel order request registered online by ${data.senderName}. Awaiting admin confirmation.`,
        }
      ],
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'parcels', trackingId), newParcel);
    } catch (err: any) {
      console.warn('Error saving parcel to Firestore (offline fallback active):', err);
      if (err?.code === 'permission-denied') {
        try {
          handleFirestoreError(err, OperationType.CREATE, `parcels/${trackingId}`);
        } catch {
          // Handled and reported
        }
      }
      // Even if Firestore offline, keep local copy
      setParcels(prev => [newParcel, ...prev]);
    }

    return newParcel;
  };

  // Update parcel status in Firestore (Admin & Team only)
  const updateParcelStatus = async (parcelId: string, newStatus: ParcelStatus, note?: string) => {
    const existing = parcels.find(p => p.id === parcelId);
    if (!existing) return;

    const defaultNotes: Record<string, string> = {
      pending_approval: 'Order request registered on website. Awaiting admin confirmation.',
      ordered: 'Admin approved parcel order request. Corridor dispatch scheduled.',
      picked: 'Transporter has received the parcel in Mahindra Maxximo MH21 V 6370.',
      shipped: 'Parcel delivered safely to receiver. Handover complete.',
      pickup_scheduled: 'Doorstep pickup scheduled in Jalna.',
      picked_up: 'Parcel collected and securely loaded in Mahindra Maxximo MH21 V 6370.',
      in_transit: 'Departed Jalna on NH-752I corridor on 4:00-5:00 AM morning schedule.',
      arrived_partur: 'Arrived at Partur distribution checkpoint (6:15 AM).',
      out_for_delivery: 'Out for direct hand-to-hand doorstep delivery in 6:30-8:30 AM window.',
      delivered: 'Successfully delivered hand-to-hand to recipient. Payment collected.',
    };

    const newHistoryItem: ParcelStatusHistory = {
      status: newStatus,
      timestamp: new Date().toISOString(),
      location: (newStatus === 'shipped' || newStatus === 'delivered' || newStatus === 'arrived_partur') 
        ? existing.toCity 
        : existing.fromCity,
      note: note || defaultNotes[newStatus] || `Status transitioned to ${newStatus}.`,
    };

    const updatedHistory = [...(existing.history || []), newHistoryItem];
    const isFinished = newStatus === 'shipped' || newStatus === 'delivered';

    const updates = {
      status: newStatus,
      paymentStatus: (isFinished ? 'collected' : existing.paymentStatus) as 'pending' | 'collected',
      history: updatedHistory,
    };

    // Optimistically update local state immediately
    setParcels(prev => prev.map(p => p.id === parcelId ? { ...p, ...updates } : p));

    try {
      await updateDoc(doc(db, 'parcels', parcelId), updates);
    } catch (err: any) {
      console.warn('Error updating parcel in Firestore:', err);
      if (err?.code === 'permission-denied') {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `parcels/${parcelId}`);
        } catch {
          // Handled and reported
        }
      }
    }
  };

  const approveParcelOrder = async (parcelId: string) => {
    await updateParcelStatus(parcelId, 'ordered', 'Admin approved parcel order request. Corridor dispatch confirmed.');
  };

  const markParcelPicked = async (parcelId: string) => {
    await updateParcelStatus(parcelId, 'picked', 'Transporter has received the parcel in Mahindra Maxximo MH21 V 6370.');
  };

  const markParcelShipped = async (parcelId: string) => {
    await updateParcelStatus(parcelId, 'shipped', 'Parcel delivered safely to receiver. Handover complete.');
  };

  const updateParcelPayment = async (parcelId: string, paymentStatus: 'pending' | 'collected') => {
    const existing = parcels.find(p => p.id === parcelId);
    if (!existing) return;
    const updates = { paymentStatus };
    setParcels(prev => prev.map(p => p.id === parcelId ? { ...p, ...updates } : p));
    try {
      await updateDoc(doc(db, 'parcels', parcelId), updates);
    } catch (err: any) {
      console.warn('Error updating parcel payment status:', err);
      if (err?.code === 'permission-denied') {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `parcels/${parcelId}`);
        } catch {
          // Handled and reported
        }
      }
    }
  };

  const bulkApproveOrders = async (parcelIds: string[]) => {
    for (const id of parcelIds) {
      await approveParcelOrder(id);
    }
  };

  const bulkMarkPicked = async (parcelIds: string[]) => {
    for (const id of parcelIds) {
      await markParcelPicked(id);
    }
  };

  const getParcelById = (parcelId: string): ParcelItem | undefined => {
    return parcels.find(p => p.id.toLowerCase() === parcelId.toLowerCase().trim());
  };

  const fetchParcelByTrackingId = async (parcelId: string): Promise<ParcelItem | null> => {
    const cleanId = parcelId.trim().toUpperCase();
    if (!cleanId) return null;

    // Check in-memory parcels state first
    const local = parcels.find(p => p.id.toUpperCase() === cleanId);
    if (local) return local;

    // Fetch directly from Firestore (permitted by public read rule: allow get: if true;)
    try {
      const docRef = doc(db, 'parcels', cleanId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as ParcelItem;
      }
    } catch (err) {
      console.warn('Direct tracking fetch error (fallback to local state):', err);
    }
    return null;
  };

  const subscribeToParcel = (
    parcelId: string,
    onUpdate: (parcel: ParcelItem | null) => void
  ): (() => void) => {
    const cleanId = parcelId.trim().toUpperCase();
    if (!cleanId) {
      onUpdate(null);
      return () => {};
    }

    // Immediately push local cached version if present
    const local = parcels.find(p => p.id.toUpperCase() === cleanId);
    if (local) {
      onUpdate(local);
    }

    try {
      const docRef = doc(db, 'parcels', cleanId);
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            onUpdate(snap.data() as ParcelItem);
          } else {
            const fallbackLocal = parcels.find(p => p.id.toUpperCase() === cleanId);
            onUpdate(fallbackLocal || null);
          }
        },
        (err) => {
          console.warn('Real-time tracking listener notice:', err);
          const fallbackLocal = parcels.find(p => p.id.toUpperCase() === cleanId);
          onUpdate(fallbackLocal || null);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn('Could not attach real-time tracking listener:', err);
      const fallbackLocal = parcels.find(p => p.id.toUpperCase() === cleanId);
      onUpdate(fallbackLocal || null);
      return () => {};
    }
  };

  const userParcels = React.useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin' || currentUser.role === 'team') return parcels;

    const cleanUserPhone = currentUser.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '';
    const cleanUserEmail = currentUser.email ? currentUser.email.toLowerCase().trim() : '';

    return parcels.filter(p => {
      if (p.userId === currentUser.id) return true;
      if (cleanUserEmail && p.senderEmail && p.senderEmail.toLowerCase().trim() === cleanUserEmail) return true;
      if (cleanUserPhone) {
        const cleanSender = p.senderPhone ? p.senderPhone.replace(/\D/g, '').slice(-10) : '';
        const cleanReceiver = p.receiverPhone ? p.receiverPhone.replace(/\D/g, '').slice(-10) : '';
        if (cleanSender && cleanSender === cleanUserPhone) return true;
        if (cleanReceiver && cleanReceiver === cleanUserPhone) return true;
      }
      return false;
    });
  }, [currentUser, parcels]);

  // Synchronize and claim guest orders placed on website when customer logs in with phone or email
  useEffect(() => {
    if (!currentUser || currentUser.role === 'admin' || currentUser.role === 'team') return;
    const cleanUserPhone = currentUser.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '';
    const cleanUserEmail = currentUser.email ? currentUser.email.toLowerCase().trim() : '';

    parcels.forEach(async (p) => {
      if (p.userId === 'guest') {
        const cleanSender = p.senderPhone ? p.senderPhone.replace(/\D/g, '').slice(-10) : '';
        const isMatch = (cleanUserPhone && cleanSender === cleanUserPhone) ||
          (cleanUserEmail && p.senderEmail && p.senderEmail.toLowerCase().trim() === cleanUserEmail);
        if (isMatch) {
          try {
            await updateDoc(doc(db, 'parcels', p.id), { userId: currentUser.id });
          } catch {
            // Ignored if permissions not yet refreshed
          }
        }
      }
    });
  }, [currentUser?.id, currentUser?.phone, currentUser?.email, parcels]);

  // Compute Client Reports (Monthly, 6 Months, Yearly, All Time)
  const getClientReports = (timeframe: 'this_month' | 'past_6_months' | 'yearly' | 'all_time'): ClientReportSummary => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    let filtered = userParcels;
    let label = 'All-Time Deliveries';

    if (timeframe === 'this_month') {
      const startOfMonth = new Date(currentYear, currentMonth, 1).getTime();
      filtered = userParcels.filter(p => new Date(p.createdAt).getTime() >= startOfMonth);
      label = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    } else if (timeframe === 'past_6_months') {
      const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1).getTime();
      filtered = userParcels.filter(p => new Date(p.createdAt).getTime() >= sixMonthsAgo);
      label = 'Past 6 Months Corridor Activity';
    } else if (timeframe === 'yearly') {
      const startOfYear = new Date(currentYear, 0, 1).getTime();
      filtered = userParcels.filter(p => new Date(p.createdAt).getTime() >= startOfYear);
      label = `Year ${currentYear} Annual Summary`;
    }

    const totalOrders = filtered.length;
    const totalSpend = filtered.reduce((sum, p) => sum + (p.fare || 0), 0);

    let orderedCount = 0;
    let pickedCount = 0;
    let shippedCount = 0;

    filtered.forEach(p => {
      const phase = getCanonicalPhase(p.status);
      if (phase === 'shipped') shippedCount++;
      else if (phase === 'picked') pickedCount++;
      else orderedCount++;
    });

    const monthsCount = timeframe === 'this_month' ? 1 : timeframe === 'past_6_months' ? 6 : 12;
    const trendMap = new Map<string, ClientMonthlyStat>();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      trendMap.set(key, {
        monthKey: key,
        monthLabel,
        orderCount: 0,
        totalSpend: 0,
        ordered: 0,
        picked: 0,
        shipped: 0,
      });
    }

    filtered.forEach(p => {
      const d = new Date(p.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const stat = trendMap.get(key);
      if (stat) {
        stat.orderCount++;
        stat.totalSpend += (p.fare || 0);
        const phase = getCanonicalPhase(p.status);
        if (phase === 'shipped') stat.shipped++;
        else if (phase === 'picked') stat.picked++;
        else stat.ordered++;
      }
    });

    return {
      timeframe,
      timeframeLabel: label,
      totalOrders,
      totalSpend,
      orderedCount,
      pickedCount,
      shippedCount,
      monthlyTrend: Array.from(trendMap.values()),
    };
  };

  // Compute live analytics summary from real database records
  const analytics = React.useMemo<AnalyticsSummary>(() => {
    const totalParcels = parcels.length;
    const activeParcels = parcels.filter(p => p.status !== 'delivered').length;
    const deliveredParcels = parcels.filter(p => p.status === 'delivered').length;
    
    const totalRevenue = parcels.reduce((sum, p) => sum + (p.fare || 0), 0);
    const revenueCollected = parcels.filter(p => p.paymentStatus === 'collected').reduce((sum, p) => sum + (p.fare || 0), 0);
    const revenuePending = totalRevenue - revenueCollected;
    const averageFare = totalParcels > 0 ? Math.round(totalRevenue / totalParcels) : 75;

    // Route breakdown
    const routeMap = new Map<string, { count: number; revenue: number }>();
    parcels.forEach(p => {
      const key = `${p.fromCity} ➔ ${p.toCity}`;
      const existing = routeMap.get(key) || { count: 0, revenue: 0 };
      routeMap.set(key, { count: existing.count + 1, revenue: existing.revenue + (p.fare || 0) });
    });
    const routeBreakdown = Array.from(routeMap.entries()).map(([route, val]) => ({
      route,
      count: val.count,
      revenue: val.revenue,
    }));

    // Category breakdown
    const catMap = new Map<string, number>();
    parcels.forEach(p => {
      let cat = 'General / Documents';
      const type = (p.parcelType || '').toLowerCase();
      if (type.includes('textil') || type.includes('cloth') || type.includes('saree')) {
        cat = 'Textiles & Sarees';
      } else if (type.includes('pharma') || type.includes('medic')) {
        cat = 'Pharma & Medical';
      } else if (type.includes('auto') || type.includes('tractor') || type.includes('bearing') || type.includes('part')) {
        cat = 'Auto Parts & Hardware';
      } else if (type.includes('legal') || type.includes('document')) {
        cat = 'Legal & Papers';
      }
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    const categoryBreakdown = Array.from(catMap.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: totalParcels > 0 ? Math.round((count / totalParcels) * 100) : 0,
    }));

    const statusBreakdown: Record<ParcelStatus, number> = {
      pending_approval: 0,
      ordered: 0,
      picked: 0,
      shipped: 0,
      pickup_scheduled: 0,
      picked_up: 0,
      in_transit: 0,
      arrived_partur: 0,
      out_for_delivery: 0,
      delivered: 0,
    };
    parcels.forEach(p => {
      if (p.status in statusBreakdown) {
        statusBreakdown[p.status] = (statusBreakdown[p.status] || 0) + 1;
      }
    });

    return {
      totalParcels,
      activeParcels,
      deliveredParcels,
      totalRevenue,
      averageFare,
      revenueCollected,
      revenuePending,
      onTimeRatePercent: 100, // 6:30-8:30 AM arrival record
      routeBreakdown,
      categoryBreakdown,
      statusBreakdown,
    };
  }, [parcels]);

  return (
    <AuthParcelContext.Provider
      value={{
        currentUser,
        authLoading,
        parcels,
        userParcels,
        analytics,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        demoSignIn,
        logout,
        updateUserProfile,
        createParcelBooking,
        updateParcelStatus,
        approveParcelOrder,
        markParcelPicked,
        markParcelShipped,
        updateParcelPayment,
        bulkApproveOrders,
        bulkMarkPicked,
        getClientReports,
        getParcelById,
        fetchParcelByTrackingId,
        subscribeToParcel,
      }}
    >
      {children}
    </AuthParcelContext.Provider>
  );
};

export const useAuthParcel = () => {
  const context = useContext(AuthParcelContext);
  if (!context) {
    throw new Error('useAuthParcel must be used within an AuthParcelProvider');
  }
  return context;
};
