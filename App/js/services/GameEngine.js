"use strict";


gameApp.factory('GameEngine', function(GraphicsEngine, GameBoard, GlobalSettings) {
    var GameStateEnum = {
        StartMove: 0,
        AnimateFrame1 : 1,
        AnimateFrame2 : 2,
        AnimateFrame3 : 3
    };

    return {
        initialise: function(canvas, graphicsFile, gameBoardSize) {
            GraphicsEngine.initialise(canvas, graphicsFile, gameBoardSize.scale);
            GameBoard.initialise(gameBoardSize.width, gameBoardSize.height);
            this.canvasWidth = gameBoardSize.width * gameBoardSize.scale * GlobalSettings.spriteSize;
            this.canvasHeight = gameBoardSize.height * gameBoardSize.scale * GlobalSettings.spriteSize;
            this.canvas = canvas;

            this.gameState = GameStateEnum.StartMove;
            this.gameTimer = 0;
            this.currentImage = 0;
        },

        update: function(currentKeyPress){
            this.gameTimer++;

            if (currentKeyPress === 37) {
                this.currentImage++;
                if (this.currentImage == 53) {
                    this.currentImage = 0;
                }
            }

            if (this.gameTimer % 8 === 0){
                console.log(new Date().getTime() / 1000);
            }

            this.canvas.fillStyle = 'black';
            this.canvas.fillRect(0 ,0,  this.canvasWidth, this.canvasHeight);
            GameBoard.draw();

            GraphicsEngine.drawImage(8, 5, this.currentImage);
        }
    }

});
