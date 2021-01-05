'use strict';
const express = require('express');
const app = express();
const line = require('@line/bot-sdk');
const layout = require('./layout/template');
// Bot用情報
const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};
const client = new line.Client(config);

const keys = {
  tmdb_api: process.env.TMDB_API,
  yahoo_api: process.env.YAHOO_API,
};

const yahooRequestURI = `https://map.yahooapis.jp/search/local/V1/localSearch?appid=${keys.yahoo_api}&gc=0305001&sort=dist&output=json`;
const tmdbRequestURI = `https://api.themoviedb.org/3/discover/movie?api_key=${keys.tmdb_api}&include_adult=false&page=1`;
const movieLiffURI = 'https://liff.line.me/1654406577-Dv0PZqRO';
const theaterLiffURI = 'https://liff.line.me/1654383535-Ww5vMA9l/';

// LINE Botからのアクセスの一次処理。
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function searchConditions(event) {
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
  var event_type = searchQuery.type;
  if (event_type === "theater") {
    // ユーザーからBotにテキスト位置情報が送られた場合のみ以下が実行される
    var lat = searchQuery.lat;
    var lon = searchQuery.lon;
    var dist = searchQuery.dist.slice(0, -2);
    var url = `${yahooRequestURI}&lat=${lat}&lon=${lon}&dist=${dist}`;
    var obj = {
      url: url,
      dist: dist
    }
    searchTheaters(event, obj);
  } else if (event_type === "movie") {
    var language = "ja-JP";
    var sort_by = "vote_average.desc";
    var vote_count = "1000";
    var release_date = searchQuery.release_date;
    if (release_date === "最近") {
      release_date = "2011"
    } else {
      release_date = searchQuery.release_date.slice(0, 4);
    }
    var date_gte = release_date + "-01-01";
    var date_gte_num = Number(release_date) + 9;
    var date_lte = date_gte_num + "-12-31";
    var overview = searchQuery.overview;

    var url = `${tmdbRequestURI}&language=${language}&sort_by=${sort_by}&vote_count.gte=${vote_count}&release_date.gte=${date_gte}&release_date.lte=${date_lte}`;
    var obj = {
      url: url,
      overview: overview,
    }
    searchMovies(event, obj);
  }
}

function setNextPageURL(url,page) {
  var new_url = url + "&page=" + page;
  return new_url;
}

function searchMovies(event, obj) {
  var url = obj.url;
  var overview = obj.overview;
  var request = require('sync-request');
  var res = request('GET', url);
  var result = JSON.parse(res.getBody('utf8'));
  var total_pages = result.total_pages;
  var movies = [];
  var movies_list = [];
  if (2 <= total_pages) {
    for (let page = 2; page < total_pages/2; page++){
      var next_url = setNextPageURL(url, page);
      var response = request('GET', next_url);
      var result_page = JSON.parse(response.getBody('utf8'));
      movies_list = movies_list.concat(result_page.results);
    }
    for (let i = 0; i < 3; i++){
      var random_content = Math.floor(Math.random() * movies_list.length);
      movies.push(movies_list[random_content]);
    }
  } else {
    movies = result.results;
  }
  if (movies === undefined || movies[0] === undefined) {
    const movie_echo = {
      type: 'text',
      text: "お探しの映画はありません。"
    }
    return client.replyMessage(event.replyToken, movie_echo);
  }
  else {
    if (4 <= movies.length) {
      movies = movies.slice(0,3);
    }
    // メッセージを構築
    var eachMovieLayoutTemplate = layout.movie_result;
    var moviesLayout = []
    movies.forEach(function (movie) {
      var eachMovieLayout = JSON.parse(JSON.stringify(eachMovieLayoutTemplate));
      if (movie.poster_path != undefined) {
        eachMovieLayout.body.contents[0].text = movie.title;
        var overview_text;
        if (overview === "する") {
          if (!movie.overview) {
            overview_text = "概要はありません。";
          } else {
            overview_text = movie.overview;
            if (48 < overview_text.length) {
              overview_text = overview_text.slice(0, 48) + "...";
            }
          }
        } else {
          overview_text = "表示しません。";
        }
        eachMovieLayout.body.contents[1].contents[0].contents[1].text = overview_text;
        eachMovieLayout.hero.url = "https://image.tmdb.org/t/p/w200" + movie.poster_path;
        moviesLayout.push(eachMovieLayout)
      }
    });
    var carousel = {
      "type": "carousel",
      "contents": moviesLayout
    }
    const movie_echo = {
      'type': 'flex',
      'altText': `お探しの映画は${movies.length}件あります。`,
      'contents': carousel
    }
    return client.replyMessage(event.replyToken, movie_echo);
  }
}

