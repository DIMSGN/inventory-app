import React from 'react';
import PropTypes from 'prop-types';
import { InvoiceHeader, InvoiceItemsTable } from './components';
import '../../../styles/InvoiceDetails.module.css';

/**
 * InvoiceDetails component
 * Displays detailed information about an invoice
 */
const InvoiceDetails = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="invoice-details">
      <InvoiceHeader invoice={invoice} />
      <InvoiceItemsTable items={invoice.items || []} />
    </div>
  );
};

InvoiceDetails.propTypes = {
  invoice: PropTypes.shape({
    invoice_date: PropTypes.string,
    supplier_name: PropTypes.string,
    supplier_phone: PropTypes.string,
    supplier_email: PropTypes.string,
    total_amount: PropTypes.number,
    items: PropTypes.array
  })
};

export default InvoiceDetails; 