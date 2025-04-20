import React from 'react';
import { InputNumber, Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { formatCurrency } from '../utils/formatters';

/**
 * Editable cell component for the financial spreadsheet
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Current cell value
 * @param {Object} props.record - Row data
 * @param {string} props.dataKey - Data category key
 * @param {number} props.monthIndex - Month index (0-11)
 * @param {boolean} props.isEditing - Flag indicating if cell is being edited
 * @param {number} props.editValue - Current editing value
 * @param {Function} props.onStartEdit - Start edit handler
 * @param {Function} props.onCancelEdit - Cancel edit handler
 * @param {Function} props.onSaveEdit - Save edit handler
 * @param {Function} props.onEditValueChange - Edit value change handler
 * @returns {JSX.Element} EditableCell component
 */
const EditableCell = ({
  value,
  record,
  dataKey,
  monthIndex,
  isEditing,
  editValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange
}) => {
  // Display mode
  if (!isEditing) {
    return (
      <div className="editable-cell">
        <div className="editable-cell-value">
          {formatCurrency(value)}
        </div>
        <div className="editable-cell-actions">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onStartEdit(record.id, `${dataKey}-${monthIndex}`, value)}
          />
        </div>
      </div>
    );
  }
  
  // Edit mode
  return (
    <div className="editable-cell editing">
      <InputNumber
        value={editValue}
        onChange={onEditValueChange}
        autoFocus
        min={0}
        step={10}
        style={{ width: '100%' }}
      />
      <Space className="editable-cell-actions">
        <Button
          type="text"
          icon={<CheckOutlined />}
          size="small"
          onClick={() => onSaveEdit(editValue, record, dataKey, monthIndex)}
        />
        <Button
          type="text"
          icon={<CloseOutlined />}
          size="small"
          onClick={onCancelEdit}
        />
      </Space>
    </div>
  );
};

export default EditableCell; 