gameApp.factory('GraphicsEngine', function(GlobalSettings) {
    return {
        initialise: function(canvasContext, graphicsFile, scale) {
            this.spriteWidth = GlobalSettings.spriteSize;
            this.spriteHeight = 20;
            this.destinationWidth = this.spriteWidth * scale;
            this.destinationHeight = this.spriteHeight * scale;
            this.canvas = canvasContext;
            this.spriteSheet = new Image();
            this.spriteSheet.src = graphicsFile;
        },

        fillRectangle: function(x, y, w, h, colour) {
            this.canvas.fillStyle = colour;
            this.canvas.fillRect(x * this.destinationWidth , y * this.destinationHeight, w * this.destinationWidth, h * this.destinationHeight);
        },

        drawText: function(x, y, text, colour) {
            this.canvas.fillStyle = colour;
            this.canvas.fillText(text, x * this.destinationWidth, y * this.destinationHeight)
        },

        drawImage: function(x, y, image) {
            this.canvas.drawImage(
                this.spriteSheet,
                this.spriteWidth * (image % GlobalSettings.spriteSheetWidth),
                this.spriteHeight * Math.floor(image / GlobalSettings.spriteSheetWidth),
                this.spriteWidth,
                this.spriteHeight,
                x * this.destinationWidth,
                y * this.destinationHeight,
                this.destinationWidth,
                this.destinationHeight);
        }
    }
});