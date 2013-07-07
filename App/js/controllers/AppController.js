'use strict';

gameApp.controller('AppController', function($scope) {
    $scope.keydown = function(keyEvent) {
        if (!$scope.KeyPressList) {
            $scope.KeyPressList = [];
        }
        $scope.KeyPressList.push(keyEvent.keyCode);
     }
});