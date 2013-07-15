'use strict';

gameApp.factory("GlobalSettings", function() {
   return {
       spriteSize: 20,
       spriteSheetWidth: 4,
       playerAreaHeight: 6,

       // board creation
       mushroomChanceNonPlayerArea: 10,
       mushroomChancePlayerArea: 40,

       minMushroomsBeforeFleaCreated: 40,
       minMushroomsInPlayerAreaBeforeFleaCreated: 5,
       fleaCreationChance: 100,

       spiderCreationChance: 25,

       snailCreationChance: 200

   }
});
