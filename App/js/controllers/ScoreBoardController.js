'use strict';

gameApp.controller('ScoreBoardController', function ScoreBoardController($scope) {
    $scope.GameScore = 0;

    $scope.HighScore = 120;

    $scope.IncrementScore = function(increment) {
        $scope.GameScore += increment;

        if ($scope.GameScore > $scope.HighScore) {
            $scope.HighScore = $scope.GameScore;
        }
    }
});