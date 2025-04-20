import React from 'react';
import { Breadcrumb } from 'antd';
import { ProPageHeader } from '@ant-design/pro-components';
import { HomeOutlined, LineChartOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { EconomyProvider } from '../contexts/EconomyContext';
import FinancialSpreadsheet from '../components/Economy/FinancialSpreadsheet';
import './FinancialSpreadsheetPage.css';

const FinancialSpreadsheetPage = () => {
  const { year } = useParams();
  
  return (
    <EconomyProvider>
      <div className="financial-page-container">
        <Breadcrumb className="financial-breadcrumb">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined /> Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/economy">
              <LineChartOutlined /> Economy
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <FileTextOutlined /> Financial Spreadsheet
          </Breadcrumb.Item>
        </Breadcrumb>
        
        <ProPageHeader
          className="financial-page-header"
          title="Financial Spreadsheet"
          subTitle="Manage and analyze financial data"
        />
        
        <div className="financial-page-content">
          <FinancialSpreadsheet />
        </div>
      </div>
    </EconomyProvider>
  );
};

export default FinancialSpreadsheetPage; 