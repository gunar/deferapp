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
      elementHeight={88}
      useWindowAsScrollContainer
      infiniteLoadBeginEdgeOffset={100}
      onInfiniteLoad={loadMore}
      isInfiniteLoading={isInfiniteLoading}
      preloadBatchSize={Infinite.containerHeightScaleFactor(2)}
      preloadAdditionalHeight={Infinite.containerHeightScaleFactor(2)}
      loadingSpinnerDelegate={<div>Loading...</div>}
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
