const qs = require('qs');
const xml2js = require('xml2js');

const parseJSON = json => new Promise((resolve, reject) => {
  try {
    resolve(JSON.parse(json));
  } catch (e) {
    reject(e);
  }
});

const parseQS = str => new Promise((resolve, reject) => {
  try {
    resolve(qs.parse(str));
  } catch (e) {
    reject(e);
  }
});

const parseXML = str => new Promise((resolve, reject) => {
  xml2js.parseString(str, (err, result) => {
    if (err) {
      reject(err);
    } else {
      resolve(result);
    }
  });
});

module.exports = {
  json: parseJSON,
  qs: parseQS,
  xml: parseXML,
};
