const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { format } = require('date-fns');

// Get all daily financial logs
router.get('/daily', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM daily_financial_logs 
       ORDER BY log_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching daily financial logs:', err);
    res.status(500).json({ error: 'Failed to fetch daily financial logs' });
  }
});

// Get daily financial log by specific date
router.get('/daily/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM daily_financial_logs 
       WHERE log_date = $1`,
      [date]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Daily financial log not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching daily financial log for ${date}:`, err);
    res.status(500).json({ error: 'Failed to fetch daily financial log' });
  }
});

// Get financial logs for a specific month
router.get('/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM daily_financial_logs 
       WHERE EXTRACT(YEAR FROM log_date) = $1
       AND EXTRACT(MONTH FROM log_date) = $2
       ORDER BY log_date`,
      [year, month]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching financial logs for ${month}/${year}:`, err);
    res.status(500).json({ error: 'Failed to fetch monthly financial logs' });
  }
});

// Create or update a daily financial log
router.post('/daily', async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const { 
      log_date,
      cash_sales,
      card_sales,
      pos_total,
      cash_counted,
      cash_difference,
      sales_notes,
      expenses_paid,
      expense_notes,
      starting_cash,
      cash_deposit,
      staff_notes
    } = req.body;
    
    // Check if a log for this date already exists
    const existingLog = await client.query(
      'SELECT id FROM daily_financial_logs WHERE log_date = $1',
      [log_date]
    );
    
    let result;
    
    if (existingLog.rows.length > 0) {
      // Update existing log
      result = await client.query(
        `UPDATE daily_financial_logs
         SET cash_sales = $1,
             card_sales = $2,
             pos_total = $3,
             cash_counted = $4,
             cash_difference = $5,
             sales_notes = $6,
             expenses_paid = $7,
             expense_notes = $8,
             starting_cash = $9,
             cash_deposit = $10,
             staff_notes = $11,
             updated_at = NOW()
         WHERE log_date = $12
         RETURNING *`,
        [
          cash_sales,
          card_sales,
          pos_total,
          cash_counted,
          cash_difference,
          sales_notes,
          expenses_paid,
          expense_notes,
          starting_cash,
          cash_deposit,
          staff_notes,
          log_date
        ]
      );
    } else {
      // Create new log
      result = await client.query(
        `INSERT INTO daily_financial_logs (
           log_date,
           cash_sales,
           card_sales,
           pos_total,
           cash_counted,
           cash_difference,
           sales_notes,
           expenses_paid,
           expense_notes,
           starting_cash,
           cash_deposit,
           staff_notes,
           created_at,
           updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
         RETURNING *`,
        [
          log_date,
          cash_sales,
          card_sales,
          pos_total,
          cash_counted,
          cash_difference,
          sales_notes,
          expenses_paid,
          expense_notes,
          starting_cash,
          cash_deposit,
          staff_notes
        ]
      );
    }
    
    // Calculate monthly summary data after each daily log update
    await updateMonthlySummary(client, log_date);
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating/updating daily financial log:', err);
    res.status(500).json({ error: 'Failed to save daily financial log' });
  } finally {
    client.release();
  }
});

