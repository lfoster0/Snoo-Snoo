angular.module('snoosnoo').factory("RedditAPI", RedditAPI);

function RedditAPI($rootScope, $q, $http, $base64, APIConsts, $cordovaInAppBrowser) {
  var service = {
    authenticate: authenticate,
    getAccessToken: getAccessToken,
    refreshAccessToken: refreshAccessToken,
    getMe: getMe,
    getFrontPagePosts: getFrontPagePosts,
    getSubredditList: getSubredditList
  }

  return service;

  //////////////////////

  /**
   * Performs authentication API call that asks user to allow the app permission
   * to use their account. If successful saves the authCode to be used to get the
   * access token
   */
  function authenticate() {
    var deferred = $q.defer();
    var scope = ['identity', 'read', 'mysubreddits'];
    var url = APIConsts.baseURL +
      APIConsts.apiURL +
      APIConsts.authURL +
      '.compact' +
      '?client_id=' + APIConsts.clientID +
      '&response_type=code' +
      '&state=authcall' +
      '&redirect_uri=' + APIConsts.redirectURL +
      '&duration=permanent' +
      '&scope=' + scope.join(',');
    var options = {
      location: 'no',
      clearcache: 'yes'
    };

    $cordovaInAppBrowser.open(url, '_blank', options);

    // Load error will occur when the api call tries to redirect
    $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event) {
      $cordovaInAppBrowser.close();
      if (event.url.indexOf('error') === -1) {
        var authCode = event.url.split("code=")[1];
        window.localStorage['authCode'] = authCode;
        deferred.resolve('success');
      } else {
        deferred.reject(event.url.split("error=")[1]);
      }
    });

    return deferred.promise;
  }

  /**
   * Gets the access token and saves it as well as the refresh token in local
   * storage
   */
  function getAccessToken() {
    var deferred = $q.defer();
    var url = APIConsts.baseURL + APIConsts.apiURL + APIConsts.accessTokenURL;
    var authCode = window.localStorage['authCode'];
    var data = "redirect_uri=" + APIConsts.redirectURL + "&grant_type=authorization_code" + "&code=" + authCode;

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $http.defaults.headers.post.Authorization = 'Basic ' + $base64.encode(APIConsts.clientID + ":" + '');

    $http.post(url, data).then(success).catch(failure);

    function success(response) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.access_token;
      window.localStorage['access_token'] = response.data.access_token;
      window.localStorage['refresh_token'] = response.data.refresh_token;
      deferred.resolve(response.data.access_token);
    }

    function failure(err) {
      deferred.reject(err);
    }

    return deferred.promise;
  }

  function refreshAccessToken() {
      var deferred = $q.defer();
      var refreshToken = window.localStorage['refresh_token'];
      var url = APIConsts.baseURL + APIConsts.apiURL + APIConsts.accessTokenURL;
      var data = "grant_type=refresh_token" + "&refresh_token=" + refreshToken;
      $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      $http.defaults.headers.post.Authorization = 'Basic ' + $base64.encode(APIConsts.clientID + ":" + '');

      $http.post(url,data).then(success).catch(failure);

      function success(response) {
        console.log('reddit api service refresh token success');
        window.localStorage['access_token'] = response.data.access_token;
        window.localStorage['refresh_token'] = response.data.refresh_token;
        deferred.resolve(response.data.access_token);
      }

      function failure(err) {
        console.log('reddit api service refresh token failed');
        deferred.reject(err);
      }

      return deferred.promise;
  }

  function getMe() {
    var deferred = $q.defer();
    var url = APIConsts.oauthURL + '/me';

    $http.get(url).then(success).catch(failure);

    function success(response) {
      deferred.resolve(response.data);
    }

    function failure(err) {
      deferred.reject(err);
    }

    return deferred.promise;
  }

  function getFrontPagePosts(count, after) {
       var url = APIConsts.oauthURL + '/.json';
      if (!count || count === 0) {
          return $http.get(url);
      }
      var options = {'params': {'count':count, 'after':after}};
      return $http.get(url,options);
  }

  function getSubredditList() {
      var url = APIConsts.oauthURL + "/subreddits/default";
      return $http.get(url);
  }
}
