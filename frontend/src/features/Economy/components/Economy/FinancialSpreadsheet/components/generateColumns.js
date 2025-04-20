import React from 'react';
import { Input, Form } from 'antd';
import { formatValue, getCellStyle } from '../utils';

// Greek month names for column headers
const MONTH_NAMES = [
  'ΙΑΝΟΥΑΡΙΟΣ',
  'ΦΕΒΡΟΥΑΡΙΟΣ',
  'ΜΑΡΤΙΟΣ',
  'ΑΠΡΙΛΙΟΣ',
  'ΜΑΙΟΣ',
  'ΙΟΥΝΙΟΣ',
  'ΙΟΥΛΙΟΣ',
  'ΑΥΓΟΥΣΤΟΣ',
  'ΣΕΠΤΕΜΒΡΙΟΣ',
  'ΟΚΤΩΒΡΙΟΣ',
  'ΝΟΕΜΒΡΙΟΣ',
  'ΔΕΚΕΜΒΡΙΟΣ'
];

/**
 * EditableCell component for inline editing of values
 */
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  onChange,
  onSave,
  isPercentage,
  ...restProps
}) => {
  const handleChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    onChange(value);
  };

  const handleBlur = () => {
    onSave();
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              type: 'number',
              message: 'Please enter a valid number',
              transform: (value) => {
                if (value === '') return null;
                return Number(value);
              }
            }
          ]}
        >
          <Input 
            type="number" 
            step="0.01"
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

/**
 * Generate column definitions for the financial spreadsheet
 * @param {Function} startEdit - Function to start cell editing
 * @param {Function} isEditing - Function to check if a cell is being edited
 * @param {Function} updateEditingValue - Function to update the edited value
 * @param {Function} saveEdit - Function to save the edited value
 * @returns {Array} Array of column definitions
 */
export const generateColumns = (startEdit, isEditing, updateEditingValue, saveEdit) => {
  // First column is always the name
  const columns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      render: (text, record) => {
        // Make summary rows bold
        const style = record.dataType === 'summary' ? { fontWeight: 'bold' } : {};
        return <div style={style}>{text}</div>;
      }
    }
  ];

  // Add a column for each month
  MONTH_NAMES.forEach((month, index) => {
    columns.push({
      title: month,
      dataIndex: ['months', index],
      key: `month_${index}`,
      width: 120,
      editable: true,
      render: (value, record) => {
        const isPercentage = record.isPercentage;
        const cellId = `${record.id}_month_${index}`;
        const editing = isEditing(cellId);
        
        // Only allow editing for data rows, not summary rows
        const isDataRow = !['summary', 'summary-section'].includes(record.dataType);
        
        const handleClick = () => {
          if (!isDataRow) return;
          
          startEdit(cellId, value);
        };
        
        if (editing) {
          return (
            <EditableCell
              editing={true}
              dataIndex={`month_${index}`}
              title={month}
              inputType="number"
              record={record}
              index={index}
              onChange={(newValue) => updateEditingValue(newValue)}
              onSave={() => saveEdit(() => ({ 
                value: isEditing(cellId), 
                record, 
                dataType: record.dataType,
                monthIndex: index 
              }))}
              isPercentage={isPercentage}
            >
              {formatValue(value, { isPercentage })}
            </EditableCell>
          );
        }
        
        return (
          <div 
            className={isDataRow ? 'editable-cell' : ''}
            onClick={handleClick}
            style={getCellStyle(value, { 
              isProfit: record.dataType === 'netProfit' || record.dataType === 'grossProfit',
              isPercentage 
            })}
          >
            {formatValue(value, { isPercentage })}
          </div>
        );
      }
    });
  });

  return columns;
}; 