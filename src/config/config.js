exports.conf = {
  // Bot用情報
  config: {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  },
  keys: {
    tmdbAPI: process.env.TMDB_API,
    yahooAPI: process.env.YAHOO_API,
  },
  URIs: {
    yahoo: `https://map.yahooapis.jp/search/local/V1/localSearch?appid=${this.keys.yahooAPI}&gc=0305001&sort=dist&output=json`,
    tmdb: `https://api.themoviedb.org/3/discover/movie?api_key=${this.keys.tmdbAPI}&include_adult=false&page=1`,
    movieLIFF: 'https://liff.line.me/1654406577-Dv0PZqRO',
    theaterLIFF: 'https://liff.line.me/1654383535-Ww5vMA9l/',
  },
};
