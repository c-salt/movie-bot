const parser = require('minimist');
const logger = require('log4js').getLogger('bot');
const movieTogetherAPI = require('../helpers/movieTogetherAPI');
const utils = require('../helpers/utils');

/**
 * All !movie command functionality.
 *
 * This file contains all of the code needed for breaking down a
 * !movie command from Discord. It verifies the command sent is
 * valid and automatically calls the proper function based on
 * provided flags. These functions handle generateing request
 * bodies and calling the proper movieTogetherAPI.js commands.
 *
 * @author Elijah Sattler   <elijah.sattler@c-salt.info>
 * @author Justen Caldwell  <justen.caldwell@c-salt.info>
 *
 * @created   May 15, 2019
 * @modified  Jun 27, 2019
 */

const methods = {};

/**
 * Verifies that the !movie arguments are valid for processing
 * @param {Object} args
 * @returns {Boolean}
 */
function commandsValid(args) {
  logger.trace('Entering commandsValid in src/commands/movie.js');

  if (Object.keys(args).filter(arg => ['add', 'info', 'remove', 'watched'].includes(arg)).length !== 1) {
    logger.debug('Command determined invalid: Must have one and only one of add, remove, info, or watched in command');
    throw new Error('Must have only one of: **[**`-a/--add` **|** `-o/--info` **|** `-r/--remove` **|** `-w/--watched`**]**');
  }

  if ('future' in args && Object.keys(args).filter(arg => ['info', 'remove', 'watched'].includes(arg)).length >= 1) {
    logger.debug('Command determined invalid: Future can only be used with add, not other main command flags');
    throw new Error('`-f/--future` can only be used with `-a/--add`');
  }

  if ((args.name && !args.year) || (!args.name && args.year)) {
    logger.debug('Command determined invalid: Name and Year must be together');
    throw new Error('`-n/--name` and `-y/--year` must be used together');
  }

  if (Object.keys(args).filter(arg => args[arg] instanceof Object).length !== 0) {
    logger.debug('Command determined invalid: Cannot have the same flag more than one time');
    throw new Error('Cannot specify the same flag multiple times');
  }
}

/**
 * Handles adding a movie from Discord.
 * @param {Object} args
 * @param {Object} message
 */
function addMovie(args, message) {
  logger.trace('Entering addMovie in src/commands/movie.js');

  // Generating the request body
  const future = (args.future) ? 1 : 0;
  const body = {
    discord_id: message.author.id,
    data: {
      future,
      imdbid: args.imdbID,
      name: args.name,
      year: args.year,
    },
  };

  // Calling the 'POST' /movie route to create and insert movie into db, then creating a
  // Discord RichEmbed message to display obtained movie info for the user
  logger.trace('Executing movieTogetherAPI.callAddMovie function in src/commands/movie.js');
  movieTogetherAPI.callAddMovie(body).then((movieInfo) => {
    logger.info(`Retrieved movieInfo: ${JSON.stringify(movieInfo)}`);
    const movieEmbed = utils.generateMovieEmbed(movieInfo);
    message.channel.send(movieEmbed);
  }).catch((error) => {
    logger.error(`Encountered error: ${error}`);
    message.channel.send(`Failed to add movie: \`${error.error.errorMessage}\``);
  });
}

/**
 * Handles getting movie information from Discord.
 * @param {Object} args
 * @param {Object} message
 */
function getMovieInfo(args, message) {
  logger.trace('Entering getMovieInfo in src/commands/movie.js');

  // Generating the request body
  const body = {
    discord_id: message.author.id,
    data: {
      imdbid: args.imdbID,
      name: args.name,
      year: args.year,
    },
  };

  // Calling the 'GET' /movie route to obtain information about a movie from the db, then
  // creating a Discord RichEmbed message to display the obtained movie info for the user
  logger.trace(`Executing movieTogetherAPI.callGetMovieInfo function in src/commands/movie.js with body: ${body}`);
  movieTogetherAPI.callGetMovieInfo(body).then((movieInfo) => {
    logger.info(`Retrieved movieInfo: ${JSON.stringify(movieInfo)}`);
    const movieEmbed = utils.generateMovieEmbed(movieInfo);
    message.channel.send(movieEmbed);
  }).catch((error) => {
    logger.error(`Encountered error: ${error}`);
    message.channel.send(`Failed to get movie: \`${error.error.errorMessage}\``);
  });
}

/**
 * Calls API to remove a movie
 * @param {Object} args
 * @param {Object} message
 */
function removeMovie(args, message) {
  logger.trace('Entering removeMovie in src/commands/movie.js');

  const body = {
    discord_id: message.author.id,
    data: {
      imdbid: args.imdbID,
      name: args.name,
      year: args.year,
    },
  };

  movieTogetherAPI.callDeleteMovie(body).then(() => {
    message.channel.send('Removed the movie');
  }).catch((err) => {
    message.channel.send(`Failed to remove the movie: \`${err.error.errorMessage}\``);
  });
}

/**
 * Calls API to change a movie from future to super list
 * @param {Object} args
 * @param {Object} message
 */
function watchedMovie(args, message) {
  logger.trace('Entering watchedMovie in src/commands/movie.js');

  const body = {
    discord_id: message.author.id,
    data: {
      imdbid: args.imdbID,
      name: args.name,
      year: args.year,
    },
  };

  movieTogetherAPI.callUpdateMovie(body).then(() => {
    message.channel.send('Movie has been moved to the Super List\nTo rate the movie use `!rating`');
  }).catch((err) => {
    logger.error(`Error encountered in callUpdateMovie: ${err}`);
    message.channel.send(`Failed to move the movie to the super list: \`${err.error.errorMessage}\``);
  });
}

/**
 * Main entry point for !movie command processing
 * @param {Object} message Incoming Discord message object
 * @param {Object} args
 */
methods.executeMovieCommand = async (message, args) => {
  logger.trace('Entered executeMovieCommand in src/commands/movie.js');

  // Check that the user has connected their account before proceeding
  logger.trace('Calling verifyConnected function in src/helpers/utils.js');
  if (await utils.verifyConnected(message) === false) {
    logger.debug(`Discord account is not connected to a MovieTogether account: ${JSON.stringify(message)}`);
    return;
  }

  const convertedArgs = utils.convertFlagArgumentString(args);
  logger.debug(`Incoming arguments converted: ${convertedArgs}`);

  const parsedArgs = parser(convertedArgs.split(' '), {
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
  delete parsedArgs._;

  // Check to see if the user-entered command is valid. If it gets past this point
  // then it is suitable for processing.
  try {
    commandsValid(parsedArgs);
  } catch (error) {
    logger.error(`Commands determined invalid: ${error.message}`);
    message.channel.send(`**Invalid Command:**\n\t${error.message}\n\nFor help:\t\t\t  \`!help movie\`\nFor examples:\t\`!examples movie\``);
    return;
  }

  parsedArgs.name = parsedArgs.name.replace(new RegExp('~', 'g'), ' ');
  logger.debug(`Incoming arguments parsed: ${JSON.stringify(parsedArgs)}`);

  if (parsedArgs.add) {
    addMovie(parsedArgs, message);
  } else if (parsedArgs.info) {
    getMovieInfo(parsedArgs, message);
  } else if (parsedArgs.remove) {
    removeMovie(parsedArgs, message);
  } else if (parsedArgs.watched) {
    watchedMovie(parsedArgs, message);
  } else {
    logger.debug('Made it to end of command determination with no command selected');
  }
};

module.exports = methods;
