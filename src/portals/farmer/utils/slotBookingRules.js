/**
 * KisanQueue — Farmer Portal Slot Booking Rules Utility
 *
 * Implements strict rules for farmer slot booking:
 *  1. Max capacity of exactly 5 farmers per centre + date + slot.
 *  2. Safe local date parsing (no UTC shifts).
 *  3. Sunday and 2nd Saturday holiday rules (other Saturdays are working days).
 *  4. Slot normalization for consistent comparisons.
 *  5. Slot start time parsing & "has slot started" rule (closed at/after start time).
 *  6. Active booking capacity calculation (ignoring cancelled/rejected/expired).
 *  7. Double-booking prevention for the same farmer + slot.
 *  8. Missed-slot blocking rule (blocked if > 5 missed/no-show slots).
 *  9. Comprehensive bookability & status helpers.
 */

export const MAX_SLOT_CAPACITY = 5;
export const MAX_ALLOWED_MISSED_SLOTS = 5;

// Statuses that release capacity (do NOT count against slot capacity)
const RELEASED_STATUSES = new Set(['cancelled', 'rejected', 'expired']);

// Statuses that count towards a missed/absent appointment
const MISSED_STATUSES = new Set(['noshow', 'no-show', 'missed', 'absent']);

/**
 * Normalizes a booking status string for consistent comparisons.
 */
const cleanStatus = (status) => (status ? String(status).trim().toLowerCase() : '');

/**
 * Checks if a booking's status releases its slot capacity.
 */
export const isCancelledOrReleased = (status) => {
  const s = cleanStatus(status);
  return RELEASED_STATUSES.has(s);
};

/**
 * Checks if a booking represents an unexcused missed/no-show slot.
 */
export const isMissedOrNoShow = (status) => {
  const s = cleanStatus(status).replace(/\s+/g, '');
  return MISSED_STATUSES.has(s);
};

/**
 * Safely parses dates into a local calendar Date object at midnight (00:00:00).
 * Prevents UTC timezone shifting bugs when reading "YYYY-MM-DD" strings.
 */
export const parseLocalDate = (dateInput) => {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) {
    return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate(), 0, 0, 0, 0);
  }
  if (typeof dateInput === 'string') {
    const clean = dateInput.trim();
    const match = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      return new Date(year, month, day, 0, 0, 0, 0);
    }
  }
  const fallback = new Date(dateInput);
  return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate(), 0, 0, 0, 0);
};

/**
 * Formats a Date or date string to local "YYYY-MM-DD".
 */
