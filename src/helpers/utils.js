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

/**
 * Converts movie name string from space to _ separated.
 * @param {String} commandIn
 * @returns {String}
 */
methods.convertFlagArgumentString = (commandIn) => {
  console.log(`Converting incoming command = ${commandIn}`);

  let flag = '';
  if (commandIn.includes('--name')) {
    flag = '--name';
  } else if (commandIn.includes('-n')) {
    flag = '-n';
  } else if (commandIn.includes('--name=')) {
    flag = '--name=';
  } else {
    return commandIn;
  }
  const flagIndex = commandIn.indexOf(flag);
  let nextDash = commandIn.indexOf('-', flag.length + flagIndex);
  if (nextDash === -1) {
    nextDash = commandIn.length;
  }
  console.log('flagIndex ', flagIndex, 'nextDash ', nextDash);
  const name = commandIn.substring(flag.length + flagIndex + 1, nextDash - 1);
  console.log('name ', name);
  return commandIn.replace(name, name.replace(new RegExp(' ', 'g'), '~'));
};

module.exports = methods;
