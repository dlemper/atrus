const express = require('express');
const validate = require('express-validation');

// args may be other middlewares, that should be 'used' by this route
module.exports = app => (routeOpts, ...args) => {
  const self = app || this;
  const router = express.Router();
  router.addRoute = self.addRoute;
  router.validate = validate;

  const routeName = typeof routeOpts === 'string' ? routeOpts : routeOpts.route;
  const moduleName = typeof routeOpts === 'string' ? routeOpts : routeOpts.module;

  require(moduleName).apply(router, args); // eslint-disable-line import/no-dynamic-require, global-require, max-len
  self.use(routeName, router);
};
