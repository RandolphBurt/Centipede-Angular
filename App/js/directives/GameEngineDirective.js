'use strict';

gameApp.directive('gameEngine', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            var date = new Date();
            var gameEngine = new GameEngine(element[0], 'img/graphics.png');

            function gameLoop() {
                var nextTick = date.getTime() + 125;

                var currentKey =  scope.keyPress && scope.keyPress.length > 0 ? scope.keyPress[0] : null;
                gameEngine.update(currentKey);

                if (currentKey != null) {
                    scope.keyPress.length = 0;
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