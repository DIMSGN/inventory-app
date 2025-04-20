const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateFinancialData } = require('../utils/validators');

/**
 * GET /api/financial/annual/:year
 * Retrieve financial data for a specific year
 */
router.get('/annual/:year', async (req, res) => {
  const { year } = req.params;
  
  try {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Get sales data from actual sales tables
      const salesQuery = `
        SELECT 'Drinks' as category, p.product_name as name, 
               SUM(ds.quantity_sold_ml) as quantity, 
               SUM(ds.sale_price) as revenue,
               MONTH(ds.sale_date) as month
        FROM drinks_sales ds
        JOIN products p ON ds.product_id = p.product_id
        WHERE YEAR(ds.sale_date) = ?
        GROUP BY p.product_name, MONTH(ds.sale_date)
        
        UNION ALL
        
        SELECT 'Food' as category, r.name, 
               SUM(frs.quantity_sold) as quantity,
               SUM(frs.sale_price) as revenue,
               MONTH(frs.sale_date) as month
        FROM food_recipes_sales frs
        JOIN recipes r ON frs.recipe_id = r.recipe_id
        WHERE YEAR(frs.sale_date) = ?
        GROUP BY r.name, MONTH(frs.sale_date)
        
        UNION ALL
        
        SELECT 'Cocktails' as category, r.name,
               SUM(crs.quantity_sold) as quantity,
               SUM(crs.sale_price) as revenue,
               MONTH(crs.sale_date) as month
        FROM cocktails_recipes_sales crs
        JOIN recipes r ON crs.recipe_id = r.recipe_id
        WHERE YEAR(crs.sale_date) = ?
        GROUP BY r.name, MONTH(crs.sale_date)
        
        UNION ALL
        
        SELECT 'Beverages' as category, r.name,
               SUM(cbrs.quantity_sold) as quantity,
               SUM(cbrs.sale_price) as revenue,
               MONTH(cbrs.sale_date) as month
        FROM coffees_beverages_recipes_sales cbrs
        JOIN recipes r ON cbrs.recipe_id = r.recipe_id
        WHERE YEAR(cbrs.sale_date) = ?
        GROUP BY r.name, MONTH(cbrs.sale_date)
        
        ORDER BY category, name, month
      `;
      
      const salesResult = await client.query(salesQuery, [year, year, year, year]);
      
      // Get expense data from expense tables
      const expensesQuery = `
        SELECT 'Operating' as expense_type, expense_type as name, 
               SUM(amount) as amount,
               MONTH(expense_date) as month
        FROM operating_expenses
        WHERE YEAR(expense_date) = ?
        GROUP BY expense_type, MONTH(expense_date)
        
        UNION ALL
        
        SELECT 'Payroll' as expense_type, employee_name as name,
               SUM(amount) as amount,
               MONTH(payroll_date) as month
        FROM payroll_expenses
        WHERE YEAR(payroll_date) = ?
        GROUP BY employee_name, MONTH(payroll_date)
        
        ORDER BY expense_type, name, month
      `;
      
      const expensesResult = await client.query(expensesQuery, [year, year]);
      
      await client.query('COMMIT');
      
      // Process the sales data into the format needed for the frontend
      const processSalesData = (rows) => {
        // Group sales by category and name
        const salesByCategory = {};
        const categories = ['Drinks', 'Food', 'Cocktails', 'Beverages'];
        
        categories.forEach(category => {
          salesByCategory[category] = {};
        });
        
        // Organize sales data
        rows.forEach(row => {
          const { category, name, revenue, month } = row;
          
          if (!salesByCategory[category][name]) {
            salesByCategory[category][name] = {
              id: `${category.toLowerCase()}_${name.replace(/\s+/g, '_').toLowerCase()}`,
              name: name,
              category: category,
              months: Array(12).fill(0)
            };
          }
          
          // Month is 1-indexed, array is 0-indexed
          if (month >= 1 && month <= 12) {
            salesByCategory[category][name].months[month - 1] += parseFloat(revenue || 0);
          }
        });
        
        // Convert to array format
        const salesData = [];
        categories.forEach(category => {
          Object.values(salesByCategory[category]).forEach(item => {
            salesData.push(item);
          });
        });
        
        return salesData;
      };
      
      // Process the expense data
      const processExpensesData = (rows) => {
        // Group expenses by type
        const expensesByType = {
          'Operating': {},
          'Payroll': {}
        };
        
        // Organize expense data
        rows.forEach(row => {
          const { expense_type, name, amount, month } = row;
          
          if (!expensesByType[expense_type][name]) {
            expensesByType[expense_type][name] = {
              id: `${expense_type.toLowerCase()}_${name.replace(/\s+/g, '_').toLowerCase()}`,
              name: name,
              category: expense_type,
              months: Array(12).fill(0)
            };
          }
          
          // Month is 1-indexed, array is 0-indexed
          if (month >= 1 && month <= 12) {
            expensesByType[expense_type][name].months[month - 1] += parseFloat(amount || 0);
          }
        });
        
        // Convert to expected format
        const operating = Object.values(expensesByType['Operating']);
        const payroll = Object.values(expensesByType['Payroll']);
        
        return {
          costOfGoods: [], // Fill this if you have data
          operational: operating,
          utilities: [] // Fill this if you have data
        };
      };
      
      // Generate summary data
      const generateSummary = (sales, expenses) => {
        // Monthly totals
        const totalSales = Array(12).fill(0);
        const totalExpenses = Array(12).fill(0);
        
        // Calculate total sales by month
        sales.forEach(item => {
          item.months.forEach((value, idx) => {
            totalSales[idx] += value;
          });
        });
        
        // Calculate total expenses by month
        Object.values(expenses).forEach(category => {
          category.forEach(item => {
            item.months.forEach((value, idx) => {
              totalExpenses[idx] += value;
            });
          });
        });
        
        // Calculate profits
        const profits = totalSales.map((sales, idx) => sales - totalExpenses[idx]);
        
        return {
          totalSales: totalSales.reduce((sum, val) => sum + val, 0),
          totalExpenses: totalExpenses.reduce((sum, val) => sum + val, 0),
          profit: profits.reduce((sum, val) => sum + val, 0),
          salesByMonth: totalSales,
          expensesByMonth: totalExpenses,
          profitByMonth: profits
        };
      };
      
      // Process the data
      const salesData = processSalesData(salesResult.rows);
      const expensesData = processExpensesData(expensesResult.rows);
      const summaryData = generateSummary(salesData, expensesData);
      
      res.json({
        sales: salesData,
        expenses: expensesData,
        summary: summaryData,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error retrieving financial data:', error);
    res.status(500).json({ error: 'Failed to retrieve financial data' });
  }
});

/**
 * PUT /api/financial/annual/:year
 * Update financial data for a specific year - this would need to be adapted to your schema
 */
router.put('/annual/:year', async (req, res) => {
  const { year } = req.params;
  
  // This would need to be adapted based on your schema
  res.status(501).json({ error: 'Update functionality not implemented for this schema' });
});

module.exports = router; 