export const formatLocalDate = (dateInput) => {
  const d = parseLocalDate(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks if a given date is a holiday (Sunday or 2nd Saturday).
 * Returns boolean.
 */
export const isHoliday = (date) => {
  const info = getHolidayInfo(date);
  return info.isHoliday;
};

/**
 * Returns detailed holiday information for a given date.
 */
export const getHolidayInfo = (date) => {
  const d = parseLocalDate(date);
  const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
  const dayOfMonth = d.getDate();

  // Sunday
  if (dayOfWeek === 0) {
    return {
      isHoliday: true,
      holidayType: 'sunday',
      messageKey: 'booking.sundayHoliday',
      message: 'Sunday is a holiday. Booking is unavailable.'
    };
  }

  // Second Saturday (day of month between 8 and 14 inclusive)
  if (dayOfWeek === 6 && dayOfMonth >= 8 && dayOfMonth <= 14) {
    return {
      isHoliday: true,
      holidayType: 'second_saturday',
      messageKey: 'booking.secondSaturdayHoliday',
      message: 'Second Saturday is a holiday. Booking is unavailable.'
    };
  }

  return {
    isHoliday: false,
    holidayType: null,
    messageKey: null,
    message: null
  };
};

/**
 * Normalizes different slot string formats to a canonical comparison string.
 * e.g.:
 *  "10:00–11:00 AM"
 *  "10:00 – 11:00 AM"
 *  "10:00 AM – 11:00 AM"
 *  "10:00 AM - 11:00 AM"
 * all normalize to "10:00 AM – 11:00 AM".
 */
export const normalizeSlot = (slotStr) => {
  if (!slotStr) return '';
  const clean = String(slotStr).trim().replace(/[—–]/g, '-');
  const parts = clean.split('-');
  if (parts.length < 2) return clean.replace(/\s+/g, ' ');

  const rawStart = parts[0].trim();
  const rawEnd = parts[1].trim();

  // Extract end period if present
  const endPeriodMatch = rawEnd.match(/(AM|PM)/i);
  const endPeriod = endPeriodMatch ? endPeriodMatch[1].toUpperCase() : '';

  // Extract start period if present
  const startPeriodMatch = rawStart.match(/(AM|PM)/i);
  let startPeriod = startPeriodMatch ? startPeriodMatch[1].toUpperCase() : '';

  const parseTimePart = (timePart, fallbackPeriod) => {
    const m = timePart.match(/(\d{1,2}):(\d{2})/);
    if (!m) return null;
    let hour = parseInt(m[1], 10);
    const minute = m[2];
    let period = fallbackPeriod;

    if (!period) {
      // If hour is 8, 9, 10, 11 => AM; if 12, 1, 2, 3, 4, 5, 6 => PM
      if (hour >= 8 && hour <= 11) {
        period = 'AM';
      } else {
        period = 'PM';
      }
    }
    return { hour, minute, period };
  };

  const endParsed = parseTimePart(rawEnd, endPeriod || 'PM');
  if (!startPeriod) {
    // If end is AM, start is definitely AM
    if (endParsed && endParsed.period === 'AM') {
      startPeriod = 'AM';
    } else {
      // If start hour is 8..11, it is AM even if end is PM (e.g. 11:00 AM - 12:00 PM)
      const sm = rawStart.match(/(\d{1,2}):(\d{2})/);
      if (sm) {
        const sh = parseInt(sm[1], 10);
        startPeriod = (sh >= 8 && sh <= 11) ? 'AM' : (sh === 12 ? 'PM' : (endParsed?.period || 'PM'));
      } else {
        startPeriod = endParsed?.period || 'AM';
      }
    }
  }

  const startParsed = parseTimePart(rawStart, startPeriod);

  if (startParsed && endParsed) {
    const sH = String(startParsed.hour).padStart(2, '0');
    const eH = String(endParsed.hour).padStart(2, '0');
    return `${sH}:${startParsed.minute} ${startParsed.period} – ${eH}:${endParsed.minute} ${endParsed.period}`;
  }

  return clean.replace(/\s+/g, ' ');
};

/**
 * Parses the start time of a slot and returns a local Date object combining the date and slot start.
 * Guarantees correct local time without UTC offset bugs.
 */
export const getSlotStartDateTime = (dateInput, slotStr) => {
  const d = parseLocalDate(dateInput);
  if (!slotStr) return d;

  const clean = String(slotStr).trim().replace(/[—–]/g, '-');
  const parts = clean.split('-');
  const rawStart = parts[0].trim();
  const rawEnd = parts.length > 1 ? parts[1].trim() : '';

  const startPeriodMatch = rawStart.match(/(AM|PM)/i);
  const endPeriodMatch = rawEnd.match(/(AM|PM)/i);

  const timeMatch = rawStart.match(/(\d{1,2}):(\d{2})/);
  if (!timeMatch) return d;

  let hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);

  let period = startPeriodMatch ? startPeriodMatch[1].toUpperCase() : null;
  if (!period) {
    if (endPeriodMatch && endPeriodMatch[1].toUpperCase() === 'AM') {
      period = 'AM';
    } else if (hour >= 8 && hour <= 11) {
      period = 'AM';
    } else {
      period = 'PM';
    }
  }

  // Convert 12-hour format to 24-hour format
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, 0, 0);
};

/**
 * Returns true if the slot's start time has already passed relative to `now`.
 * Bookings are closed at or after the start time.
 */
export const hasSlotStarted = (dateInput, slotStr, now = new Date()) => {
  const slotStart = getSlotStartDateTime(dateInput, slotStr);
  return now.getTime() >= slotStart.getTime();
};

/**
 * Counts valid, active bookings for the exact combination of centreId + date + slot.
 * Ignores cancelled, rejected, or expired bookings.
 */
export const getSlotBookingCount = ({ centreId, date, slot, bookings = [] }) => {
  if (!centreId || !date || !slot || !Array.isArray(bookings)) return 0;

  const targetDateStr = formatLocalDate(date);
  const targetSlotNorm = normalizeSlot(slot);

  return bookings.filter((b) => {
    if (!b || b.centreId !== centreId) return false;
    if (formatLocalDate(b.date) !== targetDateStr) return false;
    if (normalizeSlot(b.slot) !== targetSlotNorm) return false;
    if (isCancelledOrReleased(b.status)) return false;
    return true;
  }).length;
};

/**
 * Checks if the farmer already has an active booking for this exact centre + date + slot.
 */
export const hasExistingBookingForSlot = ({ farmerId, centreId, date, slot, bookings = [] }) => {
  if (!farmerId || !centreId || !date || !slot || !Array.isArray(bookings)) return false;

  const targetDateStr = formatLocalDate(date);
  const targetSlotNorm = normalizeSlot(slot);

  return bookings.some((b) => {
    if (!b || b.farmerId !== farmerId || b.centreId !== centreId) return false;
    if (formatLocalDate(b.date) !== targetDateStr) return false;
    if (normalizeSlot(b.slot) !== targetSlotNorm) return false;
    if (isCancelledOrReleased(b.status)) return false;
    return true;
  });
};

