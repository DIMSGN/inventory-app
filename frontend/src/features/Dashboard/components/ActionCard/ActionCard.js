/**
 * Action card component for displaying action links
 * @module components/ActionCard
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './ActionCard.module.css';

/**
 * ActionCard component for displaying a group of interactive actions
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {Array} props.actions - Array of action objects
 * @param {string} props.actions[].to - Link destination
 * @param {React.ReactNode} props.actions[].icon - Icon for the action
 * @param {string} props.actions[].text - Action text
 * @param {string} [props.actions[].color] - Action button color
 * @param {Function} [props.actions[].onClick] - Optional click handler
 * @returns {JSX.Element} ActionCard component
 */
const ActionCard = ({ title, actions }) => {
  return (
    <div className={styles.actionCard}>
      {title && <h2 className={styles.cardTitle}>{title}</h2>}
      
      <div className={styles.actionList}>
        {actions.map((action, index) => (
          <Link 
            key={index}
            to={action.to}
            className={styles.actionButton}
            style={{ '--button-color': action.color }}
            onClick={action.onClick}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionText}>{action.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

ActionCard.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      text: PropTypes.string.isRequired,
      color: PropTypes.string,
      onClick: PropTypes.func
    })
  ).isRequired
};

export default ActionCard; 