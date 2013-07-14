"use strict";


gameApp.factory('GameEngine', function(GraphicsEngine, GameBoard, GlobalSettings, KeyPressHandler, Utils) {
    return {
        initialise: function(canvas, graphicsFile, gameBoardSize) {
            GraphicsEngine.initialise(canvas, graphicsFile, gameBoardSize.scale);
            GameBoard.initialise(gameBoardSize.width, gameBoardSize.height);

            this.canvasWidth = gameBoardSize.width * gameBoardSize.scale * GlobalSettings.spriteSize;
            this.canvasHeight = gameBoardSize.height * gameBoardSize.scale * GlobalSettings.spriteSize;
            this.canvas = canvas;

            this.player = new Player(Math.floor(gameBoardSize.width / 2), gameBoardSize.height - 1);
        },

        update: function(animation) {
            if ((animation % 2) == 0) {
                if (this.flea) {
                    if (this.flea.y >= GameBoard.height) {
                        this.flea = null;
                    } else {
                        this.flea.move();
                    }
                }
            }

            if (animation == 0) {
                this.checkCreateFlea();

                var playerMove = KeyPressHandler.getNextMovement();

                if (playerMove.direction != DirectionEnum.None && !GameBoard.playerAllowedToMove(this.player.x, this.player.y, playerMove.direction)) {
                    playerMove.direction = DirectionEnum.None;
                }

                this.player.move(playerMove.direction, playerMove.isFiring);
            }

            this.canvas.fillStyle = 'black';
            this.canvas.fillRect(0 ,0,  this.canvasWidth, this.canvasHeight);
            GameBoard.draw();

            var playerData = this.player.calculateAnimation(animation);

            GraphicsEngine.drawImage(playerData.x, playerData.y, playerData.image);

            if (this.flea) {
                var fleaData = this.flea.calculateAnimation(animation);
                GraphicsEngine.drawImage(fleaData.x, fleaData.y, fleaData.image);
            }
        },

        checkCreateFlea: function() {
            if (this.flea !== undefined && this.flea !== null) {
                return;
            }

            if (GameBoard.mushroomsInPlayerArea > GlobalSettings.minMushroomsInPlayerAreaBeforeFleaCreated &&
                GameBoard.mushroomsOnScreen > GlobalSettings.minMushroomsBeforeFleaCreated) {
                return;
            }

            if (Utils.random(GlobalSettings.fleaCreationChance) === 0) {
                var x = Utils.random(GameBoard.width);
                this.flea = new Flea(x, this.fleaCreateMushroom);
            }
        },

        fleaCreateMushroom: function(x, y) {
            if (y < GameBoard.height - 1) {
                // Not allowed to put a mushroom on the bottom row
                GameBoard.createMushroom(x, y);
            }
        }
    }
});
