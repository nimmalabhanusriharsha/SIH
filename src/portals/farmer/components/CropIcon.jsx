import React from 'react';

/**
 * Local vector SVG illustrations for Indian procurement crops.
 * 100% offline, zero network overhead, sharp on all displays.
 */
export const CropIcon = ({ iconType, alt = '', className = 'w-10 h-10' }) => {
  const accessibleAlt = alt || `${iconType} crop`;

  switch (iconType) {
    // ── CEREALS ───────────────────────────────────────────────────────────────
    case 'paddy':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#ECFDF5" />
          {/* Paddy / Rice stalk */}
          <path d="M22 48C28 42 34 32 38 18" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="38" cy="18" rx="4" ry="7" transform="rotate(25 38 18)" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <ellipse cx="35" cy="25" rx="3.5" ry="6" transform="rotate(-30 35 25)" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <ellipse cx="39" cy="27" rx="3.5" ry="6" transform="rotate(35 39 27)" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <ellipse cx="32" cy="33" rx="3" ry="5.5" transform="rotate(-35 32 33)" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          <ellipse cx="37" cy="35" rx="3" ry="5.5" transform="rotate(35 37 35)" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
          <path d="M20 44C24 38 27 34 33 34" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'wheat':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEFCE8" />
          {/* Wheat ear */}
          <path d="M32 50V16" stroke="#CA8A04" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 18L40 12M32 18L24 12" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 23L42 18M32 23L22 18" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 28L43 24M32 28L21 24" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="32" cy="18" rx="4" ry="6" fill="#F59E0B" />
          <ellipse cx="28" cy="24" rx="4" ry="6" transform="rotate(-20 28 24)" fill="#D97706" />
          <ellipse cx="36" cy="24" rx="4" ry="6" transform="rotate(20 36 24)" fill="#F59E0B" />
          <ellipse cx="27" cy="31" rx="4" ry="6" transform="rotate(-20 27 31)" fill="#D97706" />
          <ellipse cx="37" cy="31" rx="4" ry="6" transform="rotate(20 37 31)" fill="#F59E0B" />
          <ellipse cx="30" cy="38" rx="3.5" ry="5.5" transform="rotate(-15 30 38)" fill="#D97706" />
          <ellipse cx="34" cy="38" rx="3.5" ry="5.5" transform="rotate(15 34 38)" fill="#F59E0B" />
        </svg>
      );

    case 'maize':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
          {/* Corn cob & husk */}
          <path d="M22 46C20 36 24 24 30 20" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
          <path d="M42 46C44 36 40 24 34 20" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
          <rect x="27" y="16" width="10" height="26" rx="5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          <path d="M27 22H37M27 27H37M27 32H37M27 37H37" stroke="#D97706" strokeWidth="1.5" />
          <path d="M30 16V42M34 16V42" stroke="#D97706" strokeWidth="1.5" />
          <path d="M25 48C28 42 30 38 31 34" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          <path d="M39 48C36 42 34 38 33 34" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'sorghum':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FFFBEB" />
          {/* Jowar / Sorghum head */}
          <path d="M32 52V28" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="32" cy="22" rx="9" ry="12" fill="#CA8A04" />
          <circle cx="28" cy="18" r="2.5" fill="#EAB308" />
          <circle cx="34" cy="16" r="2.5" fill="#FEF08A" />
          <circle cx="32" cy="22" r="2.5" fill="#EAB308" />
          <circle cx="27" cy="25" r="2.5" fill="#FEF08A" />
          <circle cx="35" cy="26" r="2.5" fill="#EAB308" />
          <circle cx="31" cy="30" r="2.5" fill="#FEF08A" />
          <path d="M24 44C28 38 32 38 32 38" stroke="#4D7C0F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'pearl_millet':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#F7FEE7" />
          {/* Bajra / Pearl millet spike */}
          <path d="M32 52V34" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
          <rect x="29" y="14" width="6" height="24" rx="3" fill="#A16207" stroke="#78350F" strokeWidth="1.5" />
          <path d="M26 18H38M26 22H38M26 26H38M26 30H38M26 34H38" stroke="#FEF08A" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );

    case 'finger_millet':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEF2F2" />
          {/* Ragi / Finger millet hand-like head */}
          <path d="M32 52V34" stroke="#65A30D" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 34C28 26 24 22 18 20" stroke="#991B1B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M32 34C30 24 28 18 26 14" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M32 34C34 24 36 18 38 14" stroke="#991B1B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M32 34C36 26 40 22 46 20" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'barley':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEFCE8" />
          {/* Barley with long awns */}
          <path d="M26 50C28 38 32 26 38 16" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M38 16L48 6M36 22L50 12M33 28L48 20" stroke="#A16207" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="35" cy="20" rx="3" ry="5" transform="rotate(30 35 20)" fill="#FBBF24" />
          <ellipse cx="32" cy="26" rx="3" ry="5" transform="rotate(30 32 26)" fill="#F59E0B" />
          <ellipse cx="29" cy="32" rx="3" ry="5" transform="rotate(30 29 32)" fill="#FBBF24" />
        </svg>
      );

    // ── PULSES ────────────────────────────────────────────────────────────────
    case 'red_gram':
    case 'bengal_gram':
    case 'black_gram':
    case 'green_gram':
    case 'lentil':
    case 'field_pea':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#F0FDF4" />
          {/* Pea/Pulse pod with seeds */}
          <path d="M16 42C24 46 42 42 48 22C42 24 24 30 16 42Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
          <circle cx="25" cy="37" r="3.5" fill={iconType === 'red_gram' ? '#EA580C' : iconType === 'green_gram' ? '#15803D' : iconType === 'black_gram' ? '#334155' : iconType === 'bengal_gram' ? '#D97706' : '#DC2626'} />
          <circle cx="33" cy="33" r="3.5" fill={iconType === 'red_gram' ? '#C2410C' : iconType === 'green_gram' ? '#166534' : iconType === 'black_gram' ? '#1E293B' : iconType === 'bengal_gram' ? '#B45309' : '#B91C1C'} />
          <circle cx="41" cy="28" r="3.5" fill={iconType === 'red_gram' ? '#EA580C' : iconType === 'green_gram' ? '#15803D' : iconType === 'black_gram' ? '#334155' : iconType === 'bengal_gram' ? '#D97706' : '#DC2626'} />
          <path d="M14 44C13 46 12 48 11 50" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // ── OILSEEDS ──────────────────────────────────────────────────────────────
    case 'groundnut':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FFFBEB" />
          {/* Peanut shell */}
          <path d="M26 18C21 22 21 28 24 32C21 36 22 42 27 46C33 50 38 48 40 44C43 40 42 34 39 30C42 26 41 20 37 16C31 12 29 14 26 18Z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
          <path d="M25 32H39" stroke="#B45309" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="30" cy="24" r="2" fill="#D97706" />
          <circle cx="33" cy="40" r="2" fill="#D97706" />
        </svg>
      );

    case 'sunflower':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEFCE8" />
          {/* Sunflower flower */}
          <circle cx="32" cy="32" r="11" fill="#78350F" />
          <path d="M32 10V19M32 45V54M10 32H19M45 32H54M16 16L23 23M41 41L48 48M16 48L23 41M41 23L48 16" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );

    case 'soybean':
    case 'mustard':
    case 'sesame':
    case 'safflower':
    case 'castor':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEF9C3" />
          {/* Oil drops & seeds */}
          <path d="M32 16C32 16 22 30 22 36C22 41.5 26.5 46 32 46C37.5 46 42 41.5 42 36C42 30 32 16 32 16Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
          <circle cx="28" cy="38" r="2" fill="#FEF08A" />
        </svg>
      );

    // ── COMMERCIAL CROPS ──────────────────────────────────────────────────────
    case 'cotton':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#F8FAFC" />
          {/* Fluffy cotton boll */}
          <path d="M26 46C29 42 31 38 32 34" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 38C28 36 32 38 36 36C40 38 44 36 46 38C42 42 36 43 30 42Z" fill="#65A30D" />
          <circle cx="26" cy="26" r="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="38" cy="26" r="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="32" cy="20" r="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="32" cy="28" r="7" fill="#F1F5F9" />
        </svg>
      );

    case 'sugarcane':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#F0FDF4" />
          {/* Sugarcane stalks */}
          <rect x="25" y="14" width="6" height="38" rx="2" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1.5" />
          <rect x="34" y="14" width="6" height="38" rx="2" fill="#65A30D" stroke="#3F6212" strokeWidth="1.5" />
          <path d="M25 24H31M25 34H31M25 44H31M34 22H40M34 32H40M34 42H40" stroke="#3F6212" strokeWidth="1.5" />
          <path d="M28 14C24 8 18 6 12 6M37 14C41 8 47 6 53 6" stroke="#65A30D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'jute':
    case 'tobacco':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEFCE8" />
          {/* Natural crop leaf */}
          <path d="M32 50C32 50 18 36 20 22C22 8 32 12 32 12C32 12 42 8 44 22C46 36 32 50 32 50Z" fill="#84CC16" stroke="#4D7C0F" strokeWidth="2" />
          <path d="M32 14V48M32 24L26 20M32 30L38 26M32 36L26 32M32 42L38 38" stroke="#3F6212" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // ── SPICES ────────────────────────────────────────────────────────────────
    case 'chilli':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEF2F2" />
          {/* Red chilli with green stem */}
          <path d="M38 14C37 17 35 18 33 18C33 18 31 16 31 13" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M34 18C40 22 42 36 34 46C30 51 24 53 20 50C22 44 28 32 26 24C25 20 29 18 34 18Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          <path d="M29 20C32 21 34 20 35 18" stroke="#15803D" strokeWidth="2" />
        </svg>
      );

    case 'turmeric':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FFFBEB" />
          {/* Turmeric rhizome */}
          <ellipse cx="32" cy="34" rx="14" ry="7" transform="rotate(-15 32 34)" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <ellipse cx="24" cy="26" rx="8" ry="5" transform="rotate(35 24 26)" fill="#D97706" stroke="#B45309" strokeWidth="2" />
          <ellipse cx="40" cy="27" rx="8" ry="5" transform="rotate(-40 40 27)" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
        </svg>
      );

    case 'coriander':
    case 'ginger':
    case 'cumin':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#F0FDF4" />
          {/* Spice sprig */}
          <path d="M32 50V20" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy="24" r="4" fill="#86EFAC" stroke="#16A34A" strokeWidth="1.5" />
          <circle cx="38" cy="22" r="4" fill="#4ADE80" stroke="#16A34A" strokeWidth="1.5" />
          <circle cx="32" cy="14" r="4" fill="#86EFAC" stroke="#16A34A" strokeWidth="1.5" />
        </svg>
      );

    // ── VEGETABLES ────────────────────────────────────────────────────────────
    case 'tomato':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEF2F2" />
          {/* Round red tomato */}
          <circle cx="32" cy="35" r="15" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          <ellipse cx="27" cy="30" rx="3" ry="2" fill="#F87171" />
          {/* Green calyx */}
          <path d="M32 20V14M28 20L32 17L36 20M24 18L32 18L40 18" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'onion':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FDF2F8" />
          {/* Purple onion */}
          <ellipse cx="32" cy="36" rx="14" ry="12" fill="#A855F7" stroke="#7E22CE" strokeWidth="2" />
          <path d="M32 24C32 20 32 16 34 14" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 36C28 40 36 40 38 36" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'potato':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEFCE8" />
          {/* Earthy potato */}
          <ellipse cx="32" cy="32" rx="16" ry="12" transform="rotate(-10 32 32)" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <circle cx="26" cy="28" r="1.5" fill="#78350F" />
          <circle cx="36" cy="26" r="1.5" fill="#78350F" />
          <circle cx="33" cy="36" r="1.5" fill="#78350F" />
        </svg>
      );

    case 'brinjal':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FAF5FF" />
          {/* Eggplant / Brinjal */}
          <path d="M32 18C26 22 24 30 26 38C28 46 36 48 38 46C42 42 40 32 36 22C35 20 34 18 32 18Z" fill="#6B21A8" stroke="#4C1D95" strokeWidth="2" />
          <path d="M32 18C32 14 30 12 28 10" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 20L32 23L36 20" stroke="#16A34A" strokeWidth="2" fill="#22C55E" />
        </svg>
      );

    case 'okra':
    case 'cabbage':
    case 'cauliflower':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#ECFDF5" />
          {/* Fresh vegetable */}
          <ellipse cx="32" cy="32" rx="14" ry="14" fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
          <path d="M24 32C28 26 36 26 40 32M24 36C28 42 36 42 40 36" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // ── FRUITS & PLANTATION ───────────────────────────────────────────────────
    case 'banana':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEFCE8" />
          {/* Yellow curved banana */}
          <path d="M20 44C28 48 42 40 46 22C42 24 28 32 20 44Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          <path d="M46 22L48 18" stroke="#854D0E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'mango':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#FEF3C7" />
          {/* Mango fruit with stem */}
          <path d="M30 18C22 22 20 32 24 40C28 46 38 48 42 42C46 34 44 24 36 18C34 16 32 16 30 18Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <path d="M32 16V12" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          <path d="M32 14C36 12 40 12 42 14" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'coconut':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#F8FAFC" />
          {/* Brown coconut with fibers */}
          <circle cx="32" cy="32" r="14" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          <circle cx="28" cy="28" r="2" fill="#451A03" />
          <circle cx="36" cy="28" r="2" fill="#451A03" />
          <circle cx="32" cy="35" r="2" fill="#451A03" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-label={accessibleAlt} role="img">
          <circle cx="32" cy="32" r="30" fill="#ECFDF5" />
          <path d="M32 46V22M32 22C28 16 20 16 20 24C20 32 32 36 32 36M32 22C36 16 44 16 44 24C44 32 32 36 32 36" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
};

export default CropIcon;
