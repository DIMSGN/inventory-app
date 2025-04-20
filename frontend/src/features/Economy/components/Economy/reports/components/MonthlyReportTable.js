import React from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { FaDownload } from 'react-icons/fa';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { prepareCsvData } from '../utils/csvHelpers';

/**
 * Monthly financial report table component
 * @param {Object} props - Component props
 * @param {Array} props.data - Monthly report data
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element} MonthlyReportTable component
 */
const MonthlyReportTable = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading monthly reports...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Alert variant="info">
        No monthly financial data available for the selected period.
      </Alert>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <CSVLink
          data={prepareCsvData(data, true)}
          filename={`monthly-financial-report-${new Date().toISOString().split('T')[0]}.csv`}
          className="btn btn-outline-primary"
        >
          <FaDownload className="me-1" /> Export to CSV
        </CSVLink>
      </div>
      
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="bg-light">
            <tr>
              <th>Month/Year</th>
              <th>Total Revenue</th>
              <th>Product Cost</th>
              <th>Gross Profit</th>
              <th>Gross Margin</th>
              <th>Operating Expenses</th>
              <th>Payroll Expenses</th>
              <th>Net Profit</th>
              <th>Net Margin</th>
            </tr>
          </thead>
          <tbody>
            {data.map((month, index) => (
              <tr key={index}>
                <td>{`${month.year}-${String(month.month).padStart(2, '0')}`}</td>
                <td>{formatCurrency(month.total_revenue)}</td>
                <td>{formatCurrency(month.product_cost)}</td>
                <td>{formatCurrency(month.gross_profit)}</td>
                <td className={month.gross_profit > 0 ? "text-success" : "text-danger"}>
                  {formatPercentage(month.gross_profit / month.total_revenue)}
                </td>
                <td>{formatCurrency(month.operating_expenses)}</td>
                <td>{formatCurrency(month.payroll_expenses)}</td>
                <td className={month.net_profit > 0 ? "fw-bold text-success" : "fw-bold text-danger"}>
                  {formatCurrency(month.net_profit)}
                </td>
                <td className={month.net_profit > 0 ? "text-success" : "text-danger"}>
                  {formatPercentage(month.net_profit / month.total_revenue)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-light fw-bold">
            <tr>
              <td>Total</td>
              <td>{formatCurrency(data.reduce((sum, month) => sum + month.total_revenue, 0))}</td>
              <td>{formatCurrency(data.reduce((sum, month) => sum + month.product_cost, 0))}</td>
              <td>{formatCurrency(data.reduce((sum, month) => sum + month.gross_profit, 0))}</td>
              <td>{formatPercentage(
                data.reduce((sum, month) => sum + month.gross_profit, 0) / 
                data.reduce((sum, month) => sum + month.total_revenue, 0)
              )}</td>
              <td>{formatCurrency(data.reduce((sum, month) => sum + month.operating_expenses, 0))}</td>
              <td>{formatCurrency(data.reduce((sum, month) => sum + month.payroll_expenses, 0))}</td>
              <td>{formatCurrency(data.reduce((sum, month) => sum + month.net_profit, 0))}</td>
              <td>{formatPercentage(
                data.reduce((sum, month) => sum + month.net_profit, 0) / 
                data.reduce((sum, month) => sum + month.total_revenue, 0)
              )}</td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </>
  );
};

export default MonthlyReportTable; 