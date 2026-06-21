import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, ArrowRight, ArrowLeft } from 'lucide-react';

// Import local visual assets
import livingstoneImg from '../assets/livingstone_gallery.png';
import safariImg from '../assets/safari_gallery.png';
import capetownImg from '../assets/capetown_gallery.png';
import dubaiImg from '../assets/dubai_gallery.png';

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  {
    code: 'LVI',
    name: 'Livingstone',
    tagline: 'The Smoke That Thunders',
    country: 'Zambia',
    coordinates: '17.8526° S, 25.8640° E',
    image: livingstoneImg
  },
  {
    code: 'MFE',
    name: 'South Luangwa',
    tagline: 'Untamed Wilderness & Safaris',
    country: 'Zambia',
    coordinates: '13.0833° S, 31.8000° E',
    image: safariImg
  },
  {
    code: 'CPT',
    name: 'Cape Town',
    tagline: 'Where Oceans Meet Mountains',
    country: 'South Africa',
    coordinates: '33.9249° S, 18.4241° E',
    image: capetownImg
  },
  {
    code: 'DXB',
    name: 'Dubai',
    tagline: 'The Gateway to Tomorrow',
    country: 'United Arab Emirates',
    coordinates: '25.2048° N, 55.2708° E',
    image: dubaiImg
  }
];

