import React from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './Economy.module.css';
import { FaChartLine, FaMoneyBillWave, FaShoppingCart, FaWarehouse } from 'react-icons/fa';

const Economy = () => {
  const { products } = useAppContext();
  
  // Calculate total inventory value
  const totalInventoryValue = products.reduce((sum, product) => {
    return sum + (product.price * product.amount);
  }, 0);
  
  // Mock data for the economy view - would be replaced with real data in a full implementation
  const mockEconomyData = {
    revenue: 125750.50,
    expenses: 78235.25,
    profit: 47515.25,
    projectedSales: 32150.75
  };
  
  return (
    <div className={styles.economy}>
      <h1 className={styles.title}>Economy Overview</h1>
      
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.inventoryValue}`}>
          <div className={styles.statIcon}>
            <FaWarehouse />
          </div>
          <div className={styles.statInfo}>
            <h3>Inventory Value</h3>
            <p className={styles.statValue}>${totalInventoryValue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.revenue}`}>
          <div className={styles.statIcon}>
            <FaMoneyBillWave />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Revenue</h3>
            <p className={styles.statValue}>${mockEconomyData.revenue.toFixed(2)}</p>
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.expenses}`}>
          <div className={styles.statIcon}>
            <FaShoppingCart />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Expenses</h3>
            <p className={styles.statValue}>${mockEconomyData.expenses.toFixed(2)}</p>
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.profit}`}>
          <div className={styles.statIcon}>
            <FaChartLine />
          </div>
          <div className={styles.statInfo}>
            <h3>Net Profit</h3>
            <p className={styles.statValue}>${mockEconomyData.profit.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div className={styles.comingSoon}>
        <h2>Coming Soon</h2>
        <p>The Economy module is under development. Future features will include:</p>
        <ul>
          <li>Revenue tracking and projections</li>
          <li>Expense management</li>
          <li>Sales analytics</li>
          <li>Financial reports</li>
          <li>Integration with accounting software</li>
        </ul>
      </div>
    </div>
  );
};

export default Economy; 