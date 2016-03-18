angular.module("snoosnoo")

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

 $httpProvider.interceptors.push('APIInterceptor');
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginController'
    })
    .state('menu', {
        url: '/menu',
        abstract: true,
        templateUrl: 'app/menu/menu.html',
        controller: 'MenuController'
    })
    .state('menu.subreddit', {
      url: '/subreddit/:name',
      views: {
          'menuContent': {
              templateUrl: 'app/subreddit/subreddit.html',
              controller: 'SubredditController'
          }
      }
  });
});
