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
 * Calls the GET /user/connected endpoint
 * @param {Object} body
 * @returns {Promise}
 */
methods.callVerifyConnected = (body => callAPI('GET', '/user/connected', body));

/**
 * Calls the GET /movie endpoint
 * @param {Object} body
 * @returns {Promise}
 */
methods.callGetMovieInfo = (body => callAPI('GET', '/movie', body));

/**
 * Calls the POST /movie endpoint
 * @param {Object} body
 * @returns {Promise}
 */
methods.callAddMovie = (body => callAPI('POST', '/movie', body));

/**
 * Calls the DELETE /movie endpoint
 * @param {Object} body
 * @returns {Promise}
 */
methods.callDeleteMovie = (body => callAPI('DELETE', '/movie', body));

/**
 * Calls the PATCH /movie endpoint
 * @param {Object} body
 * @returns {Promise}
 */
methods.callUpdateMovie = (body => callAPI('PATCH', '/movie', body));


module.exports = methods;
