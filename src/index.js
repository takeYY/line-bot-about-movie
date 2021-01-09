'use strict';
const express = require('express');
const app = express();
const line = require('@line/bot-sdk');
const configuration = require('./config/router');
const eventHandler = require('./event/handler');
// Bot用情報
const config = configuration.config;

app.set('view engine', 'pug');

app.get('/theaters', function (req, res) {
  res.render('theater', {})
});
app.get('/movies', function (req, res) {
  res.render('movie', {liff_id: process.env.MOVIE_LIFF})
});

// LINE Botからのアクセスの一次処理。
app.post('/callback', line.middleware(config), (req, res) => {
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
//publicフォルダを利用
//app.use(express.static('public'));
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
