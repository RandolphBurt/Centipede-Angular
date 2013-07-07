'use strict';

gameApp.factory("GlobalSettings", function() {
   return {
       spriteSize: 20,
       spriteSheetWidth: 4,
       playerAreaHeight: 6,
       mushroomChanceNonPlayerArea: 10,
       mushroomChancePlayerArea: 40
   }
});
