import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAppContext } from '../../../../../common/contexts/AppContext';

const { Title } = Typography;

const SuppliersList = () => {
  const { apiUrl } = useAppContext();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();

  // Define fetchSuppliers with useCallback to avoid dependency cycle
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      message.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const showAddModal = () => {
    setEditingSupplier(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue({
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || ''
    });
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingSupplier) {
        // Update existing supplier
        await axios.put(`${apiUrl}/suppliers/${editingSupplier.id}`, values);
        message.success('Supplier updated successfully');
      } else {
        // Add new supplier
        await axios.post(`${apiUrl}/suppliers`, values);
        message.success('Supplier added successfully');
      }
      
      setModalVisible(false);
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to save supplier');
      }
    }
  };

  const handleDelete = async (supplierId) => {
    try {
      await axios.delete(`${apiUrl}/suppliers/${supplierId}`);
      message.success('Supplier deleted successfully');
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to delete supplier');
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || '-'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || '-'
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
            title="Are you sure you want to delete this supplier?"
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
        <Title level={4}>Suppliers</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          Add Supplier
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={suppliers} 
        rowKey="id" 
        loading={loading}
        size="middle"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
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
            label="Supplier Name"
            rules={[{ required: true, message: 'Please enter supplier name' }]}
          >
            <Input placeholder="Enter supplier name" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone Number"
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { 
                type: 'email', 
                message: 'Please enter a valid email address' 
              }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SuppliersList; 