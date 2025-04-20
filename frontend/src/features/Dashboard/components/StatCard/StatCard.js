/**
 * Stat card component for individual metric display
 * @module components/StatCard
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './StatCard.module.css';
import { getStatIcon } from '../../constants/dashboardTypes';

/**
 * StatCard component for displaying a single metric/statistic
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the statistic
 * @param {string|number} props.value - Value of the statistic
 * @param {string} [props.type='default'] - Type of statistic (sales, users, etc)
 * @param {string} [props.color] - Custom color for the card (overrides type color)
 * @param {React.ReactNode} [props.icon] - Custom icon to display
 * @returns {JSX.Element} StatCard component
 */
const StatCard = ({ 
  label, 
  value, 
  type = 'default', 
  color,
  icon
}) => {
  // Use passed icon or get default icon based on type
  const displayIcon = icon || getStatIcon(type);
  
  return (
    <div className={styles.statCard} style={{ '--card-color': color }}>
      <div className={styles.iconContainer}>
        {displayIcon}
      </div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.node
};

export default StatCard; 