export default function user(state = 0, action = {}) {
  switch (action.type) {
    case 'RECEIVE_TWEETS':
      return (action.uid || 0);
    default:
      return state;
  }
}
