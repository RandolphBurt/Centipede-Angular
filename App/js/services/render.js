angular.module("gameApp")
    .factory("renderService", ["graphicsEngineService", "gameBoardService", "globalSettings", "gameStateService", "sprite", "scoreMarkerService", "spiderService", "fleaService", "snailService", "centipedeService", "bulletService", "playerService", "coordinateSystem",
        function(graphicsEngineService, gameBoardService, globalSettings, gameStateService, sprite, scoreMarkerService, spiderService, fleaService, snailService, centipedeService, bulletService, playerService, coordinateSystem) {
            "use strict";

            var livesAnimationCount = 0;

            function blankScreen() {
                graphicsEngineService.blankScreen();
            }

            function drawBoard() {
                gameBoardService.draw();
            }

            function drawGameStateService() {
                if (gameStateService.isGameOver()) {
                    graphicsEngineService.drawText(
                        coordinateSystem.screen,
                        globalSettings.gameOverXPosition,
                        globalSettings.gameOverYPosition,
                        "Game Over",
                        globalSettings.gameOverFontColour,
                        globalSettings.gameOverFont);
                }
            }

            function drawScoreBoard(animation) {
                if (animation == 0) {
                    livesAnimationCount++;

                    if (livesAnimationCount == 9) {
                        livesAnimationCount = 0;
                    }
                }

                var animationOffset = livesAnimationCount;
                if (livesAnimationCount > 4) {
                    animationOffset = 9 - livesAnimationCount;
                }

                graphicsEngineService.drawText(
                    coordinateSystem.screen,
                    globalSettings.scoreBoardLivesXPositionText,
                    globalSettings.scoreBoardTitleYPosition,
                    "Lives",
                    globalSettings.scoreBoardTitleFontColour,
                    globalSettings.scoreBoardFont);

                graphicsEngineService.drawText(
                    coordinateSystem.screen,
                    globalSettings.scoreBoardScoreXPosition,
                    globalSettings.scoreBoardTitleYPosition,
                    "Score",
                    globalSettings.scoreBoardTitleFontColour,
                    globalSettings.scoreBoardFont);

                graphicsEngineService.drawText(
                    coordinateSystem.screen,
                    globalSettings.scoreBoardLevelXPosition,
                    globalSettings.scoreBoardTitleYPosition,
                    "Level",
                    globalSettings.scoreBoardTitleFontColour,
                    globalSettings.scoreBoardFont);

                graphicsEngineService.drawText(
                    coordinateSystem.screen,
                    globalSettings.scoreBoardHighScoreXPosition,
                    globalSettings.scoreBoardTitleYPosition,
                    "High",
                    globalSettings.scoreBoardTitleFontColour,
                    globalSettings.scoreBoardFont);

                graphicsEngineService.drawText(
                    coordinateSystem.screen,
                    globalSettings.scoreBoardScoreXPosition,
                    globalSettings.scoreBoardContentYPosition,
                    gameStateService.score,
                    globalSettings.scoreBoardContentFontColour,
                    globalSettings.scoreBoardFont);

                graphicsEngineService.drawText(
                    coordinateSystem.screen,
                    globalSettings.scoreBoardLevelXPosition,
                    globalSettings.scoreBoardContentYPosition,
                    gameStateService.level,
                    globalSettings.scoreBoardContentFontColour,
                    globalSettings.scoreBoardFont);

                graphicsEngineService.drawText(
                    coordinateSystem.screen,
                    globalSettings.scoreBoardHighScoreXPosition,
                    globalSettings.scoreBoardContentYPosition,
                    gameStateService.highScore,
                    globalSettings.scoreBoardContentFontColour,
                    globalSettings.scoreBoardFont);

                for (var i = 0; i < gameStateService.lives; i++) {
                    graphicsEngineService.drawImage(
                        coordinateSystem.screen,
                        globalSettings.scoreBoardLivesXPositionImage + (globalSettings.scoreBoardLivesOffset * i) + (animationOffset * 4),
                        globalSettings.scoreBoardLivesYPosition,
                        sprite.playerWalkRight1 + livesAnimationCount);
                }
            }

            return {
                draw: function(animation) {
                    blankScreen();
                    drawScoreBoard(animation);
                    drawBoard();
                    playerService.draw(animation);
                    fleaService.draw(animation);
                    spiderService.draw(animation);
                    snailService.draw(animation);
                    centipedeService.draw(animation);
                    bulletService.draw(animation);
                    scoreMarkerService.draw(animation);
                    drawGameStateService();
                }
            }
        }]);
