import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Skeleton, Divider } from 'antd';
import { 
  ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, 
  ShoppingOutlined, UserOutlined, PercentageOutlined
} from '@ant-design/icons';
import { useEconomy } from '../../contexts/EconomyContext';
import './EconomyOverview.css';

const { Title, Text } = Typography;

const EconomyOverview = () => {
  const { currentYear, getFinancialMetrics } = useEconomy();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalExpenses: 0,
    profit: 0,
    profitMargin: 0,
    salesGrowth: 0,
    expenseGrowth: 0,
    largestExpenseCategory: '',
    largestExpenseAmount: 0,
    topSellingCategory: '',
    topSellingAmount: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // In a real app, this would come from the EconomyContext
        // For now we'll simulate it with sample data
        const data = await simulateFetchMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching economic metrics', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [currentYear]);

  // Simulate API call - would be replaced with real API in production
  const simulateFetchMetrics = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalSales: 125750.87,
          totalExpenses: 92430.56,
          profit: 33320.31,
          profitMargin: 26.5,
          salesGrowth: 12.3,
          expenseGrowth: 8.7,
          largestExpenseCategory: 'Μισθοδοσία',
          largestExpenseAmount: 48350.75,
          topSellingCategory: 'Υπηρεσίες',
          topSellingAmount: 78450.32
        });
      }, 1000);
    });
  };

  return (
    <div className="economy-overview-section">
      <div className="section-header">
        <Title level={4}>Οικονομική Επισκόπηση {currentYear}</Title>
        <Text type="secondary">Συνοπτική απεικόνιση των βασικών οικονομικών μεγεθών</Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* Main financial cards */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="metric-card">
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Συνολικές Πωλήσεις"
                value={metrics.totalSales}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                suffix="€"
              />
            )}
            {!loading && (
              <div className="metric-trend">
                <Text 
                  type={metrics.salesGrowth >= 0 ? "success" : "danger"}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {metrics.salesGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(metrics.salesGrowth)}% από πέρυσι
                </Text>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="metric-card">
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Συνολικά Έξοδα"
                value={metrics.totalExpenses}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={<ShoppingOutlined />}
                suffix="€"
              />
            )}
            {!loading && (
              <div className="metric-trend">
                <Text 
                  type={metrics.expenseGrowth <= 0 ? "success" : "danger"}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {metrics.expenseGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {Math.abs(metrics.expenseGrowth)}% από πέρυσι
                </Text>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="metric-card">
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Καθαρό Κέρδος"
                value={metrics.profit}
                precision={2}
                valueStyle={{ color: metrics.profit >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={metrics.profit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix="€"
              />
            )}
            {!loading && (
              <div className="metric-progress">
                <Text>Περιθώριο Κέρδους</Text>
                <Progress 
                  percent={metrics.profitMargin} 
                  size="small" 
                  status={metrics.profitMargin >= 20 ? "success" : metrics.profitMargin >= 10 ? "normal" : "exception"}
                />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className="metric-card">
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Περιθώριο Κέρδους"
                value={metrics.profitMargin}
                precision={1}
                valueStyle={{ color: '#722ed1' }}
                prefix={<PercentageOutlined />}
                suffix="%"
              />
            )}
            {!loading && (
              <div className="metric-description">
                <Text type="secondary">
                  {metrics.profitMargin >= 25 ? 'Εξαιρετικό' : 
                   metrics.profitMargin >= 15 ? 'Καλό' : 
                   metrics.profitMargin >= 10 ? 'Μέτριο' : 'Χρειάζεται βελτίωση'}
                </Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Additional metrics */}
        <Col xs={24} sm={12}>
          <Card title="Μεγαλύτερη Κατηγορία Εξόδων" className="category-card">
            {loading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <>
                <div className="category-header">
                  <Text strong>{metrics.largestExpenseCategory}</Text>
                  <Text>{metrics.largestExpenseAmount.toFixed(2)}€</Text>
                </div>
                <Progress 
                  percent={(metrics.largestExpenseAmount / metrics.totalExpenses * 100).toFixed(1)} 
                  status="exception" 
                />
                <Text type="secondary">
                  {(metrics.largestExpenseAmount / metrics.totalExpenses * 100).toFixed(1)}% των συνολικών εξόδων
                </Text>
              </>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card title="Κορυφαία Κατηγορία Πωλήσεων" className="category-card">
            {loading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
              <>
                <div className="category-header">
                  <Text strong>{metrics.topSellingCategory}</Text>
                  <Text>{metrics.topSellingAmount.toFixed(2)}€</Text>
                </div>
                <Progress 
                  percent={(metrics.topSellingAmount / metrics.totalSales * 100).toFixed(1)} 
                  status="success" 
                />
                <Text type="secondary">
                  {(metrics.topSellingAmount / metrics.totalSales * 100).toFixed(1)}% των συνολικών πωλήσεων
                </Text>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EconomyOverview; 