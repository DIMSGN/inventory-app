import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Breadcrumb, Divider, Tabs, 
  Typography, Space
} from 'antd';
import { Link } from 'react-router-dom';
import { 
  HomeOutlined, LineChartOutlined, FileTextOutlined, 
  DatabaseOutlined, DollarOutlined, ShoppingOutlined,
  BarChartOutlined, UserOutlined, AppstoreOutlined
} from '@ant-design/icons';
import { useEconomy } from '../contexts/EconomyContext';
import EconomyOverview from '../components/Dashboard/EconomyOverview';
import './DashboardPage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DashboardPage = () => {
  const { currentYear } = useEconomy();
  
  return (
    <div className="economy-dashboard-container">
      <Breadcrumb className="economy-breadcrumb">
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <LineChartOutlined /> Economy
        </Breadcrumb.Item>
      </Breadcrumb>
      
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Title level={2}>Οικονομική Διαχείριση</Title>
          <Text type="secondary">Διαχειριστείτε οικονομικά στοιχεία, έσοδα, έξοδα και αναφορές</Text>
        </div>
      </div>
      
      {/* Economic Overview Dashboard */}
      <EconomyOverview />
      
      {/* Quick Actions */}
      <div className="quick-actions-section">
        <Title level={4}>Γρήγορες Ενέργειες</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={6}>
            <Card 
              className="quick-action-card"
              hoverable
            >
              <Link to="/economy/sales/new" className="card-link">
                <div className="quick-action-content">
                  <DollarOutlined className="quick-action-icon sales-icon" />
                  <div className="quick-action-text">
                    <Text strong>Καταχώριση Πωλήσεων</Text>
                    <Text type="secondary">Προσθήκη νέων πωλήσεων</Text>
                  </div>
                </div>
              </Link>
            </Card>
          </Col>
          
          <Col xs={24} sm={8} md={6}>
            <Card 
              className="quick-action-card"
              hoverable
            >
              <Link to="/economy/expenses/operating" className="card-link">
                <div className="quick-action-content">
                  <ShoppingOutlined className="quick-action-icon expenses-icon" />
                  <div className="quick-action-text">
                    <Text strong>Λειτουργικά Έξοδα</Text>
                    <Text type="secondary">Καταχώριση εξόδων</Text>
                  </div>
                </div>
              </Link>
            </Card>
          </Col>
          
          <Col xs={24} sm={8} md={6}>
            <Card 
              className="quick-action-card"
              hoverable
            >
              <Link to="/economy/expenses/payroll" className="card-link">
                <div className="quick-action-content">
                  <UserOutlined className="quick-action-icon payroll-icon" />
                  <div className="quick-action-text">
                    <Text strong>Μισθοδοσία</Text>
                    <Text type="secondary">Διαχείριση πληρωμών</Text>
                  </div>
                </div>
              </Link>
            </Card>
          </Col>
          
          <Col xs={24} sm={8} md={6}>
            <Card 
              className="quick-action-card"
              hoverable
            >
              <Link to="/economy/financials" className="card-link">
                <div className="quick-action-content">
                  <DatabaseOutlined className="quick-action-icon financials-icon" />
                  <div className="quick-action-text">
                    <Text strong>Οικονομικά Στοιχεία</Text>
                    <Text type="secondary">Προβολή αναλυτικών στοιχείων</Text>
                  </div>
                </div>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* Financial Management Sections */}
      <div className="financial-sections">
        <Tabs defaultActiveKey="1" type="card" className="custom-tabs">
          <TabPane 
            tab={<span><BarChartOutlined /> Αναφορές</span>} 
            key="1"
          >
            <div className="tab-content">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                  <Card 
                    title="Μηνιαίες Αναφορές" 
                    className="section-card"
                    extra={<Link to="/economy/reports/monthly">Προβολή</Link>}
                  >
                    <p>Δείτε αναλυτικές μηνιαίες αναφορές για τα οικονομικά στοιχεία της επιχείρησης.</p>
                    <Button type="primary" block>
                      <Link to="/economy/reports/monthly">Προβολή Αναφορών</Link>
                    </Button>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={8}>
                  <Card 
                    title="Συγκριτικές Αναφορές" 
                    className="section-card"
                    extra={<Link to="/economy/reports/comparative">Προβολή</Link>}
                  >
                    <p>Συγκρίνετε οικονομικά στοιχεία μεταξύ διαφορετικών περιόδων.</p>
                    <Button type="primary" block>
                      <Link to="/economy/reports/comparative">Σύγκριση Περιόδων</Link>
                    </Button>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={8}>
                  <Card 
                    title="Εξαγωγή Δεδομένων" 
                    className="section-card"
                    extra={<Link to="/economy/reports/export">Εξαγωγή</Link>}
                  >
                    <p>Εξαγωγή οικονομικών στοιχείων σε Excel για περαιτέρω ανάλυση.</p>
                    <Button type="primary" block>
                      <Link to="/economy/reports/export">Εξαγωγή Δεδομένων</Link>
                    </Button>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
          
          <TabPane 
            tab={<span><AppstoreOutlined /> Διαχείριση</span>} 
            key="2"
          >
            <div className="tab-content">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                  <Card 
                    title="Πωλήσεις" 
                    className="section-card"
                    extra={<Link to="/economy/sales">Προβολή</Link>}
                  >
                    <p>Διαχειριστείτε τις πωλήσεις και δείτε αναλυτικά στοιχεία ανά κατηγορία.</p>
                    <Button type="primary" block>
                      <Link to="/economy/sales">Διαχείριση Πωλήσεων</Link>
                    </Button>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={8}>
                  <Card 
                    title="Έξοδα" 
                    className="section-card"
                    extra={<Link to="/economy/expenses">Προβολή</Link>}
                  >
                    <p>Διαχειριστείτε όλα τα έξοδα της επιχείρησης σε μία κεντρική σελίδα.</p>
                    <Button type="primary" block>
                      <Link to="/economy/expenses">Διαχείριση Εξόδων</Link>
                    </Button>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} lg={8}>
                  <Card 
                    title="Προμηθευτές" 
                    className="section-card"
                    extra={<Link to="/economy/suppliers">Προβολή</Link>}
                  >
                    <p>Διαχειριστείτε τους προμηθευτές και τις συναλλαγές με αυτούς.</p>
                    <Button type="primary" block>
                      <Link to="/economy/suppliers">Διαχείριση Προμηθευτών</Link>
                    </Button>
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage; 