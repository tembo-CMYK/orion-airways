import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Preloader({ onComplete }) {
  useEffect(() => {
    // Elegant timing: preloader runs for 3.8s before triggering exit
    const timer = setTimeout(() => {
      onComplete();
    }, 3800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Easing presets
  const luxuryEase = [0.16, 1, 0.3, 1]; // Custom cubic-bezier for smooth deceleration

  return (
    <motion.div
      initial={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ 
        opacity: 0, 
        filter: 'blur(20px)',
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#03050a] text-white"
    >
      {/* Decorative ambient background light */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 3, ease: luxuryEase }}
        className="absolute w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="flex flex-col items-center gap-8 relative z-10 select-none">
        
        {/* The Golden Wing Icon Reveal */}
        <div className="overflow-hidden p-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ 
              duration: 2.2, 
              ease: luxuryEase,
              delay: 0.2
            }}
            className="w-20 h-20 flex items-center justify-center"
          >
            <svg className="w-full h-full text-white" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 32 L35 14 L65 32 L26 39 Z" fill="url(#preloadGold)" />
              <path d="M35 14 L48 23 L65 32 L35 14 Z" fill="#ffffff" opacity="0.8" />
              <path d="M16 35 L38 23 L55 35 L28 39 Z" fill="#ffffff" opacity="0.3" />
              <defs>
                <linearGradient id="preloadGold" x1="10" y1="14" x2="65" y2="39" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#F5E6B3" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        {/* Brand Text Reveal with Letter Spacing Expansion */}
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(8px)', letterSpacing: '0.2em' }}
            animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0.35em' }}
            transition={{ 
              duration: 2.4, 
              ease: luxuryEase,
              delay: 0.6
            }}
            className="text-[14px] md:text-[16px] font-extralight uppercase text-white tracking-[0.35em] pl-[0.35em]"
          >
            Orion Airways
          </motion.h1>

          {/* Subtitle / Tagline Fades In */}
          <motion.p
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 0.4, y: 0, filter: 'blur(0px)' }}
            transition={{ 
              duration: 2.0, 
              ease: luxuryEase,
              delay: 1.4 
            }}
            className="text-[9px] font-light tracking-[0.3em] uppercase text-accent pl-[0.3em]"
          >
            Elevating the art of flight
          </motion.p>
        </div>

      </div>

      {/* Ambient gold line scanner border bottom */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent origin-center"
      />
    </motion.div>
  );
}
