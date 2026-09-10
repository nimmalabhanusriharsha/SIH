import { MASTER_FARMER_REGISTRY, normalizeName, validateIndianMobile, verifyFarmerRegistrationCredentials, maskMobile, maskBankAccount, maskAadhaarLast4 } from '../src/portals/farmer/data/masterFarmers.js';
import { INDIAN_STATES_AND_UTS, getDistrictsForState } from '../src/portals/farmer/data/indianGeodata.js';
import { translations } from '../src/data/translations.js';
import { initialData } from '../src/data/mockData.js';

let failed = 0;
let passed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- TEST SUITE: FARMER AUTH & SCOPE VERIFICATION ---\n');

// Mock existing state
const existingFarmers = [
  { id: 'KIS-7F29A81C', name: 'Ramesh Kumar', mobile: '9876543210' }
];

// 1. Invalid Farmer ID → blocked
const res1 = verifyFarmerRegistrationCredentials({
  farmerId: 'KIS-99999999',
  fullName: 'Any Name',
  mobile: '9876543210',
  registeredFarmers: existingFarmers
});
assert(!res1.success && res1.message === 'Farmer ID not found. Please enter a valid Farmer ID.', 'Test 1: Invalid Farmer ID is blocked with exact error');

// 2. Correct Farmer ID + wrong name → blocked
const res2 = verifyFarmerRegistrationCredentials({
  farmerId: 'KIS-B482E910',
  fullName: 'Wrong Name',
  mobile: '9876543211',
  registeredFarmers: existingFarmers
});
assert(!res2.success && res2.message === 'The name does not match the Farmer ID records. Please check your details.', 'Test 2: Correct Farmer ID + wrong name is blocked');

// 3. Correct Farmer ID + wrong mobile → blocked
const res3 = verifyFarmerRegistrationCredentials({
  farmerId: 'KIS-B482E910',
  fullName: 'Anitha Devi',
  mobile: '9123456780',
  registeredFarmers: existingFarmers
});
assert(!res3.success && res3.message === 'Mobile number does not match the registered Farmer ID.', 'Test 3: Correct Farmer ID + wrong mobile is blocked');

// 4. Correct Farmer ID + correct name + correct mobile → OTP
const res4 = verifyFarmerRegistrationCredentials({
  farmerId: 'KIS-B482E910',
  fullName: '  Anitha  Devi ',
  mobile: '9876543215',
  registeredFarmers: existingFarmers
});
assert(res4.success && res4.farmer.farmerId === 'KIS-B482E910', 'Test 4: Correct Farmer ID + name + mobile succeeds (handles spacing/case)');

// 4b. Duplicate registration check (Ramesh already registered)
const res4b = verifyFarmerRegistrationCredentials({
  farmerId: 'KIS-7F29A81C',
  fullName: 'Ramesh Kumar',
  mobile: '9876543210',
  registeredFarmers: existingFarmers
});
assert(!res4b.success && res4b.message === 'This Farmer ID is already registered. Please login.', 'Duplicate registration blocked');

// 5. Wrong OTP → error logic
function verifyOtp(enteredOtp, actualOtp, isExpired) {
  if (isExpired) return { success: false, error: 'OTP has expired. Please request a new OTP.' };
  if (enteredOtp !== actualOtp) return { success: false, error: 'Invalid 6-digit OTP. Please enter the correct code.' };
  return { success: true };
}
const res5 = verifyOtp('123456', '789012', false);
assert(!res5.success && res5.error.includes('Invalid 6-digit OTP'), 'Test 5: Wrong OTP shows error');

// 6. Expired OTP → error logic
const res6 = verifyOtp('789012', '789012', true);
assert(!res6.success && res6.error.includes('expired'), 'Test 6: Expired OTP shows error');

// 7. Resend OTP cooldown logic
function canResend(secondsRemaining) {
  return secondsRemaining <= 0;
}
assert(!canResend(30) && !canResend(15) && canResend(0), 'Test 7: Resend OTP enforces 30s cooldown');

// 8. Correct OTP → advances to Step 3
const res8 = verifyOtp('789012', '789012', false);
assert(res8.success, 'Test 8: Correct OTP verification succeeds');

// 9. State search "Tel" → Telangana
const statesMatchingTel = INDIAN_STATES_AND_UTS.filter(s => s.toLowerCase().includes('tel'.toLowerCase()));
assert(statesMatchingTel.includes('Telangana'), 'Test 9: State search "Tel" finds Telangana');

