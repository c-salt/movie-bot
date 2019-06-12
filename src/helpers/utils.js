/* eslint-disable camelcase */
const movieTogetherAPI = require('../helpers/movieTogetherAPI');

const methods = {};

/**
 * Verifies that the command issuer is connected
 * @param {String} discord_id
 * @returns {Boolean}
 */
methods.verifyConnected = async (message) => {
  console.log(`Verifying that ${message.author.id} is connected to MovieTogether.`);
  const body = {
    discord_id: message.author.id,
  };
  return movieTogetherAPI.callVerifyConnected(body).catch((error) => {
    console.log(error.error);
    message.channel.send('You need to connect your account!\nPM me `!connect {userid}`');
    return false;
  });
};

module.exports = methods;
