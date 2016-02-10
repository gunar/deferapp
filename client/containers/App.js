import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import VisibleTweetsList from './VisibleTweetsList';
import TwitterIcon from '../components/TwitterIcon';
import AppBar from '../components/AppBar';

import MyRawTheme from '../style/theme';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

import {
  Paper,
  RaisedButton,
  Toggle,
  FontIcon,
} from 'material-ui/lib';


const barStyle = (showArchived) => ({
  boxShadow: '0 1px 5px rgba(0,0,0,0.2)',
  position: 'fixed',
  backgroundColor: '#FFF',
});

const title = showArchived => (
  <div style={{
    color: "#000",
    textAlign: "center",
    marginLeft: "-56px",
  }}>
    {showArchived ? "Archive" : "Inbox"}
  </div>
);

const toggle = (toggleFilter, showArchived) => (
  <Toggle
    style={{ paddingTop: "14px", paddingLeft: "10px" }}
    alabel={<FontIcon style={{color: "#FFF"}} className="material-icons">{showArchived ? "beenhere" : "stars"}</FontIcon>}
    labelStyle={{ color: "#FFF" }}
    labelPosition="right"
    onToggle={toggleFilter}
    toggled={showArchived}
  />
);

const loginButton = () => (
  <div style={{ textAlign: "center" }}>
    <RaisedButton
      label="Login with "
      primary
      linkButton
      href="/auth"
      icon={<TwitterIcon color="white" />}
    />
  </div>
);

class App extends Component {
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(MyRawTheme),
    };
  }
  render() {
    const { dispatch, visitor, showArchived } = this.props
    const toggleFilter = () => dispatch({ type: 'TOGGLE_FILTER' });
    return (
      <div>
        <AppBar/>
        <VisibleTweetsList />
        { visitor ? loginButton() : null }
      </div>
    )
  }
};

App.childContextTypes = {
  muiTheme: PropTypes.object,
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  visitor: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  visitor: !!state.visitor,
  showArchived: state.filter.indexOf('archived') > -1,
});

export default connect(mapStateToProps)(App);
