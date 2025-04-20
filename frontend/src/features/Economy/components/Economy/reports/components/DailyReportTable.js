import React from 'react';
import { Table, Alert, Spinner } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { FaDownload } from 'react-icons/fa';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { prepareCsvData } from '../utils/csvHelpers';

/**
 * Daily financial report table component
 * @param {Object} props - Component props
 * @param {Array} props.data - Daily report data
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element} DailyReportTable component
 */
const DailyReportTable = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading daily reports...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Alert variant="info">
        No daily financial data available for the selected period.
      </Alert>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <CSVLink
          data={prepareCsvData(data, false)}
          filename={`daily-financial-report-${new Date().toISOString().split('T')[0]}.csv`}
          className="btn btn-outline-primary"
        >
          <FaDownload className="me-1" /> Export to CSV
        </CSVLink>
      </div>
      
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="bg-light">
            <tr>
              <th>Date</th>
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
            {data.map((day, index) => (
              <tr key={index}>
                <td>{day.date}</td>
                <td>{formatCurrency(day.total_revenue)}</td>
                <td>{formatCurrency(day.product_cost)}</td>
                <td>{formatCurrency(day.gross_profit)}</td>
                <td className={day.gross_profit > 0 ? "text-success" : "text-danger"}>
                  {formatPercentage(day.gross_profit / day.total_revenue)}
                </td>
                <td>{formatCurrency(day.operating_expenses)}</td>
                <td>{formatCurrency(day.payroll_expenses)}</td>
                <td className={day.net_profit > 0 ? "fw-bold text-success" : "fw-bold text-danger"}>
                  {formatCurrency(day.net_profit)}
                </td>
                <td className={day.net_profit > 0 ? "text-success" : "text-danger"}>
                  {formatPercentage(day.net_profit / day.total_revenue)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-light fw-bold">
            <tr>
              <td>Total</td>
              <td>{formatCurrency(data.reduce((sum, day) => sum + day.total_revenue, 0))}</td>
              <td>{formatCurrency(data.reduce((sum, day) => sum + day.product_cost, 0))}</td>
              <td>{formatCurrency(data.reduce((sum, day) => sum + day.gross_profit, 0))}</td>
              <td>{formatPercentage(
                data.reduce((sum, day) => sum + day.gross_profit, 0) / 
                data.reduce((sum, day) => sum + day.total_revenue, 0)
              )}</td>
              <td>{formatCurrency(data.reduce((sum, day) => sum + day.operating_expenses, 0))}</td>
              <td>{formatCurrency(data.reduce((sum, day) => sum + day.payroll_expenses, 0))}</td>
              <td>{formatCurrency(data.reduce((sum, day) => sum + day.net_profit, 0))}</td>
              <td>{formatPercentage(
                data.reduce((sum, day) => sum + day.net_profit, 0) / 
                data.reduce((sum, day) => sum + day.total_revenue, 0)
              )}</td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </>
  );
};

export default DailyReportTable; 