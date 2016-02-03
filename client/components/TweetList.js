import React, { PropTypes } from 'react';
import Tweet from '../components/Tweet';

import List from 'material-ui/lib/lists/list';
import CircularProgress from 'material-ui/lib/circular-progress';
import Infinite from 'react-infinite';

const TweetList = ({
  tweets,
  loadMore,
  isInfiniteLoading,
}) => (
  <List className="" style={{ 'paddingTop': 0, 'paddingBottom': 0 }}>
    <Infinite
      elementHeight={88}
      useWindowAsScrollContainer
      infiniteLoadBeginEdgeOffset={100}
      onInfiniteLoad={loadMore}
      isInfiniteLoading={isInfiniteLoading}
      preloadBatchSize={Infinite.containerHeightScaleFactor(2)}
      preloadAdditionalHeight={Infinite.containerHeightScaleFactor(2)}
      loadingSpinnerDelegate={<div style={{textAlign: "center"}}><CircularProgress/></div>}
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
