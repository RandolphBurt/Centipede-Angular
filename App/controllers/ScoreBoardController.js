'use strict';

gameApp.controller('ScoreBoardController', function ScoreBoardController($scope) {
    $scope.score = 0;

    $scope.highScore = 120;

    $scope.IncrementScore = function(increment) {
        $scope.score += increment;

        if ($scope.score > $scope.highScore) {
            $scope.highScore = $scope.score;
        }
    }
});