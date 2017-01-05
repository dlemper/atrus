const express = require('express');
const router = require('./router');
const kdf = require('./kdf');
const renderEngines = require('consolidate');

const app = express();

// npm install cache-manager ??

/*
app.addRoute = router(app);
app.renderEngines = renderEngines;
*/

// const lodash = require('lodash'); // use es2015/higher features
/*
const jugglingdb = require('jugglingdb');
const moment = require('moment');
const nodemailer = require('nodemailer');
const checkTypes = require('check-types'); // not necessary anymore in case of using typescript?
const requireDir = require('require-dir'); // necessary anymore?
// later.js?
*/

/*
const fs = require('fs');
const path = require('path');
const Limes = require('limes');
const limes = new Limes({
  identityProviderName: 'auth.example.com',
  privateKey: fs.readFileSync(path.join(__dirname, '../private.pem')),
  certificate: fs.readFileSync(path.join(__dirname, '../public.pem')),
});
/* Issue token
var token = limes.issueTokenFor('Jane Doe', {
  foo: 'bar'
});
*/

/*
const mustBe = require('mustbe');
const mustBeConfig = require('./mustbe-config');
mustBe.configure(mustBeConfig);
*/

module.exports = {
  addRoute: router(app),
  engine: app.engine,
  listen: app.listen,
  locals: app.locals,
  renderEngines,
  settings: app.settings,
  kdf,
};
