const Discord = require('discord.js');
const fs = require('fs');
const log4js = require('log4js');
const commands = require('./commands');
const discordAuth = require('../secrets/discordAuth');

// Initialize logger
log4js.configure('./config/log4js.json');
const logger = log4js.getLogger('bot');

// Create the logs directory if it doesn't already exist
try {
  fs.mkdirSync('./logs');
} catch (error) {
  if (error.code !== 'EEXIST') {
    process.exit(1);
  }
}

logger.info('Beginning execution of bot in src/bot.js');
logger.debug('Logs directory has been found/created');

// Initialize Discord Bot
logger.debug('Creating Discord bot and authenticating it');
const bot = new Discord.Client();
bot.login(discordAuth.token);

// Called upon bot launch
bot.on('ready', () => {
  logger.debug('Discord bot authenticated and running');
});

// Called whenever a message is sent in a text channel, bot acts on ! commands
bot.on('message', (message) => {
  if (message.content.substring(0, 1) === '!') {
    logger.debug(`Potential command encountered: ${message.content}`);
    let args = message.content.substring(1).split(' ');
    const cmd = args[0];
    args = args.splice(1).map(arg => arg.trim());

    switch (cmd) {
      case 'connect':
        logger.debug('Command determined to be !connect command');
        commands.connect.connectAccount(message, args);
        break;
      case 'disconnect':
        logger.debug('Command determined to be !disconnect command');
        commands.disconnect.disconnectAccount(message, args);
        break;
      case 'movie':
        logger.debug('Command determined to be !movie command');
        commands.movie.executeMovieCommand(message, args.join(' '));
        break;
      default:
        logger.debug(`Command was invalid: ${cmd}`);
        message.channel.send('oops.');
    }
  }
});
