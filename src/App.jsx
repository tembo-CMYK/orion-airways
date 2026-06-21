import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Import components
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import SmoothScroll from './components/SmoothScroll';
import BookingCapsule from './components/BookingCapsule';
import ExperienceManifesto from './components/ExperienceManifesto';
import SignatureMembership from './components/SignatureMembership';
import ConciergeServices from './components/ConciergeServices';
import DestinationsGallery from './components/DestinationsGallery';
import FlightResultsDrawer from './components/FlightResultsDrawer';
import ClosingCTA from './components/ClosingCTA';

// Import local visual assets
import planeVideo from './assets/Orion Airways.mp4';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchData, setSearchData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const videoRef = useRef(null);

  // States for new interactive buttons and modally connected pages
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [isConciergeDrawerOpen, setIsConciergeDrawerOpen] = useState(false);
  const [isManageBookingModalOpen, setIsManageBookingModalOpen] = useState(false);
  const [helpModalContent, setHelpModalContent] = useState(null);
  const [prefilledToCode, setPrefilledToCode] = useState(null);
  const [isSafetyDrawerOpen, setIsSafetyDrawerOpen] = useState(false);

  // Easing curve for premium luxury transitions
  const luxuryEase = [0.16, 1, 0.3, 1];

  const handleSearchSubmit = (data) => {
    setSearchData(data);
    setIsDrawerOpen(true);
  };

  // Pre-fill destination and scroll to BookingCapsule
  const handleSelectDestination = (code) => {
    setPrefilledToCode(code);
    const inputEl = document.querySelector('input');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Allow scrolling momentum to finish before focusing
      setTimeout(() => {
        inputEl.focus();
      }, 700);
    }
  };

  // Help Dropdown click handler
  const handleHelpItemClick = (itemType) => {
    if (itemType === 'status') {
      setHelpModalContent({
        title: 'Flight Status',
        content: [
          'Orion Airways maintains an industry-leading 99.8% on-time departure rate.',
          'To query a flight status in real-time, please check the status updates in your secure Concierge portal, or enter your PNR in the Manage Booking utility.',
          'For immediate dispatcher coordination, contact our 24/7 flight operations desk at ops@orionairways.com.'
        ]
      });
    } else if (itemType === 'baggage') {
      setHelpModalContent({
        title: 'Baggage Guidelines',
        content: [
          'Because our fleet ranges from light executive jets to large ultra-long-range aircraft, baggage capacities vary by airframe.',
          'Generally, charter guests enjoy unrestricted cabin bag rules and up to 40kg of checked baggage capacity per guest.',
          'For hazardous cargo, large sporting gear, or custom baggage load configurations, please alert your concierge coordinator at least 24 hours prior to departure.'
        ]
      });
    } else if (itemType === 'assistance') {
      setHelpModalContent({
        title: 'Special Assistance',
        content: [
          'We cater to medical conditions, accessibility profiles, and private security protocols.',
          'Ambulatory transfers, in-cabin medical devices, and custom dietary requests can be fully configured ahead of flight time.',
          'Please share your exact profile requirements with our aviation specialists during check-in.'
        ]
      });
    }
  };

  // Programmatic seamless loop handler for the background video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Seek back to start 0.15s before the file ends to prevent standard browser loop stutters
      if (video.duration && video.currentTime > video.duration - 0.15) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isLoading]);

  const isAnyModalOpen = isDrawerOpen || isMembershipModalOpen || isConciergeDrawerOpen || isManageBookingModalOpen || !!helpModalContent || isSafetyDrawerOpen;

  // Disable background scrolling when any modal/drawer is open
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      window.orionLenis?.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.orionLenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.orionLenis?.start();
    };
  }, [isAnyModalOpen]);

  return (
    <>
      {/* 1. Preloader entrance sequence */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div className="relative min-h-screen bg-navy-950 text-white font-sans selection:bg-accent/30 selection:text-white overflow-x-hidden">
        
        {/* Render main page once preloader finishes */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(15px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, ease: luxuryEase }}
          >
            {/* SmoothScroll wraps all page content for Lenis/GSAP scroll synchronizations */}
            <SmoothScroll>
              
              {/* 2. Navigation Header */}
              <Navbar 
                onManageBookingClick={() => setIsManageBookingModalOpen(true)}
                onHelpItemClick={handleHelpItemClick}
              />

              {/* 3. Hero Section with background video and booking capsule */}
              <section className="relative z-20 min-h-screen flex flex-col justify-between pt-32 pb-16 px-8 md:px-16 lg:px-24">
                {/* Background video overlay & decorative glows - contained in an absolute wrapper with overflow-hidden */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  {/* Decorative background radial glows */}
                  <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                  <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-white/2 rounded-full blur-[120px] pointer-events-none" />
                  
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover opacity-35 filter brightness-90 contrast-95"
                  >
                    <source src={planeVideo} type="video/mp4" />
                  </video>
                  {/* Subtle dark radial overlay for premium readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/80" />
                </div>

                <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center relative z-10 my-auto py-12">
                  
                  {/* Tagline */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: luxuryEase }}
                    className="flex items-center gap-3 text-accent text-[12px] md:text-xs font-light tracking-[0.3em] uppercase mb-6"
                  >
                    <span className="h-[1px] w-8 bg-accent/40" />
                    The New Standard of Private Travel
                  </motion.div>

                  {/* Main Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 35, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.5, delay: 0.4, ease: luxuryEase }}
                    className="text-[32px] sm:text-[36px] md:text-7xl font-extralight tracking-tight leading-[1.1] text-white"
                  >
                    Elevating the <br />
                    <span className="font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-accent">
                      Art of Flight
                    </span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, delay: 0.7, ease: luxuryEase }}
                    className="mt-6 text-[16px] md:text-base font-light text-white/50 tracking-wider max-w-lg leading-[1.5] mb-12"
                  >
                    Experience seamless global journeys tailored to the absolute highest tier of safety, discretion, and elegant luxury.
                  </motion.p>

                  {/* Booking capsule input widget */}
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, delay: 1.0, ease: luxuryEase }}
                    className="w-full max-w-6xl mt-4"
                  >
                    <BookingCapsule 
                      onSearchSubmit={handleSearchSubmit} 
                      prefilledTo={prefilledToCode}
                      clearPrefilledTo={() => setPrefilledToCode(null)}
                    />
                  </motion.div>

                </div>

                {/* Hero bottom spacer to maintain premium alignment */}
                <div className="max-w-7xl mx-auto w-full relative z-10 flex items-center justify-between border-t border-white/5 pt-6 text-[10px] font-light tracking-[0.25em] text-white/30 uppercase">
                  <span>Orion Airways</span>
                  <span>Est. 2026</span>
                </div>
              </section>

              {/* 4. Experience Manifesto Section */}
              <ExperienceManifesto onLearnMoreClick={() => setIsSafetyDrawerOpen(true)} />

              {/* Signature Membership Section */}
              <SignatureMembership onRequestAccess={(tier) => {
                setSelectedTier(tier);
                setIsMembershipModalOpen(true);
              }} />

              {/* Concierge Services Section */}
              <ConciergeServices onExploreConcierge={() => setIsConciergeDrawerOpen(true)} />

              {/* 5. Destinations Gallery Section */}
              <DestinationsGallery onSelectDestination={handleSelectDestination} />

              {/* 6. Closing Call-to-Action */}
              <ClosingCTA />

              {/* 7. Footer */}
              <footer className="py-16 bg-navy-950 border-t border-white/5 text-center text-[10px] font-light tracking-[0.2em] text-white/40 uppercase relative z-10">
                <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <span>© 2026 Orion Airways. All Rights Reserved.</span>
                  <div className="flex gap-8">
                    <a href="#privacy" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
                    <a href="#terms" className="hover:text-white transition-colors duration-300">Terms of Service</a>
                  </div>
                </div>
              </footer>

            </SmoothScroll>

          </motion.div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 🛑 GLOBAL MODALS & DRAWERS (RENDERED AT THE ROOT TO AVOID STACKING BUGS)  */}
      {/* ========================================================================= */}
      {!isLoading && (
        <>
          {/* 8. Flight search results slide-out drawer */}
          <FlightResultsDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            searchData={searchData}
          />

          {/* 9. Membership Inquiry Modal */}
          <AnimatePresence>
            {isMembershipModalOpen && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                  onClick={() => setIsMembershipModalOpen(false)}
                />
                
                {/* Modal Container */}
                <motion.div
                  initial={{ scale: 0.95, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: luxuryEase }}
                  className="bg-navy-950/98 border border-white/10 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 max-h-[90dvh] overflow-y-auto"
                  data-lenis-prevent
                >
                  <button 
                    onClick={() => setIsMembershipModalOpen(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                  
                  <span className="text-accent text-[9px] font-light tracking-[0.3em] uppercase block mb-1">
                    Membership Application
                  </span>
                  <h2 className="text-xl md:text-2xl font-light tracking-wide text-white uppercase mb-6">
                    Orion {selectedTier} Access
                  </h2>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    alert(`Thank you. Your request for Orion ${selectedTier} membership has been received. Our concierge team will contact you shortly.`);
                    setIsMembershipModalOpen(false);
                  }} className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-light text-white/55">Full Name</label>
                      <input required type="text" className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent/40" placeholder="Alexander Mercer" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-light text-white/55">Corporate Email</label>
                      <input required type="email" className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent/40" placeholder="alex@mercer.com" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-light text-white/55">Phone Number</label>
                      <input required type="tel" className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent/40" placeholder="+1 (555) 019-2834" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-light text-white/55">Preferred Contact Method</label>
                      <select className="bg-navy-950 border border-white/10 rounded px-4 py-2.5 text-xs text-white/70 focus:outline-none focus:border-accent/40">
                        <option>Email</option>
                        <option>Phone Call</option>
                        <option>Secure Chat / WhatsApp</option>
                      </select>
                    </div>
                    
                    <button type="submit" className="w-full h-[48px] px-8 mt-4 text-[12px] font-light tracking-[0.2em] uppercase border border-accent bg-accent/10 hover:bg-accent text-accent hover:text-navy-950 transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center">
                      Submit Inquiry
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 10. Concierge Services Drawer */}
          <AnimatePresence>
            {isConciergeDrawerOpen && (
              <div className="fixed inset-0 z-[9999] flex justify-end">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                  onClick={() => setIsConciergeDrawerOpen(false)}
                />
                
                {/* Drawer Container */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: luxuryEase }}
                  className="h-[100dvh] w-full max-w-xl bg-navy-950/98 border-l border-white/10 shadow-2xl flex flex-col overflow-hidden text-white relative z-10"
                >
                  <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 flex-shrink-0">
                    <div>
                      <span className="text-[9px] font-light tracking-[0.25em] text-accent uppercase block">Bespoke Portal</span>
                      <h2 className="text-base md:text-lg font-light tracking-wide text-white uppercase mt-1">Orion Concierge Services</h2>
                    </div>
                    <button
                      onClick={() => setIsConciergeDrawerOpen(false)}
                      className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div data-lenis-prevent className="flex-1 overflow-y-auto px-8 pt-8 pb-20 flex flex-col gap-8">
                    <p className="text-xs font-light text-white/50 leading-relaxed">
                      Our concierge team acts as a single point of contact for every aspect of your travel lifestyle. Beyond private aviation, we arrange custom itineraries, private estates, and luxury assets globally.
                    </p>
                    
                    <div className="flex flex-col gap-6">
                      <div className="p-5 border border-white/5 bg-white/[0.01] rounded-lg">
                        <h4 className="text-xs font-medium text-accent uppercase tracking-wider mb-2">Private Terminal Coordination</h4>
                        <p className="text-[11px] font-light text-white/60 leading-relaxed">Skip standard security lines. Access exclusive private suites at private terminals, where customs, luggage, and secure gateboarding are managed on your behalf.</p>
                      </div>
                      
                      <div className="p-5 border border-white/5 bg-white/[0.01] rounded-lg">
                        <h4 className="text-xs font-medium text-accent uppercase tracking-wider mb-2">Helicopter Airport Connections</h4>
                        <p className="text-[11px] font-light text-white/60 leading-relaxed">Bypass city congestion. Direct transfers from airport runways to downtown helipads are arranged for maximum time efficiency.</p>
                      </div>
                      
                      <div className="p-5 border border-white/5 bg-white/[0.01] rounded-lg">
                        <h4 className="text-xs font-medium text-accent uppercase tracking-wider mb-2">Bespoke In-flight Catering</h4>
                        <p className="text-[11px] font-light text-white/60 leading-relaxed">Michelin-grade meals custom curated to your culinary and dietary requirements. Accompanied by selected vintage champagnes and fine wines.</p>
                      </div>
                      
                      <div className="p-5 border border-white/5 bg-white/[0.01] rounded-lg">
                        <h4 className="text-xs font-medium text-accent uppercase tracking-wider mb-2">Luxury Yacht & Villa Charters</h4>
                        <p className="text-[11px] font-light text-white/60 leading-relaxed">Exclusive access to off-market mega-yachts, premium chalets, and secure private villas across key resort destinations.</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setIsConciergeDrawerOpen(false);
                        setIsMembershipModalOpen(true);
                        setSelectedTier("Concierge");
                      }}
                      className="w-full h-[48px] px-8 text-[12px] font-light tracking-[0.2em] uppercase border border-accent bg-accent/10 hover:bg-accent text-accent hover:text-navy-950 transition-all duration-300 rounded-sm cursor-pointer mb-8 flex items-center justify-center"
                    >
                      Submit Bespoke Request
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 11. Manage Booking Modal */}
          <AnimatePresence>
            {isManageBookingModalOpen && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                  onClick={() => setIsManageBookingModalOpen(false)}
                />
                
                {/* Container */}
                <motion.div
                  initial={{ scale: 0.95, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: luxuryEase }}
                  className="bg-navy-950/98 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 max-h-[90dvh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                  data-lenis-prevent
                >
                  <button 
                    onClick={() => setIsManageBookingModalOpen(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                  
                  <span className="text-accent text-[9px] font-light tracking-[0.3em] uppercase block mb-1">
                    Secure Retrieval
                  </span>
                  <h2 className="text-xl font-light tracking-wide text-white uppercase mb-6">
                    Manage Booking
                  </h2>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    alert("Flight lookup complete. Booking reference active. Details have been sent to your registered email.");
                    setIsManageBookingModalOpen(false);
                  }} className="flex flex-col gap-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-light text-white/55">Booking Reference (PNR)</label>
                      <input required type="text" maxLength={6} className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent/40 uppercase" placeholder="OR8X4A" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-light text-white/55">Last Name</label>
                      <input required type="text" className="bg-white/5 border border-white/10 rounded px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent/40" placeholder="Mercer" />
                    </div>
                    
                    <button type="submit" className="w-full h-[48px] px-8 mt-4 text-[12px] font-light tracking-[0.2em] uppercase border border-accent bg-accent/10 hover:bg-accent text-accent hover:text-navy-950 transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center">
                      Retrieve Flight
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 12. Help Info Modal */}
          <AnimatePresence>
            {helpModalContent && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-md"
                  onClick={() => setHelpModalContent(null)}
                />
                
                {/* Container */}
                <motion.div
                  initial={{ scale: 0.95, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.95, y: 20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: luxuryEase }}
                  className="bg-navy-950/98 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 text-left max-h-[90dvh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                  data-lenis-prevent
                >
                  <button 
                    onClick={() => setHelpModalContent(null)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                  
                  <span className="text-accent text-[9px] font-light tracking-[0.3em] uppercase block mb-1">
                    Information Center
                  </span>
                  <h2 className="text-xl font-light tracking-wide text-white uppercase mb-4">
                    {helpModalContent.title}
                  </h2>
                  
                  <div className="text-xs font-light text-white/60 leading-relaxed flex flex-col gap-3">
                    {helpModalContent.content.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => setHelpModalContent(null)}
                    className="w-full h-[48px] px-8 mt-6 text-[12px] font-light tracking-[0.2em] uppercase border border-white/10 hover:bg-white/5 text-white transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center"
                  >
                    Close Window
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* 13. Safety Protocols Drawer (Moved to root level to prevent clipping inside manifesto section) */}
          <AnimatePresence>
            {isSafetyDrawerOpen && (
              <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
                  transition={{ duration: 0.5, ease: luxuryEase }}
                  className="absolute inset-0 bg-black/60"
                  onClick={() => setIsSafetyDrawerOpen(false)}
                />
                
                {/* Bottom Drawer Container */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ duration: 0.7, ease: luxuryEase }}
                  className="bg-navy-950 border-t border-white/10 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden text-white relative z-10 max-h-[85dvh] md:max-h-[70dvh] w-full"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 flex-shrink-0">
                    <div>
                      <h3 className="text-sm font-light tracking-[0.2em] uppercase text-accent">Safety & Security</h3>
                      <h2 className="text-lg md:text-xl font-light tracking-wide text-white uppercase mt-1">Operational Protocols</h2>
                    </div>
                    <button
                      onClick={() => setIsSafetyDrawerOpen(false)}
                      className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer"
                      aria-label="Close Protocols"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div data-lenis-prevent className="flex-1 overflow-y-auto px-8 pt-8 pb-20 flex flex-col md:flex-row gap-12 max-w-6xl mx-auto w-full">
                    <div className="flex-1 flex flex-col gap-6 font-light text-sm text-white/60 leading-relaxed max-w-xl">
                      <p>
                        At Orion Airways, safety is not a parameter—it is our core commitment. Every operation, flight crew, and structural maintenance detail is managed under standards that exceed international civil aviation requirements.
                      </p>
                      
                      <div className="h-[1px] bg-white/5 w-12" />

                      <h4 className="text-xs font-normal text-white uppercase tracking-widest">Crew Selection & Training</h4>
                      <p>
                        Our captains average over 7,500 flight hours. Every flight operates with two fully qualified captains, subjected to bi-annual simulator training and physiological screening at premier European and South African centers.
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col gap-6 font-light text-sm text-white/60 leading-relaxed max-w-xl">
                      <h4 className="text-xs font-normal text-white uppercase tracking-widest">Maintenance Compliance</h4>
                      <p>
                        Our fleet undergoes inspection procedures before every single flight. Airframes are maintained in OEM-authorized facilities under continuous monitoring, utilizing real-time engine health data telemetry.
                      </p>

                      <h4 className="text-xs font-normal text-white uppercase tracking-widest">Global Operations Center</h4>
                      <p>
                        Our dedicated flight center monitors every journey 24/7. We utilize satellite tracking, flight dynamic dispatching, and live regional flight hazard mapping to adjust paths proactively.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-8 py-6 border-t border-white/5 bg-navy-950/80 text-center flex-shrink-0">
                    <p className="text-[9px] font-light tracking-[0.2em] text-white/30 uppercase font-sans">
                      Orion Airways Operational Integrity Code
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
