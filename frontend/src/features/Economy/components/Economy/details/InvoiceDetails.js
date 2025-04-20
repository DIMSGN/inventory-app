import React from 'react';
import { Descriptions, Table, Tag } from 'antd';
import styles from '../../../styles/InvoiceDetails.module.css';

const InvoiceDetails = ({ invoice }) => {
  if (!invoice) return null;

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const itemColumns = [
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text, record) => `${text} ${record.unit_name || ''}`
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      render: (text) => `$${parseFloat(text).toFixed(2)}`
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => `$${(record.quantity * record.unit_price).toFixed(2)}`
    }
  ];

  return (
    <div className={styles.invoiceDetails}>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Invoice Date">
          {formatDate(invoice.invoice_date)}
        </Descriptions.Item>
        <Descriptions.Item label="Supplier">
          {invoice.supplier_name}
        </Descriptions.Item>
        <Descriptions.Item label="Contact">
          {invoice.supplier_phone && (
            <div>Phone: {invoice.supplier_phone}</div>
          )}
          {invoice.supplier_email && (
            <div>Email: {invoice.supplier_email}</div>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Total Amount">
          <Tag color="green">${parseFloat(invoice.total_amount).toFixed(2)}</Tag>
        </Descriptions.Item>
      </Descriptions>
      
      <div className={styles.invoiceItemsSection}>
        <h3>Invoice Items</h3>
        <Table 
          columns={itemColumns}
          dataSource={invoice.items}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </div>
    </div>
  );
};

export default InvoiceDetails; 