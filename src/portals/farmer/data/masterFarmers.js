/**
 * Official Government Master Farmer Registry
 *
 * Used strictly in the KisanQueue Farmer Portal for authenticating and
 * validating farmer identity (Farmer ID, Name as per Aadhaar, and registered mobile).
 *
 * Only farmers existing in this registry can register or authenticate.
 */

export const MASTER_FARMER_REGISTRY = [
  {
    farmerId: 'KIS-7F29A81C',
    name: 'Ramesh Kumar',
    mobile: '9876543210',
    village: 'Bhimavaram',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    landArea: 5.2,
    primaryCrop: 'Paddy (Rice)',
    aadhaarLast4: '8901',
    bankAccount: 'XXXX XXXX 4589',
    ifsc: 'SBIN0001234'
  },
  {
    farmerId: 'KIS-B482E910',
    name: 'Anitha Devi',
    mobile: '9876543215',
    village: 'Gudivada',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    landArea: 3.8,
    primaryCrop: 'Paddy (Rice)',
    aadhaarLast4: '3215',
    bankAccount: 'XXXX XXXX 6712',
    ifsc: 'SBIN0002345'
  },
  {
    farmerId: 'KIS-C921D345',
    name: 'Rajesh Varma',
    mobile: '9876543216',
    village: 'Miryalaguda',
    district: 'Nalgonda',
    state: 'Telangana',
    landArea: 6.5,
    primaryCrop: 'Paddy (Rice)',
    aadhaarLast4: '4589',
    bankAccount: 'XXXX XXXX 8934',
    ifsc: 'SBIN0003456'
  },
  {
    farmerId: 'KIS-D384A712',
    name: 'Lakshmi Narayana',
    mobile: '9876543217',
    village: 'Suryapet',
    district: 'Suryapet',
    state: 'Telangana',
    landArea: 4.2,
    primaryCrop: 'Cotton',
    aadhaarLast4: '9821',
    bankAccount: 'XXXX XXXX 1290',
    ifsc: 'UBIN0530012'
  },
  {
    farmerId: 'KIS-E5F6A7B8',
    name: 'Suresh Reddy',
    mobile: '9876543211',
    village: 'Palakollu',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    landArea: 3.5,
    primaryCrop: 'Paddy (Rice)',
    aadhaarLast4: '4412',
    bankAccount: 'XXXX XXXX 3190',
    ifsc: 'APGV0002100'
  },
  {
    farmerId: 'KIS-F9A1B2C3',
    name: 'Venkata Rao',
    mobile: '9876543212',
    village: 'Tadepalligudem',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    landArea: 8.0,
    primaryCrop: 'Paddy (Rice)',
    aadhaarLast4: '1189',
    bankAccount: 'XXXX XXXX 9921',
    ifsc: 'UBIN0530012'
  }
];

/**
 * Normalizes a name string for comparison:
 * - trims leading/trailing spaces
 * - collapses consecutive internal spaces into a single space
 * - converts to lowercase
 */
export const normalizeName = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
};

/**
 * Validates Indian 10-digit mobile number format
 */
export const validateIndianMobile = (mobile) => {
  if (!mobile || typeof mobile !== 'string') return false;
  return /^[6-9]\d{9}$/.test(mobile.trim());
};

/**
 * Masks a mobile number for safe display: e.g. "******4589"
 */
export const maskMobile = (mobile) => {
  if (!mobile) return '******0000';
  const clean = String(mobile).trim();
  if (clean.length < 4) return '******0000';
  return `******${clean.slice(-4)}`;
};

/**
 * Masks a bank account for safe display: e.g. "XXXX XXXX 4589"
 */
export const maskBankAccount = (acc) => {
  if (!acc) return 'XXXX XXXX 0000';
  const clean = String(acc).replace(/\s+/g, '');
  if (clean.length < 4) return 'XXXX XXXX 0000';
  return `XXXX XXXX ${clean.slice(-4)}`;
};

/**
 * Masks an Aadhaar last 4 for safe display: e.g. "XXXX-XXXX-8901"
 */
export const maskAadhaarLast4 = (last4) => {
  if (!last4) return 'XXXX-XXXX-0000';
  const clean = String(last4).trim();
  return `XXXX-XXXX-${clean.slice(-4)}`;
};

/**
 * Verifies Farmer ID, Name, and Mobile against the Government Master Farmer Registry
 * and checks for duplicate registrations.
 */
export const verifyFarmerRegistrationCredentials = ({
  farmerId,
  fullName,
  mobile,
  registeredFarmers = []
}) => {
  const cleanId = (farmerId || '').trim().toUpperCase();
  const cleanMobile = (mobile || '').trim();
  const cleanName = (fullName || '').trim();

  // 1. Check if Farmer ID exists in App State (either registered or unregistered)
  const masterFarmer = registeredFarmers.find(
    (f) => (f.farmerId || f.id).toUpperCase() === cleanId
  );

  if (!masterFarmer) {
    return {
      success: false,
      errorType: 'ID_NOT_FOUND',
      message: 'Farmer ID not found. Please enter a valid Farmer ID.'
    };
  }

  // 2. Check if already completely registered
  if (masterFarmer.isRegistered) {
    return {
      success: false,
      errorType: 'ALREADY_REGISTERED',
      message: 'This Farmer ID is already registered. Please login.'
    };
  }

  // 3. Verify Name match (normalized)
  const normInputName = normalizeName(cleanName);
  const normMasterName = normalizeName(masterFarmer.name);

  if (normInputName !== normMasterName) {
    return {
      success: false,
      errorType: 'NAME_MISMATCH',
      message: 'The name does not match the Farmer ID records. Please check your details.'
    };
  }

  // 4. Verify Mobile match
  if (!validateIndianMobile(cleanMobile) || cleanMobile !== masterFarmer.mobile) {
    return {
      success: false,
      errorType: 'MOBILE_MISMATCH',
      message: 'Mobile number does not match the registered Farmer ID.'
    };
  }

  return {
    success: true,
    masterFarmer,
    farmer: masterFarmer
  };
};

/**
 * Finds a registered farmer by ID
 */
export const findRegisteredFarmerById = (farmerId, registeredFarmers = []) => {
  const cleanId = (farmerId || '').trim().toUpperCase();
  return registeredFarmers.find((f) => (f.farmerId || f.id || '').toUpperCase() === cleanId && f.isRegistered !== false) || null;
};

/**
 * Finds a registered farmer by 10-digit mobile number for secure Farmer Login
 */
export const findRegisteredFarmerByMobile = (mobile, registeredFarmers = []) => {
  const cleanMobile = (mobile || '').trim();
  return registeredFarmers.find((f) => (f.mobile || '').trim() === cleanMobile && f.isRegistered !== false) || null;
};

/**
 * Finds an authorized farmer record in the Government Master Registry by mobile
 */
export const findMasterFarmerByMobile = (mobile, registeredFarmers = []) => {
  const cleanMobile = (mobile || '').trim();
  return registeredFarmers.find((f) => (f.mobile || '').trim() === cleanMobile && f.isRegistered === false) || null;
};
