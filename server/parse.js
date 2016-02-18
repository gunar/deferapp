var unshortener = require('unshortener');

const getYouTubeID = url => {
  var id;
  url = url || '';
  url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    id = url[2].split(/[^0-9a-z_\-]/i);
    return id[0];
  }
  return false;
};

const iframeCSS = 'body,html{margin: 0; width:100%; height:100%; overflow:hidden}iframe{width:100%;height:100%;border:none}';

const shouldAllowScript = shortURL => {
  return new Promise((resolve, reject) => {
    unshortener.expand(shortURL, (err, expandedURL) => {
      var url = expandedURL.href;
      if (err) {
        url = shortURL;
      }

      // Here we could check for other URLs as well
      if (getYouTubeID(url)) {
        return resolve(true);
      }

      return resolve(false);

    });
  });
};

module.exports = {
  getYouTubeID,
  iframeCSS,
  shouldAllowScript,
};
