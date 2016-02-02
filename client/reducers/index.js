import { combineReducers } from 'redux';
import tweets from './tweets';
import loading from './loading';
// import balance from './balance';
// import tags from './tags';
// import filters from './filters';

const rootReducer = combineReducers({
  tweets,
  loading,
  // balance,
  // tags,
  // filters,
});

export default rootReducer;
