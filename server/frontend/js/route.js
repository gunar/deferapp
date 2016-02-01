/* jshint esnext: true */
var ret = function(val) { return [function () { return val; }]; };

module.exports = function (app) {
  var $inject = ['$routeSegmentProvider', '$routeProvider'];

  var routeConfig = function ($routeSegmentProvider, $routeProvider) {

    var loading = '<div class="spinner"></div>';
    $routeSegmentProvider.options.autoLoadTemplates = true;

    $routeSegmentProvider
      .when('/inbox', 'inbox')
      .when('/inbox/list', 'inbox.list')

      .when('/archive', 'archive')
      .when('/archive/list', 'archive.list')

      .when('/view/:tid', 'view')

      .segment('inbox', {
        template: require('views/partials/search'),
        controller: 'searchController as search',
        resolve: { title: ret('Inbox') }
      })
      .within()
        .segment('list', {
          'default': true,
          template: require('views/partials/list'),
          controller: 'tweetController as dash',
          resolve: {
            tweets: ['dashService', function (dashService) {
              return dashService.getTweets(0, 'inbox');
            }],
            dashType: ret('inbox')
          },
          untilResolved: {
            template: loading
          }
        })
        .up()
      .segment('archive', {
        template: require('views/partials/search'),
        controller: 'searchController as search',
        resolve: { title: ret('Archive') }
      })
      .within()
        .segment('list', {
          'default': true,
          template: require('views/partials/list'),
          controller: 'tweetController as dash',
          resolve: {
            tweets: ['dashService', function (dashService) {
              return dashService.getTweets(0, 'archive');
            }],
            dashType: ret('archive')
          },
          untilResolved: {
            template: loading
          }
        })
        .up()
      .segment('view', {
        template: require('views/partials/view'),
        controller: 'viewController as view',
        dependencies: ['tid'],
        resolve: {
          article: ['viewService', '$routeSegment', function (viewService, $routeSegment) {
            return viewService.getArticle($routeSegment.$routeParams.tid);
          }]
        },
        untilResolved: {
          template: loading
        }
      })
      ;

    $routeProvider.otherwise({redirectTo: '/inbox'});
  };

  routeConfig.$inject = $inject;

  return routeConfig;
};
