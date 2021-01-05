exports.movie = function(){
  var eachMovieLayoutTemplate = {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://image.tmdb.org/t/p/w200/5NyJbE7JVfDJtP7c4CQzxgCLHFY.jpg",
      "size": "full",
      "aspectRatio": "2:3",
      "aspectMode": "cover"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "title",
          "weight": "bold",
          "size": "xl"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "lg",
          "spacing": "sm",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "概要",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {
                  "type": "text",
                  "text": "概要の詳細",
                  "wrap": true,
                  "color": "#666666",
                  "size": "md",
                  "flex": 5
                }
              ]
            }
          ]
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "spacing": "sm",
      "contents": [
        {
          "type": "button",
          "style": "link",
          "height": "sm",
          "action": {
            "type": "uri",
            "label": "TMDb",
            "uri": "https://www.themoviedb.org/?language=ja"
          }
        },
        {
          "type": "spacer",
          "size": "sm"
        }
      ],
      "flex": 0
    }
  }
  return eachMovieLayoutTemplate;
};

exports.theater = function () {
  var eachTheaterLayoutTemplate = {
    "type": "bubble",
    /*
    "hero": {
      "type": "image",
      "url": "https://linecorp.com",
      "size": "full",
      "aspectRatio": "2:1",
      "aspectMode": "cover"
    },
    //  */
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [{
        "type": "text",
        "text": "Name",
        "weight": "bold",
        "size": "md"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [{
          "type": "box",
          "layout": "baseline",
          "spacing": "sm",
          "contents": [{
            "type": "text",
            "text": "住所",
            "color": "#aaaaaa",
            "size": "sm",
            "flex": 1
          },
          {
            "type": "text",
            "text": "Address",
            "wrap": true,
            "color": "#666666",
            "size": "sm",
            "flex": 3
          }
          ]
        }
        ]
      }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "spacing": "sm",
      "contents": [
        {
          "type": "button",
          "style": "link",
          "height": "sm",
          "action": {
            "type": "uri",
            "label": "経路",
            "uri": "https://linecorp.com"
          }
        },
        {
          "type": "spacer",
          "size": "sm"
        }
      ],
      "flex": 0
    }
  }
  return eachTheaterLayoutTemplate;
};

exports.theater_message = function (liffUrl, latitude, longitude) {
  const templateTheaterMessage = {
    type: 'template',
    altText: '検索方法を指定',
    template: {
      type: 'buttons',
      title: '探索範囲の設定',
      text: '以下を選んで下さい。',
      actions: [{
        label: '探索範囲を指定',
        type: 'uri',
        uri: liffUrl
      },
      {
        label: '周囲3kmの映画館を検索',
        type: 'postback',
        data: JSON.stringify({
          'type': "theater",
          'lat': latitude,
          'lon': longitude
        }),
        displayText: '周囲3kmの映画館を検索！'
      }
      ],
    },
  };
  return templateTheaterMessage;
};

exports.movie_message = function (liffUrl) {
  const templateMovieMessage = {
    type: 'template',
    altText: '映画の検索方法を指定',
    template: {
      type: 'buttons',
      title: '映画の検索設定',
      text: '以下を選んで下さい。',
      actions: [{
        label: '詳しく指定',
        type: 'uri',
        uri: liffUrl
      },
      {
        label: 'おすすめを検索',
        type: 'postback',
        data: JSON.stringify({
          'type': "movie"
        }),
        displayText: 'おすすめの映画を検索！'
      }
      ],
    },
  };
  return templateMovieMessage;
};
