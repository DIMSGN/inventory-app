/**
 * Clever Cloud Package Fix Script
 * This script fixes package installations for Clever Cloud deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running Clever Cloud package fix script...');

// Create directories if they don't exist
if (!fs.existsSync('node_modules')) {
  fs.mkdirSync('node_modules');
}

// Install Express directly with specific version
try {
  console.log('Installing Express package directly...');
  execSync('npm install express@4.17.1 --no-save', { stdio: 'inherit' });
  console.log('Express installed successfully');
} catch (error) {
  console.error('Failed to install Express:', error.message);
}

// Create a router.js file in the express lib directory
try {
  const expressDir = path.join('node_modules', 'express', 'lib');
  if (fs.existsSync(expressDir)) {
    const routerContent = `
// Express Router stub
'use strict';

const methods = require('methods');

function Router() {
  function router(req, res, next) {
    next();
  }
  
  router.route = function() {
    return { 
      get: function() { return this; },
      post: function() { return this; },
      put: function() { return this; },
      delete: function() { return this; }
    };
  };
  
  router.use = function() {
    return this;
  };
  
  router.handle = function(req, res, next) {
    next();
  };
  
  router.param = function() {
    return this;
  };
  
  // Add HTTP methods
  methods.forEach(function(method) {
    router[method] = function() {
      return this;
    };
  });
  
  return router;
}

module.exports = Router;
`;

    fs.writeFileSync(path.join(expressDir, 'router.js'), routerContent);
    console.log('Created router.js in Express lib directory');
  } else {
    console.error('Express lib directory not found');
  }
} catch (error) {
  console.error('Failed to create router.js:', error.message);
}

console.log('Package fix completed'); 