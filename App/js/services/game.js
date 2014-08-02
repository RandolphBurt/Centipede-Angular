angular.module("gameApp")
    .factory("gameService", ["graphicsEngineService", "gameBoardService", "globalSettings", "utilsService", "gameStateService", "boardLocation", "characterState", "characterDirection", "sprite", "scoreMarkerService", "spiderService", "fleaService", "snailService", "centipedeService", "bulletService", "playerService", "gameState", "keyPressHandlerService",
        function(graphicsEngineService, gameBoardService, globalSettings, utilsService, gameStateService, boardLocation, characterState, characterDirection, sprite, scoreMarkerService, spiderService, fleaService, snailService, centipedeService, bulletService, playerService, gameState, keyPressHandlerService) {
        "use strict";

            function resetBoard() {
                snailService.destroy();
                fleaService.destroy();
                spiderService.destroy();
                centipedeService.destroy();
                gameBoardService.initialise();
            }

            function initialiseLevel() {
                centipedeService.create(
                    Math.floor(globalSettings.gameBoardWidth / 2),
                    0,
                    globalSettings.centipedeMinimumLength + gameStateService.currentLevel(),
                    globalSettings.centipedeFramesPerMoveNormalSpeed,
                    characterDirection.down,
                    characterDirection.right,
                    false);

                for (var i = 1; i < gameStateService.currentLevel() && i < globalSettings.maxCentipedes; i++)
                {
                    centipedeService.create(
                        (i * 2) - 1,
                        1,
                        0,
                        gameStateService.isCurrentLevelHighSpeed() ? globalSettings.centipedeFramesPerMoveHighSpeed: globalSettings.centipedeFramesPerMoveNormalSpeed,
                        characterDirection.down,
                        characterDirection.right,
                        false);
                }
            }

            function movePlayer(animation) {
                playerService.update(animation);

                if (animation % 2 === 0 && playerService.isAlive() && playerService.isFiring()) {
                    var playerPosition = playerService.getPreviousPosition();
                    bulletService.createNewBullet(playerPosition.x, playerPosition.y - 1);
                }
            }

            function checkGenerateNewCentipede() {
                if (centipedeService.isFirstCentipedeAtEndOfScreen() && !centipedeService.isCentipedeAtPlayerTopBoundary()) {
                    centipedeService.create(
                        -1, // start just off the screen as we will immediately move forward.
                        (globalSettings.gameBoardHeight - globalSettings.playerAreaHeight) + 1,
                        0,
                        globalSettings.centipedeFramesPerMoveHighSpeed,
                        characterDirection.down,
                        characterDirection.right,
                        false);
                }
            }

            function moveCharacters(animation) {
                bulletService.update(animation);
                fleaService.update(animation);
                spiderService.update(animation);
                snailService.update(animation);
                centipedeService.update(animation);
                movePlayer(animation);
                scoreMarkerService.update(animation);

                if (animation == 0) {
                    fleaService.checkCreateFlea();
                    spiderService.checkCreateSpider();
                    snailService.checkCreateSnail();
                    checkGenerateNewCentipede();
                }

                checkPlayerCollision();
            }

            function checkPlayerCollision() {
                if (!playerService.isAlive()) {
                    return;
                }

                var playerPosition = playerService.getPosition();

                 if (spiderService.checkCollision(playerPosition.x, playerPosition.y) ||
                    fleaService.checkCollision(playerPosition.x, playerPosition.y) ||
                    centipedeService.checkCollision(playerPosition.x, playerPosition.y, false)) {

                    playerService.die();
                    gameStateService.die();
                 }
            }

            function resetAfterPlayerRegeneration() {
                if (gameStateService.isGameOver()) {
                    gameStateService.reset();
                }
                resetBoard();
                playerService.regenerate(true);
                gameStateService.playerRegenerate();
                initialiseLevel();
            }

            function levelTransitionUpdate() {
                if (gameStateService.hasLevelTransitionResetAllLines()) {
                    initialiseLevel();
                    gameStateService.completeLevelTransition();
                }
            }

            function activeGameUpdate(animation) {
                if (!centipedeService.anyAlive()) {
                    gameStateService.startLevelTransition();
                    playerService.regenerate(false);
                    bulletService.destroy();
                    spiderService.destroy();
                    fleaService.destroy();
                    snailService.destroy();
                } else {
                    moveCharacters(animation);
                }
            }

            function playerDeathTransitionUpdate(animation) {
                var keyPress = keyPressHandlerService.getNextMovement();
                if (gameStateService.hasPlayerDeathTransitionComplete() && keyPress.isFiring) {
                    resetAfterPlayerRegeneration();
                } else {
                    moveCharacters(animation);
                }
            }

            function gameOverTransitionUpdate(animation) {
                var keyPress = keyPressHandlerService.getNextMovement();
                if (gameStateService.hasGameOverTransitionComplete() && keyPress.isFiring) {
                    resetAfterPlayerRegeneration();
                } else {
                    moveCharacters(animation);
                }
            }

            return {
                initialise: function() {
                    resetBoard();
                    playerService.createPlayer();
                    initialiseLevel();
                },

                update: function(animation) {
                    switch (gameStateService.gameState) {
                        case gameState.gameActive:
                            activeGameUpdate(animation);
                            break;

                        case gameState.playerDeathTransition:
                            playerDeathTransitionUpdate(animation);
                            break;

                        case gameState.levelTransition:
                            levelTransitionUpdate();
                            break;

                        case gameState.gameOver:
                            gameOverTransitionUpdate(animation);
                            break;
                    }
                }
            }
        }]);
