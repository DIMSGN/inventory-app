import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../../../config';

/**
 * Custom hook for managing daily economy records
 * 
 * @returns {Object} Daily economy state and functions
 */
const useDailyEconomy = () => {
  const [dailyRecords, setDailyRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0
  });

  /**
   * Fetch all daily economy records
   */
  const fetchDailyRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/daily-economy`);
      setDailyRecords(response.data || []);
      calculateStats(response.data || []);
    } catch (err) {
      console.error('Error fetching daily records:', err);
      setError('Failed to load daily economy records');
      message.error('Failed to load daily economy records');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch daily economy records for a specific date range
   * 
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   */
  const fetchRecordsByDateRange = useCallback(async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/daily-economy/range/${startDate}/${endDate}`);
      setDailyRecords(response.data || []);
      calculateStats(response.data || []);
    } catch (err) {
      console.error('Error fetching daily records by date range:', err);
      setError('Failed to load daily economy records for the date range');
      message.error('Failed to load daily economy records for the date range');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch daily economy records for the current month
   */
  const fetchCurrentMonthRecords = useCallback(async () => {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
    await fetchRecordsByDateRange(startOfMonth, endOfMonth);
  }, [fetchRecordsByDateRange]);

  /**
   * Calculate summary statistics from daily records
   * 
   * @param {Array} records - Daily economy records to calculate stats from
   */
  const calculateStats = useCallback((records) => {
    if (!records || records.length === 0) {
      setStats({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0
      });
      return;
    }

    // Calculate totals for current month
    const totalRevenue = records.reduce((sum, record) => sum + (parseFloat(record.total_income) || 0), 0);
    const totalExpenses = records.reduce((sum, record) => 
      sum + (parseFloat(record.payroll_expenses) || 0) + (parseFloat(record.operating_expenses) || 0), 0);
    const netProfit = records.reduce((sum, record) => sum + (parseFloat(record.gross_profit) || 0), 0);
    
    setStats({
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    });
  }, []);

  /**
   * Add a new daily economy record
   * 
   * @param {Object} record - The record data to add
   * @returns {Promise<boolean>} Success status
   */
  const addDailyRecord = useCallback(async (record) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/daily-economy`, record);
      await fetchDailyRecords();
      message.success('Daily economy record added successfully');
      return true;
    } catch (err) {
      console.error('Error adding daily record:', err);
      setError('Failed to add daily economy record');
      message.error('Failed to add daily economy record');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDailyRecords]);

  /**
   * Update an existing daily economy record
   * 
   * @param {number|string} id - ID of the record to update
   * @param {Object} record - Updated record data
   * @returns {Promise<boolean>} Success status
   */
  const updateDailyRecord = useCallback(async (id, record) => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/daily-economy/${id}`, record);
      await fetchDailyRecords();
      message.success('Daily economy record updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating daily record:', err);
      setError('Failed to update daily economy record');
      message.error('Failed to update daily economy record');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDailyRecords]);

  /**
   * Delete a daily economy record
   * 
   * @param {number|string} id - ID of the record to delete
   * @returns {Promise<boolean>} Success status
   */
  const deleteDailyRecord = useCallback(async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/daily-economy/${id}`);
      await fetchDailyRecords();
      message.success('Daily economy record deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting daily record:', err);
      setError('Failed to delete daily economy record');
      message.error('Failed to delete daily economy record');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDailyRecords]);

  // Load daily records on component mount
  useEffect(() => {
    fetchCurrentMonthRecords();
  }, [fetchCurrentMonthRecords]);

  return {
    dailyRecords,
    loading,
    error,
    stats,
    fetchDailyRecords,
    fetchRecordsByDateRange,
    fetchCurrentMonthRecords,
    addDailyRecord,
    updateDailyRecord,
    deleteDailyRecord
  };
};

export default useDailyEconomy; 