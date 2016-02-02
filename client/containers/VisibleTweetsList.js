import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import TweetList from '../components/TweetList';

import { fetchTweets } from '../actions';
// import { getVisibleTweets } from '../actions';

const VisibleTweetsList = ({
  tweets,
  loadMore,
  isInfiniteLoading,
}) => (
  <div>
    <TweetList
      tweets={tweets}
      loadMore={loadMore}
      isInfiniteLoading={isInfiniteLoading}
    />
  </div>
);
VisibleTweetsList.propTypes = {
  tweets: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  // entries: getVisibleEntries(state.entries, state.filters),
  tweets: state.tweets,
  isInfiniteLoading: state.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({ 
  fetchTweets: (fromTid) => dispatch(fetchTweets(fromTid)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  let fromTid = 0;
  if (stateProps.tweets.length) {
    fromTid = stateProps.tweets.slice(-1)[0].tid;
  }
  return {
    ...ownProps,
    ...stateProps,
    loadMore: () => dispatchProps.fetchTweets(fromTid),
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(VisibleTweetsList);
