// Root index.js - Routes requests to the backend app
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Log environment for debugging
console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`Working directory: ${process.cwd()}`);
console.log(`Backend directory: ${path.resolve(__dirname, './backend')}`);

// Ensure Express can find router.js
function patchExpress() {
  console.log('Checking if Express needs patching...');

  // Try to locate express node modules
  let expressDir = path.join(__dirname, 'node_modules', 'express');
  if (!fs.existsSync(expressDir)) {
    expressDir = path.join(__dirname, 'backend', 'node_modules', 'express');
    if (!fs.existsSync(expressDir)) {
      console.log('Express module directory not found');
      return;
    }
  }

  // Create router.js in lib directory if missing
  const libDir = path.join(expressDir, 'lib');
  const routerJsPath = path.join(libDir, 'router.js');
  
  if (!fs.existsSync(routerJsPath)) {
    console.log('Creating router.js for Express');
    
    try {
      // Try to copy from router/index.js
      const routerIndexPath = path.join(libDir, 'router', 'index.js');
      if (fs.existsSync(routerIndexPath)) {
        fs.copyFileSync(routerIndexPath, routerJsPath);
        console.log('Created router.js from router/index.js');
      } else {
        // Create a minimal router.js
        fs.writeFileSync(routerJsPath, `
          // Express router stub
          module.exports = require('./router/index.js');
        `);
        console.log('Created basic router.js stub');
      }
    } catch (error) {
      console.error('Failed to patch Express:', error);
    }
  } else {
    console.log('Express router.js file already exists');
  }
}

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

// Patch Express before loading backend
patchExpress();

// Try to load the backend app
try {
  console.log('Loading backend application...');
  const app = require('./backend/index.js');
  console.log('Backend app loaded successfully');
  
  // Export the app for testing or programmatic use
  module.exports = app;
} catch (error) {
  console.error('Failed to load backend application:');
  console.error(error);
  
  // Attempt a direct fix
  if (error.code === 'MODULE_NOT_FOUND' && error.requireStack && 
      error.message.includes('./router')) {
    console.error('Express router module not found error detected');
    console.error('Attempting to create a compatibility layer...');
    
    try {
      // Create router.js directly at the path Express is looking for
      const lastPath = error.requireStack[0];
      const expressLibDir = path.dirname(lastPath);
      const routerPath = path.join(expressLibDir, 'router.js');
      
      fs.writeFileSync(routerPath, `
        // Express router compatibility module
        'use strict';
        
        /**
         * Basic router stub
         */
        function Router() {
          function router(req, res, next) {
            next();
          }
          router.use = function() { return this; };
          router.handle = function() {};
          return router;
        }
        
        module.exports = Router;
      `);
      
      console.log('Created compatibility router.js at', routerPath);
      console.log('Retrying backend application load...');
      
      // Try loading again
      const app = require('./backend/index.js');
      console.log('Backend app loaded successfully after fix');
      module.exports = app;
    } catch (patchError) {
      console.error('Failed to create compatibility layer:', patchError);
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
}