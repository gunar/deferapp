import React, { PropTypes } from 'react';
import Tweet from '../components/Tweet';

import List from 'material-ui/lib/lists/list';
import Infinite from 'react-infinite';

const TweetList = ({
  tweets,
  loadMore,
  isInfiniteLoading,
}) => (
  <List className="tweet_list">
    <Infinite
      elementHeight={72}
      useWindowAsScrollContainer
      infiniteLoadBeginEdgeOffset={100}
      onInfiniteLoad={loadMore}
      isInfiniteLoading={isInfiniteLoading}
    >
      {tweets.map(tweet => (
        <Tweet
          key={tweet.tid}
          {...tweet}
        />
      ))}
  </Infinite>
  </List>
);
TweetList.propTypes = {
  tweets: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
  isInfiniteLoading: PropTypes.bool.isRequired,
};

export default TweetList;
