/**
 * KisanQueue — Farmer Portal Crop Catalogue
 *
 * Comprehensive catalogue of 39 Indian procurement crops across 7 categories.
 * Includes localized Telugu & Hindi names, multi-lingual aliases, and verified MSP rates.
 */

export const CROP_CATEGORIES = [
  'All',
  'Cereals',
  'Pulses',
  'Oilseeds',
  'Commercial',
  'Spices',
  'Vegetables',
  'Fruits / Plantation'
];

export const CROPS_CATALOGUE = [
  // ── CEREALS / GRAINS (7) ───────────────────────────────────────────────────
  {
    id: 'paddy',
    name: 'Paddy (Rice)',
    teluguName: 'వరి (ధాన్యం)',
    hindiName: 'धान (चावल)',
    aliases: ['Paddy', 'Rice', 'Dhan', 'Biyyam', 'వరి', 'ధాన్యం', 'బియ్యం', 'धान', 'चावल'],
    category: 'Cereals',
    iconType: 'paddy',
    msp: '₹2,369 / Q',
    isPopular: true
  },
  {
    id: 'wheat',
    name: 'Wheat',
    teluguName: 'గోధుమలు',
    hindiName: 'गेहूं',
    aliases: ['Wheat', 'Gehun', 'Godhumalu', 'గోధుమలు', 'గోధుమ', 'गेहूं', 'कनक'],
    category: 'Cereals',
    iconType: 'wheat',
    msp: '₹2,275 / Q',
    isPopular: true
  },
  {
    id: 'maize',
    name: 'Maize',
    teluguName: 'మొక్కజొన్న',
    hindiName: 'मक्का',
    aliases: ['Maize', 'Corn', 'Makka', 'Mokkajonna', 'మొక్కజొన్న', 'జొన్న', 'मक्का', 'भुट्टा'],
    category: 'Cereals',
    iconType: 'maize',
    msp: '₹2,090 / Q',
    isPopular: true
  },
  {
    id: 'sorghum',
    name: 'Sorghum (Jowar)',
    teluguName: 'జొన్నలు',
    hindiName: 'ज्वार',
    aliases: ['Sorghum', 'Jowar', 'Jonnalu', 'Great Millet', 'జొన్నలు', 'జొన్న', 'ज्वार'],
    category: 'Cereals',
    iconType: 'sorghum'
  },
  {
    id: 'pearl_millet',
    name: 'Pearl Millet (Bajra)',
    teluguName: 'సజ్జలు',
    hindiName: 'बाजरा',
    aliases: ['Pearl Millet', 'Bajra', 'Sajjalu', 'సజ్జలు', 'సజ్జ', 'बाजरा'],
    category: 'Cereals',
    iconType: 'pearl_millet'
  },
  {
    id: 'finger_millet',
    name: 'Finger Millet (Ragi)',
    teluguName: 'రాగులు (చోళ్ళు)',
    hindiName: 'रागी (मंडुआ)',
    aliases: ['Finger Millet', 'Ragi', 'Ragulu', 'Chollu', 'Mandua', 'రాగులు', 'చోళ్ళు', 'रागी', 'मंडुआ'],
    category: 'Cereals',
    iconType: 'finger_millet'
  },
  {
    id: 'barley',
    name: 'Barley (Jau)',
    teluguName: 'యావలు (బార్లీ)',
    hindiName: 'जौ',
    aliases: ['Barley', 'Jau', 'Yavalu', 'యావలు', 'బార్లీ', 'जौ'],
    category: 'Cereals',
    iconType: 'barley'
  },

  // ── PULSES (6) ─────────────────────────────────────────────────────────────
  {
    id: 'red_gram',
    name: 'Red Gram (Tur / Arhar)',
    teluguName: 'కందులు (తువర్)',
    hindiName: 'अरहर (तूर)',
    aliases: ['Red Gram', 'Tur', 'Arhar', 'Pigeon Pea', 'Kandulu', 'కందులు', 'కంది', 'अरहर', 'तूर', 'तुवर'],
    category: 'Pulses',
    iconType: 'red_gram'
  },
  {
    id: 'bengal_gram',
    name: 'Bengal Gram (Chana / Chickpea)',
    teluguName: 'శనగలు (చనా)',
    hindiName: 'चना (छोला)',
    aliases: ['Bengal Gram', 'Chana', 'Chickpea', 'Sanagalu', 'Gram', 'శనగలు', 'శనగ', 'चना', 'छोला'],
    category: 'Pulses',
    iconType: 'bengal_gram'
  },
  {
    id: 'black_gram',
    name: 'Black Gram (Urad)',
    teluguName: 'మినుములు (ఉద్ది)',
    hindiName: 'उड़द',
    aliases: ['Black Gram', 'Urad', 'Minumulu', 'Urad Dal', 'మినుములు', 'మినుము', 'ఉద్ది', 'उड़द', 'उरद'],
    category: 'Pulses',
    iconType: 'black_gram'
  },
  {
    id: 'green_gram',
    name: 'Green Gram (Moong)',
    teluguName: 'పెసలు (మూంగ్)',
    hindiName: 'मूंग',
    aliases: ['Green Gram', 'Moong', 'Pesalu', 'Mung Bean', 'పెసలు', 'పెసర', 'मूंग', 'मूँग'],
    category: 'Pulses',
    iconType: 'green_gram'
  },
  {
    id: 'lentil',
    name: 'Lentil (Masoor)',
    teluguName: 'ఎర్ర కంది (మసూర్)',
    hindiName: 'मसूर',
    aliases: ['Lentil', 'Masoor', 'Masur', 'Erra Kandi', 'మసూర్', 'ఎర్ర కంది', 'मसूर'],
    category: 'Pulses',
    iconType: 'lentil'
  },
  {
    id: 'field_pea',
    name: 'Field Pea (Matar)',
    teluguName: 'బఠాణీలు',
    hindiName: 'मटर',
    aliases: ['Field Pea', 'Pea', 'Matar', 'Bataneelu', 'బఠాణీలు', 'బఠాణీ', 'मटर'],
    category: 'Pulses',
    iconType: 'field_pea'
  },

  // ── OILSEEDS (7) ───────────────────────────────────────────────────────────
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    teluguName: 'వేరుశనగ (పల్లీ)',
    hindiName: 'मूंगफली',
    aliases: ['Groundnut', 'Peanut', 'Mungfali', 'Verusanaga', 'Palli', 'వేరుశనగ', 'పల్లీ', 'మూंगफली', 'मूंगफली'],
    category: 'Oilseeds',
    iconType: 'groundnut'
  },
  {
    id: 'soybean',
    name: 'Soybean',
    teluguName: 'సోయాబీన్',
    hindiName: 'सोयाबीन',
    aliases: ['Soybean', 'Soya', 'Soyabean', 'సోయాబీన్', 'సోయా', 'सोयाबीन'],
    category: 'Oilseeds',
    iconType: 'soybean'
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    teluguName: 'పొద్దుతిరుగుడు',
    hindiName: 'सूरजमुखी',
    aliases: ['Sunflower', 'Surajmukhi', 'Podduthirugudu', 'పొద్దుతిరుగుడు', 'सूरजमुखी'],
    category: 'Oilseeds',
    iconType: 'sunflower'
  },
  {
    id: 'mustard',
    name: 'Mustard (Rapeseed)',
    teluguName: 'ఆవాలు (రై)',
    hindiName: 'सरसों (राई)',
    aliases: ['Mustard', 'Sarson', 'Rai', 'Aavalu', 'ఆవాలు', 'ఆవ', 'सरसों', 'राई'],
    category: 'Oilseeds',
    iconType: 'mustard'
  },
  {
    id: 'sesame',
    name: 'Sesame (Til)',
    teluguName: 'నువ్వులు (తిల్)',
    hindiName: 'तिल',
    aliases: ['Sesame', 'Til', 'Gingelly', 'Nuvvulu', 'నువ్వులు', 'నువ్వు', 'तिल'],
    category: 'Oilseeds',
    iconType: 'sesame'
  },
  {
    id: 'safflower',
    name: 'Safflower (Kardi)',
    teluguName: 'కుసుమలు',
    hindiName: 'कुसुम',
    aliases: ['Safflower', 'Kardi', 'Kusum', 'Kusumalu', 'కుసుమలు', 'కుసుమ', 'कुसुम', 'करडी'],
    category: 'Oilseeds',
    iconType: 'safflower'
  },
  {
    id: 'castor',
    name: 'Castor Seed (Arandi)',
    teluguName: 'ఆముదాలు',
    hindiName: 'अरंडी',
    aliases: ['Castor', 'Arandi', 'Aamudaalu', 'ఆముదాలు', 'ఆముదం', 'अरंडी'],
    category: 'Oilseeds',
    iconType: 'castor'
  },

  // ── COMMERCIAL / CASH CROPS (4) ────────────────────────────────────────────
  {
    id: 'cotton',
    name: 'Cotton',
    teluguName: 'పత్తి (దూది)',
    hindiName: 'कपास (रुई)',
    aliases: ['Cotton', 'Kapas', 'Patti', 'Doodi', 'Rui', 'పత్తి', 'దూది', 'కపాస్', 'कपास', 'रुई'],
    category: 'Commercial',
    iconType: 'cotton',
    msp: '₹7,121 / Q',
    isPopular: true
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    teluguName: 'చెరకు',
    hindiName: 'गन्ना',
    aliases: ['Sugarcane', 'Ganna', 'Cheraku', 'చెరకు', 'చెరుకు', 'गन्ना', 'ईख'],
    category: 'Commercial',
    iconType: 'sugarcane'
  },
  {
    id: 'jute',
    name: 'Jute',
    teluguName: 'జనపనార',
    hindiName: 'जूट (पटसन)',
    aliases: ['Jute', 'Patsan', 'Janapanara', 'జనపనార', 'జనప', 'जूट', 'पटसन'],
    category: 'Commercial',
    iconType: 'jute'
  },
  {
    id: 'tobacco',
    name: 'Tobacco',
    teluguName: 'పొగాకు',
    hindiName: 'तंबाकू',
    aliases: ['Tobacco', 'Tambaku', 'Pogaku', 'పొగాకు', 'तंबाकू', 'तम्बाकू'],
    category: 'Commercial',
    iconType: 'tobacco'
  },

  // ── SPICES (5) ─────────────────────────────────────────────────────────────
  {
    id: 'chilli',
    name: 'Chilli (Mirchi)',
    teluguName: 'మిరపకాయలు (మిర్చి)',
    hindiName: 'मिर्च (लाल मिर्च)',
    aliases: ['Chilli', 'Chili', 'Mirchi', 'Mirapakayalu', 'మిరపకాయలు', 'మిర్చి', 'మిరప', 'मिर्च', 'लाल मिर्च'],
    category: 'Spices',
    iconType: 'chilli'
  },
  {
    id: 'turmeric',
    name: 'Turmeric (Haldi)',
    teluguName: 'పసుపు',
    hindiName: 'हल्दी',
    aliases: ['Turmeric', 'Haldi', 'Pasupu', 'పసుపు', 'हल्दी'],
    category: 'Spices',
    iconType: 'turmeric'
  },
  {
    id: 'coriander',
    name: 'Coriander (Dhania)',
    teluguName: 'ధనియాలు',
    hindiName: 'धनिया',
    aliases: ['Coriander', 'Dhania', 'Dhaniyalu', 'ధనియాలు', 'ధనియ', 'కొత్తిమీర', 'धनिया'],
    category: 'Spices',
    iconType: 'coriander'
  },
  {
    id: 'ginger',
    name: 'Ginger (Adrak)',
    teluguName: 'అల్లం',
    hindiName: 'अदरक',
    aliases: ['Ginger', 'Adrak', 'Allam', 'అల్లం', 'అల్లము', 'अदरक', 'आदी'],
    category: 'Spices',
    iconType: 'ginger'
  },
  {
    id: 'cumin',
    name: 'Cumin (Jeera)',
    teluguName: 'జీలకర్ర',
    hindiName: 'जीरा',
    aliases: ['Cumin', 'Jeera', 'Jilakarra', 'జీలకర్ర', 'जीरा'],
    category: 'Spices',
    iconType: 'cumin'
  },

  // ── VEGETABLES (7) ─────────────────────────────────────────────────────────
  {
    id: 'tomato',
    name: 'Tomato',
    teluguName: 'టమోటా',
    hindiName: 'टमाटर',
    aliases: ['Tomato', 'Tamatar', 'Tamota', 'టమోటా', 'టమాట', 'టొమాటో', 'टमाटर'],
    category: 'Vegetables',
    iconType: 'tomato'
  },
  {
    id: 'onion',
    name: 'Onion',
    teluguName: 'ఉల్లిపాయలు',
    hindiName: 'प्याज',
    aliases: ['Onion', 'Pyaz', 'Ullipaya', 'Ullipayalu', 'ఉల్లిపాయలు', 'ఉల్లిపాయ', 'ఉల్లి', 'प्याज', 'कांदा'],
    category: 'Vegetables',
    iconType: 'onion'
  },
  {
    id: 'potato',
    name: 'Potato',
    teluguName: 'బంగాళాదుంప (ఆలూ)',
    hindiName: 'आलू',
    aliases: ['Potato', 'Aloo', 'Bangaladumpa', 'Alu', 'బంగాళాదుంప', 'ఆలూ', 'ఆలు', 'आलू'],
    category: 'Vegetables',
    iconType: 'potato'
  },
  {
    id: 'brinjal',
    name: 'Brinjal (Eggplant)',
    teluguName: 'వంకాయ',
    hindiName: 'बैंगन',
    aliases: ['Brinjal', 'Eggplant', 'Baingan', 'Vankaya', 'వంకాయ', 'వంకాయలు', 'बैंगन'],
    category: 'Vegetables',
    iconType: 'brinjal'
  },
  {
    id: 'okra',
    name: 'Okra (Ladies Finger / Bhindi)',
    teluguName: 'బెండకాయ',
    hindiName: 'भिंडी',
    aliases: ['Okra', 'Ladies Finger', 'Bhindi', 'Bendakaya', 'బెండకాయ', 'బెండ', 'भिंडी'],
    category: 'Vegetables',
    iconType: 'okra'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    teluguName: 'క్యాబేజీ',
    hindiName: 'पत्ता गोभी',
    aliases: ['Cabbage', 'Patta Gobhi', 'Cabbagee', 'క్యాబేజీ', 'క్యాబేజి', 'पत्ता गोभी', 'बंदगोभी'],
    category: 'Vegetables',
    iconType: 'cabbage'
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    teluguName: 'క్యాలీఫ్లవర్',
    hindiName: 'फूल गोभी',
    aliases: ['Cauliflower', 'Phool Gobhi', 'Cauliflower', 'క్యాలీఫ్లవర్', 'క్యాలిఫ్లవర్', 'फूल गोभी'],
    category: 'Vegetables',
    iconType: 'cauliflower'
  },

  // ── FRUITS / PLANTATION (3) ────────────────────────────────────────────────
  {
    id: 'banana',
    name: 'Banana',
    teluguName: 'అరటిపండు',
    hindiName: 'केला',
    aliases: ['Banana', 'Kela', 'Aratipandu', 'Arati', 'అరటిపండు', 'అరటి', 'केला'],
    category: 'Fruits / Plantation',
    iconType: 'banana'
  },
  {
    id: 'mango',
    name: 'Mango',
    teluguName: 'మామిడికాయ',
    hindiName: 'आम',
    aliases: ['Mango', 'Aam', 'Mamidi', 'Mamidikaya', 'మామిడికాయ', 'మామిడి', 'आम'],
    category: 'Fruits / Plantation',
    iconType: 'mango'
  },
  {
    id: 'coconut',
    name: 'Coconut',
    teluguName: 'కొబ్బరికాయ',
    hindiName: 'नारियल',
    aliases: ['Coconut', 'Nariyal', 'Kobbari', 'Kobbarikaya', 'కొబ్బరికాయ', 'కొబ్బరి', 'నారికేళం', 'नारियल'],
    category: 'Fruits / Plantation',
    iconType: 'coconut'
  }
];

