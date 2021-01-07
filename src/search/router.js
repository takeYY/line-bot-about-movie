const conditions = require('./conditions');
const movies = require('./movies');
const theaters = require('./theaters');

exports.condition = function (event) {
  return conditions.search(event);
};
exports.movie = function (event, obj) {
  return movies.search(event, obj);
};
exports.theater = function (event, obj) {
  return theaters.search(event, obj);
};
