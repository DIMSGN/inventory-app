import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Card, Typography, Space, Popconfirm, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { invoiceService } from '../mockServices';
import InvoiceDetails from '../details/InvoiceDetails';
import InvoiceForm from '../forms/InvoiceForm';
import styles from '../../../styles/InvoicesList.module.css';

const { Title } = Typography;

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  // Define fetchInvoices with useCallback to avoid dependency cycle
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await invoiceService.getInvoices();
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      message.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const showAddModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleViewCancel = () => {
    setViewModalVisible(false);
    setCurrentInvoice(null);
  };

  const handleInvoiceAdded = () => {
    setModalVisible(false);
    fetchInvoices();
    message.success('Invoice added successfully');
  };

  const handleDelete = async (invoiceId) => {
    try {
      await invoiceService.deleteInvoice(invoiceId);
      message.success('Invoice deleted successfully');
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Failed to delete invoice');
      }
    }
  };

  const viewInvoiceDetails = async (invoiceId) => {
    setLoading(true);
    try {
      const response = await invoiceService.getInvoiceById(invoiceId);
      setCurrentInvoice(response.data);
      setViewModalVisible(true);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      message.error('Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
      sorter: (a, b) => a.supplier_name.localeCompare(b.supplier_name)
    },
    {
      title: 'Date',
      dataIndex: 'invoice_date',
      key: 'invoice_date',
      render: (text) => formatDate(text),
      sorter: (a, b) => new Date(a.invoice_date) - new Date(b.invoice_date)
    },
    {
      title: 'Total Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (text) => `$${parseFloat(text).toFixed(2)}`,
      sorter: (a, b) => a.total_amount - b.total_amount
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => viewInvoiceDetails(record.id)} 
            size="small"
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this invoice? This will also reverse inventory changes."
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
      <div className={styles.invoiceHeader}>
        <Title level={4}>Product Invoices</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          Add Invoice
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={invoices} 
        rowKey="id" 
        loading={loading}
        size="middle"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Add New Invoice"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <InvoiceForm onSuccess={handleInvoiceAdded} onCancel={handleCancel} />
      </Modal>

      <Modal
        title={`Invoice Details #${currentInvoice?.id || ''}`}
        open={viewModalVisible}
        onCancel={handleViewCancel}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Close
          </Button>
        ]}
        width={800}
      >
        {currentInvoice && <InvoiceDetails invoice={currentInvoice} />}
      </Modal>
    </Card>
  );
};

export default InvoicesList; 