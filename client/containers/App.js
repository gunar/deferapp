import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import VisibleTweetsList from './VisibleTweetsList';
import AppBar from './AppBar';
import Reader from './Reader';
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
      <Reader/>
    </div>
  );
};

App.propTypes = {
  visitor: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  visitor: state.visitor,
});

export default connect(mapStateToProps)(App);
