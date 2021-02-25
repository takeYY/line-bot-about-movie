const CONFIGURATION = require('../config/router');
const LINE = require('@line/bot-sdk');
const LINE_CONFIG = CONFIGURATION.config;
const client = new LINE.Client(LINE_CONFIG);
const layout = require('../layout/template');

exports.search = function (event, searchTheatersObj) {
  let url = searchTheatersObj.url;
  let distance = searchTheatersObj.dist;
  let request = require('sync-request');
  let res = request('GET', url);
  let result = JSON.parse(res.getBody('utf8'));
  let theaters = result.Feature;
  if (theaters === undefined) {
    const NO_LOCATION_ECHO = {
      type: 'text',
      text: `周辺${distance}kmに映画館はありません。`,
    };
    return client.replyMessage(event.replyToken, NO_LOCATION_ECHO);
  }
  else {
    // メッセージを構築
    let eachTheaterLayoutTemplate = layout.theaterResult;
    let theatersLayout = [];
    theaters.forEach(function (theater) {
      let eachTheaterLayout = JSON.parse(JSON.stringify(eachTheaterLayoutTemplate));
      eachTheaterLayout.body.contents[0].text = theater.Name;
      eachTheaterLayout.body.contents[1].contents[0].contents[1].text = theater.Property.Address;
      eachTheaterLayout.footer.contents[0].action.uri = `https://www.google.com/maps?q=${theater.Geometry.Coordinates.split(',')[1]},${theater.Geometry.Coordinates.split(',')[0]}`;
      theatersLayout.push(eachTheaterLayout);
    });
    let carousel = {
      type: 'carousel',
      contents: theatersLayout,
    };
    const LOCATION_ECHO = {
      type: 'flex',
      altText: `周辺${distance}kmに映画館は${theaters.length}件あります。`,
      contents: carousel,
    };
    return client.replyMessage(event.replyToken, LOCATION_ECHO);
  }
};
