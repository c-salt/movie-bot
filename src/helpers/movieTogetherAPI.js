/* eslint-disable camelcase */
const rp = require('request-promise');

const methods = {};

/**
 * Calls the MovieTogether API
 * @param {String} method
 * @param {String} endpoint
 * @param {Object} body
 * @returns {Promise}
 */
function callAPI(method, endpoint, body) {
  const options = {
    method,
    uri: `http://localhost:4000${endpoint}`,
    headers: {
      'x-access-token': process.env.discord_token,
    },
    json: true,
    body,
  };

  return rp(options);
}

/**
 * Calls the PATCH /user endpoint
 * @param {Object} body
 * @returns {Promise}
 */
methods.callUpdateUser = (body => callAPI('PATCH', '/user', body));

/**
 * Calls the POST /movie endpoint
 * @param {Object} body
 * @returns {Promise}
 */
methods.callAddMovie = (body => callAPI('POST', '/movie', body));

/**
 * Calls the GET /user/connected endpoint
 * @param {Object} body
 * @returns {Promise}
 */
methods.callVerifyConnected = (body => callAPI('GET', '/user/connected', body));

module.exports = methods;
