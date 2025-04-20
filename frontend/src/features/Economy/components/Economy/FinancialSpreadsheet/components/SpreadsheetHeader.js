import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tag, Space, Button, Tooltip } from 'antd';
import {
  SaveOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { DatePickerField } from '../../../../../../common/components';

const { Title, Text } = Typography;

/**
 * SpreadsheetHeader component - displays title and control buttons
 */
const SpreadsheetHeader = ({
  title,
  year,
  lastUpdated,
  isUsingMockData,
  saving,
  onSave,
  onYearChange,
  onExport,
  onPrint,
  onRefresh,
  isLoading
}) => {
  const handleYearChange = (date) => {
    if (date && typeof onYearChange === 'function') {
      // Format the date to get just the year
      const selectedYear = moment(date).format('YYYY');
      onYearChange(selectedYear);
    }
  };

  return (
    <div className="spreadsheet-header">
      <div className="spreadsheet-title">
        <Title level={3}>
          {title || `Οικονομικά Στοιχεία ${year}`}
          {isUsingMockData && <Tag color="orange" style={{marginLeft: 10}}>DEMO DATA</Tag>}
        </Title>
        <Text type="secondary">
          {lastUpdated ? `Last updated: ${moment(lastUpdated).format('DD/MM/YYYY HH:mm')}` : ''}
        </Text>
      </div>
      
      <div className="spreadsheet-controls">
        <Space size="middle">
          <DatePickerField
            selected={moment(year, 'YYYY').toDate()}
            onChange={handleYearChange}
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
              onClick={onSave}
              loading={saving}
            >
              Save
            </Button>
          </Tooltip>
          
          <Tooltip title="Refresh data">
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={isLoading}
            >
              Refresh
            </Button>
          </Tooltip>
          
          <Tooltip title="Export to Excel">
            <Button 
              icon={<FileExcelOutlined />} 
              onClick={onExport}
              disabled={isLoading}
            >
              Export
            </Button>
          </Tooltip>
          
          <Tooltip title="Print spreadsheet">
            <Button 
              icon={<PrinterOutlined />} 
              onClick={onPrint}
              disabled={isLoading}
            >
              Print
            </Button>
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

SpreadsheetHeader.propTypes = {
  title: PropTypes.string,
  year: PropTypes.string.isRequired,
  lastUpdated: PropTypes.instanceOf(Date),
  isUsingMockData: PropTypes.bool,
  saving: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default SpreadsheetHeader; 