import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar as CalendarIcon, Users, MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react';

const destinations = [
  { code: 'LUN', city: 'Lusaka', airport: 'Kenneth Kaunda Intl' },
  { code: 'LVI', city: 'Livingstone', airport: 'Harry Mwaanga Nkumbula Intl' },
  { code: 'NLA', city: 'Ndola', airport: 'Simon Mwansa Kapwepwe Intl' },
  { code: 'JNB', city: 'Johannesburg', airport: 'O.R. Tambo Intl' },
  { code: 'LHR', city: 'London', airport: 'Heathrow Airport' },
  { code: 'DXB', city: 'Dubai', airport: 'Dubai Intl' },
  { code: 'CPT', city: 'Cape Town', airport: 'Cape Town Intl' }
];

export default function BookingCapsule({ onSearchSubmit, prefilledTo, clearPrefilledTo }) {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'from' | 'to' | 'date' | 'passengers' | null
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Stacking interaction glow shadow
  const [isInteracted, setIsInteracted] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerRef = useRef(null);
  
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      from: null,
      to: null,
      date: new Date(Date.now() + 86400000), // Default to tomorrow
      passengers: { adults: 1, children: 0, cabinClass: 'Economy' },
      flexibleDates: false,
      promoCode: '',
      bookWithPoints: false
    }
  });

  const fromVal = watch('from');
  const toVal = watch('to');
  const dateVal = watch('date');
  const passengersVal = watch('passengers');

  // Handle prefilled destination
  useEffect(() => {
    if (prefilledTo) {
      const found = destinations.find(d => d.code === prefilledTo);
      if (found) {
        setValue('to', found);
        if (!fromVal) {
          const lsk = destinations.find(d => d.code === 'LUN');
          if (lsk) setValue('from', lsk);
        }
        setIsExpanded(true);
      }
      if (clearPrefilledTo) {
        clearPrefilledTo();
      }
    }
  }, [prefilledTo, setValue, fromVal, clearPrefilledTo]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setIsInteracted(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter destinations based on typing
  const filteredFromDestinations = destinations.filter(d => 
    d.city.toLowerCase().includes(fromSearch.toLowerCase()) || 
    d.code.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToDestinations = destinations.filter(d => 
    d.city.toLowerCase().includes(toSearch.toLowerCase()) || 
    d.code.toLowerCase().includes(toSearch.toLowerCase())
  );

  const onSubmit = (data) => {
    if (!data.from) {
      setValidationError('Please select an origin airport.');
      return;
    }
    if (!data.to) {
      setValidationError('Please select a destination airport.');
      return;
    }
    if (data.from.code === data.to.code) {
      setValidationError('Origin and destination cannot be the same.');
      return;
    }
    setValidationError('');
    if (onSearchSubmit) {
      onSearchSubmit(data);
    }
  };

  // Format date display
  const formatDate = (date) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Calendar Helpers
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDaySelect = (day) => {
    const selectedDate = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), day);
    setValue('date', selectedDate);
    setActiveDropdown(null);
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1));
  };

  const prevMonth = (e) => {
    e.stopPropagation();
    setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1));
  };

  const renderCalendarDays = () => {
    const totalDays = getDaysInMonth(currentCalendarMonth);
    const startOffset = getFirstDayOfMonth(currentCalendarMonth);
    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    // Render empty spaces for offset
    for (let i = 0; i < startOffset; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Render calendar days
    for (let day = 1; day <= totalDays; day++) {
      const thisDate = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), day);
      const isPast = thisDate < today;
      const isSelected = dateVal && 
        dateVal.getDate() === day && 
        dateVal.getMonth() === currentCalendarMonth.getMonth() && 
        dateVal.getFullYear() === currentCalendarMonth.getFullYear();

      days.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={isPast}
          onClick={() => handleDaySelect(day)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-light transition-all duration-200
            ${isSelected ? 'bg-accent text-navy-950 font-semibold' : 'text-white hover:bg-white/10'}
            ${isPast ? 'opacity-20 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          animate={{
            boxShadow: isInteracted
              ? "0 35px 80px -15px rgba(212, 175, 55, 0.15), 0 20px 60px -10px rgba(0, 0, 0, 0.7)"
              : "0 25px 60px -20px rgba(0, 0, 0, 0.5)",
            borderRadius: isMobile ? "20px" : (isExpanded ? "28px" : "9999px")
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full backdrop-blur-xl bg-white/5 border border-white/10 p-4 md:p-2 md:pl-8 flex flex-col items-stretch justify-start transition-all duration-300"
        >
          {/* Row 1: Primary Fields + Search Button */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-0 w-full">
            
            {/* Main Field Zones */}
            <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-0">
              
              {/* Zone 1: From */}
              <div 
                onClick={() => {
                  setActiveDropdown('from');
                  setIsInteracted(true);
                }}
                className="flex-1 flex flex-col px-4 py-2 cursor-pointer group rounded-t-xl md:rounded-none hover:bg-white/5 transition-all duration-300 relative"
              >
                <span className={`text-[12px] md:text-[9px] uppercase font-light tracking-[0.15em] transition-all duration-300 select-none
                  ${activeDropdown === 'from' ? 'text-accent translate-x-0.5' : 'text-white/50 group-hover:text-white/80 group-hover:translate-x-0.5'}
                `}>
                  From
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={12} className="text-white/40 group-hover:text-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="Select Origin"
                    value={activeDropdown === 'from' ? fromSearch : (fromVal ? `${fromVal.city} (${fromVal.code})` : '')}
                    onChange={(e) => setFromSearch(e.target.value)}
                    onFocus={() => {
                      setActiveDropdown('from');
                      setIsInteracted(true);
                    }}
                    className="w-full bg-transparent text-white font-light text-[16px] md:text-sm outline-none border-none placeholder-white/30 focus:ring-0 p-0 cursor-pointer"
                  />
                </div>

                {/* From Dropdown */}
                <AnimatePresence>
                  {activeDropdown === 'from' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-[110%] w-full md:w-[280px] bg-navy-950/95 border border-white/10 backdrop-blur-xl rounded-xl p-3 shadow-2xl z-50 flex flex-col gap-1 max-h-[240px] overflow-y-auto"
                    >
                      {filteredFromDestinations.length > 0 ? (
                        filteredFromDestinations.map((dest) => (
                          <div
                            key={dest.code}
                            onClick={(e) => {
                              e.stopPropagation();
                              setValue('from', dest);
                              setFromSearch('');
                              setActiveDropdown(null);
                            }}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <div>
                              <p className="text-xs font-light text-white">{dest.city}</p>
                              <p className="text-[9px] text-white/40 font-light">{dest.airport}</p>
                            </div>
                            <span className="text-xs font-light text-accent bg-accent/10 px-2 py-0.5 rounded">{dest.code}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-white/40 font-light text-center py-4">No airports found</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Separator 1 */}
              <div className="hidden md:block h-8 w-[1px] bg-white/10 flex-shrink-0" />
              <div className="block md:hidden h-[1px] bg-white/10 w-full" />

              {/* Zone 2: To */}
              <div 
                onClick={() => {
                  setActiveDropdown('to');
                  setIsInteracted(true);
                }}
                className="flex-1 flex flex-col px-4 py-2 cursor-pointer group rounded-none hover:bg-white/5 transition-all duration-300 relative"
              >
                <span className={`text-[12px] md:text-[9px] uppercase font-light tracking-[0.15em] transition-all duration-300 select-none
                  ${activeDropdown === 'to' ? 'text-accent translate-x-0.5' : 'text-white/50 group-hover:text-white/80 group-hover:translate-x-0.5'}
                `}>
                  To
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={12} className="text-white/40 group-hover:text-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="Select Destination"
                    value={activeDropdown === 'to' ? toSearch : (toVal ? `${toVal.city} (${toVal.code})` : '')}
                    onChange={(e) => setToSearch(e.target.value)}
                    onFocus={() => {
                      setActiveDropdown('to');
                      setIsInteracted(true);
                    }}
                    className="w-full bg-transparent text-white font-light text-[16px] md:text-sm outline-none border-none placeholder-white/30 focus:ring-0 p-0 cursor-pointer"
                  />
                </div>

                {/* To Dropdown */}
                <AnimatePresence>
                  {activeDropdown === 'to' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-[110%] w-full md:w-[280px] bg-navy-950/95 border border-white/10 backdrop-blur-xl rounded-xl p-3 shadow-2xl z-50 flex flex-col gap-1 max-h-[240px] overflow-y-auto"
                    >
                      {filteredToDestinations.length > 0 ? (
                        filteredToDestinations.map((dest) => (
                          <div
                            key={dest.code}
                            onClick={(e) => {
                              e.stopPropagation();
                              setValue('to', dest);
                              setToSearch('');
                              setActiveDropdown(null);
                            }}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <div>
                              <p className="text-xs font-light text-white">{dest.city}</p>
                              <p className="text-[9px] text-white/40 font-light">{dest.airport}</p>
                            </div>
                            <span className="text-xs font-light text-accent bg-accent/10 px-2 py-0.5 rounded">{dest.code}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-white/40 font-light text-center py-4">No airports found</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Separator 2 */}
              <div className="hidden md:block h-8 w-[1px] bg-white/10 flex-shrink-0" />
              <div className="block md:hidden h-[1px] bg-white/10 w-full" />

              {/* Zone 3: Date */}
              <div 
                onClick={() => {
                  setActiveDropdown('date');
                  setIsInteracted(true);
                }}
                className="flex-1 flex flex-col px-4 py-2 cursor-pointer group rounded-none hover:bg-white/5 transition-all duration-300 relative"
              >
                <span className={`text-[12px] md:text-[9px] uppercase font-light tracking-[0.15em] transition-all duration-300 select-none
                  ${activeDropdown === 'date' ? 'text-accent translate-x-0.5' : 'text-white/50 group-hover:text-white/80 group-hover:translate-x-0.5'}
                `}>
                  Departure
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon size={12} className="text-white/40 group-hover:text-accent transition-colors" />
                  <span className="text-white font-light text-[16px] md:text-sm select-none">
                    {formatDate(dateVal)}
                  </span>
                </div>

                {/* Custom Calendar Dropdown */}
                <AnimatePresence>
                  {activeDropdown === 'date' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-[110%] w-full md:w-[280px] bg-navy-950/95 border border-white/10 backdrop-blur-xl rounded-xl p-4 shadow-2xl z-50 flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <button 
                          type="button" 
                          onClick={prevMonth}
                          className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-light text-white select-none">
                          {currentCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button 
                          type="button" 
                          onClick={nextMonth}
                          className="p-1 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      
                      {/* Weekday Labels */}
                      <div className="grid grid-cols-7 text-center text-[10px] text-white/40 font-light mb-2">
                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-y-1 justify-items-center">
                        {renderCalendarDays()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Separator 3 */}
              <div className="hidden md:block h-8 w-[1px] bg-white/10 flex-shrink-0" />
              <div className="block md:hidden h-[1px] bg-white/10 w-full" />

              {/* Zone 4: Passengers & Class + More Options Trigger */}
              <div className="flex-1 flex items-center justify-between pr-2 hover:bg-white/5 md:hover:bg-transparent transition-colors duration-300 rounded-b-xl md:rounded-none relative">
                <div 
                  onClick={() => {
                    setActiveDropdown('passengers');
                    setIsInteracted(true);
                  }}
                  className="flex-1 flex flex-col px-4 py-2 cursor-pointer group rounded-b-xl md:rounded-none hover:bg-white/5 md:hover:bg-transparent transition-all duration-300"
                >
                  <span className={`text-[12px] md:text-[9px] uppercase font-light tracking-[0.15em] transition-all duration-300 select-none
                    ${activeDropdown === 'passengers' ? 'text-accent translate-x-0.5' : 'text-white/50 group-hover:text-white/80 group-hover:translate-x-0.5'}
                  `}>
                    Passengers & Class
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Users size={12} className="text-white/40 group-hover:text-accent transition-colors" />
                    <span className="text-white font-light text-[16px] md:text-sm select-none">
                      {passengersVal.adults + passengersVal.children} Traveler{passengersVal.adults + passengersVal.children > 1 ? 's' : ''}, {passengersVal.cabinClass}
                    </span>
                  </div>
                </div>

                {/* More Options Link Trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                    setIsInteracted(true);
                  }}
                  className="text-[12px] md:text-[9px] uppercase font-light tracking-[0.15em] text-white/40 hover:text-accent transition-colors h-[48px] px-6 md:h-auto md:py-2 md:px-3.5 hover:bg-white/10 rounded-full select-none flex-shrink-0 cursor-pointer border border-white/5 hover:border-white/10 mr-2 md:mr-0 flex items-center justify-center"
                >
                  {isExpanded ? 'Less' : 'More'}
                </button>

                {/* Custom Passenger/Class Dropdown */}
                <AnimatePresence>
                  {activeDropdown === 'passengers' && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-[110%] w-full md:w-[300px] bg-navy-950/95 border border-white/10 backdrop-blur-xl rounded-xl p-4 shadow-2xl z-50 flex flex-col gap-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Adults counter */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-light text-white">Adults</p>
                          <p className="text-[9px] text-white/40 font-light">Age 12 or above</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={passengersVal.adults <= 1}
                            onClick={() => setValue('passengers', { ...passengersVal, adults: passengersVal.adults - 1 })}
                            className="w-12 h-12 md:w-6 md:h-6 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-20 transition-all text-[16px] md:text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-[16px] md:text-xs font-light text-white min-w-4 text-center">{passengersVal.adults}</span>
                          <button
                            type="button"
                            onClick={() => setValue('passengers', { ...passengersVal, adults: passengersVal.adults + 1 })}
                            className="w-12 h-12 md:w-6 md:h-6 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all text-[16px] md:text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children counter */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-light text-white">Children</p>
                          <p className="text-[9px] text-white/40 font-light">Age 2 - 11</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            disabled={passengersVal.children <= 0}
                            onClick={() => setValue('passengers', { ...passengersVal, children: passengersVal.children - 1 })}
                            className="w-12 h-12 md:w-6 md:h-6 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-20 transition-all text-[16px] md:text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-[16px] md:text-xs font-light text-white min-w-4 text-center">{passengersVal.children}</span>
                          <button
                            type="button"
                            onClick={() => setValue('passengers', { ...passengersVal, children: passengersVal.children + 1 })}
                            className="w-12 h-12 md:w-6 md:h-6 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all text-[16px] md:text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="h-[1px] bg-white/15 w-full" />

                      {/* Cabin Class Selection */}
                      <div>
                        <p className="text-[10px] text-white/40 font-light uppercase tracking-wider mb-2">Cabin Class</p>
                        <div className="grid grid-cols-2 gap-2">
                          {['Economy', 'Premium', 'Business', 'First'].map((cls) => (
                            <button
                              key={cls}
                              type="button"
                              onClick={() => setValue('passengers', { ...passengersVal, cabinClass: cls })}
                              className={`py-1.5 rounded-lg text-[10px] font-light tracking-wide border transition-all duration-300
                                ${passengersVal.cabinClass === cls 
                                  ? 'bg-accent/15 text-accent border-accent/40' 
                                  : 'bg-transparent text-white/60 border-white/10 hover:text-white hover:border-white/20'
                                }
                              `}
                            >
                              {cls}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Search Action Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full h-[48px] px-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl md:rounded-full bg-accent text-navy-950 flex items-center justify-center gap-2 hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20 flex-shrink-0 md:py-0 self-center md:self-auto font-light text-[12px] md:text-sm uppercase md:normal-case tracking-[0.1em] md:tracking-normal cursor-pointer"
            >
              <span className="md:hidden">Search Flights</span>
              <ArrowRight size={16} strokeWidth={2} className="text-navy-950" />
            </motion.button>
          </div>

          {/* Row 2: Secondary Options Panel */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full overflow-hidden"
              >
                {/* Subtle Divider line */}
                <div className="h-[1px] bg-white/10 my-4 mx-4 md:mx-6" />

                {/* Secondary Row Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8 pb-4 pt-1 items-center">
                  
                  {/* Flexible Dates Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group select-none py-1">
                    <Controller
                      name="flexibleDates"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-0 focus:ring-offset-0 cursor-pointer accent-accent"
                        />
                      )}
                    />
                    <span className="text-xs font-light text-white/60 group-hover:text-white transition-colors tracking-wide">
                      Flexible Dates (±3 days)
                    </span>
                  </label>

                  {/* Promo Code Input */}
                  <div className="flex flex-col gap-1 py-1">
                    <span className="text-[9px] uppercase font-light tracking-[0.15em] text-white/40 select-none">
                      Promo Code
                    </span>
                    <Controller
                      name="promoCode"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="text"
                          placeholder="Enter Code"
                          value={field.value || ''}
                          onChange={field.onChange}
                          className="bg-transparent text-white font-light text-xs outline-none border-b border-white/10 focus:border-accent/40 placeholder-white/20 py-1 uppercase tracking-wider w-full md:max-w-[150px]"
                        />
                      )}
                    />
                  </div>

                  {/* Book with Points Toggle Switch */}
                  <div className="flex items-center justify-between md:justify-end gap-4 py-1">
                    <span className="text-xs font-light text-white/60 tracking-wide select-none">
                      Book with Points
                    </span>
                    <Controller
                      name="bookWithPoints"
                      control={control}
                      render={({ field }) => (
                        <button
                          type="button"
                          onClick={() => field.onChange(!field.value)}
                          className={`w-10 h-5 rounded-full relative p-0.5 transition-colors duration-300 focus:outline-none cursor-pointer
                            ${field.value ? 'bg-accent' : 'bg-white/10'}
                          `}
                        >
                          <motion.div
                            layout
                            className={`w-4 h-4 rounded-full shadow-md transition-all duration-300
                              ${field.value ? 'bg-navy-950' : 'bg-white/70'}
                            `}
                            animate={{
                              x: field.value ? 20 : 0
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </button>
                      )}
                    />
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      {/* Floating Validation Error Pill */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-14 bg-red-500/20 border border-red-500/40 text-red-200 text-[11px] px-4 py-2 rounded-full backdrop-blur-md font-light tracking-wide z-50 flex items-center gap-2"
          >
            <span>{validationError}</span>
            <button 
              type="button" 
              onClick={() => setValidationError('')} 
              className="p-0.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={10} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
