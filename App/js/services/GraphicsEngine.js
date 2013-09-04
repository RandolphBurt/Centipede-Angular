gameApp.factory('GraphicsEngine', function(GlobalSettings) {
    return {
        initialise: function(canvasContext, graphicsFile) {
            this.spriteWidth = GlobalSettings.spriteSize;
            this.spriteHeight = GlobalSettings.spriteSize;
            this.canvas = canvasContext;
            this.spriteSheet = new Image();
            this.spriteSheet.src = graphicsFile;
        },

        convertGameXCoordinateToPixels: function(x) {
            return x * GlobalSettings.spriteSize;
        },

        convertGameYCoordinateToPixels: function(y) {
            return (y * GlobalSettings.spriteSize) + GlobalSettings.scoreBoardArea;
        },

        blankScreen: function() {
            this.canvas.fillStyle = GlobalSettings.gameBoardBackgroundColour;
            this.canvas.fillRect(0, 0, GlobalSettings.gameBoardWidth * this.spriteWidth, GlobalSettings.scoreBoardArea + (GlobalSettings.gameBoardHeight * this.spriteHeight));
        },

        drawText: function(x, y, text, colour, font) {
            this.canvas.fillStyle = colour;
            this.canvas.font = font;
            this.canvas.fillText(text, x, y)
        },

        drawImage: function(x, y, image) {
            this.canvas.drawImage(
                this.spriteSheet,
                this.spriteWidth * (image % GlobalSettings.spriteSheetWidth),
                this.spriteHeight * Math.floor(image / GlobalSettings.spriteSheetWidth),
                this.spriteWidth,
                this.spriteHeight,
                x,
                y,
                this.spriteWidth,
                this.spriteHeight);
        }
    }
});