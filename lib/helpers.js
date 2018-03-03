const path = require('path');

const hasKey = (obj, key) => obj.hasOwnProperty.call(obj, key);
const firstElement = array => Array.from(array)[0];
const lastElement = array => array[array.length - 1];
const uniqArray = array => [...new Set(array)];

const randomString = (length, possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$%&/()=?+#-_.,<>{}[]|@;:^~') => Array(length).fill().map(() => possibleChars.charAt(Math.floor(Math.random() * possibleChars.length))).join('');

// https://stackoverflow.com/a/41115086
/*
 * sequentialPromises executes Promises sequentially.
 * @param {funcs} An array of funcs that return promises.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * sequentialPromises(urls.map(url => () => $.ajax(url)))
 *     .then(console.log.bind(console))
 */
const sequentialPromises = funcs => funcs.reduce((promise, func) => promise.then(result => func().then(Array.prototype.concat.bind(result))), Promise.resolve([])); // eslint-disable-line max-len

const retryPromise = (promiseFn, maxRetries, waitForNextExec) => new Promise((resolve, reject) => {
  promiseFn()
    .then(data => resolve(data))
    .catch((err) => {
      if (maxRetries > 0) {
        setTimeout(() => resolve(retryPromise(promiseFn, maxRetries - 1, waitForNextExec)), waitForNextExec); // eslint-disable-line max-len
      } else {
        reject(err);
      }
    });
});

const registerHelpers = () => {
  if (!Object.prototype.has) {
    Object.prototype.has = function (key) { return hasKey(this, key); }; // eslint-disable-line no-extend-native, func-names, max-len
  }
  if (!Promise.prototype.serial) {
    Promise.prototype.serial = sequentialPromises; // eslint-disable-line no-extend-native
  }
  if (!Array.prototype.uniq) {
    Array.prototype.uniq = uniqArray; // eslint-disable-line no-extend-native
  }
  if (!Array.prototype.first) {
    Array.prototype.first = firstElement; // eslint-disable-line no-extend-native
  }
  if (!Array.prototype.last) {
    Array.prototype.last = lastElement; // eslint-disable-line no-extend-native
  }
};

const error = (debugName) => {
  const debug = require('debug')(debugName); // eslint-disable-line global-require

  return (res, status, err) => {
    debug(err);
    res.status(status).send(err);
    return err;
  };
};

const checkNotFound = () => value => new Promise((resolve, reject) => {
  if (value) {
    resolve(value);
  } else {
    reject({ status: 404, msg: 'Not Found' }); // TODO: convert to 'new Error' and create own error type
  }
});

const checkConflict = () => value => new Promise((resolve, reject) => {
  if (value) {
    reject({ status: 409, msg: 'Conflict' }); // TODO: convert to 'new Error' and create own error type
  } else {
    resolve(value);
  }
});

const allErrors = res => (err) => {
  if (typeof err === 'string') {
    error(res, 500, err);
  } else {
    error(res, err.status, err.msg);
  }
};

module.exports = (name) => { // eslint-disable-line arrow-body-style
  return {
    error: error(name),
    path,
    hasKey,
    firstElement,
    lastElement,
    uniqArray,
    randomString,
    checkNotFound,
    checkConflict,
    allErrors,
    sequentialPromises,
    retryPromise,
    registerHelpers,
  };
};
