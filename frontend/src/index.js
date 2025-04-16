import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from "./context/AppContext";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { defaultConfig } from './services/toastService';
import PreloadResources from './components/PreloadResources';

// Create root once
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render PreloadResources component immediately to start preloading critical resources
root.render(<PreloadResources />);

// Then render the full app with a slight delay to prioritize resource loading
setTimeout(() => {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AppProvider>
          <PreloadResources />
          <App />
          <ToastContainer 
            {...defaultConfig}
            position="bottom-right"
          />
        </AppProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}, 0);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
