import React from 'react';
import { Provider } from 'react-redux';
import DevTools from './DevTools';
import App from './App';

// TODO: Update Root.prod.js
export default ({
  store,
}) => (
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>
);
