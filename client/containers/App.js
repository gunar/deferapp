import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import VisibleTweetsList from './VisibleTweetsList';
import AppBar from '../components/AppBar';
import LoginButton from '../components/LoginButton';

const App = ({
  visitor,
}) => {
  return (
    <div>
      <AppBar/>
      <VisibleTweetsList />
      { visitor
        ? <LoginButton />
        : ''
      }
    </div>
  );
};

App.propTypes = {
  visitor: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loading: state.loading,
});

export default connect(mapStateToProps)(App);
