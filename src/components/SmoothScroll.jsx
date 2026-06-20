import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Instantiate Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Heavy, luxurious deceleration curve
      smoothWheel: true,
      syncTouch: false,
    });

    window.lenis = lenis;

    // Synchronize Lenis scrolling timeline with GSAP ScrollTrigger updates
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Hook Lenis raf loops to the GSAP ticker
    const updateTicker = (time) => {
      lenis.raf(time * 1000); // GSAP ticker uses seconds, Lenis raf expects milliseconds
    };

    gsap.ticker.add(updateTicker);

    // Set lag smoothing to 0 to prevent synchronization delays
    gsap.ticker.lagSmoothing(0);

    // Smoothly scroll to target element on hash link clicks
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a');
      const href = anchor?.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, {
            offset: -80, // Offset to prevent fixed navbar overlapping sections
            duration: 1.6,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Eased luxury scroll physics
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      window.lenis = null;
      gsap.ticker.remove(updateTicker);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}
