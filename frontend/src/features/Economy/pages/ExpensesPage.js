import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { 
  UserOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import { EconomyProvider } from '../contexts/EconomyContext';
import PayrollExpenseForm from '../components/Economy/forms/PayrollExpenseForm';
import OperatingExpenseForm from '../components/Economy/forms/OperatingExpenseForm';
import './ExpensesPage.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const ExpensesPage = () => {
  const [activeTab, setActiveTab] = useState('payroll');
  
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  
  return (
    <EconomyProvider>
      <div className="expenses-page-container">
        <Title level={2}>Διαχείριση Εξόδων</Title>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          className="expenses-tabs"
        >
          <TabPane 
            tab={<span><UserOutlined /> Μισθοδοσία</span>} 
            key="payroll"
          >
            <Card title="Καταχώρηση Εξόδων Μισθοδοσίας" className="expenses-card">
              <PayrollExpenseForm />
            </Card>
          </TabPane>
          
          <TabPane 
            tab={<span><SettingOutlined /> Λειτουργικά Έξοδα</span>} 
            key="operating"
          >
            <Card title="Καταχώρηση Λειτουργικών Εξόδων" className="expenses-card">
              <OperatingExpenseForm />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </EconomyProvider>
  );
};

export default ExpensesPage; 