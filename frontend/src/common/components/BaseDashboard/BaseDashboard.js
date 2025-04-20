import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaHome, FaSearch } from 'react-icons/fa';
import styles from './BaseDashboard.module.css';

/**
 * @component BaseDashboard
 * @description Base dashboard component that handles common dashboard functionality
 * This component should be extended by role-specific dashboards
 */
const BaseDashboard = ({
  title,
  icon: Icon,
  statsItems,
  actionButtons,
  showSearch,
  onSearch,
  searchPlaceholder,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          {Icon && <Icon size={32} />}
          <h1>{title}</h1>
        </div>
        <Link to="/" className={styles.homeButton}>
          <FaHome />
          <span>Home</span>
        </Link>
      </header>

      <div className={styles.cardGrid}>
        {statsItems && statsItems.length > 0 && (
          <div className={styles.statsCard}>
            <h2>Quick Stats</h2>
            {statsItems.map((item, index) => (
              <div key={index} className={styles.statItem}>
                <span className={styles.statLabel}>{item.label}</span>
                <span className={styles.statValue}>{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {actionButtons && actionButtons.length > 0 && (
          <div className={styles.actionsCard}>
            <h2>Actions</h2>
            <div className={styles.actionButtons}>
              {actionButtons.map((button, index) => (
                <Link
                  key={index}
                  to={button.to}
                  className={styles.actionButton}
                  onClick={button.onClick}
                >
                  {button.icon}
                  <span>{button.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className={styles.contentSection}>
        {(showSearch || title) && (
          <div className={styles.sectionHeader}>
            {title && <h2>{title} List</h2>}
            {showSearch && (
              <div className={styles.searchBar}>
                <FaSearch />
                <input
                  type="text"
                  placeholder={searchPlaceholder || `Search ${title || 'items'}...`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            )}
          </div>
        )}
        {children}
      </section>
    </div>
  );
};

BaseDashboard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  statsItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
      icon: PropTypes.element,
      onClick: PropTypes.func,
    })
  ),
  showSearch: PropTypes.bool,
  onSearch: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  children: PropTypes.node,
};

BaseDashboard.defaultProps = {
  statsItems: [],
  actionButtons: [],
  showSearch: false,
};

export default BaseDashboard; 