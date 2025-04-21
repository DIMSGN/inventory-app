import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { API_URL, STORAGE_KEYS } from '../config';
import { unitsService, toastService } from '../services';

const { showSuccess, showError } = toastService;

const UnitsContext = createContext();

export const useUnits = () => useContext(UnitsContext);

export const UnitsProvider = ({ children }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use unitsService instead of direct axios call
      const unitData = await unitsService.getUnits();
      // unitsService handles 404 errors and returns mock data if needed
      
      // Set the units - either from the API or the mock data from unitsService
      setUnits(unitData);
      localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(unitData));
      return unitData;
    } catch (err) {
      console.error('Error fetching units:', err);
      setError(err.message || 'Failed to fetch units');
      // Return empty array to prevent type errors
      setUnits([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addUnit = useCallback(async (unitData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await unitsService.addUnit(unitData);
      setUnits(prev => [...prev, response]);
      showSuccess('Unit added successfully');
      return response;
    } catch (err) {
      console.error('Error adding unit:', err);
      setError(err.message || 'Failed to add unit');
      showError(`Error adding unit: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUnit = useCallback(async (id, unitData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUnit = await unitsService.updateUnit(id, unitData);
      
      setUnits(prev => 
        prev.map(unit => unit.id === id ? updatedUnit : unit)
      );
      
      showSuccess('Unit updated successfully');
      return updatedUnit;
    } catch (err) {
      console.error('Error updating unit:', err);
      setError(err.message || 'Failed to update unit');
      showError(`Error updating unit: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUnit = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await unitsService.deleteUnit(id);
      setUnits(prev => prev.filter(unit => unit.id !== id));
      showSuccess('Unit deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting unit:', err);
      setError(err.message || 'Failed to delete unit');
      showError(`Error deleting unit: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Try to use cached data first for faster initial render
        const cachedUnits = localStorage.getItem(STORAGE_KEYS.UNITS);
        if (cachedUnits) {
          setUnits(JSON.parse(cachedUnits));
          console.log("Using cached units");
        }
      } catch (err) {
        console.error("Error loading cached units:", err);
      }
      
      // Then fetch fresh data
      await fetchUnits();
    };
    
    loadInitialData();
  }, [fetchUnits]);

  const value = {
    // State
    units,
    loading,
    error,
    
    // Operations
    fetchUnits,
    addUnit,
    updateUnit,
    deleteUnit
  };

  return (
    <UnitsContext.Provider value={value}>
      {children}
    </UnitsContext.Provider>
  );
};

export default UnitsContext; 