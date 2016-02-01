import fetch from 'isomorphic-fetch';

export const receiveTweets = (tweets) => ({
  type: 'RECEIVE_TWEETS',
  tweets,
  receivedAt: Date.now(),
});

export const fetchTweets = (page) => {
  return dispatch => {
    dispatch({ type: 'REQUEST_TWEETS' });
    return fetch(
      '/api/tweet/' + (page ? page : 0),
      {
        credentials: 'same-origin',
      }
    )
    .then(req => req.json())
    .then(json => dispatch(receiveTweets(json.data)));
  };
};