function searchTheaters(event, obj) {
  var url = obj.url;
  var distance = obj.dist;
  var request = require('sync-request');
  var res = request('GET', url);
  var result = JSON.parse(res.getBody('utf8'));
  var theaters = result.Feature;
  if (theaters === undefined) {
    const location_echo = {
      type: 'text',
      text: `周辺${distance}kmに映画館はありません。`
    }
    return client.replyMessage(event.replyToken, location_echo);
  }
  else {
    // メッセージを構築
    var eachTheaterLayoutTemplate = layout.theater_result;
    var theatersLayout = []
    theaters.forEach(function (theater) {
      var eachTheaterLayout = JSON.parse(JSON.stringify(eachTheaterLayoutTemplate));
      eachTheaterLayout.body.contents[0].text = theater.Name;
      eachTheaterLayout.body.contents[1].contents[0].contents[1].text = theater.Property.Address;
      eachTheaterLayout.footer.contents[0].action.uri = `https://www.google.com/maps?q=${theater.Geometry.Coordinates.split(',')[1]},${theater.Geometry.Coordinates.split(',')[0]}`;
      theatersLayout.push(eachTheaterLayout)
    });
    var carousel = {
      "type": "carousel",
      "contents": theatersLayout
    }
    const location_echo = {
      'type': 'flex',
      'altText': `周辺${distance}kmに映画館は${theaters.length}件あります。`,
      'contents': carousel
    }
    return client.replyMessage(event.replyToken, location_echo);
  }
}

// イベントに対する返答を記述する部分
function handleEvent(event) {
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
          const templateMovieMessage = layout.movie_message(movieLiffURI);
          // 返信
          return client.replyMessage(event.replyToken, templateMovieMessage);
        } else if (Text === "#開発者") {
          const movies = ["ウォーリー", "インサイド・ヘッド", "インターステラー", "マトリックス", "鈴木先生", "クラウドアトラス"];
          var random_movie = movies[Math.floor(Math.random() * movies.length)];
          response = "開発者のおすすめの映画は\n『" + random_movie + "』\nです。";
        } else {
          searchConditions(event);
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
        var liffUrl = `${theaterLiffURI}?lat=${event.message.latitude}&lon=${event.message.longitude}`;
        const templateTheaterMessage = layout.theater_message(liffUrl, event.message.latitude, event.message.longitude);
        // 返信
        return client.replyMessage(event.replyToken, templateTheaterMessage);
      default:
        return Promise.resolve(null);
    }
  } else if (event.type === 'postback') {
    var latlon = JSON.parse(event.postback.data);
    if (latlon.type === "theater") {
      //周囲3kmの映画館を検索！
      var url = `${yahooRequestURI}&lat=${latlon.lat}&lon=${latlon.lon}&dist=3`;
      var obj = {
        url: url,
        dist: 3
      };
      searchTheaters(event, obj);
    } else if (latlon.type === "movie") {
      //おすすめの映画を検索！
      var language = "ja-JP";
      var sort_by = "vote_average.desc";
      var vote_count = "1000";

      var url = `${tmdbRequestURI}&language=${language}&sort_by=${sort_by}&vote_count.gte=${vote_count}`;
      var obj = {
        url: url,
        overview: "する"
      };
      searchMovies(event, obj);
    }
  } else {
    try {
      searchConditions(event);
    } catch{
      return Promise.resolve(null);
    }
  }
}
// Webアプリケーションを開始
const port = process.env.PORT || 8080;
//publicフォルダを利用
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
