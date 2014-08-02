angular.module("gameApp")
    .factory("gameStateService", ["globalSettings", "gameState", function(globalSettings, gameState) {
        "use strict";
        return {
            score: 0,
            highScore: 0,
            level: 1,
            lives: globalSettings.lives,
            gameState: gameState.gameActive,
            levelTransitionLineCount: 0,
            playerDieTime: null,
    
            currentLevel: function() {
                return this.level;
            },

            hasGameOverTransitionComplete: function() {
                var nowTime = new Date();

                return nowTime - this.playerDieTime > globalSettings.delayAfterDeathBeforeNewGameStart;
            },

            hasPlayerDeathTransitionComplete: function() {
                var nowTime = new Date();

                return nowTime - this.playerDieTime > globalSettings.delayAfterDeathBeforePlayerRegeneration;
            },

            isGameOver: function() {
                return this.gameState === gameState.gameOver;
            },
    
            isCurrentlyInLevelTransition: function() {
                return this.gameState === gameState.levelTransition;
            },
    
            hasLevelTransitionResetAllLines: function() {
                return this.gameState === gameState.levelTransition && this.levelTransitionLineCount >= globalSettings.gameBoardHeight;
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
                this.gameState = gameState.levelTransition;
                this.levelTransitionLineCount = 0;
                this.level++;
            },
    
            completeLevelTransition: function() {
                this.gameState = gameState.gameActive;
                this.levelTransitionLineCount = 0;
            },
    
            reset: function() {
                this.lives = globalSettings.lives;
                this.level = 1;
                this.score = 0;
                this.gameState = gameState.gameActive;
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
                    this.gameState = gameState.gameOver;
                } else {
                    this.gameState = gameState.playerDeathTransition;
                }

                this.playerDieTime = new Date();
            },

            playerRegenerate: function() {
                this.gameState = gameState.gameActive;
            }
        }
    }]);