import React, { useState, useEffect } from 'react';
import { Tabs, Button, message } from 'antd';
import { useAppContext } from '../../../../common/contexts/AppContext';
import styles from '../../../styles/Economy.module.css';
import { 
  FaChartLine, FaMoneyBillWave, FaShoppingCart, 
  FaWarehouse, FaTruckLoading, FaFileInvoiceDollar,
  FaCashRegister, FaClipboardList, FaReceipt
} from 'react-icons/fa';
import SuppliersList from './SuppliersList';
import InvoicesList from './InvoicesList';
import FinancialReports from './FinancialReports';
import SalesRecording from './SalesRecording';
import ExpenseManagement from '../Expenses/ExpenseManagement';

const { TabPane } = Tabs;

const Economy = () => {
  const { products } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [economySummary, setEconomySummary] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    inventoryValue: 0
  });
  const [loading, setLoading] = useState(false);
  
  // Calculate total inventory value and fetch summary data on load
  useEffect(() => {
    // Calculate inventory value moved inside useEffect
    const calculateInventoryValue = () => {
      const totalValue = products.reduce((sum, product) => {
        return sum + (product.purchase_price * product.amount);
      }, 0);
      
      setEconomySummary(prev => ({
        ...prev,
        inventoryValue: totalValue
      }));
    };
    
    calculateInventoryValue();
    fetchEconomyData();
  }, [products]);
  
  const fetchEconomyData = async () => {
    setLoading(true);
    try {
      // In a production app, you would fetch real financial data here
      // For now, we're using mock data
      
      // This would be replaced with a real API call, e.g.:
      // const response = await axios.get(`${apiUrl}/financial/summary`);
      // setEconomySummary(response.data);
      
      // Mock data for demonstration
      setTimeout(() => {
        setEconomySummary(prev => ({
          ...prev,
          revenue: 125750.50,
          expenses: 78235.25,
          profit: 47515.25
        }));
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching economy data:', error);
      message.error('Failed to load financial data');
      setLoading(false);
    }
  };
  
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  
  return (
    <div className={styles.economy}>
      <h1 className={styles.title}>Economy Management</h1>
      
      <Tabs activeKey={activeTab} onChange={handleTabChange} className={styles.tabs}>
        <TabPane tab="Overview" key="overview">
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.inventoryValue}`}>
              <div className={styles.statIcon}>
                <FaWarehouse />
              </div>
              <div className={styles.statInfo}>
                <h3>Inventory Value</h3>
                <p className={styles.statValue}>${economySummary.inventoryValue.toFixed(2)}</p>
              </div>
            </div>
            
            <div className={`${styles.statCard} ${styles.revenue}`}>
              <div className={styles.statIcon}>
                <FaMoneyBillWave />
              </div>
              <div className={styles.statInfo}>
                <h3>Total Revenue</h3>
                <p className={styles.statValue}>${economySummary.revenue.toFixed(2)}</p>
              </div>
            </div>
            
            <div className={`${styles.statCard} ${styles.expenses}`}>
              <div className={styles.statIcon}>
                <FaShoppingCart />
              </div>
              <div className={styles.statInfo}>
                <h3>Total Expenses</h3>
                <p className={styles.statValue}>${economySummary.expenses.toFixed(2)}</p>
              </div>
            </div>
            
            <div className={`${styles.statCard} ${styles.profit}`}>
              <div className={styles.statIcon}>
                <FaChartLine />
              </div>
              <div className={styles.statInfo}>
                <h3>Net Profit</h3>
                <p className={styles.statValue}>${economySummary.profit.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className={styles.actionLinks}>
            <Button 
              type="primary" 
              icon={<FaReceipt />} 
              onClick={() => setActiveTab('financial-reports')}
              className={styles.actionButton}
            >
              View Financial Reports
            </Button>
            
            <Button 
              type="primary" 
              icon={<FaCashRegister />} 
              onClick={() => setActiveTab('sales')}
              className={styles.actionButton}
            >
              Record Sales
            </Button>
            
            <Button 
              type="primary" 
              icon={<FaClipboardList />} 
              onClick={() => setActiveTab('expenses')}
              className={styles.actionButton}
            >
              Manage Expenses
            </Button>
            
            <Button 
              type="default" 
              onClick={() => fetchEconomyData()} 
              loading={loading}
              className={styles.actionButton}
            >
              Refresh Financial Data
            </Button>
          </div>
        </TabPane>
        
        <TabPane tab={<span><FaReceipt /> Financial Reports</span>} key="financial-reports">
          <FinancialReports />
        </TabPane>
        
        <TabPane tab={<span><FaCashRegister /> Sales Recording</span>} key="sales">
          <SalesRecording />
        </TabPane>
        
        <TabPane tab={<span><FaClipboardList /> Expenses</span>} key="expenses">
          <ExpenseManagement />
        </TabPane>
        
        <TabPane tab={<span><FaTruckLoading /> Suppliers</span>} key="suppliers">
          <SuppliersList />
        </TabPane>
        
        <TabPane tab={<span><FaFileInvoiceDollar /> Invoices</span>} key="invoices">
          <InvoicesList />
        </TabPane>
        
      </Tabs>
    </div>
  );
};

export default Economy; 