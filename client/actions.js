const TEST = process.env.NODE_ENV === 'test';
import fetch from 'isomorphic-fetch';

export const receiveTweets = (json = {}) => ({
  type: 'RECEIVE_TWEETS',
  tweets: json.data || [],
  receivedAt: Date.now(),
  visitor: !!json.visitor || false,
});

export const toggleTweet = (tid, tags) => {
  return dispatch => {
    let url;
    const archived = tags.indexOf('archived') > -1;
    if (archived) {
      dispatch({
        type: 'UNARCHIVE_TWEET',
        tid,
      });
    } else {
      dispatch({
        type: 'ARCHIVE_TWEET',
        tid,
      });
    }
    url = (TEST ? 'http://www.deferapp.com' : '') + '/api/tweet/archived/' + tid;
    return fetch(
      url,
      {
        credentials: 'same-origin',
        method: (archived ? 'delete' : 'post'),
      }
    );
  };
};

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
