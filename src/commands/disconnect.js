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

  const data = {
    discord_id: null,
    discord_verified: '0',
  };

  movieTogetherAPI.callUpdateUser(message.author.id, data).then((res) => {
    console.log(res);
    if (res.success) {
      message.author.send('Successfully disconnected from MovieTogether! Come back soon! :wave:');
    } else {
      message.author.send('Error disconnecting your account. Report this to Elijah or Justen');
    }
  });
};

module.exports = methods;
