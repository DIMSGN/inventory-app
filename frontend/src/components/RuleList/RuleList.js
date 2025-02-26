import React from "react";
import Button from "../common/Button/Button";
import styles from "./RuleList.module.css";

const RuleList = ({ rules, handleEdit, handleDelete }) => {
    console.log("Rules prop:", rules);

    if (!Array.isArray(rules)) {
        console.log("Rules is not an array:", rules);
        return <div>Loading...</div>;
    }

    if (rules.length === 0) {
        return <div>No rules available</div>;
    }

    return (
        <ul className={styles.list}>
            {rules.map((rule) => (
                <li key={rule.rules + rule.comparison + rule.amount} className={styles.listItem}>
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
                            onClick={() => handleDelete(rule.rules, rule.comparison, rule.amount)}
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