import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// import VisibleTweetsList from 'VisibleTweetsList';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch(fetchEntries());
  }

  render() {
    return (
      <div>
        <header>
          <h1>FavBin</h1>
        </header>
        <div
          style={{ marginTop: '1.5em' }}
        >
          {/* <VisibleTweetsList /> */}
        </div>
      </div>
    );
  }
}
App.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(App);
