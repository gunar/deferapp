export default function visitor(state = true, action = {}) {
  switch (action.type) {
    case 'RECEIVE_TWEETS':
      return (action.visitor || false);
    default:
      return state;
  }
}
