import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAppContext } from '../../../../common/contexts/AppContext';

const { Title } = Typography;

const CategoriesList = () => {
  const { apiUrl } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name
    });
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCategory) {
        // Update existing category
        await axios.put(`${apiUrl}/categories/${editingCategory.id}`, values);
        message.success('Category updated successfully');
      } else {
        // Add new category
        await axios.post(`${apiUrl}/categories`, values);
        message.success('Category added successfully');
      }
      
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to save category');
      }
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`${apiUrl}/categories/${categoryId}`);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to delete category');
      }
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)} 
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              danger 
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4}>Product Categories</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          Add Category
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={categories} 
        rowKey="id" 
        loading={loading}
        size="middle"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={modalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="e.g., FOOD, WINE, CAFE, EVENTS" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoriesList; 