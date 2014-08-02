angular.module("gameApp")
    .factory("bulletService", ["globalSettings", "graphicsEngineService", "gameBoardService", "boardLocation", "scoreMarkerService", "fleaService", "snailService", "spiderService", "centipedeService", "characterState", "sprite", "gameStateService", "coordinateSystem",
        function(globalSettings, graphicsEngineService, gameBoardService, boardLocation, scoreMarkerService, fleaService, snailService, spiderService, centipedeService, characterState, sprite, gameStateService, coordinateSystem) {
        "use strict";

        var bullets = [];

        var moveBullet = function(bullet) {
            if (bullet.bulletState === characterState.active) {
                bullet.y--;
            }

            if (bullet.y < 0 || (bullet.bulletState === characterState.active && checkCollision(bullet.x, bullet.y))) {
                bullet.bulletState = characterState.dead;
            }

            if (bullet.bulletState === characterState.dead) {
                bullet.animationDeadCount++;
            }
        };

        var isAlive = function(bullet) {
            if (bullet.y < 0) {
                return false;
            }

            return !(bullet.bulletState === characterState.dead && bullet.animationDeadCount > globalSettings.delayAfterDeathBeforeBulletDispose);
        };

        var checkCollision = function(x, y) {
            // we can only hit one thing.  If two things share the same space then only one gets destroyed.
            // First thing destroyed is a mushroom - therefore if a centipede is falling straight down then it will
            // still get nearer the bottom
            var collisionScore = 0;

            var mushroomHit = gameBoardService.checkCollision(x, y, true);

            switch (mushroomHit) {
                case boardLocation.mushroom:
                    collisionScore = globalSettings.scoreHitMushroom;
                    break;

                case boardLocation.poisonMushroom:
                    collisionScore = globalSettings.scoreHitPoisonMushroom;
                    break;
            }

            if (!collisionScore && fleaService.checkCollision(x, y)) {
                fleaService.destroy();
                collisionScore = globalSettings.scoreHitFlea;
            }

            if (!collisionScore && spiderService.checkCollision(x, y)) {
                spiderService.destroy();
                collisionScore = globalSettings.scoreHitSpider;
            }

            if (!collisionScore && snailService.checkCollision(x, y)) {
                snailService.destroy();
                collisionScore = globalSettings.scoreHitSnail;
            }

            if (!collisionScore && centipedeService.checkCollision(x, y, true)) {
                gameBoardService.createMushroom(x, y);
                collisionScore = globalSettings.scoreHitCentipede;
            }

            if (collisionScore) {
                gameStateService.incrementScore(collisionScore);
                scoreMarkerService.create(x, y, collisionScore);
            }

            return collisionScore > 0;
        };

        return {
            createNewBullet: function(x, y) {
                if (bullets.length >= globalSettings.maxBulletsOnScreen) {
                    return;
                }

                var bullet = {
                    x: x,
                    y: y,
                    bulletState: characterState.active,
                    animationDeadCount: 0
                };

                if (checkCollision(x, y)) {
                    bullet.bulletState = characterState.dead;
                }

                bullets.push(bullet);
            },

            destroy: function() {
                bullets = [];
            },

            update: function() {
                var aliveBullets = [];

                for (var i = 0; i < bullets.length; i++) {
                    var bullet = bullets[i];

                    moveBullet(bullet);

                    if (isAlive(bullet)) {
                        aliveBullets.push(bullet);
                    }
                }

                bullets = aliveBullets;
            },

            draw: function() {
                for (var i = 0; i < bullets.length; i++) {
                    var bullet = bullets[i];
                    graphicsEngineService.drawImage(
                        coordinateSystem.world,
                        bullet.x,
                        bullet.y,
                        bullet.bulletState === characterState.active ? sprite.bullet : sprite.explosion);
                }
            }
        }
    }]);