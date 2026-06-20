import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ClosingCTA() {
  const sectionRef = useRef(null);
  const buttonRef = useRef(null);

  // GSAP Reveal on Scroll
  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, { scope: sectionRef });

  // GSAP Magnetic button pull calculations
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    
    // Compute mouse delta from the button center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Magnetic drag effect (pull elements by 35%)
    gsap.to(button, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  // Reset magnetic button position with an elastic bounce back
  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1.1, 0.6)'
    });
  };

  const handleBookClick = () => {
    const inputEl = document.querySelector('input');
    if (inputEl) {
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputEl.focus();
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-32 md:py-40 flex flex-col items-center justify-center bg-gradient-to-b from-navy-950 via-[#0a0f20] to-navy-950 overflow-hidden border-t border-white/5 select-none"
    >
      {/* Decorative Gold Radial Glow in Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/[0.02] via-transparent to-transparent pointer-events-none" />

      {/* Narrative Headline */}
      <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight tracking-wide text-white uppercase text-center mb-10 max-w-3xl leading-tight">
        Your Private Journey Awaits
      </h2>

      {/* Magnetic Button Area wrapper */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative py-8 px-12 flex items-center justify-center cursor-pointer group"
      >
        <button
          ref={buttonRef}
          onClick={handleBookClick}
          className="px-10 py-4.5 border border-white text-white text-xs sm:text-sm font-light tracking-[0.25em] uppercase hover:bg-white hover:text-navy-950 transition-colors duration-300 rounded-sm cursor-pointer relative z-10 select-none bg-transparent"
        >
          Book Your Flight
        </button>
      </div>

    </section>
  );
}
