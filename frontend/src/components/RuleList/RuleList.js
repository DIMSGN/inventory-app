import React, { useState } from "react";
import Button from "../common/Button/Button";
import ConfirmationModal from "../common/ConfirmationModal/ConfirmationModal";
import styles from "./RuleList.module.css";

const RuleList = ({ rules, openRuleModal, onEditRule, handleDelete, onDeleteRule }) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [ruleToDelete, setRuleToDelete] = useState(null);

    // Use openRuleModal if provided, otherwise use onEditRule
    const editHandler = openRuleModal || onEditRule;
    
    // Use handleDelete if provided, otherwise use onDeleteRule
    const deleteHandler = handleDelete || onDeleteRule;

    // Helper function to get rule comparison display text
    const getComparisonDisplay = (comparison) => {
        const displayMap = {
            "<": "less than",
            ">": "greater than",
            "=": "equal to",
            "==": "equal to",
            "<=": "less than or equal to",
            ">=": "greater than or equal to",
            "!=": "not equal to"
        };
        return displayMap[comparison] || comparison;
    };

    // Helper function to format amount values
    const formatAmount = (amount) => {
        // Convert to number if it's a string
        const numAmount = parseFloat(amount);
        
        // Check if it's a whole number
        if (Number.isInteger(numAmount)) {
            return Math.floor(numAmount);
        }
        
        // Otherwise return the original amount
        return amount;
    };

    // Show confirmation modal for rule deletion
    const confirmDeleteRule = (ruleId) => {
        setRuleToDelete(ruleId);
        setShowDeleteConfirmation(true);
    };

    // Cancel rule deletion
    const cancelDeleteRule = () => {
        setRuleToDelete(null);
        setShowDeleteConfirmation(false);
    };

    // Handle rule deletion after confirmation
    const handleDeleteRuleConfirmed = () => {
        if (ruleToDelete && deleteHandler) {
            deleteHandler(ruleToDelete);
            setShowDeleteConfirmation(false);
            setRuleToDelete(null);
        }
    };

    // Find the rule name for the deletion confirmation
    const getRuleToDeleteName = () => {
        if (!ruleToDelete) return "";
        const rule = rules.find(r => r.id === ruleToDelete);
        return rule ? rule.rules : "";
    };
    
    if (rules.length === 0) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📋</div>
                <h3>No Rules Available</h3>
                <p>Rules help you monitor inventory levels by highlighting products that match specific conditions.</p>
                <p>Click the "Add Rule" button to create your first inventory rule.</p>
            </div>
        );
    }

    return (
        <div className={styles.listContainer}>
            <div className={styles.listHeader}>
                <h2>Inventory Rules</h2>
                <p className={styles.listDescription}>
                    Rules automatically highlight products in your inventory when specific conditions are met.
                </p>
            </div>
            
            <div className={styles.rulesCount}>
                <span>{rules.length} {rules.length === 1 ? 'rule' : 'rules'} configured</span>
            </div>
            
            <ul className={styles.list}>
                {rules.map((rule) => (
                    <li key={rule.id} className={styles.listItem}>
                        <div className={styles.ruleCard}>
                            <div className={styles.ruleHeader}>
                                <div className={styles.ruleName}>{rule.rules}</div>
                            </div>
                            
                            <div className={styles.ruleDescription}>
                                <div className={styles.ruleCondition}>
                                    When inventory is <strong>{getComparisonDisplay(rule.comparison)}</strong> <strong>{formatAmount(rule.amount)}</strong>
                                    <span className={styles.rowBecomes}> the row becomes </span>
                                    <div 
                                        className={styles.colorIndicator} 
                                        style={{ backgroundColor: rule.color }}
                                        title="This color will highlight products when the rule condition is met"
                                    />
                                </div>
                                
                                {rule.product_id && (
                                    <div className={styles.ruleProduct}>
                                        Applied to product ID: {rule.product_id}
                                    </div>
                                )}
                                
                                {!rule.product_id && (
                                    <div className={styles.ruleGlobal}>
                                        Applied to all products
                                    </div>
                                )}
                            </div>
                            
                            <div className={styles.buttonGroup}>
                                <Button
                                    variant="edit"
                                    onClick={() => editHandler(rule)}
                                    title="Edit this rule"
                                    icon="fas fa-edit"
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="delete"
                                    onClick={() => confirmDeleteRule(rule.id)}
                                    title="Delete this rule"
                                    icon="fas fa-trash-alt"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            
            <div className={styles.helpSection}>
                <h4>About Inventory Rules</h4>
                <p>Rules help you monitor inventory levels by highlighting products when specific conditions are met.</p>
                <ul className={styles.helpList}>
                    <li>Create rules for individual products or apply them globally to all items</li>
                    <li>Set conditions using comparison operators like less than, greater than, or equal to</li>
                    <li>Choose custom colors to differentiate between different types of alerts</li>
                </ul>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <ConfirmationModal
                    title="Delete Rule"
                    message={`Are you sure you want to delete the rule "${getRuleToDeleteName()}"? This will remove the rule from your inventory system and affected products will no longer be highlighted according to this rule.`}
                    onConfirm={handleDeleteRuleConfirmed}
                    onCancel={cancelDeleteRule}
                    confirmButtonText="Delete Rule"
                    cancelButtonText="Cancel"
                    confirmButtonVariant="danger"
                />
            )}
        </div>
    );
};

export default RuleList;