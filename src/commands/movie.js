const parser = require('minimist');
const movieTogetherAPI = require('../helpers/movieTogetherAPI');
const utils = require('../helpers/utils');

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
 * Calls API to add a movie to super/future list
 * @param {Object} args
 * @param {Object} message
 */
function addMovie(args, message) {
  console.log('Entering addMovie function');
  const body = {
    discord_id: message.author.id,
    data: {
      future: args.future,
      imdbID: args.imdbID,
      name: args.name,
      year: args.year,
    },
  };
  movieTogetherAPI.callAddMovie(body).then((res) => {
    console.log(res);
  }).catch((error) => {
    console.log(error);
  });
}

/**
 * Calls API to retrieve information about a movie
 * @param {Object} args
 * @param {Object} message
 */
function getMovieInfo(args, message) {
  console.log('Entering getMovieInfo function');
}

/**
 * Calls API to removie a movie from super/future list
 * @param {Object} args
 * @param {Object} message
 */
function removeMovie(args, message) {
  console.log('Entering removeMovie function');
}

/**
 * Calls API to change a movie from future to super list
 * @param {Object} args
 * @param {Object} message
 */
function watchedMovie(args, message) {
  console.log('Entering watchedMovie function');
}


/**
 * Main entry point for !movie command processing
 * @param {Object} message Incoming Discord message object
 * @param {Object} args
 */
methods.executeMovieCommand = async (message, args) => {
  // Check that the user has connected their account before proceeding
  if (await utils.verifyConnected(message) === false) {
    return;
  }

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

  // Check to see if the user-entered command is valid. If it gets past this point
  // then it is suitable for processing.
  try {
    commandsValid(parsedArgs);
  } catch (error) {
    message.channel.send(`**Invalid Command:**\n\t${error.message}\n\nFor help:\t\t\t  \`!help movie\`\nFor examples:\t\`!examples movie\``);
    return;
  }

  if (parsedArgs.add) {
    addMovie(parsedArgs, message);
  } else if (parsedArgs.info) {
    getMovieInfo(parsedArgs, message);
  } else if (parsedArgs.remove) {
    removeMovie(parsedArgs, message);
  } else if (parsedArgs.watched) {
    watchedMovie(parsedArgs, message);
  } else {
    console.log('Made it to end of main command checking with no command found... uh oh.');
  }
};

module.exports = methods;
