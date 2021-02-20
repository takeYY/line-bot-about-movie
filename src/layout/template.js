const MOVIE_RESULT = require('./movie/result');
const MOVIE_MESSAGE = require('./movie/message');
const THEATER_RESULT = require('./theater/result');
const THEATER_MESSAGE = require('./theater/message');

exports.movieResult = MOVIE_RESULT.template;
exports.movieMessage = function (liffUrl) {
  return MOVIE_MESSAGE.template(liffUrl);
};
exports.theaterResult = THEATER_RESULT.template;
exports.theaterMessage = function (liffUrl, latitude, longitude) {
  return THEATER_MESSAGE.template(liffUrl, latitude, longitude);
};
