export const DATA_CHART = [
  {
    id: 1,
    targetCode: 'TC001',
    charts: {
      name1: [
        {
          site: 'google.com',
          visits: 1,
          urlItems: ['https://www.google.com/favicon.ico'],
        },
        {
          site: 'youtube.com',
          visits: 5,
          urlItems: [
            'https://www.youtube.com/watch?v=video1',
            'https://www.youtube.com/watch?v=video2',
            'https://www.youtube.com/watch?v=video3',
            'https://www.youtube.com/watch?v=video4',
            'https://www.youtube.com/watch?v=video5',
          ],
        },
        {
          site: 'facebook.com',
          visits: 1,
          urlItems: ['https://www.facebook.com/profile1'],
        },
        {
          site: 'twitter.com',
          visits: 3,
          urlItems: [
            'https://twitter.com/status1',
            'https://twitter.com/status2',
            'https://twitter.com/status3',
          ],
        },
        {
          site: 'amazon.com',
          visits: 1,
          urlItems: ['https://www.amazon.com/product1'],
        },
      ],
      name2: [
        { browser: 'Chrome', percentage: 65 },
        { browser: 'Safari', percentage: 20 },
        { browser: 'Firefox', percentage: 10 },
        { browser: 'Edge', percentage: 3 },
        { browser: 'Opera', percentage: 2 },
      ],
      name3: [
        {
          agent: 'macintosh; intel mac os x 10_15_7;mozilla/5.0',
          percentage: 50,
        },
        {
          agent: 'xll; ubuntu; linux x86_64; rv:85.0;mozilla/5.0',
          percentage: 30,
        },
      ],
      name4: [
        { source: '8.8.8.8', destination: '10.0.0.0' },
        { source: '10.0.0.8', destination: '10.0.0.0' },
        { source: '8.8.4.4', destination: '10.0.0.0' },
        { source: '8.8.4.4', destination: '10.0.0.0' },
        { source: '8.8.4.4', destination: '1.1.1.1' },
      ],
      name5: [
        { name: '_airplay_tcp_local', value: 5 },
        { name: '_sample_tcp_local', value: 5 },
        { name: '_riot_tcp_local', value: 4 },
        { name: '_kid_tcp_local', value: 2 },
        { name: '_vase_tcp_local', value: 2 },
        { name: 'mail.example.com', value: 2 },
      ],
      name6: [
        { type: 'HTTP', minutes: 320, percentage: 100 },
        { type: 'HTTPS', minutes: 135, percentage: 74 },
        { type: 'VPN', minutes: 80, percentage: 45 },
      ],
      name7: [
        { type: '443 (https)', minutes: 220, percentage: 100 },
        { type: '80 (http)', minutes: 105, percentage: 89 },
        { type: '25 (smfp)', minutes: 55, percentage: 40 },
        { type: '22 (ssh)', minutes: 40, percentage: 10 },
        { type: '68', minutes: 40, percentage: 18 },
      ],
    },
  },
];
