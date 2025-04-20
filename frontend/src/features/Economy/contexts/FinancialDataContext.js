import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_FINANCIAL_DATA } from '../utils/mockData';
import financialService from '../services/financialService';

// Create context
const FinancialDataContext = createContext();

export const useFinancialData = () => useContext(FinancialDataContext);

export const FinancialDataProvider = ({ children }) => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isModified, setIsModified] = useState(false);

  // Load financial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await financialService.getFinancialData(year);
        setFinancialData(data);
        setIsModified(false);
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError('Failed to load financial data');
        // Use mock data if API fails
        setFinancialData(MOCK_FINANCIAL_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  // Update cell value
  const updateCellValue = (sectionId, rowId, monthIndex, newValue) => {
    if (!financialData) return;

    setFinancialData(prevData => {
      // Create a deep copy to avoid direct state mutation
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Handle different sections
      if (sectionId === 'sales') {
        const rowIndex = newData.sales.findIndex(row => row.id === rowId);
        if (rowIndex !== -1) {
          newData.sales[rowIndex].months[monthIndex] = Number(newValue);
          // Recalculate totals
          newData.sales[rowIndex].total = newData.sales[rowIndex].months.reduce((sum, val) => sum + val, 0);
        }
      } else if (sectionId === 'expenses') {
        // Determine which expense category
        const categories = ['costOfGoods', 'operational', 'payroll', 'utilities', 'otherExpenses'];
        
        for (const category of categories) {
          const rowIndex = newData.expenses[category].findIndex(row => row.id === rowId);
          if (rowIndex !== -1) {
            newData.expenses[category][rowIndex].months[monthIndex] = Number(newValue);
            // Recalculate totals
            newData.expenses[category][rowIndex].total = newData.expenses[category][rowIndex].months.reduce((sum, val) => sum + val, 0);
            break;
          }
        }
      }
      
      // Recalculate summary
      updateSummary(newData);
      setIsModified(true);
      return newData;
    });
  };

  // Update summary calculations
  const updateSummary = (data) => {
    // Calculate total sales
    const totalSales = {
      months: Array(12).fill(0),
      total: 0
    };
    
    data.sales.forEach(row => {
      row.months.forEach((value, idx) => {
        totalSales.months[idx] += value;
      });
    });
    totalSales.total = totalSales.months.reduce((sum, val) => sum + val, 0);
    
    // Calculate cost of goods
    const totalCostOfGoods = {
      months: Array(12).fill(0),
      total: 0
    };
    
    data.expenses.costOfGoods.forEach(row => {
      row.months.forEach((value, idx) => {
        totalCostOfGoods.months[idx] += value;
      });
    });
    totalCostOfGoods.total = totalCostOfGoods.months.reduce((sum, val) => sum + val, 0);
    
    // Calculate other expense categories
    const expenseCategories = ['operational', 'payroll', 'utilities', 'otherExpenses'];
    const categoryTotals = {};
    
    expenseCategories.forEach(category => {
      categoryTotals[category] = {
        months: Array(12).fill(0),
        total: 0
      };
      
      data.expenses[category].forEach(row => {
        row.months.forEach((value, idx) => {
          categoryTotals[category].months[idx] += value;
        });
      });
      categoryTotals[category].total = categoryTotals[category].months.reduce((sum, val) => sum + val, 0);
    });
    
    // Calculate total expenses
    const totalExpenses = {
      months: Array(12).fill(0),
      total: 0
    };
    
    [totalCostOfGoods, ...Object.values(categoryTotals)].forEach(expense => {
      expense.months.forEach((value, idx) => {
        totalExpenses.months[idx] += value;
      });
    });
    totalExpenses.total = totalExpenses.months.reduce((sum, val) => sum + val, 0);
    
    // Calculate profit margins
    const grossProfit = {
      months: totalSales.months.map((sale, idx) => sale - totalCostOfGoods.months[idx]),
      total: totalSales.total - totalCostOfGoods.total
    };
    
    const grossProfitMargin = {
      months: totalSales.months.map((sale, idx) => 
        sale === 0 ? 0 : Math.round((sale - totalCostOfGoods.months[idx]) / sale * 100)
      ),
      total: totalSales.total === 0 ? 0 : Math.round((totalSales.total - totalCostOfGoods.total) / totalSales.total * 100)
    };
    
    const netProfit = {
      months: totalSales.months.map((sale, idx) => sale - totalExpenses.months[idx]),
      total: totalSales.total - totalExpenses.total
    };
    
    const netProfitMargin = {
      months: totalSales.months.map((sale, idx) => 
        sale === 0 ? 0 : Math.round((sale - totalExpenses.months[idx]) / sale * 100)
      ),
      total: totalSales.total === 0 ? 0 : Math.round((totalSales.total - totalExpenses.total) / totalSales.total * 100)
    };
    
    // Update summary
    data.summary = {
      totalSales,
      totalCostOfGoods,
      totalOperational: categoryTotals.operational,
      totalPayroll: categoryTotals.payroll,
      totalUtilities: categoryTotals.utilities,
      totalOtherExpenses: categoryTotals.otherExpenses,
      totalExpenses,
      grossProfit,
      grossProfitMargin,
      netProfit,
      netProfitMargin
    };
  };

  // Save financial data
  const saveFinancialData = async () => {
    if (!isModified || !financialData) return;
    
    try {
      setLoading(true);
      await financialService.saveFinancialData(year, financialData);
      setIsModified(false);
      return true;
    } catch (err) {
      console.error('Error saving financial data:', err);
      setError('Failed to save financial data');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add new row
  const addRow = (sectionId, newRow) => {
    if (!financialData) return;

    setFinancialData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      if (sectionId === 'sales') {
        newData.sales.push(newRow);
      } else if (sectionId.startsWith('expenses.')) {
        const category = sectionId.split('.')[1];
        newData.expenses[category].push(newRow);
      }
      
      updateSummary(newData);
      setIsModified(true);
      return newData;
    });
  };

  // Delete row
  const deleteRow = (sectionId, rowId) => {
    if (!financialData) return;

    setFinancialData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      if (sectionId === 'sales') {
        newData.sales = newData.sales.filter(row => row.id !== rowId);
      } else if (sectionId.startsWith('expenses.')) {
        const category = sectionId.split('.')[1];
        newData.expenses[category] = newData.expenses[category].filter(row => row.id !== rowId);
      }
      
      updateSummary(newData);
      setIsModified(true);
      return newData;
    });
  };

  // Change year
  const changeYear = (newYear) => {
    if (isModified) {
      // Handle unsaved changes
      const confirmChange = window.confirm('You have unsaved changes. Do you want to continue without saving?');
      if (!confirmChange) return;
    }
    
    setYear(newYear);
  };

  const value = {
    financialData,
    loading,
    error,
    year,
    isModified,
    updateCellValue,
    saveFinancialData,
    addRow,
    deleteRow,
    changeYear
  };

  return (
    <FinancialDataContext.Provider value={value}>
      {children}
    </FinancialDataContext.Provider>
  );
};

export default FinancialDataContext; 