import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import VisibleTweetsList from './VisibleTweetsList';
import TwitterIcon from '../components/TwitterIcon';

import MyRawTheme from '../style/theme';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

import {
  Paper,
  AppBar,
  RaisedButton,
  Toggle,
} from 'material-ui/lib';


const barStyle = (showArchived) => ({
  boxShadow: '0 1px 10px rgba(0,0,0,0.1)',
  position: 'fixed',
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
      <Paper zDepth={0} style={{ overflowX: "hidden"}}>
        <AppBar
          style={barStyle(showArchived)}
          title={<img src="/logo.svg" style={{height: "3rem", marginBottom: "-.5rem"}} />}
          titleStyle={{textAlign: "center"}}
          showMenuIconButton={false}
        />
        <VisibleTweetsList />
        { visitor ? loginButton() : null }
      </Paper>
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
});

export default connect(mapStateToProps)(App);