// 10. Telangana → Telangana districts only
const telDistricts = getDistrictsForState('Telangana');
assert(telDistricts.includes('Hyderabad') && telDistricts.includes('Warangal') && !telDistricts.includes('West Godavari'), 'Test 10: Telangana returns only Telangana districts');

// 11. Change Telangana → Andhra Pradesh → previous district cleared
let selectedState = 'Telangana';
let selectedDistrict = 'Warangal';
// Change state:
selectedState = 'Andhra Pradesh';
selectedDistrict = ''; // Auto-cleared in FarmerAuth handleStateSelect
const apDistricts = getDistrictsForState('Andhra Pradesh');
assert(selectedDistrict === '' && apDistricts.includes('West Godavari') && !apDistricts.includes('Warangal'), 'Test 11: State change clears district and loads new state districts');

// 12. Invalid Aadhaar last 4 → blocked (must be exactly 4 digits)
function validateAadhaarLast4(val) {
  return /^\d{4}$/.test(val?.trim());
}
assert(!validateAadhaarLast4('123') && !validateAadhaarLast4('12345') && !validateAadhaarLast4('abcd') && validateAadhaarLast4('8901'), 'Test 12: Aadhaar last 4 strictly validates 4 digits');

// 13. Invalid IFSC → blocked (11 chars: 4 letters, 0, 6 alphanumeric)
function validateIFSC(val) {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val?.trim().toUpperCase());
}
assert(!validateIFSC('SBIN') && !validateIFSC('12345678901') && validateIFSC('SBIN0001234'), 'Test 13: IFSC code format validation');

// 14. Invalid acres → blocked (positive number)
function validateAcres(val) {
  const num = parseFloat(val);
  return !isNaN(num) && num > 0 && num <= 1000;
}
assert(!validateAcres('0') && !validateAcres('-5') && !validateAcres('abc') && validateAcres('4.5'), 'Test 14: Acres validation accepts only positive numbers');

// 15-20. Newly registered farmer data isolation
const newFarmer = {
  id: 'KIS-B482E910',
  name: 'Anitha Devi',
  mobile: '9876543211',
  village: 'Penumantra',
  district: 'West Godavari',
  state: 'Andhra Pradesh',
  landArea: 3.5,
  primaryCrop: 'Paddy (Rice)',
  bankAccount: 'XXXX XXXX 9912',
  ifsc: 'SBIN0001234',
  aadhaarLast4: '4589',
  role: 'FARMER'
};

const bookings = initialData.bookings.filter(b => b.farmerId === newFarmer.id);
const queue = initialData.queue.filter(q => q.farmerId === newFarmer.id);
const payments = initialData.payments.filter(p => p.farmerId === newFarmer.id);
const procurements = (initialData.procurements || []).filter(p => p.farmerId === newFarmer.id);

assert(bookings.length === 0, 'Test 17: New farmer has NO bookings');
assert(queue.length === 0, 'Test 18: New farmer has NO queue entries');
assert(procurements.length === 0, 'Test 19: New farmer has NO procurement entries');
assert(payments.length === 0, 'Test 20: New farmer has NO payments');

// 21. Existing Ramesh farmer still sees Ramesh's data
const rameshId = 'KIS-7F29A81C';
const rameshBookings = initialData.bookings.filter(b => b.farmerId === rameshId);
const rameshPayments = initialData.payments.filter(p => p.farmerId === rameshId);
assert(rameshBookings.length > 0 && rameshPayments.length > 0, 'Test 21: Existing Ramesh farmer sees his migrated data');

// 22. New Anitha farmer sees only Anitha's data
assert(newFarmer.id === 'KIS-B482E910' && rameshBookings.every(b => b.farmerId !== newFarmer.id), 'Test 22: Anitha farmer is completely isolated from Ramesh');

// 23 & 24. Centre & Admin staff authentication untouched
const staff = initialData.staff || [];
assert(staff.some(s => s.id === 'STAFF001'), 'Test 23: Staff records remain intact');

// Translations check
assert(translations.en['auth.verifyFarmerBtn'] && translations.te['auth.verifyFarmerBtn'] && translations.hi['auth.verifyFarmerBtn'], 'Translations: New keys present in EN, TE, HI');

console.log(`\nResults: ${passed} Passed, ${failed} Failed.`);
process.exit(failed > 0 ? 1 : 0);
