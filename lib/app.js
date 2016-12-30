const fs = require('fs');
const path = require('path');
const debug = require('debug')('server');
const express = require('express');
// const csrf = require('csurf'); // https://github.com/pillarjs/understanding-csrf
const bodyParser = require('body-parser');
const compression = require('compression');
const unless = require('express-unless');
const Limes = require('limes');
const favicon = require('serve-favicon');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const timeout = require('connect-timeout');
const validate = require('express-validation');
// const lodash = require('lodash'); // use es2015/higher features
const mustBe = require('mustbe');
const mustBeConfig = require('./mustbe-config');
/*
const jugglingdb = require('jugglingdb');
const moment = require('moment');
const nodemailer = require('nodemailer');
const scrypt = require('scrypt');
const checkTypes = require('check-types'); // not necessary anymore in case of using typescript?
const requireDir = require('require-dir'); // necessary anymore?
// later.js?
*/

const app = express();

const limes = new Limes({
  identityProviderName: 'auth.example.com',
  privateKey: fs.readFileSync(path.join(__dirname, '../private.pem')),
  certificate: fs.readFileSync(path.join(__dirname, '../public.pem')),
});

// const router = express.Router();

// args may be other middlewares, that should be 'used' by this route
app.addRoute = (routeOpts, ...args) => {
  const self = app || this;
  const router = express.Router();
  router.addRoute = self.addRoute;
  router.validate = validate;

  const routeName = typeof routeOpts === 'string' ? routeOpts : routeOpts.route;
  const moduleName = typeof routeOpts === 'string' ? routeOpts : routeOpts.module;

  require(moduleName).apply(router, args); // eslint-disable-line import/no-dynamic-require, global-require, max-len
  self.use(routeName, router);
};

/** config **/
// app.disable('x-powered-by'); // gets disabled by helmet too

mustBe.configure(mustBeConfig);
/** config **/

/** middlewares **/
timeout.unless = unless;
app.use(timeout('30s'));

helmet.unless = unless;
app.use(helmet());

compression.unless = unless;
app.use(compression());

cookieParser.unless = unless;
app.use(cookieParser());

bodyParser.urlencoded.unless = unless;
app.use(bodyParser.urlencoded({ extended: true }));

bodyParser.json.unless = unless;
app.use(bodyParser.json());

limes.verifyTokenMiddlewareExpress.unless = unless;
app.use(limes.verifyTokenMiddlewareExpress({
  payloadWhenAnonymous: {
    foo: 'bar',
  },
}));

if (fs.existsSync(`${__dirname}/public/favicon.ico`)) { // sync version not deprecated
  favicon.unless = unless;
  app.use(favicon(`${__dirname}/public/favicon.ico`));
}

express.static.unless = unless;
app.use(express.static('public'));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  debug(err.stack);
  res.status(500).send('Something broke!');
});
/** middlewares **/

/** routes **/
app.get('/', (req, res) => {
  res.send('Hello World!');
});
/** routes **/

/* Issue token
var token = limes.issueTokenFor('Jane Doe', {
  foo: 'bar'
});
*/

app.listen(3000, () => {
  debug('Example app listening on port 3000!');
});
