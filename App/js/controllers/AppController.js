'use strict';

gameApp.controller('AppController', function($scope, KeyPressHandler) {

    $scope.keydown = function(keyEvent) {
        if (!$scope.instructionsDisplayed) {
            $scope.instructionsDisplayed = true;
            return;
        }

        KeyPressHandler.keyPress(keyEvent.keyCode);
     };

    $scope.keyup = function(keyEvent) {
        KeyPressHandler.keyRelease(keyEvent.keyCode);
    };
});