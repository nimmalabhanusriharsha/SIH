import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { 
  Calendar, Clock, ChevronRight, Bell, QrCode, 
  Activity, PackageCheck, IndianRupee,
  Sparkles, CheckCircle2, ArrowRight, MapPin, Building, ShieldCheck
} from 'lucide-react';

const FarmerDashboard = () => {
  const { currentUser, state } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Active Booking strictly scoped to current logged-in farmer
  const activeBooking = (state.bookings || []).find(
    b => b.farmerId === currentUser?.id && ['Confirmed', 'Processing', 'active'].includes(b.status)
  ) || null;

  const queue = state.queue || [];
  const queueForCentre = activeBooking 
    ? queue.filter(q => q.centreId === activeBooking.centreId)
    : [];

  const servingEntry = queueForCentre.find(q => q.status === 'serving' || q.status === 'Serving') 
    || queue.find(q => q.status === 'serving' || q.status === 'Serving');

  const userQueueEntry = activeBooking 
    ? queue.find(q => q.token === activeBooking.token) 
    : null;

  const servingToken = servingEntry?.token || '-';
  const farmersAhead = userQueueEntry?.position ?? (queueForCentre.length > 0 ? queueForCentre.length : 1);
  const estimatedWait = userQueueEntry?.waitTime ?? (farmersAhead * 6);

  // Recent Notifications strictly scoped to current farmer
  const notifications = (state.notifications || [])
    .filter(n => n.userId === currentUser?.id)
    .slice(0, 2);
  
  // Recent Payment strictly scoped to current farmer
  const lastPayment = (state.payments || []).find(p => p.farmerId === currentUser?.id) || null;

  const centre = activeBooking 
    ? ((state.centres || []).find(c => c.id === activeBooking.centreId) || (state.centres || [])[0])
    : (state.centres || [])[0];

  const nearbyCentres = (state.centres || []).slice(0, 2);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-6 font-sans">
      
      {/* 1. HERO SECTION: ACTIVE PROCUREMENT OR NO-BOOKING ZERO STATE */}
      {activeBooking ? (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card relative overflow-hidden">
          
          <div className="relative z-10">
            {/* Top Tag & Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="bg-farmer-primary-light text-farmer-primary text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-farmer-primary/20">
                {t('dashboard.todaysProcurement', "TODAY'S PROCUREMENT")}
              </span>
              <span className="text-xs font-bold text-farmer-success flex items-center gap-1.5 bg-farmer-success-light px-3 py-1 rounded-full border border-farmer-success/30">
                <span className="w-2 h-2 rounded-full bg-farmer-success animate-pulse" />
                {activeBooking.stage 
                  ? t(`procurement.${activeBooking.stage}`, activeBooking.status)
                  : t('procurement.stage1', 'Booking Confirmed')}
              </span>
            </div>

            {/* Centre Name */}
            <h1 className="text-xl md:text-3xl font-black text-farmer-text mb-2">
              {centre?.name || 'Procurement Centre'}
            </h1>

            {/* Appointment Meta */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs md:text-sm text-farmer-secondary mb-6 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-farmer-primary shrink-0" /> {activeBooking.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-farmer-primary shrink-0" /> {t('queue.bookedSlot', 'Booked Slot')}: <strong className="text-farmer-text font-bold">{activeBooking.slot}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-farmer-primary shrink-0" /> {activeBooking.crop} ({activeBooking.expectedQuantity} kg)
              </span>
            </div>

            {/* 4-Metric Grid (Token, Serving, Ahead, Wait) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-farmer-bg p-4 md:p-5 rounded-2xl border border-farmer-border mb-6">
              <div>
                <p className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider mb-1">
                  {t('dashboard.yourToken', 'Your Token')}
                </p>
                <p className="text-2xl md:text-4xl font-black text-farmer-primary">
                  {activeBooking.token}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider mb-1">
                  {t('dashboard.servingNow', 'Currently Serving')}
                </p>
                <p className="text-2xl md:text-4xl font-black text-farmer-text">
                  {servingToken}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider mb-1">
                  {t('dashboard.farmersAhead', { count: farmersAhead }).replace(/[0-9]+\s*/, '')}
                </p>
                <p className="text-xl md:text-3xl font-black text-farmer-text">
                  {farmersAhead}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider mb-1">
                  {t('dashboard.estimatedWait', { minutes: '' }).replace(/:.*/, '')}
                </p>
                <p className="text-xl md:text-3xl font-black text-farmer-warning">
                  {estimatedWait} <span className="text-xs font-bold text-farmer-secondary">min</span>
                </p>
              </div>
            </div>

            {/* Expected Service Window & Slot Stability Indicator */}
            <div className="bg-farmer-primary-light/40 border border-farmer-border rounded-2xl p-3.5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-farmer-primary shrink-0" />
                <span className="text-farmer-text font-bold">
                  {t('dashboard.expectedServiceWindow', { start: '10:05 AM', end: '10:20 AM' })}
                </span>
              </div>
              <span className="text-farmer-secondary text-[11px] font-medium">
                {t('dashboard.bookedSlotStable', { slot: activeBooking.slot })}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate('/farmer/token')}
                className="flex-1 sm:flex-initial min-h-[48px] px-6 py-3 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm flex items-center justify-center gap-2 text-xs md:text-sm transition-colors"
              >
                <QrCode className="w-4 h-4 text-farmer-accent" />
                <span>{t('dashboard.viewToken', 'View Digital Token')}</span>
              </button>
              <button 
                onClick={() => navigate('/farmer/live-queue')}
                className="flex-1 sm:flex-initial min-h-[48px] px-6 py-3 bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text font-bold rounded-2xl border border-farmer-border flex items-center justify-center gap-2 text-xs md:text-sm transition-colors"
              >
                <Activity className="w-4 h-4 text-farmer-primary" />
                <span>{t('dashboard.viewLiveQueue', 'View Live Queue')}</span>
              </button>
              <button 
                onClick={() => navigate('/farmer/procurement')}
                className="flex-1 sm:flex-initial min-h-[48px] px-6 py-3 bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text font-bold rounded-2xl border border-farmer-border flex items-center justify-center gap-2 text-xs md:text-sm transition-colors"
              >
                <PackageCheck className="w-4 h-4 text-farmer-primary" />
                <span>{t('dashboard.trackProcurement', 'Track Procurement')}</span>
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* STATE 1: ZERO-STATE / NO ACTIVE BOOKING */
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-farmer-border shadow-farmer-card text-center relative overflow-hidden">
          <div className="w-20 h-20 bg-farmer-primary-light rounded-3xl flex items-center justify-center mx-auto mb-5 text-farmer-primary shadow-sm border border-farmer-primary/20">
            <Calendar className="w-10 h-10" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-farmer-text mb-2">
            {t('dashboard.noActiveBooking', 'No Active Booking')}
          </h2>
          <p className="text-xs md:text-sm text-farmer-secondary max-w-lg mx-auto mb-8 font-medium leading-relaxed">
            {t('dashboard.bookFirstSlotDesc', 'Book your first procurement slot to receive a token and track your live queue.')}
          </p>
          <button 
            onClick={() => navigate('/farmer/book-slot')}
            className="min-h-[52px] px-8 py-3.5 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl shadow-sm inline-flex items-center gap-2.5 text-sm transition-transform active:scale-98"
          >
            <Calendar className="w-4 h-4 text-farmer-accent" />
            <span>{t('dashboard.bookSlotNow', 'Book a Procurement Slot')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. SMART ARRIVAL TIME CARD (ONLY SHOWN WHEN ACTIVE BOOKING EXISTS) */}
      {activeBooking && (
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-farmer-accent/30 shadow-farmer-card relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-farmer-accent-light text-farmer-accent">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-farmer-text">
                {t('dashboard.smartArrival', 'Smart Arrival Recommendation')}
              </h3>
            </div>
            <span className="text-xs font-bold text-farmer-secondary bg-farmer-bg px-2.5 py-1 rounded-full border border-farmer-border">
              {t('centre.distance', { distance: centre?.distance || '4.2' })} · {t('centre.travelTime', { time: '18' })}
            </span>
          </div>

          <p className="text-xs md:text-sm font-semibold text-farmer-text mb-4 leading-relaxed">
            {t('queue.arrivalTip', { distance: centre?.distance || '4.2', travelTime: '18', leaveTime: '9:40 AM', arriveTime: '9:58 AM' })}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
              <span className="text-[10px] text-farmer-secondary font-bold uppercase block">{t('queue.leaveBy', { time: '' }).replace(/:.*/, '')}</span>
              <p className="font-black text-farmer-text mt-0.5 text-sm">9:40 AM</p>
            </div>
            <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
              <span className="text-[10px] text-farmer-secondary font-bold uppercase block">{t('queue.expectedArrival', { time: '' }).replace(/:.*/, '')}</span>
              <p className="font-black text-farmer-text mt-0.5 text-sm">9:58 AM</p>
            </div>
            <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
              <span className="text-[10px] text-farmer-secondary font-bold uppercase block">{t('centre.travelTime', { time: '' }).replace(/\s+.*/, '')}</span>
              <p className="font-black text-farmer-text mt-0.5 text-sm">18 min</p>
            </div>
            <div className="bg-farmer-bg p-3.5 rounded-2xl border border-farmer-border">
              <span className="text-[10px] text-farmer-secondary font-bold uppercase block">{t('queue.expectedService', 'Service Window')}</span>
              <p className="font-black text-farmer-primary mt-0.5 text-sm">10:05–10:20 AM</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. NEARBY CENTRES PREVIEW (HELPFUL FOR NEW FARMER WITH NO BOOKING) */}
      {!activeBooking && nearbyCentres.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-farmer-border shadow-farmer-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-farmer-border">
            <div>
              <h3 className="text-sm font-bold text-farmer-text flex items-center gap-2">
                <Building className="w-4 h-4 text-farmer-primary" />
                <span>{t('dashboard.nearbyCentres', 'Nearby Procurement Centres')}</span>
              </h3>
              <p className="text-xs text-farmer-secondary mt-0.5 font-medium">
                {t('dashboard.nearbyCentresDesc', 'Select a centre to view current capacity and book your slot')}
              </p>
            </div>
            <button 
              onClick={() => navigate('/farmer/find-centre')}
              className="text-xs font-bold text-farmer-primary hover:underline"
            >
              {t('view', 'View all')}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {nearbyCentres.map((c) => (
              <div key={c.id} className="p-4 bg-farmer-bg rounded-2xl border border-farmer-border flex flex-col justify-between gap-3">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-farmer-text">{c.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-farmer-success-light text-farmer-success border border-farmer-success/20">
                      {c.status || 'Normal'}
                    </span>
                  </div>
                  <p className="text-xs text-farmer-secondary font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-farmer-primary" />
                    <span>{c.district} · {c.distance || 4.2} km</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-farmer-border">
                  <span className="text-[11px] text-farmer-secondary font-medium">
                    {c.activeCounters || 3} Counters Active
                  </span>
                  <button 
                    onClick={() => navigate('/farmer/book-slot', { state: { preSelectedCentreId: c.id } })}
                    className="px-3 py-1.5 bg-farmer-primary hover:bg-farmer-primary-dark text-white rounded-xl font-bold text-xs transition-colors"
                  >
                    {t('bookSlot', 'Book Slot')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. QUICK ACTIONS GRID */}
      <div>
        <h3 className="text-xs font-bold text-farmer-secondary uppercase tracking-wider mb-3 px-1">
          {t('dashboard.quickActions', 'Quick Actions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: t('bookSlot', 'Book Slot'), icon: Calendar, path: '/farmer/book-slot', bg: 'bg-farmer-primary-light', color: 'text-farmer-primary' },
            { title: t('findCentre', 'Find Centre'), icon: Activity, path: '/farmer/find-centre', bg: 'bg-farmer-info-light', color: 'text-farmer-info' },
            { title: t('digitalToken', 'Digital Token'), icon: QrCode, path: '/farmer/token', bg: 'bg-farmer-accent-light', color: 'text-farmer-accent' },
            { title: t('liveQueue', 'Live Queue'), icon: Clock, path: '/farmer/live-queue', bg: 'bg-farmer-success-light', color: 'text-farmer-success' },
            { title: t('procurement', 'Procurement Track'), icon: PackageCheck, path: '/farmer/procurement', bg: 'bg-farmer-primary-light', color: 'text-farmer-primary' },
            { title: t('payments', 'Payments'), icon: IndianRupee, path: '/farmer/payments', bg: 'bg-farmer-success-light', color: 'text-farmer-success' },
          ].map((action, i) => (
            <button 
              key={i} 
              onClick={() => navigate(action.path)} 
              className="bg-white border border-farmer-border rounded-2xl p-4 flex flex-col items-center text-center hover:border-farmer-primary hover:shadow-farmer-card transition-all min-h-[100px] justify-center active:scale-98"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 ${action.bg} ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-farmer-text text-xs leading-tight">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. RECENT PAYMENT & NOTIFICATIONS ROW */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Recent Payment Card */}
        <div className="bg-white rounded-3xl p-6 border border-farmer-border shadow-farmer-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-farmer-text">
              {t('dashboard.recentPayment', 'Recent Payment')}
            </h3>
            {lastPayment && (
              <span className="text-xs font-bold text-farmer-success bg-farmer-success-light px-2.5 py-0.5 rounded-full border border-farmer-success/20">
                {t('payment.statusCompleted', 'Payment Completed')}
              </span>
            )}
          </div>

          {lastPayment ? (
            <>
              <p className="text-2xl md:text-4xl font-black text-farmer-text mb-1">
                ₹{Number(lastPayment.amount).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-farmer-secondary mb-4 font-medium">
                {t('procurement.mathExplanation', { netKg: 520, quintals: '5.2', rate: '2,369', total: lastPayment.amount })}
              </p>

              <div className="space-y-1.5 text-xs text-farmer-secondary border-t border-farmer-border pt-3 font-medium">
                <div className="flex justify-between">
                  <span>{t('payment.txnId', 'Transaction ID')}:</span>
                  <span className="font-mono font-bold text-farmer-text">{lastPayment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('payment.bank', 'Bank Account')}:</span>
                  <span className="font-mono font-bold text-farmer-text">{lastPayment.bankAccount || currentUser?.bankAccount || 'XXXX XXXX 4589'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('payment.paymentDate', 'Payment Date')}:</span>
                  <span className="font-bold text-farmer-text">{lastPayment.date}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/farmer/payments')}
                className="w-full mt-4 py-2.5 bg-farmer-bg hover:bg-farmer-primary-light text-farmer-primary font-bold rounded-xl text-xs border border-farmer-border flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
              >
                <span>{t('dashboard.viewPayment', 'View Payment Details')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="py-8 text-center space-y-2">
              <IndianRupee className="w-8 h-8 text-farmer-secondary mx-auto opacity-50" />
              <p className="text-xs font-bold text-farmer-text">
                {t('dashboard.noPaymentYet', 'No Payment Transactions Yet')}
              </p>
              <p className="text-[11px] text-farmer-secondary max-w-xs mx-auto font-medium">
                {t('dashboard.noPaymentYetDesc', 'Your payment settlements will be displayed here once your grain is procured.')}
              </p>
            </div>
          )}
        </div>

        {/* Recent Notifications Card */}
        <div className="bg-white rounded-3xl p-6 border border-farmer-border shadow-farmer-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-farmer-text">
              {t('notifications.title', 'Notifications')}
            </h3>
            <button 
              onClick={() => navigate('/farmer/notifications')}
              className="text-xs font-bold text-farmer-primary hover:underline"
            >
              {t('view', 'View all')}
            </button>
          </div>

          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((n, i) => (
                <div key={i} className="p-3.5 bg-farmer-bg rounded-2xl border border-farmer-border flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-farmer-primary-light text-farmer-primary shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-farmer-text truncate">{n.title}</p>
                    <p className="text-[11px] text-farmer-secondary line-clamp-2 mt-0.5 font-medium">{n.message}</p>
                    <span className="text-[10px] text-farmer-secondary opacity-75 mt-1 block font-medium">{n.timestamp || 'Today'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-farmer-secondary font-medium">
                {t('notifications.empty', 'No notifications right now.')}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default FarmerDashboard;
