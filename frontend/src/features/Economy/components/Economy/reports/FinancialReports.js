import React from 'react';
import { Container, Card, Nav, Tab, Alert } from 'react-bootstrap';
import { FaChartLine, FaCalendarDay, FaCalendarAlt, FaTimes } from 'react-icons/fa';

// Import components and hooks
import { DateFilterForm, DailyReportTable, MonthlyReportTable } from './components';
import useReportData from './hooks/useReportData';

/**
 * Financial Reports component for displaying daily and monthly financial data
 * @returns {JSX.Element} FinancialReports component
 */
const FinancialReports = () => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    error,
    dateFilter,
    setDateFilter,
    filteredData,
    handleApplyFilter,
    handleClearFilter
  } = useReportData('daily');

  return (
    <Container fluid className="p-4">
      <Card className="shadow border-0">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0 d-flex align-items-center">
            <FaChartLine className="me-2" /> Financial Reports
          </h4>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger">
              <FaTimes className="me-2" /> {error}
            </Alert>
          )}
          
          <DateFilterForm
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />
          
          <Tab.Container 
            id="financial-reports-tabs" 
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
          >
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="daily">
                  <FaCalendarDay className="me-1" /> Daily Reports
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="monthly">
                  <FaCalendarAlt className="me-1" /> Monthly Reports
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Tab.Content>
              <Tab.Pane eventKey="daily">
                <DailyReportTable 
                  data={filteredData.daily} 
                  isLoading={isLoading && activeTab === 'daily'} 
                />
              </Tab.Pane>
              
              <Tab.Pane eventKey="monthly">
                <MonthlyReportTable 
                  data={filteredData.monthly} 
                  isLoading={isLoading && activeTab === 'monthly'} 
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FinancialReports; 