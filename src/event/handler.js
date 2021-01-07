const configuration = require('../config/router');
const line = require('@line/bot-sdk');
const config = configuration.config;
const client = new line.Client(config);
const layout = require('../layout/template');
const search = require('../search/router');

const URI = configuration.URIs;

// イベントに対する返答を記述する部分
exports.handler = function (event) {
  // 何らかのメッセージが送られた時
  if (event.type === 'message') {

    switch (event.message.type) {
      case 'text':// ユーザからテキストが送られた場合

        const Text = event.message.text;
        var response;
        if (Text === '#help' || Text === 'ヘルプ') {

          // ユーザから「#help」か「ヘルプ」が送られた場合
          response = '#movie\n上記入力で映画情報を表示します。\n\n位置情報を送ることで周辺の映画館をリスト表示します。\n\n#???\n隠しコマンドがあります。';
        } else if (Text === '#movie' || Text === '映画') {

          // ユーザから「#movie」か「映画」が送られた場合
          const templateMovieMessage = layout.movieMessage(URI.movieLIFF);
          // 返信
          return client.replyMessage(event.replyToken, templateMovieMessage);
        } else if (Text === '#開発者') {

          // ユーザから「#開発者」が送られた場合
          const movies = ['ウォーリー', 'インサイド・ヘッド', 'インターステラー', 'マトリックス', '鈴木先生', 'クラウドアトラス'];
          var random_movie = movies[Math.floor(Math.random() * movies.length)];
          response = `開発者のおすすめの映画は\n『${random_movie}』\nです。`;
        } else {

          // 上記以外
          search.condition(event);
        }
        const text_echo = {
          type: 'text',
          text: response,
        };
        return client.replyMessage(event.replyToken, text_echo);

      case 'image'://ユーザから画像が送られた場合

        const image_echo = {
          type: 'text',
          text: '画像をありがとう！',
        };
        return client.replyMessage(event.replyToken, image_echo);

      case 'location'://ユーザから位置情報が送られた場合

        var liffUrl = `${URI.theaterLIFF}?lat=${event.message.latitude}&lon=${event.message.longitude}`;
        const templateTheaterMessage = layout.theaterMessage(liffUrl, event.message.latitude, event.message.longitude);
        // 返信
        return client.replyMessage(event.replyToken, templateTheaterMessage);

      default://上記以外
        return Promise.resolve(null);
    }
  } else if (event.type === 'postback') {// Botからのメッセージに返答した時

    var latlon = JSON.parse(event.postback.data);
    if (latlon.type === 'theater') {
      //周囲3kmの映画館を検索！
      var dist = 3;
      var url = `${URI.yahoo}&lat=${latlon.lat}&lon=${latlon.lon}&dist=${dist}`;
      var obj = {
        url: url,
        dist: dist,
      };
      search.theater(event, obj);
    } else if (latlon.type === 'movie') {
      //おすすめの映画を検索！
      var info = {
        lang: 'ja-JP',
        sortBy: 'vote_average.desc',
        voteCount: '1000',
      };

      var url = `${URI.tmdb}&language=${info.lang}&sort_by=${info.sortBy}&vote_count.gte=${info.voteCount}`;
      var obj = {
        url: url,
        overview: 'する',
      };
      search.movie(event, obj);
    }
  } else {
    try {
      search.condition(event);
    } catch{
      return Promise.resolve(null);
    }
  }
};
