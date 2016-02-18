import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';

import TweetList from '../components/TweetList';
import LoadingSpinner from '../containers/LoadingSpinner';
import EmptyTweetList from '../containers/EmptyTweetList';

import { fetchTweets, toggleTweet, openReader } from '../actions';

const VisibleTweetsList = ({
  tweets,
  loadMore,
  dispatch,
}) => {
  return (
    <div style={{ marginTop: 0 }}>
      <TweetList
        tweets={
          tweets.map(t => ({
            ...t,
            toggleTweet: () => dispatch(toggleTweet(t.tid, t.tags)),
            openReader: () => dispatch(openReader(t.url[0], t.tid, t.allowScript)),
          }))
        }
      />
      <Waypoint onEnter={loadMore} scrollableParent={window} threshold={0.1}/>
      <EmptyTweetList />
      <LoadingSpinner />
    </div>
  );
};

VisibleTweetsList.propTypes = {
  tweets: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
};

const notArchived = t => t.tags.indexOf('archived') === -1;

const applyFilter = (tweets, filter) => {
  if (filter.length === 0) return tweets.filter(notArchived);
  return tweets.filter(t => t.tags.indexOf(filter[0]) > -1);
};

const mapStateToProps = (state) => ({
  tweets: applyFilter(state.tweets, state.filter),
  filter: state.filter,
  isInfiniteLoading: state.loading,
  loading: state.loading,
});

const mergeProps = (stateProps, { dispatch }, ownProps) => {
  const hasTweetsBeingDisplayed = stateProps.tweets.length > 0;
  let fromTid = 0;

  if (hasTweetsBeingDisplayed) {
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
