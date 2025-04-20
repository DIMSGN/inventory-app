import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tag, Space } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;

/**
 * Reusable header component for financial spreadsheets
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Spreadsheet title
 * @param {string} props.year - Current year displayed
 * @param {Date} props.lastUpdated - Last update timestamp
 * @param {boolean} props.isUsingMockData - Flag indicating if demo/mock data is being used
 * @param {ReactNode} props.controls - Control components to render
 * @returns {JSX.Element} SpreadsheetHeader component
 */
const SpreadsheetHeader = ({
  title,
  year,
  lastUpdated,
  isUsingMockData = false,
  controls
}) => {
  return (
    <div className="spreadsheet-header">
      <div className="spreadsheet-title">
        <Title level={3}>
          {title || `Financial Spreadsheet ${year}`}
          {isUsingMockData && (
            <Tag color="orange" style={{ marginLeft: 10 }}>
              DEMO DATA
            </Tag>
          )}
        </Title>
        
        {lastUpdated && (
          <Text type="secondary">
            Last updated: {moment(lastUpdated).format('DD/MM/YYYY HH:mm')}
          </Text>
        )}
      </div>
      
      {controls && (
        <div className="spreadsheet-controls-container">
          {controls}
        </div>
      )}
    </div>
  );
};

SpreadsheetHeader.propTypes = {
  title: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastUpdated: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  isUsingMockData: PropTypes.bool,
  controls: PropTypes.node
};

export default SpreadsheetHeader; 