import { useState, useEffect } from 'react';
import { salesService } from '../../mockServices';

/**
 * Custom hook for fetching and filtering financial report data
 * @param {string} initialTab - Initial active tab ('daily' or 'monthly')
 * @returns {Object} Report data and related functions
 */
const useReportData = (initialTab = 'daily') => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  
  const [filteredData, setFilteredData] = useState({
    daily: [],
    monthly: []
  });

  // Helper function to filter data by date range
  const filterDataByDateRange = (data, startDate, endDate, dateField) => {
    if (!startDate && !endDate) return data;
    
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    
    return data.filter(item => {
      const itemDate = new Date(typeof dateField === 'function' 
        ? dateField(item) 
        : item[dateField]);
      return itemDate >= start && itemDate <= end;
    });
  };

  // Load data on initial render and when tab changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (activeTab === "daily" || activeTab === "both") {
          const dailyResponse = await salesService.getDailySummary();
          setDailyData(dailyResponse.data);
          setFilteredData(prev => ({
            ...prev,
            daily: filterDataByDateRange(
              dailyResponse.data, 
              dateFilter.startDate, 
              dateFilter.endDate, 
              'date'
            )
          }));
        }
        
        if (activeTab === "monthly" || activeTab === "both") {
          const monthlyResponse = await salesService.getMonthlySummary();
          setMonthlyData(monthlyResponse.data);
          
          // For monthly data, we create a date from year and month
          setFilteredData(prev => ({
            ...prev,
            monthly: filterDataByDateRange(
              monthlyResponse.data,
              dateFilter.startDate,
              dateFilter.endDate,
              row => `${row.year}-${String(row.month).padStart(2, '0')}-01`
            )
          }));
        }
      } catch (err) {
        console.error("Error fetching financial data:", err);
        setError("Failed to load financial data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, dateFilter.startDate, dateFilter.endDate]);

  // Apply date filter
  const handleApplyFilter = () => {
    setFilteredData({
      daily: filterDataByDateRange(dailyData, dateFilter.startDate, dateFilter.endDate, 'date'),
      monthly: filterDataByDateRange(
        monthlyData,
        dateFilter.startDate,
        dateFilter.endDate,
        row => `${row.year}-${String(row.month).padStart(2, '0')}-01`
      )
    });
  };

  // Clear date filter
  const handleClearFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
    setFilteredData({
      daily: dailyData,
      monthly: monthlyData
    });
  };

  return {
    activeTab,
    setActiveTab,
    isLoading,
    error,
    dateFilter,
    setDateFilter,
    filteredData,
    handleApplyFilter,
    handleClearFilter
  };
};

export default useReportData; 