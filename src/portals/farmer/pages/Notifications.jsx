import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useTranslation } from '../../../data/translations';
import { Bell, CheckCircle2, Calendar, Activity, Check, IndianRupee, Info } from 'lucide-react';

const Notifications = () => {
  const { state, setState, currentUser } = useAppContext();
  const { t } = useTranslation();
  
  const [filter, setFilter] = useState('All');

  const currentFarmerId = currentUser?.farmerId || currentUser?.id || 'KIS-7F29A81C';

  const notifications = (state.notifications || [])
    .filter(n => !n.userId || n.userId === currentFarmerId || n.farmerId === currentFarmerId);

  const filteredNotifications = filter === 'All' 
    ? notifications 
    : notifications.filter(n => (n.type || n.category || '').toLowerCase() === filter.toLowerCase());

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: (prev.notifications || []).map(n => 
        currentUser?.id && (n.userId === currentUser.id || n.farmerId === currentUser.id) ? { ...n, read: true } : n
      )
    }));
  };

  const getIcon = (type) => {
    const tLower = (type || '').toLowerCase();
    switch(tLower) {
      case 'booking': return <Calendar className="w-4 h-4 text-farmer-primary" />;
      case 'queue': return <Activity className="w-4 h-4 text-farmer-warning" />;
      case 'procurement': return <CheckCircle2 className="w-4 h-4 text-farmer-success" />;
      case 'payment': return <IndianRupee className="w-4 h-4 text-farmer-success" />;
      default: return <Info className="w-4 h-4 text-farmer-info" />;
    }
  };

  const getBg = (type) => {
    const tLower = (type || '').toLowerCase();
    switch(tLower) {
      case 'booking': return 'bg-farmer-primary-light';
      case 'queue': return 'bg-farmer-warning-light';
      case 'procurement': return 'bg-farmer-success-light';
      case 'payment': return 'bg-farmer-success-light';
      default: return 'bg-farmer-info-light';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-farmer-text">
            {t('notifications.title', 'Notification Centre')}
          </h1>
          <p className="text-xs md:text-sm text-farmer-secondary mt-0.5 font-medium">
            {t('dashboard.noActiveBookingDesc', 'Real-time alerts on your token status, queue position, and payouts.')}
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            className="min-h-[44px] px-4 py-2 bg-white hover:bg-farmer-primary-light text-farmer-primary text-xs font-bold rounded-xl border border-farmer-border shadow-sm flex items-center gap-1.5 transition-colors"
            onClick={markAllAsRead}
          >
            <Check className="w-4 h-4" />
            <span>{t('notifications.markAllRead', 'Mark all as read')} ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'All', label: t('notifications.all', 'All') },
          { id: 'Booking', label: t('notifications.booking', 'Booking') },
          { id: 'Queue', label: t('notifications.queue', 'Queue') },
          { id: 'Procurement', label: t('notifications.procurement', 'Procurement') },
          { id: 'Payment', label: t('notifications.payment', 'Payment') },
        ].map(cat => (
          <button 
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`min-h-[40px] px-4 py-2 rounded-2xl whitespace-nowrap transition-all ${
              filter === cat.id 
                ? 'bg-farmer-primary text-white font-bold shadow-sm' 
                : 'bg-white text-farmer-secondary border border-farmer-border hover:bg-farmer-bg'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-farmer-border shadow-farmer-card rounded-3xl overflow-hidden min-h-[300px]">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-farmer-border">
            {filteredNotifications.map(n => (
              <div 
                key={n.id} 
                className={`p-4 md:p-5 flex gap-3.5 transition-colors ${!n.read ? 'bg-farmer-primary-light/20' : 'hover:bg-farmer-bg'}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-farmer-border ${getBg(n.type || n.category)}`}>
                  {getIcon(n.type || n.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-farmer-secondary bg-farmer-bg px-2 py-0.5 rounded border border-farmer-border">
                      {n.type || n.category || 'Alert'}
                    </span>
                    <span className="text-[11px] text-farmer-secondary font-medium shrink-0">
                      {n.timestamp || 'Today'}
                    </span>
                  </div>
                  <h3 className={`text-xs md:text-sm font-bold ${!n.read ? 'text-farmer-text font-black' : 'text-farmer-text'}`}>
                    {n.title || n.message}
                  </h3>
                  {n.title && n.message && (
                    <p className="text-xs text-farmer-secondary mt-0.5 leading-relaxed font-medium">
                      {n.message}
                    </p>
                  )}
                </div>
                {!n.read && (
                  <span className="w-2.5 h-2.5 bg-farmer-primary rounded-full shrink-0 mt-2"></span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[280px] text-center p-6">
            <Bell className="w-10 h-10 text-farmer-secondary mb-2 opacity-50" />
            <h3 className="text-base font-bold text-farmer-text">
              {t('notifications.empty', 'No notifications right now.')}
            </h3>
            <p className="text-xs text-farmer-secondary mt-0.5 font-medium">
              {t('dashboard.noActiveBookingDesc', 'Your upcoming queue and payment updates will appear here.')}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Notifications;
