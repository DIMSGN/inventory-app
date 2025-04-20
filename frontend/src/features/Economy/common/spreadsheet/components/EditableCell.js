import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber, Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';

/**
 * Reusable editable cell component for financial spreadsheets
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Current cell value
 * @param {Object} props.record - Row data
 * @param {string} props.dataKey - Data category key
 * @param {number} props.columnIndex - Column index
 * @param {boolean} props.isEditing - Flag indicating if cell is being edited
 * @param {number} props.editValue - Current editing value
 * @param {Function} props.onStartEdit - Start edit handler
 * @param {Function} props.onCancelEdit - Cancel edit handler
 * @param {Function} props.onSaveEdit - Save edit handler
 * @param {Function} props.onEditValueChange - Edit value change handler
 * @param {Function} props.formatValue - Function to format the cell value for display
 * @returns {JSX.Element} EditableCell component
 */
const EditableCell = ({
  value,
  record,
  dataKey,
  columnIndex,
  isEditing,
  editValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditValueChange,
  formatValue,
  min = 0,
  step = 10,
  readOnly = false
}) => {
  // Use the provided format function or default to direct value
  const displayValue = formatValue ? formatValue(value) : value;
  
  // For read-only cells or cells that shouldn't be editable
  if (readOnly) {
    return <div className="cell-value">{displayValue}</div>;
  }
  
  // Display mode
  if (!isEditing) {
    return (
      <div className="editable-cell">
        <div className={`editable-cell-value ${value < 0 ? 'negative-value' : ''}`}>
          {displayValue}
        </div>
        <div className="editable-cell-actions">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onStartEdit(record.id, columnIndex, value)}
            className="edit-button"
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
        min={min}
        step={step}
        style={{ width: '100%' }}
      />
      <Space className="editable-cell-actions">
        <Button
          type="text"
          icon={<CheckOutlined />}
          size="small"
          onClick={() => onSaveEdit(editValue, record, dataKey, columnIndex)}
          className="save-button"
        />
        <Button
          type="text"
          icon={<CloseOutlined />}
          size="small"
          onClick={onCancelEdit}
          className="cancel-button"
        />
      </Space>
    </div>
  );
};

EditableCell.propTypes = {
  value: PropTypes.number,
  record: PropTypes.object.isRequired,
  dataKey: PropTypes.string.isRequired,
  columnIndex: PropTypes.number.isRequired,
  isEditing: PropTypes.bool.isRequired,
  editValue: PropTypes.number,
  onStartEdit: PropTypes.func.isRequired,
  onCancelEdit: PropTypes.func.isRequired,
  onSaveEdit: PropTypes.func.isRequired,
  onEditValueChange: PropTypes.func.isRequired,
  formatValue: PropTypes.func,
  min: PropTypes.number,
  step: PropTypes.number,
  readOnly: PropTypes.bool
};

export default EditableCell; 