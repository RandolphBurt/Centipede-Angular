gameApp.factory("GameState", function(GlobalSettings) {
    return {
        score: 0,
        highScore: 0,
        level: 1,
        lives: GlobalSettings.lives,
        gameState: GameStateEnum.GameActive,
        levelTransitionLineCount: 0,

        currentLevel: function() {
            return this.level;
        },

        isGameOver: function() {
            return this.gameState === GameStateEnum.GameOver;
        },

        isCurrentlyInLevelTransition: function() {
            return this.gameState === GameStateEnum.LevelTransition;
        },

        hasLevelTransitionResetAllLines: function() {
            return this.gameState === GameStateEnum.LevelTransition && this.levelTransitionLineCount >= GlobalSettings.gameBoardHeight;
        },

        isCurrentLevelHighSpeed: function() {
            return this.level % 2 == 0;
        },

        levelTransitionCount: function() {
            return this.levelTransitionLineCount;
        },

        incrementLevelTransitionLineCount: function() {
            this.levelTransitionLineCount++;
        },

        startLevelTransition: function() {
            this.gameState = GameStateEnum.LevelTransition;
            this.levelTransitionLineCount = 0;
            this.level++;
        },

        completeLevelTransition: function() {
            this.gameState = GameStateEnum.GameActive;
            this.levelTransitionLineCount = 0;
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