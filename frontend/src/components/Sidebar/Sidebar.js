import React, { useState } from 'react';
import styles from './Sidebar.module.css';
// Font Awesome for modern, professional icons
import { 
  FaTachometerAlt, FaBox, FaRuler, FaTags, 
  FaClipboardList, FaQuestionCircle, FaBars,
  FaAngleLeft, FaAngleRight, FaSearch
} from 'react-icons/fa';

const Sidebar = ({ collapsed, onToggle }) => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleItemClick = (item) => {
    setActiveItem(item);
    // Close mobile sidebar when item clicked
    if (window.innerWidth < 992) {
      setMobileOpen(false);
    }
  };
  
  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const menuItems = [
    { id: 'dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { id: 'products', icon: <FaBox />, label: 'Products' },
    { id: 'rules', icon: <FaRuler />, label: 'Rules' },
    { id: 'categories', icon: <FaTags />, label: 'Categories' },
    { id: 'reports', icon: <FaClipboardList />, label: 'Reports' }
  ];
  
  // Filter menu items based on search term
  const filteredMenuItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      {/* Mobile hamburger menu */}
      <button 
        className={styles.mobileToggle}
        onClick={handleMobileToggle}
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
                <li 
                  key={item.id}
                  className={`
                    ${styles.navItem} 
                    ${activeItem === item.id ? styles.active : ''}
                  `}
                >
                  <button 
                    className={styles.navLink}
                    onClick={() => handleItemClick(item.id)}
                    aria-current={activeItem === item.id ? "page" : undefined}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {!collapsed && <span className={styles.navText}>{item.label}</span>}
                    {collapsed && <span className={styles.tooltip}>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className={styles.sidebarFooter}>
            <button className={styles.helpLink}>
              <span className={styles.helpIcon}><FaQuestionCircle /></span>
              {!collapsed && <span className={styles.helpText}>Need Help?</span>}
              {collapsed && <span className={styles.tooltip}>Need Help?</span>}
            </button>
            
            {!collapsed && (
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <img 
                    src="https://ui-avatars.com/api/?name=User&background=random"
                    alt="User"
                  />
                </div>
                <div className={styles.userData}>
                  <p className={styles.userName}>User</p>
                  <p className={styles.userRole}>Administrator</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Overlay to close mobile sidebar when clicking outside */}
        <div 
          className={`${styles.overlay} ${mobileOpen ? styles.showOverlay : ''}`}
          onClick={() => setMobileOpen(false)}
        />
      </aside>
    </>
  );
};

export default Sidebar; 