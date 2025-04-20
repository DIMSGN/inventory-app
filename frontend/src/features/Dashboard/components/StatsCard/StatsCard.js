/**
 * Stats card component for grouping multiple statistics
 * @module components/StatsCard
 */

import React from 'react';
import PropTypes from 'prop-types';
import StatCard from '../StatCard/StatCard';
import styles from './StatsCard.module.css';

/**
 * StatsCard component for displaying a group of statistics
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {Array} props.stats - Array of statistic objects
 * @param {string} props.stats[].label - Label for the statistic
 * @param {string|number} props.stats[].value - Value of the statistic
 * @param {string} [props.stats[].type] - Type of statistic
 * @param {string} [props.stats[].color] - Color for the statistic
 * @param {React.ReactNode} [props.stats[].icon] - Icon for the statistic
 * @returns {JSX.Element} StatsCard component
 */
const StatsCard = ({ title, stats }) => {
  return (
    <div className={styles.statsCard}>
      {title && <h2 className={styles.cardTitle}>{title}</h2>}
      
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            type={stat.type}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string,
      color: PropTypes.string,
      icon: PropTypes.node
    })
  ).isRequired
};

export default StatsCard; 