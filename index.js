// Root index.js - Routes requests to the backend app
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Log startup info
console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`PORT: ${process.env.PORT || 8080}`);

// Create Express router.js if it doesn't exist
// This fixes a common issue with Express on Clever Cloud
function ensureExpressRouter() {
  try {
    // First check in the backend node_modules
    let expressLibDir = path.join(__dirname, 'backend', 'node_modules', 'express', 'lib');
    if (!fs.existsSync(expressLibDir)) {
      // Then check in the root node_modules
      expressLibDir = path.join(__dirname, 'node_modules', 'express', 'lib');
      if (!fs.existsSync(expressLibDir)) {
        return false;
      }
    }

    const routerJsPath = path.join(expressLibDir, 'router.js');
    if (!fs.existsSync(routerJsPath)) {
      // Create all necessary compatibility files
      
      // 1. First create route.js
      const routeJsPath = path.join(expressLibDir, 'route.js');
      const routeJs = `
// Express route compatibility module
'use strict';

const methods = require('methods');

function Route(path) {
  this.path = path;
  this.stack = [];
  this.methods = {};
}

methods.forEach(function(method) {
  Route.prototype[method] = function() {
    return this;
  };
});

Route.prototype.dispatch = function dispatch() {
  return function(req, res, next) {
    next();
  };
};

module.exports = Route;
`;
      fs.writeFileSync(routeJsPath, routeJs);
      console.log('Created Express route.js compatibility file');
      
      // 2. Create layer.js
      const layerJsPath = path.join(expressLibDir, 'layer.js');
      const layerJs = `
// Express layer compatibility module
'use strict';

function Layer(path, options, fn) {
  this.handle = fn;
  this.path = path;
  this.regexp = pathToRegexp(path);
}

function pathToRegexp(path) {
  return new RegExp('^' + path.replace(/\//g, '\\/').replace(/:([^/]+)/g, '([^/]+)') + '$');
}

Layer.prototype.match = function match(path) {
  return this.regexp.test(path);
};

Layer.prototype.handle_request = function handle(req, res, next) {
  const fn = this.handle;
  
  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

module.exports = Layer;
`;
      fs.writeFileSync(layerJsPath, layerJs);
      console.log('Created Express layer.js compatibility file');
      
      // 3. Now create router.js with no external dependencies
      const routerJs = `
// Express router compatibility module
'use strict';

// Simple inline implementations instead of requiring external files
function Route(path) {
  this.path = path;
  this.stack = [];
  this.methods = {};
}

Route.prototype.dispatch = function dispatch() {
  return function(req, res, next) {
    next();
  };
};

function Layer(path, options, fn) {
  this.handle = fn;
  this.path = path;
}

Layer.prototype.handle_request = function handle(req, res, next) {
  const fn = this.handle;
  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

// Get HTTP methods - simplified version
const methods = ['get', 'post', 'put', 'delete', 'patch', 'options'];

function Router() {
  function router(req, res, next) {
    next();
  }
  
  Object.setPrototypeOf(router, Router.prototype);
  
  router.params = {};
  router._params = [];
  router.stack = [];
  
  return router;
}

Router.prototype.route = function route(path) {
  var route = new Route(path);
  var layer = new Layer(path, {}, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);
  return route;
};

Router.prototype.use = function use() {
  return this;
};

methods.forEach(function(method) {
  Router.prototype[method] = function(path) {
    var route = this.route(path);
    route[method] = function() { return route; };
    route[method].apply(route, Array.prototype.slice.call(arguments, 1));
    return this;
  };
});

module.exports = Router;
`;
      fs.writeFileSync(routerJsPath, routerJs);
      console.log('Created Express router.js compatibility file (self-contained)');
      
      return true;
    }
    return true;
  } catch (error) {
    console.error('Error ensuring Express router.js:', error);
    return false;
  }
}

// Make sure Express has router.js available
ensureExpressRouter();

// Load the backend app
try {
  const app = require('./backend/index.js');
  console.log('Backend loaded successfully');
  module.exports = app;
} catch (error) {
  console.error('Error loading backend:', error);
  process.exit(1);
}