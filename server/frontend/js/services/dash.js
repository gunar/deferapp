// services/dash
var app = angular.module('app');

require('less/dash');

app.filter('elapsed', function($filter){
    return function(date){
        if (!date) return;
        var time = Date.parse(date),
            difference = (new Date()) - time;

        // Seconds (e.g. 32s)
        difference /= 1000;
        if (difference < 60) return Math.floor(difference)+'s';

        // Minutes (e.g. 12m)
        difference /= 60;
        if (difference < 60) return Math.floor(difference)+'m';

        // Hours (e.g. 5h)
        difference /= 60;
        if (difference < 24) return Math.floor(difference)+'h';

        // Date (e.g. Dec 2)
        return $filter('date')(time, 'MMM d');
    };
});

app.service('dashService', ['$http', function ($http) {
  this.getTweets = function (p, dashType) {
    var url = (dashType == 'inbox') ? '/api/tweet/'+p : '/api/tweet/archive/'+p;
    return $http.get(url)
      .then(function success(response) {
        return response.data.data.map(parseTweet);
      })
      .catch(function error(err) {
        //TODO Handle error
        console.log(err);
      });
  };
}]);

var parseTweet = function (tweet) {
 //TODO: Should this be done in the backend?
  var obj = {};
  if (tweet.tweet.entities.urls[0])
    obj.link = tweet.tweet.entities.urls[0].expanded_url;
  obj.tid = tweet.tweet.id;
  obj.user = tweet.tweet.user.screen_name;
  obj.name = tweet.tweet.user.name;
  obj.url = 'https://twitter.com/' + obj.user + '/status/' + tweet.tweet.id_str;
  if (tweet.tweet.entities && tweet.tweet.entities.media)
    obj.media = tweet.tweet.entities.media;
  obj.favs = tweet.tweet.favorite_count;
  obj.retweets = tweet.tweet.retweet_count;
  obj.msg = tweet.tweet.text;
  obj.profile_img = tweet.tweet.user.profile_image_url_https;
  obj.time = tweet.tweet.created_at;

  return obj;
};
