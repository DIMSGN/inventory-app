import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting and retrieving data in localStorage
 * 
 * @param {string} key - The localStorage key to use
 * @param {any} initialValue - The initial value if nothing is stored
 * @returns {Array} [value, setValue] - State and setter function
 */
const useLocalStorage = (key, initialValue) => {
  // Get saved value from localStorage or use initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  
  // State to store the value
  const [storedValue, setStoredValue] = useState(readValue);
  
  // Update localStorage when the state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  // Handle storage events (when localStorage is updated in another tab/window)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key) {
        setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key, initialValue]);
  
  return [storedValue, setStoredValue];
};

export default useLocalStorage; 