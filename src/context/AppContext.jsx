import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/mockData';
import { loadState, saveState } from '../utils/storage';
import { MASTER_FARMER_REGISTRY } from '../portals/farmer/data/masterFarmers';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const loadedState = loadState('kisanqueue_state', initialData);
    
    // Migrate legacy 'F001' to official 'KIS-7F29A81C' and ensure farmerId is synced
    const migratedFarmers = (loadedState.farmers || initialData.farmers).map(f => {
      const canonicalId = f.id === 'F001' ? 'KIS-7F29A81C' : (f.farmerId || f.id);
      return {
        ...f,
        id: canonicalId,
        farmerId: canonicalId,
        isRegistered: f.isRegistered !== false // default to true for existing mock data
      };
    });

    // Merge in any MASTER_FARMER_REGISTRY items that don't exist yet
    MASTER_FARMER_REGISTRY.forEach(mf => {
      if (!migratedFarmers.some(f => f.farmerId === mf.farmerId)) {
        migratedFarmers.push({
          ...mf,
          id: mf.farmerId,
          isRegistered: false
        });
      }
    });
    const migratedBookings = (loadedState.bookings || initialData.bookings).map(b =>
      b.farmerId === 'F001' ? { ...b, farmerId: 'KIS-7F29A81C' } : b
    );
    const migratedQueue = (loadedState.queue || initialData.queue).map(q =>
      q.farmerId === 'F001' ? { ...q, farmerId: 'KIS-7F29A81C' } : q
    );
    const migratedProcurements = (loadedState.procurements || initialData.procurements || []).map(p =>
      p.farmerId === 'F001' ? { ...p, farmerId: 'KIS-7F29A81C' } : p
    );
    const migratedPayments = (loadedState.payments || initialData.payments || []).map(p =>
      p.farmerId === 'F001' ? { ...p, farmerId: 'KIS-7F29A81C' } : p
    );
    const migratedNotifications = (loadedState.notifications || initialData.notifications || []).map(n =>
      n.userId === 'F001' ? { ...n, userId: 'KIS-7F29A81C' } : n
    );
    const migratedComplaints = (loadedState.feedback || loadedState.complaints || initialData.complaints || []).map(c =>
      c.farmerId === 'F001' ? { ...c, farmerId: 'KIS-7F29A81C' } : c
    );

    return {
      ...loadedState,
      farmers: migratedFarmers,
      bookings: migratedBookings,
      queue: migratedQueue,
      procurements: migratedProcurements,
      payments: migratedPayments,
      notifications: migratedNotifications,
      feedback: migratedComplaints,
      activity: loadedState.activity || initialData.activity || [],
      mspConfig: loadedState.mspConfig || initialData.mspConfig || []
    };
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    const loadedUser = loadState('kisanqueue_user', null);
    if (loadedUser && (loadedUser.role === 'FARMER' || loadedUser.farmerId)) {
      const canonicalId = loadedUser.id === 'F001' ? 'KIS-7F29A81C' : (loadedUser.farmerId || loadedUser.id);
      return { ...loadedUser, id: canonicalId, farmerId: canonicalId };
    }
    if (loadedUser && loadedUser.id === 'F001') {
      return { ...loadedUser, id: 'KIS-7F29A81C' };
    }
    return loadedUser;
  });

  useEffect(() => {
    saveState('kisanqueue_state', state);
  }, [state]);

  useEffect(() => {
    saveState('kisanqueue_user', currentUser);
  }, [currentUser]);

  const login = (user) => {
    if (user && (user.role === 'FARMER' || user.farmerId)) {
      const canonicalId = user.farmerId || user.id;
      setCurrentUser({
        ...user,
        id: canonicalId,
        farmerId: canonicalId,
        role: 'FARMER'
      });
    } else {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const resetDemo = () => {
    setState(initialData);
    setCurrentUser(null);
    saveState('kisanqueue_state', initialData);
    saveState('kisanqueue_user', null);
  };

  const addCentre = (newCentre) => {
    setState(prev => ({
      ...prev,
      centres: [...(prev.centres || []), newCentre]
    }));
  };

  const updateComplaint = (complaintId, updates) => {
    setState(prev => {
      const currentComplaints = prev.feedback || [];
      return {
        ...prev,
        feedback: currentComplaints.map(cmp => 
          cmp.id === complaintId ? { ...cmp, ...updates } : cmp
        )
      };
    });
  };

  const updateMSP = (cropId, updates) => {
    setState(prev => {
      const currentMSP = prev.mspConfig || [];
      const exists = currentMSP.find(m => m.id === cropId);
      if (exists) {
        return {
          ...prev,
          mspConfig: currentMSP.map(m => m.id === cropId ? { ...m, ...updates } : m)
        };
      } else {
        return {
          ...prev,
          mspConfig: [...currentMSP, { id: cropId, ...updates }]
        };
      }
    });
  };

  const logActivity = (action, details, centreId = 'GLOBAL') => {
    setState(prev => {
      const currentLog = prev.activity || [];
      const user = currentUser?.name || 'System';
      const role = currentUser?.role || 'SYSTEM';
      
      const newEntry = {
        id: `ACT-${Date.now()}`,
        action,
        user,
        role,
        details,
        centreId,
        timestamp: new Date().toISOString()
      };
      
      const newLog = [newEntry, ...currentLog].slice(0, 100);
      return { ...prev, activity: newLog };
    });
  };

  const addNotification = ({ userId, type = 'procurement', title, message }) => {
    if (!userId || !title) return;
    setState(prev => {
      const currentNotifs = prev.notifications || [];
      const newNotif = {
        id: `N-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: userId,
        type,
        title,
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        read: false
      };
      return {
        ...prev,
        notifications: [newNotif, ...currentNotifs]
      };
    });
  };

  return (
    <AppContext.Provider value={{ state, setState, currentUser, login, logout, resetDemo, addCentre, updateComplaint, updateMSP, logActivity, addNotification }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
