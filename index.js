// Root index.js - Routes requests to the backend app
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Log environment for debugging
console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`Working directory: ${process.cwd()}`);
console.log(`Backend directory: ${path.resolve(__dirname, './backend')}`);

// Check if backend node_modules exists, install if not
const backendModulesPath = path.join(__dirname, 'backend', 'node_modules');
if (!fs.existsSync(backendModulesPath)) {
  console.log('Backend node_modules not found, installing dependencies...');
  try {
    execSync('cd backend && npm install', { stdio: 'inherit' });
    console.log('Backend dependencies installed successfully');
  } catch (error) {
    console.error('Failed to install backend dependencies:');
    console.error(error.message);
    // Continue anyway - maybe the dependencies are bundled
  }
}

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