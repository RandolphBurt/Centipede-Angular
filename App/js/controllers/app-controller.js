angular.module("gameApp")
    .controller("appController", ["$scope", "keyPressHandlerService", function($scope, keyPressHandlerService) {
        "use strict";

        $scope.keydown = function(keyEvent) {
            if (!$scope.instructionsDisplayed) {
                $scope.instructionsDisplayed = true;
                return;
            }

            keyPressHandlerService.keyPress(keyEvent.keyCode);
         };

        $scope.keyup = function(keyEvent) {
            keyPressHandlerService.keyRelease(keyEvent.keyCode);
        };
    }]);