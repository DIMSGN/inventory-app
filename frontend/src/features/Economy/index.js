import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import styles
import './styles';

// Import Economy components
import Economy from './components/Economy/economy/Economy';
import FinancialDashboard from './components/Dashboard/FinancialDashboard';
import EconomyPage from './pages/EconomyPage';
import DailyEconomyPage from './pages/DailyEconomyPage';
import ExpensesPage from './pages/ExpensesPage';
import FinancialSpreadsheetPage from './pages/FinancialSpreadsheetPage';

// Economy Router Component
const EconomyRouter = () => {
  return (
    <Routes>
      <Route index element={<EconomyPage />} />
      <Route path="dashboard" element={<FinancialDashboard />} />
      <Route path="main" element={<Economy />} />
      <Route path="daily" element={<DailyEconomyPage />} />
      <Route path="expenses" element={<ExpensesPage />} />
      <Route path="financials" element={<FinancialSpreadsheetPage />} />
    </Routes>
  );
};

export default EconomyRouter; 