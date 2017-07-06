const sequelize = require('sequelize');
const later = require('later');
const request = require('request');
const moment = require('moment');
const nodemailer = require('nodemailer');

const http = options => new Promise((resolve, reject) => request(options, (err, response, body) => { // eslint-disable-line max-len
  if (err) {
    reject(err);
  } else {
    resolve(body);
  }
}));

http.get = (url, options) => http(Object.assign({ method: 'GET', url }, options));
http.post = (url, body, options) => http(Object.assign({ method: 'POST', url, body }, options));
http.put = (url, body, options) => http(Object.assign({ method: 'PUT', url, body }, options));
http.delete = (url, body, options) => http(Object.assign({ method: 'DELETE', url, body }, options));
http.head = (url, options) => http(Object.assign({ method: 'GET', url }, options));
http.patch = (url, body, options) => http(Object.assign({ method: 'PATCH', url, body }, options));
http.options = (url, options) => http(Object.assign({ method: 'GET', url }, options));

module.exports = {
  http,
  sql: sequelize,
  mail: nodemailer,
  later,
  moment,
};
