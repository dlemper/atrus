const express = require('express');
const router = require('./router');
const kdf = require('./kdf');
const renderEngines = require('consolidate');
const middlewares = require('./middleware');
const authentication = require('./authentication');

const app = express();
app.addRoute = router(app);

// npm install cache-manager ??

/*
app.addRoute = router(app);
app.renderEngines = renderEngines;
*/

// const lodash = require('lodash'); // use es2015/higher features
/*
const jugglingdb = require('jugglingdb');
const checkTypes = require('check-types'); // not necessary anymore in case of using typescript?
const requireDir = require('require-dir'); // necessary anymore?
*/

/*
const mustBe = require('mustbe');
const mustBeConfig = require('./mustbe-config');
mustBe.configure(mustBeConfig);
*/

const newApp = { // turn into function..?
  addRoute: null,
  engine: (...args) => app.engine(...args),
  kdf,
  authentication,
  listen: (...args) => app.listen(...args),
  locals: app.locals,
  middlewares,
  renderEngines,
  settings: app.settings,
  use: (...args) => app.use(...args),
  redirect: (...args) => app.redirect(...args),
};

newApp.addRoute = router(newApp);

module.exports = newApp;
