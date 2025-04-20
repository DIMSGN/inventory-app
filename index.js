// Root index.js - Routes requests to the backend app
const app = require('./backend/index.js');

// Log startup information
console.log(`Server starting in ${process.env.NODE_ENV || 'development'} mode`);

// Export the app for testing or programmatic use
module.exports = app;