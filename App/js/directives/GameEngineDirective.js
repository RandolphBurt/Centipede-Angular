'use strict';

gameApp.directive('gameEngine', function($timeout, GameEngine, GlobalSettings) {
    return {
        restrict: 'E',
        template: '<canvas id="gameCanvas" width="600" height="600" style="border:1px solid #000000;"></canvas>',
        scope: {
            gameState: '='
        },
        link: function(scope, element, attrs, controller) {
            var timer;
            var animation = 0;
            var date = new Date();
            var canvas = element.find('canvas')[0].getContext("2d");

            GameEngine.initialise(canvas, 'img/graphics.png', { width: GlobalSettings.gameBoardWidth, height: GlobalSettings.gameBoardHeight, scale: 1 }, scope.gameState);

            function gameLoop() {
                var nextTick = date.getTime() + 60;

                animation++;

                if (animation == 4) {
                    animation = 0;
                }

                GameEngine.update(animation);

                timer = $timeout(gameLoop, Math.max(0, nextTick - date.getTime()));
            }

            gameLoop();

            scope.$on("$destroy", function() {
               if (timer) {
                   $timeout.cancel(timer);
               }
            });
        }
    }
});