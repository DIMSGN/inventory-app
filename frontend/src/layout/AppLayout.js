import React, { useState, useEffect, Suspense } from 'react';
import { Header, Sidebar } from './index';
import { useNavigation } from '../hooks/useNavigation';
import { useModal } from '../common/contexts/ModalContext';

/**
 * Main layout component for the application
 * Handles sidebar state and header title
 */
export const AppLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { getActiveItemFromPath, handleNavigation, getHeaderTitle } = useNavigation();
  const { openModal } = useModal();
  
  // Handle opening the add product modal
  const openAddProductModal = () => {
    openModal('product');
  };
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Load sidebar state from localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState !== null) {
      setSidebarCollapsed(JSON.parse(savedSidebarState));
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  
  return (
    <div className={`app ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Suspense fallback={<div className="loading">Loading Sidebar...</div>}>
        <Sidebar
          key="sidebar"
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          onNavigation={handleNavigation}
          activeItem={getActiveItemFromPath()}
        />
      </Suspense>

      <main className="main-content">
        <Header 
          title={getHeaderTitle()} 
          onAddProduct={openAddProductModal} 
        />
        <Suspense fallback={<div className="loading">Loading Content...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}; 