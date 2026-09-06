import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/mockData';
import { loadState, saveState } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const loadedState = loadState('kisanqueue_state', initialData);
    // Ensure all required arrays exist even if loading from an older cached version
    return {
      ...loadedState,
      procurements: loadedState.procurements || initialData.procurements || [],
      activity: loadedState.activity || initialData.activity || [],
      feedback: loadedState.feedback || initialData.feedback || loadedState.complaints || initialData.complaints || []
    };
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    return loadState('kisanqueue_user', null);
  });

  useEffect(() => {
    saveState('kisanqueue_state', state);
  }, [state]);

  useEffect(() => {
    saveState('kisanqueue_user', currentUser);
  }, [currentUser]);

  const login = (user) => {
    setCurrentUser(user);
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

  return (
    <AppContext.Provider value={{ state, setState, currentUser, login, logout, resetDemo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
