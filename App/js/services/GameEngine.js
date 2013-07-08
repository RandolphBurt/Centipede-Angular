"use strict";


gameApp.factory('GameEngine', function(GraphicsEngine, GameBoard, GlobalSettings) {
    return {
        initialise: function(canvas, graphicsFile, gameBoardSize) {
            GraphicsEngine.initialise(canvas, graphicsFile, gameBoardSize.scale);
            GameBoard.initialise(gameBoardSize.width, gameBoardSize.height);

            this.canvasWidth = gameBoardSize.width * gameBoardSize.scale * GlobalSettings.spriteSize;
            this.canvasHeight = gameBoardSize.height * gameBoardSize.scale * GlobalSettings.spriteSize;
            this.canvas = canvas;

            this.player = new Player(Math.floor(gameBoardSize.width / 2), gameBoardSize.height - 1);


            this.animation = 0;
        },

        update: function(currentKeyPress){
            this.animation++;

            if (this.animation == 4) {
                this.animation = 0;
            }

            if (this.animation == 0) {
                var playerMove = ParseKeyPress(currentKeyPress);
                this.player.move(playerMove.direction, playerMove.isFiring);
            }

            this.canvas.fillStyle = 'black';
            this.canvas.fillRect(0 ,0,  this.canvasWidth, this.canvasHeight);
            GameBoard.draw();

            var playerData = this.player.calculateAnimation(this.animation);

            GraphicsEngine.drawImage(playerData.x, playerData.y, playerData.image);
        }
    }

    function ParseKeyPress (currentKeyPress) {
        var direction = DirectionEnum.None;

        switch (currentKeyPress) {
            case 37: //left
                direction = DirectionEnum.Left;
                break;

            case 38: //up
                direction = DirectionEnum.Up;
                break;

            case 39: //right
                direction = DirectionEnum.Right;
                break;

            case 40: //down
                direction = DirectionEnum.Down;
                break;

            case 32: //space
        }

        return {
            direction: direction,
            isFiring: false
        }
    }
});
