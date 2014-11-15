angular.module("gameApp", [])

    .controller("appController", ["$scope", "keyPressHandlerService", function($scope, keyPressHandlerService) {
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
    }])

    .directive("centipedeGame", ["$interval", "gameService", "renderService", "graphicsEngineService", function($interval, gameService, renderService, graphicsEngineService) {
        return {
            restrict: 'A',
            template: '<canvas id="gameCanvas" width="600" height="640" style="border:1px solid #000000;"></canvas>',

            link: function(scope, element) {
                var intervalPromise;
                var animation = 0;
                var canvas = element.find('canvas')[0].getContext("2d");

                graphicsEngineService.initialise(canvas, 'images/graphics.png');
                gameService.initialise();

                function gameLoop() {
                    animation++;

                    if (animation == 4) {
                        animation = 0;
                    }

                    gameService.update(animation);
                    renderService.draw(animation);
                }

                intervalPromise = $interval(gameLoop, 50);

                scope.$on("$destroy", function() {
                    if (intervalPromise) {
                        $interval.cancel(intervalPromise);
                        intervalPromise = undefined;
                    }
                });
            }
        }
    }]);
