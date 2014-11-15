angular.module("gameApp")
    .factory("LocalStorage", function () {
        return {
            getValue: function(key) {
                return Windows.Storage.ApplicationData.current.localSettings.values[key];
            },

            setValue: function(key, value) {
                Windows.Storage.ApplicationData.current.localSettings.values[key] = value;
            }
        };
    });