export default function DestinationsGallery({ onSelectDestination }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [hoveredCard, setHoveredCard] = useState(null);
  const touchStartX = useRef(null);

  // GSAP ScrollTrigger for vertical scroll-linked parallax of current slide image
  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.fromTo('.scrub-container',
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '#destinations',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
  }, { scope: containerRef });

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % destinations.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (diffX > threshold) {
      nextSlide();
    } else if (diffX < -threshold) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  const activeDest = destinations[activeIndex];
  const scrollProgress = activeIndex / (destinations.length - 1);

  // Framer Motion variants matching "Grounded Elegance" timing rules
  const slideVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
      transition: {
        duration: 0.8, // Slow smooth breath reveal duration
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8, // Slow smooth breath exit duration to prevent premature truncation
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const textContainerVariants = {
    enter: {},
    center: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2 // stagger entry begins with a 0.2s delay for a premium reveal
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const textItemVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 30 : -30,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8, // consistent 0.6s to 0.8s for reveals
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -30 : 30,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const imageVariants = {
    initial: {
      opacity: 0,
      scale: 1.1,
    },
    animate: {
      opacity: 1,
      scale: 1.0,
      transition: {
        duration: 0.8, // Slow smooth breath transition (0.8s) for fade-in & scale-down
        ease: [0.22, 1, 0.36, 1],
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05, // exits scaling up slightly
      transition: {
        duration: 0.8, // Slow smooth breath transition (0.8s) for fade-out & scale-up
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  const watermarkVariants = {
    enter: {
      opacity: 0,
      scale: 0.95,
    },
    center: {
      opacity: 0.05,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section id="destinations" className="relative w-full h-screen bg-navy-950 overflow-hidden flex flex-col justify-center border-b border-white/5">
      
      {/* Top Header Information Panel */}
      <div className="absolute top-12 left-8 md:top-16 md:left-24 z-20 flex items-center gap-3 text-white/30 text-[9px] md:text-[10px] font-light tracking-[0.25em] uppercase">
        <Compass size={14} className="text-accent/60" />
        <span>Gallery</span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent/40" />
        <span>Curated Destinations</span>
      </div>

      {/* Swipe/Scroll Help Prompt */}
      <div className="absolute top-12 right-8 md:top-16 md:right-24 z-20 hidden md:flex items-center gap-4 text-white/30 text-[9px] font-light tracking-[0.2em] uppercase select-none">
        <span>Click navigation or swipe horizontally</span>
        <ArrowRight size={10} className="animate-pulse" />
      </div>

      {/* Destinations Content Wrapper (Stacked for slide cross-fades) */}
      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full relative overflow-hidden"
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div 
            key={activeDest.code}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            onMouseEnter={() => setHoveredCard(activeDest.code)}
            onMouseLeave={() => setHoveredCard(null)}
            className="w-full h-full absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            
            {/* Parallax Background Image Container */}
            <div className="absolute inset-x-0 -top-[10%] -bottom-[10%] w-full h-[120%] overflow-hidden z-0 bg-navy-900 scrub-container">
              <motion.img 
                key={activeDest.image}
                src={activeDest.image} 
                alt={activeDest.name} 
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.45] pointer-events-none"
              />
              {/* Radial Vignette & Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40 pointer-events-none z-10" />
              <div className="absolute inset-0 bg-navy-950/10 pointer-events-none z-10" />
            </div>

            {/* Typography Content Overlay (Bottom Left) */}
            <motion.div 
              variants={textContainerVariants}
              className="absolute bottom-24 left-8 md:bottom-28 md:left-24 z-20 flex flex-col items-start gap-2 max-w-2xl select-none"
            >
              
              {/* Country & Coordinates Metadata */}
              <motion.div
                variants={textItemVariants}
                className="flex flex-wrap items-center gap-3 text-accent text-[9px] md:text-[11px] font-light tracking-[0.3em] uppercase"
              >
                <span>{activeDest.country}</span>
                <span className="text-white/10 select-none">•</span>
                <span className="text-white/40 tracking-widest">{activeDest.coordinates}</span>
              </motion.div>

              {/* Destination Name Title */}
              <motion.h2
                variants={textItemVariants}
                className="text-4xl sm:text-6xl md:text-8xl font-extralight tracking-tight text-white leading-[1.05]"
              >
                {activeDest.name}
              </motion.h2>

              {/* Sub-details Tagline */}
              <motion.p
                variants={textItemVariants}
                className="text-[10px] md:text-xs font-light tracking-[0.15em] text-white/50 uppercase mt-1"
              >
                {activeDest.tagline} • Charter Code {activeDest.code}
              </motion.p>

              {/* Explore Button */}
              <motion.div 
                variants={textItemVariants}
                className="h-14 overflow-hidden mt-3"
              >
                <button
                  className="px-6 py-2.5 border border-accent bg-accent/5 hover:bg-accent text-accent hover:text-navy-950 transition-all duration-300 rounded-sm text-[9px] md:text-[10px] font-light tracking-[0.2em] uppercase cursor-pointer"
                  onClick={() => {
                    if (onSelectDestination) {
                      onSelectDestination(activeDest.code);
                    }
                  }}
                >
                  Explore Route
                </button>
              </motion.div>

            </motion.div>

            {/* Card Watermark (Right Background) */}
            <motion.div 
              variants={watermarkVariants}
              className="absolute bottom-16 right-8 md:bottom-24 md:right-24 z-10 select-none pointer-events-none hidden sm:block"
            >
              <span className="text-8xl md:text-9xl font-bold tracking-widest text-white font-sans">
                {activeDest.code}
              </span>
            </motion.div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Layout Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-12 right-8 md:bottom-16 md:right-24 z-20 flex items-center gap-3">
        <button
          onClick={prevSlide}
          className="w-12 h-12 md:w-10 md:h-10 flex items-center justify-center border border-white/10 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/80 hover:text-white cursor-pointer"
          aria-label="Previous Destination"
        >
          <ArrowLeft size={18} className="md:w-3.5 md:h-3.5" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 md:w-10 md:h-10 flex items-center justify-center border border-white/10 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/80 hover:text-white cursor-pointer"
          aria-label="Next Destination"
        >
          <ArrowRight size={18} className="md:w-3.5 md:h-3.5" />
        </button>
      </div>

      {/* Progress Decelerator Bar (Bottom Center) */}
      <div className="absolute bottom-12 left-8 right-36 md:bottom-16 md:left-24 md:right-48 h-[1px] bg-white/10 z-20">
        <motion.div 
          className="h-full bg-accent"
          animate={{ scaleX: scrollProgress }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'left' }}
        />
      </div>

    </section>
  );
}
