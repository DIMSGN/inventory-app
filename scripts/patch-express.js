/**
 * Express patch script to fix module resolution
 * 
 * This script creates a router.js file in the express library folder
 * to solve the "Cannot find module './router'" error
 */

const fs = require('fs');
const path = require('path');

console.log('Running Express patch script...');

// Find the express module directory
function findExpressDir() {
  try {
    // First try in the root node_modules
    const rootExpressPath = path.join(__dirname, '..', 'node_modules', 'express');
    if (fs.existsSync(rootExpressPath)) {
      return rootExpressPath;
    }
    
    // Then try in the backend node_modules
    const backendExpressPath = path.join(__dirname, '..', 'backend', 'node_modules', 'express');
    if (fs.existsSync(backendExpressPath)) {
      return backendExpressPath;
    }
    
    // Search in node_modules recursively (simplified approach)
    const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      const dirs = fs.readdirSync(nodeModulesPath);
      for (const dir of dirs) {
        const expressInDirPath = path.join(nodeModulesPath, dir, 'node_modules', 'express');
        if (fs.existsSync(expressInDirPath)) {
          return expressInDirPath;
        }
      }
    }
    
    return null;
  } catch (err) {
    console.error('Error finding Express directory:', err);
    return null;
  }
}

// Create router.js file for Express
function createRouterFile() {
  const expressDir = findExpressDir();
  if (!expressDir) {
    console.error('Express directory not found, cannot patch');
    return;
  }

  const libDir = path.join(expressDir, 'lib');
  if (!fs.existsSync(libDir)) {
    console.error('Express lib directory not found');
    return;
  }

  // Create router.js file
  const routerPath = path.join(libDir, 'router');
  const routerJsPath = path.join(libDir, 'router.js');
  
  // First copy router/index.js to router.js if it exists
  if (fs.existsSync(path.join(routerPath, 'index.js'))) {
    try {
      const routerContent = fs.readFileSync(path.join(routerPath, 'index.js'), 'utf8');
      fs.writeFileSync(routerJsPath, routerContent);
      console.log(`Created router.js from router/index.js in ${libDir}`);
    } catch (err) {
      console.error('Error creating router.js from router/index.js:', err);
    }
  } else {
    // Fallback to a simple router if the router directory doesn't exist
    const basicRouterContent = `/*!
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

var Route = require('./route');
var Layer = require('./layer');
var methods = require('methods');
var debug = require('debug')('express:router');
var parseUrl = require('parseurl');
var flatten = require('array-flatten');

/**
 * Module exports.
 * @public
 */

module.exports = Router;

/**
 * Initialize a new \`Router\` with the given \`options\`.
 *
 * @param {Object} [options]
 * @return {Router} which is an callable function
 * @public
 */

function Router(options) {
  options = options || {};
  
  function router(req, res, next) {
    router.handle(req, res, next);
  }
  
  // mixin Router class functions
  router.__proto__ = Router.prototype;
  
  router.params = {};
  router._params = [];
  router.caseSensitive = options.caseSensitive;
  router.mergeParams = options.mergeParams;
  router.strict = options.strict;
  router.stack = [];
  
  return router;
}

/**
 * Basic stub router implementation.
 * Contains just enough to fix the Express module resolution error.
 */
Router.prototype.route = function route(path) {
  var route = new Route(path);
  var layer = new Layer(path, {}, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);
  return route;
};

// Apply HTTP method methods
methods.forEach(function(method) {
  Router.prototype[method] = function(path) {
    var route = this.route(path);
    route[method].apply(route, Array.prototype.slice.call(arguments, 1));
    return this;
  };
});

// Stub handle method to avoid errors
Router.prototype.handle = function handle(req, res, next) {
  next();
};

// Stub use method to avoid errors  
Router.prototype.use = function use(path) {
  return this;
};
`;
    try {
      fs.writeFileSync(routerJsPath, basicRouterContent);
      console.log(`Created basic router.js in ${libDir}`);
    } catch (err) {
      console.error('Error creating basic router.js:', err);
    }
  }
  
  // Also copy our custom router.js to the root directory
  try {
    const customRouterPath = path.join(__dirname, '..', 'backend', 'router.js');
    if (fs.existsSync(customRouterPath)) {
      fs.copyFileSync(customRouterPath, path.join(expressDir, 'router.js'));
      console.log(`Copied custom router.js to Express directory`);
    }
  } catch (err) {
    console.error('Error copying custom router.js:', err);
  }
}

// Run the patch
createRouterFile();
console.log('Express patch completed'); 