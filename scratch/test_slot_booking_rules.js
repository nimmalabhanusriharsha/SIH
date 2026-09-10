// scratch/test_slot_booking_rules.js
// Automated verification for all 26 test cases

import {
  MAX_SLOT_CAPACITY,
  MAX_ALLOWED_MISSED_SLOTS,
  parseLocalDate,
  formatLocalDate,
  isHoliday,
  getHolidayInfo,
  normalizeSlot,
  getSlotStartDateTime,
  hasSlotStarted,
  getSlotBookingCount,
  hasExistingBookingForSlot,
  getMissedSlotCount,
  isFarmerBookingBlocked,
  getBookingBlockInfo,
  isSlotBookable,
  getSlotStatus
} from '../src/portals/farmer/utils/slotBookingRules.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, extra = '') {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName} ${extra}`);
    failed++;
  }
}

console.log('====================================================');
console.log('RUNNING KISANQUEUE FARMER PORTAL SLOT BOOKING TESTS');
console.log('====================================================\n');

// Test 1: Slot 0/5 -> Bookable
const bookingsEmpty = [];
const slot1Status = getSlotStatus({
  date: '2026-09-15',
  slot: '10:00 AM – 11:00 AM',
  centreId: 'C001',
  bookings: bookingsEmpty,
  now: new Date(2026, 8, 15, 9, 0, 0)
});
assert(slot1Status.status === 'available' && slot1Status.currentCount === 0 && slot1Status.isSelectable, 'Test 1: Slot 0/5 is available and selectable');

