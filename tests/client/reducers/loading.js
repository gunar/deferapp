import test from 'tape';
import loading from '../../../client/reducers/loading';

test('reducer loading', t => {
  let actual;
  let expected;

  actual = loading(undefined, { type: 'REQUEST_TWEETS' });
  expected = true;
  t.equal(actual, expected, 'should return true when requesting tweets');

  actual = loading(undefined, { type: 'RECEIVE_TWEETS' });
  expected = false;
  t.equal(actual, expected, 'should return false when received tweets');

  actual = loading('state');
  expected = 'state';
  t.equal(actual, expected, 'should return state if no action given');

  t.end();
});
