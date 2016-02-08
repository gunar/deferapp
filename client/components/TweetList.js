import React, { PropTypes } from 'react';
import Tweet from '../components/Tweet';


import List from 'material-ui/lib/lists/list';
import CircularProgress from 'material-ui/lib/circular-progress';
import Waypoint from 'react-waypoint';


const spinner = (<div style={{ textAlign: 'center' }}><CircularProgress/></div>);

const TweetList = ({
  tweets,
  loadMore,
  isInfiniteLoading,
}) => (
  <List className="card_list" style={{ paddingTop: 0, paddingBottom: 0 }}>
    {tweets.map(tweet => (
      <Tweet
        key={tweet.tid}
        {...tweet}
      />
    ))}
    <Waypoint onEnter={loadMore} scrollableParent={window} threshold={0.1}/>
  </List>
);

TweetList.propTypes = {
  tweets: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
  isInfiniteLoading: PropTypes.bool.isRequired,
};

export default TweetList;
