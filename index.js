// Root index.js - Routes requests to the backend app
require('dotenv').config();
const path = require('path');

// Log environment for debugging
console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`Working directory: ${process.cwd()}`);
console.log(`Backend directory: ${path.resolve(__dirname, './backend')}`);

// Try to load the backend app
try {
  const app = require('./backend/index.js');
  console.log('Backend app loaded successfully');
  
  // Export the app for testing or programmatic use
  module.exports = app;
} catch (error) {
  console.error('Failed to load backend application:');
  console.error(error);
  process.exit(1);
}