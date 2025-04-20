import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../../../config';
import { ECONOMY_ENDPOINTS } from '../utils/config';
import { 
  calculateNetProfit, 
  calculateProfitMargin,
  calculateMonthlyGrowth,
  formatCurrency
} from '../utils/financialCalculations';
import {
  groupSalesByCategory,
  groupExpensesByCategory,
  mergeSalesAndExpensesByDate,
  createChartData,
  extractTopPerformers
} from '../utils/dataTransformations';

const useFinancialDashboard = (initialDateRange = { days: 30 }) => {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [timeFrame, setTimeFrame] = useState('day'); // 'day', 'week', 'month'
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    salesByCategory: {},
    expensesByCategory: {},
    timeSeriesData: [],
    chartData: { labels: [], datasets: [] },
    topProducts: [],
    topCategories: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate start and end dates based on the dateRange
  const calculateDateRange = useCallback(() => {
    const endDate = new Date();
    const startDate = new Date();
    
    if (dateRange.days) {
      startDate.setDate(endDate.getDate() - dateRange.days);
    } else if (dateRange.months) {
      startDate.setMonth(endDate.getMonth() - dateRange.months);
    } else if (dateRange.startDate && dateRange.endDate) {
      return {
        startDate: new Date(dateRange.startDate),
        endDate: new Date(dateRange.endDate)
      };
    }
    
    return { startDate, endDate };
  }, [dateRange]);

  // Fetch sales data
  const fetchSalesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate } = calculateDateRange();
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const response = await axios.get(`${API_URL}${ECONOMY_ENDPOINTS.SALES}`, {
        params: {
          startDate: startDateStr,
          endDate: endDateStr
        }
      });
      
      setSalesData(response.data);
      return response.data;
    } catch (err) {
      setError('Failed to fetch sales data');
      console.error('Error fetching sales data:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [calculateDateRange]);

  // Fetch expenses data
  const fetchExpensesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate } = calculateDateRange();
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const response = await axios.get(`${API_URL}${ECONOMY_ENDPOINTS.EXPENSES}`, {
        params: {
          startDate: startDateStr,
          endDate: endDateStr
        }
      });
      
      setExpensesData(response.data);
      return response.data;
    } catch (err) {
      setError('Failed to fetch expenses data');
      console.error('Error fetching expenses data:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [calculateDateRange]);

  // Process and transform data for dashboard
  const processData = useCallback((sales = salesData, expenses = expensesData) => {
    if (!sales.length && !expenses.length) return;

    const { startDate, endDate } = calculateDateRange();
    
    // Calculate totals
    const totalSales = sales.reduce((sum, sale) => sum + Number(sale.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const netProfit = calculateNetProfit(totalSales, totalExpenses);
    const profitMargin = calculateProfitMargin(totalSales, totalExpenses);
    
    // Group by category
    const salesByCategory = groupSalesByCategory(sales);
    const expensesByCategory = groupExpensesByCategory(expenses);
    
    // Create time series data
    const mergedData = mergeSalesAndExpensesByDate(
      sales,
      expenses,
      'date',
      'date',
      startDate,
      endDate
    );
    
    // Create chart data
    const chartData = createChartData(mergedData, timeFrame);
    
    // Extract top performers
    const topProducts = extractTopPerformers(sales, 'product', 5);
    const topCategories = extractTopPerformers(sales, 'category', 5);
    
    setDashboardData({
      totalSales,
      totalExpenses,
      netProfit,
      profitMargin,
      salesByCategory,
      expensesByCategory,
      timeSeriesData: mergedData,
      chartData,
      topProducts,
      topCategories
    });
  }, [salesData, expensesData, calculateDateRange, timeFrame]);

  // Fetch data and process
  const refreshDashboard = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const [sales, expenses] = await Promise.all([
        fetchSalesData(),
        fetchExpensesData()
      ]);
      
      processData(sales, expenses);
    } catch (err) {
      setError('Failed to refresh dashboard data');
      console.error('Error refreshing dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSalesData, fetchExpensesData, processData]);

  // Update date range
  const updateDateRange = useCallback((newDateRange) => {
    setDateRange(newDateRange);
  }, []);

  // Update time frame for charts
  const updateTimeFrame = useCallback((newTimeFrame) => {
    setTimeFrame(newTimeFrame);
    
    if (salesData.length || expensesData.length) {
      processData(); // Reprocess with new timeframe
    }
  }, [salesData, expensesData, processData]);

  // Initial data fetch
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // Reprocess data when date range changes
  useEffect(() => {
    refreshDashboard();
  }, [dateRange, refreshDashboard]);

  return {
    dashboardData,
    isLoading,
    error,
    updateDateRange,
    updateTimeFrame,
    refreshDashboard,
    setTimeFrame,
    formatCurrency
  };
};

export default useFinancialDashboard; 