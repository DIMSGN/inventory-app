import React, { useState, useEffect } from 'react';
import ProductTable from '../components/ProductTable/ProductTable';
import RuleManager from '../components/RuleManager/RuleManager';
import { useLocation, Link } from 'react-router-dom';
import { Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import styles from './InventoryPage.module.css';

/**
 * Main Inventory page component
 * Serves as the entry point for the Inventory feature
 */
const InventoryPage = () => {
  const location = useLocation();
  const [view, setView] = useState('products');
  
  // Determine view based on URL path
  useEffect(() => {
    if (location.pathname.includes('/rules')) {
      setView('rules');
    } else {
      setView('products');
    }
  }, [location.pathname]);
  
  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.inventoryHeader}>
        <h1>{view === 'rules' ? 'Inventory Rules' : 'Product Inventory'}</h1>
        <Link to="/inventory/settings">
          <Button 
            type="primary" 
            icon={<SettingOutlined />}
          >
            Settings
          </Button>
        </Link>
      </div>
      
      {view === 'products' ? (
        <>
          <ProductTable />
          <div className={styles.ruleManagerContainer}>
            <RuleManager />
          </div>
        </>
      ) : (
        <RuleManager />
      )}
    </div>
  );
};

export default InventoryPage; 