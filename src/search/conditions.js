const configuration = require('../config/router');
const line = require('@line/bot-sdk');
const config = configuration.config;
const client = new line.Client(config);
const search = require('./router');

const URI = configuration.URIs;

exports.search = function (event) {
  var searchQuery;
  try {
    searchQuery = JSON.parse(event.message.text)
  } catch (err) {
    console.log(err)
    const echo = {
      'type': 'text',
      'text': '周辺の映画館を探すなら位置情報を送ってください。\n\n#help\n上記入力でヘルプを表示します。',
    }
    // 返信
    return client.replyMessage(event.replyToken, echo);
  }
  var eventType = searchQuery.type;
  if (eventType === 'theater') {
    // ユーザーからBotにテキスト位置情報が送られた場合のみ以下が実行される
    var dist = searchQuery.dist.replace('km', '');
    var url = `${URI.yahoo}&lat=${searchQuery.lat}&lon=${searchQuery.lon}&dist=${dist}`;
    var obj = {
      url: url,
      dist: dist,
    }
    search.theater(event, obj);
  } else if (eventType === 'movie') {
    // ユーザーからBotに映画情報が送られた場合のみ実行
    var releaseDate = searchQuery.release_date;
    var genres = searchQuery.genres;
    var genre_query = '';
    // 映画公開日の探索範囲（10年）
    var diffYear = 9
    if (releaseDate === '最近') {
      const now = new Date();
      diffYear = 5;
      releaseDate = now.getFullYear() - diffYear;
    } else if (releaseDate === '指定なし') {
      const now = new Date();
      releaseDate = '1900';
      diffYear = now.getFullYear() - Number(releaseDate);
    }
    else {
      releaseDate = searchQuery.release_date.slice(0, 4);
    }
    // ジャンルの探索
    if (genres.length) {
      genre_query = `&with_genres=${genres.join()}`;
    }
    var info = {
      lang: '&language=ja-JP',
      sortBy: '&sort_by=vote_average.desc',
      voteCount: '&vote_count.gte=1000',
      date_gte: `&primary_release_date.gte=${releaseDate}-01-01`,
      date_lte: `&primary_release_date.lte=${(Number(releaseDate) + diffYear)}-12-31`,
    };

    var url = `${URI.tmdb}${info.lang}${info.sortBy}${info.voteCount}${info.date_gte}${info.date_lte}${genre_query}`;
    var obj = {
      url: url,
      overview: searchQuery.overview,
    }
    search.movie(event, obj);
  }
};
