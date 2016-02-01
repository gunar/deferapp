var app = angular.module('app');

app.controller('tweetController', ['tweets', 'dashType', 'dashService', function(tweets, dashType, dashService) {
  var mv = this;
  mv.dashType = dashType;
  mv.tweets = tweets;
}]);

require('less/empty');
app.directive('rsMessageEmpty', function () {
  return {
    scope: { title: '=' },
    restrict: 'E',
    template: require('views/partials/empty')
    // replace: true
  };
});

require('less/tweetList');
app.directive('rsTweetList', ['$location', 'dashService', function ($location, dashService) {
  return {
    scope: {
      tweets: '=',
      type: '='
    },
    restrict: 'E',
    template: require('views/partials/tweetList'),
    // replace: true
    link: function($scope, element, attrs) {
      $scope.marked = [];
      $scope.page = 1;
      $scope.scrollDisabled = false;

      $scope.go = function(tid) {
        $location.path('/view/' + tid);
      };

      $scope.isMarked = function isMarked() {
        return ($scope.marked.indexOf(this.tweet.tid) > -1);
      };

      $scope.mark = function mark(event) {
        var tid = +this.tweet.tid;

        $scope.marked.push(tid);
        event.stopPropagation();
      };

      $scope.unmark = function mark(event) {
        var tid = +this.tweet.tid;
        var index = $scope.marked.indexOf(tid);

        $scope.marked.splice(index, 1);
        event.stopPropagation();
      };


      $scope.nextPage = function nextPage() {
        $scope.scrollDisabled = true;
        dashService.getTweets($scope.page, $scope.type).then(function(tweets) {
          if (tweets.length > 0) {
            $scope.tweets = $scope.tweets.concat(tweets);
            $scope.page++;
            $scope.scrollDisabled = false;
          }
        });
      };
    }
  };
}]);
