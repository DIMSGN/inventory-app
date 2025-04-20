const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { format, startOfMonth, endOfMonth } = require('date-fns');

// Get all daily economy records
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT * FROM daily_economy
      ORDER BY record_date DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching daily economy records:', error);
    res.status(500).json({ error: 'Failed to fetch daily economy records' });
  }
});

// Get a single daily economy record
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM daily_economy WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Daily economy record not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching daily economy record:', error);
    res.status(500).json({ error: 'Failed to fetch daily economy record' });
  }
});

// Create a new daily economy record
router.post('/', async (req, res) => {
  const { record_date, total_income, gross_profit, payroll_expenses, operating_expenses } = req.body;
  
  // Validate request body
  if (!record_date || total_income === undefined || gross_profit === undefined || 
      payroll_expenses === undefined || operating_expenses === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const [result] = await pool.promise().query(
      `INSERT INTO daily_economy 
       (record_date, total_income, gross_profit, payroll_expenses, operating_expenses) 
       VALUES (?, ?, ?, ?, ?)`,
      [record_date, total_income, gross_profit, payroll_expenses, operating_expenses]
    );
    
    const [newRecord] = await pool.promise().query(
      'SELECT * FROM daily_economy WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newRecord[0]);
  } catch (error) {
    console.error('Error creating daily economy record:', error);
    res.status(500).json({ error: 'Failed to create daily economy record' });
  }
});

// Update a daily economy record
router.put('/:id', async (req, res) => {
  const { record_date, total_income, gross_profit, payroll_expenses, operating_expenses } = req.body;
  
  // Validate request body
  if (!record_date || total_income === undefined || gross_profit === undefined || 
      payroll_expenses === undefined || operating_expenses === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Check if record exists
    const [existing] = await pool.promise().query(
      'SELECT * FROM daily_economy WHERE id = ?',
      [req.params.id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Daily economy record not found' });
    }
    
    // Update record
    await pool.promise().query(
      `UPDATE daily_economy
       SET record_date = ?, total_income = ?, gross_profit = ?, 
           payroll_expenses = ?, operating_expenses = ?
       WHERE id = ?`,
      [record_date, total_income, gross_profit, payroll_expenses, operating_expenses, req.params.id]
    );
    
    // Get updated record
    const [updated] = await pool.promise().query(
      'SELECT * FROM daily_economy WHERE id = ?',
      [req.params.id]
    );
    
    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating daily economy record:', error);
    res.status(500).json({ error: 'Failed to update daily economy record' });
  }
});

// Delete a daily economy record
router.delete('/:id', async (req, res) => {
  try {
    // Check if record exists
    const [existing] = await pool.promise().query(
      'SELECT * FROM daily_economy WHERE id = ?',
      [req.params.id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Daily economy record not found' });
    }
    
    // Delete record
    await pool.promise().query(
      'DELETE FROM daily_economy WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'Daily economy record deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily economy record:', error);
    res.status(500).json({ error: 'Failed to delete daily economy record' });
  }
});

// Get daily economy records by date range
router.get('/range/:startDate/:endDate', async (req, res) => {
  const { startDate, endDate } = req.params;
  
  try {
    const [rows] = await pool.promise().query(
      `SELECT * FROM daily_economy
       WHERE record_date BETWEEN ? AND ?
       ORDER BY record_date DESC`,
      [startDate, endDate]
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching daily economy records by date range:', error);
    res.status(500).json({ error: 'Failed to fetch daily economy records by date range' });
  }
});

// Get a daily economy log by date
router.get('/date/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const [rows] = await pool.promise().query(
      'SELECT * FROM daily_economy WHERE record_date = ?',
      [date]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Daily economy log not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching daily economy log for date ${date}:`, error);
    res.status(500).json({ error: 'Failed to fetch daily economy log' });
  }
});

// Get daily economy logs for a specific month
router.get('/month/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  
  try {
    // Create date range for the month
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));
    
    const [rows] = await pool.promise().query(
      `SELECT * FROM daily_economy
       WHERE record_date BETWEEN ? AND ?
       ORDER BY record_date`,
      [startDate, endDate]
    );
    
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching daily economy logs for ${month}/${year}:`, error);
    res.status(500).json({ error: 'Failed to fetch monthly daily economy logs' });
  }
});

// Generate a daily economy log from sales and expenses data for a specific date
router.post('/generate/:date', async (req, res) => {
  const { date } = req.params;
  
  try {
    // Check if a log already exists for this date
    const [existing] = await pool.promise().query(
      'SELECT * FROM daily_economy WHERE record_date = ?',
      [date]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ 
        error: 'A daily economy log already exists for this date',
        existing_id: existing[0].id
      });
    }
    
    // Get sales data from all sources for the date
    const [salesData] = await pool.promise().query(`
      SELECT 
        SUM(
          CASE 
            WHEN source = 'food' THEN amount
            WHEN source = 'coffee' THEN amount
            WHEN source = 'cocktail' THEN amount
            WHEN source = 'drink' THEN amount
            ELSE 0 
          END
        ) AS total_sales,
        JSON_OBJECT_AGG(
          source, 
          amount
        ) AS sales_breakdown
      FROM (
        SELECT 'food' AS source, COALESCE(SUM(quantity_sold * sale_price), 0) AS amount
        FROM food_recipes_sales
        WHERE DATE(sale_date) = ?
        UNION ALL
        SELECT 'coffee' AS source, COALESCE(SUM(quantity_sold * sale_price), 0) AS amount
        FROM coffees_beverages_recipes_sales
        WHERE DATE(sale_date) = ?
        UNION ALL
        SELECT 'cocktail' AS source, COALESCE(SUM(quantity_sold * sale_price), 0) AS amount
        FROM cocktails_recipes_sales
        WHERE DATE(sale_date) = ?
        UNION ALL
        SELECT 'drink' AS source, COALESCE(SUM(quantity_sold_ml * sale_price), 0) AS amount
        FROM drinks_sales
        WHERE DATE(sale_date) = ?
      ) sales
    `, [date, date, date, date]);
    
    // Get operating expenses for the date
    const [operatingExpensesData] = await pool.promise().query(`
      SELECT 
        COALESCE(SUM(amount), 0) AS total_expenses,
        JSON_OBJECT_AGG(
          category, 
          category_amount
        ) AS expense_breakdown
      FROM (
        SELECT category, SUM(amount) AS category_amount
        FROM operating_expenses
        WHERE expense_date = ?
        GROUP BY category
      ) expenses
    `, [date]);
    
    // Get payroll expenses for the date
    const [payrollExpensesData] = await pool.promise().query(`
      SELECT 
        COALESCE(SUM(amount), 0) AS total_payroll,
        JSON_OBJECT_AGG(
          COALESCE(position, 'unassigned'), 
          position_amount
        ) AS payroll_breakdown
      FROM (
        SELECT position, SUM(amount) AS position_amount
        FROM payroll_expenses
        WHERE payment_date = ?
        GROUP BY position
      ) payroll
    `, [date]);
    
    // Extract values from query results
    const totalSales = parseFloat(salesData[0]?.total_sales || 0);
    const salesBreakdown = salesData[0]?.sales_breakdown || {};
    
    const totalOperatingExpenses = parseFloat(operatingExpensesData[0]?.total_expenses || 0);
    const operatingExpenseBreakdown = operatingExpensesData[0]?.expense_breakdown || {};
    
    const totalPayroll = parseFloat(payrollExpensesData[0]?.total_payroll || 0);
    const payrollBreakdown = payrollExpensesData[0]?.payroll_breakdown || {};
    
    // Calculate net profit
    const netProfit = totalSales - totalOperatingExpenses - totalPayroll;
    
    // Insert the daily economy log
    const [result] = await pool.promise().query(
      `INSERT INTO daily_economy 
       (record_date, total_income, gross_profit, payroll_expenses, operating_expenses) 
       VALUES (?, ?, ?, ?, ?)`,
      [date, totalSales, netProfit, totalPayroll, totalOperatingExpenses]
    );
    
    // Get the generated log
    const [newRecord] = await pool.promise().query(
      'SELECT * FROM daily_economy WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newRecord[0]);
  } catch (error) {
    console.error(`Error generating daily economy log for date ${date}:`, error);
    res.status(500).json({ error: 'Failed to generate daily economy log' });
  }
});

// Get monthly summary from daily logs
router.get('/summary/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  try {
    // Create date range for the month
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));
    
    // Get the monthly summary directly from the monthly_financial_summaries table
    const [summaryResult] = await pool.promise().query(
      `SELECT 
         year,
         month,
         total_revenue,
         revenue_breakdown,
         operating_expenses,
         operating_expense_breakdown,
         payroll_expenses,
         payroll_expense_breakdown,
         net_profit,
         created_at,
         updated_at
       FROM monthly_financial_summaries
       WHERE year = ? AND month = ?`,
      [year, month]
    );
    
    if (summaryResult.length > 0) {
      // Return the existing summary
      return res.json(summaryResult[0]);
    }
    
    // If no summary exists, calculate it from daily logs
    const [result] = await pool.promise().query(
      `SELECT 
         SUM(total_sales) AS total_revenue,
         SUM(operating_expenses) AS operating_expenses,
         SUM(payroll_expenses) AS payroll_expenses,
         SUM(net_profit) AS net_profit,
         COUNT(*) AS days_count,
         JSON_OBJECT_AGG(
           TO_CHAR(record_date, 'YYYY-MM-DD'),
           JSON_BUILD_OBJECT(
             'total_sales', total_sales,
             'operating_expenses', operating_expenses,
             'payroll_expenses', payroll_expenses,
             'net_profit', net_profit
           )
         ) AS daily_breakdown
       FROM daily_economy
       WHERE record_date BETWEEN ? AND ?`,
      [startDate, endDate]
    );
    
    if (result.length === 0 || result[0].days_count === 0) {
      return res.status(404).json({ error: 'No daily economy logs found for the specified month' });
    }
    
    // Create and return a summary object
    const summary = {
      year: parseInt(year),
      month: parseInt(month),
      total_revenue: parseFloat(result[0].total_revenue) || 0,
      operating_expenses: parseFloat(result[0].operating_expenses) || 0,
      payroll_expenses: parseFloat(result[0].payroll_expenses) || 0,
      net_profit: parseFloat(result[0].net_profit) || 0,
      days_count: parseInt(result[0].days_count) || 0,
      daily_breakdown: result[0].daily_breakdown || {}
    };
    
    res.json(summary);
  } catch (error) {
    console.error(`Error fetching monthly summary for ${month}/${year}:`, error);
    res.status(500).json({ error: 'Failed to fetch monthly summary' });
  }
});

module.exports = router; 