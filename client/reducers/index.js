import { combineReducers } from 'redux';
import tweets from './entries';
// import balance from './balance';
// import tags from './tags';
// import filters from './filters';

const rootReducer = combineReducers({
  tweets,
  // balance,
  // tags,
  // filters,
});

export default rootReducer;
