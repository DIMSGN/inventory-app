/**
 * Dashboard header component
 * @module components/DashboardHeader
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FaGlassMartini, FaHome } from 'react-icons/fa';
import styles from './DashboardHeader.module.css';

/**
 * DashboardHeader component for the barman dashboard
 * 
 * @returns {JSX.Element} DashboardHeader component
 */
const DashboardHeader = () => {
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerLeft}>
        <FaGlassMartini size={32} color="#3498db" className={styles.headerIcon} />
        <h1 className={styles.headerTitle}>Dashboard Barman</h1>
      </div>
      
      <Link to="/" className={styles.homeButton}>
        <FaHome /> Αρχική
      </Link>
    </header>
  );
};

export default DashboardHeader; 