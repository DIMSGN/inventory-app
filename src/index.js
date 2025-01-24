// Import necessary modules and components
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Create a root element for the React application
 * This function initializes the root element where the React components will be rendered.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Render the App component inside the root element
 * The App component is wrapped in React.StrictMode to highlight potential problems in the application.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Measure performance in the application
 * This function logs performance metrics to the console or sends them to an analytics endpoint.
 * Learn more: https://bit.ly/CRA-vitals
 */
reportWebVitals();

/**
 * Explanation of Imports:
 * - React: This module is used to create React components and manage component state and lifecycle.
 * - ReactDOM: This module is used to render React components to the DOM.
 * - './index.css': This imports the global CSS styles for the application.
 * - App: This is the main component of the Inventory Management System application.
 * - reportWebVitals: This module is used to measure performance in the application.
 * 
 * Why it’s implemented this way:
 * - The ReactDOM.createRoot method is used to create a root element for the React application.
 * - The root.render method is used to render the App component inside the root element.
 * - The App component is wrapped in React.StrictMode to highlight potential problems in the application.
 * - The reportWebVitals function is used to measure performance in the application and log the results to the console or send them to an analytics endpoint.
 */
