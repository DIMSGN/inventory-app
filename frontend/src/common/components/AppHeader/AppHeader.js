import React from 'react';
import { Link } from 'react-router-dom';
import { FileExcelOutlined } from '@ant-design/icons';

const AppHeader = () => {
  const menuItems = [
    {
      key: 'financial-spreadsheet',
      label: <Link to="/economy/financials">Financial Spreadsheet</Link>,
      icon: <FileExcelOutlined />,
    },
  ];

  return (
    <div>
      {/* Render your menu items here */}
    </div>
  );
};

export default AppHeader; 