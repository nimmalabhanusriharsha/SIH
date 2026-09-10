import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { maskMobile, maskAadhaarLast4, maskBankAccount } from '../data/masterFarmers';
import { Save, ShieldCheck, CreditCard, Edit3, CheckCircle2, MapPin, Copy, Check } from 'lucide-react';

const Profile = () => {
  const { currentUser, login, setState } = useAppContext();
  const { t } = useTranslation();
  
  const [copiedId, setCopiedId] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Farmer',
    mobile: currentUser?.mobile || '',
    id: currentUser?.farmerId || currentUser?.id || '',
    village: currentUser?.village || '',
    district: currentUser?.district || 'West Godavari',
    state: currentUser?.state || 'Andhra Pradesh',
    landArea: currentUser?.landArea ? `${currentUser.landArea} Acres` : '4.5 Acres',
    mainCrop: currentUser?.primaryCrop || 'Paddy (Rice)',
    preferredCentre: currentUser?.preferredCentre || 'Sri Lakshmi Procurement Centre',
    bankAccount: currentUser?.bankAccount || 'XXXX XXXX 4589',
    ifsc: currentUser?.ifsc || 'SBIN0001234',
    aadhaar: currentUser?.aadhaar || maskAadhaarLast4(currentUser?.aadhaarLast4 || '8901')
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || 'Farmer',
        mobile: currentUser.mobile || '',
        id: currentUser.id || '',
        village: currentUser.village || '',
        district: currentUser.district || 'West Godavari',
        state: currentUser.state || 'Andhra Pradesh',
        landArea: currentUser.landArea ? `${currentUser.landArea} Acres` : '4.5 Acres',
        mainCrop: currentUser.primaryCrop || 'Paddy (Rice)',
        preferredCentre: currentUser.preferredCentre || 'Sri Lakshmi Procurement Centre',
        bankAccount: currentUser.bankAccount || 'XXXX XXXX 4589',
        ifsc: currentUser.ifsc || 'SBIN0001234',
        aadhaar: currentUser.aadhaar || maskAadhaarLast4(currentUser?.aadhaarLast4 || '8901')
      });
    }
  }, [currentUser]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    
    // Persist changes to currentUser and state.farmers
    const updatedUser = {
      ...currentUser,
      name: formData.name,
      village: formData.village,
      district: formData.district,
      state: formData.state,
      landArea: parseFloat(formData.landArea) || currentUser?.landArea,
      primaryCrop: formData.mainCrop,
      preferredCentre: formData.preferredCentre
    };

    login(updatedUser);
    setState(prev => ({
      ...prev,
      farmers: (prev.farmers || []).map(f => f.id === currentUser?.id ? { ...f, ...updatedUser } : f)
    }));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopyFarmerId = () => {
    const textToCopy = formData.id || currentUser?.farmerId || currentUser?.id || '';
    if (!textToCopy) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-farmer-text">
            {t('profile.title', 'Farmer Profile')}
          </h1>
          <p className="text-xs md:text-sm text-farmer-secondary mt-0.5 font-medium">
            {t('payment.secureMaskedNote', 'Your registered Kisan details and Aadhaar-linked DBT banking information.')}
          </p>
        </div>
        {savedSuccess && (
          <span className="bg-farmer-success-light text-farmer-success font-bold text-xs px-3 py-1.5 rounded-full border border-farmer-success/30 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('save', 'Saved')}</span>
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Profile Card Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-farmer-border shadow-farmer-card text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-farmer-primary flex items-center justify-center mx-auto shadow-sm relative">
              <span className="text-3xl font-black text-white">{(formData.name || 'F').charAt(0)}</span>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-farmer-success border-2 border-white rounded-full flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-farmer-text">{formData.name}</h2>
              <p className="text-xs text-farmer-secondary font-mono font-medium mt-0.5">{formData.mobile}</p>
            </div>

            <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider block">
                  {t('profile.kisanId', 'Kisan / Farmer ID')}
                </span>
                <button
                  type="button"
                  onClick={handleCopyFarmerId}
                  className="text-[11px] font-bold text-farmer-primary hover:text-farmer-primary-dark flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg hover:bg-farmer-primary-light min-h-[30px]"
                  title={t('profile.copyFarmerId', 'Copy Farmer ID')}
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-farmer-success" />
                      <span className="text-farmer-success font-black">{t('profile.copied', 'Copied!')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t('profile.copyFarmerId', 'Copy Farmer ID')}</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-base font-mono font-bold text-farmer-primary mt-0.5">
                {formData.id}
              </p>
              <p className="text-[10px] text-farmer-secondary mt-1 font-medium leading-relaxed">
                {t('profile.farmerIdNote', "Official Kisan identity code. You don't need to memorize it — future logins use your mobile number and OTP.")}
              </p>
            </div>

            <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border text-left">
              <span className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider block">
                {t('profile.aadhaar', 'Aadhaar Number (Masked)')}
              </span>
              <p className="text-xs font-mono font-bold text-farmer-text mt-0.5">
                {formData.aadhaar}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-farmer-success-light rounded-2xl text-xs font-bold text-farmer-success border border-farmer-success/20">
              <span>e-KYC Status:</span>
              <span className="font-black">✓ Verified</span>
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-farmer-border">
              <h3 className="text-sm font-bold text-farmer-text">
                {t('booking.farmerDetails', 'Farmer Details')}
              </h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-farmer-primary hover:underline flex items-center gap-1 min-h-[36px]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              ) : (
                <button 
                  onClick={handleSave}
                  className="text-xs font-bold text-farmer-success hover:underline flex items-center gap-1 min-h-[36px]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t('save', 'Save Changes')}</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                    {t('profile.name', 'Farmer Name')}
                  </label>
                  <input 
                    type="text"
                    value={formData.name}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                    {t('profile.mobile', 'Mobile Number')}
                  </label>
                  <input 
                    type="text"
                    value={formData.mobile}
                    disabled={true}
                    className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-secondary opacity-75"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                    State
                  </label>
                  <input 
                    type="text"
                    value={formData.state}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                    {t('profile.district', 'District')}
                  </label>
                  <input 
                    type="text"
                    value={formData.district}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                    {t('profile.village', 'Village')}
                  </label>
                  <input 
                    type="text"
                    value={formData.village}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, village: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                    {t('profile.landArea', 'Land Area')}
                  </label>
                  <input 
                    type="text"
                    value={formData.landArea}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, landArea: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                    {t('profile.mainCrop', 'Main Crop')}
                  </label>
                  <input 
                    type="text"
                    value={formData.mainCrop}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({...formData, mainCrop: e.target.value})}
                    className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                  {t('profile.preferredCentre', 'Preferred Procurement Centre')}
                </label>
                <input 
                  type="text"
                  value={formData.preferredCentre}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({...formData, preferredCentre: e.target.value})}
                  className="w-full h-11 px-3.5 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                />
              </div>

              {/* Masked Bank Details */}
              <div className="pt-4 border-t border-farmer-border">
                <h4 className="text-xs font-bold text-farmer-text uppercase tracking-wider mb-3">
                  {t('profile.bank', 'Bank Account (Masked)')}
                </h4>
                <div className="p-3.5 bg-farmer-bg rounded-2xl border border-farmer-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-farmer-primary" />
                    <div>
                      <span className="font-mono font-bold text-farmer-text text-sm">
                        {formData.bankAccount}
                      </span>
                      <p className="text-[11px] text-farmer-secondary font-medium">{currentUser?.bankName || 'State Bank of India'} · IFSC: {currentUser?.ifsc || 'SBIN0001234'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-farmer-success bg-farmer-success-light px-2.5 py-1 rounded-full border border-farmer-success/20">
                    DBT Active
                  </span>
                </div>
              </div>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
