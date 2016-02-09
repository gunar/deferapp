import test from 'tape';
import filter from '../../../client/reducers/filter';

test('reducer filter', t => {
  let actual;
  let expected;

  actual = filter(['one'], { type: 'ADD_FILTER', filter: 'two' });
  expected = ['one', 'two'];
  t.deepEqual(actual, expected, 'ADD_FILTER should return array with new filter concated');

  actual = filter(['one', 'two'], { type: 'REMOVE_FILTER', filter: 'two' });
  expected = ['one'];
  t.deepEqual(actual, expected, 'REMOVE_FILTER should remove filter from array');

  actual = filter(['one', 'two'], { type: 'SET_FILTER', filter: '' });
  expected = [];
  t.deepEqual(actual, expected, 'SET_FILTER return an empty array if no filter is given');

  actual = filter(['one'], { type: 'SET_FILTER', filter: 'three' });
  expected = ['three'];
  t.deepEqual(actual, expected, 'SET_FILTER should return an array with only given filter');

  actual = filter([], { type: 'TOGGLE_FILTER' });
  expected = ['archived'];
  t.deepEqual(actual, expected, 'TOGGLE_FILTER should return array with "archived"');

  actual = filter(['archived'], { type: 'TOGGLE_FILTER' });
  expected = [];
  t.deepEqual(actual, expected, 'TOGGLE_FILTER should return array without "archived"');

  actual = filter(['one'], { type: 'RESET_FILTER' });
  expected = [];
  t.deepEqual(actual, expected, 'RESET_FILTER should return empty array');

  actual = filter('state');
  expected = 'state';
  t.equal(actual, expected, 'should return state if no action given');

  t.end();
});

//     case 'RESET_FILTER':
//       return [];
//     default:
//       return state;
//   }
// }
