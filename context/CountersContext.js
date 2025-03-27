import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CountersContext = createContext();

export const CountersProvider = ({ children }) => {
  const [isCountersVisible, setIsCountersVisible] = useState(false);

  // Load the saved state from AsyncStorage on mount
  useEffect(() => {
    const loadVisibility = async () => {
      const savedVisibility = await AsyncStorage.getItem('countersVisibility');
      if (savedVisibility !== null) {
        setIsCountersVisible(JSON.parse(savedVisibility));
      }
    };
    loadVisibility();
  }, []);

  // Save the state to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem('countersVisibility', JSON.stringify(isCountersVisible));
  }, [isCountersVisible]);

  return (
    <CountersContext.Provider value={{ isCountersVisible, setIsCountersVisible }}>
      {children}
    </CountersContext.Provider>
  );
};