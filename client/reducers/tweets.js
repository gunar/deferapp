export default function tweets(state = [], action) {
  switch (action.type) {
    case RECEIVE_TWEETS:
      console.log(action);
      return [
        ...state,
        {
          tid: 123,
        },
      ];
    // case RECEIVE_ENTRIES:
    //   return action.json.entries;
    default:
      return state;
  }
}
