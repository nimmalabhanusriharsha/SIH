import { useState, useEffect } from 'react';

/**
 * Custom hook to automatically monitor browser online/offline status.
 * Requires zero manual buttons or manual toggles.
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : true;
  });

  const [wasOffline, setWasOffline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Auto-dismiss the "Back online · Information synchronized" notification after 4 seconds
      const timer = setTimeout(() => {
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    lastSyncTime
  };
};

export default useNetworkStatus;
