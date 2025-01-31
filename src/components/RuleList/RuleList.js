import React from "react";
import styles from "./RuleList.module.css";

/**
 * RuleList Component
 * This component renders a list of rules.
 * 
 * Props:
 * - rules: Array of rule objects.
 * - handleEdit: Function to handle editing a rule.
 * - handleDelete: Function to handle deleting a rule.
 */
const RuleList = ({ rules, handleEdit, handleDelete }) => {
    return (
        <ul className={styles.list}>
            {rules.map((rule) => (
                <li key={rule.id} className={styles.listItem}>
                    <div className={styles.ruleInfo}>
                        <span>{rule.rules} ({rule.comparison} {rule.amount})</span>
                        <div
                            className={styles.colorBox}
                            style={{ backgroundColor: rule.color }}
                        ></div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.editButton}
                            onClick={() => handleEdit(rule)}
                        >
                            Edit
                        </button>
                        <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(rule.id)}
                        >
                            Delete
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default RuleList;