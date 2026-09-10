import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import {
  MASTER_FARMER_REGISTRY,
  verifyFarmerRegistrationCredentials,
  findRegisteredFarmerById,
  findRegisteredFarmerByMobile,
  findMasterFarmerByMobile,
  maskMobile,
  maskBankAccount,
  maskAadhaarLast4,
  validateIndianMobile
} from '../data/masterFarmers';
import {
  ALL_INDIAN_STATES,
  getDistrictsForState
} from '../data/indianGeodata';
import SearchableDropdown from '../components/SearchableDropdown';
import {
  ShieldCheck, CheckCircle2, Phone, CreditCard, Sparkles,
  ArrowRight, ArrowLeft, RefreshCw, AlertCircle, Lock, UserCheck,
  Building, MapPin, Wheat, Check, User
} from 'lucide-react';

const CROPS_LIST = [
  'Paddy (Rice)',
  'Wheat',
  'Cotton',
  'Maize',
  'Groundnut',
  'Soybean',
  'Gram/Chana',
  'Mustard',
  'Millets / Jowar',
  'Sugarcane'
];

const DEMO_OTP = '123456';
const OTP_EXPIRY_SECONDS = 120;
const RESEND_COOLDOWN_SECONDS = 30;

const FarmerAuth = ({ initialTab = 'login' }) => {
  const [tabMode, setTabMode] = useState(initialTab); // 'login' or 'register'
  const navigate = useNavigate();
  const { state, setState, login } = useAppContext();
  const { t } = useTranslation();

  // General Status
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. LOGIN STATE (Mobile Number + OTP)
  // ─────────────────────────────────────────────────────────────────────────────
  const [loginMobile, setLoginMobile] = useState('');
  const [loginFarmerObj, setLoginFarmerObj] = useState(null);
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpInput, setLoginOtpInput] = useState('');
  const [loginExpectedOtp, setLoginExpectedOtp] = useState(DEMO_OTP);
  const [loginOtpTimer, setLoginOtpTimer] = useState(OTP_EXPIRY_SECONDS);
  const [loginResendTimer, setLoginResendTimer] = useState(RESEND_COOLDOWN_SECONDS);
  const [loginOtpAttempts, setLoginOtpAttempts] = useState(0);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. REGISTRATION STATE (Multi-Step: 1 -> 2 -> 3)
  // ─────────────────────────────────────────────────────────────────────────────
  const [regStep, setRegStep] = useState(1); // 1 = Identity, 2 = OTP, 3 = Details
  
  // Step 1: Verification (Name + Mobile + Farmer ID)
  const [step1Data, setStep1Data] = useState({
    fullName: '',
    mobile: '',
    farmerId: ''
  });
  const [verifiedMasterFarmer, setVerifiedMasterFarmer] = useState(null);

  // Step 2: OTP
  const [regOtpInput, setRegOtpInput] = useState('');
  const [regOtpTimer, setRegOtpTimer] = useState(OTP_EXPIRY_SECONDS);
  const [regResendTimer, setRegResendTimer] = useState(RESEND_COOLDOWN_SECONDS);
  const [regOtpAttempts, setRegOtpAttempts] = useState(0);

  // Step 3: Detailed Form
  const [step3Data, setStep3Data] = useState({
    aadhaarLast4: '',
    bankAccount: '',
    ifsc: '',
    state: '',
    district: '',
    village: '',
    acres: '',
    primaryCrop: 'Paddy (Rice)'
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TIMERS (Registration & Login OTP)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let interval = null;
    if (loginOtpSent && loginOtpTimer > 0) {
      interval = setInterval(() => {
        setLoginOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loginOtpSent, loginOtpTimer]);

  useEffect(() => {
    let interval = null;
    if (loginOtpSent && loginResendTimer > 0) {
      interval = setInterval(() => {
        setLoginResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loginOtpSent, loginResendTimer]);

  useEffect(() => {
    let interval = null;
    if (regStep === 2 && regOtpTimer > 0) {
      interval = setInterval(() => {
        setRegOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [regStep, regOtpTimer]);

  useEffect(() => {
    let interval = null;
    if (regStep === 2 && regResendTimer > 0) {
      interval = setInterval(() => {
        setRegResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [regStep, regResendTimer]);

  // Reset errors when switching tab
  const switchTab = (mode) => {
    setTabMode(mode);
    setError('');
    setSuccessMsg('');
    setLoginOtpSent(false);
    setShowRegisterPrompt(false);
    setRegStep(1);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // LOGIN HANDLERS (Strictly Mobile Number -> OTP -> Internal Farmer ID)
  // ─────────────────────────────────────────────────────────────────────────────
  const handleLoginRequestOtp = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setShowRegisterPrompt(false);

    const cleanMobile = (loginMobile || '').trim();
    if (!cleanMobile || !validateIndianMobile(cleanMobile)) {
      setError(t('auth.invalidMobile', 'Please enter a valid 10-digit Indian mobile number.'));
      return;
    }

    // 1. Check if mobile number belongs to a registered farmer
    const registeredFarmer = findRegisteredFarmerByMobile(cleanMobile, state.farmers || []);
    if (!registeredFarmer) {
      // Check if mobile exists in authorized Master Registry but registration is incomplete
      const masterFarmer = findMasterFarmerByMobile(cleanMobile);
      if (masterFarmer) {
        setError(t('auth.mobileFoundInMasterIncomplete', 'Mobile number found in the Farmer Registry, but registration is not complete. Please complete Farmer Registration first.'));
      } else {
        setError(t('auth.mobileNotRegistered', 'No registered farmer account was found for this mobile number. Please complete Farmer Registration first.'));
      }
      setShowRegisterPrompt(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Generate OTP and initiate verification session
      const dynamicOtp = DEMO_OTP; // '123456'
      setLoginExpectedOtp(dynamicOtp);
      setLoginFarmerObj(registeredFarmer);
      setLoginOtpSent(true);
      setLoginOtpTimer(OTP_EXPIRY_SECONDS);
      setLoginResendTimer(RESEND_COOLDOWN_SECONDS);
      setLoginOtpAttempts(0);
      setLoginOtpInput(dynamicOtp); // Pre-fill in demo simulation mode for testing convenience
      setSuccessMsg(
        t('auth.otpSentTo', 'OTP sent to {{maskedMobile}}').replace(
          '{{maskedMobile}}',
          maskMobile(registeredFarmer.mobile)
        )
      );
    }, 350);
  };

  const handleLoginResendOtp = () => {
    if (loginResendTimer > 0) return;
    const dynamicOtp = DEMO_OTP;
    setLoginExpectedOtp(dynamicOtp);
    setLoginOtpTimer(OTP_EXPIRY_SECONDS);
    setLoginResendTimer(RESEND_COOLDOWN_SECONDS);
    setLoginOtpAttempts(0);
    setLoginOtpInput(dynamicOtp);
    setError('');
    setSuccessMsg(
      t('auth.otpSentTo', 'OTP sent to {{maskedMobile}}').replace(
        '{{maskedMobile}}',
        maskMobile(loginFarmerObj?.mobile)
      )
    );
  };

  const handleLoginVerifyOtp = (e) => {
    e.preventDefault();
    setError('');

    if (loginOtpTimer === 0) {
      setError(t('auth.otpExpired', 'OTP expired. Please request a new OTP.'));
      return;
    }

    if (loginOtpAttempts >= 3) {
      setError(t('auth.maxAttemptsExceeded', 'Maximum OTP attempts reached. Please request a new OTP.'));
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleanOtp = loginOtpInput.trim();
      const isOtpValid = cleanOtp === loginExpectedOtp || cleanOtp === DEMO_OTP || cleanOtp === '1234';

      if (isOtpValid) {
        // Resolve internal Farmer ID associated with verified farmer
        const canonicalFarmerId = loginFarmerObj.farmerId || loginFarmerObj.id;

        // Set authenticated user with canonical internal Farmer ID and role
        login({
          ...loginFarmerObj,
          id: canonicalFarmerId,
          farmerId: canonicalFarmerId,
          role: 'FARMER'
        });

        navigate('/farmer/dashboard');
      } else {
        setLoginOtpAttempts((prev) => prev + 1);
        setError(t('auth.incorrectOtp', 'Incorrect OTP. Please try again.'));
      }
    }, 400);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // REGISTRATION HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  // STEP 1: Verify Farmer ID, Name, Mobile
  const handleStep1Verify = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const res = verifyFarmerRegistrationCredentials({
      farmerId: step1Data.farmerId,
      fullName: step1Data.fullName,
      mobile: step1Data.mobile,
      registeredFarmers: state.farmers || []
    });

    if (!res.success) {
      if (res.errorType === 'ID_NOT_FOUND') {
        setError(t('auth.idNotFound', 'Farmer ID not found. Please enter a valid Farmer ID.'));
      } else if (res.errorType === 'ALREADY_REGISTERED') {
        setError(t('auth.alreadyRegistered', 'This Farmer ID is already registered. Please login.'));
      } else if (res.errorType === 'NAME_MISMATCH') {
        setError(t('auth.nameMismatch', 'The name does not match the Farmer ID records. Please check your details.'));
      } else if (res.errorType === 'MOBILE_MISMATCH') {
        setError(t('auth.mobileMismatch', 'Mobile number does not match the registered Farmer ID.'));
      } else {
        setError(res.message);
      }
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setVerifiedMasterFarmer(res.masterFarmer);
      
      // Initialize step 3 fields from master record where appropriate
      setStep3Data((prev) => ({
        ...prev,
        aadhaarLast4: res.masterFarmer.aadhaarLast4 || '',
        state: res.masterFarmer.state || 'Andhra Pradesh',
        district: res.masterFarmer.district || '',
        village: res.masterFarmer.village || '',
        acres: res.masterFarmer.landArea ? String(res.masterFarmer.landArea) : '',
        primaryCrop: res.masterFarmer.primaryCrop || 'Paddy (Rice)',
        bankAccount: '',
        ifsc: res.masterFarmer.ifsc || 'SBIN0001234'
      }));

      // Advance to Step 2
      setRegStep(2);
      setRegOtpTimer(OTP_EXPIRY_SECONDS);
      setRegResendTimer(RESEND_COOLDOWN_SECONDS);
      setRegOtpAttempts(0);
      setRegOtpInput(DEMO_OTP); // Simulated demo autofill
      setSuccessMsg(
        t('auth.otpSentTo', 'OTP sent to {{maskedMobile}}').replace(
          '{{maskedMobile}}',
          maskMobile(res.masterFarmer.mobile)
        )
      );
    }, 450);
  };

  // STEP 2: Verify Registration OTP
  const handleRegResendOtp = () => {
    if (regResendTimer > 0) return;
    setRegOtpTimer(OTP_EXPIRY_SECONDS);
    setRegResendTimer(RESEND_COOLDOWN_SECONDS);
    setRegOtpAttempts(0);
    setError('');
    setSuccessMsg(
      t('auth.otpSentTo', 'OTP sent to {{maskedMobile}}').replace(
        '{{maskedMobile}}',
        maskMobile(verifiedMasterFarmer?.mobile)
      )
    );
  };

  const handleStep2VerifyOtp = (e) => {
    e.preventDefault();
    setError('');

    if (regOtpTimer === 0) {
      setError(t('auth.otpExpired', 'OTP expired. Please request a new OTP.'));
      return;
    }

    if (regOtpAttempts >= 3) {
      setError(t('auth.maxAttemptsExceeded', 'Maximum OTP attempts reached. Please request a new OTP.'));
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (regOtpInput.trim() === DEMO_OTP || regOtpInput.trim() === '1234') {
        setError('');
        setSuccessMsg('');
        setRegStep(3); // Advance to Step 3 Form!
      } else {
        setRegOtpAttempts((prev) => prev + 1);
        setError(t('auth.incorrectOtp', 'Incorrect OTP. Please try again.'));
      }
    }, 400);
  };

  // STEP 3: Complete Detailed Registration
  const handleStep3Submit = (e) => {
    e.preventDefault();
    setError('');

    // Validations
    // 1. Aadhaar last 4 digits
    const cleanAadhaarLast4 = step3Data.aadhaarLast4.trim();
    if (!/^\d{4}$/.test(cleanAadhaarLast4)) {
      setError(t('auth.invalidAadhaarLast4', 'Please enter exactly 4 digits for Aadhaar.'));
      return;
    }

    // 2. Bank Account
    const cleanBank = step3Data.bankAccount.replace(/\s+/g, '');
    if (!/^\d{9,18}$/.test(cleanBank)) {
      setError(t('auth.invalidBankAccount', 'Please enter a valid bank account number (9 to 18 digits).'));
      return;
    }

    // 3. IFSC Code
    const cleanIfsc = step3Data.ifsc.trim().toUpperCase();
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      setError(t('auth.invalidIfsc', 'Please enter a valid 11-character IFSC code (e.g. SBIN0001234).'));
      return;
    }

    // 4. State & District
    if (!step3Data.state) {
      setError('Please select a State.');
      return;
    }
    if (!step3Data.district) {
      setError('Please select a District.');
      return;
    }

    // 5. Village
    if (!step3Data.village.trim()) {
      setError('Please enter your Village name.');
      return;
    }

    // 6. Acres
    const parsedAcres = parseFloat(step3Data.acres);
    if (isNaN(parsedAcres) || parsedAcres <= 0) {
      setError(t('auth.invalidAcres', 'Please enter a valid agricultural land area (greater than 0).'));
      return;
    }

    // Create New Farmer Object using verified Farmer ID
    const maskedBank = maskBankAccount(cleanBank);
    const maskedAadhaar = maskAadhaarLast4(cleanAadhaarLast4);

    const canonicalFarmerId = verifiedMasterFarmer.farmerId;
    const newFarmer = {
      id: canonicalFarmerId,
      farmerId: canonicalFarmerId,
      name: verifiedMasterFarmer.name,
      mobile: verifiedMasterFarmer.mobile,
      village: step3Data.village.trim(),
      district: step3Data.district,
      state: step3Data.state,
      landArea: parsedAcres,
      primaryCrop: step3Data.primaryCrop,
      expectedQuantity: Math.round(parsedAcres * 45),
      bankAccount: maskedBank,
      rawBankAccountLast4: cleanBank.slice(-4),
      ifsc: cleanIfsc,
      bankName: 'State Bank of India',
      aadhaar: maskedAadhaar,
      aadhaarLast4: cleanAadhaarLast4,
      isRegistered: true,
      role: 'FARMER'
    };

    // Save to AppContext state
    setState((prev) => ({
      ...prev,
      farmers: [newFarmer, ...(prev.farmers || []).filter((f) => f.id !== newFarmer.id)]
    }));

    // Log in authenticated farmer
    login(newFarmer);

    // Note: NO bookings, NO token, NO queue, NO procurement, NO payments created!
    // Direct to Dashboard as fresh authenticated farmer
    navigate('/farmer/dashboard');
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // DEMO FILL HELPERS
  // ─────────────────────────────────────────────────────────────────────────────
  const fillLoginDemoRamesh = () => {
    switchTab('login');
    setLoginMobile('9876543210');
    setError('');
    setShowRegisterPrompt(false);
  };

  const fillMasterDemoAnitha = () => {
    switchTab('register');
    setRegStep(1);
    setStep1Data({
      fullName: 'Anitha Devi',
      mobile: '9876543215',
      farmerId: 'KIS-B482E910'
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-farmer-bg flex items-center justify-center p-4 py-8 font-sans">
      <div className="w-full max-w-lg">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className="w-14 h-14 bg-farmer-primary rounded-2xl shadow-sm mb-3 flex items-center justify-center">
            <span className="font-black text-white text-2xl">K</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-farmer-text">
            {t('appName', 'KisanQueue')}
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest mt-0.5 text-farmer-secondary">
            {t('farmerPortal', 'Farmer Portal')}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-farmer-border shadow-farmer-card rounded-3xl overflow-hidden">
          
          {/* Tab Switcher: Sign In vs Registration */}
          <div className="grid grid-cols-2 bg-farmer-bg p-1.5 border-b border-farmer-border">
            <button
              type="button"
              onClick={() => switchTab('login')}
              className={`py-2.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all min-h-[44px] ${
                tabMode === 'login'
                  ? 'bg-white text-farmer-primary shadow-sm font-black'
                  : 'text-farmer-secondary hover:text-farmer-text'
              }`}
            >
              {t('signIn', 'Farmer Sign In')}
            </button>
            <button
              type="button"
              onClick={() => switchTab('register')}
              className={`py-2.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all min-h-[44px] ${
                tabMode === 'register'
                  ? 'bg-white text-farmer-primary shadow-sm font-black'
                  : 'text-farmer-secondary hover:text-farmer-text'
              }`}
            >
              {t('register', 'Farmer Registration')}
            </button>
          </div>

          {/* Card Header & Title */}
          <div className="p-6 text-center pb-2">
            <h2 className="text-xl font-black text-farmer-text">
              {tabMode === 'login'
                ? t('auth.loginTitle', 'Farmer Login')
                : regStep === 1
                ? t('auth.verifyFarmerTitle', 'Step 1: Farmer Identity Verification')
                : regStep === 2
                ? t('auth.otpStepTitle', 'Step 2: Mobile OTP Verification')
                : t('auth.detailsStepTitle', 'Step 3: Farm & Banking Details')}
            </h2>
            <p className="text-xs font-medium text-farmer-secondary mt-1 max-w-sm mx-auto leading-relaxed">
              {tabMode === 'login'
                ? t('auth.loginSubtitle', 'Enter your registered mobile number to receive a secure OTP')
                : regStep === 1
                ? t('auth.verifyFarmerSubtitle', 'We verify your Full Name as per Aadhaar, Mobile, and Farmer ID against the Farmer Master Registry')
                : regStep === 2
                ? t('auth.registerSubtitle', 'Verify your mobile number via OTP to continue')
                : t('auth.detailsStepSubtitle', 'Enter your Aadhaar last-4, bank account, and land details')}
            </p>
          </div>

          {/* Alerts: Error & Success */}
          <div className="px-6 pt-2">
            {error && (
              <div className="p-3.5 rounded-2xl text-xs font-bold bg-farmer-error-light text-farmer-error border border-farmer-error/30 mb-4 animate-in fade-in flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{error}</span>
                  {showRegisterPrompt && tabMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        switchTab('register');
                        setStep1Data((prev) => ({ ...prev, mobile: loginMobile }));
                      }}
                      className="mt-2 text-xs font-bold text-farmer-primary hover:underline flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-lg border border-farmer-primary/30 w-fit"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{t('auth.registerAsFarmer', 'Register as Farmer')} →</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl text-xs font-bold bg-farmer-success-light text-farmer-success border border-farmer-success/30 mb-4 animate-in fade-in flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          {/* Form Content Area */}
          <div className="p-6 pt-2">
            
            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* MODE A: FARMER LOGIN (Mobile Number + OTP) */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {tabMode === 'login' && (
              <>
                {!loginOtpSent ? (
                  /* Login Step 1: Enter Mobile Number ONLY */
                  <form onSubmit={handleLoginRequestOtp} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider block text-farmer-text">
                        {t('auth.mobileNumber', 'Mobile Number')} *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmer-secondary" />
                        <input
                          type="tel"
                          maxLength={10}
                          value={loginMobile}
                          onChange={(e) => {
                            setLoginMobile(e.target.value.replace(/\D/g, ''));
                            if (error) setError('');
                          }}
                          placeholder={t('auth.mobilePlaceholder', '10-digit mobile number')}
                          className="w-full min-h-[48px] rounded-2xl border border-farmer-border bg-farmer-bg pl-10 pr-4 text-sm font-bold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                          required
                          autoFocus
                        />
                      </div>
                      <p className="text-[11px] text-farmer-secondary">
                        Enter your 10-digit registered mobile number to receive a secure login OTP.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[50px] font-bold text-sm rounded-2xl bg-farmer-primary hover:bg-farmer-primary-dark text-white shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span>{t('auth.sendingOtp', 'Sending OTP...')}</span>
                      ) : (
                        <>
                          <span>{t('auth.sendOtp', 'Send OTP')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Login Step 2: Enter 6-digit OTP */
                  <form onSubmit={handleLoginVerifyOtp} className="space-y-4 text-left">
                    
                    {/* Demo Simulation Badge */}
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        {t('auth.demoSimulationBadge', 'Demo Mode — OTP simulation enabled')}
                      </span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900">
                        {loginExpectedOtp || DEMO_OTP}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-farmer-text uppercase tracking-wider">
                          {t('auth.enter6DigitOtp', 'Enter the 6-digit OTP')}
                        </label>
                        <span className="text-[11px] font-mono text-farmer-secondary">
                          {loginOtpTimer > 0 ? (
                            `Expires in ${Math.floor(loginOtpTimer / 60)}:${String(loginOtpTimer % 60).padStart(2, '0')}`
                          ) : (
                            <span className="text-farmer-error font-bold">Expired</span>
                          )}
                        </span>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        value={loginOtpInput}
                        onChange={(e) => setLoginOtpInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full min-h-[52px] rounded-2xl border border-farmer-border bg-farmer-bg px-4 text-center tracking-[0.35em] text-xl font-black text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => { setLoginOtpSent(false); setError(''); }}
                        className="text-farmer-secondary hover:text-farmer-text font-semibold flex items-center gap-1 min-h-[36px]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>{t('auth.changeMobile', 'Change Mobile Number')}</span>
                      </button>

                      <button
                        type="button"
                        disabled={loginResendTimer > 0}
                        onClick={handleLoginResendOtp}
                        className={`font-bold transition-colors min-h-[36px] flex items-center gap-1 ${
                          loginResendTimer > 0
                            ? 'text-farmer-secondary/60 cursor-not-allowed'
                            : 'text-farmer-primary hover:underline'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loginResendTimer > 0 ? 'opacity-40' : ''}`} />
                        <span>
                          {loginResendTimer > 0
                            ? t('auth.resendOtpIn', 'Resend OTP in {{seconds}}s').replace('{{seconds}}', String(loginResendTimer))
                            : t('auth.resendOtpNow', 'Resend OTP')}
                        </span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[50px] font-bold text-sm rounded-2xl bg-farmer-primary hover:bg-farmer-primary-dark text-white shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span>{t('auth.verifying', 'Verifying...')}</span>
                      ) : (
                        <>
                          <span>{t('auth.verifyAndLogin', 'Verify & Login')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* ═════════════════════════════════════════════════════════════════ */}
            {/* MODE B: NEW 3-STEP FARMER REGISTRATION */}
            {/* ═════════════════════════════════════════════════════════════════ */}
            {tabMode === 'register' && (
              <div>
                {/* Step Progress Bar */}
                <div className="mb-6 flex items-center justify-between gap-2 px-1">
                  {[
                    { step: 1, label: 'Verification' },
                    { step: 2, label: 'Mobile OTP' },
                    { step: 3, label: 'Farm Details' }
                  ].map((s, idx) => (
                    <div key={s.step} className="flex-1 flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        regStep === s.step
                          ? 'bg-farmer-primary text-white ring-2 ring-farmer-primary/30'
                          : regStep > s.step
                          ? 'bg-farmer-success text-white'
                          : 'bg-farmer-border text-farmer-secondary'
                      }`}>
                        {regStep > s.step ? <Check className="w-3.5 h-3.5" /> : s.step}
                      </div>
                      <span className={`text-[11px] font-bold hidden sm:inline truncate ${
                        regStep === s.step ? 'text-farmer-text' : 'text-farmer-secondary'
                      }`}>
                        {s.label}
                      </span>
                      {idx < 2 && <div className="flex-1 h-0.5 bg-farmer-border/80" />}
                    </div>
                  ))}
                </div>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* REGISTRATION STEP 1: IDENTITY VERIFICATION */}
                {/* ───────────────────────────────────────────────────────────── */}
                {regStep === 1 && (
                  <form onSubmit={handleStep1Verify} className="space-y-4 text-left text-xs">
                    
                    {/* 1. Full Name as per Aadhaar */}
                    <div className="space-y-1">
                      <label className="font-bold text-farmer-text uppercase tracking-wider block">
                        {t('auth.nameAsAadhaar', 'Full Name as per Aadhaar')} *
                      </label>
                      <input
                        type="text"
                        value={step1Data.fullName}
                        onChange={(e) => setStep1Data({ ...step1Data, fullName: e.target.value })}
                        placeholder={t('auth.namePlaceholder', 'e.g. Ramesh Kumar')}
                        className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                        required
                        autoFocus
                      />
                    </div>

                    {/* 2. Mobile Number */}
                    <div className="space-y-1">
                      <label className="font-bold text-farmer-text uppercase tracking-wider block">
                        {t('auth.mobileNumber', 'Mobile Number')} *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-farmer-secondary" />
                        <input
                          type="tel"
                          maxLength={10}
                          value={step1Data.mobile}
                          onChange={(e) => setStep1Data({ ...step1Data, mobile: e.target.value.replace(/\D/g, '') })}
                          placeholder={t('auth.mobilePlaceholder', '10-digit mobile number')}
                          className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                          required
                        />
                      </div>
                    </div>

                    {/* 3. Farmer ID */}
                    <div className="space-y-1">
                      <label className="font-bold text-farmer-text uppercase tracking-wider block">
                        {t('auth.farmerId', 'Farmer ID')} *
                      </label>
                      <input
                        type="text"
                        value={step1Data.farmerId}
                        onChange={(e) => setStep1Data({ ...step1Data, farmerId: e.target.value })}
                        placeholder={t('auth.farmerIdPlaceholder', 'e.g. KIS-7F29A81C')}
                        className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-bold text-farmer-text uppercase focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                        required
                      />
                      <p className="text-[10px] text-farmer-secondary font-medium">
                        Verified against the authorized Farmer Master Registry for first-time registration only.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[48px] bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 mt-2"
                    >
                      {isLoading ? (
                        <span>Checking Master Records...</span>
                      ) : (
                        <>
                          <span>{t('auth.verifyFarmerBtn', 'Verify Farmer Identity')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* REGISTRATION STEP 2: OTP VERIFICATION */}
                {/* ───────────────────────────────────────────────────────────── */}
                {regStep === 2 && (
                  <form onSubmit={handleStep2VerifyOtp} className="space-y-4">
                    
                    {/* Demo Simulation Badge */}
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        {t('auth.demoSimulationBadge', 'Demo Mode — OTP simulation enabled')}
                      </span>
                      <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900">
                        {DEMO_OTP}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-farmer-text uppercase tracking-wider">
                          {t('auth.enter6DigitOtp', 'Enter the 6-digit OTP')}
                        </label>
                        <span className="text-[11px] font-mono text-farmer-secondary">
                          {regOtpTimer > 0 ? (
                            `Expires in ${Math.floor(regOtpTimer / 60)}:${String(regOtpTimer % 60).padStart(2, '0')}`
                          ) : (
                            <span className="text-farmer-error font-bold">Expired</span>
                          )}
                        </span>
                      </div>

                      <input
                        type="text"
                        maxLength={6}
                        value={regOtpInput}
                        onChange={(e) => setRegOtpInput(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full min-h-[52px] rounded-2xl border border-farmer-border bg-farmer-bg px-4 text-center tracking-[0.35em] text-xl font-black text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                        required
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => { setRegStep(1); setError(''); }}
                        className="text-farmer-secondary hover:text-farmer-text font-semibold flex items-center gap-1 min-h-[36px]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        type="button"
                        disabled={regResendTimer > 0}
                        onClick={handleRegResendOtp}
                        className={`font-bold transition-colors min-h-[36px] flex items-center gap-1 ${
                          regResendTimer > 0
                            ? 'text-farmer-secondary/60 cursor-not-allowed'
                            : 'text-farmer-primary hover:underline'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${regResendTimer > 0 ? 'opacity-40' : ''}`} />
                        <span>
                          {regResendTimer > 0
                            ? t('auth.resendOtpIn', 'Resend OTP in {{seconds}}s').replace('{{seconds}}', String(regResendTimer))
                            : t('auth.resendOtpNow', 'Resend OTP')}
                        </span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[50px] font-bold text-sm rounded-2xl bg-farmer-primary hover:bg-farmer-primary-dark text-white shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span>Verifying OTP...</span>
                      ) : (
                        <>
                          <span>{t('auth.verifyOtpContinue', 'Verify OTP & Continue')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* ───────────────────────────────────────────────────────────── */}
                {/* REGISTRATION STEP 3: FARM & BANK DETAILS */}
                {/* ───────────────────────────────────────────────────────────── */}
                {regStep === 3 && (
                  <form onSubmit={handleStep3Submit} className="space-y-4 text-left text-xs">
                    
                    {/* Verified Identity Badge */}
                    <div className="p-3 bg-farmer-success-light border border-farmer-success/20 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-farmer-secondary uppercase">Verified Farmer</span>
                        <p className="text-xs font-bold text-farmer-text">{verifiedMasterFarmer?.name}</p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-xl border border-farmer-success/30 text-farmer-success">
                        {verifiedMasterFarmer?.farmerId}
                      </span>
                    </div>

                    {/* Aadhaar Last 4 & Bank Account */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                          {t('auth.aadhaarLast4', 'Aadhaar Last 4 Digits')} *
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          value={step3Data.aadhaarLast4}
                          onChange={(e) => setStep3Data({ ...step3Data, aadhaarLast4: e.target.value.replace(/\D/g, '') })}
                          placeholder="e.g. 4589"
                          className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-bold tracking-widest text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                          required
                        />
                        <p className="text-[10px] text-farmer-secondary mt-0.5">
                          Only enter final 4 digits for privacy.
                        </p>
                      </div>

                      <div>
                        <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                          {t('auth.bankAccountNum', 'Bank Account Number')} *
                        </label>
                        <input
                          type="text"
                          maxLength={18}
                          value={step3Data.bankAccount}
                          onChange={(e) => setStep3Data({ ...step3Data, bankAccount: e.target.value.replace(/\D/g, '') })}
                          placeholder="e.g. 501002341234"
                          className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                          required
                        />
                      </div>
                    </div>

                    {/* IFSC Code */}
                    <div>
                      <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                        {t('auth.ifscCode', 'IFSC Code')} *
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        value={step3Data.ifsc}
                        onChange={(e) => setStep3Data({ ...step3Data, ifsc: e.target.value.toUpperCase() })}
                        placeholder="e.g. SBIN0001234"
                        className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-mono font-bold text-farmer-text uppercase focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                        required
                      />
                    </div>

                    {/* State (Searchable Dropdown) */}
                    <div>
                      <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                        {t('auth.state', 'State / UT')} *
                      </label>
                      <SearchableDropdown
                        id="state-dropdown"
                        options={ALL_INDIAN_STATES}
                        value={step3Data.state}
                        onChange={(selectedState) => {
                          // Crucial: Clear district when state changes!
                          setStep3Data((prev) => ({
                            ...prev,
                            state: selectedState,
                            district: ''
                          }));
                        }}
                        placeholder="Select State / UT"
                        searchPlaceholder={t('auth.searchState', 'Search state... (e.g. Telangana)')}
                        required
                      />
                    </div>

                    {/* District (Dependent Searchable Dropdown) */}
                    <div>
                      <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                        {t('auth.district', 'District')} *
                      </label>
                      <SearchableDropdown
                        id="district-dropdown"
                        options={getDistrictsForState(step3Data.state)}
                        value={step3Data.district}
                        onChange={(selectedDistrict) => {
                          setStep3Data((prev) => ({ ...prev, district: selectedDistrict }));
                        }}
                        placeholder={
                          step3Data.state
                            ? 'Select District'
                            : t('auth.selectStateFirst', 'Please select State first')
                        }
                        searchPlaceholder={t('auth.searchDistrict', 'Search district...')}
                        disabled={!step3Data.state}
                        required
                      />
                    </div>

                    {/* Village & Land Area (Acres) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                          {t('auth.village', 'Village')} *
                        </label>
                        <input
                          type="text"
                          value={step3Data.village}
                          onChange={(e) => setStep3Data({ ...step3Data, village: e.target.value })}
                          placeholder="e.g. Bhimavaram"
                          className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                          {t('auth.acres', 'Agricultural Land (Acres)')} *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={step3Data.acres}
                          onChange={(e) => setStep3Data({ ...step3Data, acres: e.target.value })}
                          placeholder="e.g. 4.5"
                          className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                          required
                        />
                      </div>
                    </div>

                    {/* Primary Crop */}
                    <div>
                      <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                        {t('auth.primaryCrop', 'Primary Crop')} *
                      </label>
                      <SearchableDropdown
                        id="crop-dropdown"
                        options={CROPS_LIST}
                        value={step3Data.primaryCrop}
                        onChange={(crop) => setStep3Data({ ...step3Data, primaryCrop: crop })}
                        placeholder="Select Crop"
                        searchPlaceholder="Search crop..."
                        required
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setRegStep(2)}
                        className="min-h-[48px] px-4 rounded-xl border border-farmer-border text-farmer-secondary hover:text-farmer-text font-bold text-xs transition-colors"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        className="flex-1 min-h-[48px] bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <span>{t('auth.completeRegistration', 'Complete Registration & Open Dashboard')}</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Card Footer: Demo Shortcuts */}
          <div className="p-4 border-t border-farmer-border bg-farmer-bg flex flex-col sm:flex-row justify-between items-center gap-2">
            {tabMode === 'login' ? (
              <button
                type="button"
                onClick={fillLoginDemoRamesh}
                className="text-xs font-bold text-farmer-primary hover:underline flex items-center gap-1.5 p-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-farmer-accent" />
                <span>{t('auth.fillLoginDemo', 'Fill Demo Registered Farmer (Ramesh Kumar - 9876543210)')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={fillMasterDemoAnitha}
                className="text-xs font-bold text-farmer-primary hover:underline flex items-center gap-1.5 p-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-farmer-accent" />
                <span>{t('auth.fillMasterDemo', 'Fill Demo Unregistered Farmer (Anitha Devi - KIS-B482E910)')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-xs font-semibold text-farmer-secondary hover:text-farmer-text"
            >
              ← Back to Portal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FarmerAuth;
