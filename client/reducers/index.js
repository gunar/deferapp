import { combineReducers } from 'redux';
import tweets from './tweets';
import loading from './loading';
import visitor from './visitor';

const rootReducer = combineReducers({
  tweets,
  loading,
  visitor,
});

export default rootReducer;
