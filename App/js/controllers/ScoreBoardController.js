'use strict';

gameApp.controller('ScoreBoardController', function ScoreBoardController($scope) {
    $scope.GameState = {};
    $scope.GameState.Score = 0;

    $scope.GameState.HighScore = 120;

    $scope.IncrementScore = function(increment) {
        $scope.GameState.Score += increment;

        if ($scope.GameState.Score > $scope.GameState.HighScore) {
            $scope.GameState.HighScore = $scope.GameState.Score;
        }
    }
});