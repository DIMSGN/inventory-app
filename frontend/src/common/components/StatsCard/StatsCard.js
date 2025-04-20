import React from 'react';
import styles from './StatsCard.module.css';

/**
 * A reusable component to display a card with statistics
 * @param {Object} props
 * @param {string} props.title - The title of the stats card
 * @param {Array} props.stats - Array of stat objects
 * @param {string} props.stats[].label - The label for the stat
 * @param {string|number} props.stats[].value - The value for the stat
 * @param {string} props.stats[].color - The color for the stat (hex code)
 * @param {React.ReactNode} props.stats[].icon - An optional icon for the stat
 */
const StatsCard = ({ title, stats = [] }) => {
  return (
    <div className={styles.statsCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.stat}>
            <div className={styles.statHeader}>
              {stat.icon && <span className={styles.statIcon} style={{ color: stat.color }}>{stat.icon}</span>}
              <h3 className={styles.statLabel}>{stat.label}</h3>
            </div>
            <div 
              className={styles.statValue} 
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard; 