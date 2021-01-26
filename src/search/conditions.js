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
    // 映画公開日の探索範囲（10年）
    const diffYear = 9
    if (releaseDate === '最近') {
      const now = new Date();
      releaseDate = now.getFullYear() - diffYear;
    } else {
      releaseDate = searchQuery.release_date.slice(0, 4);
    }
    var info = {
      lang: 'ja-JP',
      sortBy: 'vote_average.desc',
      voteCount: '1000',
      date_gte: releaseDate + '-01-01',
      date_lte: (Number(releaseDate) + diffYear) + '-12-31',
    };

    var url = `${URI.tmdb}&language=${info.lang}&sort_by=${info.sortBy}&vote_count.gte=${info.voteCount}&primary_release_date.gte=${info.date_gte}&primary_release_date.lte=${info.date_lte}`;
    var obj = {
      url: url,
      overview: searchQuery.overview,
    }
    search.movie(event, obj);
  }
};
