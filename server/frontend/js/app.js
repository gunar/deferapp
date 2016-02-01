/* jshint esnext: true */
// var angular = require('angular');
// var ngRoute = require('angular-route');
// var segment = require('angular-route-segment');
// import angular from 'angular';
import ngRoute from 'angular-route';
import segment from 'angular-route-segment';
import infiniteScroll from 'ngInfiniteScroll';

var app = angular.module('app', ['ngRoute', 'route-segment', 'view-segment', 'infinite-scroll']).value('locals', undefined);
var requireAll = function(r) { r.keys().forEach(r); };

// Route
app.config(require('./route')(app));

// Services
requireAll(require.context('./services/', true, /\.js$/));

// Controllers
requireAll(require.context('./controllers/', true, /\.js$/));
