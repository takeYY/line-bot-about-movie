const configuration = require('../config/router');
const line = require('@line/bot-sdk');
const config = configuration.config;
const client = new line.Client(config);
const searchMovies = require('./movies');
const searchTheaters = require('./theaters');

const URI = configuration.URIs;

exports.searchConditions = function (event) {
  var searchQuery;
  try {
    searchQuery = JSON.parse(event.message.text)
  } catch (err) {
    console.log(err)
    const echo = {
      'type': 'text',
      'text': '周辺の映画館を探すなら位置情報を送ってください。\n\n#help\n上記入力でヘルプを表示します。'
    }
    // 返信
    return client.replyMessage(event.replyToken, echo);
  }
  var eventType = searchQuery.type;
  if (eventType === "theater") {
    // ユーザーからBotにテキスト位置情報が送られた場合のみ以下が実行される
    var lat = searchQuery.lat;
    var lon = searchQuery.lon;
    var dist = searchQuery.dist.slice(0, -2);
    var url = `${URI.yahoo}&lat=${lat}&lon=${lon}&dist=${dist}`;
    var obj = {
      url: url,
      dist: dist
    }
    searchTheaters.searchTheaters(event, obj);
  } else if (eventType === "movie") {
    var language = "ja-JP";
    var sortBy = "vote_average.desc";
    var voteCount = "1000";
    var releaseDate = searchQuery.release_date;
    if (releaseDate === "最近") {
      releaseDate = "2011"
    } else {
      releaseDate = searchQuery.release_date.slice(0, 4);
    }
    var date_gte = releaseDate + "-01-01";
    var date_gte_num = Number(releaseDate) + 9;
    var date_lte = date_gte_num + "-12-31";
    var overview = searchQuery.overview;

    var url = `${URI.tmdb}&language=${language}&sort_by=${sortBy}&vote_count.gte=${voteCount}&release_date.gte=${date_gte}&release_date.lte=${date_lte}`;
    var obj = {
      url: url,
      overview: overview,
    }
    searchMovies.searchMovies(event, obj);
  }
};
