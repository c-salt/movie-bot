const logger = require('log4js').getLogger('bot');
const movieTogetherAPI = require('../helpers/movieTogetherAPI');

const methods = {};

/**
 * Function for disconnecting your MovieTogether account from Discord
 * @param {Object} message discord.js message object
 * @param {Array} args Incoming arguments, should be UserID
 */
methods.disconnectAccount = (message, args) => {
  logger.trace('Entering disconnectAccount in src/commands/disconnect.js');
  if (args.length > 0) {
    logger.info(`User provided additional arguments while disconnecting: ${args}`);
    message.author.send('Hey, no need to provide arguments! Just pm me...\n`!disconnect`');
    message.delete();
    return;
  }
  logger.info(`Disconnect account: ${message.author.id} from MovieTogether`);

  const body = {
    discord_id: message.author.id,
    data: {
      discord_id: null,
      discord_verified: '0',
    },
  };

  logger.trace(`Calling callUpdateUser command in movieTogetherAPI.js with body: ${body}`);
  movieTogetherAPI.callUpdateUser(body).then(() => {
    logger.debug(`Backend server returned body: ${JSON.stringify(body)}`);
    message.author.send('Successfully disconnected from MovieTogether! Come back soon! :wave:');
  }).catch((error) => {
    logger.error(`Error encountered during call: ${error}`);
    message.author.send('Error disconnecting your account. Report this to Elijah or Justen');
  });
};

module.exports = methods;
