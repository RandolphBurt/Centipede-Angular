angular.module("gameApp")
    .factory("scoreMarkerService", ["globalSettings", "graphicsEngineService", "characterState", "coordinateSystem", function(globalSettings, graphicsEngineService, characterState, coordinateSystem) {
        "use strict";

        var scoreMarkers = [];

        var moveScoreMarker = function(scoreMarker) {
            scoreMarker.y += scoreMarker.dy;

            if (scoreMarker.y - scoreMarker.stopY < 0.75) {
                if (scoreMarker.y - scoreMarker.stopY < 0.5) {
                    scoreMarker.colour = 'darkgoldenrod';
                } else {
                    scoreMarker.colour = 'goldenrod';
                }
            }

            if (scoreMarker.y === scoreMarker.stopY) {
                scoreMarker.characterState = characterState.dead;
            }
        };

        var isAlive = function(scoreMarker) {
            return scoreMarker.characterState !== characterState.dead;
        };

        return {
            create: function(x, y, score) {
                scoreMarkers.push({
                    score: score,
                    x: x,
                    y: y,
                    dy: -0.125,
                    stopY: y - 1,
                    characterState: characterState.active,
                    colour: 'gold'
                });
            },

            destroy: function() {
                scoreMarkers = [];
            },

            update: function() {
                var aliveScoreMarkers = [];

                for (var i = 0; i < scoreMarkers.length; i++) {
                    var scoreMarker = scoreMarkers[i];

                    moveScoreMarker(scoreMarker);

                    if (isAlive(scoreMarker)) {
                        aliveScoreMarkers.push(scoreMarker);
                    }
                }

                scoreMarkers = aliveScoreMarkers;
            },

            draw: function() {
                for (var i = 0; i < scoreMarkers.length; i++) {
                    var scoreMarker = scoreMarkers[i];
                    graphicsEngineService.drawText(
                        coordinateSystem.world,
                        scoreMarker.x,
                        scoreMarker.y,
                        scoreMarker.score,
                        scoreMarker.colour,
                        globalSettings.scoreMarkerFont);
                }
            }
        }
    }]);