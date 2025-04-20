import React from 'react';
import { Table, Typography } from 'antd';
import { formatValue, getCellStyle } from '../utils';

const { Title } = Typography;

/**
 * TableSection component for displaying a section of financial data
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {Array} props.dataSource - Data for the table
 * @param {Array} props.columns - Column definitions
 * @param {string} props.emptyText - Text to display when data is empty
 * @returns {JSX.Element} TableSection component
 */
const TableSection = ({ title, dataSource = [], columns = [], emptyText = 'No data available' }) => {
  if (!dataSource || dataSource.length === 0) {
    return null;
  }

  // Calculate section total for the 'Total' column
  const sectionTotal = dataSource.reduce((sum, item) => sum + (item.total || 0), 0);
  
  // Add the total column to the columns array
  const columnsWithTotal = [
    ...columns,
    {
      title: 'ΣΥΝΟΛΟ',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (value, record) => {
        const isPercentage = record.isPercentage;
        
        return (
          <div style={getCellStyle(value, { isProfit: record.dataType === 'netProfit' || record.dataType === 'grossProfit', isPercentage })}>
            {formatValue(value, { isPercentage })}
          </div>
        );
      }
    }
  ];
  
  return (
    <div className="table-section">
      <Title level={4} className="section-title">{title}</Title>
      <Table
        dataSource={dataSource}
        columns={columnsWithTotal}
        pagination={false}
        size="small"
        bordered
        locale={{ emptyText }}
        rowClassName={(record) => 
          record.dataType === 'summary' ? 'summary-row' : 
          record.isPercentage ? 'percentage-row' : ''
        }
        summary={() => {
          if (dataSource.length <= 1 || ['summary', 'summary-section'].includes(dataSource[0]?.dataType)) {
            return null;
          }
          
          return (
            <Table.Summary fixed>
              <Table.Summary.Row className="section-total-row">
                <Table.Summary.Cell index={0}>ΣΥΝΟΛΟ</Table.Summary.Cell>
                {columns.slice(1).map((_, index) => (
                  <Table.Summary.Cell key={index} index={index + 1}>
                    {/* Calculate monthly totals */}
                    {index < 12 && (
                      <div style={getCellStyle(
                        dataSource.reduce((sum, item) => sum + (item.months[index] || 0), 0)
                      )}>
                        {formatValue(dataSource.reduce((sum, item) => sum + (item.months[index] || 0), 0))}
                      </div>
                    )}
                  </Table.Summary.Cell>
                ))}
                <Table.Summary.Cell index={columns.length}>
                  <div style={getCellStyle(sectionTotal)}>
                    {formatValue(sectionTotal)}
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default TableSection; 