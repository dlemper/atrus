const fs = require('fs');
const jwt = require('jsonwebtoken');
const debug = require('debug')('authentication');

module.exports = {
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
  issueToken: (data) => {
    const payload = JSON.parse(JSON.stringify(data)); // deep copy to prevent changes
    const cert = fs.readFileSync('private.key');  // get private key
    payload.exp = payload.exp || Math.floor(Date.now() / 1000) + (5 * 60); // expire after 5 mins
    return jwt.sign(payload, cert, {
      algorithm: 'ES256',
    });
  },

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
  verifyToken: (token) => {
    const cert = fs.readFileSync('public.pem');  // get public key
    let payload;
    try {
      payload = jwt.verify(token, cert, {
        algorithms: ['ES256', 'ES384', 'ES512'],
        ignoreExpiration: true,
      });
    } catch (e) {
      debug(e);
      payload = new Promise((resolve, reject) => {
        reject(Error({ error: e }));
      });
    }

    return payload;
  },
};