/**
 * Counts unexcused missed / no-show bookings for a farmer.
 * Cancelled, completed, or rejected bookings are NOT counted as missed.
 */
export const getMissedSlotCount = ({ farmerId, bookings = [] }) => {
  if (!farmerId || !Array.isArray(bookings)) return 0;
  return bookings.filter((b) => b && b.farmerId === farmerId && isMissedOrNoShow(b.status)).length;
};

/**
 * Returns true only when a farmer has strictly MORE THAN 5 missed slots.
 * 5 missed slots => still allowed.
 * 6+ missed slots => BLOCKED.
 */
export const isFarmerBookingBlocked = ({ farmerId, bookings = [] }) => {
  return getMissedSlotCount({ farmerId, bookings }) > MAX_ALLOWED_MISSED_SLOTS;
};

/**
 * Returns detailed booking block information for a farmer.
 */
export const getBookingBlockInfo = ({ farmerId, bookings = [] }) => {
  const missedCount = getMissedSlotCount({ farmerId, bookings });
  return {
    blocked: missedCount > MAX_ALLOWED_MISSED_SLOTS,
    missedCount,
    threshold: MAX_ALLOWED_MISSED_SLOTS,
  };
};

/**
 * Comprehensive central bookability check.
 * Evaluates all rules:
 *  1. Farmer authentication & missed-slot block.
 *  2. Holiday check (Sunday & 2nd Saturday).
 *  3. Slot start time check (not started).
 *  4. Capacity check (< 5).
 *  5. Duplicate booking check.
 *
 * Returns true only if ALL conditions pass.
 */
export const isSlotBookable = ({
  date,
  slot,
  centreId,
  bookings = [],
  now = new Date(),
  farmerId = null
}) => {
  // 1. Farmer blocked check
  if (farmerId && isFarmerBookingBlocked({ farmerId, bookings })) {
    return false;
  }

  // 2. Holiday check
  if (isHoliday(date)) {
    return false;
  }

  // 3. Slot started check
  if (hasSlotStarted(date, slot, now)) {
    return false;
  }

  // 4. Capacity check (< MAX_SLOT_CAPACITY)
  const currentCount = getSlotBookingCount({ centreId, date, slot, bookings });
  if (currentCount >= MAX_SLOT_CAPACITY) {
    return false;
  }

  // 5. Duplicate booking check
  if (farmerId && hasExistingBookingForSlot({ farmerId, centreId, date, slot, bookings })) {
    return false;
  }

  return true;
};

/**
 * Evaluates the status of an individual slot for UI display and actions.
 * Returns:
 *  status: "available" | "almost_full" | "full" | "started" | "holiday" | "already_booked" | "blocked"
 *  currentCount: number
 *  maxCapacity: number (5)
 *  isSelectable: boolean
 */
export const getSlotStatus = ({
  date,
  slot,
  centreId,
  bookings = [],
  now = new Date(),
  farmerId = null
}) => {
  const currentCount = getSlotBookingCount({ centreId, date, slot, bookings });

  // 1. Check if farmer is blocked
  if (farmerId && isFarmerBookingBlocked({ farmerId, bookings })) {
    return {
      status: 'blocked',
      currentCount,
      maxCapacity: MAX_SLOT_CAPACITY,
      isSelectable: false,
    };
  }

  // 2. Check holiday
  if (isHoliday(date)) {
    return {
      status: 'holiday',
      currentCount,
      maxCapacity: MAX_SLOT_CAPACITY,
      isSelectable: false,
    };
  }

  // 3. Check duplicate booking
  if (farmerId && hasExistingBookingForSlot({ farmerId, centreId, date, slot, bookings })) {
    return {
      status: 'already_booked',
      currentCount,
      maxCapacity: MAX_SLOT_CAPACITY,
      isSelectable: false,
    };
  }

  // 4. Check slot started
  if (hasSlotStarted(date, slot, now)) {
    return {
      status: 'started',
      currentCount,
      maxCapacity: MAX_SLOT_CAPACITY,
      isSelectable: false,
    };
  }

  // 5. Check capacity
  if (currentCount >= MAX_SLOT_CAPACITY) {
    return {
      status: 'full',
      currentCount,
      maxCapacity: MAX_SLOT_CAPACITY,
      isSelectable: false,
    };
  }

  if (currentCount === MAX_SLOT_CAPACITY - 1) {
    return {
      status: 'almost_full',
      currentCount,
      maxCapacity: MAX_SLOT_CAPACITY,
      isSelectable: true,
    };
  }

  return {
    status: 'available',
    currentCount,
    maxCapacity: MAX_SLOT_CAPACITY,
    isSelectable: true,
  };
};
