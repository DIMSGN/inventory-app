import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';
import App from '../App';

// Mock the i18next library
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key, defaultValue) => defaultValue,
    };
  },
}));

// Mock all the routes components
jest.mock('./Dashboard', () => () => <div data-testid="dashboard">Dashboard</div>);
jest.mock('./Inventory', () => () => <div data-testid="inventory">Inventory</div>);
jest.mock('./Inventory/components/InventoryWrapper', () => () => <div data-testid="inventory-wrapper">Inventory Wrapper</div>);
jest.mock('./Recipes', () => () => <div data-testid="recipes">Recipes</div>);
jest.mock('./Economy', () => () => <div data-testid="economy">Economy</div>);
jest.mock('./Barman/components/BarmanDashboard', () => () => <div data-testid="barman-dashboard">Barman Dashboard</div>);
jest.mock('./Chef/components/ChefDashboard', () => () => <div data-testid="chef-dashboard">Chef Dashboard</div>);
jest.mock('./Manager/components/ManagerDashboard', () => () => <div data-testid="manager-dashboard">Manager Dashboard</div>);

describe('NotFound Component', () => {
  test('renders 404 page with correct content', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    
    // Check for essential elements
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText(/The page you're looking for/)).toBeInTheDocument();
    expect(screen.getByText('Return to Dashboard')).toBeInTheDocument();
    
    // Check for accessibility attributes
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByLabelText('Return to Dashboard')).toBeInTheDocument();
  });
});

describe('Routing Tests', () => {
  test('navigates to 404 page for an unknown route', () => {
    // Silence the error logging during tests
    const originalError = console.error;
    console.error = jest.fn();
    
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );
    
    // Should render the NotFound component
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalError;
  });
  
  test('renders dashboard for root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });
}); 