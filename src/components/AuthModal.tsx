import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Building2, 
  ArrowRight, 
  Lock,
  Mail,
  Loader2,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Package,
  Sparkles,
  ChevronRight,
  Phone,
  Code,
  RefreshCw
} from 'lucide-react';
import { useAuthParcel } from '../context/AuthParcelContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  onOpenCustomerParcels?: () => void;
  onOpenAdmin?: () => void;
}

type AuthViewMode = 'signin' | 'register' | 'forgot_password' | 'workspace_select';

interface AuthFeedback {
  type: 'error' | 'success';
  title: string;
  message: string;
  field?: 'email' | 'password' | 'name' | 'phone' | 'business' | 'general';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  onOpenCustomerParcels,
  onOpenAdmin
}) => {
  const { 
    currentUser, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    sendPasswordReset,
    demoSignIn,
    logout 
  } = useAuthParcel();

  const [viewMode, setViewMode] = useState<AuthViewMode>('signin');
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Form Inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [businessInput, setBusinessInput] = useState('');
  
  // Standardized UI Feedback & Loading States
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string>('');
  const [feedback, setFeedback] = useState<AuthFeedback | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  
  // Discreet Developer 1-Click Access Panel State
  const [showDevSheet, setShowDevSheet] = useState(false);

  // Accessible focus references
  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Synchronize view mode if user is already authenticated
  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setViewMode('workspace_select');
      } else {
        setViewMode('signin');
      }
      setFeedback(null);
      setResetEmailSent(false);
    }
  }, [isOpen, currentUser]);

  // Focus management on view mode switch
  useEffect(() => {
    if (isOpen && !loading) {
      const timer = setTimeout(() => {
        if (viewMode === 'register') {
          nameInputRef.current?.focus();
        } else if (viewMode === 'signin' || viewMode === 'forgot_password') {
          emailInputRef.current?.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [viewMode, isOpen, loading]);

  // Keyboard navigation & Escape handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showDevSheet) {
          setShowDevSheet(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, showDevSheet, onClose]);

  if (!isOpen) return null;

  // Clear feedback helper
  const clearFeedback = () => setFeedback(null);

  // Google Authentication
  const handleGoogleSignIn = async () => {
    clearFeedback();
    setLoading(true);
    setLoadingAction('Connecting with Google...');
    try {
      const user = await signInWithGoogle();
      setFeedback({
        type: 'success',
        title: 'Authentication Successful',
        message: 'Signed in successfully with Google account.'
      });
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        if (user?.role === 'admin') {
          if (onOpenAdmin) onOpenAdmin();
        } else {
          if (onOpenCustomerParcels) onOpenCustomerParcels();
        }
        onClose();
      }, 450);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setFeedback({
          type: 'error',
          title: 'Sign In Cancelled',
          message: 'The Google verification window was closed before completion. Please try again.',
          field: 'general'
        });
      } else if (err.code === 'auth/popup-blocked') {
        setFeedback({
          type: 'error',
          title: 'Popup Blocked',
          message: 'Your browser prevented the Google login popup. Please enable popups or use email sign in.',
          field: 'general'
        });
      } else if (err.code === 'auth/unauthorized-domain') {
        setFeedback({
          type: 'error',
          title: 'Domain Not Authorized',
          message: 'This preview domain is not in the authorized OAuth list. Please use email and password sign in.',
          field: 'general'
        });
      } else {
        setFeedback({
          type: 'error',
          title: 'Authentication Failed',
          message: err.message || 'Could not complete Google authentication. Please try again.',
          field: 'general'
        });
      }
    } finally {
      setLoading(false);
      setLoadingAction('');
    }
  };

  // Email Submit Handler (Sign In / Register / Forgot Password)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();

    // FORGOT PASSWORD FLOW
    if (viewMode === 'forgot_password') {
      if (!emailInput.trim()) {
        setFeedback({
          type: 'error',
          title: 'Email Required',
          message: 'Please enter your registered email address.',
          field: 'email'
        });
        emailInputRef.current?.focus();
        return;
      }

      setLoading(true);
      setLoadingAction('Sending recovery link...');
      try {
        await sendPasswordReset(emailInput.trim());
        setResetEmailSent(true);
        setFeedback({
          type: 'success',
          title: 'Reset Link Sent',
          message: `Instructions to reset your password have been dispatched to ${emailInput.trim()}.`
        });
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          setFeedback({
            type: 'error',
            title: 'Account Not Found',
            message: 'No registered Joshi Couriers account matches this email address.',
            field: 'email'
          });
        } else if (err.code === 'auth/invalid-email') {
          setFeedback({
            type: 'error',
            title: 'Invalid Email Format',
            message: 'Please provide a valid email address.',
            field: 'email'
          });
        } else {
          setFeedback({
            type: 'error',
            title: 'Unable to Send Link',
            message: err.message || 'We could not dispatch the recovery email. Please check your connection.',
            field: 'email'
          });
        }
      } finally {
        setLoading(false);
        setLoadingAction('');
      }
      return;
    }

    // VALIDATION FOR SIGN IN & REGISTER
    if (!emailInput.trim()) {
      setFeedback({
        type: 'error',
        title: 'Email Required',
        message: 'Please enter your email address.',
        field: 'email'
      });
      emailInputRef.current?.focus();
      return;
    }

    if (!passwordInput.trim()) {
      setFeedback({
        type: 'error',
        title: 'Password Required',
        message: 'Please enter your password.',
        field: 'password'
      });
      return;
    }

    if (viewMode === 'register') {
      if (!nameInput.trim()) {
        setFeedback({
          type: 'error',
          title: 'Full Name Required',
          message: 'Please enter your name for parcel manifests.',
          field: 'name'
        });
        nameInputRef.current?.focus();
        return;
      }
      if (passwordInput.length < 6) {
        setFeedback({
          type: 'error',
          title: 'Password Too Short',
          message: 'Password must contain at least 6 characters for security.',
          field: 'password'
        });
        return;
      }
    }

    setLoading(true);
    setLoadingAction(viewMode === 'register' ? 'Creating your account...' : 'Signing you in...');

    try {
      if (viewMode === 'register') {
        const user = await signUpWithEmail(
          emailInput, 
          passwordInput, 
          nameInput, 
          phoneInput, 
          accountType === 'business' ? businessInput : ''
        );
        setFeedback({
          type: 'success',
          title: 'Account Created',
          message: 'Welcome to Joshi Couriers. Preparing your workspace...'
        });
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
          if (user?.role === 'admin') {
            if (onOpenAdmin) onOpenAdmin();
          } else {
            if (onOpenCustomerParcels) onOpenCustomerParcels();
          }
          onClose();
        }, 500);
      } else {
        const user = await signInWithEmail(emailInput, passwordInput);
        setFeedback({
          type: 'success',
          title: 'Signed In',
          message: 'Welcome back. Redirecting to your active deliveries...'
        });
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
          if (user?.role === 'admin') {
            if (onOpenAdmin) onOpenAdmin();
          } else {
            if (onOpenCustomerParcels) onOpenCustomerParcels();
          }
          onClose();
        }, 500);
      }
    } catch (err: any) {
      console.error('Email authentication error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setFeedback({
          type: 'error',
          title: 'Incorrect Credentials',
          message: 'The email or password does not match our records. Please verify or reset your password.',
          field: 'password'
        });
      } else if (err.code === 'auth/email-already-in-use') {
        setFeedback({
          type: 'error',
          title: 'Account Already Exists',
          message: 'An account with this email address already exists. Please sign in instead.',
          field: 'email'
        });
      } else if (err.code === 'auth/weak-password') {
        setFeedback({
          type: 'error',
          title: 'Password Too Weak',
          message: 'Password must contain at least 6 characters.',
          field: 'password'
        });
      } else if (err.code === 'auth/invalid-email') {
        setFeedback({
          type: 'error',
          title: 'Invalid Email Format',
          message: 'Please enter a properly formatted email address.',
          field: 'email'
        });
      } else {
        setFeedback({
          type: 'error',
          title: 'Connection Issue',
          message: err.message || 'Authentication failed. Please verify your network connection.',
          field: 'general'
        });
      }
    } finally {
      setLoading(false);
      setLoadingAction('');
    }
  };

  // Developer Quick Test Sign In
  const handleDevSignIn = async (role: 'admin' | 'customer') => {
    clearFeedback();
    setLoading(true);
    setLoadingAction(role === 'admin' ? 'Loading Fleet Admin session...' : 'Loading Merchant session...');
    try {
      await demoSignIn(role);
      setShowDevSheet(false);
      setFeedback({
        type: 'success',
        title: 'Developer Session Active',
        message: role === 'admin' ? 'Authenticated as Fleet Admin (Akash Joshi).' : 'Authenticated as Jalna Merchant (Anand Patel).'
      });
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        if (role === 'admin' && onOpenAdmin) {
          onOpenAdmin();
        } else if (onOpenCustomerParcels) {
          onOpenCustomerParcels();
        }
        onClose();
      }, 500);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        title: 'Session Error',
        message: err.message || 'Could not initiate developer preview session.',
        field: 'general'
      });
    } finally {
      setLoading(false);
      setLoadingAction('');
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    setLoading(true);
    setLoadingAction('Signing out...');
    try {
      await logout();
      setViewMode('signin');
      setFeedback({
        type: 'success',
        title: 'Signed Out',
        message: 'You have been signed out from your Joshi Couriers account.'
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        title: 'Sign Out Error',
        message: err.message || 'Failed to complete sign out. Please try again.',
        field: 'general'
      });
    } finally {
      setLoading(false);
      setLoadingAction('');
    }
  };

  return (
    <div 
      id="auth-screen-backdrop"
      className="fixed inset-0 z-50 min-h-[100dvh] w-full flex flex-col justify-between overflow-x-hidden overflow-y-auto bg-[#020B24] bg-gradient-to-b from-[#020B24] via-[#00174E] to-[#01081C] transition-colors duration-300 select-none animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-card-title"
    >
      {/* ATMOSPHERIC DEEP JOSHI COURIERS BLUE LOGISTICS LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Ambient celestial blue glow at top */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[420px] bg-gradient-to-b from-[#0038BD]/40 via-[#002288]/25 to-transparent blur-3xl" />
        
        {/* Central soft halo behind the floating card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#0048E6]/15 via-[#0038BD]/08 to-transparent blur-2xl" />

        {/* Subtle coordinate / waypoint grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:36px_36px] opacity-70" />

        {/* Subtle logistics route arc & dispatch corridor lines */}
        <svg 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[640px] max-w-none text-white/20" 
          viewBox="0 0 1200 640" 
          fill="none"
        >
          {/* Dispatch range rings */}
          <circle cx="600" cy="320" r="280" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 8" className="opacity-30" />
          <circle cx="600" cy="320" r="420" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 10" className="opacity-15" />

          {/* Primary logistics route curve */}
          <path 
            d="M 60 400 C 300 140, 900 140, 1140 400" 
            stroke="rgba(255,255,255,0.25)" 
            strokeWidth="1.2" 
            strokeDasharray="5 7" 
          />
          {/* Secondary corridor trajectory */}
          <path 
            d="M 150 480 C 450 260, 750 260, 1050 480" 
            stroke="rgba(0,140,255,0.2)" 
            strokeWidth="1" 
            strokeDasharray="4 8" 
          />

          {/* Waypoint nodes representing corridor junctions */}
          <g className="opacity-80">
            <circle cx="230" cy="255" r="3.5" fill="#EF8E01" />
            <text x="230" y="275" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">JALNA HUB</text>
          </g>

          <g className="opacity-90">
            <circle cx="600" cy="170" r="4.5" fill="#0038BD" stroke="white" strokeWidth="1.5" />
            <text x="600" y="152" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">MH-21 DISPATCH</text>
          </g>

          <g className="opacity-80">
            <circle cx="970" cy="255" r="3.5" fill="#EF8E01" />
            <text x="970" y="275" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">PARTUR SECTOR</text>
          </g>
        </svg>

        {/* Soft bottom deep navy atmospheric vignette */}
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#01081C] via-[#01081C]/60 to-transparent" />
      </div>

      {/* TOP HEADER: BRAND + CLOSE ACTION */}
      <header className="relative z-20 w-full px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between">
        {/* Brand identity: Top-left, compact and refined with white contrast on deep blue */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white text-[#0038BD] flex items-center justify-center shadow-md transition-transform hover:scale-105">
            <Package className="w-4 h-4 text-[#0038BD]" />
            <span className="sr-only">Joshi Couriers</span>
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-white">
            Joshi Couriers
          </span>
        </div>

        {/* Top-Right Dismiss Button with glass styling on dark blue */}
        <button
          id="auth-exit-btn"
          type="button"
          onClick={onClose}
          aria-label="Close authentication"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0038BD]/60"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* CENTERED GLASS CARD */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-4 sm:py-8 my-auto w-full">
        <div 
          id="auth-glass-card"
          className="w-full max-w-[420px] bg-white/92 dark:bg-slate-900/92 backdrop-blur-2xl rounded-[28px] border border-white/80 dark:border-white/15 shadow-[0_24px_64px_rgba(0,10,38,0.55)] p-6 sm:p-8 transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle Top Rim Loading Indicator (Standardized Loading Feedback) */}
          {loading && (
            <div 
              className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#0038BD] to-transparent dark:via-blue-400 animate-pulse"
              role="progressbar"
              aria-label="Authentication in progress"
            />
          )}

          {/* Card Top Icon Container */}
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_3px_12px_rgba(0,0,0,0.06)] border border-white dark:border-slate-700/70 flex items-center justify-center mx-auto mb-4 text-slate-900 dark:text-white transition-all duration-300">
            {feedback?.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-75 duration-200" />
            ) : viewMode === 'workspace_select' ? (
              <Sparkles className="w-5 h-5 text-[#EF8E01]" />
            ) : viewMode === 'register' ? (
              <User className="w-5 h-5 text-slate-800 dark:text-slate-100" />
            ) : viewMode === 'forgot_password' ? (
              <KeyRound className="w-5 h-5 text-slate-800 dark:text-slate-100" />
            ) : (
              <ArrowRight className="w-5 h-5 text-slate-800 dark:text-slate-100" />
            )}
          </div>

          {/* Card Headings with smooth crossfade */}
          <div className="text-center mb-5 transition-all duration-200">
            <h1 id="auth-card-title" className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {viewMode === 'workspace_select' 
                ? 'Choose your workspace'
                : viewMode === 'register'
                ? 'Create your account'
                : viewMode === 'forgot_password'
                ? (resetEmailSent ? 'Check your email' : 'Reset your password')
                : 'Welcome to Joshi Couriers'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-[320px] mx-auto">
              {viewMode === 'workspace_select'
                ? `Signed in as ${currentUser?.name || 'Authorized Member'}. Select a workspace to continue:`
                : viewMode === 'register'
                ? 'Get started with real-time parcel notifications and dispatch booking.'
                : viewMode === 'forgot_password'
                ? (resetEmailSent ? 'Follow the link sent to your email to configure your new password.' : 'Enter your registered email address to receive secure recovery steps.')
                : 'Sign in to manage your deliveries, shipments, and account.'}
            </p>
          </div>

          {/* STANDARDIZED FEEDBACK ALERT (Error or Success) */}
          {feedback && (
            <div 
              id="auth-feedback-alert"
              className={`mb-4 p-3.5 rounded-2xl border backdrop-blur-md flex items-start gap-2.5 text-xs transition-all duration-200 animate-in fade-in slide-in-from-top-1 ${
                feedback.type === 'error'
                  ? 'bg-red-500/10 dark:bg-red-950/40 border-red-500/25 dark:border-red-800/40 text-red-900 dark:text-red-200'
                  : 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/25 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
              }`}
              role={feedback.type === 'error' ? 'alert' : 'status'}
              aria-live={feedback.type === 'error' ? 'assertive' : 'polite'}
            >
              {feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold tracking-tight">{feedback.title}</p>
                <p className="opacity-90 leading-relaxed mt-0.5">{feedback.message}</p>
              </div>
              <button
                type="button"
                onClick={clearFeedback}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded-md transition-colors"
                aria-label="Dismiss message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* VIEW 1: WORKSPACE SELECT (For authenticated users) */}
          {viewMode === 'workspace_select' && currentUser && (
            <div className="space-y-3 transition-all duration-200 animate-in fade-in">
              {/* Profile Chip */}
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-8 h-8 rounded-full object-cover border border-white dark:border-slate-700 shrink-0" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#0038BD] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email || currentUser.phone || 'Courier Member'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100/90 dark:bg-blue-950/60 text-[#0038BD] dark:text-blue-300 shrink-0">
                  {currentUser.role === 'admin' ? 'Fleet Admin' : 'Customer'}
                </span>
              </div>

              {/* Workspace Options Tailored to User Permissions */}
              {currentUser.role === 'admin' ? (
                <>
                  <button
                    id="workspace-opt-admin"
                    type="button"
                    onClick={() => {
                      if (onOpenAdmin) onOpenAdmin();
                      onClose();
                    }}
                    className="w-full p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 hover:border-[#0038BD] dark:hover:border-blue-500 text-left transition-all flex items-center justify-between group shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0038BD]/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0038BD] dark:group-hover:text-blue-400 transition-colors">
                          Fleet Operations & Analytics
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Route manifests, live status, and parcel logs
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0038BD] transition-colors" />
                  </button>

                  <button
                    id="workspace-opt-sender"
                    type="button"
                    onClick={() => {
                      if (onOpenCustomerParcels) onOpenCustomerParcels();
                      onClose();
                    }}
                    className="w-full p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 hover:border-[#0038BD] dark:hover:border-blue-500 text-left transition-all flex items-center justify-between group shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0038BD]/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0038BD] dark:text-blue-300 flex items-center justify-center font-bold">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0038BD] dark:group-hover:text-blue-400 transition-colors">
                          Customer Parcel Tracking
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Review dispatches and delivery history
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0038BD] transition-colors" />
                  </button>
                </>
              ) : (
                <button
                  id="workspace-opt-customer"
                  type="button"
                  onClick={() => {
                    if (onOpenCustomerParcels) onOpenCustomerParcels();
                    onClose();
                  }}
                  className="w-full p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/80 hover:border-[#0038BD] dark:hover:border-blue-500 text-left transition-all flex items-center justify-between group shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0038BD]/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0038BD] dark:text-blue-300 flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0038BD] dark:group-hover:text-blue-400 transition-colors">
                        My Deliveries & Shipments
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Live tracking status and parcel history
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0038BD] transition-colors" />
                </button>
              )}

              {/* Sign out button */}
              <div className="pt-2">
                <button
                  id="auth-logout-action-btn"
                  type="button"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full h-10 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400/40"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                  <span>{loading ? 'Signing out...' : 'Sign out from account'}</span>
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: FORGOT PASSWORD FLOW */}
          {viewMode === 'forgot_password' && (
            <div className="transition-all duration-200 animate-in fade-in">
              {resetEmailSent ? (
                <div className="space-y-4 text-center py-2">
                  <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 text-left">
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      We dispatched password recovery instructions to:
                    </p>
                    <p className="text-xs font-bold text-[#0038BD] dark:text-blue-400 mt-1 truncate">
                      {emailInput}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-normal">
                      If you do not see the email in your inbox within 2 minutes, please check your spam or junk folder.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('signin');
                        clearFeedback();
                        setResetEmailSent(false);
                      }}
                      className="w-full h-11 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Return to Sign In
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleEmailSubmit(e)}
                      disabled={loading}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                      <span>Resend recovery email</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4" aria-busy={loading}>
                  <div>
                    <label htmlFor="auth-forgot-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Account Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="auth-forgot-email"
                        ref={emailInputRef}
                        type="email"
                        required
                        autoComplete="email"
                        value={emailInput}
                        disabled={loading}
                        onChange={(e) => {
                          setEmailInput(e.target.value);
                          if (feedback) clearFeedback();
                        }}
                        placeholder="e.g. merchant@example.com"
                        aria-invalid={feedback?.field === 'email'}
                        aria-describedby={feedback ? 'auth-feedback-alert' : undefined}
                        className={`w-full h-11 pl-10 pr-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all disabled:opacity-60 ${
                          feedback?.field === 'email'
                            ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20'
                            : 'border-slate-200/80 dark:border-slate-700/80 focus:ring-2 focus:ring-[#0038BD]/40 dark:focus:ring-blue-500/40 focus:border-[#0038BD]'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    id="auth-send-reset-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#0038BD]/50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{loadingAction || 'Sending reset instructions...'}</span>
                      </div>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('signin');
                        clearFeedback();
                      }}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* VIEW 3: SIGN IN & REGISTER FORMS */}
          {(viewMode === 'signin' || viewMode === 'register') && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5 transition-all duration-200 animate-in fade-in" aria-busy={loading}>
              
              {/* Account Type Selector for Registration */}
              {viewMode === 'register' && (
                <div className="flex p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl mb-3 border border-slate-200/60 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => setAccountType('personal')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      accountType === 'personal'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('business')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      accountType === 'business'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Business or Merchant
                  </button>
                </div>
              )}

              {/* Extra Fields for Registration */}
              {viewMode === 'register' && (
                <>
                  <div>
                    <label htmlFor="auth-register-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="auth-register-name"
                        ref={nameInputRef}
                        type="text"
                        required
                        autoComplete="name"
                        value={nameInput}
                        disabled={loading}
                        onChange={(e) => {
                          setNameInput(e.target.value);
                          if (feedback) clearFeedback();
                        }}
                        placeholder="e.g. Ramesh Kulkarni"
                        aria-invalid={feedback?.field === 'name'}
                        aria-describedby={feedback ? 'auth-feedback-alert' : undefined}
                        className={`w-full h-11 pl-10 pr-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all disabled:opacity-60 ${
                          feedback?.field === 'name'
                            ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20'
                            : 'border-slate-200/80 dark:border-slate-700/80 focus:ring-2 focus:ring-[#0038BD]/40 dark:focus:ring-blue-500/40 focus:border-[#0038BD]'
                        }`}
                      />
                    </div>
                  </div>

                  {accountType === 'business' && (
                    <div>
                      <label htmlFor="auth-register-business" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Firm or Shop Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="auth-register-business"
                          type="text"
                          value={businessInput}
                          disabled={loading}
                          onChange={(e) => {
                            setBusinessInput(e.target.value);
                            if (feedback) clearFeedback();
                          }}
                          placeholder="e.g. Sharda Cloth Stores"
                          className="w-full h-11 pl-10 pr-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038BD]/40 dark:focus:ring-blue-500/40 focus:border-[#0038BD] transition-all disabled:opacity-60"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="auth-register-phone" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="auth-register-phone"
                        type="tel"
                        autoComplete="tel"
                        value={phoneInput}
                        disabled={loading}
                        onChange={(e) => {
                          setPhoneInput(e.target.value);
                          if (feedback) clearFeedback();
                        }}
                        placeholder="10-digit mobile number"
                        className="w-full h-11 pl-10 pr-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038BD]/40 dark:focus:ring-blue-500/40 focus:border-[#0038BD] transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label htmlFor="auth-email-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-email-input"
                    ref={emailInputRef}
                    type="email"
                    required
                    autoComplete="email"
                    value={emailInput}
                    disabled={loading}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (feedback) clearFeedback();
                    }}
                    placeholder="name@example.com"
                    aria-invalid={feedback?.field === 'email'}
                    aria-describedby={feedback ? 'auth-feedback-alert' : undefined}
                    className={`w-full h-11 pl-10 pr-3 rounded-xl bg-white/70 dark:bg-slate-800/60 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all disabled:opacity-60 ${
                      feedback?.field === 'email'
                        ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20'
                        : 'border-slate-200/80 dark:border-slate-700/80 focus:ring-2 focus:ring-[#0038BD]/40 dark:focus:ring-blue-500/40 focus:border-[#0038BD]'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="auth-password-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {viewMode === 'signin' && (
                    <button
                      id="auth-forgot-password-link"
                      type="button"
                      onClick={() => {
                        setViewMode('forgot_password');
                        clearFeedback();
                      }}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="auth-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete={viewMode === 'register' ? 'new-password' : 'current-password'}
                    value={passwordInput}
                    disabled={loading}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (feedback) clearFeedback();
                    }}
                    placeholder={viewMode === 'register' ? 'Minimum 6 characters' : 'Enter password'}
                    aria-invalid={feedback?.field === 'password'}
                    aria-describedby={feedback ? 'auth-feedback-alert' : undefined}
                    className={`w-full h-11 pl-10 pr-10 rounded-xl bg-white/70 dark:bg-slate-800/60 border text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all disabled:opacity-60 ${
                      feedback?.field === 'password'
                        ? 'border-red-400 dark:border-red-500 ring-2 ring-red-400/20'
                        : 'border-slate-200/80 dark:border-slate-700/80 focus:ring-2 focus:ring-[#0038BD]/40 dark:focus:ring-blue-500/40 focus:border-[#0038BD]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <div className="pt-1.5">
                <button
                  id="auth-primary-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#0038BD]/50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-current" />
                      <span>{loadingAction || (viewMode === 'register' ? 'Creating account...' : 'Signing you in...')}</span>
                    </div>
                  ) : (
                    <span>{viewMode === 'register' ? 'Create Account' : 'Sign In'}</span>
                  )}
                </button>
              </div>

              {/* Divider: or continue with (Strictly zero em-dashes) */}
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-slate-200/80 dark:bg-slate-700/80" />
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  or continue with
                </span>
                <div className="h-px flex-1 bg-slate-200/80 dark:bg-slate-700/80" />
              </div>

              {/* Google Authentication Button */}
              <button
                id="auth-google-cta-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-11 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xs active:scale-[0.99] cursor-pointer disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#0038BD]/40"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Mode Toggle Link */}
              <div className="text-center pt-3">
                {viewMode === 'signin' ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Don't have a Joshi Couriers account?{' '}
                    <button
                      id="auth-switch-to-register"
                      type="button"
                      onClick={() => {
                        setViewMode('register');
                        clearFeedback();
                      }}
                      className="text-[#0038BD] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                    >
                      Create account
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <button
                      id="auth-switch-to-signin"
                      type="button"
                      onClick={() => {
                        setViewMode('signin');
                        clearFeedback();
                      }}
                      className="text-[#0038BD] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>

            </form>
          )}

        </div>
      </main>

      {/* FOOTER: CALM, DISCREET & DEV-ONLY TESTING LINK */}
      <footer className="relative z-20 w-full px-5 sm:px-8 py-4 flex items-center justify-between text-[11px] text-white/50">
        <p>Joshi Couriers Direct Logistics</p>

        {/* Discreet Developer 1-Click Access control (Isolated from normal customers) */}
        <div className="relative">
          <button
            id="auth-dev-access-toggle"
            type="button"
            onClick={() => setShowDevSheet(!showDevSheet)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-white/50 hover:text-white transition-colors cursor-pointer"
            title="Development Preview 1-Click Access"
          >
            <Code className="w-3 h-3" />
            <span>Dev Access</span>
          </button>

          {/* Discreet Flyout for 1-Click Testing */}
          {showDevSheet && (
            <div 
              id="auth-dev-sheet"
              className="absolute right-0 bottom-8 w-72 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150"
            >
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Preview 1-Click Access
                </span>
                <button
                  type="button"
                  onClick={() => setShowDevSheet(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                Development test sessions for preview verification:
              </p>
              
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleDevSignIn('admin')}
                  disabled={loading}
                  className="w-full text-left p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200/70 dark:border-amber-900/50 transition-colors cursor-pointer"
                >
                  <p className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                    Fleet Admin (Akash Joshi)
                  </p>
                  <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                    Full vehicle manifest and analytics access
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDevSignIn('customer')}
                  disabled={loading}
                  className="w-full text-left p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/70 dark:border-blue-900/50 transition-colors cursor-pointer"
                >
                  <p className="text-[11px] font-bold text-blue-900 dark:text-blue-200">
                    Jalna Merchant (Anand Patel)
                  </p>
                  <p className="text-[10px] text-blue-800/80 dark:text-blue-300/80">
                    Merchant parcel tracking and delivery receipts
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
