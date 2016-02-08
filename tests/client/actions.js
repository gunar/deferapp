import test from 'tape';
import * as actions from '../../client/actions';
import nock from 'nock';

test('receiveTweets should allow for empty input', t => {
  const actual = actions.receiveTweets();
  const expected = {
    type: 'RECEIVE_TWEETS',
    tweets: [],
    receivedAt: Date.now(),
    visitor: false,
  };

  t.equal(actual.type, expected.type, 'should return correct type');
  t.deepEqual(actual.tweets, expected.tweets, 'should return array of tweets');
  t.ok(expected.receivedAt >= actual.receivedAt, 'should return Date.now()');
  t.equal(actual.visitor, expected.visitor, 'should return visitor');
  t.end();
});

test('receiveTweets should return valid object', t => {
  const actual = actions.receiveTweets({
    data: ['tweet_1', 'tweet_2'],
    visitor: true,
  });
  const expected = {
    type: 'RECEIVE_TWEETS',
    tweets: ['tweet_1', 'tweet_2'],
    receivedAt: Date.now(),
    visitor: true,
  };

  t.equal(actual.type, expected.type, 'should return correct action.type');
  t.deepEqual(actual.tweets, expected.tweets, 'should return array of tweets');
  t.ok(expected.receivedAt >= actual.receivedAt, 'should return Date.now()');
  t.equal(actual.visitor, expected.visitor, 'should return visitor');
  t.end();
});

test('toggleTweet should archive an inbox tweet', t => {
  const dispatcher = actions.toggleTweet(5, ['some', 'useless', 'tags']);
  const url = '/api/tweet/archived/5';

  nock('http://www.deferapp.com')
      .post(url)
      .reply(200, {});

  dispatcher(actual => {
    const expected = {
      type: 'ARCHIVE_TWEET',
      tid: 5,
    };
    t.deepEqual(actual, expected, 'should dispatch ARCHIVE_TWEET with tid');
    t.pass('should call POST ' + url);
    t.end();
  }).catch(t.fail);

});

test('toggleTweet should unarchive an archive tweet', t => {
  const dispatcher = actions.toggleTweet(5, ['archived', 'some', 'useless', 'tags']);
  const url = '/api/tweet/archived/5';
  const nockAnswer = 'called';

  nock('http://www.deferapp.com')
      .delete(url)
      .reply(200, nockAnswer);

  dispatcher(actual => {
    const expected = {
      type: 'UNARCHIVE_TWEET',
      tid: 5,
    };
    t.deepEqual(actual, expected, 'should dispatch UNARCHIVE_TWEET with tid');
    t.pass('should call DELETE ' + url);
    t.end();
  }).catch(t.fail);

});

test('fetchTweets should fetch all tweets if no tags selected', t => {
  const dispatcher = actions.fetchTweets();
  const url = '/api/tweet/0';
  let firstDispatch = true;

  nock('http://www.deferapp.com')
      .get(url)
      .reply(200, {});

  dispatcher(() => {
    if (firstDispatch) {
      firstDispatch = false;
      t.pass('should call GET ' + url);
      t.end();
    }
  }).catch(t.fail);

});

test('fetchTweets should use fromId if provided', t => {
  const fromTid = 82374;
  const url = '/api/tweet/' + fromTid;
  const dispatcher = actions.fetchTweets(fromTid);
  let firstDispatch = true;

  nock('http://www.deferapp.com')
      .get(url)
      .reply(200, {});

  dispatcher(() => {
    if (firstDispatch) {
      firstDispatch = false;
      t.pass('should call GET ' + url);
      t.end();
    }
  }).catch(t.fail);

});

test('fetchTweets should use tags if provided', t => {
  const dispatcher = actions.fetchTweets(undefined, ['some', 'tags']);
  const url = '/api/tweet/some,tags/0';
  let dispatchRequest = true;
  t.plan(1);

  nock('http://www.deferapp.com')
      .get(url)
      .reply(200, { data: [{ tags: ['some', 'tags'] }] });

  dispatcher(() => {
    if (dispatchRequest) {
      dispatchRequest = false;
      t.pass('should call GET ' + url);
    }
  }).catch(t.fail);

});

test('fetchTweets should return visitor flag if visitor', t => {
  const dispatcher = actions.fetchTweets();
  const url = '/api/tweet/0';
  let dispatchRequest = true;
  t.plan(1);

  nock('http://www.deferapp.com')
      .get(url)
      .reply(200, { visitor: true });

  dispatcher(actual => {
    if (dispatchRequest) {
      dispatchRequest = false;
      return;
    }
    t.ok(actual.visitor, 'should return visitor flag');
  }).catch(t.fail);

});
