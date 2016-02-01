// TODO: Update configureStore.prod.js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const middleware = [thunk];

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      DevTools.instrument()
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
