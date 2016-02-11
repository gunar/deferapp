import React, { PropTypes } from 'react';
import Tweet from './Tweet';
import EmptyTweetList from '../containers/EmptyTweetList';

const TweetList = ({
  tweets,
}) => (
  <div className="card_list" style={{ paddingTop: 0, paddingBottom: 0 }}>
    {tweets.map(tweet => (
      <Tweet
        key={tweet.tid}
        {...tweet}
      />
    ))}
    <EmptyTweetList />
  </div>
);

TweetList.propTypes = {
  tweets: PropTypes.array.isRequired,
};

export default TweetList;
