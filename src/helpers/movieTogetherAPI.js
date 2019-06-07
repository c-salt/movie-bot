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
 * @param {String} userid
 * @param {Object} data
 * @returns {Promise}
 */
methods.callUpdateUser = (userid, data) => {
  const body = {
    userid,
    data,
  };

  return callAPI('PATCH', '/user', body);
};

module.exports = methods;
