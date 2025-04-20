import React from 'react';
import { Typography, DatePicker, Space, Tag } from 'antd';
import moment from 'moment';
import { formatDate } from '../utils/formatters';

const { Title, Text } = Typography;

/**
 * Header component for the financial spreadsheet
 * 
 * @param {Object} props - Component props
 * @param {string} props.yearMonth - Currently selected year and month
 * @param {Function} props.onYearMonthChange - Handler for year/month changes
 * @param {Date} props.lastUpdated - Last update timestamp
 * @param {boolean} props.isUsingMockData - Flag indicating if mock data is used
 * @returns {JSX.Element} SpreadsheetHeader component
 */
const SpreadsheetHeader = ({ 
  yearMonth, 
  onYearMonthChange, 
  lastUpdated, 
  isUsingMockData 
}) => {
  // Parse the current year-month
  const currentDate = yearMonth ? moment(yearMonth) : moment();
  
  // Available years for selection (current year +/- 2 years)
  const currentYear = currentDate.year();
  const availableYears = Array.from(
    { length: 5 }, 
    (_, i) => currentYear - 2 + i
  );
  
  return (
    <div className="spreadsheet-header">
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Title level={3}>Financial Spreadsheet</Title>
        
        <Space>
          <Text>Year/Month:</Text>
          <DatePicker
            picker="month"
            value={currentDate}
            onChange={onYearMonthChange}
            disabledDate={(date) => !availableYears.includes(date.year())}
          />
          
          {isUsingMockData && (
            <Tag color="orange">Demo Data</Tag>
          )}
        </Space>
        
        {lastUpdated && (
          <Text type="secondary">
            Last updated: {formatDate(lastUpdated)}
          </Text>
        )}
      </Space>
    </div>
  );
};

export default SpreadsheetHeader; 