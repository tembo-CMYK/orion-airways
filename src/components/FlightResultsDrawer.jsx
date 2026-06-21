import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Plane, Calendar, Sparkles, Info } from 'lucide-react';

const mockFlights = {
  'LUN-JNB': [
    { id: 'f1', number: 'ZA 302', aircraft: 'Citation Latitude', time: '08:30 - 10:45', duration: '2h 15m', price: '$1,250' },
    { id: 'f2', number: 'ZA 306', aircraft: 'Challenger 350', time: '13:15 - 15:30', duration: '2h 15m', price: '$1,680' },
    { id: 'f3', number: 'ZA 310', aircraft: 'Global 6000', time: '18:00 - 20:15', duration: '2h 15m', price: '$2,450' }
  ],
  'JNB-LUN': [
    { id: 'f4', number: 'ZA 301', aircraft: 'Citation Latitude', time: '09:00 - 11:15', duration: '2h 15m', price: '$1,250' },
    { id: 'f5', number: 'ZA 305', aircraft: 'Challenger 350', time: '14:00 - 16:15', duration: '2h 15m', price: '$1,680' }
  ],
  'LUN-LVI': [
    { id: 'f6', number: 'ZA 112', aircraft: 'Phenom 300', time: '09:00 - 10:00', duration: '1h 00m', price: '$850' },
    { id: 'f7', number: 'ZA 116', aircraft: 'Phenom 300', time: '16:30 - 17:30', duration: '1h 00m', price: '$980' }
  ],
  'LVI-LUN': [
    { id: 'f8', number: 'ZA 111', aircraft: 'Phenom 300', time: '10:30 - 11:30', duration: '1h 00m', price: '$850' }
  ],
  'LUN-NLA': [
    { id: 'f9', number: 'ZA 202', aircraft: 'King Air 350i', time: '07:30 - 08:15', duration: '0h 45m', price: '$650' },
    { id: 'f10', number: 'ZA 206', aircraft: 'King Air 350i', time: '15:00 - 15:45', duration: '0h 45m', price: '$720' }
  ],
  'NLA-LUN': [
    { id: 'f11', number: 'ZA 201', aircraft: 'King Air 350i', time: '09:00 - 09:45', duration: '0h 45m', price: '$650' }
  ]
};

