import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../shared/components/Input';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../data/translations';
import { loginUser } from './authService';
import { User, ShieldCheck, CheckCircle2, Phone, CreditCard, Sparkles, ArrowRight, Building, Briefcase } from 'lucide-react';

import { generateFarmerId } from '../utils/tokenGenerator';

import FarmerAuth from '../portals/farmer/pages/FarmerAuth';
import StaffAuth from '../portals/centre/pages/StaffAuth';

const LoginPage = ({ role }) => {
  if (role === 'FARMER') {
    return <FarmerAuth />;
  }
  if (role === 'STAFF') {
    return <StaffAuth />;
  }

  const [tabMode, setTabMode] = useState('login'); // 'login' or 'register' (for farmer)
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Farmer registration form state
  const [regData, setRegData] = useState({
    name: '',
    mobile: '',
    aadhaar: '',
    village: '',
    district: 'West Godavari',
    state: 'Andhra Pradesh',
    landArea: '',
    primaryCrop: 'Paddy (Rice)',
    expectedQuantity: '520',
    preferredCentre: 'C001',
    bankAccount: '',
    ifsc: 'SBIN0001234'
  });

  const navigate = useNavigate();
  const { state, setState, login } = useAppContext();
  const { t } = useTranslation();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!identifier || identifier.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setOtpSent(true);
    setSecret('1234'); // Pre-fill OTP for easy hackathon demo testing
    setSuccessMsg('OTP sent successfully (Use: 1234)');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    let credentials = {};
    if (role === 'FARMER') {
      credentials = { mobile: identifier, otp: secret };
    } else {
      credentials = { id: identifier, password: secret };
    }

    const response = loginUser(state, role, credentials);
    if (response.success) {
      login(response.user);
      const targetDashboard = role === 'STAFF' ? '/centre/dashboard' : `/${role.toLowerCase()}/dashboard`;
      navigate(targetDashboard);
    } else {
      setError(response.message);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    if (!regData.name || !regData.mobile || !regData.village) {
      setError('Please fill in all mandatory farmer registration fields.');
      return;
    }

    // Mask account number
    const rawAcc = regData.bankAccount || '4589';
    const maskedAcc = `XXXX XXXX ${rawAcc.slice(-4)}`;
    const newFarmerId = generateFarmerId();

    const newFarmer = {
      id: newFarmerId,
      name: regData.name,
      mobile: regData.mobile,
      village: regData.village,
      district: regData.district,
      state: regData.state,
      landArea: parseFloat(regData.landArea) || 4.5,
      primaryCrop: regData.primaryCrop,
      expectedQuantity: parseInt(regData.expectedQuantity, 10) || 520,
      bankAccount: maskedAcc,
      ifsc: regData.ifsc,
      bankName: 'State Bank of India',
      aadhaar: regData.aadhaar ? `XXXX-XXXX-${regData.aadhaar.slice(-4)}` : 'XXXX-XXXX-1234'
    };

    setState(prev => ({
      ...prev,
      farmers: [newFarmer, ...(prev.farmers || [])]
    }));

    login({ ...newFarmer, role: 'FARMER' });
    navigate('/farmer/dashboard');
  };

  const fillDemo = () => {
    if (role === 'FARMER') {
      setIdentifier('9876543210');
      setSecret('1234');
      setOtpSent(true);
      setError('');
    } else if (role === 'STAFF') {
      setIdentifier('STAFF001');
      setSecret('1234');
    }
  };

  const isFarmer = role === 'FARMER';

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 py-8 bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('/images/admin-login-bg.png')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      <div className="w-full max-w-lg relative z-10">

        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <div className={`p-4 rounded-2xl shadow-sm mb-3 flex items-center justify-center ${isFarmer ? 'bg-farmer-primary' : 'bg-forest-600'}`}>
            {isFarmer ? (
              <span className="font-black text-white text-2xl">K</span>
            ) : role === 'STAFF' ? (
              <Briefcase className="w-8 h-8 text-white" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className={`text-3xl font-black tracking-tight drop-shadow-md text-white`}>
            {t('appName', 'KisanQueue')}
          </h1>
          <p className={`text-xs font-extrabold uppercase tracking-widest mt-1 drop-shadow-sm text-emerald-300`}>
            {`${role} Dashboard Login`}
          </p>
        </div>

        <div className={`bg-white border shadow-sm rounded-3xl overflow-hidden ${isFarmer ? 'border-farmer-border shadow-farmer-card' : 'border-earth-200'}`}>

          {/* Mode Switcher for Farmer (Sign In vs Register) */}
          {isFarmer && (
            <div className="grid grid-cols-2 bg-farmer-bg p-1.5 border-b border-farmer-border">
              <button
                type="button"
                onClick={() => { setTabMode('login'); setError(''); }}
                className={`py-2.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all min-h-[44px] ${tabMode === 'login'
                  ? 'bg-white text-farmer-primary shadow-sm font-black'
                  : 'text-farmer-secondary hover:text-farmer-text'
                  }`}
              >
                {t('signIn', 'Farmer Sign In')}
              </button>
              <button
                type="button"
                onClick={() => { setTabMode('register'); setError(''); }}
                className={`py-2.5 text-xs font-bold rounded-xl uppercase tracking-wider transition-all min-h-[44px] ${tabMode === 'register'
                  ? 'bg-white text-farmer-primary shadow-sm font-black'
                  : 'text-farmer-secondary hover:text-farmer-text'
                  }`}
              >
                {t('register', 'Farmer Registration')}
              </button>
            </div>
          )}

          <div className="p-6 text-center pb-2">
            <h2 className={`text-xl font-bold ${isFarmer ? 'text-farmer-text font-black' : 'text-earth-900'}`}>
              {isFarmer && tabMode === 'register'
                ? t('auth.registerTitle', 'Farmer Registration')
                : isFarmer
                  ? t('auth.loginTitle', 'Farmer Login')
                  : `${role} Authentication`}
            </h2>
            <p className={`text-xs font-medium mt-1 ${isFarmer ? 'text-farmer-secondary' : 'text-earth-600'}`}>
              {isFarmer && tabMode === 'register'
                ? t('auth.registerSubtitle', 'Register your farming & bank details for direct token generation')
                : isFarmer
                  ? t('auth.loginSubtitle', 'Enter your registered mobile number to access your KisanQueue tokens')
                  : `Sign in with official credentials to access the ${role.toLowerCase()} portal.`}
            </p>
          </div>

          <div className="p-6 pt-2">

            {error && (
              <div className={`p-3 rounded-xl text-xs font-bold border mb-4 animate-in fade-in ${isFarmer
                ? 'bg-farmer-error-light text-farmer-error border-farmer-error/30'
                : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                {error}
              </div>
            )}

            {successMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold border mb-4 animate-in fade-in flex items-center gap-1.5 ${isFarmer
                ? 'bg-farmer-success-light text-farmer-success border-farmer-success/30'
                : 'bg-green-50 text-green-700 border-green-200'
                }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FARMER SIGN IN / STAFF / ADMIN LOGIN FORM */}
            {(!isFarmer || tabMode === 'login') && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`text-xs font-bold uppercase tracking-wider block ${isFarmer ? 'text-farmer-text' : 'text-earth-700'}`}>
                    {isFarmer ? t('auth.mobileNumber', 'Mobile Number') : 'User ID'}
                  </label>
                  <div className="relative">
                    {isFarmer && <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-farmer-secondary" />}
                    <input
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={isFarmer ? 'e.g. 9876543210' : 'Enter ID'}
                      className={`w-full min-h-[48px] rounded-2xl border px-4 text-sm font-bold focus:outline-none ${isFarmer
                        ? 'border-farmer-border bg-farmer-bg text-farmer-text focus:ring-2 focus:ring-farmer-primary pl-10'
                        : 'border-earth-300 bg-white text-earth-900 focus:ring-2 focus:ring-forest-500'
                        }`}
                      required
                    />
                  </div>
                </div>

                {isFarmer ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-farmer-text uppercase tracking-wider">
                        {t('auth.enterOtp', 'Enter 4-Digit OTP')}
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-xs font-bold text-farmer-primary hover:underline"
                      >
                        {otpSent ? 'Resend OTP' : t('auth.sendOtp', 'Send OTP')}
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      placeholder="e.g. 1234"
                      className="w-full min-h-[48px] rounded-2xl border border-farmer-border bg-farmer-bg px-4 text-center tracking-widest text-lg font-black text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-earth-700 uppercase tracking-wider">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full min-h-[50px] font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors ${isFarmer
                    ? 'bg-farmer-primary hover:bg-farmer-primary-dark text-white'
                    : 'bg-forest-600 hover:bg-forest-700 text-white'
                    }`}
                >
                  <span>{isFarmer ? t('auth.verifyOtp', 'Verify & Sign In') : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FARMER REGISTRATION FORM */}
            {isFarmer && tabMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4 text-left text-xs">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                      {t('profile.name', 'Farmer Name')} *
                    </label>
                    <input
                      placeholder="e.g. Ramesh Kumar"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                      {t('profile.mobile', 'Mobile Number')} *
                    </label>
                    <input
                      placeholder="10-digit mobile"
                      maxLength={10}
                      value={regData.mobile}
                      onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                      {t('profile.village', 'Village')} *
                    </label>
                    <input
                      placeholder="e.g. Bhimavaram"
                      value={regData.village}
                      onChange={(e) => setRegData({ ...regData, village: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                      {t('profile.district', 'District')}
                    </label>
                    <input
                      value={regData.district}
                      onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                      {t('profile.landArea', 'Land Area')}
                    </label>
                    <input
                      placeholder="4.5 Acres"
                      value={regData.landArea}
                      onChange={(e) => setRegData({ ...regData, landArea: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1">
                      {t('profile.mainCrop', 'Main Crop')}
                    </label>
                    <select
                      className="w-full h-11 border border-farmer-border rounded-xl px-3 font-semibold bg-farmer-bg text-farmer-text focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                      value={regData.primaryCrop}
                      onChange={(e) => setRegData({ ...regData, primaryCrop: e.target.value })}
                    >
                      <option value="Paddy (Rice)">Paddy (Rice)</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Maize">Maize</option>
                      <option value="Cotton">Cotton</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-farmer-primary-light/40 rounded-xl border border-farmer-border space-y-2">
                  <p className="font-bold text-farmer-primary uppercase tracking-wider flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-farmer-primary" /> {t('profile.bank', 'Bank Account (Masked)')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      placeholder="Account Number (e.g. 4589)"
                      value={regData.bankAccount}
                      onChange={(e) => setRegData({ ...regData, bankAccount: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-farmer-border bg-white text-xs font-semibold"
                    />
                    <input
                      placeholder="IFSC Code (e.g. SBIN0001234)"
                      value={regData.ifsc}
                      onChange={(e) => setRegData({ ...regData, ifsc: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-farmer-border bg-white text-xs font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[50px] bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{t('register', 'Register & Continue')}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>

          <div className={`p-4 border-t flex items-center justify-end ${isFarmer ? 'bg-farmer-bg border-farmer-border' : 'bg-earth-50 border-earth-200'
            }`}>
            <button
              type="button"
              onClick={fillDemo}
              className={`text-xs font-bold hover:underline flex items-center gap-1.5 p-1 ${isFarmer ? 'text-farmer-primary' : 'text-forest-600'
                }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isFarmer ? 'text-farmer-accent' : 'text-amber-500'}`} />
              <span>{isFarmer ? t('auth.demoFill', 'Fill Demo Farmer (Ramesh Kumar)') : 'Fill Demo Credentials'}</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className={`text-xs font-semibold ${isFarmer ? 'text-farmer-secondary hover:text-farmer-text' : 'text-earth-600 hover:text-earth-900'}`}
            >
              ← Back to Portal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
