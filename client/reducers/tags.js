import {
  RECEIVE_ENTRIES,
} from '../constants/ActionTypes';

export default function tags(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ENTRIES:
      return action.json.tags;
    default:
      return state;
  }
}
