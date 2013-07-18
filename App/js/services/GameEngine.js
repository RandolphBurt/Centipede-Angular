"use strict";


gameApp.factory('GameEngine', function(GraphicsEngine, GameBoard, GlobalSettings, KeyPressHandler, Utils) {
    return {
        // TODO:
        centipedeFramesPerMove: 2,

        initialise: function(canvas, graphicsFile, gameBoardSize) {
            GraphicsEngine.initialise(canvas, graphicsFile, gameBoardSize.scale);
            GameBoard.initialise(gameBoardSize.width, gameBoardSize.height);

            this.canvasWidth = gameBoardSize.width * gameBoardSize.scale * GlobalSettings.spriteSize;
            this.canvasHeight = gameBoardSize.height * gameBoardSize.scale * GlobalSettings.spriteSize;
            this.canvas = canvas;

            this.player = new Player(Math.floor(gameBoardSize.width / 2), gameBoardSize.height - 1);

            this.centipedes = [];
            this.centipedes.push(new Centipede(
                Math.floor(gameBoardSize.width / 2),
                0,
                10,
                (gameBoardSize.height - GlobalSettings.playerAreaHeight) + 1,
                gameBoardSize.height - 1,
                0,
                gameBoardSize.width - 1,
                this.centipedeFramesPerMove));
        },

        update: function(animation) {
            this.moveFlea(animation);
            this.moveSpider(animation);
            this.moveSnail(animation);
            this.moveCentipedes(animation);
            this.movePlayer(animation);

            if (animation == 0) {
                this.checkCreateFlea();
                this.checkCreateSpider();
                this.checkCreateSnail();
            }

            this.drawBoard();
            this.drawPlayer(animation);
            this.drawFlea(animation);
            this.drawSpider(animation);
            this.drawSnail(animation);
            this.drawCentipedes(animation);
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

        drawCentipedes: function(animation) {
            for (var i in this.centipedes) {
                var centipedeData = this.centipedes[i].calculateAnimation(animation);

                for (var c in centipedeData) {
                    GraphicsEngine.drawImage(centipedeData[c].x, centipedeData[c].y, centipedeData[c].image);
                }
            }
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

        drawSnail: function(animation) {
            if (this.snail) {
                var snailData = this.snail.calculateAnimation(animation);
                GraphicsEngine.drawImage(snailData[0].x, snailData[0].y, snailData[0].image);
                GraphicsEngine.drawImage(snailData[1].x, snailData[1].y, snailData[1].image);
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

        moveCentipedes: function(animation) {
            for (var i in this.centipedes)
            {
                this.centipedes[i].move(animation, this.centipedeFramesPerMove);
            }
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

        moveSnail: function(animation) {
            if (this.snail) {
                if (this.snail.x >= GameBoard.width) {
                    this.snail = null;
                } else {
                    this.snail.move(animation);
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

        checkCreateSnail: function() {
            if (this.snail !== undefined && this.snail !== null) {
                return;
            }

            if (Utils.random(GlobalSettings.snailCreationChance) === 0) {
                var y = Utils.random(GameBoard.height - GlobalSettings.playerAreaHeight);

                this.snail = new Snail(y, this.onSnailMoved);
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
        },

        onSnailMoved: function(prevX, x, y) {
            if (x < GameBoard.width) {
                GameBoard.poisonMushroom(x, y);
            }
        }
    }
});
