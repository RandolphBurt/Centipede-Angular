angular.module("gameApp")
    .factory("utilsService", [function() {
        return {
            // Will generate a random number between 0 and (chance - 1)
            random: function(chance) {
                return Math.floor(Math.random() * chance);
            }
        }
    }]);