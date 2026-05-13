import React, { createContext, useContext, useState, useEffect } from 'react';

const FeatureContext = createContext(null);

export const FeatureProvider = ({ children }) => {
  const [aiEnabled, setAiEnabled] = useState(() => {
    const saved = localStorage.getItem('ai_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('ai_enabled', JSON.stringify(aiEnabled));
  }, [aiEnabled]);

  const toggleAI = () => setAiEnabled(prev => !prev);

  return (
    <FeatureContext.Provider value={{ aiEnabled, toggleAI }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatures = () => {
  const context = useContext(FeatureContext);
  if (context === null) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
};