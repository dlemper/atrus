const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const csurf = require('csurf'); // https://github.com/pillarjs/understanding-csrf
const favicon = require('serve-favicon');
const helmet = require('helmet');
const timeout = require('connect-timeout');
const debug = require('debug')('middleware');
const validate = require('celebrate');

module.exports = {
  timeout,
  compression,
  cookieParser,
  jsonBody: bodyParser.json,
  urlencodedBody: bodyParser.urlencoded,
  staticFiles: express.static,
  security: {
    csp: helmet.contentSecurityPolicy,
    csrf: csurf,
    dnsPrefetchControl: helmet.dnsPrefetchControl,
    frameguard: helmet.frameguard,
    hidePoweredBy: helmet.hidePoweredBy,
    hpkp: helmet.hpkp,
    hsts: helmet.hsts,
    ieNoOpen: helmet.ieNoOpen,
    noCache: helmet.noCache,
    noSniff: helmet.noSniff,
    referrerPolicy: helmet.referrerPolicy,
    xssFilter: helmet.xssFilter,
    default: helmet,
  },
  validate,
  favicon,
  errorHandler: (err, req, res, next) => { // eslint-disable-line no-unused-vars
    debug(err.stack);
    res.status(err.statusCode || 500).send({ error: err });
  },
};
