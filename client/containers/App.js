import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchTweets } from '../actions';
import VisibleTweetsList from './VisibleTweetsList';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import { Paper, AppBar, Toolbar, ToolbarGroup, MenuItem, DropDownMenu } from 'material-ui/lib';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch(fetchTweets());
  }

  render() {
    return (
      <Paper zDepth={2}>
        <Toolbar>
          <ToolbarGroup firstChild={true} float="left">
            <DropDownMenu value={1}>
              <MenuItem value={1} primaryText="Unread" />
              <MenuItem value={2} primaryText="Archived" />
              <MenuItem value={3} primaryText="All Broadcasts" />
            </DropDownMenu>
          </ToolbarGroup>
        </Toolbar>
        <VisibleTweetsList />
      </Paper>
    );
  }
}
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(App);
