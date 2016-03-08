angular.module("snoosnoo").controller("FrontPageController", FrontPageController);

function FrontPageController($scope, RedditAPI, $http, $ionicSideMenuDelegate) {

  $scope.loadPosts = loadPosts;
  $scope.doRefresh = doRefresh;
  $scope.canLoadMore = canLoadMore;
  $scope.loadSubreddits = loadSubreddits;
  $scope.posts = [];
  $scope.subreddits = [];
  var after = 0;
  var count = 0;
  var before = 0;
  var lastCallFailed = false;

  /////////////////
  function loadPosts() {
    RedditAPI.getFrontPagePosts(count, after).then(success).catch(failure);

    function success(response) {
      count += response.data.data.children.length;
      after = response.data.data.after;
      before = response.data.data.before;
      $scope.posts = $scope.posts.concat(response.data.data.children);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      lastCallFailed = false;
    }

    function failure(err) {
      lastCallFailed = true;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
  }

  function doRefresh() {
      after = 0;
      count = 0;
      before = 0;
      $scope.posts = [];
      loadPosts();
  }

  function canLoadMore() {
      // To make sure it doesn't keep trying API calls
      if (lastCallFailed) {
          return false;
      }
      return true;
  }

  function loadSubreddits() {
      RedditAPI.getSubredditList().then(success).catch(failure);

      function success(response) {
          $scope.subreddits = response.data.data.children;
      }

      function failure(err) {
          console.log('error loading subreddit list' + JSON.stringify(err));
      }
  }
}
