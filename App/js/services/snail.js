angular.module("gameApp")
    .factory("snailService", ["globalSettings", "gameBoardService", "graphicsEngineService", "sprite", "utilsService", "coordinateSystem", function(globalSettings, gameBoardService, graphicsEngineService, sprite, utilsService, coordinateSystem) {
        "use strict";

        var snail = null;

        var create = function(y) {
            snail = {
                x: 0,
                y: y,
                prevX: -1,
                dx: 0.25
            }
        };

        return {

            checkCreateSnail: function() {
                if (snail) {
                    return;
                }

                if (utilsService.random(globalSettings.snailCreationChance) === 0) {
                    var y = utilsService.random(globalSettings.gameBoardHeight - globalSettings.playerAreaHeight);

                    create(y);
                }
            },

            destroy: function() {
                snail = null;
            },

            checkCollision: function(x, y) {
                if (!snail) {
                    return false;
                }

                return !!((snail.x === x || snail.x + 1 === x) && snail.y === y);
            },

            update: function (animation) {
                if (!snail || animation !== 0) {
                    return;
                }

                if (snail.x >= globalSettings.gameBoardWidth) {
                    snail = null;
                    return;
                }

                snail.prevX = snail.x;
                snail.x++;

                if (snail.x < globalSettings.gameBoardWidth) {
                    gameBoardService.poisonMushroom(snail.x, snail.y);
                }
            },

            draw: function (animation) {
                if (!snail) {
                    return;
                }

                var destX = snail.prevX + (animation * snail.dx);

                var image = sprite.snailAnim1Left;

                switch (animation) {
                    case 1:
                    case 3:
                        image = sprite.snailAnim2Left;
                        break;

                    case 2:
                        image = sprite.snailAnim3Left;
                        break;
                }

                graphicsEngineService.drawImage(coordinateSystem.world, destX,     snail.y, image);
                graphicsEngineService.drawImage(coordinateSystem.world, destX + 1, snail.y, image + 1);
            }
        }
    }]);