const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { format } = require('date-fns');

// Get all payroll expenses
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         id, 
         employee_name, 
         position, 
         amount, 
         payment_date, 
         payment_method, 
         hours_worked,
         hourly_rate,
         tax_amount,
         notes,
         created_at,
         updated_at
       FROM payroll_expenses
       ORDER BY payment_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching payroll expenses:', err);
    res.status(500).json({ error: 'Failed to fetch payroll expenses' });
  }
});

// Get payroll expenses by month
router.get('/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  try {
    const result = await db.query(
      `SELECT 
         id, 
         employee_name, 
         position, 
         amount, 
         payment_date, 
         payment_method, 
         hours_worked,
         hourly_rate,
         tax_amount,
         notes,
         created_at,
         updated_at
       FROM payroll_expenses
       WHERE EXTRACT(YEAR FROM payment_date) = $1
       AND EXTRACT(MONTH FROM payment_date) = $2
       ORDER BY payment_date DESC, employee_name`,
      [year, month]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching payroll expenses for ${month}/${year}:`, err);
    res.status(500).json({ error: 'Failed to fetch monthly payroll expenses' });
  }
});

// Get payroll expenses by employee
router.get('/employee/:employee_name', async (req, res) => {
  const { employee_name } = req.params;
  try {
    const result = await db.query(
      `SELECT 
         id, 
         employee_name, 
         position, 
         amount, 
         payment_date, 
         payment_method, 
         hours_worked,
         hourly_rate,
         tax_amount,
         notes,
         created_at,
         updated_at
       FROM payroll_expenses
       WHERE employee_name ILIKE $1
       ORDER BY payment_date DESC`,
      [`%${employee_name}%`]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching payroll expenses for employee ${employee_name}:`, err);
    res.status(500).json({ error: 'Failed to fetch employee payroll expenses' });
  }
});

// Get payroll expenses by position
router.get('/position/:position', async (req, res) => {
  const { position } = req.params;
  try {
    const result = await db.query(
      `SELECT 
         id, 
         employee_name, 
         position, 
         amount, 
         payment_date, 
         payment_method, 
         hours_worked,
         hourly_rate,
         tax_amount,
         notes,
         created_at,
         updated_at
       FROM payroll_expenses
       WHERE position ILIKE $1
       ORDER BY payment_date DESC, employee_name`,
      [`%${position}%`]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching payroll expenses for position ${position}:`, err);
    res.status(500).json({ error: 'Failed to fetch position payroll expenses' });
  }
});

// Get payroll expenses by date range
router.get('/date-range', async (req, res) => {
  const { start_date, end_date } = req.query;
  
  if (!start_date || !end_date) {
    return res.status(400).json({ 
      error: 'Both start_date and end_date are required' 
    });
  }
  
  try {
    const result = await db.query(
      `SELECT 
         id, 
         employee_name, 
         position, 
         amount, 
         payment_date, 
         payment_method, 
         hours_worked,
         hourly_rate,
         tax_amount,
         notes,
         created_at,
         updated_at
       FROM payroll_expenses
       WHERE payment_date BETWEEN $1 AND $2
       ORDER BY payment_date DESC, employee_name`,
      [start_date, end_date]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching payroll expenses for date range ${start_date} to ${end_date}:`, err);
    res.status(500).json({ error: 'Failed to fetch payroll expenses for date range' });
  }
});

// Get a single payroll expense
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT 
         id, 
         employee_name, 
         position, 
         amount, 
         payment_date, 
         payment_method, 
         hours_worked,
         hourly_rate,
         tax_amount,
         notes,
         created_at,
         updated_at
       FROM payroll_expenses
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payroll expense not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching payroll expense with ID ${id}:`, err);
    res.status(500).json({ error: 'Failed to fetch payroll expense' });
  }
});

// Create a new payroll expense
router.post('/', async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const { 
      employee_name, 
      position, 
      amount, 
      payment_date, 
      payment_method, 
      hours_worked,
      hourly_rate,
      tax_amount,
      notes 
    } = req.body;
    
    // Validate required fields
    if (!employee_name || !amount || !payment_date) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Employee name, amount, and payment date are required' 
      });
    }
    
    // Calculate amount if hourly_rate and hours_worked are provided but amount is not
    let finalAmount = amount;
    if (!finalAmount && hourly_rate && hours_worked) {
      finalAmount = hourly_rate * hours_worked;
    }
    
    const result = await client.query(
      `INSERT INTO payroll_expenses (
         employee_name, 
         position, 
         amount, 
         payment_date, 
         payment_method, 
         hours_worked,
         hourly_rate,
         tax_amount,
         notes,
         created_at,
         updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [
        employee_name,
        position || null,
        finalAmount,
        payment_date,
        payment_method || null,
        hours_worked || null,
        hourly_rate || null,
        tax_amount || null,
        notes || null
      ]
    );
    
    // Update monthly financial summary
    await updateMonthlyPayrollSummary(client, payment_date);
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error adding payroll expense:', err);
    res.status(500).json({ error: 'Failed to add payroll expense' });
  } finally {
    client.release();
  }
});

