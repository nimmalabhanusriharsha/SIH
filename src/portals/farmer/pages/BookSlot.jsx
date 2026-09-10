import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { generateNextToken } from '../../../utils/tokenGenerator';
import { 
  CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalIcon, 
  MapPin, PackageCheck, Clock, Sparkles, QrCode, ArrowRight,
  ShieldCheck, AlertCircle, Activity, CalendarX, AlertTriangle, HelpCircle,
  Search, X, Check
} from 'lucide-react';
import CropIcon from '../components/CropIcon';
import { 
  CROPS_CATALOGUE, 
  CROP_CATEGORIES, 
  filterCrops, 
  getCropById 
} from '../data/crops';
import {
  MAX_SLOT_CAPACITY,
  MAX_ALLOWED_MISSED_SLOTS,
  parseLocalDate,
  formatLocalDate,
  isHoliday,
  getHolidayInfo,
  getSlotStartDateTime,
  hasSlotStarted,
  getSlotBookingCount,
  hasExistingBookingForSlot,
  getMissedSlotCount,
  isFarmerBookingBlocked,
  getBookingBlockInfo,
  isSlotBookable,
  getSlotStatus
} from '../utils/slotBookingRules';

const BookSlot = () => {
  const { state, setState, currentUser } = useAppContext();
  const { t, currentLang } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const preselectedCentreId = location.state?.preSelectedCentreId || 'C001';

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Crop search and category filter state
  const [cropSearchTerm, setCropSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Default date to today's local date (or initial 2026-09-10)
  const initialDate = useMemo(() => {
    const todayStr = formatLocalDate(new Date());
    return todayStr || '2026-09-10';
  }, []);

  const [bookingData, setBookingData] = useState({
    cropId: 'paddy',
    crop: 'Paddy (Rice)',
    quantity: '520',
    centreId: preselectedCentreId,
    date: initialDate,
    slot: '10:00–11:00 AM'
  });

  // Handle crop selection
  const handleSelectCrop = (cropItem) => {
    setBookingData((prev) => ({
      ...prev,
      cropId: cropItem.id,
      crop: cropItem.name
    }));
  };

  // Filtered crops based on search term, category, and language
  const filteredCrops = useMemo(() => {
    return filterCrops({
      crops: CROPS_CATALOGUE,
      searchTerm: cropSearchTerm,
      selectedCategory,
      currentLang
    });
  }, [cropSearchTerm, selectedCategory, currentLang]);

  // Popular core 4 crops for quick selection
  const popularCrops = useMemo(() => {
    return CROPS_CATALOGUE.filter((c) => c.isPopular);
  }, []);

  // Category translation helper
  const categoryTranslationKey = (cat) => {
    const keyMap = {
      All: 'crops.all',
      Cereals: 'crops.cereals',
      Pulses: 'crops.pulses',
      Oilseeds: 'crops.oilseeds',
      Commercial: 'crops.commercial',
      Spices: 'crops.spices',
      Vegetables: 'crops.vegetables',
      Fruits: 'crops.fruits'
    };
    return keyMap[cat] || `crops.${cat.toLowerCase()}`;
  };

  const centres = state.centres || [];
  const selectedCentre = centres.find(c => c.id === bookingData.centreId) || centres[0] || {
    id: 'C001',
    name: 'Lakshmi Procurement Centre',
    district: 'West Godavari',
    distance: 4.2
  };

  const timeSlots = [
    { slot: '8:00–9:00 AM', crowd: t('booking.crowdLow', 'Low crowd'), crowdLevel: 'low', wait: '15 min' },
    { slot: '9:00–10:00 AM', crowd: t('booking.crowdModerate', 'Moderate crowd'), crowdLevel: 'moderate', wait: '25 min' },
    { slot: '10:00–11:00 AM', crowd: t('booking.crowdLow', 'Low crowd'), crowdLevel: 'low', wait: '20 min', isAiRecommended: true },
    { slot: '11:00 AM–12:00 PM', crowd: t('booking.crowdHigh', 'High crowd'), crowdLevel: 'high', wait: '50 min' },
    { slot: '2:00–3:00 PM', crowd: t('booking.crowdModerate', 'Moderate crowd'), crowdLevel: 'moderate', wait: '30 min' },
    { slot: '3:00–4:00 PM', crowd: t('booking.crowdLow', 'Low crowd'), crowdLevel: 'low', wait: '20 min' },
  ];

  // Check farmer missed-slot block status
  const blockInfo = useMemo(() => {
    return getBookingBlockInfo({
      farmerId: currentUser?.id,
      bookings: state.bookings || []
    });
  }, [currentUser?.id, state.bookings]);

  // Check holiday info for selected date
  const holidayInfo = useMemo(() => {
    return getHolidayInfo(bookingData.date);
  }, [bookingData.date]);

  // Selected date object & day name
  const selectedDateObj = useMemo(() => {
    return parseLocalDate(bookingData.date);
  }, [bookingData.date]);

  const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const selectedDayName = dayOfWeekNames[selectedDateObj.getDay()];

  // Real-time slot status calculation for current centre + date
  const slotStatuses = useMemo(() => {
    const now = new Date();
    const map = {};
    timeSlots.forEach((slotItem) => {
      map[slotItem.slot] = getSlotStatus({
        date: bookingData.date,
        slot: slotItem.slot,
        centreId: selectedCentre.id,
        bookings: state.bookings || [],
        now,
        farmerId: currentUser?.id
      });
    });
    return map;
  }, [bookingData.date, selectedCentre.id, state.bookings, currentUser?.id]);

  // Available slots count for selected date
  const availableSlotsCount = useMemo(() => {
    return timeSlots.filter((slotItem) => slotStatuses[slotItem.slot]?.isSelectable).length;
  }, [timeSlots, slotStatuses]);

  // Selected slot bookability
  const isCurrentSlotSelectable = useMemo(() => {
    const statusObj = slotStatuses[bookingData.slot];
    return statusObj?.isSelectable || false;
  }, [slotStatuses, bookingData.slot]);

  const handleConfirmBooking = () => {
    setBookingError('');

    // 1. Authenticated farmer verification
    if (!currentUser?.id) {
      setBookingError('Please log in as a registered farmer to book a slot.');
      return;
    }

    // 2. Check missed-slot blocking rule
    if (isFarmerBookingBlocked({ farmerId: currentUser.id, bookings: state.bookings || [] })) {
      setBookingError(
        t('booking.bookingBlockedReason', 'You have missed more than 5 procurement slots. Please contact the procurement centre for assistance.')
      );
      return;
    }

    // 3. Check holiday rule
    const holidayCheck = getHolidayInfo(bookingData.date);
    if (holidayCheck.isHoliday) {
      setBookingError(
        holidayCheck.messageKey
          ? t(holidayCheck.messageKey, holidayCheck.message)
          : holidayCheck.message
      );
      return;
    }

    // 4. Check slot start time rule
    if (hasSlotStarted(bookingData.date, bookingData.slot, new Date())) {
      setBookingError(
        t('booking.slotClosedStarted', 'Booking for this slot has closed because the slot has already started.')
      );
      return;
    }

    // 5. Immediate re-check of slot capacity (RACE CONDITION PROTECTION)
    const currentBookingsForSlot = getSlotBookingCount({
      centreId: selectedCentre.id,
      date: bookingData.date,
      slot: bookingData.slot,
      bookings: state.bookings || []
    });

    if (currentBookingsForSlot >= MAX_SLOT_CAPACITY) {
      setBookingError(
        t('booking.slotJustBecameFull', 'Sorry, this slot has just become full. Please choose another available slot.')
      );
      return;
    }

    // 6. Check duplicate booking protection
    if (hasExistingBookingForSlot({
      farmerId: currentUser.id,
      centreId: selectedCentre.id,
      date: bookingData.date,
      slot: bookingData.slot,
      bookings: state.bookings || []
    })) {
      setBookingError(
        t('booking.alreadyBookedSlot', 'You already have a booking for this slot.')
      );
      return;
    }

    // 7. ALL CHECKS PASSED: Generate Token, Booking, and Queue Entry
    const newToken = generateNextToken(state);
    const newBookingId = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: newBookingId,
      farmerId: currentUser.farmerId || currentUser.id || 'FARM-9021',
      farmerName: currentUser.name || 'Ramesh Kumar',
      phone: currentUser.mobile || currentUser.phone || '+91 98765 43210',
      centreId: selectedCentre.id,
      centreName: selectedCentre.name,
      date: bookingData.date,
      slot: bookingData.slot,
      cropId: bookingData.cropId || 'paddy',
      crop: bookingData.crop,
      expectedQuantity: parseInt(bookingData.quantity, 10) || 520,
      token: newToken,
      status: 'Confirmed',
      stage: 'booking_confirmed',
      createdAt: new Date().toISOString()
    };

    const queueForCentre = (state.queue || []).filter(q => q.centreId === selectedCentre.id);
    const queuePos = queueForCentre.length + 1;

    const newQueueEntry = {
      token: newToken,
      farmerId: currentUser.id,
      centreId: selectedCentre.id,
      status: 'Waiting',
      position: queuePos,
      waitTime: queuePos * 6
    };

    const newNotification = {
      id: `N-${Date.now()}`,
      userId: currentUser.id,
      type: 'booking',
      title: t('booking.bookingSuccess', 'Booking Confirmed Successfully!'),
      message: `Token ${newToken} issued for ${bookingData.crop} at ${selectedCentre.name} on ${bookingData.date} (${bookingData.slot}).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setState(prev => ({
      ...prev,
      bookings: [newBooking, ...(prev.bookings || [])],
      queue: [...(prev.queue || []), newQueueEntry],
      notifications: [newNotification, ...(prev.notifications || [])]
    }));

    setConfirmedBookingData(newBooking);
    setBookingConfirmed(true);
  };

  // 1. CONFIRMATION SCREEN
  if (bookingConfirmed && confirmedBookingData) {
    const qtyKg = confirmedBookingData.expectedQuantity || 520;
    const qtyQuintals = (qtyKg / 100).toFixed(1);

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-8 font-sans">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card text-center">
          
          <div className="w-16 h-16 bg-farmer-success-light text-farmer-success rounded-full flex items-center justify-center mx-auto mb-4 border border-farmer-success/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-farmer-success uppercase tracking-wider bg-farmer-success-light px-3 py-1 rounded-full border border-farmer-success/30">
            {t('booking.bookingSuccess', 'Booking Confirmed Successfully!')}
          </span>

          <h1 className="text-2xl font-black text-farmer-text mt-3 mb-1">
            {selectedCentre.name}
          </h1>
          <p className="text-xs text-farmer-secondary mb-6 font-medium">
            {t('token.safeDataNote', 'Safe & Encrypted QR. Never exposes personal Aadhaar or private banking data.')}
          </p>

          {/* Token Highlight Box */}
          <div className="bg-farmer-bg p-5 rounded-2xl border border-farmer-border mb-6">
            <p className="text-[11px] font-bold text-farmer-secondary uppercase tracking-wider mb-1">
              {t('token.yourToken', 'YOUR TOKEN')}
            </p>
            <p className="text-4xl md:text-5xl font-black text-farmer-primary mb-2">
              {confirmedBookingData.token}
            </p>
            <span className="text-xs font-mono text-farmer-secondary">
              ID: {confirmedBookingData.id}
            </span>
          </div>

          {/* Details Summary Table */}
          <div className="space-y-2.5 text-xs md:text-sm text-left border-t border-farmer-border pt-4 mb-6">
            <div className="flex justify-between py-1 border-b border-farmer-border/50">
              <span className="text-farmer-secondary font-medium">{t('crop', 'Crop')}:</span>
              <span className="font-bold text-farmer-text">{confirmedBookingData.crop}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-farmer-border/50">
              <span className="text-farmer-secondary font-medium">{t('quantity', 'Quantity')}:</span>
              <span className="font-bold text-farmer-text">
                {t('booking.quantityNote', { kg: qtyKg, quintals: qtyQuintals })}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-farmer-border/50">
              <span className="text-farmer-secondary font-medium">{t('centre', 'Centre')}:</span>
              <span className="font-bold text-farmer-text">{selectedCentre.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-farmer-border/50">
              <span className="text-farmer-secondary font-medium">{t('date', 'Date')}:</span>
              <span className="font-bold text-farmer-text">{confirmedBookingData.date}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-farmer-secondary font-medium">{t('slot', 'Slot')}:</span>
              <span className="font-bold text-farmer-primary bg-farmer-primary-light px-2.5 py-0.5 rounded-lg border border-farmer-primary/20">
                {confirmedBookingData.slot}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/farmer/token')}
              className="w-full min-h-[50px] bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-sm transition-colors"
            >
              <QrCode className="w-4 h-4 text-farmer-accent" />
              <span>{t('booking.viewTokenBtn', 'View Digital Token')}</span>
            </button>
            <button 
              onClick={() => navigate('/farmer/live-queue')}
              className="w-full min-h-[50px] bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text font-bold rounded-2xl border border-farmer-border flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <Activity className="w-4 h-4 text-farmer-primary" />
              <span>{t('booking.viewQueueBtn', 'View Live Queue')}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. BOOKING WIZARD STEPS
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-farmer-text">
          {t('booking.title', 'Smart Slot Booking')}
        </h1>
        <p className="text-xs md:text-sm text-farmer-secondary mt-1">
          {t('dashboard.noActiveBookingDesc', 'Book your procurement slot in advance to avoid waiting times.')}
        </p>
      </div>

      {/* Missed Slot Blocking Banner */}
      {blockInfo.blocked && (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5 md:p-6 text-farmer-text shadow-sm flex flex-col sm:flex-row items-start gap-4 animate-in fade-in">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-red-100 text-red-700 px-3 py-0.5 rounded-full border border-red-200">
                {t('booking.bookingBlocked', 'Booking Temporarily Blocked')}
              </span>
              <span className="text-xs font-bold text-red-600">
                {t('booking.missedSlotCount', { count: blockInfo.missedCount })}
              </span>
            </div>
            <p className="text-sm font-semibold text-farmer-text">
              {t('booking.bookingBlockedReason', 'You have missed more than 5 procurement slots. Please contact the procurement centre for assistance.')}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/farmer/feedback')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{t('booking.contactCentre', 'Contact Centre / Helpdesk')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Steps Indicator */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-farmer-border shadow-farmer-card text-xs font-bold">
        {[
          { step: 1, label: t('booking.step1', 'Crop & Quantity') },
          { step: 2, label: t('booking.step2', 'Centre & Date') },
          { step: 3, label: t('booking.step3', 'Time Slot') },
        ].map((s) => (
          <button
            key={s.step}
            type="button"
            disabled={blockInfo.blocked}
            onClick={() => s.step < currentStep && setCurrentStep(s.step)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
              currentStep === s.step 
                ? 'bg-farmer-primary text-white shadow-sm font-black' 
                : currentStep > s.step 
                  ? 'text-farmer-primary bg-farmer-primary-light font-bold' 
                  : 'text-farmer-secondary opacity-60'
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border border-current">
              {s.step}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: CROP & QUANTITY */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card space-y-6 animate-in fade-in">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
              <div>
                <label className="block text-xs font-bold text-farmer-text uppercase tracking-wider">
                  {t('crops.selectCropTitle', 'Select Crop Type')}
                </label>
                <p className="text-[11px] text-farmer-secondary mt-0.5">
                  {t('crops.browseCatalogue', 'Search and select from the official procurement catalogue (39 crops).')}
                </p>
              </div>
              <span className="text-xs font-bold text-farmer-primary bg-farmer-primary-light px-2.5 py-1 rounded-full border border-farmer-primary/20 w-fit">
                {filteredCrops.length} {t('crops.available', 'Available')}
              </span>
            </div>

            {/* Search Input Bar */}
            <div className="relative mb-3">
              <Search className="w-5 h-5 text-farmer-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="crop-search-input"
                type="text"
                value={cropSearchTerm}
                onChange={(e) => setCropSearchTerm(e.target.value)}
                placeholder={t('crops.searchPlaceholder', 'Search crop by name, Telugu or Hindi (e.g., Rice, Cotton, వరి, धान)...')}
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-farmer-border bg-farmer-bg text-sm font-semibold text-farmer-text placeholder:text-farmer-secondary/70 focus:outline-none focus:ring-2 focus:ring-farmer-primary transition-all"
              />
              {cropSearchTerm && (
                <button
                  id="crop-clear-search-btn"
                  type="button"
                  onClick={() => setCropSearchTerm('')}
                  aria-label="Clear search text"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-farmer-secondary hover:text-farmer-text rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1 mb-4">
              {CROP_CATEGORIES.map((category) => {
                const isCatActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    id={`category-chip-${category.toLowerCase()}`}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                      isCatActive
                        ? 'bg-farmer-primary text-white shadow-sm'
                        : 'bg-farmer-bg text-farmer-secondary hover:text-farmer-text hover:bg-gray-200/70 border border-farmer-border'
                    }`}
                  >
                    {t(categoryTranslationKey(category), category)}
                  </button>
                );
              })}
            </div>

            {/* Popular Crops Quick-Select (visible when All category and no search term) */}
            {selectedCategory === 'All' && !cropSearchTerm && (
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/60 mb-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {t('crops.popularCrops', 'Most Frequently Procured')}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">Govt. MSP Guaranteed</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {popularCrops.map((c) => {
                    const isSelected = bookingData.cropId === c.id || bookingData.crop === c.name;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCrop(c)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'border-farmer-primary bg-white ring-2 ring-farmer-primary shadow-sm'
                            : 'border-emerald-200/80 bg-white/90 hover:bg-white hover:border-farmer-primary/50'
                        }`}
                      >
                        <CropIcon iconType={c.iconType} alt={`${c.name} crop`} className="w-8 h-8 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-farmer-text truncate">{c.name}</div>
                          <div className="text-[10px] text-emerald-800 font-bold">{c.msp}</div>
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-farmer-primary text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty Search Result State */}
            {filteredCrops.length === 0 ? (
              <div className="py-10 px-4 text-center rounded-2xl border-2 border-dashed border-farmer-border bg-farmer-bg/50 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-farmer-primary-light flex items-center justify-center text-farmer-primary">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-farmer-text">
                    {t('crops.noCropsFound', 'No crops found')}
                  </h3>
                  <p className="text-xs text-farmer-secondary mt-1">
                    {t('crops.tryAnotherName', 'Try another crop name or clear your filters.')}
                  </p>
                </div>
                <button
                  id="empty-clear-search-btn"
                  type="button"
                  onClick={() => {
                    setCropSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 bg-farmer-primary hover:bg-farmer-primary-dark text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t('crops.clearSearch', 'Clear Search')}</span>
                </button>
              </div>
            ) : (
              /* Responsive Crop Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto p-1">
                {filteredCrops.map((c) => {
                  const isSelected = bookingData.cropId === c.id || bookingData.crop === c.name;
                  
                  // Multilingual display labels
                  let primaryName = c.name;
                  let secondaryName = c.teluguName || c.hindiName || '';
                  if (currentLang === 'te' && c.teluguName) {
                    primaryName = c.teluguName;
                    secondaryName = c.name;
                  } else if (currentLang === 'hi' && c.hindiName) {
                    primaryName = c.hindiName;
                    secondaryName = c.name;
                  }

                  return (
                    <button
                      key={c.id}
                      id={`crop-card-${c.id}`}
                      type="button"
                      role="button"
                      aria-pressed={isSelected}
                      aria-label={`Select ${c.name} crop`}
                      onClick={() => handleSelectCrop(c)}
                      className={`relative p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[140px] ${
                        isSelected
                          ? 'border-farmer-primary bg-emerald-50/80 ring-2 ring-farmer-primary shadow-sm'
                          : 'border-farmer-border hover:border-farmer-primary/50 bg-farmer-bg/40 hover:bg-white'
                      }`}
                    >
                      {/* Checkmark badge if selected */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-farmer-primary text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      {/* Local SVG Crop Illustration */}
                      <div className="my-1">
                        <CropIcon iconType={c.iconType} alt={`${c.name} crop`} className="w-12 h-12" />
                      </div>

                      {/* Crop Names */}
                      <div className="space-y-0.5 w-full px-1">
                        <span className="font-bold text-farmer-text text-sm block truncate">
                          {primaryName}
                        </span>
                        {secondaryName && (
                          <span className="text-[11px] text-farmer-secondary block truncate font-medium">
                            {secondaryName}
                          </span>
                        )}
                      </div>

                      {/* Category & Verified MSP Badge */}
                      <div className="mt-2 w-full flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-farmer-secondary bg-white px-2 py-0.5 rounded-md border border-farmer-border">
                          {t(categoryTranslationKey(c.category), c.category)}
                        </span>
                        {c.msp && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300">
                            MSP: {c.msp}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-farmer-text uppercase tracking-wider mb-2">
              {t('booking.quantity', 'Expected Quantity')} ({t('booking.quantityUnit', 'Kilograms')})
            </label>
            <div className="relative">
              <input
                type="number"
                min="100"
                max="5000"
                step="10"
                value={bookingData.quantity}
                onChange={(e) => setBookingData({ ...bookingData, quantity: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl border border-farmer-border bg-farmer-bg text-base font-bold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                placeholder="520"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-farmer-secondary">
                kg
              </span>
            </div>
            <p className="text-xs text-farmer-secondary mt-2 font-medium">
              {t('booking.quantityNote', { 
                kg: bookingData.quantity || 520, 
                quintals: ((parseInt(bookingData.quantity, 10) || 520) / 100).toFixed(1) 
              })}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={blockInfo.blocked}
              onClick={() => {
                if (!blockInfo.blocked) setCurrentStep(2);
              }}
              className="min-h-[50px] px-8 py-3 bg-farmer-primary hover:bg-farmer-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl flex items-center gap-2 text-sm transition-colors shadow-sm"
            >
              <span>{t('next', 'Next')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CENTRE & DATE */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card space-y-6 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-farmer-text uppercase tracking-wider mb-3">
              {t('booking.centre', 'Choose Procurement Centre')}
            </label>
            <div className="space-y-3">
              {centres.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setBookingData({ ...bookingData, centreId: c.id })}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    bookingData.centreId === c.id
                      ? 'border-farmer-primary bg-farmer-primary-light ring-2 ring-farmer-primary/30'
                      : 'border-farmer-border hover:border-farmer-secondary bg-farmer-bg'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-farmer-text text-sm block">{c.name}</span>
                      <span className="text-xs text-farmer-secondary mt-0.5 block font-medium">
                        {c.district} · {t('centre.distance', { distance: c.distance || 4.2 })}
                      </span>
                      {Array.isArray(c.crops) && c.crops.length > 0 && (
                        <div className="text-[11px] text-farmer-secondary mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="font-medium text-farmer-secondary">Accepted:</span>
                          <span className="font-bold text-farmer-text">{c.crops.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-farmer-primary bg-white px-2.5 py-0.5 rounded-lg border border-farmer-border">
                      {c.activeCounters || 2} Counters
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-farmer-text uppercase tracking-wider">
                {t('booking.date', 'Procurement Date')}
              </label>
              {/* Working day status indicator */}
              {!holidayInfo.isHoliday ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-farmer-success bg-farmer-success-light px-2.5 py-0.5 rounded-full border border-farmer-success/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{selectedDayName} · Working Day</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-farmer-error bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{selectedDayName} · Holiday</span>
                </span>
              )}
            </div>

            <input
              type="date"
              value={bookingData.date}
              min={formatLocalDate(new Date())}
              max="2026-12-31"
              onChange={(e) => {
                setBookingError('');
                setBookingData({ ...bookingData, date: e.target.value });
              }}
              className="w-full px-4 py-3.5 rounded-2xl border border-farmer-border bg-farmer-bg text-sm font-bold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
            />

            {/* Holiday Warning Notice */}
            {holidayInfo.isHoliday && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-farmer-error shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-farmer-error">
                    {holidayInfo.holidayType === 'sunday'
                      ? t('booking.sundayHoliday', 'Sunday is a holiday. Booking is unavailable.')
                      : t('booking.secondSaturdayHoliday', 'Second Saturday is a holiday. Booking is unavailable.')}
                  </p>
                  <p className="text-xs text-farmer-secondary font-medium">
                    {t('booking.holidayUnavailable', 'Booking is unavailable because this is a holiday.')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="min-h-[50px] px-6 py-3 bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text font-bold rounded-2xl border border-farmer-border flex items-center gap-2 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('back', 'Back')}</span>
            </button>
            <button
              type="button"
              disabled={holidayInfo.isHoliday || blockInfo.blocked}
              onClick={() => {
                if (!holidayInfo.isHoliday && !blockInfo.blocked) {
                  setCurrentStep(3);
                }
              }}
              className="min-h-[50px] px-8 py-3 bg-farmer-primary hover:bg-farmer-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl flex items-center gap-2 text-sm transition-colors shadow-sm"
            >
              <span>{t('next', 'Next')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TIME SLOTS & CAPACITY */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card space-y-6 animate-in fade-in">
          
          {/* AI Slot Recommendation Notice */}
          <div className="bg-farmer-accent-light/80 border border-farmer-accent/40 p-4 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-farmer-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-farmer-text">
                {t('booking.aiRecommendedSlot', 'AI Recommended Slot')}: 10:00–11:00 AM
              </p>
              <p className="text-xs text-farmer-secondary mt-0.5 font-medium">
                {t('booking.aiSlotReason', 'Optimal crowd levels and faster verification window.')}
              </p>
            </div>
          </div>

          {/* Holiday Zero State in Step 3 */}
          {holidayInfo.isHoliday ? (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <CalendarX className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-farmer-error">
                {holidayInfo.holidayType === 'sunday'
                  ? t('booking.sundayHoliday', 'Sunday is a holiday. Booking is unavailable.')
                  : t('booking.secondSaturdayHoliday', 'Second Saturday is a holiday. Booking is unavailable.')}
              </h3>
              <p className="text-xs text-farmer-secondary font-medium max-w-md mx-auto">
                {t('booking.holidayUnavailable', 'Booking is unavailable because this is a holiday.')}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="min-h-[46px] px-6 py-2.5 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl text-xs transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <CalIcon className="w-4 h-4" />
                  <span>{t('booking.chooseAnotherDate', 'Choose Another Date')}</span>
                </button>
              </div>
            </div>
          ) : availableSlotsCount === 0 ? (
            /* Zero State: All slots unavailable/started/full */
            <div className="bg-farmer-bg border border-farmer-border rounded-3xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-farmer-primary-light text-farmer-primary flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-farmer-text">
                {t('booking.noSlotsAvailable', 'No booking slots are currently available for this date.')}
              </h3>
              <p className="text-xs text-farmer-secondary font-medium max-w-md mx-auto">
                All procurement slots for {bookingData.date} are either full (5/5) or have already passed. Please select another date.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="min-h-[46px] px-6 py-2.5 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl text-xs transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <CalIcon className="w-4 h-4" />
                  <span>{t('booking.chooseAnotherDate', 'Choose Another Date')}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Slots Grid with Strict Capacity & Status Badges */
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-bold text-farmer-text uppercase tracking-wider">
                  {t('booking.availableSlots', 'Available Time Slots')}
                </label>
                <span className="text-xs font-semibold text-farmer-secondary">
                  Max {MAX_SLOT_CAPACITY} farmers per slot
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {timeSlots.map((slotItem) => {
                  const statusInfo = slotStatuses[slotItem.slot] || {
                    status: 'available',
                    currentCount: 0,
                    isSelectable: true
                  };

                  const isSelected = bookingData.slot === slotItem.slot;
                  const isSelectable = statusInfo.isSelectable;

                  return (
                    <button
                      key={slotItem.slot}
                      type="button"
                      disabled={!isSelectable}
                      onClick={() => {
                        if (isSelectable) {
                          setBookingError('');
                          setBookingData({ ...bookingData, slot: slotItem.slot });
                        }
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all relative ${
                        !isSelectable
                          ? 'bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed'
                          : isSelected
                            ? 'border-farmer-primary bg-farmer-primary-light ring-2 ring-farmer-primary/30'
                            : 'border-farmer-border hover:border-farmer-secondary bg-farmer-bg'
                      }`}
                    >
                      {slotItem.isAiRecommended && isSelectable && (
                        <span className="absolute -top-2.5 right-3 bg-farmer-accent text-farmer-text text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                          AI Best
                        </span>
                      )}

                      <div className="flex justify-between items-start">
                        <span className="font-bold text-farmer-text text-sm block">
                          {slotItem.slot}
                        </span>

                        {/* Status Badge */}
                        {statusInfo.status === 'full' && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                            {t('booking.full', 'Full')}
                          </span>
                        )}
                        {statusInfo.status === 'started' && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 border border-gray-300">
                            {t('booking.slotStarted', 'Slot started')}
                          </span>
                        )}
                        {statusInfo.status === 'already_booked' && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            Booked
                          </span>
                        )}
                        {statusInfo.status === 'almost_full' && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            {t('booking.almostFull', 'Almost Full')}
                          </span>
                        )}
                        {statusInfo.status === 'available' && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                            {t('booking.available', 'Available')}
                          </span>
                        )}
                      </div>

                      {/* Capacity Counter & Crowd Level */}
                      <div className="flex items-center justify-between text-xs text-farmer-secondary mt-2 font-medium">
                        <span className="font-bold">
                          {statusInfo.status === 'started' ? (
                            <span className="text-gray-500 font-semibold">{t('booking.bookingClosed', 'Booking closed')}</span>
                          ) : statusInfo.status === 'already_booked' ? (
                            <span className="text-blue-600 font-semibold">{t('booking.alreadyBookedSlot', 'Already booked')}</span>
                          ) : (
                            <span className={statusInfo.currentCount >= 5 ? 'text-red-600' : statusInfo.currentCount === 4 ? 'text-amber-600' : 'text-farmer-secondary'}>
                              {t('booking.capacityCounter', { count: statusInfo.currentCount, max: MAX_SLOT_CAPACITY })}
                            </span>
                          )}
                        </span>

                        {isSelectable && (
                          <span className={`font-bold ${
                            slotItem.crowdLevel === 'low' ? 'text-farmer-success' : slotItem.crowdLevel === 'high' ? 'text-farmer-error' : 'text-farmer-warning'
                          }`}>
                            ~{slotItem.wait}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Validation / Race-Condition Error Banner */}
          {bookingError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-farmer-error shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-farmer-error">{bookingError}</p>
                <p className="text-[11px] text-farmer-secondary">
                  {t('booking.chooseAnotherSlot', 'Please choose another available slot.')}
                </p>
              </div>
            </div>
          )}

          {/* Booking Summary Pre-Confirmation */}
          <div className="bg-farmer-bg p-4 rounded-2xl border border-farmer-border text-xs text-farmer-secondary space-y-1.5 font-medium">
            <h4 className="font-bold text-farmer-text uppercase tracking-wider mb-2">
              {t('booking.slotSummary', 'Booking Summary')}
            </h4>
            <div className="flex justify-between">
              <span>{t('crop', 'Crop')}:</span>
              <span className="font-bold text-farmer-text">{bookingData.crop}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('quantity', 'Quantity')}:</span>
              <span className="font-bold text-farmer-text">{bookingData.quantity} kg</span>
            </div>
            <div className="flex justify-between">
              <span>{t('centre', 'Centre')}:</span>
              <span className="font-bold text-farmer-text">{selectedCentre.name}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('date', 'Date')} & {t('slot', 'Slot')}:</span>
              <span className="font-bold text-farmer-text">{bookingData.date} ({bookingData.slot})</span>
            </div>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="min-h-[50px] px-6 py-3 bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text font-bold rounded-2xl border border-farmer-border flex items-center gap-2 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('back', 'Back')}</span>
            </button>
            <button
              type="button"
              disabled={!isCurrentSlotSelectable || holidayInfo.isHoliday || blockInfo.blocked}
              onClick={handleConfirmBooking}
              className="min-h-[50px] px-8 py-3 bg-farmer-primary hover:bg-farmer-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl flex items-center gap-2 text-sm shadow-sm transition-colors"
            >
              <span>{t('booking.confirmBooking', 'Confirm Booking Details')}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default BookSlot;
