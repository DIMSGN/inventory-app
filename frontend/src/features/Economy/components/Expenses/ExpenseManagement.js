import React from 'react';
import { Container, Card, Tabs, Tab } from 'react-bootstrap';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import '../../styles/expenses.css';

// Import custom hooks
import useExpenseManagement from '../../hooks/useExpenseManagement';
import useExpenseHandlers from '../../hooks/useExpenseHandlers';

// Import components
import OperatingExpenseSection from './OperatingExpenseSection';
import PayrollExpenseSection from './PayrollExpenseSection';
import DeleteExpenseModal from './DeleteExpenseModal';

/**
 * ExpenseManagement component that serves as the main container for expense operations
 * 
 * @returns {JSX.Element} ExpenseManagement component
 */
const ExpenseManagement = () => {
  // Get state and functions from our custom hooks
  const expenseState = useExpenseManagement();
  const { 
    activeTab, 
    setActiveTab,
    operatingExpenses,
    operatingExpense,
    setOperatingExpense,
    payrollExpenses,
    payrollExpense,
    setPayrollExpense,
    isLoading,
    isDeleting,
    error,
    success,
    showDeleteModal,
    deleteTarget
  } = expenseState;

  // Get handlers from our custom hook
  const { 
    handleOperatingExpenseSubmit,
    handlePayrollExpenseSubmit,
    handleDeleteClick,
    handleConfirmDelete
  } = useExpenseHandlers(expenseState);
  
  return (
    <Container fluid className="p-4">
      <Card className="expense-card">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0 d-flex align-items-center">
            <FaFileInvoiceDollar className="me-2" /> Expense Management
          </h4>
        </Card.Header>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="expense-tabs mb-4"
          >
            <Tab eventKey="operating" title="Operating Expenses">
              <OperatingExpenseSection 
                operatingExpenses={operatingExpenses}
                operatingExpense={operatingExpense}
                setOperatingExpense={setOperatingExpense}
                handleOperatingExpenseSubmit={handleOperatingExpenseSubmit}
                handleDeleteClick={handleDeleteClick}
                isLoading={isLoading}
                error={error}
                success={success}
              />
            </Tab>
            <Tab eventKey="payroll" title="Payroll Expenses">
              <PayrollExpenseSection
                payrollExpenses={payrollExpenses}
                payrollExpense={payrollExpense}
                setPayrollExpense={setPayrollExpense}
                handlePayrollExpenseSubmit={handlePayrollExpenseSubmit}
                handleDeleteClick={handleDeleteClick}
                isLoading={isLoading}
                error={error}
                success={success}
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
      
      {/* Delete confirmation modal */}
      <DeleteExpenseModal 
        showModal={showDeleteModal}
        handleClose={() => expenseState.setShowDeleteModal(false)}
        handleConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
        expenseType={deleteTarget.type}
      />
    </Container>
  );
};

export default ExpenseManagement; 