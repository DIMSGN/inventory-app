import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
// Font Awesome for modern, professional icons
import { 
  FaTachometerAlt, FaBox, FaClipboardList, FaQuestionCircle, FaBars,
  FaAngleLeft, FaAngleRight, FaSearch, FaChartLine,
  FaUtensils, FaUsersCog, FaGlassMartini, FaUserTie,
  FaAngleDown, FaAngleUp, FaFileInvoiceDollar, FaChartPie,
  FaMoneyBillWave, FaReceipt, FaGlobe
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ collapsed, onToggle, activeItem = 'dashboard', onNavigation }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    economy: location.pathname.includes('economy')
  });
  
  const handleItemClick = (event, item) => {
    // Prevent default and stop propagation to ensure the event doesn't bubble unexpectedly
    event.preventDefault();
    event.stopPropagation();
    
    // Check if the item has a submenu
    const menuItem = menuItems.find(mi => mi.id === item);
    if (menuItem && menuItem.submenu) {
      // Toggle the expanded state for this menu
      setExpandedMenus({
        ...expandedMenus,
        [item]: !expandedMenus[item]
      });
      return;
    }
    
    // Console log for debugging
    console.log("Sidebar navigation clicked:", item);
    
    // Navigate to the selected route
    if (onNavigation) {
      onNavigation(item);
    }
    
    // Close mobile sidebar when item clicked
    if (window.innerWidth < 992) {
      setMobileOpen(false);
    }
  };
  
  const handleSubmenuItemClick = (event, parentId, itemId) => {
    // Prevent default and stop propagation
    event.preventDefault();
    event.stopPropagation();
    
    console.log("Submenu item clicked:", itemId);
    
    // Navigate to the submenu item
    if (onNavigation) {
      onNavigation(itemId);
    }
    
    // Close mobile sidebar when item clicked
    if (window.innerWidth < 992) {
      setMobileOpen(false);
    }
  };
  
  const handleMobileToggle = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    console.log("Mobile toggle clicked, current state:", mobileOpen);
    setMobileOpen(!mobileOpen);
  };
  
  const handleHelpClick = () => {
    setShowHelpModal(true);
  };
  
  const closeHelpModal = () => {
    setShowHelpModal(false);
  };

  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'el' ? 'en' : 'el';
    i18n.changeLanguage(newLang);
  };
  
  // All menu items are now always visible regardless of user role
  const menuItems = [
    { id: 'dashboard', icon: <FaTachometerAlt />, label: t('general.dashboard') },
    { id: 'inventory', icon: <FaBox />, label: t('general.inventory') },
    { id: 'economy/financials', icon: <FaFileInvoiceDollar />, label: 'Economy' },
    { id: 'barman', icon: <FaGlassMartini />, label: 'Barman Dashboard' },
    { id: 'chef', icon: <FaUtensils />, label: 'Chef Dashboard' },
    { id: 'manager', icon: <FaUserTie />, label: 'Manager Dashboard' },
    // Added explicit link to recipes if it was restricted before
    { id: 'recipes', icon: <FaClipboardList />, label: t('general.foodRecipes') },
  ];
  
  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.submenu && item.submenu.some(subitem => 
      subitem.label.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );
  
  // Check if the current active item is a submenu item
  const isSubmenuItemActive = (parentId, itemId) => {
    return activeItem === itemId || location.pathname.includes(itemId);
  };
  
  return (
    <>
      {/* Mobile hamburger menu */}
      <button 
        className={styles.mobileToggle}
        onClick={(e) => handleMobileToggle(e)}
        aria-label="Toggle mobile menu"
      >
        <FaBars />
      </button>
      
      <aside className={`
        ${styles.sidebar} 
        ${collapsed ? styles.collapsed : ''}
        ${mobileOpen ? styles.mobileOpen : ''}
      `}>
        <div className={styles.sidebarContainer}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                {/* Stylized S Logo */}
                <svg
                  viewBox="0 0 100 100" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.logoSvg}
                >
                  {/* Main background color */}
                  <rect width="100" height="100" fill="transparent" />
                  
                  {/* First S shape (bottom layer) */}
                  <path
                    d="M33 20C33 20 48 20 55 20C62 20 67 25 67 32C67 39 62 44 55 44C48 44 45 44 45 44L45 56C45 56 48 56 55 56C62 56 67 61 67 68C67 75 62 80 55 80C48 80 33 80 33 80L33 68C33 68 48 68 50 68C52 68 55 66 55 63C55 60 52 58 50 58C48 58 45 58 45 58L45 42C45 42 48 42 50 42C52 42 55 40 55 37C55 34 52 32 50 32C48 32 33 32 33 32L33 20Z"
                    fill="#9333EA"
                  />
                  
                  {/* Second S shape (top layer) with slight offset */}
                  <path
                    d="M43 17C43 17 58 17 65 17C72 17 77 22 77 29C77 36 72 41 65 41C58 41 55 41 55 41L55 53C55 53 58 53 65 53C72 53 77 58 77 65C77 72 72 77 65 77C58 77 43 77 43 77L43 65C43 65 58 65 60 65C62 65 65 63 65 60C65 57 62 55 60 55C58 55 55 55 55 55L55 39C55 39 58 39 60 39C62 39 65 37 65 34C65 31 62 29 60 29C58 29 43 29 43 29L43 17Z"
                    fill="#7D25F6"
                  />
                </svg>
              </div>
              {!collapsed && (
                <div className={styles.logoText}>
                  <h1>Inventory</h1>
                  <p>Management System</p>
                </div>
              )}
            </div>
            <button 
              className={styles.toggleButton} 
              onClick={onToggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
            </button>
          </div>
          
          {!collapsed && (
            <div className={styles.searchContainer}>
              <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
          )}
          
          <nav className={styles.sidebarNav}>
            <ul className={styles.navList}>
              {filteredMenuItems.map(item => (
                <React.Fragment key={item.id}>
                  <li 
                    className={`
                      ${styles.navItem} 
                      ${activeItem === item.id || (item.submenu && item.submenu.some(subitem => isSubmenuItemActive(item.id, subitem.id))) ? styles.active : ''}
                      ${item.submenu ? styles.hasSubmenu : ''}
                      ${expandedMenus[item.id] ? styles.expanded : ''}
                    `}
                  >
                    <button 
                      className={styles.navLink}
                      onClick={(e) => handleItemClick(e, item.id)}
                      aria-current={activeItem === item.id ? "page" : undefined}
                      aria-expanded={item.submenu ? expandedMenus[item.id] : undefined}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className={styles.navText}>{item.label}</span>
                          {item.submenu && (
                            <span className={styles.submenuIndicator}>
                              {expandedMenus[item.id] ? <FaAngleUp /> : <FaAngleDown />}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && <span className={styles.tooltip}>{item.label}</span>}
                    </button>
                  </li>
                  
                  {/* Render submenu if expanded */}
                  {!collapsed && item.submenu && expandedMenus[item.id] && (
                    <li className={styles.submenuContainer}>
                      <ul className={styles.submenu}>
                        {item.submenu.map(subitem => (
                          <li 
                            key={subitem.id} 
                            className={`
                              ${styles.submenuItem}
                              ${isSubmenuItemActive(item.id, subitem.id) ? styles.active : ''}
                            `}
                          >
                            <button
                              className={styles.submenuLink}
                              onClick={(e) => handleSubmenuItemClick(e, item.id, subitem.id)}
                              aria-current={isSubmenuItemActive(item.id, subitem.id) ? "page" : undefined}
                            >
                              <span className={styles.submenuIcon}>{subitem.icon}</span>
                              <span className={styles.submenuText}>{subitem.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </nav>
          
          <div className={styles.sidebarFooter}>
            <button className={styles.helpLink} onClick={handleHelpClick}>
              <span className={styles.helpIcon}><FaQuestionCircle /></span>
              {!collapsed && <span className={styles.helpText}>Help</span>}
            </button>
            
            <button className={styles.helpLink} onClick={handleLanguageToggle}>
              <span className={styles.helpIcon}><FaGlobe /></span>
              {!collapsed && <span className={styles.helpText}>
                {t('general.languageSwitch')}
              </span>}
            </button>
          </div>
        </div>
        
        {/* Overlay to close mobile sidebar when clicking outside */}
        <div 
          className={`${styles.overlay} ${mobileOpen ? styles.showOverlay : ''}`}
          onClick={() => setMobileOpen(false)}
        />
      </aside>
      
      {/* Help Modal */}
      {showHelpModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.helpModal}>
            <button className={styles.closeButton} onClick={closeHelpModal}>×</button>
            <h2>Application Guide</h2>
            
            <div className={styles.helpContent}>
              <div className={styles.helpSection}>
                <h3>Dashboard</h3>
                <p>Get an overview of your business with key metrics and statistics:</p>
                <ul>
                  <li>Total inventory value</li>
                  <li>Low stock alerts</li>
                  <li>Sales performance</li>
                  <li>Revenue metrics</li>
                </ul>
              </div>
              
              <div className={styles.helpSection}>
                <h3>Product Inventory</h3>
                <p>Manage your product catalog and inventory levels:</p>
                <ul>
                  <li><strong>Products:</strong> Add, edit, and delete products in your inventory</li>
                  <li><strong>Categories:</strong> Organize products by category for better management</li>
                  <li><strong>Rules:</strong> Set up alerts for low stock or other inventory conditions</li>
                </ul>
              </div>
              
              <div className={styles.helpSection}>
                <h3>Economy</h3>
                <p>Track your business finances and performance:</p>
                <ul>
                  <li><strong>Financial Spreadsheet:</strong> View and edit monthly financial data</li>
                  <li><strong>Financial Reports:</strong> Generate reports and analyze finances</li>
                  <li><strong>Sales Records:</strong> Track all sales transactions</li>
                  <li><strong>Expense Records:</strong> Manage and monitor expenses</li>
                </ul>
              </div>
            </div>
            
            <div className={styles.helpFooter}>
              <button className={styles.helpCloseButton} onClick={closeHelpModal}>
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar; 