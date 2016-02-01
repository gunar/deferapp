import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';

function App({ children }) {
  return (
    <div>
      <header>
        <h1><Link to="/">Coins</Link></h1>
        Links:
        {' '}
        <Link to="/group/5">Group 5</Link>
        {/* {' '} */}
        {/* <Link to="/bar">Bar</Link> */}
      </header>
      <div style={{ marginTop: '1.5em' }}>{children}</div>
    </div>
  );
}

export default App;
