const { promisify } = require('util');
const crypto = require('crypto');

module.exports.randomString = function randomString() {
  return promisify(crypto.randomBytes)(256)
    .then(buf => {
      let str = '';
      for (let offset = 0; offset < buf.length; offset += 6) {
        str += buf.readIntLE(offset, Math.min(buf.length - offset, .6)).toString(36);
      }
      return str;
    });
};

module.exports.log = function log(message) {
  console.log(formatMessage(message));
}

module.exports.error = function error(message) {
  console.error(formatMessage(message));
}

function formatMessage(message) {
  return `[${(new Date()).toISOString()}] ${message}`;
}
