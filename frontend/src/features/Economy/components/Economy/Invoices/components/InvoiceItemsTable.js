import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { formatCurrency, calculateItemTotal } from '../utils';

/**
 * Component to display invoice items in a table
 */
const InvoiceItemsTable = ({ items }) => {
  const columns = [
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
      render: (text) => formatCurrency(text)
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => formatCurrency(calculateItemTotal(record))
    }
  ];

  return (
    <div className="invoice-items-section">
      <h3>Invoice Items</h3>
      <Table 
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
        size="small"
      />
    </div>
  );
};

InvoiceItemsTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      product_name: PropTypes.string,
      quantity: PropTypes.number,
      unit_price: PropTypes.number,
      unit_name: PropTypes.string
    })
  ).isRequired
};

export default InvoiceItemsTable; 