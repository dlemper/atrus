const getRawBody = require('raw-body');
const contentType = require('content-type');
const parser = require('./parser');

module.exports = () => (req, res, next) => {
  if (!req.is('multipart/form-data')) {
    getRawBody(req, {
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
        Promise.resolve(req.rawBody);
      }

      return Promise.resolve(undefined);
    })
    .then((body) => {
      req.body = body; // eslint-disable-line no-param-reassign
      next();
    })
    .catch(err => next(err));
  }
};
