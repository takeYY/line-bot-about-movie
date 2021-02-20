const CONFIGURATION = require('../config/router');
const LINE = require('@line/bot-sdk');
const LINE_CONFIG = CONFIGURATION.config;
const CLIENT = new LINE.Client(LINE_CONFIG);
const SEARCH = require('./router');

const URI = CONFIGURATION.URIs;

exports.search = function (event) {
  let receivedSearchMessage;
  try {
    receivedSearchMessage = JSON.parse(event.message.text)
  }
  // 検索を要求するメッセージでない場合
  catch (err) {
    console.log(err)
    const ERROR_ECHO = {
      type: 'text',
      text: `周辺の映画館を探すなら位置情報を送ってください。\n\n
             #help\n
             上記入力でヘルプを表示します。`,
    }
    // 返信
    return CLIENT.replyMessage(event.replyToken, ERROR_ECHO);
  }
  let eventType = receivedSearchMessage.type;
  // ユーザーからBotにテキスト位置情報が送られた場合のみ以下が実行される
  if (eventType === 'theater') {
    const DIST = receivedSearchMessage.dist.replace('km', '');
    const URL = `${URI.yahoo}&lat=${receivedSearchMessage.lat}&lon=${receivedSearchMessage.lon}&dist=${DIST}`;
    let dataDictForSearchTheaters = {
      url: URL,
      dist: DIST,
    }
    SEARCH.theater(event, dataDictForSearchTheaters);
  }
  // ユーザーからBotに映画情報が送られた場合のみ実行
  else if (eventType === 'movie') {
    let releaseDate = receivedSearchMessage.release_date;
    let genres = receivedSearchMessage.genres;
    let genreQuery = '';
    // 映画公開日の探索範囲（10年）
    let diffYear = 9
    const NOW = new Date();
    // 最近ならば直近5年以内
    if (releaseDate === '最近') {
      diffYear = 5;
      releaseDate = NOW.getFullYear() - diffYear;
    } else if (releaseDate === '指定なし') {
      releaseDate = '1900';
      diffYear = NOW.getFullYear() - Number(releaseDate);
    }
    else {
      releaseDate = receivedSearchMessage.release_date.slice(0, 4);
    }
    // ジャンルの探索
    if (genres.length) {
      genreQuery = `&with_genres=${genres.join()}`;
    }
    let query = {
      lang: '&language=ja-JP',
      sortBy: '&sort_by=vote_average.desc',
      voteCount: '&vote_count.gte=1000',
      date_gte: `&primary_release_date.gte=${releaseDate}-01-01`,
      date_lte: `&primary_release_date.lte=${(Number(releaseDate) + diffYear)}-12-31`,
    };

    const URL = `${URI.tmdb}${query.lang}${query.sortBy}${query.voteCount}${query.date_gte}${query.date_lte}${genreQuery}`;
    let dataDictForSearchMovies = {
      url: URL,
      overview: receivedSearchMessage.overview,
    }
    SEARCH.movie(event, dataDictForSearchMovies);
  }
};
