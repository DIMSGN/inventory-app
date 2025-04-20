import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ActionCard.module.css';

/**
 * A reusable component to display a card with action buttons
 * @param {Object} props
 * @param {string} props.title - The title of the action card
 * @param {Array} props.actions - Array of action objects
 * @param {string} props.actions[].to - The path to navigate to
 * @param {React.ReactNode} props.actions[].icon - An icon for the action
 * @param {string} props.actions[].text - The text for the action button
 * @param {string} props.actions[].color - The color for the action button (hex code)
 */
const ActionCard = ({ title, actions = [] }) => {
  return (
    <div className={styles.actionCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <div className={styles.actionsGrid}>
        {actions.map((action, index) => (
          <Link 
            key={index} 
            to={action.to} 
            className={styles.actionButton}
            style={{ 
              backgroundColor: action.color,
              boxShadow: `0 4px 12px ${action.color}40`
            }}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionText}>{action.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ActionCard; 