// Update an existing payroll expense
router.put('/:id', async (req, res) => {
  const client = await db.getClient();
  const { id } = req.params;
  
  try {
    await client.query('BEGIN');
    
    const { 
      employee_name, 
      position, 
      amount, 
      payment_date, 
      payment_method, 
      hours_worked,
      hourly_rate,
      tax_amount,
      notes 
    } = req.body;
    
    // Get the existing payroll expense to check if the payment date changes
    const existingExpense = await client.query(
      'SELECT payment_date FROM payroll_expenses WHERE id = $1',
      [id]
    );
    
    if (existingExpense.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Payroll expense not found' });
    }
    
    const oldPaymentDate = existingExpense.rows[0].payment_date;
    
    // Calculate amount if hourly_rate and hours_worked are provided
    let finalAmount = amount;
    if (!finalAmount && hourly_rate && hours_worked) {
      finalAmount = hourly_rate * hours_worked;
    }
    
    const result = await client.query(
      `UPDATE payroll_expenses
       SET 
         employee_name = COALESCE($1, employee_name),
         position = COALESCE($2, position),
         amount = COALESCE($3, amount),
         payment_date = COALESCE($4, payment_date),
         payment_method = COALESCE($5, payment_method),
         hours_worked = COALESCE($6, hours_worked),
         hourly_rate = COALESCE($7, hourly_rate),
         tax_amount = COALESCE($8, tax_amount),
         notes = COALESCE($9, notes),
         updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [
        employee_name,
        position,
        finalAmount,
        payment_date,
        payment_method,
        hours_worked,
        hourly_rate,
        tax_amount,
        notes,
        id
      ]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Payroll expense not found' });
    }
    
    // If payment date changed, update monthly financial summaries for both months
    if (payment_date && oldPaymentDate && format(new Date(payment_date), 'yyyy-MM') !== format(new Date(oldPaymentDate), 'yyyy-MM')) {
      await updateMonthlyPayrollSummary(client, oldPaymentDate);
      await updateMonthlyPayrollSummary(client, payment_date);
    } else {
      // Otherwise just update the current month
      await updateMonthlyPayrollSummary(client, payment_date || oldPaymentDate);
    }
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error updating payroll expense with ID ${id}:`, err);
    res.status(500).json({ error: 'Failed to update payroll expense' });
  } finally {
    client.release();
  }
});

// Delete a payroll expense
router.delete('/:id', async (req, res) => {
  const client = await db.getClient();
  const { id } = req.params;
  
  try {
    await client.query('BEGIN');
    
    // Get the payment date to update the monthly summary after deletion
    const dateResult = await client.query(
      'SELECT payment_date FROM payroll_expenses WHERE id = $1',
      [id]
    );
    
    if (dateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Payroll expense not found' });
    }
    
    const paymentDate = dateResult.rows[0].payment_date;
    
    // Delete the payroll expense
    const result = await client.query(
      'DELETE FROM payroll_expenses WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Payroll expense not found' });
    }
    
    // Update the monthly summary
    await updateMonthlyPayrollSummary(client, paymentDate);
    
    await client.query('COMMIT');
    res.json({ message: 'Payroll expense deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error deleting payroll expense with ID ${id}:`, err);
    res.status(500).json({ error: 'Failed to delete payroll expense' });
  } finally {
    client.release();
  }
});

