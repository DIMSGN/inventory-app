const express = require("express");
const router = express.Router();
const queryDatabase = require('../utils/queryDatabase');
const pool = require('../db/connection');
// Import db utility
const db = require('../utils/db');
// const { verifyToken } = require('../middleware/auth');

/**
 * GET /api/expenses/operating
 * Get all operating expenses
 */
router.get("/operating", async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        description, 
        expense_date, 
        amount, 
        category, 
        department, 
        supplier, 
        notes,
        created_at
      FROM 
        operating_expenses 
      ORDER BY 
        expense_date DESC, 
        created_at DESC
    `;
    
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching operating expenses:', error);
    res.status(500).json({ error: 'Failed to fetch operating expenses' });
  }
});

/**
 * POST /api/expenses/operating
 * Record a new operating expense
 */
router.post("/operating", async (req, res) => {
  const { 
    description, 
    expense_date, 
    amount, 
    category, 
    department, 
    supplier, 
    notes 
  } = req.body;
  
  // Validate required fields
  if (!description || !expense_date || !amount) {
    return res.status(400).json({ error: 'Description, expense date, and amount are required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert into operating_expenses table
    const insertQuery = `
      INSERT INTO operating_expenses (
        description, 
        expense_date, 
        amount, 
        category, 
        department, 
        supplier, 
        notes
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    
    const values = [
      description, 
      expense_date, 
      amount, 
      category || null, 
      department || null, 
      supplier || null, 
      notes || null
    ];
    
    const { rows } = await client.query(insertQuery, values);
    
    await client.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding operating expense:', error);
    res.status(500).json({ error: 'Failed to add operating expense' });
  } finally {
    client.release();
  }
});

/**
 * DELETE /api/expenses/operating/:id
 * Delete an operating expense
 */
router.delete("/operating/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if the operating expense exists
    const checkQuery = 'SELECT id FROM operating_expenses WHERE id = $1';
    const checkResult = await client.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Operating expense not found' });
    }
    
    // Delete the operating expense
    const deleteQuery = 'DELETE FROM operating_expenses WHERE id = $1';
    await client.query(deleteQuery, [id]);
    
    await client.query('COMMIT');
    res.status(200).json({ message: 'Operating expense deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error deleting operating expense with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete operating expense' });
  } finally {
    client.release();
  }
});

/**
 * GET /api/expenses/payroll
 * Get all payroll expenses
 */
router.get("/payroll", async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        employee_name, 
        payment_date, 
        amount, 
        department, 
        employee_type, 
        notes,
        created_at
      FROM 
        payroll_expenses 
      ORDER BY 
        payment_date DESC, 
        created_at DESC
    `;
    
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching payroll expenses:', error);
    res.status(500).json({ error: 'Failed to fetch payroll expenses' });
  }
});

/**
 * POST /api/expenses/payroll
 * Record a new payroll expense
 */
router.post("/payroll", async (req, res) => {
  const { 
    employee_name, 
    payment_date, 
    amount, 
    department, 
    employee_type, 
    notes 
  } = req.body;
  
  // Validate required fields
  if (!employee_name || !payment_date || !amount) {
    return res.status(400).json({ error: 'Employee name, payment date, and amount are required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert into payroll_expenses table
    const insertQuery = `
      INSERT INTO payroll_expenses (
        employee_name, 
        payment_date, 
        amount, 
        department, 
        employee_type, 
        notes
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `;
    
    const values = [
      employee_name, 
      payment_date, 
      amount, 
      department || null, 
      employee_type || null, 
      notes || null
    ];
    
    const { rows } = await client.query(insertQuery, values);
    
    await client.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding payroll expense:', error);
    res.status(500).json({ error: 'Failed to add payroll expense' });
  } finally {
    client.release();
  }
});

/**
 * DELETE /api/expenses/payroll/:id
 * Delete a payroll expense
 */
router.delete("/payroll/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if the payroll expense exists
    const checkQuery = 'SELECT id FROM payroll_expenses WHERE id = $1';
    const checkResult = await client.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Payroll expense not found' });
    }
    
    // Delete the payroll expense
    const deleteQuery = 'DELETE FROM payroll_expenses WHERE id = $1';
    await client.query(deleteQuery, [id]);
    
    await client.query('COMMIT');
    res.status(200).json({ message: 'Payroll expense deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error deleting payroll expense with ID ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete payroll expense' });
  } finally {
    client.release();
  }
});

module.exports = router; 