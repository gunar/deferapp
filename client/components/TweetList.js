import React, { PropTypes } from 'react';
import Tweet from '../components/Tweet';


const TweetList = ({
  tweets,
}) => (
  <div>
    {tweets.map(tweet => (
      <Tweet
        key={tweet.tid}
        {...tweet}
      />
    ))}
  </div>
);
TweetList.propTypes = {
  tweets: PropTypes.array.isRequired,
};

export default TweetList;
