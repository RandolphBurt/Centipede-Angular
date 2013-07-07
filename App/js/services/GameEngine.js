gameApp.factory('GameEngine', function() {
    return {

        initialise: function(canvasContext, graphicsFile) {
            this.canvas = canvasContext;
            this.spriteSheet = new Image();
            this.spriteSheet.src = graphicsFile;

            this.gameTimer = 0;
            this.currentColour = 0;
            this.colors = ["#FF0000", "#00FF00", "#0000FF"];
        },

        update: function(currentKeyPress){
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

            this.canvas.fillStyle=this.colors[this.currentColour];
            this.canvas.fillRect(0,0,150,75);
            this.canvas.drawImage(this.spriteSheet, 0, 0, 20, 20, 100, 100, 20,20);
        }
    }
});