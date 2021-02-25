const CONFIGURATION = require('../config/router');
const LINE = require('@line/bot-sdk');
const LINE_CONFIG = CONFIGURATION.config;
const client = new LINE.Client(LINE_CONFIG);
const layout = require('../layout/template');
const request = require('sync-request');

function getPageURL(url, page) {
  return `${url}&page=${page}`;
};

function getMovies(url) {
  return requestURL(url).results;
};

function get3Movies(list) {
  let movies = [];
  for (let i = 0; i < 3; i++) {
    let randomContent = getRandomInt(list.length);
    movies.push(list[randomContent]);
  }
  return movies;
};

function requestURL(url) {
  let response = request('GET', url);
  return JSON.parse(response.getBody('utf8'));
};

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

exports.search = function (event, searchMoviesObj) {
  const BASE_URL = searchMoviesObj.url;
  let data = requestURL(BASE_URL);
  let totalPages = data.total_pages;
  let movies = [];
  let moviesList = [];
  if (2 <= totalPages) {
    for (let i = 0; i < 3; i++) {
      let randomPage = getRandomInt(totalPages - 1) + 1;
      let randomUrl = getPageURL(BASE_URL, randomPage);
      moviesList = getMovies(randomUrl);
      movies = movies.concat(moviesList[getRandomInt(moviesList.length)]);
    }
  }
  else {
    moviesList = data.results;
    movies = get3Movies(moviesList);
  }
  if (movies === undefined || movies[0] === undefined) {
    const NO_MOVIE_ECHO = {
      type: 'text',
      text: 'お探しの映画はありません。',
    };
    return client.replyMessage(event.replyToken, NO_MOVIE_ECHO);
  }
  else {
    // メッセージを構築
    let eachMovieLayoutTemplate = layout.movieResult;
    let moviesLayout = [];
    movies.forEach(function (movie) {
      let eachMovieLayout = JSON.parse(JSON.stringify(eachMovieLayoutTemplate));
      let maxOverviewLength = 48;
      if (movie.poster_path != undefined) {
        eachMovieLayout.body.contents[0].text = movie.title;
        let overview_text = '表示しません。';
        if (searchMoviesObj.overview === 'する') {
          if (!movie.overview) {
            overview_text = '概要はありません。';
          } else {
            overview_text = movie.overview;
            if (maxOverviewLength < overview_text.length) {
              overview_text = `${overview_text.slice(0, maxOverviewLength)}...`;
            }
          }
        }
        eachMovieLayout.body.contents[3].contents[0].contents[1].text = overview_text;
        eachMovieLayout.hero.url = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        eachMovieLayout.footer.contents[0].action.uri = `https://www.themoviedb.org/movie/${movie.id}?language=ja-JP`;
        // 平均評価の星の画像追加
        const GOLD_STAR_URL = 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png';
        const GRAY_STAR_URL = 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png';
        for (let i = 0; i < 5; i++) {
          if (i+1 <= movie.vote_average/2) {
            eachMovieLayout.body.contents[2].contents[i].url = GOLD_STAR_URL;
          } else {
            eachMovieLayout.body.contents[2].contents[i].url = GRAY_STAR_URL;
          }
        }
        eachMovieLayout.body.contents[2].contents[5].text = `${movie.vote_average / 2}（${movie.vote_count}件）`;
        eachMovieLayout.body.contents[1].text = `（${movie.release_date.slice(0, 4)}年）`;
        moviesLayout.push(eachMovieLayout);
      }
    });
    let carousel = {
      type: 'carousel',
      contents: moviesLayout,
    };
    const MOVIE_ECHO = {
      type: 'flex',
      altText: `お探しの映画は${movies.length}件あります。`,
      contents: carousel,
    };
    return client.replyMessage(event.replyToken, MOVIE_ECHO);
  }
};
