import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import VisibleTweetsList from './VisibleTweetsList';
import AppBar from '../components/AppBar';

const loginButton = () => (
  <div style={{ textAlign: 'center', paddingTop: 20 }}>
    <a href="/auth" className="btn sqrd">
      Login with <i className="mdi mdi-twitter"/>
    </a>
  </div>
);

const App = ({
  visitor,
}) => {
  return (
    <div>
    <AppBar/>
    <VisibleTweetsList />
    { visitor ? loginButton() : null }
    </div>
  );
};

App.propTypes = {
  visitor: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  visitor: !!state.visitor,
});

export default connect(mapStateToProps)(App);
