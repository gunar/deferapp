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

  setFilter(filter) {
    const { dispatch } = this.props;
    dispatch({type: 'SET_FILTER', filter});
  };

  render() {
    return (
      <Paper zDepth={2}>
        <Toolbar>
          <ToolbarGroup firstChild={true} float="left">
            <DropDownMenu ref="filter_dropdown" value={this.props.activeFilter}>
              <MenuItem value={""} primaryText="Unread" onClick={ () => this.setFilter("") }/>
              <MenuItem value={"archived"} primaryText="Archived" onClick={ () => this.setFilter("archived") }/>
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
  activeFilter: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  activeFilter: state.filter.indexOf('archived') > -1 ? 'archived' : '',
});

export default connect(mapStateToProps)(App);
