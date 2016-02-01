// controllers/view
var app = angular.module('app');

app.controller('viewController', ['$scope', '$routeSegment', function($scope, $routeSegment) {
  var mv = this;
  mv.tid = $routeSegment.$routeParams.tid;
}]);
