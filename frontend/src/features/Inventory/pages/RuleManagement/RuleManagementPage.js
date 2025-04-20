import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Breadcrumb, Select, Space, Divider } from 'antd';
import { useAppContext } from '../../../../common/contexts/AppContext';
import { RuleManager } from '../../components';
import { useLocation, useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

/**
 * Page for managing inventory rules across all products
 * Allows viewing all rules and filtering by product
 */
const RuleManagementPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const { products, isLoading, fetchProducts } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const productIdFromQuery = queryParams.get('product');
  
  // Load products when component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Set selected product based on query parameter
  useEffect(() => {
    if (productIdFromQuery && products.length > 0) {
      const product = products.find(p => p.product_id.toString() === productIdFromQuery.toString());
      if (product) {
        setSelectedProduct(product);
        setShouldOpenModal(true);
        
        // Clear the query parameter after processing
        navigate('/inventory/rules', { replace: true });
      }
    }
  }, [productIdFromQuery, products, navigate]);

  // Handler for product selection change
  const handleProductChange = (productId) => {
    if (productId) {
      const product = products.find(p => p.product_id.toString() === productId.toString());
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: '0 24px', marginTop: 24 }}>
        <Breadcrumb 
          items={[
            { title: 'Home' },
            { title: 'Inventory' },
            { title: 'Rule Management' }
          ]}
          style={{ marginBottom: 24 }}
        />
        
        <Title level={2}>Inventory Rule Management</Title>
        <Text>
          Create and manage rules to automatically highlight products in your inventory
          based on stock levels and other conditions.
        </Text>
        
        <Divider />
        
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Filter by Product:</Text>
              <Select
                placeholder="Select a product to view its rules"
                style={{ width: 300 }}
                allowClear
                showSearch
                loading={isLoading.products}
                onChange={handleProductChange}
                value={selectedProduct?.product_id}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {products.map(product => (
                  <Option key={product.product_id} value={product.product_id}>
                    {product.product_name}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
          
          <Col span={24}>
            <RuleManager currentProduct={selectedProduct} openModalAutomatically={shouldOpenModal} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RuleManagementPage; 