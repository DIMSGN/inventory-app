import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ProductProvider } from "./context/Product/ProductContext";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <App />
        <ToastContainer position="top-right" autoClose={1500} />
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
