exports.template = function (liffUrl) {
  const movieMessage = {
    type: 'template',
    altText: '映画の検索方法を指定',
    template: {
      type: 'buttons',
      title: '映画の検索設定',
      text: '以下を選んで下さい。',
      actions: [
        {
          label: '詳しく指定',
          type: 'uri',
          uri: liffUrl,
        },
        {
          label: 'おすすめを検索',
          type: 'postback',
          data: JSON.stringify(
            {
              'type': 'movie',
            }
          ),
          displayText: 'おすすめの映画を検索！',
        }
      ],
    },
  };
  return movieMessage;
};
