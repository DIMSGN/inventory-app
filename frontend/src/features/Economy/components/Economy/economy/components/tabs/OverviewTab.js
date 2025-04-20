import React from 'react';
import { Button } from 'antd';
import { 
  FaChartLine, FaMoneyBillWave, FaShoppingCart, 
  FaWarehouse, FaReceipt, FaCashRegister, FaClipboardList
} from 'react-icons/fa';
import styles from '../../../../../styles/Economy.module.css';

/**
 * Overview Tab Component
 * @param {Object} props - Component props
 * @param {Object} props.economySummary - Economic data summary
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onRefresh - Refresh data handler
 * @param {Function} props.onTabChange - Tab change handler
 * @returns {JSX.Element} OverviewTab component
 */
const OverviewTab = ({ 
  economySummary, 
  loading, 
  onRefresh, 
  onTabChange 
}) => {
  return (
    <>
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
          onClick={() => onTabChange('financial-reports')}
          className={styles.actionButton}
        >
          View Financial Reports
        </Button>
        
        <Button 
          type="primary" 
          icon={<FaCashRegister />} 
          onClick={() => onTabChange('sales')}
          className={styles.actionButton}
        >
          Record Sales
        </Button>
        
        <Button 
          type="primary" 
          icon={<FaClipboardList />} 
          onClick={() => onTabChange('expenses')}
          className={styles.actionButton}
        >
          Manage Expenses
        </Button>
        
        <Button 
          type="default" 
          onClick={onRefresh} 
          loading={loading}
          className={styles.actionButton}
        >
          Refresh Financial Data
        </Button>
      </div>
    </>
  );
};

export default OverviewTab; 