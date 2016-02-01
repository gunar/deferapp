import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchTweets } from '../actions';
import VisibleTweetsList from './VisibleTweetsList';

import { Paper, AppBar } from 'material-ui/lib';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTweets());
  }

  render() {
    return (
      <Paper zDepth={1}>
      <AppBar title="FavBin"/>
        <div
          style={{ marginTop: '1.5em' }}
        >
          <VisibleTweetsList />
        </div>
      </Paper>
    );
  }
}
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(App);
