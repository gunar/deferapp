import fetch from 'isomorphic-fetch';

export const receiveTweets = (json) => ({
  type: 'RECEIVE_TWEETS',
  tweets: json.data,
  receivedAt: Date.now(),
  visitor: (json.visitor || false),
});

export const fetchTweets = (fromTid, filter = []) => {
  return dispatch => {
    dispatch({
      type: 'REQUEST_TWEETS',
      fromTid,
      filter
    });
    var url = (filter.length > 0) ? '/api/tweet/'+filter.join(',')+'/' : '/api/tweet/'
    return fetch(
      url + (fromTid ? fromTid : 0),
      {
        credentials: 'same-origin',
      }
    )
    .then(req => req.json())
    .then(json => dispatch(receiveTweets(json)));
  };
};
