import React, { Component } from 'react';
import { Provider } from 'react-redux';
import CoinsApp from './CoinsApp';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <CoinsApp />
      </Provider>
    );
  }
}
