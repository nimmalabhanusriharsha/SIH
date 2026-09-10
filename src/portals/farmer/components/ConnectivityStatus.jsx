import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../../data/translations';

export const ConnectivityStatus = ({ isOnline, wasOffline, lastSyncTime }) => {
  const { t } = useTranslation();

  if (wasOffline && isOnline) {
    return (
      <div 
        role="status"
        aria-live="polite"
        className="bg-farmer-primary text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-sm animate-in fade-in slide-in-from-top duration-300"
      >
        <CheckCircle2 className="w-4 h-4 text-white" />
        <span>{t('connectivity.backOnline', '✓ Back online · Information synchronized')}</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div 
        role="alert"
        aria-live="assertive"
        className="bg-farmer-warning-light text-farmer-text border-b border-farmer-warning/40 px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-sm sticky top-0 z-30 animate-in fade-in"
      >
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-farmer-warning shrink-0" />
          <span>{t('connectivity.offlineNotice', 'Offline · Showing saved information')}</span>
        </div>
        <span className="text-[11px] text-farmer-secondary font-medium">
          {t('connectivity.lastUpdated', { time: lastSyncTime || '9:20 AM' })}
        </span>
      </div>
    );
  }

  // Small subtle indicator in top-bar area
  return null;
};

export default ConnectivityStatus;
