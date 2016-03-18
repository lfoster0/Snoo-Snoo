angular.module('snoosnoo').factory('APIInterceptor', APIInterceptor);

function APIInterceptor($q, $injector) {
  var service = {
    request: requestIntercept,
    response: responseIntercept,
    requestError: requestError,
    responseError: responseError
  }

  return service;

  function requestIntercept(config) {
    var APIConsts = $injector.get('APIConsts');
    if (window.localStorage['access_token'] && !config.url.startsWith(APIConsts.baseURL)) {
      config.headers.Authorization = 'Bearer ' + window.localStorage['access_token'];
    }
    // console.log('request intercepted: ' + JSON.stringify(config));
    return config;
  }

  function responseIntercept(response) {
    // console.log('response intercepted: ' + JSON.stringify(response));
    return response;
  }

  function requestError(err) {
    // console.log('request error: ' + JSON.stringify(err));
    return {};
  }

  function responseError(err) {
    console.log('response error: ' + JSON.stringify(err));
    var RedditAPI = $injector.get('RedditAPI');
    var $http = $injector.get('$http');
    var APIConsts = $injector.get('APIConsts');
    var $ionicHistory = $injector.get('$ionicHistory');
    var $state = $injector.get('$state');
    var deferred = $q.defer();

    // Access codes don't work so log out to get a new one
    if (err.status === 400) {
        window.localStorage.clear();
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('login');
    }
    // Catch a failed call to refresh the access token so we don't infinitly try
    // to get a new one
     if (err.config.url.startsWith(APIConsts.baseURL + APIConsts.apiURL + APIConsts.accessTokenURL)) {
         console.log('caugth problem getting access token, not trying again');
        return $q.reject(err);
    }
    // No access token error
    else if (!window.localStorage['access_token']) {
      console.log('no access token error');
      RedditAPI.getAccessToken().then(deferred.resolve, deferred.reject);

      return deferred.promise.then(function() {
        return $http(err.config);
      });
    }
    // Try to refresh the access token and then recover, if this fails it is
    // caught above.
    else if (err.status === 401) {
        console.log('error 401: getting new access token');
        RedditAPI.refreshAccessToken().then(deferred.resolve, deferred.reject);

        return deferred.promise.then(function() {
            return $http(err.config);
        })
    }


    return $q.reject(err);
  }
}
