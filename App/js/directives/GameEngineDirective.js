'use strict';

gameApp.directive('gameEngine', function($timeout, GameEngine) {
    return {
        restrict: 'E',
        template: '<canvas id="gameCanvas" width="500" height="500" style="border:1px solid #000000;"></canvas>',
        scope: {
            score: '=',
            keyPressList: '='
        },
        link: function(scope, element, attrs, controller) {
            var date = new Date();
            // var gameEngine = new GameEngine(element.find('canvas')[0].getContext("2d"), 'img/graphics.png');
            GameEngine.initialise(element.find('canvas')[0].getContext("2d"), 'img/graphics.png');

            function gameLoop() {
                var nextTick = date.getTime() + 125;

                var currentKey =  scope.keyPressList && scope.keyPressList.length > 0 ? scope.keyPressList[0] : null;
                GameEngine.update(currentKey);

                if (currentKey != null) {
                    scope.score += 10;
                    scope.keyPressList.length = 0;
                }

                $timeout(gameLoop, Math.max(0, nextTick - date.getTime()));
            }

            gameLoop();

        }
    }

        /*

    function keyDown(keyCode) {
        switch (keyCode) {
            case 37: //left
            case 38: //up
            case 39: //right
            case 40: //down
            case 32: //space
                keyPress = event.keyCode;
                break;

            default:
                keyPress = null;
                break;
        }

        return true;
    }     */
});