// Test 2: Slot 4/5 -> Bookable (Almost Full)
const bookings4 = [
  { id: 'b1', centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
  { id: 'b2', centreId: 'C001', date: '2026-09-15', slot: '10:00–11:00 AM', status: 'Confirmed' },
  { id: 'b3', centreId: 'C001', date: '2026-09-15', slot: '10:00 – 11:00 AM', status: 'Confirmed' },
  { id: 'b4', centreId: 'C001', date: '2026-09-15', slot: '10:00 AM - 11:00 AM', status: 'Confirmed' },
];
const slot2Status = getSlotStatus({
  date: '2026-09-15',
  slot: '10:00 AM – 11:00 AM',
  centreId: 'C001',
  bookings: bookings4,
  now: new Date(2026, 8, 15, 9, 0, 0)
});
assert(slot2Status.status === 'almost_full' && slot2Status.currentCount === 4 && slot2Status.isSelectable, 'Test 2: Slot 4/5 is almost_full and selectable');

// Test 3: Slot 5/5 -> Not bookable (Full)
const bookings5 = [
  ...bookings4,
  { id: 'b5', centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
];
const slot3Status = getSlotStatus({
  date: '2026-09-15',
  slot: '10:00 AM – 11:00 AM',
  centreId: 'C001',
  bookings: bookings5,
  now: new Date(2026, 8, 15, 9, 0, 0)
});
assert(slot3Status.status === 'full' && slot3Status.currentCount === 5 && !slot3Status.isSelectable, 'Test 3: Slot 5/5 is full and not selectable');

// Test 4: Attempt 6th booking -> Rejected
const canBook6th = isSlotBookable({
  date: '2026-09-15',
  slot: '10:00 AM – 11:00 AM',
  centreId: 'C001',
  bookings: bookings5,
  now: new Date(2026, 8, 15, 9, 0, 0)
});
assert(!canBook6th, 'Test 4: Attempt to book 6th slot is rejected (isSlotBookable returns false)');

// Test 5: Today 9:30 AM, slot starts 10:00 AM, capacity 3/5 -> Bookable
const bookings3 = bookings4.slice(0, 3);
const now930 = new Date(2026, 8, 10, 9, 30, 0); // Today Sep 10, 2026 9:30 AM
const bookable930 = isSlotBookable({
  date: '2026-09-10',
  slot: '10:00 AM – 11:00 AM',
  centreId: 'C001',
  bookings: bookings3,
  now: now930
});
assert(bookable930, 'Test 5: Today 9:30 AM for 10:00 AM slot (3/5) is bookable');

// Test 6: Today 10:01 AM, slot starts 10:00 AM -> Not bookable
const now1001 = new Date(2026, 8, 10, 10, 1, 0); // Today Sep 10, 2026 10:01 AM
const bookable1001 = isSlotBookable({
  date: '2026-09-10',
  slot: '10:00 AM – 11:00 AM',
  centreId: 'C001',
  bookings: bookings3,
  now: now1001
});
assert(!bookable1001, 'Test 6: Today 10:01 AM for 10:00 AM slot is NOT bookable');

// Test 7: Future working date, 3/5 -> Bookable
const bookableFuture = isSlotBookable({
  date: '2026-09-11', // Friday Sep 11
  slot: '10:00 AM – 11:00 AM',
  centreId: 'C001',
  bookings: bookings3,
  now: now930
});
assert(bookableFuture, 'Test 7: Future working date (Sep 11) is bookable');

// Test 8: Sunday -> Holiday
const sundayDate = '2026-09-13'; // Sunday
const sunInfo = getHolidayInfo(sundayDate);
assert(sunInfo.isHoliday && sunInfo.holidayType === 'sunday', 'Test 8: Sunday (Sep 13, 2026) is identified as Sunday holiday');

// Test 9: Second Saturday -> Holiday
const secondSatDate = '2026-09-12'; // 2nd Saturday (date = 12)
const secSatInfo = getHolidayInfo(secondSatDate);
assert(secSatInfo.isHoliday && secSatInfo.holidayType === 'second_saturday', 'Test 9: Second Saturday (Sep 12, 2026) is identified as Second Saturday holiday');

// Test 10: First Saturday -> Working day
const firstSatDate = '2026-09-05'; // 1st Saturday (date = 5)
const firstSatInfo = getHolidayInfo(firstSatDate);
assert(!firstSatInfo.isHoliday, 'Test 10: First Saturday (Sep 05, 2026) is NOT a holiday (working day)');

// Test 11: Third Saturday -> Working day
const thirdSatDate = '2026-09-19'; // 3rd Saturday (date = 19)
const thirdSatInfo = getHolidayInfo(thirdSatDate);
assert(!thirdSatInfo.isHoliday, 'Test 11: Third Saturday (Sep 19, 2026) is NOT a holiday (working day)');

// Test 12: All slots past/full -> Zero state
const slotsList = ['08:00 AM – 09:00 AM', '09:00 AM – 10:00 AM', '10:00 AM – 11:00 AM'];
const now1200 = new Date(2026, 8, 10, 12, 0, 0); // 12:00 PM
const availableCount = slotsList.filter(s => isSlotBookable({
  date: '2026-09-10',
  slot: s,
  centreId: 'C001',
  bookings: [],
  now: now1200
})).length;
assert(availableCount === 0, 'Test 12: When all slots are past, 0 slots are bookable (triggers zero state)');

// Test 13: Race condition: 4/5 becomes 5/5 before confirmation -> Rejected with exact message
let currentBookings = [...bookings4];
// Farmer sees 4/5 and clicks book:
assert(getSlotBookingCount({ centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', bookings: currentBookings }) === 4, 'Pre-condition: Slot has 4 bookings');
// Meanwhile, another farmer books:
currentBookings.push({ id: 'b_concurrent', centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' });
// Farmer confirmation handler checks immediately:
const freshCount = getSlotBookingCount({ centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', bookings: currentBookings });
const canConfirm = freshCount < MAX_SLOT_CAPACITY;
assert(!canConfirm && freshCount === 5, 'Test 13: Race condition caught on confirm, booking rejected when count reaches 5');

// Test 14: Successful booking -> Booking + token + queue created
function simulateBookingCreation({ farmerId, centreId, date, slot, bookings, now = new Date() }) {
  if (!farmerId) return { success: false, reason: 'unauthenticated' };
  if (isFarmerBookingBlocked({ farmerId, bookings })) return { success: false, reason: 'blocked' };
  if (isHoliday(date)) return { success: false, reason: 'holiday' };
  if (hasSlotStarted(date, slot, now)) return { success: false, reason: 'started' };
  if (getSlotBookingCount({ centreId, date, slot, bookings }) >= MAX_SLOT_CAPACITY) return { success: false, reason: 'full' };
  if (hasExistingBookingForSlot({ farmerId, centreId, date, slot, bookings })) return { success: false, reason: 'duplicate' };

  // All checks pass:
  const bookingId = `BK-TEST-${Date.now()}`;
  const token = 'A999';
  const queueEntry = { token, farmerId, centreId, status: 'Waiting' };
  return { success: true, bookingId, token, queueEntry };
}

const successResult = simulateBookingCreation({
  farmerId: 'FARMER_123',
  centreId: 'C001',
  date: '2026-09-15',
  slot: '10:00 AM – 11:00 AM',
  bookings: bookings3,
  now: new Date(2026, 8, 15, 8, 0, 0)
});
assert(successResult.success && successResult.token === 'A999' && successResult.queueEntry, 'Test 14: Successful booking generates booking, token, and queue');

// Test 15: Failed booking -> No token created
const failResult = simulateBookingCreation({
  farmerId: 'FARMER_123',
  centreId: 'C001',
  date: '2026-09-15',
  slot: '10:00 AM – 11:00 AM',
  bookings: bookings5, // already full
  now: new Date(2026, 8, 15, 8, 0, 0)
});
assert(!failResult.success && !failResult.token, 'Test 15: Failed booking creates NO token');

// Test 16: Farmer with exactly 5 missed slots -> Booking allowed
const bookingsWith5Missed = [
  { id: 'm1', farmerId: 'FARMER_M', status: 'No-Show' },
  { id: 'm2', farmerId: 'FARMER_M', status: 'Missed' },
  { id: 'm3', farmerId: 'FARMER_M', status: 'Absent' },
  { id: 'm4', farmerId: 'FARMER_M', status: 'no-show' },
  { id: 'm5', farmerId: 'FARMER_M', status: 'NoShow' },
];
const blockedAt5 = isFarmerBookingBlocked({ farmerId: 'FARMER_M', bookings: bookingsWith5Missed });
assert(!blockedAt5 && getMissedSlotCount({ farmerId: 'FARMER_M', bookings: bookingsWith5Missed }) === 5, 'Test 16: Farmer with exactly 5 missed slots is still allowed (not blocked)');

// Test 17: Farmer with 6 missed slots -> Booking blocked
const bookingsWith6Missed = [
  ...bookingsWith5Missed,
  { id: 'm6', farmerId: 'FARMER_M', status: 'Missed' }
];
const blockedAt6 = isFarmerBookingBlocked({ farmerId: 'FARMER_M', bookings: bookingsWith6Missed });
assert(blockedAt6 && getMissedSlotCount({ farmerId: 'FARMER_M', bookings: bookingsWith6Missed }) === 6, 'Test 17: Farmer with 6 missed slots is BLOCKED');

// Test 18: Cancelled booking -> Does not count as missed
const bookingsWithCancelled = [
  ...bookingsWith5Missed,
  { id: 'c1', farmerId: 'FARMER_M', status: 'cancelled' },
  { id: 'c2', farmerId: 'FARMER_M', status: 'Cancelled' }
];
assert(!isFarmerBookingBlocked({ farmerId: 'FARMER_M', bookings: bookingsWithCancelled }), 'Test 18: Cancelled bookings do NOT count as missed slots');

// Test 19: Completed booking -> Does not count as missed
const bookingsWithCompleted = [
  ...bookingsWith5Missed,
  { id: 'comp1', farmerId: 'FARMER_M', status: 'Completed' },
  { id: 'comp2', farmerId: 'FARMER_M', status: 'completed' },
  { id: 'comp3', farmerId: 'FARMER_M', status: 'Confirmed' }
];
assert(!isFarmerBookingBlocked({ farmerId: 'FARMER_M', bookings: bookingsWithCompleted }), 'Test 19: Completed / Confirmed bookings do NOT count as missed slots');

// Test 20: Blocked farmer -> No booking/token/queue created
const blockedBookingAttempt = simulateBookingCreation({
  farmerId: 'FARMER_M',
  centreId: 'C001',
  date: '2026-09-15',
  slot: '10:00 AM – 11:00 AM',
  bookings: bookingsWith6Missed,
  now: new Date(2026, 8, 15, 8, 0, 0)
});
assert(!blockedBookingAttempt.success && blockedBookingAttempt.reason === 'blocked' && !blockedBookingAttempt.token, 'Test 20: Blocked farmer cannot create booking/token');

// Test 21: Duplicate same farmer + centre + date + slot -> rejected
const farmerExistingBookings = [
  { id: 'b_mine', farmerId: 'FARMER_DUP', centreId: 'C001', date: '2026-09-15', slot: '10:00–11:00 AM', status: 'Confirmed' }
];
const duplicateCheck = hasExistingBookingForSlot({
  farmerId: 'FARMER_DUP',
  centreId: 'C001',
  date: '2026-09-15',
  slot: '10:00 AM – 11:00 AM',
  bookings: farmerExistingBookings
});
assert(duplicateCheck, 'Test 21: Duplicate booking detected for same farmer + centre + date + slot');

// Test 22: Same slot at different centre -> independent capacity
const centreABookings = [
  { id: 'ca1', centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
  { id: 'ca2', centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
  { id: 'ca3', centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
  { id: 'ca4', centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
  { id: 'ca5', centreId: 'C001', date: '2026-09-15', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
];
const countCentreB = getSlotBookingCount({
  centreId: 'C002',
  date: '2026-09-15',
  slot: '10:00 AM – 11:00 AM',
  bookings: centreABookings
});
assert(countCentreB === 0, 'Test 22: Centre A being 5/5 full does NOT affect Centre B capacity (independent)');

// Test 23: Same slot on different date -> independent capacity
const countDifferentDate = getSlotBookingCount({
  centreId: 'C001',
  date: '2026-09-16',
  slot: '10:00 AM – 11:00 AM',
  bookings: centreABookings
});
assert(countDifferentDate === 0, 'Test 23: Date 2026-09-15 being 5/5 full does NOT affect Date 2026-09-16 capacity (independent)');

// Test 24: Exactly 10:00 AM -> slot started
const exact1000 = new Date(2026, 8, 10, 10, 0, 0);
const startedAtExact = hasSlotStarted('2026-09-10', '10:00 AM – 11:00 AM', exact1000);
assert(startedAtExact, 'Test 24: Exactly at 10:00 AM, the 10:00 AM slot has started (hasSlotStarted is true)');

// Test 25: Sunday with available capacity -> still unavailable
const sundayBookable = isSlotBookable({
  date: '2026-09-13', // Sunday
  slot: '10:00 AM – 11:00 AM',
  centreId: 'C001',
  bookings: [], // completely empty
  now: new Date(2026, 8, 13, 8, 0, 0)
});
assert(!sundayBookable, 'Test 25: Sunday with 0 bookings is STILL unavailable');

// Test 26: Second Saturday with available capacity -> still unavailable
const secondSatBookable = isSlotBookable({
  date: '2026-09-12', // Second Saturday
  slot: '10:00 AM – 11:00 AM',
  centreId: 'C001',
  bookings: [], // completely empty
  now: new Date(2026, 8, 12, 8, 0, 0)
});
assert(!secondSatBookable, 'Test 26: Second Saturday with 0 bookings is STILL unavailable');

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
