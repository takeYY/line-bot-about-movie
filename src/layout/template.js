const movieResult = require('./movie/result');
const movieMessage = require('./movie/message');
const theaterResult = require('./theater/result');
const theaterMessage = require('./theater/message');

exports.movie_result = movieResult.template;
exports.movie_message = function (liffUrl) {
  return movieMessage.template(liffUrl);
};
exports.theater_result = theaterResult.template;
exports.theater_message = function (liffUrl, latitude, longitude) {
  return theaterMessage.template(liffUrl, latitude, longitude);
};
