const kdf = require('../lib/kdf');

const plain = 'secretpassword';

const argon2 = kdf.hashPassword(plain, 'argon2');
const scrypt = kdf.hashPassword(plain, 'scrypt');
const bcrypt = kdf.hashPassword(plain, 'bcrypt');

argon2.then(hash => kdf.verifyPassword(plain, hash).then(b => console.log('argon2', b)));
scrypt.then(hash => kdf.verifyPassword(plain, hash).then(b => console.log('scrypt', b)));
bcrypt.then(hash => kdf.verifyPassword(plain, hash).then(b => console.log('bcrypt', b)));
