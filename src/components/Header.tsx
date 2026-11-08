import React, { useState } from 'react';
import { 
  Box, 
  Menu, 
  X, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  User, 
  Package, 
  BarChart3, 
  ShieldCheck, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuthParcel } from '../context/AuthParcelContext';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenAuth: () => void;
  onOpenCustomerParcels: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenBooking,
  onOpenAuth,
  onOpenCustomerParcels,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { currentUser, userParcels, logout } = useAuthParcel();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800/80 shadow-2xs w-full transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-18 gap-2">
          
          {/* Brand Logo Left */}
          <a 
            href="#" 
            className="flex items-center gap-2 sm:gap-2.5 md:gap-3 group focus:outline-none shrink min-w-0" 
            id="brand-logo"
            aria-label="Joshi Couriers Home"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0038BD] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-150 shrink-0">
              <Box className="w-4 h-4 sm:w-5 sm:h-5 text-[#EF8E01]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm min-[360px]:text-base sm:text-xl font-black tracking-tight text-[#0038BD] dark:text-blue-400 leading-tight truncate">
                Joshi Couriers
              </span>
              <span className="hidden min-[400px]:inline text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-normal truncate">
                Fast. Reliable. Local.
              </span>
            </div>
          </a>

          {/* Center/Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
            
            {/* If Logged in as Admin */}
            {currentUser?.role === 'admin' && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={onOpenAdmin}
                  id="header-admin-analytics-btn"
                  aria-label="Admin Analytics & Manifest"
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-[#0038BD] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 transition-colors shadow-2xs shrink-0"
                >
                  <BarChart3 className="w-4 h-4 text-[#0038BD] dark:text-blue-400 shrink-0" />
                  <span className="hidden md:inline whitespace-nowrap">Admin Analytics</span>
                </button>
              </div>
            )}

            {/* My Shipments Control (Visible for customer or when parcels exist) */}
            {(currentUser?.role === 'customer' || userParcels.length > 0) && (
              <button
                onClick={onOpenCustomerParcels}
                id="header-my-parcels-btn"
                aria-label={`My Shipments (${userParcels.length} ${userParcels.length === 1 ? 'parcel' : 'parcels'})`}
                title={`My Shipments (${userParcels.length})`}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2 min-[380px]:px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-[#0038BD] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 transition-colors shadow-2xs shrink-0 focus:outline-none focus:ring-2 focus:ring-[#0038BD]/30"
              >
                <Package className="w-4 h-4 text-[#0038BD] dark:text-blue-400 shrink-0" />
                <span className="hidden min-[480px]:inline whitespace-nowrap">My Shipments</span>
                <span className="bg-[#0038BD] dark:bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black leading-none shrink-0">
                  {userParcels.length}
                </span>
              </button>
            )}

            {/* Auth / Account Profile Button */}
            {currentUser ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  id="header-user-menu-btn"
                  aria-label={`User account menu for ${currentUser.name}`}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="true"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0 ${
                    currentUser.role === 'admin' ? 'bg-[#EF8E01]' : 'bg-[#0038BD]'
                  }`}>
                    {currentUser.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : currentUser.name[0]}
                  </div>
                  <span className="hidden md:inline max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-24px)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {currentUser.businessName || currentUser.phone}
                      </p>
                      <span className={`inline-block mt-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                        currentUser.role === 'admin' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300' : 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300'
                      }`}>
                        {currentUser.role === 'admin' ? 'Courier Admin' : 'Regular Customer'}
                      </span>
                    </div>

                    {currentUser.role === 'admin' ? (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-[#0038BD] dark:hover:text-blue-400 flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4 text-[#0038BD] dark:text-blue-400" />
                        <span>Admin Analytics &amp; Manifest</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenCustomerParcels();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-[#0038BD] dark:hover:text-blue-400 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-[#0038BD] dark:text-blue-400" />
                        <span>My Parcel List ({userParcels.length})</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Switch Account</span>
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                id="header-sign-in-btn"
                aria-label="Sign in to your account"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#0038BD] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700"
              >
                <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* Theme Toggle (Header Bar) */}
            <ThemeToggle variant="header" className="hidden min-[360px]:flex" />

            {/* Primary Orange CTA */}
            <button
              onClick={onOpenBooking}
              id="header-book-pickup-btn"
              aria-label="Book Doorstep Parcel Pickup"
              className="inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 min-[360px]:px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold text-white bg-[#EF8E01] hover:bg-[#d88001] shadow-xs hover:shadow-md active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EF8E01] focus:ring-offset-1 shrink-0 whitespace-nowrap"
            >
              <span>Book Pickup</span>
              <ArrowRight className="hidden min-[360px]:inline w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </button>

            {/* Hamburger Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="header-menu-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              className="w-11 h-11 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700 shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Slide-down Menu Drawer */}
      {mobileMenuOpen && (
        <nav 
          id="mobile-navigation-drawer"
          aria-label="Mobile Navigation"
          className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 transition-colors"
        >
          <div className="max-w-7xl mx-auto space-y-3">
            
            {/* Account Card in mobile drawer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              {currentUser ? (
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {currentUser.businessName || currentUser.phone}
                  </p>
                </div>
              ) : (
                <div>
                  <strong className="text-xs font-bold text-slate-800 dark:text-slate-200">Visiting as Guest</strong>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Sign in to view your parcel list &amp; repeat pickups</p>
                </div>
              )}

              {currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline py-1 px-2"
                  aria-label="Log Out"
                >
                  Log Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0038BD] hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                  aria-label="Sign In"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Drawer Theme Switcher Row */}
            <ThemeToggle variant="drawer" />

            {/* If Customer or has parcels */}
            {(currentUser?.role === 'customer' || userParcels.length > 0) && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomerParcels();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs font-bold text-[#0038BD] dark:text-blue-400 flex items-center justify-between transition-colors"
                aria-label={`View my entire parcel list (${userParcels.length} parcels)`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 shrink-0" />
                  <span>My Entire Parcel List</span>
                </div>
                <span className="bg-[#0038BD] dark:bg-blue-600 text-white px-2 py-0.5 rounded-full text-[11px] font-black">
                  {userParcels.length}
                </span>
              </button>
            )}

            {/* If Admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs font-bold text-[#0038BD] dark:text-blue-400 flex items-center gap-2 transition-colors"
                aria-label="Open Admin Analytics and Live Manifest"
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>Admin Analytics &amp; Live Manifest</span>
              </button>
            )}

            {/* Schedule Notice */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-slate-100">Joshi Couriers (Father &amp; Son Team)</p>
              <p>Daily Morning Route: Jalna (4-5 AM) ➔ Partur (6-6:30 AM) ➔ Mantha</p>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">Delivery Window: 6:30 - 8:30 AM</p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white bg-[#EF8E01] hover:bg-[#d88001] shadow-xs active:scale-98 transition-all"
                aria-label="Book Doorstep Pickup"
              >
                <span>Book Doorstep Pickup</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href="https://wa.me/919404040606?text=Hi%20Joshi%20Couriers,%20I%20want%20to%20send%20a%20parcel%20from%20Jalna."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 transition-colors"
                aria-label="Chat on WhatsApp with Joshi Couriers (+91 94040 40606)"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <span>Chat on WhatsApp (+91 94040 40606)</span>
              </a>

              <a
                href="tel:+919404040606"
                className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#0038BD] dark:hover:text-blue-400 transition-colors"
                aria-label="Call Joshi Couriers directly at +91 94040 40606"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Call Directly: +91 94040 40606</span>
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
