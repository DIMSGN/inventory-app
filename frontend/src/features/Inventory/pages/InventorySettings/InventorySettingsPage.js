import React from 'react';
import { Layout, Typography, Tabs, Breadcrumb } from 'antd';
import Units from '../../components/Units/Units';
import CategoriesList from '../../components/Categories/CategoriesList';
import styles from './InventorySettingsPage.module.css';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Inventory Settings Page Component
 * Provides a UI to manage inventory settings like units, categories, etc.
 * 
 * @returns {JSX.Element} The inventory settings page component
 */
const InventorySettingsPage = () => {
  return (
    <Layout>
      <Content className={styles.content}>
        <Breadcrumb 
          items={[
            { title: 'Home' },
            { title: 'Inventory' },
            { title: 'Settings' }
          ]}
          style={{ marginBottom: 24 }}
        />
        
        <div className={styles.header}>
          <Title level={2}>Inventory Settings</Title>
          <Text>
            Manage inventory settings such as measurement units and product categories.
          </Text>
        </div>
        
        <Tabs defaultActiveKey="units" className={styles.tabs}>
          <TabPane tab="Units" key="units">
            <div className={styles.tabContent}>
              <Text className={styles.sectionDescription}>
                Manage measurement units used throughout the inventory system.
                Add units such as kg, grams, litre, ml, pack, piece, etc.
              </Text>
              <Units />
            </div>
          </TabPane>
          
          <TabPane tab="Categories" key="categories">
            <div className={styles.tabContent}>
              <Text className={styles.sectionDescription}>
                Manage product categories to organize your inventory.
                Add categories such as FOOD, WINE, ΠΟΤΑ, ΜΠΥΡΕΣ, CAFE, EVENTS, etc.
              </Text>
              <CategoriesList />
            </div>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default InventorySettingsPage; 