const rawBody = require('raw-body');
const contentType = require('content-type');
const typeIs = require('type-is'); // using this instead of req.is, as body-parser may also be used by httpRequest
const parser = require('./parser');

const bodyParser = (req) => {
  if (!typeIs(req, 'multipart/form-data')) {
    return rawBody(req, {
      length: req.headers['content-length'], // using this instead of req.get, as body-parser may also be used by httpRequest
      encoding: contentType.parse(req).parameters.charset || 'utf-8',
    })
    .then((string) => {
      req.rawBody = string; // eslint-disable-line no-param-reassign
    })
    .then(() => {
      if (typeIs(req, 'application/json')) {
        return parser.json(req.rawBody); // eslint-disable-line no-param-reassign
      } else if (typeIs(req, 'application/x-www-form-urlencoded')) {
        return parser.qs(req.rawBody);
      } else if (typeIs(req, '*/xml')) {
        return parser.xml(req.rawBody);
      } else if (typeIs(req, 'text')) {
        return Promise.resolve(req.rawBody);
      }

      return Promise.resolve(undefined);
    });
  }

  return Promise.resolve(undefined);
};

bodyParser.middleware = () => (req, res, next) => {
  bodyParser(req)
  .then((body) => {
    if (body) {
      req.body = body; // eslint-disable-line no-param-reassign
    }
    next();
  })
  .catch(err => next(err));
};

module.exports = bodyParser;
