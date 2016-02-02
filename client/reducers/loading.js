export default function loading(state = false, action) {
  switch (action.type) {
    case 'REQUEST_TWEETS':
      return true;
    case 'RECEIVE_TWEETS':
      return false;
    default:
      return state;
  }
}
