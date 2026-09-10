import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { 
  CheckCircle2, Circle, Clock, ArrowRight,
  PackageCheck, MapPin, Calendar, ClipboardCheck, 
  Scale, FileSignature, IndianRupee, MessageSquareWarning, X
} from 'lucide-react';

const Procurement = () => {
  const { state, setState, currentUser } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Active Booking strictly scoped to current logged-in farmer
  const activeBooking = (state.bookings || []).find(
    b => b.farmerId === currentUser?.id && ['Confirmed', 'Processing', 'active'].includes(b.status)
  ) || null;

  const centre = activeBooking 
    ? ((state.centres || []).find(c => c.id === activeBooking.centreId) || (state.centres || [])[0])
    : null;

  const STAGES = [
    { id: 'booking_confirmed', label: t('procurement.stage1', 'Booking Confirmed'), time: '08:30 AM' },
    { id: 'arrived_at_centre', label: t('procurement.stage2', 'Arrived at Centre'), time: '09:05 AM' },
    { id: 'farmer_verification', label: t('procurement.stage3', 'Farmer Verification'), time: '09:15 AM' },
    { id: 'quality_check', label: t('procurement.stage4', 'Quality Check'), time: '09:25 AM' },
    { id: 'weighing', label: t('procurement.stage5', 'Weighing'), time: '09:40 AM' },
    { id: 'procurement_completed', label: t('procurement.stage6', 'Procurement Completed'), time: '09:55 AM' },
    { id: 'payment_processing', label: t('procurement.stage7', 'Payment Processing'), time: '10:15 AM' },
    { id: 'payment_completed', label: t('procurement.stage8', 'Payment Completed'), time: '11:00 AM' },
  ];

  // Map activeBooking stage to stage index
  const currentStageIndex = activeBooking 
    ? Math.max(0, STAGES.findIndex(s => s.id === (activeBooking.stage || 'booking_confirmed')))
    : 0;

  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeCategory, setDisputeCategory] = useState('Quality dispute');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [disputeSuccess, setDisputeSuccess] = useState(false);

  // Exact Domain Math based on booking quantity
  const netWeight = activeBooking?.expectedQuantity || 520;
  const tareWeight = 20;
  const grossWeight = netWeight + tareWeight;
  const quintals = (netWeight / 100).toFixed(1);
  const mspRate = 2369;
  const totalAmount = (quintals * mspRate).toFixed(2);

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      id: `CMP-${Date.now()}`,
      farmerId: currentUser?.id,
      tokenRef: activeBooking?.token || '',
      type: disputeCategory,
      description: disputeDesc || 'Dispute raised regarding procurement measurement.',
      status: 'Under Review',
      date: new Date().toLocaleDateString()
    };

    setState(prev => ({
      ...prev,
      feedback: [newComplaint, ...(prev.feedback || [])]
    }));

    setDisputeSuccess(true);
    setTimeout(() => {
      setDisputeSuccess(false);
      setShowDisputeModal(false);
      setDisputeDesc('');
    }, 2000);
  };

  if (!activeBooking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto p-8 bg-white rounded-3xl border border-farmer-border shadow-farmer-card font-sans">
        <div className="w-16 h-16 bg-farmer-primary-light rounded-2xl flex items-center justify-center mb-4 text-farmer-primary shadow-sm border border-farmer-primary/20">
          <PackageCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-farmer-text mb-2">
          {t('procurement.noActiveProcurement', 'No Active Procurement')}
        </h2>
        <p className="text-xs text-farmer-secondary mb-6 font-medium leading-relaxed">
          {t('procurement.noActiveProcurementDesc', 'Your procurement process will appear here after you complete a slot booking.')}
        </p>
        <button 
          className="min-h-[48px] px-6 py-2.5 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm inline-flex items-center gap-2 text-sm transition-colors"
          onClick={() => navigate('/farmer/book-slot')}
        >
          <span>{t('dashboard.bookSlotNow', 'Book a Procurement Slot')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-farmer-text">
          {t('procurement.title', 'Procurement Tracking')}
        </h1>
        <p className="text-xs md:text-sm text-farmer-secondary mt-1 font-medium">
          {centre?.name} · {t('dashboard.yourToken', 'Your Token')}: <strong className="text-farmer-primary font-black">{activeBooking.token}</strong>
        </p>
      </div>

      {/* 1. 8-STAGE VERTICAL TIMELINE CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-farmer-border">
          <h2 className="text-sm font-bold text-farmer-text uppercase tracking-wider">
            {t('procurement.timeline', '8-Stage Procurement Timeline')}
          </h2>
          <span className="text-xs font-bold text-farmer-primary bg-farmer-primary-light px-3 py-1 rounded-full border border-farmer-primary/20">
            {STAGES[currentStageIndex]?.label}
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-farmer-border">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.id} className="relative flex items-start gap-4">
                
                {/* Timeline Node Dot */}
                <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isCompleted 
                    ? 'bg-farmer-success text-white shadow-sm ring-2 ring-farmer-success/20' 
                    : isCurrent 
                      ? 'bg-farmer-primary text-white ring-4 ring-farmer-primary/20 shadow-md animate-pulse' 
                      : 'bg-farmer-bg text-farmer-secondary border border-farmer-border'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 fill-current" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-sm font-bold ${
                      isCurrent 
                        ? 'text-farmer-primary font-black text-base' 
                        : isCompleted 
                          ? 'text-farmer-text font-bold' 
                          : 'text-farmer-secondary opacity-60 font-medium'
                    }`}>
                      {stage.label}
                    </h3>
                    <span className="text-[11px] text-farmer-secondary font-medium">
                      {isCompleted || isCurrent ? stage.time : '—'}
                    </span>
                  </div>

                  {isCurrent && (
                    <p className="text-xs font-semibold text-farmer-primary mt-1 bg-farmer-primary-light/60 p-2 rounded-xl border border-farmer-primary/20 inline-block">
                      ✓ {t('procurement.stageActive', 'Active stage in progress')} @ Counter 1
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 2. QUALITY CHECK INFORMATION (READ-ONLY) */}
      <div className="bg-white rounded-3xl p-6 border border-farmer-border shadow-farmer-card">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-farmer-border">
          <div>
            <h3 className="text-sm font-bold text-farmer-text">
              {t('procurement.qualityDetails', 'Quality Information (Read-Only)')}
            </h3>
            <p className="text-xs text-farmer-secondary mt-0.5 font-medium">
              {t('procurement.qualityReadOnlyNote', 'Official quality parameters verified by the Certified Quality Assayer.')}
            </p>
          </div>
          <span className="text-xs font-bold text-farmer-success bg-farmer-success-light px-2.5 py-0.5 rounded-full border border-farmer-success/20">
            FAQ Grade Passed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('crop', 'Crop')}</span>
            <p className="font-black text-farmer-text mt-0.5 text-sm">{activeBooking.crop}</p>
          </div>
          <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('procurement.grade', 'Grade')}</span>
            <p className="font-black text-farmer-text mt-0.5 text-sm">FAQ Grade</p>
          </div>
          <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('procurement.moisture', 'Moisture')}</span>
            <p className="font-black text-farmer-primary mt-0.5 text-sm">13.2% (Standard &lt; 14%)</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowDisputeModal(true)}
            className="text-xs font-bold text-farmer-warning hover:text-farmer-error flex items-center gap-1.5 transition-colors p-1"
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>{t('procurement.raiseDispute', 'Raise Quality Dispute / Complaint')}</span>
          </button>
        </div>
      </div>

      {/* 3. WEIGHING INFORMATION */}
      <div className="bg-white rounded-3xl p-6 border border-farmer-border shadow-farmer-card">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-farmer-border">
          <h3 className="text-sm font-bold text-farmer-text">
            {t('procurement.weighingDetails', 'Weighing Information')}
          </h3>
          <span className="text-xs font-mono font-bold text-farmer-secondary bg-farmer-bg px-2 py-0.5 rounded border border-farmer-border">Scale #1</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('procurement.grossWeight', 'Gross Weight')}</span>
            <p className="font-black text-farmer-text mt-0.5 text-sm">{grossWeight} kg</p>
          </div>
          <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('procurement.tareWeight', 'Tare Weight')}</span>
            <p className="font-black text-farmer-text mt-0.5 text-sm">{tareWeight} kg</p>
          </div>
          <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('procurement.netWeight', 'Net Weight')}</span>
            <p className="font-black text-farmer-primary mt-0.5 text-sm">{netWeight} kg ({quintals} Q)</p>
          </div>
        </div>

        <div className="bg-farmer-bg p-4 rounded-2xl border border-farmer-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-[11px] font-bold text-farmer-secondary block">{t('procurement.mspRate', 'MSP Rate')}</span>
            <p className="font-bold text-farmer-text text-sm">₹{mspRate.toLocaleString()} / Quintal</p>
            <p className="text-xs text-farmer-secondary mt-0.5 font-medium">
              {t('procurement.mathExplanation', { netKg: netWeight, quintals, rate: mspRate.toLocaleString(), total: totalAmount })}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-[11px] font-bold text-farmer-secondary uppercase tracking-wider block">{t('procurement.totalAmount', 'Total Amount')}</span>
            <p className="text-2xl font-black text-farmer-primary">₹{totalAmount}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => navigate('/farmer/payments')}
            className="min-h-[48px] px-6 py-2.5 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm inline-flex items-center gap-2 text-xs md:text-sm transition-colors"
          >
            <span>{t('dashboard.viewPayment', 'View Payment Details')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DISPUTE / COMPLAINT MODAL */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-farmer-border shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-farmer-border">
              <h3 className="font-bold text-farmer-text text-sm">
                {t('feedback.submitComplaint', 'Submit a Complaint')}
              </h3>
              <button onClick={() => setShowDisputeModal(false)} className="text-farmer-secondary hover:text-farmer-text p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {disputeSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-farmer-success mx-auto" />
                <p className="font-bold text-farmer-text text-sm">
                  {t('feedback.successMsg', 'Complaint submitted successfully! Mandal Agricultural Officer assigned.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                    {t('feedback.category', 'Complaint Category')}
                  </label>
                  <select
                    value={disputeCategory}
                    onChange={(e) => setDisputeCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-farmer-border bg-farmer-bg font-semibold text-farmer-text text-xs"
                  >
                    <option value="Quality dispute">{t('feedback.catQuality', 'Quality dispute')}</option>
                    <option value="Weighing issue">{t('feedback.catWeighing', 'Weighing issue')}</option>
                    <option value="Staff behaviour">{t('feedback.catStaff', 'Staff behaviour')}</option>
                    <option value="Long waiting time">{t('feedback.catWait', 'Long waiting time')}</option>
                    <option value="Other">{t('feedback.catOther', 'Other')}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-farmer-text uppercase tracking-wider block mb-1.5">
                    {t('feedback.description', 'Describe your issue in detail')}
                  </label>
                  <textarea
                    rows={3}
                    value={disputeDesc}
                    onChange={(e) => setDisputeDesc(e.target.value)}
                    placeholder="Enter details of your dispute..."
                    className="w-full p-3 rounded-xl border border-farmer-border bg-farmer-bg text-farmer-text text-xs"
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-farmer-border text-farmer-secondary font-bold"
                  >
                    {t('cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-farmer-primary text-white font-bold shadow-sm"
                  >
                    {t('feedback.submitBtn', 'Submit Complaint')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Procurement;
