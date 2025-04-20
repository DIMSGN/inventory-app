/**
 * Dashboard header component
 * @module components/DashboardHeader
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUser } from 'react-icons/fa';
import styles from './DashboardHeader.module.css';

/**
 * DashboardHeader component
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Dashboard title
 * @param {string} props.username - Current username
 * @returns {JSX.Element} DashboardHeader component
 */
const DashboardHeader = ({ title, username }) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <FaTachometerAlt className={styles.headerIcon} />
        <h1 className={styles.title}>{title || 'Dashboard'}</h1>
      </div>
      
      <div className={styles.userContainer}>
        <FaUser className={styles.userIcon} />
        <span className={styles.username}>{username || 'User'}</span>
        <Link to="/" className={styles.homeLink}>
          Αρχική
        </Link>
      </div>
    </header>
  );
};

DashboardHeader.propTypes = {
  title: PropTypes.string,
  username: PropTypes.string
};

export default DashboardHeader; 