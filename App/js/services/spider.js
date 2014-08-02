angular.module("gameApp")
    .factory("spiderService", ["globalSettings", "gameBoardService", "graphicsEngineService", "sprite", "utilsService", "playerService", "coordinateSystem",
        function(globalSettings, gameBoardService, graphicsEngineService, sprite, utilsService, playerService, coordinateSystem) {
        "use strict";

        var spider = null;

        var create = function(x, y) {
            spider = {
                x: x,
                y: y,
                prevX: -1,
                dx: x === 0 ? 0.25 : -0.25,
                maxY: globalSettings.gameBoardHeight -1,
                minY: (globalSettings.gameBoardHeight - globalSettings.playerAreaHeight) + 1,
                dy: -0.25
            };

            spider.startDx = spider.dx;
            spider.prevX = x - 4 * spider.dx;
            spider.prevY = y - 4 * spider.dy;
        };

        return {

            checkCreateSpider: function() {
                if (spider) {
                    return;
                }

                if (utilsService.random(globalSettings.spiderCreationChance) === 0) {
                    var x = playerService.isLocatedLeftOfMiddle() ? globalSettings.gameBoardWidth - 1 : 0;
                    var y = (globalSettings.gameBoardHeight - globalSettings.playerAreaHeight) + utilsService.random(globalSettings.playerAreaHeight);

                    create(x, y);
                }
            },

            destroy: function() {
                spider = null;
            },

            checkCollision: function(x, y) {
                if (!spider) {
                    return false;
                }

                return !!(((spider.x === x || spider.x + 1 === x) && spider.y === y) ||
                    ((spider.prevX === x || spider.prevX + 1 === x) && spider.prevY === y));
            },

            update: function (animation) {
                if (!spider || animation !== 0) {
                    return;
                }

                if (spider.x < -1 || spider.x >= globalSettings.gameBoardWidth) {
                    spider = null;
                    return;
                }

                var changeX = true;

                // bounce up and down...
                if (spider.y >= spider.maxY) {
                    spider.dy = -0.25;
                } else if (spider.y <= spider.minY) {
                    spider.dy = 0.25;
                } else {
                    changeX = false;
                }

                if (changeX) {
                    if (Math.floor(Math.random() * 4) === 0) {
                        spider.dx = 0;
                    } else {
                        spider.dx = spider.startDx;
                    }
                }

                spider.prevY = spider.y;
                spider.prevX = spider.x;

                spider.x += (4 * spider.dx);
                spider.y += (4 * spider.dy);

                if (spider.x >= 0 && spider.x < globalSettings.gameBoardWidth) {
                    gameBoardService.destroyMushroom(spider.x, spider.y);

                    if (spider.x >= 0 && spider.x < globalSettings.gameBoardWidth - 1) {
                        gameBoardService.destroyMushroom(spider.x + 1, spider.y);
                    }
                }
            },

            draw: function (animation) {
                if (!spider) {
                    return;
                }

                var destX = spider.prevX + (animation * spider.dx);
                var destY = spider.prevY + (animation * spider.dy);

                var image = sprite.spiderAnim1Left;

                if (animation % 2) {
                    image += 2;
                }

                graphicsEngineService.drawImage(coordinateSystem.world, destX,     destY, image);
                graphicsEngineService.drawImage(coordinateSystem.world, destX + 1, destY, image + 1);
            }
        }

    }]);