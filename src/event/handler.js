const configuration = require('../config/config');
const line = require('@line/bot-sdk');
const config = configuration.conf.config;
const client = new line.Client(config);
const layout = require('../layout/template');
const searchConditions = require('../search/conditions');
const searchMovies = require('../search/movies');
const searchTheaters = require('../search/theaters');

const URI = configuration.conf.URIs;

// イベントに対する返答を記述する部分
exports.handler = function (event) {
  if (event.type === 'message') {
    switch (event.message.type) {
      case 'text':
        // ユーザーからBotにテキストが送られた場合,以下が実行される
        const Text = event.message.text;
        var response;
        if (Text === "#help" || Text === "ヘルプ") {
          response = "#movie\n上記入力で映画情報を表示します。\n\n位置情報を送ることで周辺の映画館をリスト表示します。\n\n#???\n隠しコマンドがあります。";
        } else if (Text === "#movie" || Text === "映画") {
          //ユーザがBotに映画と送った場合,以下が実行される
          const templateMovieMessage = layout.movieMessage(URI.movieLIFF);
          // 返信
          return client.replyMessage(event.replyToken, templateMovieMessage);
        } else if (Text === "#開発者") {
          const movies = ["ウォーリー", "インサイド・ヘッド", "インターステラー", "マトリックス", "鈴木先生", "クラウドアトラス"];
          var random_movie = movies[Math.floor(Math.random() * movies.length)];
          response = "開発者のおすすめの映画は\n『" + random_movie + "』\nです。";
        } else {
          searchConditions.searchConditions(event);
        }
        const text_echo = {
          type: 'text',
          text: response
        };
        return client.replyMessage(event.replyToken, text_echo);
      case 'image':
        //ユーザがBotに画像を送った場合,以下が実行される
        const image_echo = {
          type: 'text',
          text: "画像をありがとう！"
        };
        return client.replyMessage(event.replyToken, image_echo);
      case 'location':
        //ユーザがBotに位置情報を送った場合,以下が実行される
        var liffUrl = `${URI.theaterLIFF}?lat=${event.message.latitude}&lon=${event.message.longitude}`;
        const templateTheaterMessage = layout.theaterMessage(liffUrl, event.message.latitude, event.message.longitude);
        // 返信
        return client.replyMessage(event.replyToken, templateTheaterMessage);
      default:
        return Promise.resolve(null);
    }
  } else if (event.type === 'postback') {
    var latlon = JSON.parse(event.postback.data);
    if (latlon.type === "theater") {
      //周囲3kmの映画館を検索！
      var url = `${URI.yahoo}&lat=${latlon.lat}&lon=${latlon.lon}&dist=3`;
      var obj = {
        url: url,
        dist: 3
      };
      searchTheaters.searchTheaters(event, obj);
    } else if (latlon.type === "movie") {
      //おすすめの映画を検索！
      var language = "ja-JP";
      var sortBy = "vote_average.desc";
      var voteCount = "1000";

      var url = `${URI.tmdb}&language=${language}&sort_by=${sortBy}&vote_count.gte=${voteCount}`;
      var obj = {
        url: url,
        overview: "する"
      };
      searchMovies.searchMovies(event, obj);
    }
  } else {
    try {
      searchConditions.searchConditions(event);
    } catch{
      return Promise.resolve(null);
    }
  }
};
