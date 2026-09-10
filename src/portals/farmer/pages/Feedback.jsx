import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { MessageSquareWarning, Send, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

const Feedback = () => {
  const { state, setState, currentUser } = useAppContext();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('complaint'); // 'complaint', 'history'
  
  const activeBooking = (state.bookings || []).find(
    b => b.farmerId === currentUser?.id && ['Confirmed', 'Processing', 'active'].includes(b.status)
  ) || null;

  // Complaint form state
  const [complaintCategory, setComplaintCategory] = useState('Long waiting time');
  const [tokenRef, setTokenRef] = useState(activeBooking?.token || '');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'Long waiting time', label: t('feedback.catWait', 'Long waiting time') },
    { id: 'Payment delay', label: t('feedback.catPayment', 'Payment delay') },
    { id: 'Quality dispute', label: t('feedback.catQuality', 'Quality dispute') },
    { id: 'Weighing issue', label: t('feedback.catWeighing', 'Weighing issue') },
    { id: 'Staff behaviour', label: t('feedback.catStaff', 'Staff behaviour') },
    { id: 'Booking problem', label: t('feedback.catBooking', 'Booking issue') },
    { id: 'Other', label: t('feedback.catOther', 'Other') },
  ];

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    
    const newComplaint = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: currentUser?.farmerId || currentUser?.id || 'FARM-9021',
      farmerName: currentUser?.name || 'Ramesh Kumar',
      name: currentUser?.name || 'Ramesh Kumar',
      userType: 'Farmer',
      centreId: activeBooking?.centreId || 'C001',
      tokenRef: tokenRef,
      type: complaintCategory,
      description: complaintDesc,
      status: 'Open',
      date: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      feedback: [newComplaint, ...(prev.feedback || [])]
    }));

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComplaintDesc('');
      setActiveTab('history');
    }, 1500);
  };

  const myComplaints = (state.feedback || []).filter(c => c.farmerId === currentUser?.id);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-farmer-text">
          {t('feedback.title', 'Help & Complaints')}
        </h1>
        <p className="text-xs md:text-sm text-farmer-secondary mt-0.5 font-medium">
          {t('dashboard.noActiveBookingDesc', 'Direct grievance redressal system with 24-hour Mandal Agricultural Officer resolution.')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-farmer-bg p-1.5 rounded-2xl border border-farmer-border text-xs font-bold">
        <button 
          className={`flex-1 py-2.5 rounded-xl transition-all min-h-[44px] ${
            activeTab === 'complaint' 
              ? 'bg-white text-farmer-primary shadow-sm font-black' 
              : 'text-farmer-secondary hover:text-farmer-text font-semibold'
          }`}
          onClick={() => setActiveTab('complaint')}
        >
          {t('feedback.submitComplaint', 'Submit a Complaint')}
        </button>
        <button 
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
            activeTab === 'history' 
              ? 'bg-white text-farmer-primary shadow-sm font-black' 
              : 'text-farmer-secondary hover:text-farmer-text font-semibold'
          }`}
          onClick={() => setActiveTab('history')}
        >
          <span>{t('feedback.historyTitle', 'Your Complaints')}</span>
          {myComplaints.length > 0 && (
            <span className="bg-farmer-primary-light text-farmer-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
              {myComplaints.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: SUBMIT A COMPLAINT */}
      {activeTab === 'complaint' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-farmer-border">
            <MessageSquareWarning className="w-5 h-5 text-farmer-warning" />
            <h2 className="text-sm font-bold text-farmer-text">
              {t('feedback.submitComplaint', 'Submit a Complaint')}
            </h2>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-farmer-success mx-auto" />
              <h3 className="text-base font-bold text-farmer-text">
                {t('feedback.successMsg', 'Complaint submitted successfully! Mandal Agricultural Officer assigned for resolution.')}
              </h3>
            </div>
          ) : (
            <form onSubmit={handleSubmitComplaint} className="space-y-4 text-xs">
              
              <div>
                <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-2">
                  {t('feedback.category', 'Complaint Category')} *
                </label>
                <select 
                  className="w-full h-12 rounded-2xl border border-farmer-border bg-farmer-bg px-4 font-semibold text-farmer-text text-sm focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value)}
                  required
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-2">
                  {t('token.yourToken', 'Booking / Token Reference')}
                </label>
                <input 
                  type="text"
                  value={tokenRef}
                  onChange={(e) => setTokenRef(e.target.value)}
                  placeholder="e.g. Booking ID or Token"
                  className="w-full h-12 rounded-2xl border border-farmer-border bg-farmer-bg px-4 font-semibold text-farmer-text text-sm focus:outline-none focus:ring-2 focus:ring-farmer-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-farmer-text uppercase tracking-wider block mb-2">
                  {t('feedback.description', 'Describe your issue in detail')} *
                </label>
                <textarea 
                  rows={4}
                  className="w-full rounded-2xl border border-farmer-border bg-farmer-bg p-4 font-medium text-farmer-text text-sm focus:outline-none focus:ring-2 focus:ring-farmer-primary resize-none"
                  placeholder="Explain your problem clearly..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  required
                />
              </div>

              <div className="bg-farmer-primary-light/40 border border-farmer-border rounded-2xl p-4 flex gap-2.5 text-xs text-farmer-secondary font-medium">
                <ShieldCheck className="w-5 h-5 text-farmer-primary shrink-0 mt-0.5" />
                <span>Complaints are escalated directly to the District Mandal Agricultural Grievance Cell for verified resolution.</span>
              </div>

              <button 
                type="submit" 
                className="w-full min-h-[50px] bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t('feedback.submitBtn', 'Submit Complaint')}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: COMPLAINT HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-farmer-border shadow-farmer-card overflow-hidden">
          {myComplaints.length > 0 ? (
            <div className="divide-y divide-farmer-border">
              {myComplaints.map(c => (
                <div key={c.id} className="p-5 md:p-6 space-y-2 hover:bg-farmer-bg/50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-farmer-text text-sm">{c.type}</span>
                      <span className="text-xs font-mono text-farmer-secondary font-semibold">#{c.id}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      c.status === 'Resolved' 
                        ? 'bg-farmer-success-light text-farmer-success border border-farmer-success/30' 
                        : 'bg-farmer-warning-light text-farmer-warning border border-farmer-warning/30'
                    }`}>
                      {c.status === 'Resolved' 
                        ? t('feedback.statusResolved', 'Resolved') 
                        : t('feedback.statusUnderReview', 'Under Review')}
                    </span>
                  </div>

                  <p className="text-xs text-farmer-secondary leading-relaxed font-medium">
                    {c.description}
                  </p>

                  <p className="text-[11px] text-farmer-secondary font-medium opacity-75">
                    {t('date', 'Date')}: {c.date || 'Today'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <AlertCircle className="w-10 h-10 text-farmer-secondary mx-auto mb-2 opacity-50" />
              <h3 className="text-base font-bold text-farmer-text">
                {t('notifications.empty', 'No complaints filed yet.')}
              </h3>
              <p className="text-xs text-farmer-secondary mt-1 font-medium">
                Your submitted grievances and MAO resolution status will be displayed here.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Feedback;
