import React from 'react';
import { Alert, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import '../../../styles/FinancialSpreadsheet.css';

// Custom hooks from the component
import { useFinancialData } from './hooks';

// Shared spreadsheet components, hooks and utilities
import {
  SpreadsheetHeader,
  SpreadsheetControls,
  EditableCell,
  useCellEditing,
  formatCurrency,
  formatPercentage,
  exportToExcel,
  prepareFinancialDataForExcel
} from '../../../common/spreadsheet';

// Local components
import { TableSection, generateColumns } from './components';

/**
 * Monthly Financial Dashboard
 * Displays monthly financial data in a spreadsheet format with editing capabilities
 */
const FinancialSpreadsheet = () => {
  // URL parameters
  const { year: urlYear } = useParams();
  
  // Custom hooks
  const {
    yearMonth,
    lastUpdated,
    displayData,
    financialData,
    loading,
    saving,
    error,
    isUsingMockData,
    handleCellEdit,
    handleSave,
    handleYearChange,
    refreshData,
    currentYear
  } = useFinancialData(urlYear);

  const {
    startEdit,
    saveEdit,
    cancelEdit,
    updateEditingValue,
    isEditing
  } = useCellEditing();
  
  // Handle the actual save function
  const onSave = async () => {
    const success = await handleSave();
    if (success) {
      message.success('Financial data saved successfully');
    } else {
      message.error('Failed to save financial data');
    }
  };
  
  // Handle Excel export
  const handleExport = () => {
    try {
      const year = yearMonth.split('-')[0];
      const exportData = prepareFinancialDataForExcel(financialData, year);
      
      const success = exportToExcel({
        data: exportData,
        filename: `Financial_Report_${year}`,
        sheetName: 'Annual Report',
        headerRow: 3
      });
      
      if (success) {
        message.success('Report exported successfully');
      } else {
        message.error('Failed to export report');
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      message.error('Failed to export report');
    }
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  // Handler for cell editing that connects to the data hook
  const handleEditComplete = (editInfo) => {
    if (editInfo && editInfo.value !== undefined) {
      handleCellEdit(editInfo.value, editInfo.record, editInfo.dataType, editInfo.monthIndex);
    }
  };
  
  // Generate columns configuration
  const columns = generateColumns(
    startEdit,
    isEditing,
    updateEditingValue,
    (callback) => {
      const result = callback();
      handleEditComplete(result);
      saveEdit();
    }
  );
  
  // Create controls using the shared component
  const controls = (
    <SpreadsheetControls
      year={currentYear}
      onYearChange={handleYearChange}
      onSave={onSave}
      onExport={handleExport}
      onPrint={handlePrint}
      onRefresh={refreshData}
      saving={saving}
      loading={loading}
    />
  );
  
  return (
    <div className="financial-spreadsheet">
      <SpreadsheetHeader
        title={`Οικονομικά Στοιχεία ${currentYear}`}
        year={currentYear}
        lastUpdated={lastUpdated}
        isUsingMockData={isUsingMockData}
        controls={controls}
      />
      
      {error && (
        <Alert
          message="Error Loading Data"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 20 }}
        />
      )}
      
      <div className="spreadsheet-content">
        {loading ? (
          <div className="loading-container">
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 24 }} />} 
              tip="Loading financial data..."
            />
          </div>
        ) : (
          <>
            {/* Sales Section */}
            <TableSection
              title="ΠΩΛΗΣΕΙΣ (SALES)"
              dataSource={displayData?.salesData}
              columns={columns}
              emptyText="No sales data available"
            />
            
            {/* Cost of Goods Section */}
            <TableSection
              title="ΚΟΣΤΟΣ ΠΩΛΗΘΕΝΤΩΝ (COST OF GOODS)"
              dataSource={displayData?.cogData}
              columns={columns}
              emptyText="No cost of goods data available"
            />
            
            {/* Operational Expenses Section */}
            <TableSection
              title="ΛΕΙΤΟΥΡΓΙΚΑ ΕΞΟΔΑ (OPERATIONAL EXPENSES)"
              dataSource={displayData?.opexData}
              columns={columns}
              emptyText="No operational expenses data available"
            />
            
            {/* Utilities Expenses Section */}
            <TableSection
              title="ΠΑΓΙΑ ΕΞΟΔΑ (UTILITIES & FIXED EXPENSES)"
              dataSource={displayData?.utilitiesData}
              columns={columns}
              emptyText="No utilities/fixed expenses data available"
            />
            
            {/* Summary Section */}
            <TableSection
              title="ΣΥΝΟΨΗ (SUMMARY)"
              dataSource={displayData?.summaryData}
              columns={columns}
              emptyText="No summary data available"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialSpreadsheet; 