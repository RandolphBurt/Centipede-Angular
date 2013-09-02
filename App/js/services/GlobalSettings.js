'use strict';

gameApp.constant("GlobalSettings", {
   spriteSize: 20,
   spriteSheetWidth: 4,
   playerAreaHeight: 6,

   centipedeFramesPerMoveNormalSpeed: 2,
   centipedeFramesPerMoveHighSpeed: 1,

   // board creation
   mushroomChanceNonPlayerArea: 10,
   mushroomChancePlayerArea: 40,

   minMushroomsBeforeFleaCreated: 40,
   minMushroomsInPlayerAreaBeforeFleaCreated: 5,

   fleaCreationChance: 100,
   spiderCreationChance: 25,
   snailCreationChance: 200,

   maxBulletsOnScreen: 5,

   scoreHitMushroom: 10,
   scoreHitPoisonMushroom: 25,
   scoreHitCentipede: 100,
   scoreHitSpider: 1000,
   scoreHitFlea: 250,
   scoreHitSnail: 500
});
