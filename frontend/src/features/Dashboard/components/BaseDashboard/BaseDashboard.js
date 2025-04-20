/**
 * Base dashboard component
 * @module components/BaseDashboard
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './BaseDashboard.module.css';
import DashboardHeader from '../DashboardHeader';

/**
 * BaseDashboard component that provides layout for specialized dashboards
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Dashboard title
 * @param {string} [props.username] - Current username
 * @param {React.ReactNode} props.children - Dashboard content
 * @returns {JSX.Element} BaseDashboard component
 */
const BaseDashboard = ({ title, username, children }) => {
  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader 
        title={title}
        username={username}
      />
      
      <main className={styles.dashboardContent}>
        {children}
      </main>
    </div>
  );
};

BaseDashboard.propTypes = {
  title: PropTypes.string.isRequired,
  username: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default BaseDashboard; 