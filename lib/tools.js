const http = require('http');
const url = require('url');
const sequelize = require('sequelize');
const later = require('later');
const moment = require('moment');
const nodemailer = require('nodemailer');
const bodyParser = require('./body-parser');

const httpRequest = opts => new Promise((resolve, reject) => {
  const options = Object.assign({}, opts);
  options.headers = options.headers || {};
  options.method = options.method || 'GET';

  if ((options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH') && options.body) {
    if (typeof options.body === 'string' || typeof options.body === 'number') {
      options.body = `${options.body}`; // convert number to string in case body is number
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'text/plain';
    } else {
      options.body = JSON.stringify(options.body);
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    }

    options.headers['Content-Length'] = options.headers['Content-Length'] || options.body.length;
  }

  const req = http.request(Object.assign(url.parse(options.url), options), (res) => {
    //let data = '';

    // console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode !== 200) {
      reject(res);
      return;
    }

    bodyParser(res)
    .then(body => resolve(body))
    .catch(err => reject(err));

    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    /*res.setEncoding('utf8');

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      bodyParser(data)
      .then(body => resolve(body))
      .catch(err => reject(err));
    });*/
  });

  req.on('error', (e) => {
    reject(e);
  });

  if (options.headers['Content-Length'] > 0) {
    req.write(options.body);
  }
  req.end();
});

httpRequest.get = (address, options) => httpRequest(Object.assign({ method: 'GET', url: address }, options));
httpRequest.post = (address, body, options) => httpRequest(Object.assign({ method: 'POST', url: address, body }, options));
httpRequest.put = (address, body, options) => httpRequest(Object.assign({ method: 'PUT', url: address, body }, options));
httpRequest.delete = (address, body, options) => httpRequest(Object.assign({ method: 'DELETE', url: address, body }, options));
httpRequest.head = (address, options) => httpRequest(Object.assign({ method: 'HEAD', url: address }, options));
httpRequest.patch = (address, body, options) => httpRequest(Object.assign({ method: 'PATCH', url: address, body }, options));
httpRequest.options = (address, options) => httpRequest(Object.assign({ method: 'OPTIONS', url: address }, options));

module.exports = {
  httpRequest,
  sql: sequelize,
  mail: nodemailer,
  later,
  moment,
};
