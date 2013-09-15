"use strict";
gameApp.factory('GameEngine', function(GraphicsEngine, GameBoard, GlobalSettings, KeyPressHandler, Utils, GameState) {
    return {
        initialise: function(canvas, graphicsFile) {
            GraphicsEngine.initialise(canvas, graphicsFile);

            this.canvas = canvas;

            this.livesAnimationCount = 0;
            this.centipedeUpperBoundary = (GlobalSettings.gameBoardHeight - GlobalSettings.playerAreaHeight) + 1;

            this.resetBoard();
            this.createPlayer();
            this.initialiseLevel();
        },

        resetBoard: function() {
            GameBoard.initialise();
            this.centipedes = [];
            this.scoreMarkers = [];
            this.flea = null;
            this.spider = null;
            this.snail = null;
        },

        createPlayer: function() {
            var me = this;

            this.player = new Player(
                Math.floor(GlobalSettings.gameBoardWidth / 2),
                GlobalSettings.gameBoardHeight - 1,
                GlobalSettings.delayAfterDeathBeforePlayerRegeneration,
                function(x, y) { me.fireBullet(x, y)});
        },

        initialiseLevel: function() {
            var me = this;

            this.bullets = [];

            this.centipedes.push(new Centipede(
                Math.floor(GlobalSettings.gameBoardWidth / 2),
                0,
                10,
                this.centipedeUpperBoundary,
                GlobalSettings.gameBoardHeight - 1,
                0,
                GlobalSettings.gameBoardWidth - 1,
                GlobalSettings.centipedeFramesPerMoveNormalSpeed,
                DirectionEnum.Down,
                DirectionEnum.Right,
                false,
                this.gameBoardCollisionCheck,
                function(centipede) { me.generateNewCentipede(centipede)}
            ));

            for (var i = 1; i < GameState.currentLevel() && i < GlobalSettings.maxCentipedes; i++)
            {
                this.centipedes.push(new Centipede(
                    (i * 2) - 1,
                    1,
                    0,
                    this.centipedeUpperBoundary,
                    GlobalSettings.gameBoardHeight - 1,
                    0,
                    GlobalSettings.gameBoardWidth - 1,
                    GameState.isCurrentLevelHighSpeed() ? GlobalSettings.centipedeFramesPerMoveHighSpeed: GlobalSettings.centipedeFramesPerMoveNormalSpeed,
                    DirectionEnum.Down,
                    DirectionEnum.Right,
                    false,
                    this.gameBoardCollisionCheck,
                    function(centipede) { me.generateNewCentipede(centipede)}
                    ));
            }
        },

        update: function(animation) {
            if (this.shouldPlayerRegenerate()) {
                this.resetAfterPlayerRegeneration();
                return;
            }

            this.checkLevelJustCompleted();

            if (GameState.isCurrentlyInLevelTransition()) {
                this.checkLevelTransitionComplete();
            } else {
                this.moveBullets();
                this.moveFlea(animation);
                this.moveSpider(animation);
                this.moveSnail(animation);
                this.moveCentipedes(animation);
                this.movePlayer(animation);
                this.moveScoreMarkers(animation);

                if (animation == 0) {
                    this.checkCreateFlea();
                    this.checkCreateSpider();
                    this.checkCreateSnail();
                }

                this.checkPlayerCollision();
            }

            this.blankScreen();
            this.drawScoreBoard(animation);
            this.drawBoard();
            this.drawPlayer(animation);
            this.drawFlea(animation);
            this.drawSpider(animation);
            this.drawSnail(animation);
            this.drawCentipedes(animation);
            this.drawBullets();
            this.drawScoreMarkers();
            this.drawGameState();
        },

        checkLevelTransitionComplete: function() {
            if (GameState.hasLevelTransitionResetAllLines()) {
                this.initialiseLevel();
                GameState.completeLevelTransition();
            }
        },

        checkLevelJustCompleted: function() {
            if (this.player.isAlive() && !GameState.isCurrentlyInLevelTransition() && this.centipedes.length === 0) {
                GameState.startLevelTransition();
                this.player.regenerate();
                this.bullets = [];
                this.spider = null;
                this.flea = null;
                this.snail = null;
            }
        },

        resetAfterPlayerRegeneration: function() {
            if (GameState.isGameOver()) {
                GameState.reset();
            }
            this.resetBoard();
            this.player.regenerate();
            this.initialiseLevel();
        },

        checkPlayerCollision: function() {
            if (this.player.playerState != CharacterStateEnum.Active) {
                return;
            }

            var playerDead = false;

            if (this.spider && this.spider.checkCollision(this.player.x, this.player.y)) {
                playerDead = true;
            } else if (this.flea && this.flea.checkCollision(this.player.x, this.player.y)) {
                playerDead = true;
            } else {
                for (var i = 0; i < this.centipedes.length; i++) {
                    if (this.centipedes[i].checkCollision(this.player.x, this.player.y, false)) {
                        playerDead = true;
                        break;
                    }
                }
            }

            if (playerDead) {
                this.player.die();
                GameState.die();
            }
        },

        fireBullet: function(x, y) {
            if (this.bullets.length >= GlobalSettings.maxBulletsOnScreen) {
                return;
            }

            var me = this;
            this.bullets.push(new Bullet(x, y, GlobalSettings.delayAfterDeathBeforeBulletDispose, function(x, y) { return me.checkBulletCollision(x, y)}));
        },

        checkBulletCollision: function(x, y) {
            // we can only hit one thing.  If two things share the same space then only one gets destroyed.
            // First thing destroyed is a mushroom - therefore if a centipede is falling straight down then it will
            // still get nearer the bottom
            var collisionScore = 0;

            var mushroomHit = GameBoard.checkCollision(x, y, true);

            switch (mushroomHit) {
                case BoardLocationEnum.Mushroom:
                    collisionScore = GlobalSettings.scoreHitMushroom;
                    break;

                case BoardLocationEnum.PoisonMushroom:
                    collisionScore = GlobalSettings.scoreHitPoisonMushroom;
                    break;
            }

            if (!collisionScore && this.flea && this.flea.checkCollision(x, y)) {
                this.flea = null;
                collisionScore = GlobalSettings.scoreHitFlea;
            }

            if (!collisionScore && this.spider && this.spider.checkCollision(x, y)) {
                this.spider = null;
                collisionScore = GlobalSettings.scoreHitSpider;
            }

            if (!collisionScore && this.snail && this.snail.checkCollision(x, y)) {
                this.snail = null;
                collisionScore = GlobalSettings.scoreHitSnail;
            }

            if (!collisionScore) {
                for (var i = 0; i < this.centipedes.length; i++) {
                    if (this.centipedes[i].checkCollision(x, y, true)) {
                        GameBoard.createMushroom(x, y);
                        collisionScore = GlobalSettings.scoreHitCentipede;
                        break;
                    }
                }
            }

            if (collisionScore) {
                this.incrementScore(x, y, collisionScore);
            }

            return collisionScore;
        },

        incrementScore: function(x, y, increment) {
            GameState.incrementScore(increment);
            this.scoreMarkers.push(new ScoreMarker(x, y, increment));
        },

        blankScreen: function() {
            GraphicsEngine.blankScreen();
        },

        drawGameState: function() {
            if (GameState.isGameOver()) {
                GraphicsEngine.drawText(
                    GlobalSettings.gameOverXPosition,
                    GlobalSettings.gameOverYPosition,
                    "Game Over",
                    GlobalSettings.gameOverFontColour,
                    GlobalSettings.gameOverFont);
            }
        },

        drawScoreBoard: function(animation) {
            if (animation == 0) {
                this.livesAnimationCount++;

                if (this.livesAnimationCount == 9) {
                    this.livesAnimationCount = 0;
                }
            }

            var animationOffset = this.livesAnimationCount;
            if (this.livesAnimationCount > 4) {
                animationOffset = 9 - this.livesAnimationCount;
            }

            GraphicsEngine.drawText(
                GlobalSettings.scoreBoardLivesXPositionText,
                GlobalSettings.scoreBoardTitleYPosition,
                "Lives",
                GlobalSettings.scoreBoardTitleFontColour,
                GlobalSettings.scoreBoardFont);

            GraphicsEngine.drawText(
                GlobalSettings.scoreBoardScoreXPosition,
                GlobalSettings.scoreBoardTitleYPosition,
                "Score",
                GlobalSettings.scoreBoardTitleFontColour,
                GlobalSettings.scoreBoardFont);

            GraphicsEngine.drawText(
                GlobalSettings.scoreBoardLevelXPosition,
                GlobalSettings.scoreBoardTitleYPosition,
                "Level",
                GlobalSettings.scoreBoardTitleFontColour,
                GlobalSettings.scoreBoardFont);

            GraphicsEngine.drawText(
                GlobalSettings.scoreBoardHighScoreXPosition,
                GlobalSettings.scoreBoardTitleYPosition,
                "High",
                GlobalSettings.scoreBoardTitleFontColour,
                GlobalSettings.scoreBoardFont);

            GraphicsEngine.drawText(
                GlobalSettings.scoreBoardScoreXPosition,
                GlobalSettings.scoreBoardContentYPosition,
                GameState.score,
                GlobalSettings.scoreBoardContentFontColour,
                GlobalSettings.scoreBoardFont);

            GraphicsEngine.drawText(
                GlobalSettings.scoreBoardLevelXPosition,
                GlobalSettings.scoreBoardContentYPosition,
                GameState.level,
                GlobalSettings.scoreBoardContentFontColour,
                GlobalSettings.scoreBoardFont);

            GraphicsEngine.drawText(
                GlobalSettings.scoreBoardHighScoreXPosition,
                GlobalSettings.scoreBoardContentYPosition,
                GameState.highScore,
                GlobalSettings.scoreBoardContentFontColour,
                GlobalSettings.scoreBoardFont);

            for (var i = 0; i < GameState.lives; i++) {
                GraphicsEngine.drawImage(
                    GlobalSettings.scoreBoardLivesXPositionImage + (GlobalSettings.scoreBoardLivesOffset * i) + (animationOffset * 4),
                    GlobalSettings.scoreBoardLivesYPosition,
                    SpriteEnum.PlayerWalkRight1 + this.livesAnimationCount);
            }
        },

        drawBoard: function() {
            GameBoard.draw();
        },

        drawPlayer: function(animation) {
            var playerData = this.player.calculateAnimation(animation);
            GraphicsEngine.drawImage(
                GraphicsEngine.convertGameXCoordinateToPixels(playerData.x),
                GraphicsEngine.convertGameYCoordinateToPixels(playerData.y),
                playerData.image);
        },

        drawScoreMarkers: function() {
            for (var i = 0; i < this.scoreMarkers.length; i++) {
                var scoreMarkerData = this.scoreMarkers[i].calculateAnimation();
                GraphicsEngine.drawText(
                    GraphicsEngine.convertGameXCoordinateToPixels(scoreMarkerData.x),
                    GraphicsEngine.convertGameYCoordinateToPixels(scoreMarkerData.y),
                    scoreMarkerData.text,
                    scoreMarkerData.colour,
                    GlobalSettings.scoreMarkerFont);
            }
        },

        drawBullets: function() {
            for (var i = 0; i < this.bullets.length; i++) {
                var bulletData = this.bullets[i].calculateAnimation();
                GraphicsEngine.drawImage(
                    GraphicsEngine.convertGameXCoordinateToPixels(bulletData.x),
                    GraphicsEngine.convertGameYCoordinateToPixels(bulletData.y),
                    bulletData.image);
            }
        },

        drawCentipedes: function(animation) {
            for (var i in this.centipedes) {
                var centipedeData = this.centipedes[i].calculateAnimation(animation);

                for (var c in centipedeData) {
                    GraphicsEngine.drawImage(
                        GraphicsEngine.convertGameXCoordinateToPixels(centipedeData[c].x),
                        GraphicsEngine.convertGameYCoordinateToPixels(centipedeData[c].y),
                        centipedeData[c].image);
                }
            }
        },

        drawFlea: function(animation) {
            if (this.flea) {
                var fleaData = this.flea.calculateAnimation(animation);
                GraphicsEngine.drawImage(
                    GraphicsEngine.convertGameXCoordinateToPixels(fleaData.x),
                    GraphicsEngine.convertGameYCoordinateToPixels(fleaData.y),
                    fleaData.image);
            }
        },

        drawSpider: function(animation) {
            if (this.spider) {
                var spiderData = this.spider.calculateAnimation(animation);
                GraphicsEngine.drawImage(
                    GraphicsEngine.convertGameXCoordinateToPixels(spiderData[0].x),
                    GraphicsEngine.convertGameYCoordinateToPixels(spiderData[0].y),
                    spiderData[0].image);
                GraphicsEngine.drawImage(
                    GraphicsEngine.convertGameXCoordinateToPixels(spiderData[1].x),
                    GraphicsEngine.convertGameYCoordinateToPixels(spiderData[1].y),
                    spiderData[1].image);
            }
        },

        drawSnail: function(animation) {
            if (this.snail) {
                var snailData = this.snail.calculateAnimation(animation);
                GraphicsEngine.drawImage(
                    GraphicsEngine.convertGameXCoordinateToPixels(snailData[0].x),
                    GraphicsEngine.convertGameYCoordinateToPixels(snailData[0].y),
                    snailData[0].image);
                GraphicsEngine.drawImage(
                    GraphicsEngine.convertGameXCoordinateToPixels(snailData[1].x),
                    GraphicsEngine.convertGameYCoordinateToPixels(snailData[1].y),
                    snailData[1].image);
            }
        },

        movePlayer: function(animation) {
            if (animation % 2 !== 0) {
                return;
            }

            var playerMove = KeyPressHandler.getNextMovement();

            if (playerMove.direction != DirectionEnum.None && !GameBoard.playerAllowedToMove(this.player.x, this.player.y, playerMove.direction)) {
                playerMove.direction = DirectionEnum.None;
            }

            this.firePressed = playerMove.isFiring;

            this.player.move(playerMove.direction, playerMove.isFiring);
        },

        moveScoreMarkers: function(animation) {
            if (this.scoreMarkers.length === 0){
                return;
            }

            for (var i = this.scoreMarkers.length - 1; i >= 0 ; i--) {
                var score = this.scoreMarkers[i];
                if (score.characterState === CharacterStateEnum.Dead) {
                    this.scoreMarkers.splice(i, 1);
                } else {
                    score.move(animation);
                }
            }
        },

        moveCentipedes: function(animation) {
            for (var i = this.centipedes.length - 1; i >= 0; i--) {
                var centipede = this.centipedes[i];
                if (centipede.characterState === CharacterStateEnum.Dead) {
                    this.centipedes.splice(i, 1);
                    continue;
                }
                this.centipedes[i].move(animation);
            }

            // now check if we should add a new centipede in
            if (this.centipedes.length > 0 && animation === 0) {
                var firstCentipede = this.centipedes[0];
                if (firstCentipede.y === GlobalSettings.gameBoardHeight - 1 &&
                    (firstCentipede.x === GlobalSettings.gameBoardWidth - 1 || firstCentipede.x === 0)) {

                    var lastCentipede = this.centipedes[this.centipedes.length - 1];

                    if (lastCentipede.x !== 0 || lastCentipede.y !== this.centipedeUpperBoundary) {

                        var me = this;

                        this.centipedes.push(new Centipede(
                            -1, // start just off the screen as we will immediately move forward.
                            this.centipedeUpperBoundary,
                            0,
                            this.centipedeUpperBoundary,
                            GlobalSettings.gameBoardHeight - 1,
                            0,
                            GlobalSettings.gameBoardWidth - 1,
                            GlobalSettings.centipedeFramesPerMoveHighSpeed,
                            DirectionEnum.Down,
                            DirectionEnum.Right,
                            false,
                            this.gameBoardCollisionCheck,
                            function(centipede) { me.generateNewCentipede(centipede)}
                        ));
                    }
                }
            }
        },

        moveBullets: function() {
            for (var i = this.bullets.length - 1; i >= 0; i--) {
                var bullet = this.bullets[i];

                if (bullet.shouldDispose()) {
                    this.bullets.splice(i, 1);
                } else {
                    bullet.move();
                }
            }
        },

        moveSpider: function(animation) {
            if (this.spider) {
                if (this.spider.x < -1 || this.spider.x >= GlobalSettings.gameBoardWidth) {
                    this.spider = null;
                } else {
                    this.spider.move(animation);
                }
            }
        },

        moveSnail: function(animation) {
            if (this.snail) {
                if (this.snail.x >= GlobalSettings.gameBoardWidth) {
                    this.snail = null;
                } else {
                    this.snail.move(animation);
                }
            }
        },

        moveFlea: function(animation) {
            if (this.flea) {
                if (this.flea.y >= GlobalSettings.gameBoardHeight) {
                    this.flea = null;
                } else {
                    this.flea.move(animation);
                }
            }
        },

        checkCreateSnail: function() {
            if (this.snail) {
                return;
            }

            if (Utils.random(GlobalSettings.snailCreationChance) === 0) {
                var y = Utils.random(GlobalSettings.gameBoardHeight - GlobalSettings.playerAreaHeight);

                this.snail = new Snail(y, this.onSnailMoved);
            }
        },

        checkCreateSpider: function() {
            if (this.spider) {
                return;
            }

            if (Utils.random(GlobalSettings.spiderCreationChance) === 0) {
                var x = this.player.x > (GlobalSettings.gameBoardWidth / 2) ? 0 : GlobalSettings.gameBoardWidth - 1;
                var y = (GlobalSettings.gameBoardHeight - GlobalSettings.playerAreaHeight) + Utils.random(GlobalSettings.playerAreaHeight);

                this.spider = new Spider(x, y, GlobalSettings.gameBoardHeight -1, (GlobalSettings.gameBoardHeight - GlobalSettings.playerAreaHeight) + 1, this.onSpiderMoved);
            }
        },

        checkCreateFlea: function() {
            if (this.flea) {
                return;
            }

            if (GameBoard.mushroomsInPlayerArea > GlobalSettings.minMushroomsInPlayerAreaBeforeFleaCreated &&
                GameBoard.mushroomsOnScreen > GlobalSettings.minMushroomsBeforeFleaCreated) {
                return;
            }

            if (GameBoard.mushroomsOnScreen < GlobalSettings.maxMushroomsAllowed &&
                (GameBoard.mushroomsOnScreen < GlobalSettings.minMushroomsBeforeFleaCreated || Utils.random(GlobalSettings.fleaCreationChance) === 0)) {
                var x = Utils.random(GlobalSettings.gameBoardWidth);
                this.flea = new Flea(x, this.onFleaMoved);
            }
        },

        gameBoardCollisionCheck: function(x, y) {
            return GameBoard.checkCollision(x, y, false);
        },

        generateNewCentipede: function(newCentipede) {
            this.centipedes.push(newCentipede);
        },

        onFleaMoved: function(x, prevY) {
            if (prevY < GlobalSettings.gameBoardHeight - 1) {
                // Not allowed to put a mushroom on the bottom row
                if (Math.floor(Math.random() * 3) === 0) {
                    GameBoard.createMushroom(x, prevY);
                }
            }
        },

        onSpiderMoved: function(prevX, prevY, x, y) {
            if (x >= 0 && x < GlobalSettings.gameBoardWidth) {
                GameBoard.destroyMushroom(x, y);

                if (x >= 0 && x < GlobalSettings.gameBoardWidth - 1) {
                    GameBoard.destroyMushroom(x + 1, y);
                }
            }
        },

        onSnailMoved: function(prevX, x, y) {
            if (x < GlobalSettings.gameBoardWidth) {
                GameBoard.poisonMushroom(x, y);
            }
        },

        shouldPlayerRegenerate: function() {
            return this.firePressed && this.player.shouldRegenerate();
        }
    }
});
