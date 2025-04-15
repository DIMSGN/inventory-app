// Import necessary modules and components
import React from "react";
import styles from "./Header.module.css";

/**
 * Header Component - Modern gamified version with performance optimizations
 * This component renders the header of the Inventory Management System.
 */
const Header = React.memo(() => {
    return (
        <header className={styles.header}>
            <div className={styles.gradientBackground}></div>
            <div className={styles.headerContent}>
                <div className={styles.inventoryBox}>
                    Inventory Management System
                </div>
            </div>
        </header>
    );
});

// Add displayName for debugging
Header.displayName = 'Header';

export default Header;