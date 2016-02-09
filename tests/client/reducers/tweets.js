import test from 'tape';
import tweets from '../../../client/reducers/tweets';

test('reducer tweets', t => {
  let actual;
  let expected;

  actual = tweets(['one'], { type: 'RECEIVE_TWEETS', tweets: ['two', 'three'] });
  expected = ['one', 'two', 'three'];
  t.deepEqual(actual, expected, 'should concat received tweets');

  actual = tweets([
    { tid: 1, tags: ['one'] },
    { tid: 2, tags: ['two'] },
  ], { type: 'ARCHIVE_TWEET', tid: 1 });
  expected = [
    { tid: 1, tags: ['one', 'archived'] },
    { tid: 2, tags: ['two'] },
  ];
  t.deepEqual(actual, expected, 'should add archived tag to tweet with action.tid');

  actual = tweets([
    { tid: 1, tags: ['one'] },
    { tid: 2, tags: ['two', 'archived'] },
  ], { type: 'UNARCHIVE_TWEET', tid: 2 });
  expected = [
    { tid: 1, tags: ['one'] },
    { tid: 2, tags: ['two'] },
  ];
  t.deepEqual(actual, expected, 'should remove archived tag to tweet with action.tid');

  actual = tweets('state');
  expected = 'state';
  t.equal(actual, expected, 'should return state if no action given');

  t.end();
});
// const tweetReducer = (tweet, action) => {
//   switch (action.type) {
//     case 'UNARCHIVE_TWEET':
//       return {
//         ...tweet,
//         tags: tweet.tags.filter(tag => tag !== 'archived'),
//       };
//     case 'ARCHIVE_TWEET':
//       return {
//         ...tweet,
//         tags: [
//           ...tweet.tags,
//           'archived',
//         ],
//       };
//     default:
//       return tweet;
//   }
// };
// export default function tweets(state = [], action) {
//   switch (action.type) {
//     case 'ARCHIVE_TWEET':
//     case 'UNARCHIVE_TWEET':
//       return state.map(tweet => {
//         if (tweet.tid === action.tid) {
//           return tweetReducer(tweet, action);
//         }
//         return tweet;
//       });
//     case 'RECEIVE_TWEETS':
//       return [
//         ...state,
//         ...action.tweets,
//       ];
//     default:
//       return state;
//   }
// }
