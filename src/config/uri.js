const keys = require('./key');
const key = keys.key;

exports.uri = {
  yahoo: `https://map.yahooapis.jp/search/local/V1/localSearch?appid=${key.yahooAPI}&gc=0305001&sort=dist&output=json`,
  tmdb: `https://api.themoviedb.org/3/discover/movie?api_key=${key.tmdbAPI}&include_adult=false&page=1`,
  movieLIFF: 'https://liff.line.me/1654406577-Dv0PZqRO',
  theaterLIFF: 'https://liff.line.me/1654383535-Ww5vMA9l/',
};
