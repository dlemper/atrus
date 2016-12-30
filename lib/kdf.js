const argon2 = require('argon2');
const scrypt = require('scrypt');
const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword: (plain, algorithm = 'argon2') => {
    if (algorithm === 'argon2') {
      return argon2.generateSalt().then(salt => argon2.hash(plain, salt));
    } else if (algorithm === 'scrypt') {
      return scrypt.params(0.5).then(params => scrypt.kdf(plain, params).then(hash => hash.toString('base64')));
    }

    return bcrypt.genSalt(10).then(salt => bcrypt.hash(plain, salt));
  },

  verifyPassword: (plain, hash) => {
    if (hash.startsWith('$argon2')) {
      return argon2.verify(hash, plain);
    } else if (hash.startsWith('c2NyeXB0')) {
      return scrypt.verifyKdf(Buffer.from(hash, 'base64'), plain);
    } else if (hash.startsWith('$2a$')) {
      return bcrypt.compare(plain, hash);
    } else {
      return 'failed';
    }
  },
};
