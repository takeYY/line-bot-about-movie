const configuration = require('../config/router');
const line = require('@line/bot-sdk');
const config = configuration.config;
const client = new line.Client(config);
const layout = require('../layout/template');
const request = require('sync-request');

function setPageURL(url, page) {
  return url + '&page=' + page;
};

function getMovies(url) {
  return requestURL(url).results;
};

function get3Movies(list) {
  var movies = [];
  for (let i = 0; i < 3; i++) {
    var random_content = getRandomInt(list.length);
    movies.push(list[random_content]);
  }
  return movies;
};

function requestURL(url) {
  var response = request('GET', url);
  return JSON.parse(response.getBody('utf8'));
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

exports.search = function (event, obj) {
  var url = obj.url;
  var result = requestURL(url);
  var total_pages = result.total_pages;
  var movies = [];
  var movies_list = [];
  if (4 <= total_pages) {
    for (let i = 0; i < 3; i++) {
      var random_page = getRandomInt(total_pages - 1) + 1;
      var random_url = setPageURL(url, random_page);
      movies_list = movies_list.concat(getMovies(random_url));
    }
    movies = get3Movies(movies_list);
  } else if (2 <= total_pages && total_pages < 4) {
    for (let i = 0; i < total_pages; i++){
      var movie_url = setPageURL(url, i);
      movies_list = movies_list.concat(getMovies(movie_url));
    }
    movies = get3Movies(movies_list);
  } else {
    movies_list = result.results;
    movies = get3Movies(movies_list);
  }
  if (movies === undefined || movies[0] === undefined) {
    const movie_echo = {
      type: 'text',
      text: 'お探しの映画はありません。',
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
        if (obj.overview === 'する') {
          if (!movie.overview) {
            overview_text = '概要はありません。';
          } else {
            overview_text = movie.overview;
            if (48 < overview_text.length) {
              overview_text = overview_text.slice(0, 48) + '...';
            }
          }
        } else {
          overview_text = '表示しません。';
        }
        eachMovieLayout.body.contents[2].contents[0].contents[1].text = overview_text;
        eachMovieLayout.hero.url = 'https://image.tmdb.org/t/p/w200' + movie.poster_path;
        eachMovieLayout.footer.contents[0].action.uri = `https://www.themoviedb.org/movie/${movie.id}?language=ja-JP`;
        for (let i = 0; i < 5; i++) {
          if (i+1 < movie.vote_average/2) {
            eachMovieLayout.body.contents[1].contents[i].url = 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png';
          } else {
            eachMovieLayout.body.contents[1].contents[i].url = 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png';
          }
        }
        eachMovieLayout.body.contents[1].contents[5].text = `${movie.vote_average/2}（${movie.vote_count}件）`;
        moviesLayout.push(eachMovieLayout)
      }
    });
    var carousel = {
      'type': 'carousel',
      'contents': moviesLayout,
    }
    const movie_echo = {
      'type': 'flex',
      'altText': `お探しの映画は${movies.length}件あります。`,
      'contents': carousel,
    }
    return client.replyMessage(event.replyToken, movie_echo);
  }
};
