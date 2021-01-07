const movieResultTemp = require('./movie/result');
const movieMessageTemp = require('./movie/message');
const theaterResultTemp = require('./theater/result');
const theaterMessageTemp = require('./theater/message');

exports.movieResult = movieResultTemp.template;
exports.movieMessage = function (liffUrl) {
  return movieMessageTemp.template(liffUrl);
};
exports.theaterResult = theaterResultTemp.template;
exports.theaterMessage = function (liffUrl, latitude, longitude) {
  return theaterMessageTemp.template(liffUrl, latitude, longitude);
};
