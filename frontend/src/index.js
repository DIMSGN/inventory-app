import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from "./common/contexts/AppContext";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { defaultConfig } from './common/services/toastService';
import PreloadResources from './common/components/PreloadResources';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';

// Import i18n
import './i18n';

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
          <ConfigProvider locale={enUS}>
            <PreloadResources />
            <App />
            <ToastContainer 
              {...defaultConfig}
              position="bottom-right"
            />
          </ConfigProvider>
        </AppProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}, 0);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
