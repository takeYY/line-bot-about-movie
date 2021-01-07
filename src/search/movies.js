const configuration = require('../config/config');
const line = require('@line/bot-sdk');
const config = configuration.conf.config;
const client = new line.Client(config);
const layout = require('../layout/template');

function setNextPageURL(url,page) {
  var new_url = url + "&page=" + page;
  return new_url;
};

exports.searchMovies = function (event, obj) {
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
    var eachMovieLayoutTemplate = layout.movieResult;
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
};
