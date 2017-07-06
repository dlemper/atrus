const path = require('path');

const has = (o, n) => o.hasOwnProperty.call(o, n);

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
    reject({ status: 404, msg: 'Not Found' });
  }
});

const checkConflict = () => value => new Promise((resolve, reject) => {
  if (value) {
    reject({ status: 409, msg: 'Conflict' });
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

module.exports = (route, name) => { // eslint-disable-line arrow-body-style
  return {
    error: error(name),
    path,
    has,
    checkNotFound,
    checkConflict,
    allErrors,
  };
};
