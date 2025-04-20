import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaChartLine, FaBoxOpen, FaFileInvoiceDollar, FaHome, 
  FaSearch, FaBox, FaExclamationCircle, FaSync, FaClock 
} from 'react-icons/fa';
import styles from './ManagerDashboard.module.css';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState({
    todaySales: 0,
    weeklySales: 0,
    monthlySales: 0
  });
  
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({
    lowStock: 0,
    outOfStock: 0,
    expiringItems: 0,
    totalItems: 0
  });

  // Simulate data fetching
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setSalesData({
        todaySales: 1250.75,
        weeklySales: 8430.50,
        monthlySales: 32678.90
      });
      
      setTopSellingItems([
        { id: 1, name: 'Chicken Souvlaki', count: 48, revenue: 576.00 },
        { id: 2, name: 'Greek Salad', count: 36, revenue: 360.00 },
        { id: 3, name: 'Gyros Sandwich', count: 32, revenue: 320.00 },
        { id: 4, name: 'Tzatziki Dip', count: 28, revenue: 140.00 },
        { id: 5, name: 'Feta Cheese Plate', count: 22, revenue: 176.00 }
      ]);
      
      setCategorySales([
        { id: 1, name: 'Main Dishes', sales: 2450.75, icon: <FaBox /> },
        { id: 2, name: 'Appetizers', sales: 1245.50, icon: <FaBox /> },
        { id: 3, name: 'Desserts', sales: 875.25, icon: <FaBox /> },
        { id: 4, name: 'Beverages', sales: 1560.80, icon: <FaBox /> }
      ]);
      
      setInventoryStats({
        lowStock: 12,
        outOfStock: 5,
        expiringItems: 8,
        totalItems: 156
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  // Helper function to format currency
  const formatCurrency = (value) => {
    return '$' + value.toFixed(2);
  };

  // Render different tabs based on active tab
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <FaSync /> Loading dashboard data...
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'inventory':
        return renderInventoryTab();
      case 'financial':
        return renderFinancialTab();
      default:
        return renderOverviewTab();
    }
  };

  // Render the overview tab content
  const renderOverviewTab = () => {
    return (
      <>
        <div className={styles.salesSummary}>
          <h2>Sales Summary</h2>
          <div className={styles.salesCards}>
            <div className={styles.salesCard}>
              <div className={styles.salesCardHeader}>
                <FaChartLine />
                <h3>Today's Sales</h3>
              </div>
              <div className={styles.salesAmount}>{formatCurrency(salesData.todaySales)}</div>
              <div className={styles.salesChange}>+15% from yesterday</div>
            </div>
            <div className={styles.salesCard}>
              <div className={styles.salesCardHeader}>
                <FaChartLine />
                <h3>Weekly Sales</h3>
              </div>
              <div className={styles.salesAmount}>{formatCurrency(salesData.weeklySales)}</div>
              <div className={styles.salesChange}>+8% from last week</div>
            </div>
            <div className={styles.salesCard}>
              <div className={styles.salesCardHeader}>
                <FaChartLine />
                <h3>Monthly Sales</h3>
              </div>
              <div className={styles.salesAmount}>{formatCurrency(salesData.monthlySales)}</div>
              <div className={styles.salesChange}>+12% from last month</div>
            </div>
          </div>
        </div>

        <div className={styles.topSellingSection}>
          <h2>Top Selling Items</h2>
          <div className={styles.topSellingList}>
            {topSellingItems.map((item, index) => (
              <div key={item.id} className={styles.topSellingItem}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemRank}>{index + 1}</div>
                  <div className={styles.itemName}>{item.name}</div>
                </div>
                <div className={styles.itemStats}>
                  <div className={styles.itemCount}>{item.count} orders</div>
                  <div className={styles.itemRevenue}>{formatCurrency(item.revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.categorySalesSection}>
          <h2>Category Sales</h2>
          <div className={styles.categorySalesGrid}>
            {categorySales.map(category => (
              <div key={category.id} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>{category.icon}</div>
                <div className={styles.categoryName}>{category.name}</div>
                <div className={styles.categoryAmount}>{formatCurrency(category.sales)}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // Render the inventory tab content
  const renderInventoryTab = () => {
    return (
      <>
        <div className={styles.inventoryHeader}>
          <h2>Inventory Management</h2>
          <div className={styles.searchBar}>
            <FaSearch />
            <input type="text" placeholder="Search inventory..." />
          </div>
        </div>

        <div className={styles.inventoryStatsGrid}>
          <div className={styles.inventoryStatCard}>
            <div className={styles.statIcon}>
              <FaExclamationCircle />
            </div>
            <div className={styles.statLabel}>Low Stock Items</div>
            <div className={styles.statValue}>{inventoryStats.lowStock}</div>
            <Link to="/inventory/low-stock" className={styles.statLink}>View Items</Link>
          </div>
          <div className={styles.inventoryStatCard}>
            <div className={styles.statIcon}>
              <FaBox />
            </div>
            <div className={styles.statLabel}>Out of Stock</div>
            <div className={styles.statValue}>{inventoryStats.outOfStock}</div>
            <Link to="/inventory/out-of-stock" className={styles.statLink}>View Items</Link>
          </div>
          <div className={styles.inventoryStatCard}>
            <div className={styles.statIcon}>
              <FaClock />
            </div>
            <div className={styles.statLabel}>Expiring Soon</div>
            <div className={styles.statValue}>{inventoryStats.expiringItems}</div>
            <Link to="/inventory/expiring-soon" className={styles.statLink}>View Items</Link>
          </div>
          <div className={styles.inventoryStatCard}>
            <div className={styles.statIcon}>
              <FaBoxOpen />
            </div>
            <div className={styles.statLabel}>Total Items</div>
            <div className={styles.statValue}>{inventoryStats.totalItems}</div>
            <Link to="/inventory/all" className={styles.statLink}>View All</Link>
          </div>
        </div>

        <div className={styles.inventoryActionButtons}>
          <Link to="/inventory/add" className={styles.inventoryActionButton}>Add New Item</Link>
          <Link to="/inventory/update" className={styles.inventoryActionButton}>Update Stock</Link>
          <Link to="/inventory/orders" className={styles.inventoryActionButton}>Pending Orders</Link>
          <Link to="/inventory/suppliers" className={styles.inventoryActionButton}>Suppliers</Link>
        </div>
      </>
    );
  };

  // Render the financial tab content
  const renderFinancialTab = () => {
    return (
      <>
        <h2>Financial Reports</h2>
        <div className={styles.reportCards}>
          <div className={styles.reportCard}>
            <h3>Sales Report</h3>
            <p>View detailed sales reports with breakdowns by product, category, and time period. Export data for accounting and analysis.</p>
            <Link to="/financial/sales-report" className={styles.reportLink}>View Report</Link>
          </div>
          <div className={styles.reportCard}>
            <h3>Expense Report</h3>
            <p>Track all restaurant expenses including inventory purchases, utilities, rent, and labor costs. Monitor spending trends.</p>
            <Link to="/financial/expense-report" className={styles.reportLink}>View Report</Link>
          </div>
          <div className={styles.reportCard}>
            <h3>Profit & Loss</h3>
            <p>Comprehensive P&L statements showing revenue, costs, and profitability over time. Essential for business planning.</p>
            <Link to="/financial/profit-loss" className={styles.reportLink}>View Report</Link>
          </div>
          <div className={styles.reportCard}>
            <h3>Tax Documents</h3>
            <p>Access and prepare tax-related documents. Generate reports for quarterly and annual tax filings.</p>
            <Link to="/financial/tax-documents" className={styles.reportLink}>View Documents</Link>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <Link to="/" className={styles.homeButton}>
            <FaHome />
            Back to Home
          </Link>
        </div>
      </div>

      <div className={styles.dashboardTabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine />
          Overview
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'inventory' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <FaBoxOpen />
          Inventory
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'financial' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          <FaFileInvoiceDollar />
          Financial
        </button>
      </div>

      <div className={styles.dashboardContent}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ManagerDashboard; 