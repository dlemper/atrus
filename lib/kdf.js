const argon2 = require('argon2');
const scrypt = require('scrypt');
const bcrypt = require('bcryptjs');

module.exports = {
  /**
   * Hash a password using bcrypt.
   *
   * @param {string} plain The password to hash
   * @param {string} [algorithm='argon2'] The password to hash
   * @param {string} algParam First parameter of the salting function,
   *                          - argon2: length of salt (default 16)
   *                          - scrypt: length of salt (default 0.5)
   *                          - bcrypt: length of salt (default 10)
   * @return {Promise.<string, Error>} A promise that returns a hash (as string) if resolved,
   *         or an Error if rejected.
   */
  hashPassword: (plain, algorithm = 'argon2', algParam = undefined) => {
    if (algorithm === 'argon2') {
      return argon2.generateSalt(algParam || 16).then(salt => argon2.hash(plain, salt));
    } else if (algorithm === 'scrypt') {
      return scrypt.params(algParam || 0.5).then(params => scrypt.kdf(plain, params).then(hash => hash.toString('base64')));
    }

    return bcrypt.genSalt(algParam || 10).then(salt => bcrypt.hash(plain, salt));
  },

  /**
   * Verify a password against a hash using bcrypt.
   *
   * @param {string} plain The password to hash
   * @param {string} hash The hash to verify with
   * @return {Promise.<string, Error>} A promise that returns a hash (as string) if resolved,
   *         or an Error if rejected.
   */
  verifyPassword: (plain, hash) => {
    if (hash.startsWith('$argon2')) {
      return argon2.verify(hash, plain);
    } else if (hash.startsWith('c2NyeXB0')) {
      return scrypt.verifyKdf(Buffer.from(hash, 'base64'), plain);
    } else if (hash.startsWith('$2a$')) {
      return bcrypt.compare(plain, hash);
    }

    return new Promise((resolve, reject) => {
      reject(Error('Failure!'));
    });
  },
};
