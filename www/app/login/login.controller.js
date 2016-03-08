angular.module('snoosnoo').controller('LoginController', LoginController);

function LoginController($scope, RedditAPI, $state, $http, $ionicHistory) {

  $scope.login = login;
  $scope.noAuth = noAuth;

  ///////////////////

  function login() {
      if (window.localStorage['authCode']) {
          console.log('found auth code: ' + window.localStorage['authCode']);
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('frontpage');
      }
      else {
          // window.localStorage.clear();
          RedditAPI.authenticate().then(success).catch(failure);

          function success(data) {
              console.log('login success response: ' + JSON.stringify(data));
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('frontpage');
          }

          function failure(err) {
            console.log('failure because: ' + err);
          }
      }

  }

  function noAuth() {
    console.log('to do');
  }
}
