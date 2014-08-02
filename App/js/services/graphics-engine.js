angular.module("gameApp")
    .factory("graphicsEngineService", ["globalSettings", "coordinateSystem", function(globalSettings, coordinateSystem) {
       "use strict";
        return {
            initialise: function(canvasContext, graphicsFile) {
                this.spriteWidth = globalSettings.spriteSize;
                this.spriteHeight = globalSettings.spriteSize;
                this.canvas = canvasContext;
                this.spriteSheet = new Image();
                this.spriteSheet.src = graphicsFile;
            },
    
            convertGameXCoordinateToPixels: function(x) {
                return x * globalSettings.spriteSize;
            },
    
            convertGameYCoordinateToPixels: function(y) {
                return (y * globalSettings.spriteSize) + globalSettings.scoreBoardArea;
            },
    
            blankScreen: function() {
                this.canvas.fillStyle = globalSettings.gameBoardBackgroundColour;
                this.canvas.fillRect(0, 0, globalSettings.gameBoardWidth * this.spriteWidth, globalSettings.scoreBoardArea + (globalSettings.gameBoardHeight * this.spriteHeight));
            },
    
            drawText: function(coordSystem, x, y, text, colour, font) {
                if (coordSystem === coordinateSystem.world) {
                    x = this.convertGameXCoordinateToPixels(x);
                    y = this.convertGameYCoordinateToPixels(y);
                }
                this.canvas.fillStyle = colour;
                this.canvas.font = font;
                this.canvas.fillText(text, x, y)
            },
    
            drawImage: function(coordSystem, x, y, image) {
                if (coordSystem === coordinateSystem.world) {
                    x = this.convertGameXCoordinateToPixels(x);
                    y = this.convertGameYCoordinateToPixels(y);
                }
                this.canvas.drawImage(
                    this.spriteSheet,
                    this.spriteWidth * (image % globalSettings.spriteSheetWidth),
                    this.spriteHeight * Math.floor(image / globalSettings.spriteSheetWidth),
                    this.spriteWidth,
                    this.spriteHeight,
                    x,
                    y,
                    this.spriteWidth,
                    this.spriteHeight);
            }
        }   
    }]);