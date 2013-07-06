'use strict';

function GameEngine(canvas, spriteSheetFile) {
    this.canvasContext = canvas.getContext("2d");
    this.gameTimer = 0;
    this.currentColour = 0;

    this.spriteSheet = new Image();
    this.spriteSheet. src ='img/graphics.png';
};

GameEngine.prototype.colors = ["#FF0000", "#00FF00", "#0000FF"];

GameEngine.prototype.update = function(currentKeyPress) {
    this.gameTimer++;

    if (currentKeyPress === 37) {
        this.currentColour++;
        if (this.currentColour == 3) {
            this.currentColour = 0;
        }
    }

    if (this.gameTimer % 8 === 0){
        console.log(new Date().getTime() / 1000);
    }

    this.canvasContext.fillStyle=this.colors[this.currentColour];
    this.canvasContext.fillRect(0,0,150,75);
    this.canvasContext.drawImage(this.spriteSheet, 0, 0, 20, 20, 100, 100, 20,20);
};