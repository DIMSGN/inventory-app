/**
 * Chef dashboard header component
 * @module components/ChefHeader
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaHome } from 'react-icons/fa';
import styles from './ChefHeader.module.css';

/**
 * ChefHeader component for the chef dashboard
 * 
 * @returns {JSX.Element} ChefHeader component
 */
const ChefHeader = () => {
  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerLeft}>
        <FaUtensils size={32} color="#e74c3c" className={styles.headerIcon} />
        <h1 className={styles.headerTitle}>Dashboard Σεφ</h1>
      </div>
      
      <Link to="/" className={styles.homeButton}>
        <FaHome /> Αρχική
      </Link>
    </header>
  );
};

export default ChefHeader; 