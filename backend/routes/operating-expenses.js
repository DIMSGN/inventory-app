const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { format } = require('date-fns');

// Get all operating expenses
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         id, 
         category, 
         description, 
         amount, 
         expense_date, 
         payment_method,
         receipt_file,
         notes,
         created_at,
         updated_at
       FROM operating_expenses
       ORDER BY expense_date DESC, category`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching operating expenses:', err);
    res.status(500).json({ error: 'Failed to fetch operating expenses' });
  }
});

// Get operating expenses by month
router.get('/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  try {
    const result = await db.query(
      `SELECT 
         id, 
         category, 
         description, 
         amount, 
         expense_date, 
         payment_method,
         receipt_file,
         notes,
         created_at,
         updated_at
       FROM operating_expenses
       WHERE EXTRACT(YEAR FROM expense_date) = $1
       AND EXTRACT(MONTH FROM expense_date) = $2
       ORDER BY expense_date DESC, category`,
      [year, month]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching operating expenses for ${month}/${year}:`, err);
    res.status(500).json({ error: 'Failed to fetch monthly operating expenses' });
  }
});

// Get operating expenses by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const result = await db.query(
      `SELECT 
         id, 
         category, 
         description, 
         amount, 
         expense_date, 
         payment_method,
         receipt_file,
         notes,
         created_at,
         updated_at
       FROM operating_expenses
       WHERE category ILIKE $1
       ORDER BY expense_date DESC`,
      [`%${category}%`]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching operating expenses for category ${category}:`, err);
    res.status(500).json({ error: 'Failed to fetch category operating expenses' });
  }
});

// Get operating expenses by date range
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
         category, 
         description, 
         amount, 
         expense_date, 
         payment_method,
         receipt_file,
         notes,
         created_at,
         updated_at
       FROM operating_expenses
       WHERE expense_date BETWEEN $1 AND $2
       ORDER BY expense_date DESC, category`,
      [start_date, end_date]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching operating expenses for date range ${start_date} to ${end_date}:`, err);
    res.status(500).json({ error: 'Failed to fetch operating expenses for date range' });
  }
});

// Get a single operating expense
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `SELECT 
         id, 
         category, 
         description, 
         amount, 
         expense_date, 
         payment_method,
         receipt_file,
         notes,
         created_at,
         updated_at
       FROM operating_expenses
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Operating expense not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching operating expense with ID ${id}:`, err);
    res.status(500).json({ error: 'Failed to fetch operating expense' });
  }
});

// Create a new operating expense
router.post('/', async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const { 
      category, 
      description, 
      amount, 
      expense_date, 
      payment_method,
      receipt_file,
      notes 
    } = req.body;
    
    // Validate required fields
    if (!category || !amount || !expense_date) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Category, amount, and expense date are required' 
      });
    }
    
    const result = await client.query(
      `INSERT INTO operating_expenses (
         category, 
         description, 
         amount, 
         expense_date, 
         payment_method,
         receipt_file,
         notes,
         created_at,
         updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [
        category,
        description || null,
        amount,
        expense_date,
        payment_method || null,
        receipt_file || null,
        notes || null
      ]
    );
    
    // Update monthly financial summary
    await updateMonthlyOperatingExpenseSummary(client, expense_date);
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error adding operating expense:', err);
    res.status(500).json({ error: 'Failed to add operating expense' });
  } finally {
    client.release();
  }
});

// Update an existing operating expense
router.put('/:id', async (req, res) => {
  const client = await db.getClient();
  const { id } = req.params;
  
  try {
    await client.query('BEGIN');
    
    const { 
      category, 
      description, 
      amount, 
      expense_date, 
      payment_method,
      receipt_file,
      notes 
    } = req.body;
    
    // Get the existing expense to check if the expense date changes
    const existingExpense = await client.query(
      'SELECT expense_date FROM operating_expenses WHERE id = $1',
      [id]
    );
    
    if (existingExpense.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Operating expense not found' });
    }
    
    const oldExpenseDate = existingExpense.rows[0].expense_date;
    
    const result = await client.query(
      `UPDATE operating_expenses
       SET 
         category = COALESCE($1, category),
         description = COALESCE($2, description),
         amount = COALESCE($3, amount),
         expense_date = COALESCE($4, expense_date),
         payment_method = COALESCE($5, payment_method),
         receipt_file = COALESCE($6, receipt_file),
         notes = COALESCE($7, notes),
         updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        category,
        description,
        amount,
        expense_date,
        payment_method,
        receipt_file,
        notes,
        id
      ]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Operating expense not found' });
    }
    
    // If expense date changed, update monthly financial summaries for both months
    if (expense_date && oldExpenseDate && format(new Date(expense_date), 'yyyy-MM') !== format(new Date(oldExpenseDate), 'yyyy-MM')) {
      await updateMonthlyOperatingExpenseSummary(client, oldExpenseDate);
      await updateMonthlyOperatingExpenseSummary(client, expense_date);
    } else {
      // Otherwise just update the current month
      await updateMonthlyOperatingExpenseSummary(client, expense_date || oldExpenseDate);
    }
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error updating operating expense with ID ${id}:`, err);
    res.status(500).json({ error: 'Failed to update operating expense' });
  } finally {
    client.release();
  }
});

