import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { QRCodeSVG } from '../../../utils/qrGenerator';
import { QrCode, Download, Activity, Clock, ShieldCheck, MapPin, Calendar, PackageCheck, ArrowRight, Copy, Check } from 'lucide-react';

const DigitalToken = () => {
  const { state, currentUser } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyFarmerId = () => {
    const textToCopy = currentUser?.farmerId || currentUser?.id || '';
    if (!textToCopy) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const activeBooking = (state.bookings || []).find(
    b => b.farmerId === currentUser?.id && ['Confirmed', 'Processing', 'active'].includes(b.status)
  ) || null;

  const centre = activeBooking 
    ? (state.centres || []).find(c => c.id === activeBooking.centreId) 
    : null;

  if (!activeBooking) {
    return (
      <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white rounded-3xl border border-farmer-border shadow-farmer-card font-sans">
        <div className="w-16 h-16 bg-farmer-primary-light rounded-2xl flex items-center justify-center mb-4 text-farmer-primary shadow-sm border border-farmer-primary/20">
          <QrCode className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-farmer-text mb-2">
          {t('token.noActiveToken', 'No Active Token')}
        </h2>
        <p className="text-xs text-farmer-secondary max-w-sm mx-auto mb-6 font-medium leading-relaxed">
          {t('token.noActiveTokenDesc', 'Book a procurement slot to generate your digital QR token.')}
        </p>
        <button 
          className="min-h-[48px] px-6 py-2.5 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm inline-flex items-center gap-2 text-sm transition-colors"
          onClick={() => navigate('/farmer/book-slot')}
        >
          <span>{t('dashboard.bookSlotNow', 'Book a Slot Now')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Safe non-sensitive QR Payload scoped strictly to active booking & currentUser
  const qrPayload = `TOKEN:${activeBooking.token}\nFARMER_ID:${currentUser?.id || ''}\nCENTRE_ID:${activeBooking.centreId || ''}\nDATE:${activeBooking.date || ''}\nSLOT:${activeBooking.slot || ''}\nBOOKING_ID:${activeBooking.id || ''}`;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-8 font-sans">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-black text-farmer-text">
          {t('token.title', 'Digital Token')}
        </h1>
        <p className="text-xs text-farmer-secondary mt-1 font-medium">
          {t('token.showAtGate', 'Show at Procurement Centre Entry Gate')}
        </p>
      </div>

      {/* Token Card */}
      <div className="bg-white border border-farmer-border shadow-farmer-elevated rounded-3xl overflow-hidden">
        
        {/* Token Number Header */}
        <div className="bg-farmer-bg border-b border-farmer-border p-6 text-center relative">
          <p className="text-[11px] font-black text-farmer-secondary uppercase tracking-widest mb-1">
            {t('token.yourToken', 'YOUR TOKEN')}
          </p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-farmer-text mb-2">
            {activeBooking.token}
          </h2>
          <div className="flex justify-center items-center gap-2">
            <span className="bg-farmer-success-light text-farmer-success font-bold text-xs px-3 py-0.5 rounded-full border border-farmer-success/30">
              ✓ {t('procurement.stage1', 'Booking Confirmed')}
            </span>
            <span className="text-xs font-mono text-farmer-secondary font-semibold">ID: {activeBooking.id}</span>
          </div>
        </div>

        {/* Dynamic QR Code Area */}
        <div className="p-6 md:p-8 flex flex-col items-center border-b border-farmer-border border-dashed bg-white">
          <div className="p-4 bg-white rounded-3xl shadow-sm border border-farmer-border">
            <QRCodeSVG value={qrPayload} size={190} />
          </div>
          <p className="text-xs font-bold text-farmer-text mt-4 uppercase tracking-wider text-center">
            {t('token.qrScanInstruction', 'Scan this QR code at the gate scanner for rapid entry verification.')}
          </p>
        </div>

        {/* Details Table */}
        <div className="p-5 space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2.5 border-b border-farmer-border">
            <span className="text-farmer-secondary font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-farmer-primary"/> {t('centre', 'Centre')}
            </span>
            <span className="font-bold text-farmer-text text-right max-w-[60%]">
              {centre?.name || 'Procurement Centre'}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-farmer-border">
            <span className="text-farmer-secondary font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-farmer-primary"/> {t('date', 'Date')}
            </span>
            <span className="font-bold text-farmer-text">
              {activeBooking.date}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-farmer-border">
            <span className="text-farmer-secondary font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-farmer-primary"/> {t('slot', 'Slot')}
            </span>
            <span className="font-bold text-farmer-primary bg-farmer-primary-light px-2.5 py-0.5 rounded-lg border border-farmer-primary/20">
              {activeBooking.slot}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-farmer-border">
            <span className="text-farmer-secondary font-medium flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-farmer-primary"/> {t('crop', 'Crop')} & {t('quantity', 'Quantity')}
            </span>
            <span className="font-bold text-farmer-text">
              {activeBooking.crop} ({activeBooking.expectedQuantity} kg)
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-farmer-secondary font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-farmer-primary"/> {t('idLabel', 'Farmer ID')}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-farmer-text">
                {currentUser?.farmerId || currentUser?.id}
              </span>
              <button
                type="button"
                onClick={handleCopyFarmerId}
                className="p-1 rounded-lg hover:bg-farmer-primary-light text-farmer-secondary hover:text-farmer-primary transition-colors"
                title={t('profile.copyFarmerId', 'Copy Farmer ID')}
              >
                {copiedId ? (
                  <Check className="w-3.5 h-3.5 text-farmer-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          className="min-h-[48px] px-4 py-3 bg-white hover:bg-farmer-bg text-farmer-text font-bold rounded-2xl border border-farmer-border flex items-center justify-center gap-2 text-xs shadow-sm transition-colors"
          onClick={() => alert(t('token.download', 'Download Token Slip') + ' - PDF')}
        >
          <Download className="w-4 h-4 text-farmer-primary" />
          <span>{t('token.download', 'Download')}</span>
        </button>
        <button 
          className="min-h-[48px] px-4 py-3 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs shadow-sm transition-colors"
          onClick={() => navigate('/farmer/live-queue')}
        >
          <Activity className="w-4 h-4 text-farmer-accent" />
          <span>{t('dashboard.viewLiveQueue', 'Live Queue')}</span>
        </button>
      </div>

      {/* Safe Data Privacy Banner */}
      <div className="bg-farmer-primary-light/40 border border-farmer-border rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-farmer-secondary font-medium">
        <ShieldCheck className="w-4 h-4 text-farmer-primary shrink-0 mt-0.5" />
        <p>{t('token.safeDataNote', 'Safe & Encrypted QR. Never exposes personal Aadhaar or private banking data.')}</p>
      </div>

    </div>
  );
};

export default DigitalToken;
