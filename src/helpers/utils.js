/* eslint-disable camelcase */
const Discord = require('discord.js');
const logger = require('log4js').getLogger('bot');
const movieTogetherAPI = require('../helpers/movieTogetherAPI');

const methods = {};

/**
 * Verifies that the command issuer is connected
 * @param {String} discord_id
 * @returns {Boolean}
 */
methods.verifyConnected = async (message) => {
  logger.trace('Entering verifyConnected function in src/helpers/utils.js');
  logger.info(`Verifying that ${message.author.id} is connected to MovieTogether.`);
  const body = {
    discord_id: message.author.id,
  };
  return movieTogetherAPI.callVerifyConnected(body).catch((error) => {
    logger.error(`Encountered an error: ${error.error}`);
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
  logger.trace('Entering convertFlagArgumentString function in src/helpers/utils.js');
  logger.debug(`Converting incoming command = ${commandIn}`);

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
  logger.debug('flagIndex ', flagIndex, 'nextDash ', nextDash);
  const name = commandIn.substring(flag.length + flagIndex + 1, nextDash - 1);
  logger.debug('name ', name);
  return commandIn.replace(name, name.replace(new RegExp(' ', 'g'), '~'));
};

/**
 * Generates the embedded Discord message object for movie info display
 * @param {Object} movieInfo
 * @returns {Discord.RichEmbed}
 */
methods.generateMovieEmbed = (movieInfo) => {
  logger.trace('Entering generateMovieEmbed function in src/helpers/utils.js');
  const movieEmbed = new Discord.RichEmbed()
    .setColor('#ff665e')
    .setTitle(movieInfo.title)
    .setDescription(movieInfo.released)
    .setAuthor('Movie Information', 'https://avatars3.githubusercontent.com/u/50064876?s=200&v=4', 'https://github.com/c-salt/movie-bot')
    .setThumbnail(movieInfo.poster_url)
    .addField('Plot', `*${movieInfo.plot}*`)
    .addField('Status', movieInfo.future_movie ? 'Not Watched' : 'Watched')
    .addField('IMDB Rating', movieInfo.imdb_rating, true)
    .addField('Rotton Tomatoes Rating', movieInfo.rotten_tomatoes_rating, true)
    .addField('Metascore Rating', movieInfo.metascore_rating, true);
  logger.debug(`Generated embed element: ${JSON.stringify(movieEmbed)}`);
  return movieEmbed;
};

module.exports = methods;
