import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import entries from './entries';
import balance from './balance';
import tags from './tags';
import filters from './filters';

const rootReducer = combineReducers({
  routing: routeReducer,
  entries,
  balance,
  tags,
  filters,
});

export default rootReducer;
