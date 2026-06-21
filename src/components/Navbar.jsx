import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar({ onManageBookingClick, onHelpItemClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
  
  const helpDropdownRef = useRef(null);
  const [firstLoad, setFirstLoad] = useState(false);

  useEffect(() => {
    const isFirst = sessionStorage.getItem('orion_has_loaded') === null;
    setFirstLoad(isFirst);
    if (isFirst) {
      sessionStorage.setItem('orion_has_loaded', 'true');
    }

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (helpDropdownRef.current && !helpDropdownRef.current.contains(event.target)) {
        setIsHelpDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
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
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={firstLoad ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          paddingTop: isScrolled ? '14px' : '24px',
          paddingBottom: isScrolled ? '14px' : '24px',
          backgroundColor: isScrolled ? 'rgba(6, 9, 19, 0.85)' : 'rgba(255, 255, 255, 0.05)',
          borderColor: isScrolled ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.1)',
        }}
        transition={firstLoad ? {
          y: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
          opacity: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
          default: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
        } : {
          duration: 0.4, ease: [0.25, 1, 0.5, 1]
        }}
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b text-white px-8 md:px-16 lg:px-24"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Zone: Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-3 group">
              <svg className="h-8 w-auto text-white" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Stylized geometric wing logo */}
                <path d="M10 20 L30 8 L55 20 L22 25 Z" fill="url(#goldGrad)" />
                <path d="M30 8 L40 14 L55 20 L30 8 Z" fill="#ffffff" opacity="0.8" />
                <path d="M15 22 L32 14 L46 22 L24 25 Z" fill="#ffffff" opacity="0.3" />
                
                {/* Luxury Typography Logo Text */}
                <text x="68" y="23" fill="#ffffff" fontSize="13" fontWeight="300" letterSpacing="0.25em" fontFamily="Outfit, sans-serif">ORION</text>
                <text x="68" y="32" fill="#D4AF37" fontSize="8" fontWeight="400" letterSpacing="0.4em" fontFamily="Outfit, sans-serif">AIRWAYS</text>
                
                <defs>
                  <linearGradient id="goldGrad" x1="10" y1="8" x2="55" y2="25" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#F5E6B3" />
                  </linearGradient>
                </defs>
              </svg>
            </a>
          </div>

          {/* Center Zone: Destinations & Experience */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-light tracking-[0.25em] uppercase">
            <a href="#destinations" className="hover:text-accent transition-colors duration-300 relative group">
              Destinations
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </a>
            <a href="#experience" className="hover:text-accent transition-colors duration-300 relative group">
              Experience
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </a>
          </nav>

          {/* Right Zone: Actions */}
          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            
            {/* Desktop-only action items */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-light tracking-[0.1em] uppercase">
              {/* Manage Booking */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (onManageBookingClick) onManageBookingClick();
                }}
                className="text-white/70 hover:text-white transition-colors duration-300 hover:underline cursor-pointer bg-transparent border-none text-[11px] font-light tracking-[0.25em] uppercase"
              >
                Manage Booking
              </button>

              {/* vertical pipe separator with 10% opacity */}
              <span className="text-white/10 select-none font-thin text-xs">|</span>

              {/* Help with Glassmorphism Dropdown */}
              <div 
                ref={helpDropdownRef}
                className="relative py-2 cursor-pointer group"
                onMouseEnter={() => setIsHelpDropdownOpen(true)}
                onMouseLeave={() => setIsHelpDropdownOpen(false)}
                onClick={() => setIsHelpDropdownOpen(!isHelpDropdownOpen)}
              >
                <button className="text-white/70 hover:text-white transition-colors duration-300 uppercase flex items-center gap-1.5 focus:outline-none cursor-pointer">
                  Help
                  <span className="text-[7px] inline-block transition-transform duration-300 group-hover:rotate-180">▼</span>
                </button>

                <AnimatePresence>
                  {isHelpDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                      exit={{ opacity: 0, y: 10, scale: 0.98, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full mt-2 w-48 bg-navy-950/90 border border-white/10 rounded-lg p-2 shadow-2xl flex flex-col gap-1 z-50 text-left normal-case tracking-normal"
                    >
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (onHelpItemClick) onHelpItemClick('status');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-light text-white/70 hover:text-white hover:bg-white/5 rounded transition-all bg-transparent border-none cursor-pointer"
                      >
                        Flight Status
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (onHelpItemClick) onHelpItemClick('baggage');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-light text-white/70 hover:text-white hover:bg-white/5 rounded transition-all bg-transparent border-none cursor-pointer"
                      >
                        Baggage Guidelines
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          if (onHelpItemClick) onHelpItemClick('assistance');
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-light text-white/70 hover:text-white hover:bg-white/5 rounded transition-all bg-transparent border-none cursor-pointer"
                      >
                        Special Assistance
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Book Flight (Primary CTA - always visible) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                // Highlight or scroll to BookingCapsule
                const inputEl = document.querySelector('input');
                if (inputEl) {
                  inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  inputEl.focus();
                }
              }}
              className="h-[48px] px-6 md:h-auto md:px-6 md:py-2.5 text-[12px] md:text-[11px] font-light tracking-[0.1em] uppercase border border-accent text-accent bg-transparent hover:bg-accent hover:text-navy-950 transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center"
            >
              Book Flight
            </motion.button>

            {/* Mobile hamburger menu toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>

          </div>

        </div>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-navy-950/98 backdrop-blur-xl flex flex-col justify-center items-center gap-8 md:hidden"
          >
            <div className="flex flex-col items-center gap-4 text-center pt-12 max-w-xs w-full">
              <a
                href="#destinations"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[16px] font-light tracking-[0.15em] uppercase text-white/80 hover:text-accent transition-colors duration-300 h-[48px] flex items-center justify-center w-full"
              >
                Destinations
              </a>
              <a
                href="#experience"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[16px] font-light tracking-[0.15em] uppercase text-white/80 hover:text-accent transition-colors duration-300 h-[48px] flex items-center justify-center w-full"
              >
                Experience
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onManageBookingClick) onManageBookingClick();
                }}
                className="text-[16px] font-light tracking-[0.15em] uppercase text-white/80 hover:text-accent transition-colors duration-300 h-[48px] flex items-center justify-center w-full bg-transparent border-none cursor-pointer"
              >
                Manage Booking
              </button>
              
              <div className="h-[1px] w-8 bg-white/10 my-1" />
              
              <p className="text-[10px] font-extralight tracking-[0.2em] text-white/40 uppercase">Help & Guidelines</p>
              
              <div className="flex flex-col gap-2 text-center w-full">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onHelpItemClick) onHelpItemClick('status');
                  }}
                  className="text-[12px] font-light tracking-[0.15em] text-white/60 hover:text-white transition-colors h-[48px] flex items-center justify-center w-full bg-transparent border-none cursor-pointer"
                >
                  Flight Status
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onHelpItemClick) onHelpItemClick('baggage');
                  }}
                  className="text-[12px] font-light tracking-[0.15em] text-white/60 hover:text-white transition-colors h-[48px] flex items-center justify-center w-full bg-transparent border-none cursor-pointer"
                >
                  Baggage Guidelines
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onHelpItemClick) onHelpItemClick('assistance');
                  }}
                  className="text-[12px] font-light tracking-[0.15em] text-white/60 hover:text-white transition-colors h-[48px] flex items-center justify-center w-full bg-transparent border-none cursor-pointer"
                >
                  Special Assistance
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
