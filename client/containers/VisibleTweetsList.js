import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import TweetList from '../components/TweetList';
// import { getVisibleTweets } from '../actions';

class VisibleTweetsList extends Component {
  render() {
    const { tweets } = this.props;
    return (
      <div>
        <TweetList
          tweets={tweets}
        />
      </div>
    );
  }
}
VisibleTweetsList.propTypes = {
  tweets: PropTypes.array.isRequired,
};
// VisibleTweetsList.defaultProps = {
//   entries: {}
// };

const select = (state) => ({
  // entries: getVisibleEntries(state.entries, state.filters),
  tweets: state.tweets,
});

export default connect(select)(VisibleTweetsList);
