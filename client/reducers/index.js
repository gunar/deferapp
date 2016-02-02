import { combineReducers } from 'redux';
import tweets from './tweets';
import loading from './loading';

const rootReducer = combineReducers({
  tweets,
  loading,
});

export default rootReducer;
