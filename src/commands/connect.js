const movieTogetherAPI = require('../helpers/movieTogetherAPI');

const methods = {};

/**
 * Function for connecting your MovieTogether account to Discord
 * @param {Object} message discord.js message object
 * @param {Array} args Incoming arguments, should be UserID
 */
methods.connectAccount = (message, args) => {
  // First handle improper command usage
  if (message.guild !== null && args.length === 0) {
    message.author.send('To begin connecting your account, please pm me your UserID!\n`!message {userid}`');
    message.delete();
    return;
  } if (message.guild !== null) {
    message.author.send('Hey, pm that code to me! Keep it safe!');
    message.delete();
    return;
  } if (args.length > 1 || !RegExp(/\d{6}/).test(args[0])) {
    message.author.send('That command doesn\'t make sense to me.');
    message.author.send('`!connect {userid}`');
    return;
  }

  // Start real functionality
  console.log(`Connect account: ${message.author.id} to MovieTogether`);
  const body = {
    userid: args[0],
    data: {
      discord_id: message.author.id,
      discord_verified: '1',
    },
  };

  movieTogetherAPI.callUpdateUser(body).then(() => {
    message.author.send('Successfully connected to MovieTogether! For commands type...\n`!commands`');
  }).catch((error) => {
    console.log(error);
    message.author.send('Error connecting your account. Report this to Elijah or Justen');
  });
};

module.exports = methods;
