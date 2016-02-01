import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import DevTools from './DevTools';

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
