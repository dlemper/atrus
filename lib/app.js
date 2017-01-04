const debug = require('debug')('server');
const express = require('express');

// const unless = require('express-unless');
// const lodash = require('lodash'); // use es2015/higher features
/*
const jugglingdb = require('jugglingdb');
const moment = require('moment');
const nodemailer = require('nodemailer');
const checkTypes = require('check-types'); // not necessary anymore in case of using typescript?
const requireDir = require('require-dir'); // necessary anymore?
// later.js?
*/


const app = express();

const renderEngine = require('consolidate');
app.engine('haml', renderEngine.haml);

/*
const fs = require('fs');
const path = require('path');
const Limes = require('limes');
const limes = new Limes({
  identityProviderName: 'auth.example.com',
  privateKey: fs.readFileSync(path.join(__dirname, '../private.pem')),
  certificate: fs.readFileSync(path.join(__dirname, '../public.pem')),
});
*/

/*
const mustBe = require('mustbe');
const mustBeConfig = require('./mustbe-config');
mustBe.configure(mustBeConfig);
*/

/** middlewares **/
/*
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
  res.status(500).send('Something broke!');
});
*/
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
