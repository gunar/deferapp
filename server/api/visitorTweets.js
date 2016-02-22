const visitorTweets = (tag, fromTid) => {
  if (fromTid && fromTid > 0) {
    // Return empty if asks for 2nd page in visitor mode
    return { data: [], visitor: true };
  }
  const inbox = [
    {
      tid: 1,
      tags: [],
      tweet: {
        favorite_count: 1,
        retweet_count: 32,
        text: 'Hi! Tweets you Like will appear here.',
        created_at: 'Sun Jan 31 19:58:04 +0000 2016',
      },
      user: {
        profile_image_url_https: 'https://pbs.twimg.com/profile_images/658644694667235328/J8sTA5or_normal.jpg',
        screen_name: 'leokewitz',
        name: 'Leonardo Kewitz',
      },
      url: [ 'http://www.leokewitz.com' ],
      media: [],
    },
    {
      tid: 2,
      tags: [],
      tweet: {
        favorite_count: 1,
        retweet_count: 32,
        text: 'The button "Inbox" up there takes you to your archived tweets.',
        created_at: 'Sun Jan 31 19:58:04 +0000 2016',
      },
      user: {
        profile_image_url_https: 'https://pbs.twimg.com/profile_images/652617748976148480/mFA1kzAm_normal.jpg',
        screen_name: 'gunar',
        name: 'Gunar C. Gessner',
      },
      url: [ 'http://gunargessner.com' ],
      media: [],
    },
  ];
  const archived = [
    {
      tid: 3,
      tags: [ 'archived' ],
      tweet: {
        favorite_count: 1,
        retweet_count: 32,
        text: 'Told ya ;)',
        created_at: 'Sun Jan 31 19:58:04 +0000 2016',
      },
      user: {
        profile_image_url_https: 'https://pbs.twimg.com/profile_images/652617748976148480/mFA1kzAm_normal.jpg',
        screen_name: 'gunar',
        name: 'Gunar C. Gessner',
      },
      url: [ 'http://gunargessner.com' ],
      media: [],
    },
  ];

  const data = (tag === 'inbox' ? inbox : archived);

  return { data, visitor: true };
};

module.exports = visitorTweets;
