import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
      const response = await axios.get('/api/units');
      setUnits(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch units');
      toast.error(`Error loading units: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addUnit = useCallback(async (unitData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/units', unitData);
      setUnits(prev => [...prev, response.data]);
      toast.success('Unit added successfully');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add unit');
      toast.error(`Error adding unit: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUnit = useCallback(async (id, unitData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/units/${id}`, unitData);
      const updatedUnit = response.data;
      
      setUnits(prev => 
        prev.map(unit => unit.id === id ? updatedUnit : unit)
      );
      
      toast.success('Unit updated successfully');
      return updatedUnit;
    } catch (err) {
      setError(err.message || 'Failed to update unit');
      toast.error(`Error updating unit: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUnit = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/units/${id}`);
      setUnits(prev => prev.filter(unit => unit.id !== id));
      toast.success('Unit deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete unit');
      toast.error(`Error deleting unit: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const value = {
    units,
    loading,
    error,
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