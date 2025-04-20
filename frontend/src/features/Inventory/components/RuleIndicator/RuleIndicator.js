import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useRuleFiltering } from '../../hooks';
import styles from './RuleIndicator.module.css';

/**
 * RuleIndicator Component
 * 
 * Displays a visual indicator of rule status for a product
 * Can be used in tables or product cards to show rule status at a glance
 * 
 * @param {Object} props - Component props
 * @param {string|number} props.productId - ID of the product to check rules for
 * @param {number} props.amount - Current amount of the product
 * @param {string} props.size - Size of the indicator ('small', 'medium', 'large')
 * @param {boolean} props.showTooltip - Whether to show rule details on hover
 */
const RuleIndicator = ({ 
  productId, 
  amount, 
  size = 'medium',
  showTooltip = true 
}) => {
  // Get rule filtering functionality
  const { getApplicableRules, getProductColorByRules } = useRuleFiltering();
  
  // Get applicable rules and indicator color
  const applicableRules = getApplicableRules(productId, amount);
  const indicatorColor = getProductColorByRules(productId, amount);
  
  // If no rules apply, don't render anything
  if (!indicatorColor) return null;
  
  // Generate tooltip content if needed
  const tooltipContent = showTooltip && applicableRules.length > 0 
    ? applicableRules.map(rule => (
      `${rule.rules}: ${rule.comparison} ${rule.amount}`
    )).join('\n')
    : '';
  
  return (
    <div 
      className={`${styles.indicator} ${styles[size]}`}
      style={{ backgroundColor: indicatorColor }}
      title={tooltipContent}
      data-testid="rule-indicator"
    />
  );
};

RuleIndicator.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showTooltip: PropTypes.bool
};

// Optimize rendering with memo
export default memo(RuleIndicator); 