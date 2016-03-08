import { combineReducers } from 'redux';
import tweets from './tweets';
import loading from './loading';
import visitor from './visitor';
import filter from './filter';
import reader from './reader';
import user from './user';

const rootReducer = combineReducers({
  tweets,
  loading,
  visitor,
  filter,
  reader,
  user,
});

export default rootReducer;