// Delete a daily financial log
router.delete('/daily/:date', async (req, res) => {
  const client = await db.getClient();
  const { date } = req.params;
  
  try {
    await client.query('BEGIN');
    
    // Delete the log
    const result = await client.query(
      'DELETE FROM daily_financial_logs WHERE log_date = $1 RETURNING *',
      [date]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Daily financial log not found' });
    }
    
    // Recalculate monthly summary after deletion
    await updateMonthlySummary(client, date);
    
    await client.query('COMMIT');
    res.json({ message: 'Daily financial log deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error deleting daily financial log for ${date}:`, err);
    res.status(500).json({ error: 'Failed to delete daily financial log' });
  } finally {
    client.release();
  }
});

// Get monthly summary data
router.get('/summary/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  try {
    const result = await db.query(
      `SELECT * FROM monthly_financial_summaries 
       WHERE year = $1 AND month = $2`,
      [year, month]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Monthly summary not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching monthly summary for ${month}/${year}:`, err);
    res.status(500).json({ error: 'Failed to fetch monthly summary' });
  }
});

// Get yearly summary data
router.get('/summary/yearly/:year', async (req, res) => {
  const { year } = req.params;
  try {
    const result = await db.query(
      `SELECT 
         SUM(total_sales) as yearly_sales,
         SUM(cash_sales) as yearly_cash_sales,
         SUM(card_sales) as yearly_card_sales,
         SUM(expenses_paid) as yearly_expenses,
         SUM(cash_deposit) as yearly_deposits,
         AVG(cash_difference) as avg_cash_difference
       FROM monthly_financial_summaries 
       WHERE year = $1`,
      [year]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching yearly summary for ${year}:`, err);
    res.status(500).json({ error: 'Failed to fetch yearly summary' });
  }
});

// Utility function to update monthly summary after changes to daily logs
async function updateMonthlySummary(client, dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  
  try {
    // Calculate monthly summary data
    const summaryData = await client.query(
      `SELECT 
         SUM(cash_sales) as total_cash_sales,
         SUM(card_sales) as total_card_sales,
         SUM(cash_sales + card_sales) as total_sales,
         SUM(pos_total) as total_pos,
         SUM(cash_counted) as total_cash_counted,
         SUM(cash_difference) as total_cash_difference,
         SUM(expenses_paid) as total_expenses,
         SUM(cash_deposit) as total_deposits,
         COUNT(*) as days_recorded
       FROM daily_financial_logs
       WHERE EXTRACT(YEAR FROM log_date) = $1
       AND EXTRACT(MONTH FROM log_date) = $2`,
      [year, month]
    );
    
    // Check if we have a monthly summary already
    const existingSummary = await client.query(
      'SELECT id FROM monthly_financial_summaries WHERE year = $1 AND month = $2',
      [year, month]
    );
    
    if (existingSummary.rows.length > 0) {
      // Update existing summary
      await client.query(
        `UPDATE monthly_financial_summaries
         SET total_sales = $1,
             cash_sales = $2,
             card_sales = $3,
             pos_total = $4,
             cash_counted = $5,
             cash_difference = $6,
             expenses_paid = $7,
             cash_deposit = $8,
             days_recorded = $9,
             updated_at = NOW()
         WHERE year = $10 AND month = $11`,
        [
          summaryData.rows[0].total_sales || 0,
          summaryData.rows[0].total_cash_sales || 0,
          summaryData.rows[0].total_card_sales || 0,
          summaryData.rows[0].total_pos || 0,
          summaryData.rows[0].total_cash_counted || 0,
          summaryData.rows[0].total_cash_difference || 0,
          summaryData.rows[0].total_expenses || 0,
          summaryData.rows[0].total_deposits || 0,
          summaryData.rows[0].days_recorded || 0,
          year,
          month
        ]
      );
    } else {
      // Create new summary
      await client.query(
        `INSERT INTO monthly_financial_summaries (
           year,
           month,
           total_sales,
           cash_sales,
           card_sales,
           pos_total,
           cash_counted,
           cash_difference,
           expenses_paid,
           cash_deposit,
           days_recorded,
           created_at,
           updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          year,
          month,
          summaryData.rows[0].total_sales || 0,
          summaryData.rows[0].total_cash_sales || 0,
          summaryData.rows[0].total_card_sales || 0,
          summaryData.rows[0].total_pos || 0,
          summaryData.rows[0].total_cash_counted || 0,
          summaryData.rows[0].total_cash_difference || 0,
          summaryData.rows[0].total_expenses || 0,
          summaryData.rows[0].total_deposits || 0,
          summaryData.rows[0].days_recorded || 0
        ]
      );
    }
  } catch (err) {
    console.error(`Error updating monthly summary for ${month}/${year}:`, err);
    throw err;
  }
}

module.exports = router; 