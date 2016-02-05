import test from 'tape';
import * as actions from '../../client/actions';
import nock from 'nock';

function responseToText(response) {
  if (response.status >= 400) throw new Error('Bad server response');
  return response.text();
}

test('receiveTweets without input', t => {
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

test('receiveTweets output', t => {
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

  t.equal(actual.type, expected.type, 'should return correct type');
  t.deepEqual(actual.tweets, expected.tweets, 'should return array of tweets');
  t.ok(expected.receivedAt >= actual.receivedAt, 'should return Date.now()');
  t.equal(actual.visitor, expected.visitor, 'should return visitor');
  t.end();
});

test('toggleTweet to archive', t => {
  t.plan(3);
  const dispatcher = actions.toggleTweet(5, ['some', 'useless', 'tags']);

  t.equal(typeof dispatcher, 'function', 'should return a function');

  nock('http://www.deferapp.com')
      .post('/api/tweet/archived/5')
      .reply(200, {
        tid: 123,
      });

  dispatcher(actual => {
    const expected = {
      type: 'ARCHIVE_TWEET',
      tid: 5,
    };
    t.deepEqual(actual, expected, 'should call dispatch with valid object');

  })
  .then(responseToText)
  .then(data => {
    console.log(data);

  }).catch(t.fail);

});
