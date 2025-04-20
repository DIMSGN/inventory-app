import React, { Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useTranslation } from 'react-i18next';

// Contexts and providers
import { ModalProvider } from "./common/contexts/ModalContext";
import { DashboardProvider } from "./features/Dashboard/contexts/DashboardContext";

// Layout
import { AppLayout } from "./layout/AppLayout";

// Components
import ModalContainer from "./common/components/ModalContainer";

// Routes and components
import Dashboard from './features/Dashboard';
import Inventory from './features/Inventory';
import Recipes from './features/Recipes';
import Economy from './features/Economy';
import BarmanDashboard from './features/Barman/components/BarmanDashboard';
import ChefDashboard from './features/Chef/components/ChefDashboard';
import ManagerDashboard from './features/Manager/components/ManagerDashboard';
import InventoryWrapper from "./features/Inventory/components/InventoryWrapper";

// Loader component for suspense fallback
const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div>Loading...</div>
  </div>
);

const App = () => {
  const { t } = useTranslation();
  
  // Render a route element without error boundaries
  const renderRouteElement = (Component) => {
    // Special case for inventory which has a wrapper
    if (Component === Inventory) {
      return <InventoryWrapper />;
    }
    
    // Special case for Dashboard components
    if (Component === Dashboard || Component === BarmanDashboard || 
        Component === ChefDashboard || Component === ManagerDashboard) {
      return (
        <DashboardProvider>
          <Component />
        </DashboardProvider>
      );
    }
    
    // Normal component rendering
    return <Component />;
  };

  return (
    <ModalProvider>
      <Suspense fallback={<Loader />}>
        <AppLayout>
          <Routes>
            <Route path="/" element={renderRouteElement(Dashboard)} />
            <Route path="/inventory/*" element={renderRouteElement(Inventory)} />
            <Route path="/recipes/*" element={renderRouteElement(Recipes)} />
            <Route path="/economy/*" element={renderRouteElement(Economy)} />
            <Route path="/barman-dashboard" element={renderRouteElement(BarmanDashboard)} />
            <Route path="/chef-dashboard" element={renderRouteElement(ChefDashboard)} />
            <Route path="/manager-dashboard" element={renderRouteElement(ManagerDashboard)} />
            {/* Default route - redirect to dashboard for any unknown route */}
            <Route path="*" element={renderRouteElement(Dashboard)} />
          </Routes>
        </AppLayout>
      </Suspense>
      
      {/* Modals container */}
      <ModalContainer />
    </ModalProvider>
  );
};

export default App;
