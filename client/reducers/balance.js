import {
  RECEIVE_ENTRIES,
} from '../constants/ActionTypes';

export default function balance(state = 0, action) {
  switch (action.type) {
    case RECEIVE_ENTRIES:
      return action.json.balance;
    default:
      return state;
  }
}
