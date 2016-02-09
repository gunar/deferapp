import test from 'tape';
import visitor from '../../../client/reducers/visitor';

test('reducer visitor', t => {
  let actual;
  let expected;

  actual = visitor(true, { type: 'RECEIVE_TWEETS' });
  expected = false;
  t.equal(actual, expected, 'should return false if no visitor prop in action');

  actual = visitor(true, { type: 'RECEIVE_TWEETS', visitor: true });
  expected = true;
  t.equal(actual, expected, 'should return true if action.visitor is true');

  actual = visitor('state');
  expected = 'state';
  t.equal(actual, expected, 'should return state if no action given');

  t.end();
});
