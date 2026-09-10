// scratch/test_crop_selection.js
import { CROPS_CATALOGUE, CROP_CATEGORIES, filterCrops, getCropById } from '../src/portals/farmer/data/crops.js';

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

console.log('====================================================');
console.log('TESTING FARMER PORTAL CROP CATALOGUE & SEARCH');
console.log('====================================================\n');

// 1. Catalogue contains at least 38 crops
assert(CROPS_CATALOGUE.length >= 38, `Test 1: Catalogue has >= 38 crops (actual: ${CROPS_CATALOGUE.length})`);

// 2. Every crop has all required properties
const missingProps = CROPS_CATALOGUE.filter(c => 
  !c.id || !c.name || !c.category || !Array.isArray(c.aliases) || !c.teluguName || !c.hindiName || !c.iconType
);
assert(missingProps.length === 0, `Test 2: Every crop has id, name, category, aliases, teluguName, hindiName, iconType`);

// 3, 4, 5, 6. Four core crops exist
assert(CROPS_CATALOGUE.some(c => c.id === 'paddy'), 'Test 3: Paddy exists');
assert(CROPS_CATALOGUE.some(c => c.id === 'wheat'), 'Test 4: Wheat exists');
assert(CROPS_CATALOGUE.some(c => c.id === 'cotton'), 'Test 5: Cotton exists');
assert(CROPS_CATALOGUE.some(c => c.id === 'maize'), 'Test 6: Maize exists');

// 7, 8. Search "rice" and "paddy"
const resRice = filterCrops({ searchTerm: 'rice' });
assert(resRice.some(c => c.id === 'paddy'), 'Test 7: Search "rice" returns Paddy');

const resPaddy = filterCrops({ searchTerm: 'paddy' });
assert(resPaddy.some(c => c.id === 'paddy'), 'Test 8: Search "paddy" returns Paddy');

// 9. Search "maize"
const resMaize = filterCrops({ searchTerm: 'maize' });
assert(resMaize.some(c => c.id === 'maize'), 'Test 9: Search "maize" returns Maize');

// 10, 11. Search "cot" and "cotton"
const resCot = filterCrops({ searchTerm: 'cot' });
assert(resCot.some(c => c.id === 'cotton'), 'Test 10: Search "cot" returns Cotton');

const resCotton = filterCrops({ searchTerm: 'cotton' });
assert(resCotton.some(c => c.id === 'cotton'), 'Test 11: Search "cotton" returns Cotton');

// 12. Search "ground"
const resGround = filterCrops({ searchTerm: 'ground' });
assert(resGround.some(c => c.id === 'groundnut'), 'Test 12: Search "ground" returns Groundnut');

// 13. Search Telugu "వరి"
const resTelugu = filterCrops({ searchTerm: 'వరి' });
assert(resTelugu.some(c => c.id === 'paddy'), 'Test 13: Search Telugu "వరి" returns Paddy');

// 14. Search Hindi "धान"
const resHindi = filterCrops({ searchTerm: 'धान' });
assert(resHindi.some(c => c.id === 'paddy'), 'Test 14: Search Hindi "धान" returns Paddy');

// 15. Pulses category works
const resPulses = filterCrops({ selectedCategory: 'Pulses' });
assert(resPulses.length === 6 && resPulses.every(c => c.category === 'Pulses'), 'Test 15: Pulses category returns 6 pulse crops');

// 16. Oilseeds category works
const resOilseeds = filterCrops({ selectedCategory: 'Oilseeds' });
assert(resOilseeds.length === 7 && resOilseeds.every(c => c.category === 'Oilseeds'), 'Test 16: Oilseeds category returns 7 oilseed crops');

// 17. Cereals category works
const resCereals = filterCrops({ selectedCategory: 'Cereals' });
assert(resCereals.length === 7 && resCereals.every(c => c.category === 'Cereals'), 'Test 17: Cereals category returns 7 cereal crops');

// 18, 19. Category + search works (Oilseeds + "ground" -> Groundnut)
const resOilGround = filterCrops({ selectedCategory: 'Oilseeds', searchTerm: 'ground' });
assert(resOilGround.length === 1 && resOilGround[0].id === 'groundnut', 'Test 18 & 19: Oilseeds + "ground" returns only Groundnut');

// 20. Empty search returns all crops for selected category
const resAllEmpty = filterCrops({ selectedCategory: 'All', searchTerm: '' });
assert(resAllEmpty.length === CROPS_CATALOGUE.length, `Test 20: Empty search with "All" category returns all ${CROPS_CATALOGUE.length} crops`);

// 21. Unmatched search returns zero results
const resUnmatched = filterCrops({ searchTerm: 'xyz987nonexistent' });
assert(resUnmatched.length === 0, 'Test 21: Unmatched search returns 0 results');

// 22. Crop IDs are unique
const idSet = new Set(CROPS_CATALOGUE.map(c => c.id));
assert(idSet.size === CROPS_CATALOGUE.length, `Test 22: All ${CROPS_CATALOGUE.length} crop IDs are unique`);

// 23. Existing four crops remain available with verified MSPs
const paddy = getCropById('paddy');
const wheat = getCropById('wheat');
const cotton = getCropById('cotton');
const maize = getCropById('maize');
assert(paddy.msp === '₹2,369 / Q' && wheat.msp === '₹2,275 / Q' && cotton.msp === '₹7,121 / Q' && maize.msp === '₹2,090 / Q', 'Test 23: Existing 4 crops retain verified MSP values');

console.log('\n====================================================');
console.log(`CROP TESTS SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) process.exit(1);
process.exit(0);
