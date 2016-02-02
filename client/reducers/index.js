import { combineReducers } from 'redux';
import tweets from './tweets';
import loading from './loading';
import filter from './filter';

const rootReducer = combineReducers({
  tweets,
  loading,
  filter,
});

export default rootReducer;
