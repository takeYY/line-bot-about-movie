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
