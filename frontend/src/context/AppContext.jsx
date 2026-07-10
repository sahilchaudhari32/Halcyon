import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const [subscription, setSubscription] = useState(() => {
    return localStorage.getItem('subscription') || 'free';
  });

  const [limitCount, setLimitCount] = useState(() => {
    const saved = localStorage.getItem('limitCount');
    return saved ? parseInt(saved, 10) : 0;
  });

  const maxLogs = 3;

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('subscription', subscription);
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem('limitCount', limitCount.toString());
  }, [limitCount]);

  const t = (path, replaceMap = {}) => {
    const keys = path.split('.');
    let currentObj = translations[language];
    for (const key of keys) {
      if (!currentObj || currentObj[key] === undefined) {
        // Fallback to English if key missing in translation
        let fallbackObj = translations['en'];
        for (const fkey of keys) {
          if (!fallbackObj || fallbackObj[fkey] === undefined) {
            return path;
          }
          fallbackObj = fallbackObj[fkey];
        }
        currentObj = fallbackObj;
        break;
      }
      currentObj = currentObj[key];
    }
    if (Array.isArray(currentObj)) {
      return currentObj;
    }
    if (typeof currentObj === 'string') {
      let result = currentObj;
      Object.entries(replaceMap).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, v);
      });
      return result;
    }
    return currentObj || path;
  };

  const upgrade = () => {
    setSubscription('pro');
  };

  const downgrade = () => {
    setSubscription('free');
    setLimitCount(0);
  };

  const incrementLimit = () => {
    if (subscription === 'free') {
      setLimitCount(prev => prev + 1);
    }
  };

  const hasLimitReached = () => {
    return subscription === 'free' && limitCount >= maxLogs;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        subscription,
        upgrade,
        downgrade,
        limitCount,
        incrementLimit,
        hasLimitReached,
        maxLogs,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
