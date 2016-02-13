export default function reader(state = {isOpen: false, url: ''}, action = {}) {
  switch (action.type) {
    case 'OPEN_READER':
      return { isOpen: true, url: action.url };
    case 'CLOSE_READER':
      return { isOpen: false, url: state.url };
    default:
      return state;
  }
}
