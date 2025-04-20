import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './NotFound.module.css';

const NotFound = () => {
  const { t } = useTranslation();
  
  // Log the 404 event
  React.useEffect(() => {
    console.error(`404 Error: Page not found at: ${window.location.pathname}`);
    // In a production app, you might want to send this to your analytics or monitoring service
  }, []);

  return (
    <div className={styles.container} role="alert" aria-labelledby="notfound-title">
      <h1 id="notfound-title" className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>{t('notFound.title', 'Page Not Found')}</h2>
      <p className={styles.message}>
        {t('notFound.message', 'The page you\'re looking for doesn\'t exist or has been moved.')}
      </p>
      <Link 
        to="/" 
        className={styles.button}
        aria-label={t('notFound.returnToHome', 'Return to Dashboard')}
      >
        {t('notFound.returnToHome', 'Return to Dashboard')}
      </Link>
    </div>
  );
};

export default NotFound; 