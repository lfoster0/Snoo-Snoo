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
        templateUrl: 'menu/menu.html',
        controller: 'MenuController'
    })
    .state('frontpage', {
      url: '/',
      templateUrl: 'app/frontpage/frontpage.html',
      controller: 'FrontPageController'
  });
});
