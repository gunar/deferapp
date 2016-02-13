export default function reader(state = {isOpen: false, url: '', tid: null}, action = {}) {
  switch (action.type) {
    case 'OPEN_READER':
      return { isOpen: true, url: action.url, tid: action.tid };
    case 'CLOSE_READER':
      return { isOpen: false, url: state.url, tid: null};
    default:
      return state;
  }
}
