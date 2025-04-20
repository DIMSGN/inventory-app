/**
 * Main dashboard component
 * @module components/Dashboard
 */

import React from 'react';
import BaseDashboard from '../BaseDashboard';
import StatsCard from '../StatsCard';
import ActionCard from '../ActionCard';
import styles from './Dashboard.module.css';
import { useDashboardData } from '../../hooks';
import { getDashboardActions } from '../../utils/dashboardUtils';
import { useDashboardContext } from '../../contexts/DashboardContext';
import { 
  FaChartLine, 
  FaBox, 
  FaUtensils, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaDollarSign,
  FaShoppingCart
} from 'react-icons/fa';

// Import RuleIndicator from Inventory feature
import { RuleIndicator } from '../../../Inventory/components';

/**
 * Dashboard component that displays a comprehensive overview of the restaurant/hotel
 * 
 * @returns {JSX.Element} Dashboard component
 */
const Dashboard = () => {
  const { userRole, userName } = useDashboardContext();
  const { stats, isLoading, error, refresh } = useDashboardData();
  
  // Get actions based on user role
  const dashboardActions = getDashboardActions(userRole);
  
  // Mock data for demonstration - in real app, this would come from the API
  const revenueData = {
    today: 1250,
    thisWeek: 8750,
    thisMonth: 32400,
    percentChange: 8.5
  };
  
  const topSellingItems = [
    { name: 'Grilled Salmon', count: 48, revenue: 960 },
    { name: 'House Special Pasta', count: 42, revenue: 630 },
    { name: 'Ribeye Steak', count: 36, revenue: 1080 },
    { name: 'Seafood Platter', count: 30, revenue: 1050 },
    { name: 'Chocolate Dessert', count: 55, revenue: 385 }
  ];
  
  const inventoryAlerts = [
    { id: 1, product_id: '101', product_name: 'Fresh Tomatoes', amount: 5, threshold: 10 },
    { id: 2, product_id: '203', product_name: 'Olive Oil', amount: 2, threshold: 5 },
    { id: 3, product_id: '305', product_name: 'Chicken Breast', amount: 8, threshold: 15 },
    { id: 4, product_id: '418', product_name: 'White Wine', amount: 3, threshold: 6 }
  ];
  
  const profitMarginData = {
    food: { revenue: 28400, cost: 11360 },
    beverages: { revenue: 12500, cost: 4375 },
    desserts: { revenue: 6800, cost: 2040 }
  };
  
  const occupancyRate = 72; // Percentage
  
  return (
    <BaseDashboard title="Dashboard Overview" username={userName}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
          <button onClick={refresh} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}
      
      {/* Main dashboard grid layout */}
      <div className={styles.dashboardGrid}>
        {/* Economic Analytics Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <FaChartLine className={styles.sectionIcon} />
            <h2>Economic Analytics</h2>
          </div>
          
          <div className={styles.cardGrid}>
            {/* Revenue Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Revenue</h3>
                <FaDollarSign />
              </div>
              <div className={styles.revenueStats}>
                <div className={styles.revenueStat}>
                  <span className={styles.revenueLabel}>Today</span>
                  <span className={styles.revenueValue}>${revenueData.today}</span>
                </div>
                <div className={styles.revenueStat}>
                  <span className={styles.revenueLabel}>This Week</span>
                  <span className={styles.revenueValue}>${revenueData.thisWeek}</span>
                </div>
                <div className={styles.revenueStat}>
                  <span className={styles.revenueLabel}>This Month</span>
                  <span className={styles.revenueValue}>${revenueData.thisMonth}</span>
                </div>
                <div className={styles.revenueChange}>
                  <span className={`${styles.percentChange} ${revenueData.percentChange >= 0 ? styles.positive : styles.negative}`}>
                    {revenueData.percentChange >= 0 ? '+' : ''}{revenueData.percentChange}%
                  </span>
                  <span>vs. Last Month</span>
                </div>
              </div>
              <div className={styles.chartPlaceholder}>
                {/* Revenue Chart would go here */}
                <div className={styles.mockChart}>
                  <div className={styles.mockBar} style={{ height: '60%' }}></div>
                  <div className={styles.mockBar} style={{ height: '45%' }}></div>
                  <div className={styles.mockBar} style={{ height: '75%' }}></div>
                  <div className={styles.mockBar} style={{ height: '80%' }}></div>
                  <div className={styles.mockBar} style={{ height: '65%' }}></div>
                  <div className={styles.mockBar} style={{ height: '90%' }}></div>
                  <div className={styles.mockBar} style={{ height: '70%' }}></div>
                </div>
              </div>
            </div>
            
            {/* Top Selling Items */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Top Selling Items</h3>
                <FaShoppingCart />
              </div>
              <div className={styles.itemList}>
                {topSellingItems.map((item, index) => (
                  <div key={index} className={styles.item}>
                    <span className={styles.itemRank}>{index + 1}</span>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemCount}>{item.count} sold</span>
                    <span className={styles.itemRevenue}>${item.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Profit Margin Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Profit Margin</h3>
                <FaChartLine />
              </div>
              <div className={styles.chartPlaceholder}>
                {/* Pie Chart would go here */}
                <div className={styles.mockPieChart}>
                  <div className={styles.mockPieSlice} style={{ transform: 'rotate(0deg)', background: 'conic-gradient(#4CAF50 0% 60%, transparent 60% 100%)' }}></div>
                  <div className={styles.mockPieSlice} style={{ transform: 'rotate(216deg)', background: 'conic-gradient(#2196F3 0% 25%, transparent 25% 100%)' }}></div>
                  <div className={styles.mockPieSlice} style={{ transform: 'rotate(306deg)', background: 'conic-gradient(#FFC107 0% 15%, transparent 15% 100%)' }}></div>
                </div>
              </div>
              <div className={styles.profitStats}>
                <div className={styles.profitStat}>
                  <span className={styles.profitDot} style={{ backgroundColor: '#4CAF50' }}></span>
                  <span className={styles.profitCategory}>Food</span>
                  <span className={styles.profitValue}>
                    {Math.round((profitMarginData.food.revenue - profitMarginData.food.cost) / profitMarginData.food.revenue * 100)}%
                  </span>
                </div>
                <div className={styles.profitStat}>
                  <span className={styles.profitDot} style={{ backgroundColor: '#2196F3' }}></span>
                  <span className={styles.profitCategory}>Beverages</span>
                  <span className={styles.profitValue}>
                    {Math.round((profitMarginData.beverages.revenue - profitMarginData.beverages.cost) / profitMarginData.beverages.revenue * 100)}%
                  </span>
                </div>
                <div className={styles.profitStat}>
                  <span className={styles.profitDot} style={{ backgroundColor: '#FFC107' }}></span>
                  <span className={styles.profitCategory}>Desserts</span>
                  <span className={styles.profitValue}>
                    {Math.round((profitMarginData.desserts.revenue - profitMarginData.desserts.cost) / profitMarginData.desserts.revenue * 100)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Occupancy Card (for hotels) */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Room Occupancy</h3>
                <FaCalendarAlt />
              </div>
              <div className={styles.occupancyDisplay}>
                <div className={styles.occupancyRate}>
                  <svg viewBox="0 0 36 36" className={styles.occupancyCircle}>
                    <path
                      className={styles.occupancyCircleBg}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={styles.occupancyCircleFill}
                      strokeDasharray={`${occupancyRate}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className={styles.occupancyText}>{occupancyRate}%</text>
                  </svg>
                </div>
                <div className={styles.occupancyDetails}>
                  <div className={styles.occupancyDetail}>
                    <span className={styles.detailLabel}>Rooms Occupied</span>
                    <span className={styles.detailValue}>36/50</span>
                  </div>
                  <div className={styles.occupancyDetail}>
                    <span className={styles.detailLabel}>Check-ins Today</span>
                    <span className={styles.detailValue}>8</span>
                  </div>
                  <div className={styles.occupancyDetail}>
                    <span className={styles.detailLabel}>Check-outs Today</span>
                    <span className={styles.detailValue}>5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Inventory & Stock Alerts Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <FaBox className={styles.sectionIcon} />
            <h2>Inventory & Stock Alerts</h2>
          </div>
          
          <div className={styles.inventorySection}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Low Stock Alerts</h3>
                <FaExclamationTriangle />
              </div>
              
              {inventoryAlerts.length > 0 ? (
                <div className={styles.alertsTable}>
                  <div className={styles.alertsTableHeader}>
                    <div className={styles.alertsTableHeaderItem}>Item</div>
                    <div className={styles.alertsTableHeaderItem}>Current Stock</div>
                    <div className={styles.alertsTableHeaderItem}>Threshold</div>
                    <div className={styles.alertsTableHeaderItem}>Status</div>
                  </div>
                  {inventoryAlerts.map(item => (
                    <div key={item.id} className={styles.alertsTableRow}>
                      <div className={styles.alertsTableItem}>{item.product_name}</div>
                      <div className={styles.alertsTableItem}>{item.amount}</div>
                      <div className={styles.alertsTableItem}>{item.threshold}</div>
                      <div className={styles.alertsTableItem}>
                        <RuleIndicator 
                          productId={item.product_id}
                          amount={item.amount}
                          size="small"
                        />
                        <span className={styles.alertStatus}>
                          {item.amount <= item.threshold / 2 ? 'Critical' : 'Low'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noAlerts}>No stock alerts currently</div>
              )}
              
              <div className={styles.actionButtonRow}>
                <button className={styles.viewAllButton}>View All Inventory</button>
                <button className={styles.updateButton}>Add New Stock</button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Menu & Recipes Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <FaUtensils className={styles.sectionIcon} />
            <h2>Menu & Recipes</h2>
          </div>
          
          <div className={styles.recipesSection}>
            <ActionCard 
              title="Quick Actions"
              actions={dashboardActions}
            />
            
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Popular Recipes</h3>
              </div>
              <div className={styles.recipesGrid}>
                <div className={styles.recipeCard}>
                  <div className={styles.recipeImagePlaceholder}></div>
                  <h4>Grilled Salmon</h4>
                </div>
                <div className={styles.recipeCard}>
                  <div className={styles.recipeImagePlaceholder}></div>
                  <h4>House Special Pasta</h4>
                </div>
                <div className={styles.recipeCard}>
                  <div className={styles.recipeImagePlaceholder}></div>
                  <h4>Ribeye Steak</h4>
                </div>
                <div className={styles.recipeCard}>
                  <div className={styles.recipeImagePlaceholder}></div>
                  <h4>Chocolate Dessert</h4>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </BaseDashboard>
  );
};

export default Dashboard; 