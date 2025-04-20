// Import necessary modules and components
import React from "react";
import styles from "./Header.module.css";
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

/**
 * Header Component - Modern gamified version with performance optimizations
 * This component renders the header with a dynamic title based on the current section.
 */
const Header = React.memo(({ title = "Management System" }) => {
    const { t, i18n } = useTranslation();

    const handleLanguageToggle = () => {
        const newLang = i18n.language === 'el' ? 'en' : 'el';
        i18n.changeLanguage(newLang);
    };

    return (
        <header className={styles.header}>
            <div className={styles.gradientBackground}></div>
            <div className={styles.headerContent}>
                <div className={styles.inventoryBox}>
                    {title}
                </div>
                <div className={styles.headerControls}>
                    <button 
                        className={styles.languageToggle}
                        onClick={handleLanguageToggle}
                        title={t('general.languageSwitch')}
                    >
                        <FaGlobe className={styles.globeIcon} />
                        <span>{i18n.language === 'el' ? 'EN' : 'EL'}</span>
                    </button>
                </div>
            </div>
        </header>
    );
});

// Add displayName for debugging
Header.displayName = 'Header';

export default Header;