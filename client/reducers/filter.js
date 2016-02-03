export default function filter(state = [], action) {
  switch (action.type) {
    case 'ADD_FILTER':
      return [...state, action.filter];
    case 'REMOVE_FILTER':
      return state.filter(f => f != action.filter);
    case 'SET_FILTER':
      if (action.filter === "") return []
      return [action.filter];
    case 'TOGGLE_FILTER':
      if (state.indexOf('archived') > -1) {
        return state.filter(f => f != 'archived');
      }
      return [...state, 'archived'];
    case 'RESET_FILTER':
      return [];
    default:
      return state;
  }
}
