import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import VisibleTweetsList from './VisibleTweetsList';
import TwitterIcon from '../components/TwitterIcon';

import {
  Paper,
  AppBar,
  RaisedButton,
  Toggle,
} from 'material-ui/lib';


const barStyle = (showArchived) => ({
  boxShadow: '0 1px 10px rgba(0,0,0,0.1)',
  backgroundColor: (showArchived ? '#ccc' : 'white'),
  position: 'fixed',
});

const title = showArchived => (<div
  style={{
    color: '#000',
    textAlign: 'center',
    marginLeft: '-56px',
  }}
>
  {showArchived ? 'Archive' : 'Inbox'}
</div>);

const loginButton = () => (
  <div style={{ textAlign: 'center' }}>
    <RaisedButton
      label="Login with "
      primary
      linkButton
      href="/auth"
      icon={<TwitterIcon color="white" />}
    />
  </div>
);

const toggle = (toggleFilter, showArchived) => (
  <Toggle
    style={{ paddingTop: '14px', paddingLeft: '10px' }}
    labelPosition="right"
    onToggle={toggleFilter}
    toggled={showArchived}
  />
);

const App = ({
  visitor,
  showArchived,
  dispatch,
}) => {
  const toggleFilter = () => dispatch({ type: 'TOGGLE_FILTER' });
  return (
    <Paper zDepth={0} style={{ overflowX: 'hidden' }}>
      <AppBar
        style={barStyle(showArchived)}
        title={title(showArchived)}
        iconElementLeft={toggle(toggleFilter, showArchived)}
        iconElementRight={null}
      />
      <VisibleTweetsList />
      { visitor ? loginButton() : null }
    </Paper>
  );
};

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  visitor: PropTypes.bool,
  showArchived: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  visitor: !!state.visitor,
  showArchived: state.filter.indexOf('archived') > -1,
});

export default connect(mapStateToProps)(App);
