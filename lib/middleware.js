const express = require('express');
const bodyParser = require('./body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const csurf = require('csurf'); // https://github.com/pillarjs/understanding-csrf
const favicon = require('serve-favicon');
const helmet = require('helmet');
const timeout = require('connect-timeout');
const debug = require('debug')('middleware');
const validate = require('celebrate');
const jsonwebtoken = require('jsonwebtoken');
const multer = require('multer');
const HttpProxy = require('http-proxy');

const httpProxy = options => (req, res) => {
  if ('rawBody' in req) {
    // restream body
    req.removeAllListeners('data');
    req.removeAllListeners('end');
    if (req.get('content-length') !== undefined) {
      req.headers['content-length'] = Buffer.byteLength(req.rawBody, 'utf8'); // eslint-disable-line no-param-reassign
    }
    process.nextTick(() => {
      req.emit('data', req.rawBody);
      req.emit('end');
    });
  }

  return HttpProxy.web(req, res, options);
};

module.exports = {
  timeout,
  compression,
  cookieParser,
  bodyParser: bodyParser.middleware,
  multipartParser: multer,
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
  httpProxy,
  errorHandler: () => (err, req, res, next) => { // eslint-disable-line no-unused-vars
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      err.statusCode = 401; // eslint-disable-line no-param-reassign
    }

    debug(err.stack);
    res.status(err.statusCode || 500).send({ error: err.message });
  },
};
