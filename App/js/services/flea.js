angular.module("gameApp")
    .factory("fleaService", ["globalSettings", "gameBoardService", "graphicsEngineService", "sprite", "utilsService", "coordinateSystem", function(globalSettings, gameBoardService, graphicsEngineService, sprite, utilsService, coordinateSystem) {
        "use strict";

        var flea = null;

        var create = function() {
            var x = utilsService.random(globalSettings.gameBoardWidth);
            flea = {
                x: x,
                y: 0,
                prevY: 0,
                dy: 0.5
            }
        };

        return {

            checkCreateFlea: function() {
                if (flea) {
                    return;
                }

                if (gameBoardService.mushroomsInPlayerArea > globalSettings.minMushroomsInPlayerAreaBeforeFleaCreated &&
                    gameBoardService.mushroomsOnScreen > globalSettings.minMushroomsBeforeFleaCreated) {
                    return;
                }

                if (gameBoardService.mushroomsOnScreen < globalSettings.maxMushroomsAllowed &&
                    (gameBoardService.mushroomsOnScreen < globalSettings.minMushroomsBeforeFleaCreated || utilsService.random(globalSettings.fleaCreationChance) === 0)) {

                    create()
                }
            },

            destroy: function() {
                flea = null;
            },

            checkCollision: function(x, y) {
                if (!flea) {
                    return false;
                }

                return !!(flea.x === x && (flea.y === y || flea.prevY === y));
            },

            update: function(animation) {
                if ((animation % 2) !== 0 || !flea) {
                    return;
                }

                flea.prevY = flea.y;
                flea.y += 1;

                if (flea.prevY < globalSettings.gameBoardHeight - 1) {
                    // Not allowed to put a mushroom on the bottom row
                    if (Math.floor(Math.random() * 3) === 0) {
                        gameBoardService.createMushroom(flea.x, flea.prevY);
                    }
                }
            },

            draw: function(animation) {
                if (!flea) {
                    return;
                }

                var destY = flea.prevY + ((animation % 2) * flea.dy);

                graphicsEngineService.drawImage(coordinateSystem.world, flea.x, destY, sprite.flea);
            }
        }
    }]);