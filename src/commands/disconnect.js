const movieTogetherAPI = require('../helpers/movieTogetherAPI');

const methods = {};

/**
 * Function for disconnecting your MovieTogether account from Discord
 * @param {Object} message discord.js message object
 * @param {Array} args Incoming arguments, should be UserID
 */
methods.disconnectAccount = (message, args) => {
  if (args.length > 0) {
    message.author.send('Hey, no need to provide arguments! Just pm me...\n`!disconnect`');
    message.delete();
    return;
  }
  console.log(`Disconnect account: ${message.author.id} from MovieTogether`);

  const body = {
    discord_id: message.author.id,
    data: {
      discord_id: '',
      discord_verified: '0',
    },
  };

  movieTogetherAPI.callUpdateUser(body).then(() => {
    message.author.send('Successfully disconnected from MovieTogether! Come back soon! :wave:');
  }).catch((error) => {
    console.log(error);
    message.author.send('Error disconnecting your account. Report this to Elijah or Justen');
  });
};

module.exports = methods;
