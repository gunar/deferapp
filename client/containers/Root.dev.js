import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import DevTools from './DevTools';
import App from './App';
import Home from './Home';
import Group from './Group';

import AsyncProps from 'async-props';

// TODO: Update Root.prod.js
export default ({
  store,
}) => {
  const renderLoading = () => (<div>Loading...</div>);
  const render = (props) => (
    <AsyncProps
      {...props}
      renderLoading={renderLoading}
    />
  );
  return (
    <Provider store={store}>
      <div>
        <Router
          history={browserHistory}
          render={render}
        >
          <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/group/:groupId" component={Group}/>
          </Route>
        </Router>
        <DevTools />
      </div>
    </Provider>
  );
};
