import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import TweetList from '../components/TweetList';

import { fetchTweets, toggleTweet } from '../actions';
import { Toolbar, ToolbarGroup, IconButton, TextField, FontIcon, Toggle } from 'material-ui/lib';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
// import { getVisibleTweets } from '../actions';

const toggle = (toggleFilter, showArchived) => (
  <Toggle
    style={{ paddingTop: "14px", paddingLeft: "10px" }}
    label="Archive"
    labelStyle={{ color: "#FFF" }}
    onToggle={toggleFilter}
    toggled={showArchived}
  />
);

const VisibleTweetsList = ({
  tweets,
  loadMore,
  isInfiniteLoading,
  dispatch,
  showingArchived,
}) => {
  const toggleFilter = () => dispatch({ type: 'TOGGLE_FILTER' });
  return (
    <div style={{ marginTop: 64 }}>
      <Toolbar style={{ backgroundColor: ColorManipulator.fade("#555273", .5) }}>
        <ToolbarGroup float="left">
          <TextField hintText={<span style={{color: "rgba(0,0,0,0.6)"}}><FontIcon className="material-icons" style={{bottom: "-6px"}} color="rgba(0,0,0,0.6)">search</FontIcon> Search...</span>}/>
        </ToolbarGroup>
        <ToolbarGroup float="right">
          {toggle(toggleFilter, showingArchived)}
        </ToolbarGroup>
      </Toolbar>
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
    </div>)
};

VisibleTweetsList.propTypes = {
  tweets: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
  isInfiniteLoading: PropTypes.bool.isRequired,
};

const notArchived = t => t.tags.indexOf('archived') === -1;

const applyFilter = (tweets, filter) => {
  if (filter.length === 0) return tweets.filter(notArchived);
  return tweets.filter(t => t.tags.indexOf(filter[0]) > -1);
};

const mapStateToProps = (state) => ({
  // entries: getVisibleEntries(state.entries, state.filters),
  tweets: applyFilter(state.tweets, state.filter),
  filter: state.filter,
  isInfiniteLoading: state.loading,
  showingArchived: state.filter.indexOf('archived') > -1,
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
