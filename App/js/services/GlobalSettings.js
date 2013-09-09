'use strict';

gameApp.constant("GlobalSettings", {
    spriteSize: 20,
    spriteSheetWidth: 4,
    playerAreaHeight: 6,

    scoreBoardArea: 40,

    scoreMarkerFont: "10px sans-serif",
    scoreBoardFont: "16px Arial bold",
    scoreBoardTitleFontColour: "red",
    scoreBoardContentFontColour: "purple",
    scoreBoardLivesXPositionText: 50,
    scoreBoardLivesXPositionImage: 45,
    scoreBoardScoreXPosition: 200,
    scoreBoardLevelXPosition: 350,
    scoreBoardHighScoreXPosition: 500,
    scoreBoardTitleYPosition: 15,
    scoreBoardContentYPosition: 35,
    scoreBoardLivesYPosition: 20,
    scoreBoardLivesOffset: 20,

    gameBoardWidth: 30,
    gameBoardHeight: 30,
    gameBoardBackgroundColour: "black",

    centipedeFramesPerMoveNormalSpeed: 2,
    centipedeFramesPerMoveHighSpeed: 1,

    // board creation
    mushroomChanceNonPlayerArea: 10,
    mushroomChancePlayerArea: 40,

    minMushroomsBeforeFleaCreated: 40,
    maxMushroomsAllowed: 140,
    minMushroomsInPlayerAreaBeforeFleaCreated: 5,

    fleaCreationChance: 100,
    spiderCreationChance: 25,
    snailCreationChance: 200,

    maxBulletsOnScreen: 5,
    lives: 3,

    scoreHitMushroom: 10,
    scoreHitPoisonMushroom: 25,
    scoreHitCentipede: 100,
    scoreHitSpider: 1000,
    scoreHitFlea: 500,
    scoreHitSnail: 2000
});
