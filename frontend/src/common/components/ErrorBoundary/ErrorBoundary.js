import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // In a production app, you would send this to your error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Functional component for the error UI
const ErrorFallback = ({ error }) => {
  const { t } = useTranslation();
  
  return (
    <div
      role="alert"
      style={{
        padding: '20px',
        margin: '20px',
        borderRadius: '4px',
        backgroundColor: '#fff8f8',
        border: '1px solid #ffcdd2',
        color: '#d32f2f'
      }}
    >
      <h1>{t('errorBoundary.title', 'Something went wrong')}</h1>
      <p>{t('errorBoundary.message', 'We apologize for the inconvenience. Please try again later.')}</p>
      {error && (
        <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
          <summary>{t('errorBoundary.details', 'Error Details')}</summary>
          <p>{error.toString()}</p>
        </details>
      )}
      <div style={{ marginTop: '20px' }}>
        <Link
          to="/"
          style={{
            padding: '10px 20px',
            backgroundColor: '#6a11cb',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          {t('errorBoundary.returnToHome', 'Return to Dashboard')}
        </Link>
      </div>
    </div>
  );
};

export default ErrorBoundary; 