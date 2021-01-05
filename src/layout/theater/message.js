exports.template = function (liffUrl, latitude, longitude) {
  const theaterMessage = {
    type: 'template',
    altText: '検索方法を指定',
    template: {
      type: 'buttons',
      title: '探索範囲の設定',
      text: '以下を選んで下さい。',
      actions: [
        {
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
  return theaterMessage;
};
