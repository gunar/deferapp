import { combineReducers } from 'redux';
import tweets from './tweets';
import loading from './loading';
import visitor from './visitor';
import filter from './filter';

const rootReducer = combineReducers({
  tweets,
  loading,
  visitor,
  filter,
});

export default rootReducer;
