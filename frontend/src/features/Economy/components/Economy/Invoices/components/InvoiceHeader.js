import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Tag } from 'antd';
import { formatDate, formatCurrency } from '../utils';

/**
 * Component to display invoice header information
 */
const InvoiceHeader = ({ invoice }) => {
  return (
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
        <Tag color="green">{formatCurrency(invoice.total_amount)}</Tag>
      </Descriptions.Item>
    </Descriptions>
  );
};

InvoiceHeader.propTypes = {
  invoice: PropTypes.shape({
    invoice_date: PropTypes.string,
    supplier_name: PropTypes.string,
    supplier_phone: PropTypes.string,
    supplier_email: PropTypes.string,
    total_amount: PropTypes.number
  }).isRequired
};

export default InvoiceHeader; 