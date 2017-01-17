const fs = require('fs');
const jwt = require('jsonwebtoken');
const debug = require('debug')('authentication');

/**
 * Issue a JSON Web Token using some defaults
 * - algorithm: ES256 (ECDSA with P-256 and SHA-2-256)
 * - expiration: if not set in payload, it gets set to 5 mins
 *
 * NOTICE: you _have_ to provide the private key as 'private.key' using PEM format
 * NOTICE: be sure to have a small payload if you want to save the jwt in a cookie
 *         (max length for jwt: 4093 bytes)
 *
 * @param {object} data The payload for the jwt
 * @return {string} The hash
 */
const issueToken = (data) => {
  const payload = JSON.parse(JSON.stringify(data)); // deep copy to prevent changes
  const cert = fs.readFileSync('private.key');  // get private key
  payload.exp = payload.exp || Math.floor(Date.now() / 1000) + (5 * 60); // expire after 5 mins
  return jwt.sign(payload, cert, {
    algorithm: 'ES256',
  });
};

/**
 * Issue a JSON Web Token using some defaults
 * - algorithms: ES{256, 384, 512} (ECDSA with P-{256, 384, 521} and SHA-2-{256, 384, 512})
 * - expiration: will be ignored
 *
 * NOTICE: you _have_ to provide the public key as 'public.pem' using PEM format
 *
 * @param {string} token The token to be verified
 * @return {object} The decoded payload on successful verification or undefined on error
 */
const verifyToken = (token) => {
  const cert = fs.readFileSync('public.pem');  // get public key

  return new Promise((resolve, reject) => {
    jwt.verify(token, cert, {
      algorithms: ['ES256', 'ES384', 'ES512'],
      ignoreExpiration: true,
    }, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

/**
 * JWT verification middleware, which adds payload to req.user.
 * @module verifyMiddleware
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @return {undefined}
 */
const verifyMiddleware = (req, res, next) => {
  verifyToken(req.headers.authorization)
  .then((payload) => {
    req.user = payload; // eslint-disable-line no-param-reassign
    next();
  })
  .catch(err => next(err));
};

module.exports = {
  issueToken,
  verifyToken,
  verifyMiddleware,
};
