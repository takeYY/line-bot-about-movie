const configuration = require('../config/router');
const line = require('@line/bot-sdk');
const config = configuration.config;
const client = new line.Client(config);
const layout = require('../layout/template');

exports.search = function (event, obj) {
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
    var eachTheaterLayoutTemplate = layout.theaterResult;
    var theatersLayout = []
    theaters.forEach(function (theater) {
      var eachTheaterLayout = JSON.parse(JSON.stringify(eachTheaterLayoutTemplate));
      eachTheaterLayout.body.contents[0].text = theater.Name;
      eachTheaterLayout.body.contents[1].contents[0].contents[1].text = theater.Property.Address;
      eachTheaterLayout.footer.contents[0].action.uri = `https://www.google.com/maps?q=${theater.Geometry.Coordinates.split(',')[1]},${theater.Geometry.Coordinates.split(',')[0]}`;
      theatersLayout.push(eachTheaterLayout)
    });
    var carousel = {
      'type': 'carousel',
      'contents': theatersLayout
    }
    const location_echo = {
      'type': 'flex',
      'altText': `周辺${distance}kmに映画館は${theaters.length}件あります。`,
      'contents': carousel
    }
    return client.replyMessage(event.replyToken, location_echo);
  }
};
