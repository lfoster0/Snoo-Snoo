angular.module("snoosnoo").controller("SubredditController", SubredditController);

function SubredditController($scope, RedditAPI, $http, $state) {

  $scope.loadPosts = loadPosts;
  $scope.doRefresh = doRefresh;
  $scope.canLoadMore = canLoadMore;
  $scope.getThumbnailURL = getThumbnailURL;
  $scope.vote = vote;

  $scope.posts = [];
  if ($state.params.name) {
      $scope.title = $state.params.name;
  }
  else {
      $scope.title = "Frontpage"
  }
  var after = 0;
  var count = 0;
  var before = 0;
  var lastCallFailed = false;
  var subredditData = $state.params.name;

  /////////////////
  function loadPosts() {
    if (subredditData) {
        RedditAPI.getSubredditPosts(count, after, $state.params.name).then(success).catch(failure);
    }
    else {
        console.log('getting frontpage');
        RedditAPI.getSubredditPosts(count, after).then(success).catch(failure);
    }

    function success(response) {
      console.log("success getting front page posts");
      count += response.data.data.children.length;
      after = response.data.data.after;
      before = response.data.data.before;
      $scope.posts = $scope.posts.concat(response.data.data.children);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      lastCallFailed = false;
    }

    function failure(err) {
        console.log('failure getting front page');
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

  function getThumbnailURL(post) {
      if (!post.data.preview)
        return;
       var encodedURL = post.data.preview.images[0].resolutions[post.data.preview.images[0].resolutions.length - 1].url;
      return encodedURL.replace(/&amp;/g, '&');
  }

  function vote(postIndex, direction) {
      RedditAPI.vote(direction, $scope.posts[postIndex].data.name).then(success).catch(failure);
      function success(response) {
          console.log('vote success: ' + JSON.stringify(response));
      }

      function failure(err) {
          console.log('vote error: ' + JSON.stringify(err));
      }

      if (direction == 1)
        $scope.posts[postIndex].vote = 'upvote';
      if (direction == -1)
        $scope.posts[postIndex].vote = 'downvote';
  }
}
