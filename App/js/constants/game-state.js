angular.module("gameApp")
    .constant("gameState", {
        gameActive: 0,
        playerDeathTransition: 1,
        levelTransition: 2,
        gameOver: 3
    });