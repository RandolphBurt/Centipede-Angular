'use strict';

gameApp.controller('AppController', function($scope) {
    $scope.keydown = function(keyEvent) {
        if (!$scope.keyPress) {
            $scope.keyPress = [];
        }
        $scope.keyPress.push(keyEvent.keyCode);
     }
});