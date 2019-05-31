const methods = {};

/**
 * Function for connecting your MovieTogether account to Discord
 * @param {Object} message discord.js message object
 * @param {Array} args Incoming arguments, should be UserID
 */
methods.connectAccount = (message, args) => {
  // First handle improper command usage
  if (message.guild !== null && args.length === 0){
    message.channel.send('To begin connecting your account, please PM me your UserID!\n`!message {userid}`').then(returnMsg => {
      console.log('In message delete function.');
      message.delete(5000);
      returnMsg.delete(5000);
    });
    return;
  } else if (message.guild !== null){
    message.author.send('Hey! PM that code to me, keep it safe!');
    message.delete();
    return;
  } else if (args.length > 1 || !RegExp(/\d{6}/).test(args[0])) {
    message.author.send('That command doesn\'t make sense to me.');
    message.author.send('`!connect {userid}`');
    return;
  }

  // Start real functionality
  console.log(`Connect account: ${message.author.id} to MovieTogether`);

}

module.exports = methods;