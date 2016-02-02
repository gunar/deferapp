import fetch from 'isomorphic-fetch';

export const receiveTweets = (json) => ({
  type: 'RECEIVE_TWEETS',
  tweets: json.data,
  receivedAt: Date.now(),
  visitor: (json.visitor || false),
});

export const fetchTweets = (fromTid) => {
  return dispatch => {
    dispatch({
      type: 'REQUEST_TWEETS',
      fromTid,
    });
    return fetch(
      '/api/tweet/' + (fromTid ? fromTid : 0),
      {
        credentials: 'same-origin',
      }
    )
    .then(req => req.json())
    .then(json => dispatch(receiveTweets(json)));
  };
};
