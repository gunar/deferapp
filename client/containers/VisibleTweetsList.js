import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import TweetList from '../components/TweetList';

import { fetchTweets } from '../actions';
// import { getVisibleTweets } from '../actions';

// class VisibleTweetsList extends Component {
//   render() {
//     const { tweets } = this.props;
//     return (
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
// VisibleTweetsList.defaultProps = {
//   entries: {}
// };

const mapStateToProps = (state) => ({
  // entries: getVisibleEntries(state.entries, state.filters),
  tweets: state.tweets,
  isInfiniteLoading: state.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({ 
  loadMore: () => dispatch(fetchTweets(1)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VisibleTweetsList);