// Delete an operating expense
router.delete('/:id', async (req, res) => {
  const client = await db.getClient();
  const { id } = req.params;
  
  try {
    await client.query('BEGIN');
    
    // Get the expense date to update the monthly summary after deletion
    const dateResult = await client.query(
      'SELECT expense_date FROM operating_expenses WHERE id = $1',
      [id]
    );
    
    if (dateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Operating expense not found' });
    }
    
    const expenseDate = dateResult.rows[0].expense_date;
    
    // Delete the operating expense
    const result = await client.query(
      'DELETE FROM operating_expenses WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Operating expense not found' });
    }
    
    // Update the monthly summary
    await updateMonthlyOperatingExpenseSummary(client, expenseDate);
    
    await client.query('COMMIT');
    res.json({ message: 'Operating expense deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error deleting operating expense with ID ${id}:`, err);
    res.status(500).json({ error: 'Failed to delete operating expense' });
  } finally {
    client.release();
  }
});

// Get monthly summary of operating expenses
router.get('/summary/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  try {
    // Get total operating expenses for the month
    const totalResult = await db.query(
      `SELECT 
         SUM(amount) as total_amount,
         COUNT(*) as total_expenses
       FROM operating_expenses
       WHERE EXTRACT(YEAR FROM expense_date) = $1
       AND EXTRACT(MONTH FROM expense_date) = $2`,
      [year, month]
    );
    
    // Get breakdown by category
    const categoryBreakdown = await db.query(
      `SELECT 
         category,
         SUM(amount) as total_amount,
         COUNT(*) as expense_count
       FROM operating_expenses
       WHERE EXTRACT(YEAR FROM expense_date) = $1
       AND EXTRACT(MONTH FROM expense_date) = $2
       GROUP BY category
       ORDER BY total_amount DESC`,
      [year, month]
    );
    
    if (totalResult.rows.length === 0 || !totalResult.rows[0].total_amount) {
      return res.status(404).json({ error: 'No operating expenses found for the specified month' });
    }
    
    const summary = {
      year: parseInt(year),
      month: parseInt(month),
      total_expenses: parseFloat(totalResult.rows[0].total_amount) || 0,
      expense_count: parseInt(totalResult.rows[0].total_expenses) || 0,
      category_breakdown: categoryBreakdown.rows
    };
    
    res.json(summary);
  } catch (err) {
    console.error(`Error fetching operating expense summary for ${month}/${year}:`, err);
    res.status(500).json({ error: 'Failed to fetch operating expense summary' });
  }
});

// Get list of unique categories for dropdown
router.get('/categories/list', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT category 
       FROM operating_expenses 
       ORDER BY category`
    );
    
    res.json(result.rows.map(row => row.category));
  } catch (err) {
    console.error('Error fetching categories list:', err);
    res.status(500).json({ error: 'Failed to fetch categories list' });
  }
});

// Utility function to update monthly financial summary for operating expenses
async function updateMonthlyOperatingExpenseSummary(client, dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  
  try {
    // Get total operating expenses for the month
    const expenseTotal = await client.query(
      `SELECT 
         COALESCE(SUM(amount), 0) as total_operating_expenses,
         COUNT(*) as expense_count
       FROM operating_expenses
       WHERE EXTRACT(YEAR FROM expense_date) = $1
       AND EXTRACT(MONTH FROM expense_date) = $2`,
      [year, month]
    );
    
    // Get breakdown by category
    const categoryBreakdown = await client.query(
      `SELECT 
         category,
         SUM(amount) as total_amount
       FROM operating_expenses
       WHERE EXTRACT(YEAR FROM expense_date) = $1
       AND EXTRACT(MONTH FROM expense_date) = $2
       GROUP BY category`,
      [year, month]
    );
    
    // Convert to an object with category keys
    const operatingExpenseBreakdown = {};
    categoryBreakdown.rows.forEach(row => {
      operatingExpenseBreakdown[row.category || 'uncategorized'] = parseFloat(row.total_amount);
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
         SET operating_expenses = $1,
             operating_expense_breakdown = $2,
             updated_at = NOW()
         WHERE year = $3 AND month = $4`,
        [
          expenseTotal.rows[0].total_operating_expenses || 0,
          JSON.stringify(operatingExpenseBreakdown),
          year,
          month
        ]
      );
    } else {
      // Create new summary with just operating expense data
      // Note: Other data will be populated by other update functions
      await client.query(
        `INSERT INTO monthly_financial_summaries (
           year,
           month,
           operating_expenses,
           operating_expense_breakdown,
           created_at,
           updated_at
         ) VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (year, month) 
         DO UPDATE SET
           operating_expenses = $3,
           operating_expense_breakdown = $4,
           updated_at = NOW()`,
        [
          year,
          month,
          expenseTotal.rows[0].total_operating_expenses || 0,
          JSON.stringify(operatingExpenseBreakdown)
        ]
      );
    }
  } catch (err) {
    console.error(`Error updating monthly operating expense summary for ${month}/${year}:`, err);
    throw err;
  }
}

module.exports = router; 