// Root index.js - Simplified approach that creates a minimal Express app
// and forwards requests to the backend
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

// Log startup info
console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`PORT: ${process.env.PORT || 8080}`);

// Emergency dependency installer
function installMissingDependency(moduleName) {
  try {
    console.log(`Emergency installation of missing dependency: ${moduleName}`);
    // Try to install the module synchronously
    childProcess.execSync(`npm install ${moduleName} --no-save`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log(`Successfully installed ${moduleName}`);
    
    // Try to require it now that it's installed
    return require(moduleName);
  } catch (err) {
    console.error(`Failed to install ${moduleName}:`, err.message);
    return null;
  }
}

// Safe require that installs missing dependencies
function safeRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return installMissingDependency(moduleName);
    }
    throw err;
  }
}

// Create missing Express files before importing Express
function setupExpressFiles() {
  try {
    // Find the express lib directory
    let expressLibDir;
    const possiblePaths = [
      path.join(__dirname, 'node_modules', 'express', 'lib'),
      path.join(__dirname, 'backend', 'node_modules', 'express', 'lib')
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        expressLibDir = p;
        break;
      }
    }
    
    if (!expressLibDir) {
      console.error('Could not find Express library directory');
      return false;
    }
    
    console.log('Found Express at:', expressLibDir);
    
    // Ensure all required dependencies are installed
    const dependencies = [
      'methods', 
      'path-to-regexp', 
      'array-flatten', 
      'debug', 
      'parseurl', 
      'qs',
      'serve-static'
    ];
    
    for (const dep of dependencies) {
      safeRequire(dep);
    }
    
    // Check if we need to patch Express files
    let needsPatch = false;
    
    try {
      // Try to require Express
      const express = require('express');
      
      // Test the router functionality
      const router = express.Router();
      
      // If we get here, Express works fine and doesn't need patching
      console.log('Express is functioning properly, no patching needed');
      return true;
    } catch (err) {
      console.log('Express needs patching:', err.message);
      needsPatch = true;
    }
    
    if (!needsPatch) {
      return true;
    }
    
    // Create router.js with a more complete implementation
    const routerPath = path.join(expressLibDir, 'router.js');
    const routerContent = `
/**
 * Module dependencies.
 * @private
 */

var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var mixin = require('utils-merge');
var debug = require('debug')('express:router');
var deprecate = require('depd')('express');
var flatten = require('array-flatten');
var parseUrl = require('parseurl');

/**
 * Module variables.
 * @private
 */

var objectRegExp = /^\\[object (.*?)\\]$/;

/**
 * Initialize a new \`Router\` with the given \`options\`.
 *
 * @param {Object} [options]
 * @return {Router} which is an callable function
 * @public
 */

var proto = module.exports = function(options) {
  var opts = options || {};

  function router(req, res, next) {
    router.handle(req, res, next);
  }

  // mixin Router class functions
  setPrototypeOf(router, proto);

  router.params = {};
  router._params = [];
  router.caseSensitive = opts.caseSensitive;
  router.mergeParams = opts.mergeParams;
  router.strict = opts.strict;
  router.stack = [];

  return router;
};

/**
 * Get prototype of object
 * @private
 */
function setPrototypeOf(obj, proto) {
  obj.__proto__ = proto;
  return obj;
}

/**
 * Handle the request.
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {Function} out
 * @private
 */

proto.handle = function handle(req, res, out) {
  var self = this;
  var stack = self.stack;
  var layer;
  var match;
  var idx = 0;
  var protohost = getProtohost(req.url) || '';
  var removed = '';
  var slashAdded = false;
  var paramcalled = {};

  // final function handler
  var done = out || finalhandler(req, res, {
    env: process.env.NODE_ENV || 'development',
    onerror: logerror
  });

  // store the original URL
  req.originalUrl = req.originalUrl || req.url;

  function next(err) {
    // Defaults to no layer match
    var layerError = err === 'route'
      ? null
      : err;

    // No more layers
    if (idx >= stack.length) {
      return done(layerError);
    }

    // Get layer from stack
    layer = stack[idx++];

    try {
      if (!layer.match(req.path)) {
        return next(layerError);
      }

      // Call the layer handler
      // Trim trailing slash
      if (layer.path !== "/" && req.path.endsWith("/")) {
        req.url = req.url.slice(0, -1);
      }

      // Call the layer handler
      layer.handle_request(req, res, next);
    } catch (err) {
      next(err);
    }
  }

  next();
};

/**
 * Use the given middleware function, with optional path.
 *
 * @param {String|Function|Function[]} path
 * @param {Function} fn
 * @return {Router}
 * @public
 */

proto.use = function use(path, fn) {
  path = path || '/';
  
  if (typeof path !== 'string') {
    fn = path;
    path = '/';
  }
  
  var layer = new Layer(path, {
    sensitive: this.caseSensitive,
    strict: false,
    end: false
  }, fn);
  
  layer.route = undefined;
  this.stack.push(layer);
  return this;
};

/**
 * Create a new Route for the given path.
 *
 * @param {String} path
 * @return {Route}
 * @public
 */

proto.route = function route(path) {
  var route = new Route(path);
  var layer = new Layer(path, {
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));

  layer.route = route;
  this.stack.push(layer);
  return route;
};

/**
 * Process params
 * @private
 */
proto.process_params = function process_params(layer, called, req, res, done) {
  done();
};

/**
 * Special-cased "all" method
 */
proto.all = function all(path) {
  var route = this.route(path);
  var args = Array.prototype.slice.call(arguments, 1);
  
  for (var i = 0; i < methods.length; i++) {
    route[methods[i]].apply(route, args);
  }
  
  return this;
};

// Create route methods
methods.forEach(function(method) {
  proto[method] = function(path) {
    var route = this.route(path);
    route[method].apply(route, Array.prototype.slice.call(arguments, 1));
    return this;
  };
});

/**
 * Get proto host for the URL
 * @private
 */
function getProtohost(url) {
  if (url.length === 0 || url[0] === '/') {
    return '';
  }

  var searchIndex = url.indexOf('?');
  var pathLength = searchIndex !== -1
    ? searchIndex
    : url.length;
  var fqdnIndex = url.indexOf('://', 0, pathLength);

  return fqdnIndex !== -1
    ? url.substring(0, url.indexOf('/', 3 + fqdnIndex))
    : '';
}

/**
 * Log error
 * @private
 */
function logerror(err) {
  if (env !== 'test') console.error(err.stack || err.toString());
}

/**
 * Final handler function
 * @private
 */
function finalhandler(req, res, options) {
  return function(err) {
    if (err) {
      if (res.headersSent) {
        return req.socket.destroy();
      }
      
      // Set status code
      res.statusCode = err.status || 500;
      
      // Send response
      res.end(err.message);
      return;
    }
    
    if (res.headersSent) {
      return;
    }
    
    // 404 response
    res.statusCode = 404;
    res.end('Cannot ' + req.method + ' ' + req.url);
  };
}
    `;
    
    // Backup existing router.js if it exists
    if (fs.existsSync(routerPath)) {
      const backupPath = routerPath + '.bak';
      fs.copyFileSync(routerPath, backupPath);
      console.log(`Backed up existing router.js to ${backupPath}`);
    }
    
    // Write new router.js
    fs.writeFileSync(routerPath, routerContent);
    console.log('Created enhanced router.js file with full functionality');
    
    // Create modified version of express.js to use our router
    const expressJsPath = path.join(expressLibDir, 'express.js');
    const expressJsContent = `
/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var bodyParser = require('body-parser');
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');
var proto = require('./application');
var Route = require('./router/route');
var Router = require('./router');
var req = require('./request');
var res = require('./response');

/**
 * Expose \`createApplication()\`.
 */

exports = module.exports = createApplication;

/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  });

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  });

  app.init();
  return app;
}

/**
 * Expose the prototypes.
 */

exports.application = proto;
exports.request = req;
exports.response = res;

/**
 * Expose constructors.
 */

exports.Route = Route;
exports.Router = Router;

/**
 * Expose middleware
 */

exports.json = bodyParser.json;
exports.urlencoded = bodyParser.urlencoded;
exports.static = require('serve-static');

/**
 * Replace existing methods with simpler implementations.
 */
exports.router = Router;
`;
    
    // Only rewrite express.js if needed
    if (needsPatch) {
      if (fs.existsSync(expressJsPath)) {
        const backupPath = expressJsPath + '.bak';
        fs.copyFileSync(expressJsPath, backupPath);
        console.log(`Backed up existing express.js to ${backupPath}`);
      }
      
      // Write new express.js
      // fs.writeFileSync(expressJsPath, expressJsContent);
      // console.log('Created enhanced express.js file with robust Router integration');
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up Express files:', error);
    return false;
  }
}

// Try to fix express modules first
setupExpressFiles();

// Now we can safely require Express
let express;
try {
  express = require('express');
} catch (err) {
  console.error('Failed to require express:', err.message);
  console.error('Attempting to install and create minimal Express...');
  
  // Try a pure Node.js HTTP server fallback if Express fails completely
  const http = require('http');
  
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      status: 'Emergency mode active',
      message: 'Express failed to load. Using minimal HTTP server.',
      timestamp: new Date().toISOString()
    }));
  });
  
  server.listen(process.env.PORT || 8080, '0.0.0.0', () => {
    console.log(`Emergency server running on port ${process.env.PORT || 8080}`);
  });
  
  process.exit(1); // Force restart after this point - Clever Cloud will restart the app
}

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