// Get monthly summary of payroll expenses
router.get('/summary/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  try {
    // Get total payroll expenses for the month
    const totalResult = await db.query(
      `SELECT 
         SUM(amount) as total_amount,
         COUNT(*) as total_payments
       FROM payroll_expenses
       WHERE EXTRACT(YEAR FROM payment_date) = $1
       AND EXTRACT(MONTH FROM payment_date) = $2`,
      [year, month]
    );
    
    // Get breakdown by position
    const positionBreakdown = await db.query(
      `SELECT 
         position,
         SUM(amount) as total_amount,
         COUNT(*) as total_payments
       FROM payroll_expenses
       WHERE EXTRACT(YEAR FROM payment_date) = $1
       AND EXTRACT(MONTH FROM payment_date) = $2
       GROUP BY position
       ORDER BY total_amount DESC`,
      [year, month]
    );
    
    // Get breakdown by employee
    const employeeBreakdown = await db.query(
      `SELECT 
         employee_name,
         position,
         SUM(amount) as total_amount,
         SUM(hours_worked) as total_hours,
         COUNT(*) as payment_count
       FROM payroll_expenses
       WHERE EXTRACT(YEAR FROM payment_date) = $1
       AND EXTRACT(MONTH FROM payment_date) = $2
       GROUP BY employee_name, position
       ORDER BY total_amount DESC`,
      [year, month]
    );
    
    if (totalResult.rows.length === 0 || !totalResult.rows[0].total_amount) {
      return res.status(404).json({ error: 'No payroll expenses found for the specified month' });
    }
    
    const summary = {
      year: parseInt(year),
      month: parseInt(month),
      total_expenses: parseFloat(totalResult.rows[0].total_amount) || 0,
      total_payments: parseInt(totalResult.rows[0].total_payments) || 0,
      position_breakdown: positionBreakdown.rows,
      employee_breakdown: employeeBreakdown.rows
    };
    
    res.json(summary);
  } catch (err) {
    console.error(`Error fetching payroll summary for ${month}/${year}:`, err);
    res.status(500).json({ error: 'Failed to fetch payroll summary' });
  }
});

// Get list of unique positions for dropdown
router.get('/positions/list', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT position 
       FROM payroll_expenses 
       WHERE position IS NOT NULL
       ORDER BY position`
    );
    
    res.json(result.rows.map(row => row.position));
  } catch (err) {
    console.error('Error fetching positions list:', err);
    res.status(500).json({ error: 'Failed to fetch positions list' });
  }
});

// Get list of unique employees for dropdown
router.get('/employees/list', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT employee_name 
       FROM payroll_expenses 
       ORDER BY employee_name`
    );
    
    res.json(result.rows.map(row => row.employee_name));
  } catch (err) {
    console.error('Error fetching employees list:', err);
    res.status(500).json({ error: 'Failed to fetch employees list' });
  }
});

// Utility function to update monthly financial summary for payroll expenses
async function updateMonthlyPayrollSummary(client, dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  
  try {
    // Get total payroll expenses for the month
    const payrollTotal = await client.query(
      `SELECT 
         COALESCE(SUM(amount), 0) as total_payroll,
         COUNT(*) as payment_count
       FROM payroll_expenses
       WHERE EXTRACT(YEAR FROM payment_date) = $1
       AND EXTRACT(MONTH FROM payment_date) = $2`,
      [year, month]
    );
    
    // Get breakdown by position
    const positionBreakdown = await client.query(
      `SELECT 
         position,
         SUM(amount) as total_amount
       FROM payroll_expenses
       WHERE EXTRACT(YEAR FROM payment_date) = $1
       AND EXTRACT(MONTH FROM payment_date) = $2
       GROUP BY position`,
      [year, month]
    );
    
    // Convert to an object with position keys
    const payrollExpenseBreakdown = {};
    positionBreakdown.rows.forEach(row => {
      payrollExpenseBreakdown[row.position || 'unassigned'] = parseFloat(row.total_amount);
    });
    
    // Check if we have a monthly financial summary
    const existingSummary = await client.query(
      'SELECT id FROM monthly_financial_summaries WHERE year = $1 AND month = $2',
      [year, month]
    );
    
    if (existingSummary.rows.length > 0) {
      // Update existing summary
      await client.query(
        `UPDATE monthly_financial_summaries
         SET payroll_expenses = $1,
             payroll_expense_breakdown = $2,
             updated_at = NOW()
         WHERE year = $3 AND month = $4`,
        [
          payrollTotal.rows[0].total_payroll || 0,
          JSON.stringify(payrollExpenseBreakdown),
          year,
          month
        ]
      );
    } else {
      // Create new summary with just payroll data
      // Note: Other data will be populated by other update functions
      await client.query(
        `INSERT INTO monthly_financial_summaries (
           year,
           month,
           payroll_expenses,
           payroll_expense_breakdown,
           created_at,
           updated_at
         ) VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (year, month) 
         DO UPDATE SET
           payroll_expenses = $3,
           payroll_expense_breakdown = $4,
           updated_at = NOW()`,
        [
          year,
          month,
          payrollTotal.rows[0].total_payroll || 0,
          JSON.stringify(payrollExpenseBreakdown)
        ]
      );
    }
  } catch (err) {
    console.error(`Error updating monthly payroll summary for ${month}/${year}:`, err);
    throw err;
  }
}

module.exports = router; 