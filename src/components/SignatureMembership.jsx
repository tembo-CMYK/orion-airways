import React, { useRef } from "react";
import { motion } from "framer-motion";
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
      className="inline-flex md:inline-flex w-full md:w-auto items-center justify-center cursor-pointer group mt-2"
    >
      <button ref={buttonRef} onClick={onClick} className={className}>
        {children}
      </button>
    </div>
  );
}

export default function SignatureMembership({ onRequestAccess }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  const tiers = [
    {
      name: "Founder Circle",
      label: "By Invitation",
      description:
        "For individuals who require absolute priority, discretion, and tailored global mobility.",
      features: [
        "Dedicated aviation concierge",
        "Priority aircraft access",
        "Private terminal coordination",
        "Lifestyle travel planning",
      ],
    },
    {
      name: "Executive Circle",
      label: "Business Mobility",
      description:
        "Designed for leaders, founders, and executives who move between cities with precision.",
      features: [
        "Multi-city itinerary planning",
        "Corporate travel support",
        "Cabin business setup",
        "Flexible route management",
      ],
    },
    {
      name: "Legacy Circle",
      label: "Family Travel",
      description:
        "A refined membership for families seeking safe, seamless, and personalized journeys.",
      features: [
        "Family profile preferences",
        "Private holiday planning",
        "Child-friendly cabin setup",
        "Door-to-door coordination",
      ],
    },
  ];

  // GSAP ScrollTrigger reveals
  useGSAP(() => {
    if (!sectionRef.current) return;

    // Header reveal
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    // Cards staggered reveal
    gsap.fromTo(
      ".orion-tier-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 1.0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".orion-tier-grid",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section className="orion-section orion-membership" id="membership" ref={sectionRef}>
      <div className="orion-container">
        
        {/* Section Header with reveal ref */}
        <div className="orion-section-header" ref={headerRef}>
          <p className="orion-kicker">Signature Membership</p>
          <h2>
            Access Beyond <span>Ownership</span>
          </h2>
          <p>
            Orion membership is crafted for travelers who value privacy,
            certainty, and a standard of service that begins long before takeoff.
          </p>
        </div>

        {/* Tier Cards Grid with motion wrapper and hover events */}
        <div className="orion-tier-grid">
          {tiers.map((tier, index) => (
            <motion.article 
              className="orion-tier-card" 
              key={index}
              whileHover={{ 
                y: -8, 
                borderColor: "rgba(214, 173, 50, 0.5)",
                boxShadow: "0 12px 30px -10px rgba(214, 173, 50, 0.15)",
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div>
                <p className="orion-tier-label">{tier.label}</p>
                <h3>{tier.name}</h3>
                <p className="orion-tier-description">{tier.description}</p>
              </div>

              <ul>
                {tier.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>

              <MagneticButton 
                className="orion-outline-btn"
                onClick={() => {
                  if (onRequestAccess) {
                    onRequestAccess(tier.name);
                  }
                }}
              >
                Request Access
              </MagneticButton>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
