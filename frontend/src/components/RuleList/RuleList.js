import React from "react";
import Button from "../common/Button/Button";
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
    console.log("Rules prop:", rules); // Add this line to log the rules prop

    if (!Array.isArray(rules)) {
        return <div>Loading...</div>;
    }

    if (rules.length === 0) {
        return <div>No rules available</div>;
    }

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
                        <Button
                            className={styles.editButton}
                            onClick={() => handleEdit(rule)}
                        >
                            Edit
                        </Button>
                        <Button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(rule.id)}
                        >
                            Delete
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default RuleList;