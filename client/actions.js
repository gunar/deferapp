import fetch from 'isomorphic-fetch';

const TEST = process.env.NODE_ENV === 'test';
const baseUrl = (TEST ? 'http://www.deferapp.com' : '');

export const unarchiveTweet = (tid) => {
  return dispatch => {
    dispatch({
      type: 'UNARCHIVE_TWEET',
      tid,
    });
    const url = baseUrl + '/api/tweet/archived/' + tid;
    return Promise.resolve(fetch(
      url,
      {
        credentials: 'same-origin',
        method: 'delete',
      }
    ));
  };
};

export const archiveTweet = (tid) => {
  return dispatch => {
    dispatch({
      type: 'ARCHIVE_TWEET',
      tid,
    });
    const url = baseUrl + '/api/tweet/archived/' + tid;
    return Promise.resolve(fetch(
      url,
      {
        credentials: 'same-origin',
        method: 'post',
      }
    ));
  };
};

export const toggleTweet = (tid, tags) => {
  const archived = tags.indexOf('archived') > -1;
  if (archived) {
    return unarchiveTweet(tid);
  }
  return archiveTweet(tid);
};

export const receiveTweets = (json = {}) => ({
  type: 'RECEIVE_TWEETS',
  tweets: json.data || [],
  receivedAt: Date.now(),
  visitor: !!json.visitor || false,
  uid: json.uid,
});

export const fetchTweets = (fromTid = 0, filter = [], uid = 0) => {
  return dispatch => {
    dispatch({
      type: 'REQUEST_TWEETS',
      fromTid,
      filter,
    });
    ga('send', {
      hitType: 'event',
      eventCategory: 'tweet',
      eventAction: 'fetchTweets',
      eventLabel: filter.join(',') || 'default',
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

export const openReader = (url = '', tid = 0, allowScript = false, uid = 0) => {
  ga('send', {
    hitType: 'event',
    eventCategory: 'tweet',
    eventAction: 'openReader',
    eventLabel: 'default',
  });
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
    tid,
    allowScript,
  };
};

export const closeReader = () => ({
  type: 'CLOSE_READER',
});
