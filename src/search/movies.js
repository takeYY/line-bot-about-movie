const configuration = require('../config/router');
const line = require('@line/bot-sdk');
const config = configuration.config;
const client = new line.Client(config);
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

exports.search = function (event, dictDataForSearchMovies) {
  const BASE_URL = dictDataForSearchMovies.url;
  let data = requestURL(BASE_URL);
  let totalPages = data.total_pages;
  let movies = [];
  let moviesList = [];
  if (2 <= totalPages) {
    for (let i = 0; i < 3; i++) {
      let randomPage = getRandomInt(totalPages - 1) + 1;
      let randomUrl = getPageURL(BASE_URL, randomPage);
      moviesList = getMovies(randomUrl);
      movies = movies.concat(moviesList[getRandomInt(moviesList.length)])
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
    }
    return client.replyMessage(event.replyToken, NO_MOVIE_ECHO);
  }
  else {
    // メッセージを構築
    let eachMovieLayoutTemplate = layout.movieResult;
    let moviesLayout = []
    movies.forEach(function (movie) {
      let eachMovieLayout = JSON.parse(JSON.stringify(eachMovieLayoutTemplate));
      if (movie.poster_path != undefined) {
        eachMovieLayout.body.contents[0].text = movie.title;
        let overview_text;
        if (dictDataForSearchMovies.overview === 'する') {
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
        eachMovieLayout.body.contents[3].contents[0].contents[1].text = overview_text;
        eachMovieLayout.hero.url = 'https://image.tmdb.org/t/p/w200' + movie.poster_path;
        eachMovieLayout.footer.contents[0].action.uri = `https://www.themoviedb.org/movie/${movie.id}?language=ja-JP`;
        for (let i = 0; i < 5; i++) {
          if (i+1 <= movie.vote_average/2) {
            eachMovieLayout.body.contents[2].contents[i].url = 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png';
          } else {
            eachMovieLayout.body.contents[2].contents[i].url = 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png';
          }
        }
        eachMovieLayout.body.contents[2].contents[5].text = `${movie.vote_average / 2}（${movie.vote_count}件）`;
        eachMovieLayout.body.contents[1].text = `（${movie.release_date.slice(0, 4)}年）`;
        moviesLayout.push(eachMovieLayout)
      }
    });
    let carousel = {
      type: 'carousel',
      contents: moviesLayout,
    }
    const movie_echo = {
      type: 'flex',
      altText: `お探しの映画は${movies.length}件あります。`,
      contents: carousel,
    }
    return client.replyMessage(event.replyToken, movie_echo);
  }
};
