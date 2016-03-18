angular.module('snoosnoo').controller('MenuController', MenuController);

function MenuController($scope, $ionicSideMenuDelegate, RedditAPI, $state) {

    $scope.loadSubreddits = loadSubreddits;
    $scope.goToSubreddit = goToSubreddit;
    $scope.subreddits = [];

    //////////////////

    function loadSubreddits() {
        RedditAPI.getSubredditList().then(success).catch(failure);

        function success(response) {
            $scope.subreddits = response.data.data.children;
        }

        function failure(err) {
            console.log('error loading subreddit list' + JSON.stringify(err));
        }
    }

    function goToSubreddit(subredditData) {
        $state.go('menu.subreddit', {name: subredditData.data.display_name});
    }
}
