import { ADD_FILTER, REMOVE_FILTER } from '../constants/ActionTypes';

export default function filters(state = [], action) {
  switch (action.type) {
    case ADD_FILTER:
      return [
        ...state,
        action.tag,
      ];
    case REMOVE_FILTER:
      return state.filter(tag =>
          tag !== action.tag
          );
    default:
      return state;
  }
}
