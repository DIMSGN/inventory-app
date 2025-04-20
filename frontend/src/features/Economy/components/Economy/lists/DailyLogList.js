import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Space, Input, Select, DatePicker, 
  Typography, Tag, Popconfirm, Empty, Tooltip, message 
} from 'antd';
import { 
  DeleteOutlined, SearchOutlined, FilterOutlined, 
  ReloadOutlined, ClearOutlined, DownloadOutlined,
  ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useEconomy } from '../../contexts/EconomyContext';
import '../../styles/DailyLog.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DailyLogList = () => {
  const { financialData, deleteDailyLogEntry, isUsingMockData } = useEconomy();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: null,
    category: null,
    subcategory: null,
    searchText: ''
  });
  
  // Load entries whenever financialData changes
  useEffect(() => {
    if (financialData?.dailyLogs?.entries) {
      setEntries(financialData.dailyLogs.entries);
    } else {
      setEntries([]);
    }
  }, [financialData]);
  
  // Apply filters to entries
  const filteredEntries = entries.filter(entry => {
    // Date range filter
    if (filters.dateRange && filters.dateRange.length === 2) {
      const entryDate = moment(entry.date);
      const startDate = filters.dateRange[0];
      const endDate = filters.dateRange[1];
      
      if (!entryDate.isBetween(startDate, endDate, 'day', '[]')) {
        return false;
      }
    }
    
    // Category filter
    if (filters.category && entry.category !== filters.category) {
      return false;
    }
    
    // Subcategory filter
    if (filters.subcategory && entry.subcategory !== filters.subcategory) {
      return false;
    }
    
    // Search text filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const textMatch = 
        (entry.notes && entry.notes.toLowerCase().includes(searchLower)) ||
        (entry.subcategory && entry.subcategory.toLowerCase().includes(searchLower));
      
      if (!textMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort entries by date (newest first)
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    return moment(b.date).valueOf() - moment(a.date).valueOf();
  });
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      dateRange: null,
      category: null,
      subcategory: null,
      searchText: ''
    });
  };
  
  // Handle entry deletion
  const handleDeleteEntry = async (entryId) => {
    try {
      setLoading(true);
      const success = await deleteDailyLogEntry(entryId);
      
      if (success) {
        message.success('Entry deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      message.error('Failed to delete entry');
    } finally {
      setLoading(false);
    }
  };
  
  // Get unique subcategories for the selected category
  const getSubcategories = () => {
    const categoryEntries = entries.filter(entry => 
      !filters.category || entry.category === filters.category
    );
    
    const subcategories = [...new Set(categoryEntries.map(entry => entry.subcategory))];
    return subcategories;
  };
  
  // Table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: date => moment(date).format('YYYY-MM-DD'),
      sorter: (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: category => {
        const color = category === 'sales' ? 'green' : 'orange';
        const label = category === 'sales' ? 'Income' : 'Expense';
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        const amountFormatted = new Intl.NumberFormat('el-GR', {
          style: 'currency',
          currency: 'EUR'
        }).format(amount);
        
        const isIncome = record.category === 'sales';
        const color = isIncome ? '#3f8600' : '#cf1322';
        const icon = isIncome ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
        
        return (
          <Text style={{ color }}>
            {amountFormatted} {icon}
          </Text>
        );
      },
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: notes => {
        if (!notes) return '-';
        
        return (
          <Tooltip title={notes}>
            <span>{notes.length > 30 ? `${notes.substring(0, 30)}...` : notes}</span>
          </Tooltip>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this entry?"
            onConfirm={() => handleDeleteEntry(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              loading={loading}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];
  
  return (
    <Card title="Daily Financial Log" className="daily-log-list-card">
      <div className="daily-log-filters" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>
            <RangePicker 
              value={filters.dateRange}
              onChange={value => handleFilterChange('dateRange', value)}
              allowClear
              placeholder={['Start Date', 'End Date']}
            />
            
            <Select
              placeholder="Category"
              value={filters.category}
              onChange={value => {
                handleFilterChange('category', value);
                handleFilterChange('subcategory', null);
              }}
              style={{ width: 150 }}
              allowClear
            >
              <Option value="sales">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
            
            <Select
              placeholder="Subcategory"
              value={filters.subcategory}
              onChange={value => handleFilterChange('subcategory', value)}
              style={{ width: 150 }}
              allowClear
              disabled={!filters.category}
            >
              {getSubcategories().map(subcategory => (
                <Option key={subcategory} value={subcategory}>{subcategory}</Option>
              ))}
            </Select>
            
            <Input
              placeholder="Search notes"
              value={filters.searchText}
              onChange={e => handleFilterChange('searchText', e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 200 }}
            />
            
            <Button 
              onClick={handleClearFilters}
              icon={<ClearOutlined />}
            >
              Clear Filters
            </Button>
          </Space>
        </Space>
      </div>
      
      <Table
        columns={columns}
        dataSource={sortedEntries}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: <Empty description="No financial entries found" /> }}
      />
      
      <div className="daily-log-summary" style={{ marginTop: '20px' }}>
        <Text>Total entries: {sortedEntries.length}</Text>
        
        {sortedEntries.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <Space>
              <Text>
                Total Income: <Text type="success">
                  {new Intl.NumberFormat('el-GR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(
                    sortedEntries
                      .filter(entry => entry.category === 'sales')
                      .reduce((sum, entry) => sum + (entry.amount || 0), 0)
                  )}
                </Text>
              </Text>
              
              <Text>
                Total Expenses: <Text type="danger">
                  {new Intl.NumberFormat('el-GR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(
                    sortedEntries
                      .filter(entry => entry.category === 'expense')
                      .reduce((sum, entry) => sum + (entry.amount || 0), 0)
                  )}
                </Text>
              </Text>
            </Space>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DailyLogList; 