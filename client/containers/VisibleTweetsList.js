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
  loadMore: PropTypes.func.isRequired,
  isInfiniteLoading: PropTypes.bool.isRequired,
};

const notArchived = t => t.tags.indexOf('archived') == -1;

const applyFilter = (tweets, filter) => {
  if (filter.length == 0) return tweets.filter(notArchived);
  return tweets.filter(t => t.tags.indexOf(filter[0]) > -1);
}

const mapStateToProps = (state) => ({
  // entries: getVisibleEntries(state.entries, state.filters),
  tweets: applyFilter(state.tweets, state.filter),
  filter: state.filter,
  isInfiniteLoading: state.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchTweets: (fromTid, filter) => dispatch(fetchTweets(fromTid, filter)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  let fromTid = 0;
  if (stateProps.tweets.length) {
    fromTid = stateProps.tweets.slice(-1)[0].tid;
  }
  return {
    ...ownProps,
    ...stateProps,
    loadMore: () => dispatchProps.fetchTweets(fromTid, stateProps.filter),
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(VisibleTweetsList);
