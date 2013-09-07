'use strict';

gameApp.directive('gameEngine', function($timeout, GameEngine) {
    return {
        restrict: 'A',
        template: '<canvas id="gameCanvas" width="600" height="640" style="border:1px solid #000000;"></canvas>',

        link: function(scope, element, attrs, controller) {
            var timer;
            var animation = 0;
            var date = new Date();
            var canvas = element.find('canvas')[0].getContext("2d");

            GameEngine.initialise(canvas, 'App/img/graphics.png');

            function gameLoop() {
                var nextTick = date.getTime() + 50;

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
