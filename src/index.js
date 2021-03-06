'use strict';
const express = require('express');
const app = express();
const line = require('@line/bot-sdk');
const CONFIGURATION = require('./config/router');
const eventHandler = require('./event/handler');
// Bot用情報
const LINE_CONFIG = CONFIGURATION.config;

app.set('view engine', 'pug');
app.use('/public', express.static('public'));

app.get('/theaters', function (req, res) {
  res.render('theater', {
    liff_id: process.env.THEATER_LIFF,
  });
});
app.get('/movies', function (req, res) {
  res.render('movie', {
    liff_id: process.env.MOVIE_LIFF,
    genre: CONFIGURATION.genres,
  });
});
app.get('/', function (req, res) {
  res.render('index', {
    title: '概要',
  });
});

// LINE Botからのアクセスの一次処理。
app.post('/callback', line.middleware(LINE_CONFIG), (req, res) => {
  Promise
    .all(req.body.events.map(eventHandler.handler))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// Webアプリケーションを開始
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
