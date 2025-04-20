import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space, Card, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAppContext } from '../../../../common/contexts/AppContext';

const { Title } = Typography;

const UnitsList = () => {
  const { apiUrl } = useAppContext();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [form] = Form.useForm();

  // Fetch units on component mount
  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/units`);
      setUnits(response.data);
    } catch (error) {
      console.error('Error fetching units:', error);
      message.error('Failed to fetch units');
    } finally {
      setLoading(false);
    }
  };

  const showAddModal = () => {
    setEditingUnit(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (unit) => {
    setEditingUnit(unit);
    form.setFieldsValue({
      name: unit.name,
      conversion_factor: unit.conversion_factor || undefined
    });
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUnit) {
        // Update existing unit
        await axios.put(`${apiUrl}/units/${editingUnit.id}`, values);
        message.success('Unit updated successfully');
      } else {
        // Add new unit
        await axios.post(`${apiUrl}/units`, values);
        message.success('Unit added successfully');
      }
      
      setModalVisible(false);
      fetchUnits();
    } catch (error) {
      console.error('Error saving unit:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to save unit');
      }
    }
  };

  const handleDelete = async (unitId) => {
    try {
      await axios.delete(`${apiUrl}/units/${unitId}`);
      message.success('Unit deleted successfully');
      fetchUnits();
    } catch (error) {
      console.error('Error deleting unit:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to delete unit');
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
      title: 'Conversion Factor',
      dataIndex: 'conversion_factor',
      key: 'conversion_factor',
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
            title="Are you sure you want to delete this unit?"
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
        <Title level={4}>Measurement Units</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          Add Unit
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={units} 
        rowKey="id" 
        loading={loading}
        size="middle"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUnit ? 'Edit Unit' : 'Add Unit'}
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
            label="Unit Name"
            rules={[{ required: true, message: 'Please enter unit name' }]}
          >
            <Input placeholder="e.g., kg, liter, piece" />
          </Form.Item>
          
          <Form.Item
            name="conversion_factor"
            label="Conversion Factor (optional)"
            tooltip="A number to convert this unit to a base unit"
          >
            <Input type="number" placeholder="e.g., 1000 for converting kg to g" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UnitsList; 