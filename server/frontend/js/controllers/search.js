// controllers/search
var app = angular.module('app');

app.controller('searchController', ['title', function(title) {
  var mv = this;
  mv.title = title;
}]);
