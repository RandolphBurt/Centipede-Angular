'use strict';

gameApp.controller('AppController', function($scope, KeyPressHandler) {

    $scope.keydown = function(keyEvent) {
        KeyPressHandler.keyPress(keyEvent.keyCode);
     };

    $scope.keyup = function(keyEvent) {
        KeyPressHandler.keyRelease(keyEvent.keyCode);
    };
});