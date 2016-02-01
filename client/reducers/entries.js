import {
  ADD_ENTRY,
  REQUEST_ENTRIES,
  RECEIVE_ENTRIES,
} from '../constants/ActionTypes';

export default function entries(state = [], action) {
  switch (action.type) {
    case ADD_ENTRY:
      return [
        ...state,
        {
          id: action.id,
          tags: action.tags,
          value: action.value,
        },
      ];
    case RECEIVE_ENTRIES:
      return action.json.entries;
    default:
      return state;
  }
}
