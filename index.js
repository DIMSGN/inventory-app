// Root index.js - Simplified approach that creates a minimal Express app
// and forwards requests to the backend
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

// Log startup info
console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`PORT: ${process.env.PORT || 8080}`);

// Create root Express app
const app = express();

// Simple health check endpoint directly in root app
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Root API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static files from React build
const buildPath = path.join(__dirname, 'frontend', 'build');
if (fs.existsSync(buildPath)) {
  console.log('Serving static files from:', buildPath);
  app.use(express.static(buildPath));
}

// Try to connect and forward to backend API
try {
  console.log('Attempting to mount backend API...');
  
  // Import API routes directly
  const productsRouter = require('./backend/routes/products');
  const rulesRouter = require('./backend/routes/rules');
  const categoriesRouter = require('./backend/routes/categories');
  const unitsRouter = require('./backend/routes/units');
  const suppliersRouter = require('./backend/routes/suppliers');
  const invoicesRouter = require('./backend/routes/invoices');
  const recipesRouter = require('./backend/routes/recipes');
  const salesRouter = require('./backend/routes/sales');
  const expensesRouter = require('./backend/routes/expenses');
  const financialsRouter = require('./backend/routes/financials');
  const payrollExpensesRouter = require('./backend/routes/payroll-expenses');
  const operatingExpensesRouter = require('./backend/routes/operating-expenses');
  const dailyEconomyRouter = require('./backend/routes/daily-economy');

  // Mount all API routes
  app.use("/api/products", productsRouter);
  app.use("/api/rules", rulesRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/units", unitsRouter);
  app.use("/api/suppliers", suppliersRouter);
  app.use("/api/invoices", invoicesRouter);
  app.use("/api/recipes", recipesRouter);
  app.use("/api/sales", salesRouter);
  app.use("/api/expenses", expensesRouter);
  app.use("/api/financial", financialsRouter);
  app.use("/api/payroll-expenses", payrollExpensesRouter);
  app.use("/api/operating-expenses", operatingExpensesRouter);
  app.use("/api/daily-economy", dailyEconomyRouter);
  
  console.log('Backend API routes mounted successfully');
} catch (error) {
  console.error('Error loading backend routes:', error.message);
  console.log('Continuing with limited functionality');
}

// Handle API 404s
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Catch-all route for React app - must be last
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(buildPath, 'index.html'))) {
    res.sendFile(path.join(buildPath, 'index.html'));
  } else {
    res.status(404).send('Frontend not built');
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

const PORT = process.env.PORT || 8080;

// Start server directly
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

module.exports = app;