import React from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './Dashboard.module.css';
import { FaBoxOpen, FaExclamationTriangle, FaTag, FaTags, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const { products, rules, categories } = useAppContext();
  
  // Calculate total inventory value
  const totalValue = products.reduce((sum, product) => {
    return sum + (product.price * product.amount);
  }, 0);
  
  // Get low stock items based on rules
  const getLowStockItems = () => {
    const lowStockItems = [];
    
    // Check each product against applicable rules
    products.forEach(product => {
      const productRules = rules.filter(rule => rule.product_id === product.product_id);
      
      productRules.forEach(rule => {
        let isTriggered = false;
        
        switch (rule.comparison) {
          case '<':
            isTriggered = product.amount < rule.amount;
            break;
          case '<=':
            isTriggered = product.amount <= rule.amount;
            break;
          case '>':
            isTriggered = product.amount > rule.amount;
            break;
          case '>=':
            isTriggered = product.amount >= rule.amount;
            break;
          case '=':
          case '==':
            isTriggered = product.amount === rule.amount;
            break;
          default:
            break;
        }
        
        if (isTriggered) {
          lowStockItems.push({
            product,
            rule
          });
        }
      });
    });
    
    return lowStockItems;
  };
  
  const lowStockItems = getLowStockItems();
  
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      
      <div className={styles.statsGrid}>
        {/* Total Products */}
        <div className={`${styles.statCard} ${styles.products}`}>
          <div className={styles.statIcon}>
            <FaBoxOpen />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Products</h3>
            <p className={styles.statValue}>{products.length}</p>
          </div>
        </div>
        
        {/* Product Categories */}
        <div className={`${styles.statCard} ${styles.categories}`}>
          <div className={styles.statIcon}>
            <FaTags />
          </div>
          <div className={styles.statInfo}>
            <h3>Categories</h3>
            <p className={styles.statValue}>{categories.length}</p>
          </div>
        </div>
        
        {/* Inventory Value */}
        <div className={`${styles.statCard} ${styles.value}`}>
          <div className={styles.statIcon}>
            <FaChartLine />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Value</h3>
            <p className={styles.statValue}>${totalValue.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Low Stock Alerts */}
        <div className={`${styles.statCard} ${styles.alerts}`}>
          <div className={styles.statIcon}>
            <FaExclamationTriangle />
          </div>
          <div className={styles.statInfo}>
            <h3>Stock Alerts</h3>
            <p className={styles.statValue}>{lowStockItems.length}</p>
          </div>
        </div>
      </div>
      
      {/* Low Stock Items */}
      {lowStockItems.length > 0 && (
        <div className={styles.alertsSection}>
          <h2>Stock Alerts</h2>
          <div className={styles.alertsList}>
            {lowStockItems.map(({ product, rule }, index) => (
              <div 
                key={index} 
                className={styles.alertItem}
                style={{ borderLeft: `4px solid ${rule.color}` }}
              >
                <h3>{product.product_name}</h3>
                <div className={styles.alertDetails}>
                  <span>Current Stock: {product.amount}</span>
                  <span>Threshold: {rule.comparison} {rule.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 