import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import lifestyle image
import cabinImg from '../assets/Orion Flight Attendant.png';

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceManifesto({ onLearnMoreClick }) {
  const sectionRef = useRef(null);
  const textBlockRef = useRef(null);
  const imageRef = useRef(null);

  // GSAP Reveal on Scroll and Ken Burns Zoom
  useGSAP(() => {
    if (!sectionRef.current) return;

    // Fade in text block with a slow Y-axis translation (from 40px to 0px)
    gsap.fromTo(textBlockRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Continuous slow-speed Ken Burns zoom (scale 1.0 to 1.05) when in view
    gsap.fromTo(imageRef.current,
      { scale: 1.0 },
      {
        scale: 1.05,
        duration: 20,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play pause resume pause'
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section 
      id="experience" 
      ref={sectionRef}
      className="relative w-full min-h-screen md:h-screen flex flex-col md:flex-row bg-navy-950 overflow-hidden border-b border-white/5"
    >
      {/* Left Panel: Lifestyle Image Panel with Ken Burns zoom */}
      <div className="w-full md:w-1/2 h-[40vh] md:h-full overflow-hidden relative bg-navy-900">
        <img 
          ref={imageRef}
          src={cabinImg}
          alt="Luxury Private Cabin Interior"
          loading="lazy"
          className="w-full h-full object-cover brightness-[0.55] origin-center"
        />
        {/* Soft edge fade for gradient blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-navy-950/40 pointer-events-none" />
      </div>

      {/* Right Panel: Narrative & Feature Callouts */}
      <div 
        ref={textBlockRef}
        className="w-full md:w-1/2 min-h-[60vh] md:h-full flex flex-col justify-center px-8 sm:px-16 md:px-20 lg:px-24 py-16 md:py-8 bg-navy-950 text-left relative z-10"
      >
        <div className="max-w-md flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <span className="text-accent text-[12px] md:text-[10px] font-light tracking-[0.3em] uppercase">
              Our Commitment
            </span>
            <h2 className="text-[24px] sm:text-4xl md:text-5xl font-extralight tracking-wide leading-[1.2] text-white uppercase font-sans">
              The New Standard of Flight
            </h2>
          </div>

          {/* Narrative Text block */}
          <p className="text-white/60 text-[16px] md:text-sm font-light leading-[1.5] font-sans">
            We believe that chartering a flight should represent an absolute release of concern. To that end, we have curated an operation that places discretion, sustainability, and absolute safety above all else. 
          </p>

          {/* Three Refined Callouts (Floating text layouts with minimal SVG icons) */}
          <div className="flex flex-col gap-5 mt-2">
            
            {/* Callout 1 */}
            <div className="flex items-start gap-4">
              <div className="mt-1 text-accent flex-shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[14px] md:text-xs font-normal text-white uppercase tracking-wider">Unrivaled Safety</h4>
                <p className="text-[12px] md:text-[11px] font-light text-white/45 leading-[1.4]">
                  Exceeding airline safety requirements with bi-annual captain audits and OEM inspections.
                </p>
              </div>
            </div>

            {/* Callout 2 */}
            <div className="flex items-start gap-4">
              <div className="mt-1 text-accent flex-shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[14px] md:text-xs font-normal text-white uppercase tracking-wider">Tailored Comfort</h4>
                <p className="text-[12px] md:text-[11px] font-light text-white/45 leading-[1.4]">
                  Catering designed around your choices, private terminal drop-offs, and custom cabin setups.
                </p>
              </div>
            </div>

            {/* Callout 3 */}
            <div className="flex items-start gap-4">
              <div className="mt-1 text-accent flex-shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-[14px] md:text-xs font-normal text-white uppercase tracking-wider">Sustainable Journeys</h4>
                <p className="text-[12px] md:text-[11px] font-light text-white/45 leading-[1.4]">
                  Minimizing ecological footprint through active flight-path optimizations and offset programs.
                </p>
              </div>
            </div>

          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              if (onLearnMoreClick) {
                onLearnMoreClick();
              }
            }}
            className="mt-6 h-[48px] px-8 text-[12px] font-light tracking-[0.2em] uppercase border border-accent bg-accent/5 hover:bg-accent text-accent hover:text-navy-950 transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center w-full md:w-fit"
          >
            Learn More
          </button>

        </div>
      </div>

    </section>
  );
}
