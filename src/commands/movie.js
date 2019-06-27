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
  // Cannot have the same flag more than one time
  if (Object.keys(args).filter(arg => args[arg] instanceof Object).length !== 0) {
    throw new Error('Cannot specify the same flag multiple times');
  }
}

/**
 * Calls API to add a movie to super/future list
 * @param {Object} args
 * @param {Object} message
 */
function addMovie(args, message) {
  let future;
  if (args.future) {
    future = 1;
  } else {
    future = 0;
  }
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
  movieTogetherAPI.callAddMovie(body).then((movieInfo) => {
    console.log(movieInfo);
    const movieEmbed = utils.generateMovieEmbed(movieInfo);
    message.channel.send(movieEmbed);
  }).catch((error) => {
    message.channel.send(`Failed to add movie: \`${error.error.errorMessage}\``);
  });
}

/**
 * Calls API to retrieve information about a movie
 * @param {Object} args
 * @param {Object} message
 */
function getMovieInfo(args, message) {
  const body = {
    discord_id: message.author.id,
    data: {
      imdbid: args.imdbID,
      name: args.name,
      year: args.year,
    },
  };

  movieTogetherAPI.callGetMovieInfo(body).then((movieInfo) => {
    const movieEmbed = utils.generateMovieEmbed(movieInfo);
    message.channel.send(movieEmbed);
  }).catch((error) => {
    message.channel.send(`Failed to get movie: \`${error.error.errorMessage}\``);
  });
}

/**
 * Calls API to removie a movie from super/future list
 * @param {Object} args
 * @param {Object} message
 */
function removeMovie(args, message) {
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
  console.log('Entering watchedMovie function');

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
    console.log(err);
    message.channel.send(`Failed to move the movie to the super list: \`${err.error.errorMessage}\``);
  });
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

  const convertedArgs = utils.convertFlagArgumentString(args);
  console.log(convertedArgs);

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
  console.log(`executeMovieCommand: Parsed Arguments = ${JSON.stringify(parsedArgs)}`);

  // Check to see if the user-entered command is valid. If it gets past this point
  // then it is suitable for processing.
  try {
    commandsValid(parsedArgs);
  } catch (error) {
    message.channel.send(`**Invalid Command:**\n\t${error.message}\n\nFor help:\t\t\t  \`!help movie\`\nFor examples:\t\`!examples movie\``);
    return;
  }

  parsedArgs.name = parsedArgs.name.replace(new RegExp('~', 'g'), ' ');

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