export default function FlightResultsDrawer({ isOpen, onClose, searchData }) {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showBaggageTooltip, setShowBaggageTooltip] = useState(false);

  const routeKey = searchData && searchData.from && searchData.to 
    ? `${searchData.from.code}-${searchData.to.code}` 
    : '';

  const flights = mockFlights[routeKey] || [];

  // Reset selected flight and tooltip when drawer is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedFlight(null);
      setShowBaggageTooltip(false);
    }
  }, [isOpen]);

  // Close tooltip when selected flight changes
  useEffect(() => {
    setShowBaggageTooltip(false);
  }, [selectedFlight]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 25 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };

  // Calculations for Fare Breakdown
  const getFareBreakdown = (priceStr) => {
    const numeric = parseInt(priceStr.replace(/[$,]/g, ''), 10);
    const base = numeric * 0.85;
    const taxes = numeric * 0.15;
    return {
      base: '$' + base.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      taxes: '$' + taxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    };
  };

  const fareBreakdown = selectedFlight ? getFareBreakdown(selectedFlight.price) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            className="fixed inset-0 z-[99] bg-black/40"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[500px] md:w-[40%] bg-navy-950/95 border-l border-white/10 backdrop-blur-2xl z-[100] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 flex-shrink-0">
              <div>
                <h2 className="text-lg font-light tracking-[0.15em] text-white uppercase font-sans">
                  {selectedFlight ? 'Booking Summary' : 'Curated Selection'}
                </h2>
                {searchData && searchData.from && searchData.to && (
                  <p className="text-[10px] font-light text-white/50 tracking-[0.1em] mt-1.5 uppercase">
                    {searchData.from.city} ({searchData.from.code}) ➜ {searchData.to.city} ({searchData.to.code})
                  </p>
                )}
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"
                aria-label="Close Drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content Container */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
              
              {searchData && (
                <div className="flex flex-col gap-3 flex-shrink-0">
                  <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3">
                    <div>
                      <p className="text-[9px] font-light uppercase tracking-wider text-white/40">Departure Date</p>
                      <p className="text-xs font-light text-white mt-0.5">
                        {searchData.date?.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="h-6 w-[1px] bg-white/10" />
                    <div className="text-right">
                      <p className="text-[9px] font-light uppercase tracking-wider text-white/40">Travelers</p>
                      <div className="flex items-center justify-end gap-1.5 mt-0.5">
                        <p className="text-xs font-light text-white">
                          {searchData.passengers?.adults + searchData.passengers?.children} traveler(s) ({searchData.passengers?.cabinClass})
                        </p>
                        {selectedFlight && (
                          <button
                            type="button"
                            onClick={() => setShowBaggageTooltip(!showBaggageTooltip)}
                            className="p-0.5 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                            aria-label="Baggage Info"
                          >
                            <Info size={11} className="w-[11px] h-[11px]" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Baggage Info Tooltip Overlay */}
                  <AnimatePresence>
                    {showBaggageTooltip && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -5 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -5 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="bg-white/[0.02] border border-white/5 rounded-lg p-3 text-[10px] font-light text-white/60 leading-relaxed flex flex-col gap-1.5 overflow-hidden"
                      >
                        <div className="flex justify-between items-center text-white/80">
                          <span className="font-normal uppercase tracking-wider text-accent text-[9px]">
                            {searchData.passengers?.cabinClass} Cabin Baggage Allowance
                          </span>
                          <button 
                            type="button" 
                            onClick={() => setShowBaggageTooltip(false)}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </div>
                        {searchData.passengers?.cabinClass === 'First' ? (
                          <p className="mt-0.5">
                            • Carry-on: 2 Cabin bags up to 15kg (33lbs) total.<br />
                            • Checked luggage: 3 Bags up to 32kg (70lbs) each.<br />
                            • Valet retrieval & priority cabin stowing included.
                          </p>
                        ) : searchData.passengers?.cabinClass === 'Business' ? (
                          <p className="mt-0.5">
                            • Carry-on: 2 Cabin bags up to 10kg (22lbs) total.<br />
                            • Checked luggage: 2 Bags up to 32kg (70lbs) each.<br />
                            • Priority bag tagging & lounge check-in.
                          </p>
                        ) : searchData.passengers?.cabinClass === 'Premium' ? (
                          <p className="mt-0.5">
                            • Carry-on: 1 Cabin bag up to 10kg (22lbs).<br />
                            • Checked luggage: 2 Bags up to 23kg (50lbs) each.<br />
                            • Priority boarding & extra legroom comfort.
                          </p>
                        ) : (
                          <p className="mt-0.5">
                            • Carry-on: 1 Cabin bag up to 8kg (18lbs).<br />
                            • Checked luggage: 1 Bag up to 23kg (50lbs).<br />
                            • Additional luggage charter charges apply.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* CROSS-FADE VIEW TRANSITION */}
              <AnimatePresence mode="wait">
                {!selectedFlight ? (
                  /* VIEW 1: FLIGHT RESULTS LIST */
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    {flights.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-4"
                      >
                        {flights.map((flight) => (
                          <motion.div
                            key={flight.id}
                            variants={cardVariants}
                            whileHover={{ x: 8, scale: 1.01 }}
                            onClick={() => setSelectedFlight(flight)}
                            className="bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] rounded-xl p-5 cursor-pointer flex flex-col gap-3 transition-all duration-300 group relative overflow-hidden"
                          >
                            {/* Card Header */}
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-light tracking-[0.2em] text-white/40 uppercase">
                                {flight.number} • {flight.aircraft}
                              </span>
                              <div className="p-1 border border-white/10 rounded bg-white/5 text-accent opacity-40 group-hover:opacity-100 transition-opacity">
                                <Plane size={11} strokeWidth={1.5} className="rotate-45" />
                              </div>
                            </div>

                            {/* Flight Details */}
                            <div className="flex items-end justify-between mt-1">
                              <div>
                                <p className="text-sm font-light text-white tracking-wide">
                                  {flight.time}
                                </p>
                                <p className="text-[10px] font-light text-white/30 tracking-wider mt-0.5 uppercase">
                                  Direct • {flight.duration}
                                </p>
                              </div>
                              
                              {/* Pricing & Selection Interaction */}
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-normal text-accent tracking-wide">
                                  {flight.price}
                                </span>
                                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300 text-accent">
                                  <ArrowRight size={14} />
                                </span>
                              </div>
                            </div>

                            {/* Thin separating bottom line highlight on hover */}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      /* LUXURY EMPTY STATE */
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center justify-center text-center py-16 px-4 gap-6 bg-white/[0.01] border border-white/5 rounded-2xl"
                      >
                        <div className="p-4 border border-white/5 rounded-full bg-white/[0.02]">
                          <Calendar size={28} strokeWidth={1} className="text-white/40" />
                        </div>
                        <div className="flex flex-col gap-2 max-w-sm">
                          <h3 className="text-sm font-light text-white tracking-wider uppercase">Alternative Scheduling</h3>
                          <p className="text-xs font-light leading-relaxed text-white/50">
                            No flights available for these dates. Would you like to view our calendar for alternative dates?
                          </p>
                        </div>
                        <button 
                          type="button" 
                          onClick={onClose}
                          className="px-6 py-2.5 text-[10px] font-light tracking-[0.2em] uppercase border border-accent/40 text-accent hover:bg-accent hover:text-navy-950 transition-all duration-300 rounded-sm"
                        >
                          View Alternates
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  /* VIEW 2: BOOKING SUMMARY VIEW */
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Persistent Context: Flight Selection info */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col gap-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-light tracking-[0.2em] text-accent uppercase">
                          Selected Flight
                        </span>
                        <button
                          onClick={() => setSelectedFlight(null)}
                          className="text-[10px] font-light text-white/40 hover:text-white transition-colors uppercase tracking-[0.1em] hover:underline"
                        >
                          Change
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <p className="text-xs font-light text-white">{selectedFlight.number} • {selectedFlight.aircraft}</p>
                          <p className="text-[10px] font-light text-white/50 mt-0.5">{selectedFlight.time} ({selectedFlight.duration})</p>
                        </div>
                        <span className="text-sm font-light text-white">{selectedFlight.price}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-light text-white/40 uppercase tracking-wider">Fare Class</span>
                          <span className="text-xs font-light text-white">{searchData?.passengers?.cabinClass}</span>
                          <button
                            type="button"
                            onClick={() => setShowBaggageTooltip(!showBaggageTooltip)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white flex items-center justify-center cursor-pointer"
                            aria-label="Baggage Info"
                          >
                            <Info size={11} className="w-[11px] h-[11px] text-accent" />
                          </button>
                        </div>
                        <span className="text-[9px] font-light text-white/40 tracking-wider">CHARTER FARE</span>
                      </div>
                    </div>

                    {/* Inline Baggage Rules Tooltip inside the Booking Summary View */}
                    <AnimatePresence>
                      {showBaggageTooltip && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -5 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -5 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="bg-accent/5 border border-accent/20 rounded-xl p-4 text-[10px] font-light text-white/70 leading-relaxed flex flex-col gap-2 overflow-hidden -mt-4 mb-2"
                        >
                          <div className="flex justify-between items-center text-white/95">
                            <span className="font-normal uppercase tracking-wider text-accent text-[9px]">
                              {searchData?.passengers?.cabinClass} Baggage Allowance
                            </span>
                            <button 
                              type="button" 
                              onClick={() => setShowBaggageTooltip(false)}
                              className="text-white/40 hover:text-white transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </div>
                          {searchData?.passengers?.cabinClass === 'First' ? (
                            <p className="mt-0.5">
                              • Carry-on: 2 Cabin bags up to 15kg (33lbs) total.<br />
                              • Checked luggage: 3 Bags up to 32kg (70lbs) each.<br />
                              • Valet retrieval & priority cabin stowing included.
                            </p>
                          ) : searchData?.passengers?.cabinClass === 'Business' ? (
                            <p className="mt-0.5">
                              • Carry-on: 2 Cabin bags up to 10kg (22lbs) total.<br />
                              • Checked luggage: 2 Bags up to 32kg (70lbs) each.<br />
                              • Priority bag tagging & lounge check-in.
                            </p>
                          ) : searchData?.passengers?.cabinClass === 'Premium' ? (
                            <p className="mt-0.5">
                              • Carry-on: 1 Cabin bag up to 10kg (22lbs).<br />
                              • Checked luggage: 2 Bags up to 23kg (50lbs) each.<br />
                              • Priority boarding & extra legroom comfort.
                            </p>
                          ) : (
                            <p className="mt-0.5">
                              • Carry-on: 1 Cabin bag up to 8kg (18lbs).<br />
                              • Checked luggage: 1 Bag up to 23kg (50lbs).<br />
                              • Additional luggage charter charges apply.
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Flight Overview */}
                    <div className="flex flex-col gap-3 bg-white/[0.01] border border-white/5 rounded-xl p-5">
                      <h3 className="text-[10px] font-light tracking-[0.15em] text-white/40 uppercase">Flight Overview</h3>
                      
                      <div className="flex flex-col gap-4 mt-2">
                        {/* Route Path Graphic */}
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                            <span className="w-1.5 h-1.5 rounded-full border border-accent bg-transparent" />
                            <span className="w-[1px] h-6 bg-white/10 my-1" />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          </div>
                          <div className="flex flex-col gap-3 flex-1">
                            <div>
                              <p className="text-xs font-light text-white leading-none">{searchData?.from?.city} ({searchData?.from?.code})</p>
                              <p className="text-[9px] text-white/40 font-light mt-1">{searchData?.from?.airport}</p>
                            </div>
                            <div>
                              <p className="text-xs font-light text-white leading-none">{searchData?.to?.city} ({searchData?.to?.code})</p>
                              <p className="text-[9px] text-white/40 font-light mt-1">{searchData?.to?.airport}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Concierge Flight Insights */}
                    <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex flex-col gap-1.5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center gap-2 text-accent">
                        <Sparkles size={12} strokeWidth={2} />
                        <span className="text-[9px] font-light tracking-[0.15em] uppercase">Concierge Insights</span>
                      </div>
                      <p className="text-[11px] font-light text-white/70 leading-relaxed mt-1 font-sans">
                        Pro-tip: Tuesday flights on this route are typically 10% cheaper—would you like to see those options instead?
                      </p>
                    </div>

                    {/* Fare Breakdown */}
                    <div className="flex flex-col gap-3 mt-2">
                      <h3 className="text-[10px] font-light tracking-[0.15em] text-white/40 uppercase">Fare Breakdown</h3>
                      <div className="flex flex-col gap-2 mt-1 px-1">
                        <div className="flex items-center justify-between text-xs font-light text-white/60">
                          <span>Base Charter Rate</span>
                          <span>{fareBreakdown?.base}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-light text-white/60">
                          <span>Airport Taxes & Fuel Surcharges</span>
                          <span>{fareBreakdown?.taxes}</span>
                        </div>
                        
                        {/* Whitespace to separate breakdown from total */}
                        <div className="h-[1px] bg-white/10 my-3" />
                        
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-light text-white/80">Total Due</span>
                          <span className="text-lg font-normal text-accent">{selectedFlight.price}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Zone: Confirm & Proceed */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => alert(`Charter Booking confirmed for flight ${selectedFlight.number}!`)}
                      className="w-full h-[48px] px-8 mt-4 text-[12px] font-light tracking-[0.2em] uppercase border border-accent bg-accent/10 hover:bg-accent text-accent hover:text-navy-950 transition-all duration-300 rounded-sm cursor-pointer flex items-center justify-center"
                    >
                      Confirm & Proceed
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-6 border-t border-white/5 bg-navy-950/80 text-center flex-shrink-0">
              <p className="text-[9px] font-light tracking-[0.2em] text-white/30 uppercase">
                Orion Airways Concierge Charter
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
