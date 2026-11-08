import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthParcelProvider } from './context/AuthParcelContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RouteTimelineCard } from './components/RouteTimelineCard';
import { PortalAccessBanner } from './components/PortalAccessBanner';
import { NoticeBar } from './components/NoticeBar';
import { BusinessFeatures } from './components/BusinessFeatures';
import { PricingCtaSection } from './components/PricingCtaSection';
import { TrustBar } from './components/TrustBar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { CustomerParcelsModal } from './components/CustomerParcelsModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';

function MainApp() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCustomerParcelsOpen, setIsCustomerParcelsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-[#FDFDFE] dark:bg-[#070D1A] text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-[#EF8E01]/20 selection:text-[#0038BD] dark:selection:text-blue-400 w-full max-w-full transition-colors duration-200 relative">
      {/* Subtle logistics-inspired atmospheric background with deep Joshi Couriers blue */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        {/* Soft upper ambient blue glow */}
        <div className="absolute -top-24 right-0 w-[600px] h-[500px] bg-gradient-to-b from-[#0038BD]/[0.035] via-blue-500/[0.015] to-transparent dark:from-[#0038BD]/15 dark:via-blue-900/5 blur-3xl" />
        
        {/* Soft mid-corridor ambient glow */}
        <div className="absolute top-1/3 -left-24 w-[480px] h-[480px] bg-gradient-to-tr from-sky-400/[0.02] to-transparent dark:from-blue-900/10 blur-3xl" />
        
        {/* Whisper-thin logistics coordinate matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(#0038BD_0.75px,transparent_0.75px)] dark:bg-[radial-gradient(#3B82F6_0.75px,transparent_0.75px)] [background-size:48px_48px] opacity-[0.035] dark:opacity-[0.05]" />
      </div>

      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0038BD] focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#EF8E01]"
      >
        Skip to main content
      </a>

      {/* 1. Header with Logo, Auth, Dashboard Access, Book Pickup CTA, and Mobile Menu */}
      <Header 
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCustomerParcels={() => setIsCustomerParcelsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Container matching the visual layout */}
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-8 min-w-0">
        
        {/* 2. Hero Section: 2-Column Proposition + Real Vehicle (Mahindra Maxximo MH21 V 6370) */}
        <Hero />

        {/* 3. Route & Delivery Timeline Card */}
        <RouteTimelineCard />

        {/* 4. Regular Sender Parcel History & Admin Analytics Access Grid */}
        <PortalAccessBanner
          onOpenCustomerParcels={() => setIsCustomerParcelsOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenBooking={() => setIsBookingOpen(true)}
        />

        {/* 5. Important Information Bar */}
        <NoticeBar />

        {/* 6. Three Business Value & Trust Cards */}
        <BusinessFeatures />

        {/* 7. Pricing & Action Buttons Section */}
        <PricingCtaSection onOpenBooking={() => setIsBookingOpen(true)} />

        {/* 8. Bottom Trust Strip */}
        <TrustBar />

      </main>

      {/* 9. Authentic Local Footer with Trusted Local Service differentiators */}
      <Footer onOpenBooking={() => setIsBookingOpen(true)} />

      {/* Doorstep Pickup Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialFromId="jalna"
        initialToId="partur"
        onViewMyParcels={() => setIsCustomerParcelsOpen(true)}
      />

      {/* Authentication / Sign In Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onOpenCustomerParcels={() => {
          setIsAuthOpen(false);
          setIsCustomerParcelsOpen(true);
        }}
        onOpenAdmin={() => {
          setIsAuthOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* Customer Parcel List Modal */}
      <CustomerParcelsModal
        isOpen={isCustomerParcelsOpen}
        onClose={() => setIsCustomerParcelsOpen(false)}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Admin Dashboard & Analytics Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthParcelProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </AuthParcelProvider>
    </ThemeProvider>
  );
}
