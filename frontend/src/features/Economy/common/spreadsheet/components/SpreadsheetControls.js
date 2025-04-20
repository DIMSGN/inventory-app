import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip, Space, DatePicker } from 'antd';
import { 
  SaveOutlined, 
  PrinterOutlined, 
  FileExcelOutlined,
  ReloadOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import moment from 'moment';

/**
 * Reusable controls component for financial spreadsheets
 * 
 * @param {Object} props - Component props
 * @param {string} props.year - Current year
 * @param {Function} props.onYearChange - Year change handler
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onPrint - Print handler
 * @param {Function} props.onExport - Export handler
 * @param {Function} props.onRefresh - Refresh/reload handler
 * @param {boolean} props.saving - Flag indicating save in progress
 * @param {boolean} props.loading - Flag indicating data loading in progress
 * @param {Array} props.extraControls - Additional control elements to include
 * @returns {JSX.Element} SpreadsheetControls component
 */
const SpreadsheetControls = ({
  year,
  onYearChange,
  onSave,
  onPrint,
  onExport,
  onRefresh,
  saving = false,
  loading = false,
  extraControls = []
}) => {
  // Handle year picker
  const handleYearChange = (date) => {
    if (date && typeof onYearChange === 'function') {
      const selectedYear = moment(date).format('YYYY');
      onYearChange(selectedYear);
    }
  };

  return (
    <div className="spreadsheet-controls">
      <Space size="middle">
        {/* Year picker if year selection is enabled */}
        {onYearChange && (
          <DatePicker
            picker="year"
            value={year ? moment(year, 'YYYY') : moment()}
            onChange={handleYearChange}
            format="YYYY"
            allowClear={false}
          />
        )}
        
        {/* Save button */}
        {onSave && (
          <Tooltip title="Save changes">
            <Button
              type="primary"
              icon={saving ? <LoadingOutlined /> : <SaveOutlined />}
              onClick={onSave}
              disabled={saving || loading}
            >
              Save
            </Button>
          </Tooltip>
        )}
        
        {/* Export button */}
        {onExport && (
          <Tooltip title="Export to Excel">
            <Button
              icon={<FileExcelOutlined />}
              onClick={onExport}
              disabled={loading}
            >
              Export
            </Button>
          </Tooltip>
        )}
        
        {/* Print button */}
        {onPrint && (
          <Tooltip title="Print spreadsheet">
            <Button
              icon={<PrinterOutlined />}
              onClick={onPrint}
              disabled={loading}
            >
              Print
            </Button>
          </Tooltip>
        )}
        
        {/* Refresh button */}
        {onRefresh && (
          <Tooltip title="Reload data">
            <Button
              icon={loading ? <LoadingOutlined /> : <ReloadOutlined />}
              onClick={onRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Tooltip>
        )}

        {/* Any extra controls */}
        {extraControls.map((control, index) => (
          <React.Fragment key={`extra-control-${index}`}>
            {control}
          </React.Fragment>
        ))}
      </Space>
    </div>
  );
};

SpreadsheetControls.propTypes = {
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onYearChange: PropTypes.func,
  onSave: PropTypes.func,
  onPrint: PropTypes.func,
  onExport: PropTypes.func,
  onRefresh: PropTypes.func,
  saving: PropTypes.bool,
  loading: PropTypes.bool,
  extraControls: PropTypes.array
};

export default SpreadsheetControls; 