const parser = require('minimist');
const movieTogetherAPI = require('../helpers/movieTogetherAPI');

const methods = {};

/**
 * Verifies that the !movie arguments are valid for processing
 * @param {Object} args
 * @returns {Boolean}
 */
function commandsValid(args) {
  // Must have one and only one of add, remove, info, or watched in command
  if (Object.keys(args).filter(arg => ['add', 'info', 'remove', 'watched'].includes(arg)).length !== 1) {
    throw new Error('Must have only one of: **[**`-a/--add` **|** `-o/--info` **|** `-r/--remove` **|** `-w/--watched`**]**');
  }
  // Future can only be used with add, not other main command flags
  if ('future' in args && Object.keys(args).filter(arg => ['info', 'remove', 'watched'].includes(arg)).length >= 1) {
    throw new Error('`-f/--future` can only be used with `-a/--add`');
  }
  // Name and Year must be together
  if ((args.name && !args.year) || (!args.name && args.year)) {
    throw new Error('`-n/--name` and `-y/--year` must be used together');
  }
}

/**
 * Main entry point for !movie command processing
 * @param {Object} message Incoming Discord message object
 * @param {Object} args
 */
methods.executeMovieCommand = (message, args) => {
  const parsedArgs = parser(args, {
    alias: {
      a: 'add',
      f: 'future',
      i: 'imdbID',
      n: 'name',
      o: 'info',
      r: 'remove',
      w: 'watched',
      y: 'year',
    },
  });

  console.log(`executeMovieCommand: Parsed Arguments = ${JSON.stringify(parsedArgs)}`);

  try {
    commandsValid(parsedArgs);
  } catch (error) {
    message.channel.send(`**Invalid Command:**\n\t${error.message}\n\nFor help:\t\t\t  \`!help movie\`\nFor examples:\t\`!examples movie\``);
    return;
  }
  message.channel.send('It was a valid command');
};

module.exports = methods;
