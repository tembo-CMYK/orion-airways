import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./OrionSections.css";

gsap.registerPlugin(ScrollTrigger);

// Reusable Magnetic Button wrapper component
function MagneticButton({ children, className, onClick }) {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(button, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;
    if (!button) return;
    
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1.1, 0.6)",
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-flex md:inline-flex w-full md:w-auto items-center justify-center cursor-pointer group mt-2 align-self-stretch md:align-self-start"
    >
      <button ref={buttonRef} onClick={onClick} className={className}>
        {children}
      </button>
    </div>
  );
}

export default function ConciergeServices({ onExploreConcierge }) {
  const sectionRef = useRef(null);
  const textBlockRef = useRef(null);
  const imageRef = useRef(null);

  const services = [
    {
      title: "Private Terminal Arrival",
      copy: "Seamless coordination from vehicle arrival to aircraft boarding.",
    },
    {
      title: "Destination Planning",
      copy: "Hotels, villas, dining, transfers, and private experiences arranged with precision.",
    },
    {
      title: "Cabin Personalization",
      copy: "Cuisine, ambience, seating, entertainment, and wellness preferences prepared in advance.",
    },
    {
      title: "Ground Mobility",
      copy: "Chauffeurs, security, luggage handling, and destination transfers managed discreetly.",
    },
  ];

  // GSAP animations for reveals and Ken Burns zoom
  useGSAP(() => {
    if (!sectionRef.current) return;

    // Fade and translate text content
    gsap.fromTo(
      textBlockRef.current,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    // Stagger reveal service items
    gsap.fromTo(
      ".orion-service-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".orion-service-list",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Ken Burns slow zoom effect on image
    gsap.fromTo(
      imageRef.current,
      { scale: 1.0 },
      {
        scale: 1.05,
        duration: 20,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="orion-section orion-concierge" id="concierge" ref={sectionRef}>
      
      {/* Left Column: Image wrapper with inline img tag for Ken Burns zoom */}
      <div className="orion-concierge-image overflow-hidden relative">
        <img
          ref={imageRef}
          src={`${import.meta.env.BASE_URL}images/orion-concierge-lounge.jpg`}
          alt="Orion Concierge Lounge"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.55] origin-center"
        />
        <div className="orion-image-overlay"></div>
      </div>

      {/* Right Column: Text content */}
      <div className="orion-concierge-content" ref={textBlockRef}>
        <p className="orion-kicker">Beyond Flight</p>
        <h2>
          Every Detail, <span>Anticipated</span>
        </h2>
        <p className="orion-lead">
          From the moment your journey is requested, Orion coordinates every
          element of the experience with discretion, elegance, and operational
          precision.
        </p>

        <div className="orion-service-list">
          {services.map((service, index) => (
            <div className="orion-service-item" key={index}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
              </div>
            </div>
          ))}
        </div>

        <MagneticButton 
          className="orion-gold-btn"
          onClick={() => {
            if (onExploreConcierge) {
              onExploreConcierge();
            }
          }}
        >
          Explore Concierge
        </MagneticButton>
      </div>
    </section>
  );
}
