// TODO: Updatge configureStore.prod.js
// TODO: How can I make this so I don't have to mirror most of it in the production file?
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
// import { persistState } from 'redux-devtools';
import DevTools from '../containers/DevTools';

import { browserHistory } from 'react-router';
import { syncHistory } from 'react-router-redux';

// TODO: This could be opinated
const reduxRouter = syncHistory(browserHistory);
const middleware = [reduxRouter, thunk];


export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      DevTools.instrument()
    )
  );

  reduxRouter.listenForReplays(store);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
