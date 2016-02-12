import fetch from 'isomorphic-fetch';

const TEST = process.env.NODE_ENV === 'test';
const baseUrl = (TEST ? 'http://www.deferapp.com' : '');


export const toggleTweet = (tid, tags) => {
  return dispatch => {
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
    const url = baseUrl + '/api/tweet/archived/' + tid;
    return Promise.resolve(fetch(
      url,
      {
        credentials: 'same-origin',
        method: (archived ? 'delete' : 'post'),
      }
    ));
  };
};

export const receiveTweets = (json = {}) => ({
  type: 'RECEIVE_TWEETS',
  tweets: json.data || [],
  receivedAt: Date.now(),
  visitor: !!json.visitor || false,
});

export const fetchTweets = (fromTid = 0, filter = []) => {
  return dispatch => {
    dispatch({
      type: 'REQUEST_TWEETS',
      fromTid,
      filter,
    });

    const url = baseUrl + '/api/tweet/' + (filter.length > 0 ? filter.join(',') + '/' : '');

    return Promise.resolve(fetch(
      url + fromTid,
      {
        credentials: 'same-origin',
      }
    ))
    .then(req => req.json())
    .then(json => dispatch(receiveTweets(json)));
  };
};

export const openReader = (url = '', tid = 0) => {
  fetch(baseUrl + '/api/log/open_reader', {
    credentials: 'same-origin',
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, tid }),
  });

  return {
    type: 'OPEN_READER',
    url,
  };
};

export const closeReader = () => ({
  type: 'CLOSE_READER',
});
