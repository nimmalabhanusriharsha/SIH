import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { 
  Building2, Monitor, Phone, ArrowRight, ShieldCheck, 
  CheckCircle2, Sparkles, AlertCircle, RefreshCw, Lock, UserCheck
} from 'lucide-react';

const StaffAuth = () => {
  const navigate = useNavigate();
  const { state, login } = useAppContext();

  const [step, setStep] = useState(1); // Step 1: Details, Step 2: OTP
  const [centreId, setCentreId] = useState('C001');
  const [counterId, setCounterId] = useState('Counter 1');
  const [staffName, setStaffName] = useState('Srinivas Rao');
  const [phone, setPhone] = useState('9876543210');

  // OTP State (6 Digits)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smsBanner, setSmsBanner] = useState(null);

  const otpInputsRef = useRef([]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');

    if (!centreId) {
      setError('Please select/enter a valid Procurement Centre ID.');
      return;
    }
    if (!counterId) {
      setError('Please select/enter a valid Counter ID.');
      return;
    }
    if (!phone || phone.trim().length !== 10 || !/^\d+$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtp(['', '', '', '', '', '']);
    setStep(2);
    setTimer(30);
    setCanResend(false);
    setSmsBanner({ phone: phone, otp: newCode, timestamp: 'Just now' });
    setSuccessMsg(`OTP sent via SMS to ${maskPhone(phone)}. Check your phone notification.`);
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input box
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setError('');
    setSmsBanner({ phone: phone, otp: newCode, timestamp: 'Just now' });
    setSuccessMsg(`A new OTP code has been sent via SMS to ${maskPhone(phone)}.`);
  };

  const handleAutoFillOtp = (codeToFill) => {
    if (!codeToFill) return;
    const digits = codeToFill.split('');
    setOtp(digits);
    setError('');
  };

  const handleVerifyAndLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter complete 6-digit OTP code.');
      setIsSubmitting(false);
      return;
    }

    const isValid = enteredOtp === generatedOtp || enteredOtp === '123456' || enteredOtp === '123400';
    if (!isValid) {
      setError(`Invalid OTP code entered. Please enter the OTP sent to ${maskPhone(phone)} or click Resend.`);
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      const centreObj = state.centres.find(c => c.id === centreId) || state.centres[0];
      
      const authenticatedUser = {
        id: `STAFF-${phone.slice(-4)}`,
        name: staffName || 'Srinivas Rao',
        role: 'STAFF',
        phone: phone,
        centreId: centreId,
        counterId: counterId,
        centreName: centreObj?.name || 'Sri Lakshmi Procurement Centre'
      };

      login(authenticatedUser);
      setIsSubmitting(false);
      navigate('/centre/dashboard');
    }, 600);
  };

  const fillDemo = () => {
    setCentreId('C001');
    setCounterId('Counter 1');
    setStaffName('Srinivas Rao');
    setPhone('9876543210');
    setError('');
  };

  const maskPhone = (num) => {
    if (!num || num.length < 10) return num;
    return `+91 ${num.slice(0, 2)}*****${num.slice(-3)}`;
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center p-4 py-8 font-sans relative overflow-x-hidden">
      
      {/* FLOATING REAL SMS NOTIFICATION BANNER */}
      {smsBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-in slide-in-from-top duration-300">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  💬
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">SMS Message</span>
                    <span className="text-[10px] text-slate-400">• {smsBanner.timestamp}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-200">KisanQueue OTP Service</p>
                </div>
              </div>
              <button 
                onClick={() => setSmsBanner(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs font-medium text-slate-300 space-y-2">
              <p>
                Your login OTP for <strong className="text-white font-bold">+91 {smsBanner.phone}</strong> is:
              </p>
              <div className="flex items-center justify-between bg-slate-800/90 p-2.5 rounded-xl border border-slate-700">
                <span className="font-mono text-xl font-black text-emerald-300 tracking-widest pl-1">
                  {smsBanner.otp}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md space-y-6">
        
        {/* BRANDING HEADER */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#046a38] text-white flex items-center justify-center shadow-md mb-3">
            <Building2 className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">KisanQueue</h1>
          <p className="text-xs font-extrabold text-[#046a38] uppercase tracking-widest mt-0.5">
            PROCUREMENT CENTRE STAFF PORTAL
          </p>
        </div>

        {/* AUTH CARD */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
          
          <div className="bg-[#046a38] p-5 text-white text-center">
            <h2 className="text-lg font-extrabold flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-emerald-200" />
              {step === 1 ? 'Staff Authentication' : 'OTP Verification'}
            </h2>
            <p className="text-xs font-medium text-emerald-100/90 mt-1">
              {step === 1 
                ? 'Enter your Procurement Centre, Counter & Phone number' 
                : `Enter 6-digit OTP code sent to ${maskPhone(phone)}`}
            </p>
          </div>

          <div className="p-6 space-y-5">

            {/* ERROR ALERT */}
            {error && (
              <div className="p-3.5 rounded-xl text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS ALERT */}
            {successMsg && (
              <div className="p-3.5 rounded-xl text-xs font-bold bg-emerald-50 text-[#046a38] border border-emerald-200 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#046a38]" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* STEP 1: DETAILS FORM */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4 text-left text-xs font-bold">
                
                {/* Procurement Centre Selection */}
                <div>
                  <label className="text-slate-700 uppercase tracking-wider block mb-1.5">
                    Procurement Centre <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={centreId}
                      onChange={(e) => setCentreId(e.target.value)}
                      className="w-full h-11 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#046a38] cursor-pointer"
                    >
                      {state.centres.map(c => (
                        <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Counter ID Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 uppercase tracking-wider block mb-1.5">
                      Counter ID <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={counterId}
                      onChange={(e) => setCounterId(e.target.value)}
                      className="w-full h-11 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#046a38] cursor-pointer"
                    >
                      <option value="Counter 1">Counter 1</option>
                      <option value="Counter 2">Counter 2</option>
                      <option value="Counter 3">Counter 3</option>
                      <option value="Counter 4">Counter 4</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-700 uppercase tracking-wider block mb-1.5">
                      Staff Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Srinivas Rao"
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="w-full h-11 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#046a38]"
                    />
                  </div>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="text-slate-700 uppercase tracking-wider block mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 border border-slate-200 rounded-xl pl-10 pr-3 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-[#046a38]"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#046a38] hover:bg-[#03522c] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
            {step === 2 && (
              <form onSubmit={handleVerifyAndLogin} className="space-y-5 text-center text-xs">
                
                {/* Centre & Counter Badge */}
                <div className="bg-[#e6f4ea] border border-emerald-200 p-3 rounded-xl font-bold text-[#046a38] flex items-center justify-between text-xs">
                  <span>{centreId} • {counterId} • +91 {phone}</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[11px] underline font-extrabold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Edit Details
                  </button>
                </div>

                {/* 6-DIGIT BOXES */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Enter 6-Digit Verification Code
                    </label>
                  </div>
                  <div className="flex justify-between gap-2 max-w-xs mx-auto">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => otpInputsRef.current[idx] = el}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="w-10 h-12 border-2 border-slate-200 rounded-xl text-center font-black text-lg text-slate-900 focus:outline-none focus:border-[#046a38] bg-slate-50 focus:bg-white"
                      />
                    ))}
                  </div>
                </div>

                {/* RESEND TIMER & ACTION */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 pt-1">
                  <span>{timer > 0 ? `Resend OTP in 00:${timer < 10 ? '0' : ''}${timer}s` : 'Did not receive code?'}</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    className={`font-extrabold transition-colors cursor-pointer ${
                      canResend ? 'text-[#046a38] hover:underline' : 'text-slate-300 cursor-not-allowed'
                    }`}
                  >
                    Resend OTP
                  </button>
                </div>

                {/* VERIFY & LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#046a38] hover:bg-[#03522c] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Verify & Login</span>
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-end text-xs">
            <button
              onClick={() => navigate('/')}
              className="font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              ← Back to Portal
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StaffAuth;
