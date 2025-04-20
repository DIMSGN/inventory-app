import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Select, InputNumber, Typography, 
  Spin, Space, message, Tooltip, DatePicker, Popconfirm, Empty, Alert, Tag
} from 'antd';
import { 
  SaveOutlined, PrinterOutlined, FileExcelOutlined,
  CalculatorOutlined, LoadingOutlined, SwapOutlined,
  EditOutlined, CheckOutlined, CloseOutlined,
  DownloadOutlined, ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import '../../styles/FinancialSpreadsheet.css';
import { useEconomy } from '../../contexts/EconomyContext';
import { DatePickerField } from '../../../../common/components';

const { Title, Text } = Typography;
const { Option } = Select;

// Utility functions
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatPercentage = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('el-GR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

const FinancialSpreadsheet = () => {
  // URL parameters
  const { year: urlYear } = useParams();
  
  // State variables
  const { 
    financialData,
    loading,
    error,
    setLoading,
    currentYear, 
    fetchFinancialData,
    saveFinancialData,
    isUsingMockData
  } = useEconomy();
  const [saving, setSaving] = useState(false);
  const [yearMonth, setYearMonth] = useState(() => {
    const initialYear = urlYear || currentYear || new Date().getFullYear();
    return `${initialYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [displayData, setDisplayData] = useState(null);
  
  // Available years for selection
  const availableYears = Array.from(
    { length: 5 }, 
    (_, i) => (currentYear || new Date().getFullYear()) - 2 + i
  );
  
  // Generate month columns and calculate annual total
  const months = [
    'ΙΑΝΟΥΑΡΙΟΣ', 'ΦΕΒΡΟΥΑΡΙΟΣ', 'ΜΑΡΤΙΟΣ', 'ΑΠΡΙΛΙΟΣ', 'ΜΑΙΟΣ', 'ΙΟΥΝΙΟΣ',
    'ΙΟΥΛΙΟΣ', 'ΑΥΓΟΥΣΤΟΣ', 'ΣΕΠΤΕΜΒΡΙΟΣ', 'ΟΚΤΩΒΡΙΟΣ', 'ΝΟΕΜΒΡΙΟΣ', 'ΔΕΚΕΜΒΡΙΟΣ'
  ];
  
  // Update yearMonth when currentYear changes
  useEffect(() => {
    if (currentYear) {
      setYearMonth(`${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    }
  }, [currentYear]);
  
  // Fetch financial data on component mount and when year changes
  useEffect(() => {
    const year = yearMonth.split('-')[0];
    if (year && !isNaN(parseInt(year))) {
      fetchFinancialData(parseInt(year));
    }
  }, [yearMonth.split('-')[0]]); // Only depends on the year part
  
  // Process data for display when financialData changes
  useEffect(() => {
    const processedData = processDataForDisplay();
    setDisplayData(processedData);
    setLastUpdated(new Date());
  }, [financialData]);
  
  // Handle cell edit
  const handleCellEdit = (value, record, dataKey, monthIndex) => {
    // Clone the current data
    const newData = { ...financialData };
    
    // Update the specific cell value
    if (dataKey === 'sales') {
      const index = newData.sales.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.sales[index].months[monthIndex] = value;
      }
    } else if (dataKey === 'costOfGoods') {
      const index = newData.expenses.costOfGoods.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.expenses.costOfGoods[index].months[monthIndex] = value;
      }
    } else if (dataKey === 'operational') {
      const index = newData.expenses.operational.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.expenses.operational[index].months[monthIndex] = value;
      }
    } else if (dataKey === 'utilities') {
      const index = newData.expenses.utilities.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.expenses.utilities[index].months[monthIndex] = value;
      }
    }
    
    // Recalculate totals
    calculateTotals(newData);
    
    // Save the updated data to the context
    saveFinancialData(newData, parseInt(yearMonth.split('-')[0]));
    
    setEditingCell(null);
  };
  
  // Calculate totals and percentages
  const calculateTotals = (data) => {
    if (!data || !data.sales) return data;
    
    // Calculate row totals for each category
    data.sales.forEach(row => {
      row.total = row.months.reduce((sum, val) => sum + (val || 0), 0);
    });
    
    if (data.expenses?.costOfGoods) {
      data.expenses.costOfGoods.forEach(row => {
        row.total = row.months.reduce((sum, val) => sum + (val || 0), 0);
      });
    }
    
    if (data.expenses?.operational) {
      data.expenses.operational.forEach(row => {
        row.total = row.months.reduce((sum, val) => sum + (val || 0), 0);
      });
    }
    
    if (data.expenses?.utilities) {
      data.expenses.utilities.forEach(row => {
        row.total = row.months.reduce((sum, val) => sum + (val || 0), 0);
      });
    }
    
    // Calculate column totals
    const totalSales = Array(12).fill(0);
    const totalCostOfGoods = Array(12).fill(0);
    const totalOperational = Array(12).fill(0);
    const totalUtilities = Array(12).fill(0);
    
    data.sales.forEach(row => {
      row.months.forEach((val, idx) => {
        totalSales[idx] += val || 0;
      });
    });
    
    if (data.expenses?.costOfGoods) {
      data.expenses.costOfGoods.forEach(row => {
        row.months.forEach((val, idx) => {
          totalCostOfGoods[idx] += val || 0;
        });
      });
    }
    
    if (data.expenses?.operational) {
      data.expenses.operational.forEach(row => {
        row.months.forEach((val, idx) => {
          totalOperational[idx] += val || 0;
        });
      });
    }
    
    if (data.expenses?.utilities) {
      data.expenses.utilities.forEach(row => {
        row.months.forEach((val, idx) => {
          totalUtilities[idx] += val || 0;
        });
      });
    }
    
    // Calculate summary for each month and annual total
    const totalExpenses = totalCostOfGoods.map((val, idx) => 
      val + totalOperational[idx] + totalUtilities[idx]
    );
    
    const grossProfit = totalSales.map((val, idx) => val - totalCostOfGoods[idx]);
    
    const netProfit = totalSales.map((val, idx) => val - totalExpenses[idx]);
    
    // Calculate profit margins
    const grossProfitMargin = totalSales.map((val, idx) => 
      val === 0 ? 0 : (grossProfit[idx] / val) * 100
    );
    
    const netProfitMargin = totalSales.map((val, idx) => 
      val === 0 ? 0 : (netProfit[idx] / val) * 100
    );
    
    // Update summary
    data.summary = {
      totalSales: {
        months: totalSales,
        total: totalSales.reduce((sum, val) => sum + val, 0)
      },
      totalCostOfGoods: {
        months: totalCostOfGoods,
        total: totalCostOfGoods.reduce((sum, val) => sum + val, 0)
      },
      totalOperational: {
        months: totalOperational,
        total: totalOperational.reduce((sum, val) => sum + val, 0)
      },
      totalUtilities: {
        months: totalUtilities,
        total: totalUtilities.reduce((sum, val) => sum + val, 0)
      },
      totalExpenses: {
        months: totalExpenses,
        total: totalExpenses.reduce((sum, val) => sum + val, 0)
      },
      grossProfit: {
        months: grossProfit,
        total: grossProfit.reduce((sum, val) => sum + val, 0)
      },
      grossProfitMargin: {
        months: grossProfitMargin,
        total: data.summary.totalSales.total === 0 ? 0 : 
          (data.summary.grossProfit.total / data.summary.totalSales.total) * 100
      },
      netProfit: {
        months: netProfit,
        total: netProfit.reduce((sum, val) => sum + val, 0)
      },
      netProfitMargin: {
        months: netProfitMargin,
        total: data.summary.totalSales.total === 0 ? 0 : 
          (data.summary.netProfit.total / data.summary.totalSales.total) * 100
      }
    };
    
    return data;
  };
  
  // Handle save button click - save to server
  const handleSave = async () => {
    try {
      setSaving(true);
      await saveFinancialData(financialData, parseInt(yearMonth.split('-')[0]));
      setSaving(false);
      message.success('Financial data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      message.error('Failed to save financial data');
      setSaving(false);
    }
  };
  
  // Export to Excel
  const handleExport = () => {
    try {
      const year = yearMonth.split('-')[0];
      const workbook = XLSX.utils.book_new();
      
      // Prepare data for Excel export
      const data = [
        ['Financial Report', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['Year:', year, '', '', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '', '', '', ''],
        ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'],
      ];
      
      // Add Sales data
      data.push(['SALES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      financialData.sales.forEach(row => {
        const rowData = [row.name];
        row.months.forEach(val => rowData.push(val || 0));
        rowData.push(row.total || 0);
        data.push(rowData);
      });
      
      // Add Total Sales
      const totalSalesRow = ['Total Sales'];
      financialData.summary.totalSales?.months.forEach(val => totalSalesRow.push(val || 0));
      totalSalesRow.push(financialData.summary.totalSales?.total || 0);
      data.push(totalSalesRow);
      
      data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      
      // Add Cost of Goods
      data.push(['COST OF GOODS', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      financialData.expenses.costOfGoods.forEach(row => {
        const rowData = [row.name];
        row.months.forEach(val => rowData.push(val || 0));
        rowData.push(row.total || 0);
        data.push(rowData);
      });
      
      // Add Total Cost of Goods
      const totalCostRow = ['Total Cost of Goods'];
      financialData.summary.totalCostOfGoods?.months.forEach(val => totalCostRow.push(val || 0));
      totalCostRow.push(financialData.summary.totalCostOfGoods?.total || 0);
      data.push(totalCostRow);
      
      // Add Gross Profit
      const grossProfitRow = ['Gross Profit'];
      financialData.summary.grossProfit?.months.forEach(val => grossProfitRow.push(val || 0));
      grossProfitRow.push(financialData.summary.grossProfit?.total || 0);
      data.push(grossProfitRow);
      
      // Add Gross Profit Margin
      const grossMarginRow = ['Gross Profit Margin (%)'];
      financialData.summary.grossProfitMargin?.months.forEach(val => grossMarginRow.push(val || 0));
      grossMarginRow.push(financialData.summary.grossProfitMargin?.total || 0);
      data.push(grossMarginRow);
      
      data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      
      // Add Operational Expenses
      data.push(['OPERATIONAL EXPENSES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      financialData.expenses.operational.forEach(row => {
        const rowData = [row.name];
        row.months.forEach(val => rowData.push(val || 0));
        rowData.push(row.total || 0);
        data.push(rowData);
      });
      
      // Add Total Operational
      const totalOperationalRow = ['Total Operational'];
      financialData.summary.totalOperational?.months.forEach(val => totalOperationalRow.push(val || 0));
      totalOperationalRow.push(financialData.summary.totalOperational?.total || 0);
      data.push(totalOperationalRow);
      
      data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      
      // Add Utilities Expenses
      data.push(['UTILITIES EXPENSES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      financialData.expenses.utilities.forEach(row => {
        const rowData = [row.name];
        row.months.forEach(val => rowData.push(val || 0));
        rowData.push(row.total || 0);
        data.push(rowData);
      });
      
      // Add Total Utilities
      const totalUtilitiesRow = ['Total Utilities'];
      financialData.summary.totalUtilities?.months.forEach(val => totalUtilitiesRow.push(val || 0));
      totalUtilitiesRow.push(financialData.summary.totalUtilities?.total || 0);
      data.push(totalUtilitiesRow);
      
      data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
      
      // Add Total Expenses
      const totalExpensesRow = ['Total Expenses'];
      financialData.summary.totalExpenses?.months.forEach(val => totalExpensesRow.push(val || 0));
      totalExpensesRow.push(financialData.summary.totalExpenses?.total || 0);
      data.push(totalExpensesRow);
      
      // Add Net Profit
      const netProfitRow = ['Net Profit'];
      financialData.summary.netProfit?.months.forEach(val => netProfitRow.push(val || 0));
      netProfitRow.push(financialData.summary.netProfit?.total || 0);
      data.push(netProfitRow);
      
      // Add Net Profit Margin
      const netMarginRow = ['Net Profit Margin (%)'];
      financialData.summary.netProfitMargin?.months.forEach(val => netMarginRow.push(val || 0));
      netMarginRow.push(financialData.summary.netProfitMargin?.total || 0);
      data.push(netMarginRow);
      
      // Create worksheet and add to workbook
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Annual Report');
      
      // Apply some styling
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let C = range.s.c; C <= range.e.c; C++) {
        const address = XLSX.utils.encode_col(C) + '4'; // Header row
        if (!worksheet[address]) continue;
        worksheet[address].s = { font: { bold: true } };
      }
      
      // Auto-size columns
      const colWidths = data.reduce((acc, row) => {
        row.forEach((cell, i) => {
          const cellValue = cell?.toString() || '';
          const width = cellValue.length;
          if (!acc[i] || acc[i] < width) acc[i] = width;
        });
        return acc;
      }, []);
      
      worksheet['!cols'] = colWidths.map(width => ({ width }));
      
      // Save file
      XLSX.writeFile(workbook, `Financial_Report_${year}.xlsx`);
      message.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      message.error('Failed to export report');
    }
  };
  
  // Print spreadsheet
  const handlePrint = () => {
    window.print();
  };
  
  // Get month name
  const getMonthName = (month) => {
    const date = new Date(2000, month - 1, 1);
    return date.toLocaleString('el-GR', { month: 'long' });
  };
  
  // Start editing cell
  const startEdit = (rowIndex, columnKey, value) => {
    setEditingCell({ rowIndex, columnKey });
    setEditingValue(value);
  };
  
  // Save cell edit
  const saveEdit = () => {
    if (!editingCell) return;
    
    const { rowIndex, columnKey } = editingCell;
    const newData = [...financialData.sales];
    
    // Update cell value
    newData[rowIndex][columnKey] = editingValue;
    
    // Recalculate totals and other derived values
    const updatedData = { ...financialData, sales: newData };
    calculateTotals(updatedData);
    
    // Save to context
    saveFinancialData(updatedData, parseInt(yearMonth.split('-')[0]));
    
    setEditingCell(null);
  };
  
  // Cancel cell edit
  const cancelEdit = () => {
    setEditingCell(null);
  };
  
  // Format the Greek column headers with proper styling
  const renderColumnTitle = (month, index) => {
    return {
      title: month,
      dataIndex: ['months', index],
      key: `month-${index}`,
      className: 'month-column',
      align: 'right',
      width: 120,
      render: (value, record) => {
        const isEditing = editingCell && 
          editingCell.rowKey === record.id && 
          editingCell.columnKey === index;
        
        if (isEditing) {
          return (
            <InputNumber
              className="editable-cell-input"
              defaultValue={value || 0}
              min={0}
              step={10}
              onChange={(newValue) => setEditingValue(newValue)}
              onPressEnter={saveEdit}
              onBlur={saveEdit}
              autoFocus
            />
          );
        }
        
        return (
          <div 
            className={`editable-cell cell-value money-cell ${value < 0 ? 'negative-value' : ''}`}
            onClick={() => startEdit(record.id, index, value || 0)}
          >
            {formatCurrency(value || 0)}
          </div>
        );
      },
    };
  };
  
  // Add styled section headers to make the spreadsheet more organized
  const renderSectionTitle = (title) => {
    return (
      <div className="section-title">
        {title}
      </div>
    );
  };
  
  // Create the percentage row with styled cells
  const renderPercentageRow = (percentages, rowTitle) => {
    return {
      id: `percentage-${rowTitle}`,
      name: `${rowTitle} %`,
      months: percentages,
      total: percentages.reduce((sum, val) => sum + (val || 0), 0) / 12, // Average
      rowType: 'percentage'
    };
  };
  
  // Process data for display
  const processDataForDisplay = () => {
    // If financial data is not loaded yet, return empty arrays
    if (!financialData || !financialData.sales) {
      return {
        salesData: [],
        cogData: [],
        opexData: [],
        utilitiesData: [],
        summaryData: []
      };
    }
    
    // Sales data
    const salesData = [...financialData.sales].map(item => ({
      ...item,
      key: item.id,
      name: item.name,
      type: 'data',
      dataType: 'sales'
    }));
    
    // Cost of Goods data
    const cogData = financialData.expenses?.costOfGoods 
      ? [...financialData.expenses.costOfGoods].map(item => ({
        ...item,
        key: item.id,
        name: item.name,
        type: 'data',
        dataType: 'costOfGoods'
      }))
      : [];
    
    // Operational expenses data
    const opexData = financialData.expenses?.operational 
      ? [...financialData.expenses.operational].map(item => ({
        ...item,
        key: item.id,
        name: item.name,
        type: 'data',
        dataType: 'operational'
      }))
      : [];
    
    // Utilities expenses data
    const utilitiesData = financialData.expenses?.utilities 
      ? [...financialData.expenses.utilities].map(item => ({
        ...item,
        key: item.id,
        name: item.name,
        type: 'data',
        dataType: 'utilities'
      }))
      : [];
    
    // Summary data
    let summaryData = [];
    
    if (financialData.summary) {
      summaryData = [
        // Total Sales row
        {
          id: 'total-sales',
          key: 'total-sales',
          name: 'ΣΥΝΟΛΟ ΠΩΛΗΣΕΩΝ',
          type: 'summary',
          dataType: 'totalSales',
          months: financialData.summary.totalSales?.months || Array(12).fill(0),
          total: financialData.summary.totalSales?.total || 0,
          isBold: true
        },
        // Cost of Goods row
        {
          id: 'total-cogs',
          key: 'total-cogs',
          name: 'ΚΟΣΤΟΣ ΠΩΛΗΘΕΝΤΩΝ',
          type: 'summary',
          dataType: 'totalCostOfGoods',
          months: financialData.summary.totalCostOfGoods?.months || Array(12).fill(0),
          total: financialData.summary.totalCostOfGoods?.total || 0,
          isBold: true
        },
        // Gross Profit
        {
          id: 'gross-profit',
          key: 'gross-profit',
          name: 'ΜΙΚΤΟ ΚΕΡΔΟΣ',
          type: 'summary',
          dataType: 'grossProfit',
          months: financialData.summary.grossProfit?.months || Array(12).fill(0),
          total: financialData.summary.grossProfit?.total || 0,
          isBold: true,
          isProfit: true
        },
        // Gross Profit Margin
        {
          id: 'gross-profit-margin',
          key: 'gross-profit-margin',
          name: 'ΠΕΡΙΘΩΡΙΟ ΜΙΚΤΟΥ ΚΕΡΔΟΥΣ',
          type: 'percentage',
          dataType: 'grossProfitMargin',
          months: financialData.summary.grossProfitMargin?.months || Array(12).fill(0),
          total: financialData.summary.grossProfitMargin?.total || 0,
          isPercentage: true
        },
        // Operational Expenses
        {
          id: 'total-opex',
          key: 'total-opex',
          name: 'ΛΕΙΤΟΥΡΓΙΚΑ ΕΞΟΔΑ',
          type: 'summary',
          dataType: 'totalOperational',
          months: financialData.summary.totalOperational?.months || Array(12).fill(0),
          total: financialData.summary.totalOperational?.total || 0,
          isBold: true
        },
        // Utilities
        {
          id: 'total-utilities',
          key: 'total-utilities',
          name: 'ΠΑΓΙΑ ΕΞΟΔΑ',
          type: 'summary',
          dataType: 'totalUtilities',
          months: financialData.summary.totalUtilities?.months || Array(12).fill(0),
          total: financialData.summary.totalUtilities?.total || 0,
          isBold: true
        },
        // Total Expenses
        {
          id: 'total-expenses',
          key: 'total-expenses',
          name: 'ΣΥΝΟΛΟ ΕΞΟΔΩΝ',
          type: 'summary',
          dataType: 'totalExpenses',
          months: financialData.summary.totalExpenses?.months || Array(12).fill(0),
          total: financialData.summary.totalExpenses?.total || 0,
          isBold: true
        },
        // Net Profit
        {
          id: 'net-profit',
          key: 'net-profit',
          name: 'ΚΑΘΑΡΟ ΚΕΡΔΟΣ',
          type: 'summary',
          dataType: 'netProfit',
          months: financialData.summary.netProfit?.months || Array(12).fill(0),
          total: financialData.summary.netProfit?.total || 0,
          isBold: true,
          isProfit: true
        },
        // Net Profit Margin
        {
          id: 'net-profit-margin',
          key: 'net-profit-margin',
          name: 'ΠΕΡΙΘΩΡΙΟ ΚΑΘΑΡΟΥ ΚΕΡΔΟΥΣ',
          type: 'percentage',
          dataType: 'netProfitMargin',
          months: financialData.summary.netProfitMargin?.months || Array(12).fill(0),
          total: financialData.summary.netProfitMargin?.total || 0,
          isPercentage: true
        }
      ];
    }
    
    return {
      salesData,
      cogData,
      opexData,
      utilitiesData,
      summaryData
    };
  };
  
  // Get CSS class for a row based on its properties
  const getRowClassName = (record) => {
    let classes = [];
    
    if (record.type === 'header') classes.push('header-row');
    if (record.type === 'summary') classes.push('summary-row');
    if (record.type === 'percentage') classes.push('percentage-row');
    if (record.isBold) classes.push('bold-row');
    if (record.isProfit) classes.push('profit-row');
    
    return classes.join(' ');
  };
  
  // Column configuration for the data table
  const baseColumns = [
    {
      title: 'ΚΑΤΗΓΟΡΙΑ',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
      render: (text, record) => {
        if (record.isPercentage) {
          return <span className="percentage-cell">{text}</span>;
        }
        return text;
      }
    },
    ...months.map((month, index) => ({
      title: () => renderColumnTitle(month, index),
      dataIndex: ['months', index],
      key: `month-${index}`,
      width: 130,
      render: (text, record) => {
        // Check if cell is being edited
        if (editingCell && 
            editingCell.recordId === record.id && 
            editingCell.columnIndex === index) {
          return (
            <InputNumber
              autoFocus
              style={{ width: '100%' }}
              defaultValue={text || 0}
              onChange={(value) => setEditingValue(value)}
              onPressEnter={() => handleCellEdit(editingValue, record, record.dataType, index)}
              onBlur={() => handleCellEdit(editingValue, record, record.dataType, index)}
            />
          );
        }
        
        // For percentage rows
        if (record.isPercentage) {
          return <span className="percentage-cell">{formatPercentage(text)}</span>;
        }
        
        // For data cells that can be edited
        if (record.type === 'data') {
          return (
            <div 
              className="editable-cell"
              onClick={() => startEdit(record.id, index, text)}
            >
              {formatCurrency(text)}
            </div>
          );
        }
        
        // For summary rows
        if (record.type === 'summary') {
          let cellClassName = 'summary-cell';
          if (record.isProfit) cellClassName += ' profit-cell';
          
          return <span className={cellClassName}>{formatCurrency(text)}</span>;
        }
        
        // Default case
        return formatCurrency(text);
      }
    })),
    {
      title: 'ΣΥΝΟΛΟ',
      dataIndex: 'total',
      key: 'total',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        if (record.isPercentage) {
          return <span className="percentage-cell">{formatPercentage(text)}</span>;
        }
        
        let cellClassName = record.type === 'summary' ? 'summary-cell' : '';
        if (record.isProfit) cellClassName += ' profit-cell';
        
        return <span className={cellClassName}>{formatCurrency(text)}</span>;
      }
    }
  ];
  
  // Handle year-month change
  const handleYearMonthChange = (date) => {
    if (date) {
      // Format the date to get just the year
      const year = moment(date).format('YYYY');
      // Keep the existing month
      const month = yearMonth.split('-')[1];
      setYearMonth(`${year}-${month}`);
    }
  };
  
  // Render the spreadsheet
  return (
    <div className="financial-spreadsheet">
      <div className="spreadsheet-header">
        <div className="spreadsheet-title">
          <Title level={3}>
            Οικονομικά Στοιχεία {currentYear}
            {isUsingMockData && <Tag color="orange" style={{marginLeft: 10}}>DEMO DATA</Tag>}
          </Title>
          <Text type="secondary">
            {lastUpdated ? `Last updated: ${moment(lastUpdated).format('DD/MM/YYYY HH:mm')}` : ''}
          </Text>
        </div>
        
        <div className="spreadsheet-controls">
          <Space size="middle">
            <DatePickerField
              selected={moment(yearMonth.split('-')[0], 'YYYY').toDate()}
              onChange={handleYearMonthChange}
              dateFormat="yyyy"
              showYearPicker
              placeholder="Select year"
              isClearable={false}
              width="auto"
              className="year-picker"
            />
            
            <Tooltip title="Save changes">
              <Button 
                type="primary" 
                icon={<SaveOutlined />} 
                onClick={handleSave}
                loading={saving}
              >
                Save
              </Button>
            </Tooltip>
            
            <Tooltip title="Refresh data">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchFinancialData(parseInt(yearMonth.split('-')[0]))}
                loading={loading}
              >
                Refresh
              </Button>
            </Tooltip>
            
            <Tooltip title="Export to Excel">
              <Button icon={<FileExcelOutlined />} onClick={handleExport}>
                Export
              </Button>
            </Tooltip>
            
            <Tooltip title="Print spreadsheet">
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                Print
              </Button>
            </Tooltip>
          </Space>
        </div>
      </div>
      
      {error && (
        <Alert
          message="Error Loading Data"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      
      <div className="spreadsheet-content">
        {loading ? (
          <div className="loading-container">
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 24 }} />} 
              tip="Loading financial data..."
            />
          </div>
        ) : (
          <>
            {/* Sales Section */}
            <div className="spreadsheet-section">
              {renderSectionTitle('ΠΩΛΗΣΕΙΣ (SALES)')}
              <Table
                dataSource={displayData?.salesData || []}
                columns={baseColumns}
                pagination={false}
                rowClassName={getRowClassName}
                scroll={{ x: 'max-content' }}
                size="small"
                bordered
                locale={{
                  emptyText: <Empty description="No sales data available" />
                }}
              />
            </div>
            
            {/* Cost of Goods Section */}
            <div className="spreadsheet-section">
              {renderSectionTitle('ΚΟΣΤΟΣ ΠΩΛΗΘΕΝΤΩΝ (COST OF GOODS)')}
              <Table
                dataSource={displayData?.cogData || []}
                columns={baseColumns}
                pagination={false}
                rowClassName={getRowClassName}
                scroll={{ x: 'max-content' }}
                size="small"
                bordered
                locale={{
                  emptyText: <Empty description="No cost of goods data available" />
                }}
              />
            </div>
            
            {/* Operational Expenses Section */}
            <div className="spreadsheet-section">
              {renderSectionTitle('ΛΕΙΤΟΥΡΓΙΚΑ ΕΞΟΔΑ (OPERATIONAL EXPENSES)')}
              <Table
                dataSource={displayData?.opexData || []}
                columns={baseColumns}
                pagination={false}
                rowClassName={getRowClassName}
                scroll={{ x: 'max-content' }}
                size="small"
                bordered
                locale={{
                  emptyText: <Empty description="No operational expenses data available" />
                }}
              />
            </div>
            
            {/* Utilities Expenses Section */}
            <div className="spreadsheet-section">
              {renderSectionTitle('ΠΑΓΙΑ ΕΞΟΔΑ (UTILITIES & FIXED EXPENSES)')}
              <Table
                dataSource={displayData?.utilitiesData || []}
                columns={baseColumns}
                pagination={false}
                rowClassName={getRowClassName}
                scroll={{ x: 'max-content' }}
                size="small"
                bordered
                locale={{
                  emptyText: <Empty description="No utilities/fixed expenses data available" />
                }}
              />
            </div>
            
            {/* Summary Section */}
            <div className="spreadsheet-section">
              {renderSectionTitle('ΣΥΝΟΨΗ (SUMMARY)')}
              <Table
                dataSource={displayData?.summaryData || []}
                columns={baseColumns}
                pagination={false}
                rowClassName={getRowClassName}
                scroll={{ x: 'max-content' }}
                size="small"
                bordered
                locale={{
                  emptyText: <Empty description="No summary data available" />
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialSpreadsheet; 