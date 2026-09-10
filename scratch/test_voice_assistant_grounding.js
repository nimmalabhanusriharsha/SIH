// scratch/test_voice_assistant_grounding.js
// Tests voice assistant slot availability grounding

import { processFarmerAssistantQuery } from '../src/services/farmerAssistantService.js';
import { initialData } from '../src/data/mockData.js';

let passed = 0;
let failed = 0;

function assert(condition, name, details = '') {
  if (condition) {
    console.log(`✓ PASS: ${name}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${name} — ${details}`);
    failed++;
  }
}

const mockT = (key, fallbackOrParams) => {
  if (typeof fallbackOrParams === 'string') return fallbackOrParams;
  if (fallbackOrParams && fallbackOrParams.fallback) {
    let str = fallbackOrParams.fallback;
    Object.keys(fallbackOrParams).forEach(k => {
      str = str.replace(`{${k}}`, fallbackOrParams[k]).replace(`{{${k}}}`, fallbackOrParams[k]);
    });
    return str;
  }
  return key;
};

console.log('====================================================');
console.log('TESTING VOICE ASSISTANT SLOT GROUNDING LOGIC');
console.log('====================================================\n');

// 1. Farmer with 6 missed slots
const stateBlocked = {
  ...initialData,
  bookings: [
    { id: 'm1', farmerId: 'F_BLOCKED', status: 'No-Show' },
    { id: 'm2', farmerId: 'F_BLOCKED', status: 'Missed' },
    { id: 'm3', farmerId: 'F_BLOCKED', status: 'Absent' },
    { id: 'm4', farmerId: 'F_BLOCKED', status: 'no-show' },
    { id: 'm5', farmerId: 'F_BLOCKED', status: 'NoShow' },
    { id: 'm6', farmerId: 'F_BLOCKED', status: 'Missed' },
  ]
};

const resBlocked = await processFarmerAssistantQuery('Can I book the 10 AM slot?', {
  state: stateBlocked,
  currentUser: { id: 'F_BLOCKED', name: 'Blocked Farmer' },
  currentLang: 'en',
  t: mockT
});
assert(resBlocked.response.includes('temporarily blocked') || resBlocked.response.includes('missed more than 5'), 'Voice Test 1: Blocked farmer gets blocked voice response', resBlocked.response);

// 2. Query when 10 AM slot is full (5/5)
const stateFull = {
  ...initialData,
  bookings: [
    { id: 'b1', centreId: 'C001', date: '2026-09-10', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
    { id: 'b2', centreId: 'C001', date: '2026-09-10', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
    { id: 'b3', centreId: 'C001', date: '2026-09-10', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
    { id: 'b4', centreId: 'C001', date: '2026-09-10', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
    { id: 'b5', centreId: 'C001', date: '2026-09-10', slot: '10:00 AM – 11:00 AM', status: 'Confirmed' },
  ]
};

const resFull = await processFarmerAssistantQuery('Is the 10 AM slot available?', {
  state: stateFull,
  currentUser: { id: 'F_OK', name: 'Farmer Ok' },
  currentLang: 'en',
  t: mockT
});
assert(resFull.response.includes('full') || resFull.response.includes('started'), 'Voice Test 2: Full or started slot reported accurately', resFull.response);

console.log('\n====================================================');
console.log(`VOICE TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) process.exit(1);
process.exit(0);
