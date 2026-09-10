import React, { useState } from 'react';
import { Sparkles, ChevronUp, ChevronDown, FastForward, CheckCircle, IndianRupee, RotateCcw, X, BellRing, UserX } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';

export const DemoSimulationDrawer = () => {
  const { state, setState, currentUser, resetDemo } = useAppContext();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const activeBooking = (state.bookings || []).find(
    b => b.farmerId === currentUser?.id && ['Confirmed', 'Processing', 'active'].includes(b.status)
  ) || null;

  const currentToken = activeBooking?.token || null;

  // 1. Advance Queue
  const handleAdvanceQueue = () => {
    const queue = state.queue || [];
    if (queue.length === 0) {
      showToast('Queue is empty');
      return;
    }

    const currentIdx = queue.findIndex(q => q.status === 'serving' || q.status === 'Serving');
    if (currentIdx !== -1 && currentIdx < queue.length - 1) {
      const nextQueue = [...queue];
      nextQueue[currentIdx].status = 'completed';
      nextQueue[currentIdx + 1].status = 'serving';

      const nextServing = nextQueue[currentIdx + 1];
      const isUserToken = currentToken && nextServing.token === currentToken;

      const newNotif = {
        id: `N-QUEUE-${Date.now()}`,
        userId: currentUser?.id,
        type: 'queue',
        title: isUserToken ? t('queue.calledMsg', 'Your token is now called!') : t('queue.approachingMsg', 'Queue advancing'),
        message: isUserToken
          ? `Token ${currentToken} is now called to Counter 1!`
          : `Queue advanced. Currently serving Token ${nextServing.token}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };

      setState(prev => ({
        ...prev,
        queue: nextQueue,
        notifications: currentUser?.id ? [newNotif, ...(prev.notifications || [])] : prev.notifications
      }));
      showToast(`Queue advanced: Serving ${nextServing.token}`);
    } else {
      showToast('Queue at end');
    }
  };

  // 2. Call User Token Directly
  const handleCallUserToken = () => {
    if (!currentToken) {
      showToast('No active booking to call. Please book a slot first.');
      return;
    }

    const nextQueue = (state.queue || []).map(q => {
      if (q.token === currentToken) return { ...q, status: 'serving' };
      return q;
    });

    const newNotif = {
      id: `N-CALLED-${Date.now()}`,
      userId: currentUser?.id,
      type: 'queue',
      title: t('queue.calledMsg', 'Your token is now called!'),
      message: `Token ${currentToken} is now called to Counter 1! Please proceed for weighing.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setState(prev => ({
      ...prev,
      queue: nextQueue,
      notifications: currentUser?.id ? [newNotif, ...(prev.notifications || [])] : prev.notifications
    }));
    showToast(`Token ${currentToken} Called to Counter 1`);
  };

  // 3. Simulate No-Show Handling
  const handleSimulateNoShow = () => {
    const queue = state.queue || [];
    const waitingEntry = queue.find(q => q.status === 'waiting' || q.status === 'Waiting');
    const absentToken = waitingEntry?.token || 'A100';

    const updatedQueue = queue.map(q => {
      if (q.token === absentToken) return { ...q, status: 'No-Show' };
      return q;
    });

    const newNotif = {
      id: `N-NOSHOW-${Date.now()}`,
      userId: currentUser?.id,
      type: 'queue',
      title: 'Queue Updated · No-Show Handled',
      message: `Token ${absentToken} was marked no-show after grace period. Your appointment slot remains stable.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setState(prev => ({
      ...prev,
      queue: updatedQueue,
      notifications: currentUser?.id ? [newNotif, ...(prev.notifications || [])] : prev.notifications
    }));
    showToast(`Token ${absentToken} marked No-Show. Slot remains stable.`);
  };

  // 4. Advance Procurement Stage
  const handleNextProcurementStage = () => {
    if (!activeBooking) {
      showToast('No active booking to simulate. Please book a slot first.');
      return;
    }

    const stages = [
      'booking_confirmed',
      'arrived_at_centre',
      'farmer_verification',
      'quality_check',
      'weighing',
      'procurement_completed',
      'payment_processing',
      'payment_completed'
    ];

    const targetBooking = activeBooking;
    if (!targetBooking) {
      showToast('No active booking found.');
      return;
    }

    const currentIndex = stages.indexOf(targetBooking.stage || 'booking_confirmed');
    const nextIndex = (currentIndex + 1) % stages.length;
    const nextStage = stages[nextIndex];

    const updatedBookings = (state.bookings || []).map(b => {
      if (b.id === targetBooking.id) {
        return {
          ...b,
          stage: nextStage,
          status: nextStage === 'payment_completed' ? 'completed' : 'active'
        };
      }
      return b;
    });

    const newNotif = {
      id: `N-STAGE-${Date.now()}`,
      userId: currentUser?.id,
      type: 'procurement',
      title: 'Procurement Stage Updated',
      message: `Your procurement progress moved to: ${nextStage.replace(/_/g, ' ').toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setState(prev => ({
      ...prev,
      bookings: updatedBookings,
      notifications: currentUser?.id ? [newNotif, ...(prev.notifications || [])] : prev.notifications
    }));
    showToast(`Stage: ${nextStage.replace(/_/g, ' ')}`);
  };

  // 5. Complete Payment
  const handleCompletePayment = () => {
    if (!currentUser) {
      showToast('Please log in first.');
      return;
    }

    const targetPayment = (state.payments || []).find(p => p.farmerId === currentUser?.id);
    const newPayment = {
      id: `PAY-${Date.now()}`,
      farmerId: currentUser.id,
      procurementId: `PRC-${Date.now()}`,
      amount: 12318.80,
      status: 'Paid',
      date: new Date().toISOString().slice(0, 10),
      transactionId: `TXN-${Date.now()}`,
      bankAccount: currentUser.bankAccount || 'XXXX XXXX 4589',
      ifsc: currentUser.ifsc || 'SBIN0001234'
    };

    const updatedPayments = targetPayment
      ? (state.payments || []).map(p => p.farmerId === currentUser.id ? { ...p, status: 'Paid' } : p)
      : [newPayment, ...(state.payments || [])];

    const newNotif = {
      id: `N-PAY-${Date.now()}`,
      userId: currentUser.id,
      type: 'payment',
      title: 'Payment Completed',
      message: '₹12,318.80 has been credited to your Aadhaar-linked bank account.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setState(prev => ({
      ...prev,
      payments: updatedPayments,
      notifications: [newNotif, ...(prev.notifications || [])]
    }));
    showToast('Payment Completed: ₹12,318.80');
  };

  return (
    <div className="fixed bottom-16 md:bottom-4 right-4 z-40 font-sans">
      {/* Toast Feedback */}
      {message && (
        <div className="mb-2 bg-farmer-text text-white text-xs font-semibold px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom border border-farmer-border/20">
          <CheckCircle className="w-4 h-4 text-farmer-accent" />
          <span>{message}</span>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-farmer-text hover:bg-black text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-farmer-elevated border border-farmer-border/30 transition-transform active:scale-95"
        aria-label="Toggle Demo Simulation Mode"
      >
        <Sparkles className="w-3.5 h-3.5 text-farmer-accent" />
        <span>DEMO MODE</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Slide-Up Demo Controls Drawer */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 bg-white border border-farmer-border rounded-3xl shadow-2xl p-4 animate-in fade-in zoom-in-95 text-farmer-text">
          <div className="flex items-center justify-between pb-3 border-b border-farmer-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-farmer-accent animate-ping" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-farmer-text">
                {t('demo.title', 'Demo Simulation Controls')}
              </h4>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-farmer-secondary hover:text-farmer-text p-1"
              aria-label="Close Demo Controls"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-farmer-secondary my-2.5 leading-tight font-medium">
            {t('demo.description', 'Simulate queue, procurement, and payment events for live presentations.')}
          </p>

          <div className="space-y-2">
            <button
              onClick={handleAdvanceQueue}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-farmer-primary-light hover:bg-farmer-primary-light/80 text-farmer-primary rounded-2xl text-xs font-bold transition-colors"
            >
              <span className="flex items-center gap-2">
                <FastForward className="w-3.5 h-3.5" />
                {t('demo.advanceQueue', 'Advance Queue (+1)')}
              </span>
              <span className="text-[10px] bg-farmer-primary text-white px-2 py-0.5 rounded font-mono">Queue</span>
            </button>

            <button
              onClick={handleCallUserToken}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-farmer-warning-light hover:bg-farmer-warning-light/80 text-farmer-warning rounded-2xl text-xs font-bold transition-colors"
            >
              <span className="flex items-center gap-2">
                <BellRing className="w-3.5 h-3.5" />
                {currentToken ? `Call Token ${currentToken}` : t('demo.callToken', 'Call Token')}
              </span>
              <span className="text-[10px] bg-farmer-warning text-white px-2 py-0.5 rounded font-mono">Call</span>
            </button>

            <button
              onClick={handleSimulateNoShow}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-farmer-bg hover:bg-farmer-primary-light text-farmer-text rounded-2xl text-xs font-bold transition-colors border border-farmer-border"
            >
              <span className="flex items-center gap-2">
                <UserX className="w-3.5 h-3.5 text-farmer-error" />
                {t('demo.simulateNoShow', 'Simulate No-Show')}
              </span>
              <span className="text-[10px] bg-farmer-secondary text-white px-2 py-0.5 rounded font-mono">Skip</span>
            </button>

            <button
              onClick={handleNextProcurementStage}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-farmer-primary-light hover:bg-farmer-primary-light/80 text-farmer-primary rounded-2xl text-xs font-bold transition-colors"
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                {t('demo.nextStage', 'Next Procurement Stage')}
              </span>
              <span className="text-[10px] bg-farmer-primary text-white px-2 py-0.5 rounded font-mono">Stage</span>
            </button>

            <button
              onClick={handleCompletePayment}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-farmer-success-light hover:bg-farmer-success-light/80 text-farmer-success rounded-2xl text-xs font-bold transition-colors"
            >
              <span className="flex items-center gap-2">
                <IndianRupee className="w-3.5 h-3.5" />
                {t('demo.completePayment', 'Complete Payment (₹12,318.80)')}
              </span>
              <span className="text-[10px] bg-farmer-success text-white px-2 py-0.5 rounded font-mono">Pay</span>
            </button>

            <button
              onClick={() => { resetDemo(); showToast('Demo data reset to initial'); }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-farmer-secondary hover:text-farmer-error hover:bg-farmer-error-light rounded-2xl text-xs font-bold transition-colors border border-dashed border-farmer-border mt-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('demo.resetDemo', 'Reset Demo State')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoSimulationDrawer;
