'use strict';

gameApp.directive('gameEngine', function($interval, GameEngine) {
    return {
        restrict: 'A',
        template: '<canvas id="gameCanvas" width="600" height="640" style="border:1px solid #000000;"></canvas>',

        link: function(scope, element, attrs, controller) {
            var intervalPromise;
            var animation = 0;
            var canvas = element.find('canvas')[0].getContext("2d");

            GameEngine.initialise(canvas, 'App/img/graphics.png');

            function gameLoop() {
                animation++;

                if (animation == 4) {
                    animation = 0;
                }

                GameEngine.update(animation);
            };

            intervalPromise = $interval(gameLoop, Math.max(50));

            scope.$on("$destroy", function() {
               if (intervalPromise) {
                   $interval.cancel(intervalPromise);
                   intervalPromise = undefined;
               }
            });
        }
    }
});
