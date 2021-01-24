exports.template = {
  'type': 'bubble',
  'hero': {
    'type': 'image',
    'url': 'https://image.tmdb.org/t/p/w200/5NyJbE7JVfDJtP7c4CQzxgCLHFY.jpg',
    'size': 'full',
    'aspectRatio': '2:3',
    'aspectMode': 'cover',
  },
  'body': {
    'type': 'box',
    'layout': 'vertical',
    'contents': [
      {
        'type': 'text',
        'text': 'title',
        'weight': 'bold',
        'size': 'xl',
      },
      {
        'type': 'box',
        'layout': 'baseline',
        'margin': 'md',
        'contents': [
          {
            'type': 'icon',
            'url': 'star_url',
            'size': 'md'
          },
          {
            'type': 'icon',
            'url': 'star_url',
            'size': 'md'
          },
          {
            'type': 'icon',
            'url': 'star_url',
            'size': 'md'
          },
          {
            'type': 'icon',
            'url': 'star_url',
            'size': 'md'
          },
          {
            'type': 'icon',
            'url': 'star_url',
            'size': 'md'
          },
          {
            'type': 'text',
            'text': '4.36（144件）',
            'size': 'md',
            'color': '#999999',
            'margin': 'xxl',
          }
        ]
      },
      {
        'type': 'box',
        'layout': 'vertical',
        'margin': 'lg',
        'spacing': 'sm',
        'contents': [
          {
            'type': 'box',
            'layout': 'baseline',
            'spacing': 'sm',
            'contents': [
              {
                'type': 'text',
                'text': '概要',
                'color': '#aaaaaa',
                'size': 'sm',
                'flex': 1,
              },
              {
                'type': 'text',
                'text': '概要の詳細',
                'wrap': true,
                'color': '#666666',
                'size': 'md',
                'flex': 5,
              }
            ]
          }
        ]
      }
    ]
  },
  'footer': {
    'type': 'box',
    'layout': 'vertical',
    'spacing': 'sm',
    'contents': [
      {
        'type': 'button',
        'style': 'link',
        'height': 'sm',
        'action': {
          'type': 'uri',
          'label': '詳細情報',
          'uri': 'https://www.themoviedb.org/movie/',
        }
      },
      {
        'type': 'text',
        'text': 'data by TMDb',
        'size': 'xs',
        'align': 'end',
      },
      {
        'type': 'spacer',
        'size': 'sm',
      }
    ],
    'flex': 0,
  }
};
