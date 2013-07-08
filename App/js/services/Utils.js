gameApp.factory('Utils', function() {
    return {
        // Will generate a random number between 0 and (chance - 1)
        random: function(chance) {
            return Math.floor(Math.random() * chance);
        },

        arrayContains: function(array, obj) {
            if (!array || array.length == 0){
                return false;
            }

            for (var i = 0; i < array.length; i++) {
                if (array[i] === obj) {
                    return true;
                }
            }

            return false;
        },

        arrayFirstNonMatchingValue: function(array, obj) {
            if (!array || array.length == 0){
                return null;
            }

            for (var i = 0; i < array.length; i++) {
                if (array[i] !== obj) {
                    return array[i];
                }
            }

            return null;
        }
    }
})