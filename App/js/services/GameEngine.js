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
            this.moveFlea(animation);
            this.moveSpider(animation);
            this.movePlayer(animation);

            if (animation == 0) {
                this.checkCreateFlea();
                this.checkCreateSpider();
            }

            this.drawBoard();
            this.drawPlayer(animation);
            this.drawFlea(animation);
            this.drawSpider(animation);
        },

        drawBoard: function() {
            this.canvas.fillStyle = 'black';
            this.canvas.fillRect(0 ,0,  this.canvasWidth, this.canvasHeight);
            GameBoard.draw();
        },

        drawPlayer: function(animation) {
            var playerData = this.player.calculateAnimation(animation);
            GraphicsEngine.drawImage(playerData.x, playerData.y, playerData.image);
        },

        drawFlea: function(animation) {
            if (this.flea) {
                var fleaData = this.flea.calculateAnimation(animation);
                GraphicsEngine.drawImage(fleaData.x, fleaData.y, fleaData.image);
            }
        },

        drawSpider: function(animation) {
            if (this.spider) {
                var spiderData = this.spider.calculateAnimation(animation);
                GraphicsEngine.drawImage(spiderData[0].x, spiderData[0].y, spiderData[0].image);
                GraphicsEngine.drawImage(spiderData[1].x, spiderData[1].y, spiderData[1].image);
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

            this.player.move(playerMove.direction, playerMove.isFiring);
        },

        moveSpider: function(animation) {
            if (this.spider) {
                if (this.spider.x < -1 || this.spider.x >= GameBoard.width) {
                    this.spider = null;
                } else {
                    this.spider.move(animation);
                }
            }
        },

        moveFlea: function(animation) {
            if (this.flea) {
                if (this.flea.y >= GameBoard.height) {
                    this.flea = null;
                } else {
                    this.flea.move(animation);
                }
            }
        },

        checkCreateSpider: function() {
            if (this.spider !== undefined && this.spider !== null) {
                return;
            }

            if (Utils.random(GlobalSettings.spiderCreationChance) === 0) {
                var x = this.player.x > (GameBoard.width / 2) ? 0 : GameBoard.width - 1;
                var y = (GameBoard.height - GlobalSettings.playerAreaHeight) + Utils.random(GlobalSettings.playerAreaHeight);

                this.spider = new Spider(x, y, GameBoard.height -1, (GameBoard.height - GlobalSettings.playerAreaHeight) + 1, this.onSpiderMoved);
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
                this.flea = new Flea(x, this.onFleaMoved);
            }
        },

        onFleaMoved: function(x, prevY) {
            if (prevY < GameBoard.height - 1) {
                // Not allowed to put a mushroom on the bottom row
                if (Math.floor(Math.random() * 3) === 0) {
                    GameBoard.createMushroom(x, prevY);
                }
            }
        },

        onSpiderMoved: function(prevX, prevY, x, y) {
            if (x >= 0 && x < GameBoard.width) {
                GameBoard.destroyMushroom(x, y);

                if (x >= 0 && x < GameBoard.width - 1) {
                    GameBoard.destroyMushroom(x + 1, y);
                }
            }
        }
    }
});
