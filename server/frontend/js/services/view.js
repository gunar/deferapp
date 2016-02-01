// services/view
var app = angular.module('app');

// require('less/dash');

// app.filter('elapsed', function($filter){
//     return function(date){
//         if (!date) return;
//         var time = Date.parse(date),
//             difference = (new Date()) - time;

//         // Seconds (e.g. 32s)
//         difference /= 1000;
//         if (difference < 60) return Math.floor(difference)+'s';

//         // Minutes (e.g. 12m)
//         difference /= 60;
//         if (difference < 60) return Math.floor(difference)+'m';

//         // Hours (e.g. 5h)
//         difference /= 60;
//         if (difference < 24) return Math.floor(difference)+'h';

//         // Date (e.g. Dec 2)
//         return $filter('date')(time, 'MMM d');
//     };
// });

app.service('viewService', ['$http', function ($http) {
  this.getArticle = function getArticle(tid) {
    return true;
  };
  // this.getArticle = function (p, dashType) {
  //   var url = (dashType == 'inbox') ? '/api/tweet/'+p : '/api/tweet/archive/'+p;
  //   return $http.get(url)
  //     .then(function success(response) {
  //       return response.data.data.map(parseTweet);
  //     })
  //     .catch(function error(err) {
  //       //TODO Handle error
  //       console.log(err);
  //     });
  // };
}]);