/**
 * Filter crops by real-time multi-lingual search and category selection.
 * Case-insensitive, trims whitespace, searches English, Telugu, Hindi, aliases, and category.
 */
export const filterCrops = ({
  crops = CROPS_CATALOGUE,
  searchTerm = '',
  selectedCategory = 'All'
}) => {
  if (!Array.isArray(crops)) return [];

  const cleanTerm = (searchTerm || '').trim().toLowerCase();
  const categoryFilterActive = selectedCategory && selectedCategory !== 'All';

  return crops.filter((crop) => {
    // 1. Category check
    if (categoryFilterActive && crop.category !== selectedCategory) {
      return false;
    }

    // 2. Search term check (if empty, matches all in category)
    if (!cleanTerm) return true;

    // Check name
    if (crop.name.toLowerCase().includes(cleanTerm)) return true;

    // Check localized names
    if (crop.teluguName && crop.teluguName.toLowerCase().includes(cleanTerm)) return true;
    if (crop.hindiName && crop.hindiName.toLowerCase().includes(cleanTerm)) return true;

    // Check category
    if (crop.category.toLowerCase().includes(cleanTerm)) return true;

    // Check aliases
    if (Array.isArray(crop.aliases)) {
      const matchAlias = crop.aliases.some((alias) =>
        String(alias).toLowerCase().includes(cleanTerm)
      );
      if (matchAlias) return true;
    }

    return false;
  });
};

