import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import useNetworkStatus from '../../../utils/useNetworkStatus';
import { 
  CheckCircle2, Clock, AlertTriangle, MapPin, 
  Sparkles, Activity, QrCode, ArrowRight, WifiOff, Calendar
} from 'lucide-react';

const LiveQueue = () => {
  const { state, currentUser } = useAppContext();
  const { t } = useTranslation();
  const { isOffline, lastSyncTime } = useNetworkStatus();
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
    || queue.find(q => q.status === 'serving' || q.status === 'Serving') 
    || { token: '-' };

  const userToken = activeBooking?.token;
  const myQueueEntry = activeBooking 
    ? (queue.find(q => q.token === userToken) || {
        token: userToken,
        position: queueForCentre.length > 0 ? queueForCentre.length : 1,
        waitTime: (queueForCentre.length > 0 ? queueForCentre.length : 1) * 6,
        status: 'Waiting'
      })
    : null;

  const currentServingToken = servingEntry.token || '-';
  const farmersAhead = myQueueEntry?.position ?? 0;
  const estimatedWait = myQueueEntry?.waitTime ?? 0;
  const isServing = myQueueEntry?.status === 'serving' || myQueueEntry?.status === 'Serving' || currentServingToken === userToken;

  const centre = activeBooking 
    ? ((state.centres || []).find(c => c.id === activeBooking.centreId) || (state.centres || [])[0])
    : (state.centres || [])[0];

  // Dynamic Pipeline: Build queue sequence for this centre
  const pipeline = queueForCentre.length > 0
    ? queueForCentre.map(q => ({
        token: q.token,
        status: q.token === userToken ? 'you' : q.status?.toLowerCase() === 'serving' ? 'serving' : 'waiting'
      }))
    : activeBooking
      ? [{ token: activeBooking.token, status: 'you' }]
      : [];

  if (!activeBooking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto p-8 bg-white rounded-3xl border border-farmer-border shadow-farmer-card font-sans">
        <div className="w-16 h-16 bg-farmer-primary-light rounded-2xl flex items-center justify-center mb-4 text-farmer-primary shadow-sm border border-farmer-primary/20">
          <Activity className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-farmer-text mb-2">
          {t('queue.noActiveQueue', 'No Active Booking in Queue')}
        </h2>
        <p className="text-xs text-farmer-secondary mb-6 font-medium leading-relaxed">
          {t('queue.noActiveQueueDesc', 'Book a procurement slot to join the live queue.')}
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 font-sans">
      
      {/* Offline Stale Data Notice */}
      {isOffline && (
        <div className="bg-farmer-warning-light border border-farmer-warning/40 text-farmer-text px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-farmer-warning shrink-0" />
            <span>{t('connectivity.lastKnownQueue', 'Offline · Showing last known queue')}</span>
          </div>
          <span className="text-[11px] text-farmer-secondary font-medium">
            {t('connectivity.lastUpdated', { time: lastSyncTime || '9:20 AM' })}
          </span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-farmer-text">
          {isOffline ? t('connectivity.lastKnownQueue', 'Last Known Queue') : t('queue.title', 'Live Queue Status')}
        </h1>
        <p className="text-xs md:text-sm text-farmer-secondary mt-1 font-medium">
          {centre?.name} · {t('centre.distance', { distance: centre?.distance || 4.2 })}
        </p>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-farmer-border shadow-farmer-card">
        
        {/* Status Callout Banner */}
        <div className="mb-6">
          {isServing ? (
            <div className="p-4 rounded-2xl bg-farmer-success-light border border-farmer-success/40 text-farmer-text flex items-center gap-3 animate-pulse">
              <CheckCircle2 className="w-6 h-6 text-farmer-success shrink-0" />
              <div>
                <p className="font-bold text-sm text-farmer-success">
                  {t('queue.calledMsg', 'Your token is now being called! Please proceed immediately to the procurement counter.')}
                </p>
                <p className="text-xs text-farmer-secondary mt-0.5 font-medium">
                  Counter 1 · Weighing & Verification
                </p>
              </div>
            </div>
          ) : farmersAhead <= 2 ? (
            <div className="p-4 rounded-2xl bg-farmer-warning-light border border-farmer-warning/40 text-farmer-text flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-farmer-warning shrink-0" />
              <div>
                <p className="font-bold text-sm text-farmer-warning">
                  {t('queue.approachingMsg', 'Your turn is approaching! Please make sure you are ready at the centre.')}
                </p>
                <p className="text-xs text-farmer-secondary mt-0.5 font-medium">
                  {t('dashboard.farmersAhead', { count: farmersAhead })}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-farmer-bg border border-farmer-border text-farmer-text flex items-center gap-3">
              <Clock className="w-5 h-5 text-farmer-primary shrink-0" />
              <div>
                <p className="font-semibold text-xs text-farmer-text">
                  {t('queue.waitingMsg', 'Queue is moving smoothly. You will receive an alert before your turn.')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4-Stat Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center">
          <div className="bg-farmer-bg p-4 rounded-2xl border border-farmer-border">
            <span className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider block mb-1">
              {t('queue.yourToken', 'Your Token')}
            </span>
            <span className="text-2xl md:text-3xl font-black text-farmer-primary">
              {userToken}
            </span>
          </div>

          <div className="bg-farmer-bg p-4 rounded-2xl border border-farmer-border">
            <span className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider block mb-1">
              {t('queue.servingNow', 'Serving Now')}
            </span>
            <span className="text-2xl md:text-3xl font-black text-farmer-text">
              {currentServingToken}
            </span>
          </div>

          <div className="bg-farmer-bg p-4 rounded-2xl border border-farmer-border">
            <span className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider block mb-1">
              {t('dashboard.farmersAhead', { count: farmersAhead }).replace(/[0-9]+\s*/, '')}
            </span>
            <span className="text-2xl md:text-3xl font-black text-farmer-text">
              {farmersAhead}
            </span>
          </div>

          <div className="bg-farmer-bg p-4 rounded-2xl border border-farmer-border">
            <span className="text-[10px] font-bold text-farmer-secondary uppercase tracking-wider block mb-1">
              {t('dashboard.estimatedWait', { minutes: '' }).replace(/:.*/, '')}
            </span>
            <span className="text-2xl md:text-3xl font-black text-farmer-warning">
              {estimatedWait} <span className="text-xs font-bold text-farmer-secondary">min</span>
            </span>
          </div>
        </div>

        {/* Clear Distinction: Booked Slot vs Expected Service Window */}
        <div className="bg-farmer-primary-light/40 border border-farmer-border rounded-2xl p-4 mb-6 space-y-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-farmer-primary shrink-0" />
              <span className="text-xs text-farmer-secondary font-medium">{t('queue.bookedSlot', 'Booked Slot')}:</span>
              <span className="font-bold text-farmer-text text-xs">{activeBooking.slot}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-farmer-primary shrink-0" />
              <span className="text-xs text-farmer-secondary font-medium">{t('queue.expectedService', 'Expected Service Window')}:</span>
              <span className="font-black text-farmer-primary text-xs bg-white px-2.5 py-0.5 rounded-md border border-farmer-border">
                10:05–10:20 AM
              </span>
            </div>
          </div>
          <p className="text-[11px] text-farmer-secondary leading-tight pt-1">
            {t('queue.bookedSlotNotice', { slot: activeBooking.slot })}
          </p>
        </div>

        {/* Visual Live Queue Sequence */}
        {pipeline.length > 0 && (
          <div className="bg-farmer-bg p-5 rounded-2xl border border-farmer-border mb-6">
            <h3 className="text-xs font-bold text-farmer-text uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>{t('queue.livePipeline', 'Live Queue Sequence')}</span>
              <span className="text-[11px] text-farmer-secondary font-medium">{centre?.activeCounters || 2} Active Counters</span>
            </h3>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {pipeline.map((item, idx) => {
                const isUser = item.token === userToken;
                const isNowServing = item.token === currentServingToken;
                
                return (
                  <React.Fragment key={item.token}>
                    {idx > 0 && <span className="text-farmer-secondary text-xs shrink-0">→</span>}
                    <div className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 text-center transition-all ${
                      isUser
                        ? 'bg-farmer-primary text-white ring-2 ring-farmer-accent shadow-md font-black scale-105'
                        : isNowServing
                          ? 'bg-farmer-success text-white shadow-sm font-black'
                          : 'bg-white text-farmer-text border border-farmer-border'
                    }`}>
                      <span className="block">{item.token}</span>
                      <span className="text-[9px] block uppercase font-bold opacity-90 mt-0.5">
                        {isUser ? t('queue.youAreHere', 'YOU') : isNowServing ? t('queue.servingNow', 'Serving') : `+${idx}`}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/farmer/token')}
            className="flex-1 sm:flex-initial min-h-[48px] px-6 py-3 bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text font-bold rounded-2xl border border-farmer-border flex items-center justify-center gap-2 text-xs md:text-sm transition-colors"
          >
            <QrCode className="w-4 h-4 text-farmer-primary" />
            <span>{t('dashboard.viewToken', 'View Digital Token')}</span>
          </button>
          <button 
            onClick={() => navigate('/farmer/procurement')}
            className="flex-1 sm:flex-initial min-h-[48px] px-6 py-3 bg-farmer-primary hover:bg-farmer-primary-dark text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs md:text-sm shadow-sm transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-farmer-accent" />
            <span>{t('dashboard.trackProcurement', 'Track Procurement')}</span>
          </button>
        </div>

      </div>

      {/* Smart Arrival Recommendation Card */}
      <div className="bg-white rounded-3xl p-6 border border-farmer-accent/40 shadow-farmer-card">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-2 rounded-xl bg-farmer-accent-light text-farmer-accent">
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="text-sm font-bold text-farmer-text">
            {t('queue.smartArrival', 'Smart Arrival Recommendation')}
          </h2>
        </div>

        <p className="text-xs md:text-sm font-semibold text-farmer-text mb-4 leading-relaxed">
          {t('queue.arrivalTip', { distance: centre?.distance || '4.2', travelTime: '18', leaveTime: '9:40 AM', arriveTime: '9:58 AM' })}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-farmer-bg p-3.5 rounded-xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('queue.leaveBy', { time: '' }).replace(/:.*/, '')}</span>
            <p className="font-black text-farmer-text mt-1 text-sm">9:40 AM</p>
          </div>
          <div className="bg-farmer-bg p-3.5 rounded-xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('queue.expectedArrival', { time: '' }).replace(/:.*/, '')}</span>
            <p className="font-black text-farmer-text mt-1 text-sm">9:58 AM</p>
          </div>
          <div className="bg-farmer-bg p-3.5 rounded-xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('centre.travelTime', { time: '' }).replace(/\s+.*/, '')}</span>
            <p className="font-black text-farmer-text mt-1 text-sm">18 min</p>
          </div>
          <div className="bg-farmer-bg p-3.5 rounded-xl border border-farmer-border">
            <span className="text-[10px] text-farmer-secondary uppercase font-bold block">{t('queue.expectedService', 'Service Window')}</span>
            <p className="font-black text-farmer-primary mt-1 text-sm">10:05–10:20 AM</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LiveQueue;
