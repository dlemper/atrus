const rawBody = require('raw-body');
const contentType = require('content-type');
const parser = require('./parser');

const bodyParser = (req) => {
  if (!req.is('multipart/form-data')) {
    return rawBody(req, {
      length: req.get('content-length'),
      encoding: contentType.parse(req).parameters.charset,
    })
    .then((string) => {
      req.rawBody = string; // eslint-disable-line no-param-reassign
    })
    .then(() => {
      if (req.is('application/json')) {
        return parser.json(req.rawBody); // eslint-disable-line no-param-reassign
      } else if (req.is('application/x-www-form-urlencoded')) {
        return parser.qs(req.rawBody);
      } else if (req.is('*/xml')) {
        return parser.xml(req.rawBody);
      } else if (req.is('text')) {
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
