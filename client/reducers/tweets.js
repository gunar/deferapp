const tweetReducer = (tweet, action) => {
  switch (action.type) {
    case 'UNARCHIVE_TWEET':
      return {
        ...tweet,
        tags: tweet.tags.filter(tag => tag !== 'archived'),
      };
    case 'ARCHIVE_TWEET':
      return {
        ...tweet,
        tags: [
          ...tweet.tags,
          'archived',
        ],
      };
    default:
      return tweet;
  }
};
export default function tweets(state = [], action) {
  switch (action.type) {
    case 'ARCHIVE_TWEET':
    case 'UNARCHIVE_TWEET':
      return state.map(tweet => {
        if (tweet.tid === action.tid) {
          return tweetReducer(tweet, action);
        }
        return tweet;
      });
    case 'RECEIVE_TWEETS':
      return [
        ...state,
        ...action.tweets,
      ];
    default:
      return state;
  }
}
