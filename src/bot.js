const Discord = require('discord.js');

// Local files
const discordAuth = require('../secrets/discordAuth');

// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(discordAuth.token);

// Called upon bot launch
bot.on('ready', (e) => {
  console.log('MovieTogether bot launched and ready...');
})

// Called whenever a message is sent in a text channel
bot.on('message', (message) => {
  console.log('Bot is reading a message...');

  // if ! entered before a word, begin executing a command
  if (message.content.substring(0, 1) === '!') {
    // Split the message into an array of single words, then split the command and arguments up.
    let args = message.content.substring(1).split(' ');
    const cmd = args[0];
    args = args.splice(1);
  
    switch (cmd) {
      case 'ping':
        message.channel.send('pong!');
    }
  }
})