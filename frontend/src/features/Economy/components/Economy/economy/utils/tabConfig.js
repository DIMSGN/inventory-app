import React from 'react';
import { 
  FaChartLine, FaReceipt, FaCashRegister, 
  FaClipboardList, FaTruckLoading, FaFileInvoiceDollar 
} from 'react-icons/fa';

/**
 * Tab configuration with icons and labels
 */
export const TABS = [
  {
    key: 'overview',
    label: 'Overview',
    icon: null // No icon in the tab, but used in the content
  },
  {
    key: 'financial-reports',
    label: 'Financial Reports',
    icon: <FaReceipt />
  },
  {
    key: 'sales',
    label: 'Sales Recording',
    icon: <FaCashRegister />
  },
  {
    key: 'expenses',
    label: 'Expenses',
    icon: <FaClipboardList />
  },
  {
    key: 'suppliers',
    label: 'Suppliers',
    icon: <FaTruckLoading />
  },
  {
    key: 'invoices',
    label: 'Invoices',
    icon: <FaFileInvoiceDollar />
  }
];

/**
 * Get a tab by its key
 * @param {string} key - Tab key
 * @returns {Object} Tab configuration object
 */
export const getTabByKey = (key) => {
  return TABS.find(tab => tab.key === key) || TABS[0];
}; 