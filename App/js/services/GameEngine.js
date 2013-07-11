"use strict";


gameApp.factory('GameEngine', function(GraphicsEngine, GameBoard, GlobalSettings, KeyPressHandler) {
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
            if (animation == 0) {
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
        }
    }
});
