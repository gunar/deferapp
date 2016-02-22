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
        text: 'Your "Likes" from Twitter will materialize here. Click on them to read. Try now! (click the Tweet below)',
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
    {
      tid: 2,
      tags: [],
      tweet: {
        favorite_count: 1,
        retweet_count: 32,
        text: 'Stop Trying to be Funny on Twitter!\n\nhttps://medium.com/i-m-h-o/150186463d91 …\n\n#funny',
        created_at: 'Sun Jan 31 19:58:04 +0000 2016',
      },
      user: {
        profile_image_url_https: 'https://pbs.twimg.com/profile_images/698589176627863553/AmR3qEnk_normal.jpg',
        screen_name: 'garyvee',
        name: 'Gary Vaynerchuk',
      },
      url: [ 'https://medium.com/i-m-h-o/stop-trying-to-be-funny-on-twitter-150186463d91#.bosdzckfn' ],
      media: [],
    },
    {
      tid: 3,
      tags: [],
      tweet: {
        favorite_count: 1,
        retweet_count: 32,
        text: 'Click "Check" at the right side to archive. Click INBOX at the top to switch to Archive. Try now!',
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
  // ];
  // const archived = [
    {
      tid: 4,
      tags: [ 'archived' ],
      tweet: {
        favorite_count: 1,
        retweet_count: 32,
        text: 'See? Told you :) Now click below to Log-in with Twitter.',
        created_at: 'Sun Jan 31 19:58:04 +0000 2016',
      },
      user: {
        profile_image_url_https: 'https://pbs.twimg.com/profile_images/658644694667235328/J8sTA5or_normal.jpg',
        screen_name: 'leokewitz',
        name: 'Leonardo Kewitz',
      },
      url: [ 'http://leokewitz.com' ],
      media: [],
    },
  ];

  // const data = (tag === 'inbox' ? inbox : archived);
  const data = inbox;

  return { data, visitor: true };
};

module.exports = visitorTweets;
