const CONDITIONS = require('./conditions');
const MOVIES = require('./movies');
const THEATERS = require('./theaters');

exports.condition = function (event) {
  return CONDITIONS.search(event);
};
exports.movie = function (event, searchObj) {
  return MOVIES.search(event, searchObj);
};
exports.theater = function (event, searchObj) {
  return THEATERS.search(event, searchObj);
};
