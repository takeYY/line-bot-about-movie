const CONFIGURATION = require('../config/router');
const LINE = require('@line/bot-sdk');
const LINE_CONFIG = CONFIGURATION.config;
const client = new LINE.Client(LINE_CONFIG);
const layout = require('../layout/template');
const search = require('../search/router');

const URI = CONFIGURATION.URIs;

// イベントに対する返答を記述する部分
exports.handler = function (event) {
  // 何らかのメッセージが送られた時
  if (event.type === 'message') {

    switch (event.message.type) {
      case 'text':// ユーザからテキストが送られた場合

        const MESSAGE_TEXT = event.message.text;
        let response;

        // ユーザから「help」か「ヘルプ」が含まれたメッセージを送られた場合
        if (MESSAGE_TEXT.includes('#help') || MESSAGE_TEXT.includes('ヘルプ')) {
          response = `#movie 映画\n上記入力で映画情報を表示します。\n\n位置情報を送ることで周辺の映画館をリスト表示します。\n\n#???\n隠しコマンドがあります。`;
        }
        // ユーザから「movie」か「映画」が含まれたメッセージを送られた場合
        else if (MESSAGE_TEXT.includes('#movie') || MESSAGE_TEXT.includes('映画')) {
          const TEMPLATE_MOVIE_MESSAGE = layout.movieMessage(URI.movieLIFF);
          // 返信
          return client.replyMessage(event.replyToken, TEMPLATE_MOVIE_MESSAGE);
        }
        // ユーザから「#開発者」が送られた場合
        else if (MESSAGE_TEXT === '開発者') {
          const MY_FAVORITE_MOVIES = ['ウォーリー', 'インサイド・ヘッド', 'インターステラー', 'マトリックス', '鈴木先生', 'クラウドアトラス', 'ダンサー・イン・ザ・ダーク'];
          let favoriteMovie = MY_FAVORITE_MOVIES[Math.floor(Math.random() * MY_FAVORITE_MOVIES.length)];
          response = `開発者のおすすめの映画は\n『${favoriteMovie}』\nです。`;
        }
        // 上記以外
        else {
          search.condition(event);
        }
        const TEXT_ECHO_DICT = {
          type: 'text',
          text: response,
        };
        return client.replyMessage(event.replyToken, TEXT_ECHO_DICT);

      case 'image':// ユーザから画像が送られた場合

        const IMAGE_ECHO_DICT = {
          type: 'text',
          text: '画像をありがとう！',
        };
        return client.replyMessage(event.replyToken, IMAGE_ECHO_DICT);

      case 'location':// ユーザから位置情報が送られた場合

        let liffUrl = `${URI.theaterLIFF}?lat=${event.message.latitude}&lon=${event.message.longitude}`;
        const THEATER_MESSAGE_TEMPLATE = layout.theaterMessage(liffUrl, event.message.latitude, event.message.longitude);
        // 返信
        return client.replyMessage(event.replyToken, THEATER_MESSAGE_TEMPLATE);

      default:// 上記以外
        return Promise.resolve(null);
    }
  }
  // Botからのメッセージに返答した時
  else if (event.type === 'postback') {

    let receivedMessage = JSON.parse(event.postback.data);

    // 映画館に関するメッセージが返答された場合
    if (receivedMessage.type === 'theater') {
      // デフォルトの検索範囲は3km
      const DIST = 3;
      const URL = `${URI.yahoo}&lat=${receivedMessage.lat}&lon=${receivedMessage.lon}&dist=${DIST}`;
      let searchTheatersObj = {
        url: URL,
        dist: DIST,
      };
      search.theater(event, searchTheatersObj);
    }
    // 映画に関するメッセージが返答された場合
    else if (receivedMessage.type === 'movie') {
      //映画の検索設定
      let query = {
        lang: 'ja-JP',
        sortBy: 'vote_average.desc',
        voteCountGte: '1000',
      };

      const URL = `${URI.tmdb}&language=${query.lang}&sort_by=${query.sortBy}&vote_count.gte=${query.voteCountGte}`;
      let searchMoviesObj = {
        url: URL,
        overview: 'する',
      };
      search.movie(event, searchMoviesObj);
    }
  }
  // 上記以外のイベントの場合
  else {
    try {
      search.condition(event);
    } catch{
      return Promise.resolve(null);
    }
  }
};