/**
 * Helper to find a crop by ID or fallback to first crop.
 */
export const getCropById = (id, crops = CROPS_CATALOGUE) => {
  if (!id) return crops[0];
  const cleanId = String(id).toLowerCase().trim();
  return (
    crops.find((c) => c.id.toLowerCase() === cleanId) ||
    crops.find((c) => c.name.toLowerCase() === cleanId) ||
    crops.find((c) => c.teluguName === id) ||
    crops[0]
  );
};

/**
 * Helper to get localized crop display name based on current language code ('en', 'te', 'hi').
 * Displays ONLY the crop name in the CURRENT selected system language.
 */
export const getLocalizedCropName = (cropInput, language = 'en') => {
  if (!cropInput) return 'Paddy';
  
  let cropObj = null;
  if (typeof cropInput === 'object') {
    cropObj = cropInput;
  } else {
    const clean = String(cropInput).toLowerCase().trim();
    cropObj = CROPS_CATALOGUE.find(c => 
      c.id.toLowerCase() === clean || 
      c.name.toLowerCase() === clean ||
      c.teluguName === cropInput ||
      (c.aliases && c.aliases.some(a => String(a).toLowerCase() === clean))
    );
  }

  if (!cropObj) return String(cropInput);

  if (language === 'te') {
    return cropObj.teluguName || cropObj.name;
  } else if (language === 'hi') {
    return cropObj.hindiName || cropObj.name;
  } else {
    return cropObj.name;
  }
};

/**
 * Helper to get full crops list formatted for dropdown options in current language.
 */
export const getLocalizedCropsList = (language = 'en') => {
  return CROPS_CATALOGUE.map(crop => ({
    id: crop.id,
    name: crop.name,
    displayName: language === 'te' ? (crop.teluguName || crop.name) : crop.name,
    category: crop.category,
    msp: crop.msp
  }));
};

