import React, { useState } from 'react';
import { Tabs } from 'antd';
import styles from '../../../styles/Economy.module.css';
import SuppliersList from '../lists/SuppliersList';
import InvoicesList from '../lists/InvoicesList';
import ExpenseManagement from '../../Expenses/ExpenseManagement';

// Import components from their respective modules
import SalesRecording from '../sales';
import FinancialReports from '../reports';

// Import components and hooks from our modular structure
import { useEconomyData } from './hooks/useEconomyData';
import { OverviewTab } from './components/tabs';
import { TABS } from './utils/tabConfig';

const { TabPane } = Tabs;

/**
 * Main Economy component that serves as the entry point for economic functionality
 * @returns {JSX.Element} Economy component
 */
const Economy = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use our custom hook for economy data
  const { economySummary, loading, fetchEconomyData } = useEconomyData();
  
  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  
  return (
    <div className={styles.economy}>
      <h1 className={styles.title}>Economy Management</h1>
      
      <Tabs activeKey={activeTab} onChange={handleTabChange} className={styles.tabs}>
        <TabPane tab="Overview" key="overview">
          <OverviewTab 
            economySummary={economySummary}
            loading={loading}
            onRefresh={fetchEconomyData}
            onTabChange={handleTabChange}
          />
        </TabPane>
        
        {/* Financial Reports Tab */}
        <TabPane 
          tab={
            <span>
              {TABS[1].icon} {TABS[1].label}
            </span>
          } 
          key="financial-reports"
        >
          <FinancialReports />
        </TabPane>
        
        {/* Sales Recording Tab */}
        <TabPane 
          tab={
            <span>
              {TABS[2].icon} {TABS[2].label}
            </span>
          } 
          key="sales"
        >
          <SalesRecording />
        </TabPane>
        
        {/* Expenses Tab */}
        <TabPane 
          tab={
            <span>
              {TABS[3].icon} {TABS[3].label}
            </span>
          } 
          key="expenses"
        >
          <ExpenseManagement />
        </TabPane>
        
        {/* Suppliers Tab */}
        <TabPane 
          tab={
            <span>
              {TABS[4].icon} {TABS[4].label}
            </span>
          } 
          key="suppliers"
        >
          <SuppliersList />
        </TabPane>
        
        {/* Invoices Tab */}
        <TabPane 
          tab={
            <span>
              {TABS[5].icon} {TABS[5].label}
            </span>
          } 
          key="invoices"
        >
          <InvoicesList />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Economy; 