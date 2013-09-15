gameApp.factory("GameState", function(GlobalSettings) {
    return {
        score: 0,
        highScore: 0,
        level: 1,
        lives: GlobalSettings.lives,
        gameState: GameStateEnum.GameActive,

        isPlayerAlive: function() {
            return this.lives > 0;
        },

        isGameOver: function() {
            return this.gameState === GameStateEnum.GameOver;
        },

        isCurrentLevelHighSpeed: function() {
            return this.level % 2 == 0;
        },

        reset: function() {
            this.lives = GlobalSettings.lives;
            this.level = 1;
            this.score = 0;
            this.gameState = GameStateEnum.GameActive;
        },

        incrementScore: function(increment) {
            this.score += increment;

            if (this.score > this.highScore) {
                this.highScore = this.score;
            }
        },

        die: function() {
            if (this.lives > 0) {
                this.lives--;
            }

            if (this.lives === 0) {
                this.gameState = GameStateEnum.GameOver;
            }
        }
    }
});