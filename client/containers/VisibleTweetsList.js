import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import TweetList from '../components/TweetList';

import { fetchTweets, toggleTweet } from '../actions';
// import { getVisibleTweets } from '../actions';

const VisibleTweetsList = ({
  tweets,
  loadMore,
  isInfiniteLoading,
  dispatch,
}) => (
  <div style={{marginTop: '74px'}}>
    <TweetList
      tweets={
        tweets.map(t => ({
          ...t,
          action: () => dispatch(toggleTweet(t.tid, t.tags)),
        }))
      }
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

const mergeProps = (stateProps, { dispatch }, ownProps) => {
  let fromTid = 0;
  if (stateProps.tweets.length) {
    fromTid = stateProps.tweets.slice(-1)[0].tid;
  }
  return {
    ...ownProps,
    ...stateProps,
    loadMore: () => dispatch(fetchTweets(fromTid, stateProps.filter)),
    dispatch,
  };
};

export default connect(mapStateToProps, undefined, mergeProps)(VisibleTweetsList);
