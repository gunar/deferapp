import test from 'tape';
import * as parse from '../../server/parse';

test('getYouTubeID should return valid ID for all url types and false for non-youtube urls', t => {
  const validURLs = {
    'http://youtube.googleapis.com/v/4e_kz79tjb8?version=3': '4e_kz79tjb8',
    'https://www.youtube.com/watch?feature=g-vrec&v=Y1xs_xPb46M': 'Y1xs_xPb46M',
    'http://www.youtube.com/watch?feature=player_embedded&v=Ab25nviakcw#': 'Ab25nviakcw',
    'http://youtu.be/Ab25nviakcw': 'Ab25nviakcw',
    'http://www.youtube.com/watch?v=Ab25nviakcw': 'Ab25nviakcw',
    'http://i1.ytimg.com/vi/Ab25nviakcw/default.jpg': 'Ab25nviakcw',
    'https://www.youtube.com/watch?v=BGL22PTIOAM&feature=g-all-xit': 'BGL22PTIOAM',
    'http://deferapp.com': false,
  };

  for (let url in validURLs) {
    t.equal(parse.getYouTubeID(url), validURLs[url], 'should parse url ' + url);
  }

  t.end();
});
