import React from 'react';
import { InputNumber } from 'antd';
import { formatCurrency, formatPercentage } from '../utils';

/**
 * Generate columns for financial spreadsheet tables
 * @param {Function} startEdit - Function to start cell editing
 * @param {Function} isEditing - Function to check if cell is being edited
 * @param {Function} updateEditingValue - Function to update editing value
 * @param {Function} saveEdit - Function to save cell edit
 * @returns {Array} Array of column configurations
 */
const generateColumns = (startEdit, isEditing, updateEditingValue, saveEdit) => {
  // Greek month names
  const months = [
    'ΙΑΝΟΥΑΡΙΟΣ', 'ΦΕΒΡΟΥΑΡΙΟΣ', 'ΜΑΡΤΙΟΣ', 'ΑΠΡΙΛΙΟΣ', 'ΜΑΙΟΣ', 'ΙΟΥΝΙΟΣ',
    'ΙΟΥΛΙΟΣ', 'ΑΥΓΟΥΣΤΟΣ', 'ΣΕΠΤΕΜΒΡΙΟΣ', 'ΟΚΤΩΒΡΙΟΣ', 'ΝΟΕΜΒΡΙΟΣ', 'ΔΕΚΕΜΒΡΙΟΣ'
  ];
  
  // Base column for name
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
    }
  ];
  
  // Add month columns
  const monthColumns = months.map((month, index) => ({
    title: month,
    dataIndex: ['months', index],
    key: `month-${index}`,
    width: 130,
    render: (text, record) => {
      // Check if cell is being edited
      if (isEditing(record.id, index)) {
        return (
          <InputNumber
            autoFocus
            style={{ width: '100%' }}
            defaultValue={text || 0}
            onChange={(value) => updateEditingValue(value)}
            onPressEnter={() => saveEdit((value, recordId, colIndex) => {
              // This function will be called by the saveEdit function in useCellEditing
              // and will eventually call handleCellEdit from useFinancialData
              return { value, record, dataType: record.dataType, monthIndex: colIndex };
            })}
            onBlur={() => saveEdit((value, recordId, colIndex) => {
              return { value, record, dataType: record.dataType, monthIndex: colIndex };
            })}
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
  }));
  
  // Add total column
  const totalColumn = [
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
  
  // Combine all columns
  return [...baseColumns, ...monthColumns, ...totalColumn];
};

export default generateColumns; 