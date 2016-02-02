import React, { PropTypes } from 'react';
import Tweet from '../components/Tweet';

import List from 'material-ui/lib/lists/list';

const TweetList = ({
  tweets,
}) => (
  <List className="tweet_list">
    {tweets.map(tweet => (
      <Tweet
        key={tweet.tid}
        {...tweet}
      />
    ))}
  </List>
);
TweetList.propTypes = {
  tweets: PropTypes.array.isRequired,
};

export default TweetList;
