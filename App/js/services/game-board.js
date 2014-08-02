angular.module("gameApp")
    .factory("gameBoardService", ["globalSettings", "utilsService", "graphicsEngineService", "gameStateService", "boardLocation", "characterDirection", "sprite", "coordinateSystem", function(globalSettings, utilsService, graphicsEngineService, gameStateService, boardLocation, characterDirection, sprite, coordinateSystem) {
        "use strict";

        function calculateImageType(yPosition, mushroomStrength) {
            var mushroomImage = 0;

            switch (mushroomStrength) {
                case 4:
                    mushroomImage = sprite.mushroomRed100;
                    break;
                case 3:
                    mushroomImage = sprite.mushroomRed75;
                    break;
                case 2:
                    mushroomImage = sprite.mushroomRed50;
                    break;
                case 1:
                    mushroomImage = sprite.mushroomRed25;
                    break;
                case -4:
                    mushroomImage = sprite.mushroomGreen100;
                    break;
                case -3:
                    mushroomImage = sprite.mushroomGreen75;
                    break;
                case -2:
                    mushroomImage = sprite.mushroomGreen50;
                    break;
                case -1:
                    mushroomImage = sprite.mushroomGreen25;
                    break;
            }

            var isCurrentLevelHighSpeed = gameStateService.isCurrentLevelHighSpeed();

            if (gameStateService.isCurrentlyInLevelTransition() && yPosition > gameStateService.levelTransitionCount()) {
                isCurrentLevelHighSpeed = !isCurrentLevelHighSpeed;
            }

            if (isCurrentLevelHighSpeed) {
                mushroomImage += 8
            }

            return mushroomImage;
        }

        function inPlayerArea(row, height) {
            return row > height - globalSettings.playerAreaHeight;
        }

        return {
            initialise: function () {
                this.map = [];
                this.mushroomsInPlayerArea = 0;
                this.mushroomsOnScreen = 0;
    
                this.generateMushrooms();
            },
    
            generateMushrooms: function () {
                for (var h = 0; h < globalSettings.gameBoardHeight; h++) {
                    this.map.push([]);
                    for (var w = 0; w < globalSettings.gameBoardWidth; w++) {
                        this.map[h].push(0);
    
                        // no mushrooms on the bottom row
                        if (h < globalSettings.gameBoardHeight - 1) {
                            if (utilsService.random(inPlayerArea(h, globalSettings.gameBoardHeight) ? globalSettings.mushroomChancePlayerArea : globalSettings.mushroomChanceNonPlayerArea) === 0) {
                                this.createMushroom(w, h);
                            }
                        }
                    }
                }
            },
    
            createMushroom: function (x, y) {
                if (!this.map[y][x]) {
                    this.incrementMushroomCount(y);
                }
    
                this.map[y][x] = 4;
            },
    
            poisonMushroom: function (x, y) {
                if (this.map[y][x] > 0) {
                    this.map[y][x] *= -1;
                }
            },
    
            destroyMushroom: function (x, y) {
                if (this.checkCollision(x, y) !== boardLocation.space) {
                    this.decrementMushroomCount(y);
                    this.map[y][x] = boardLocation.space;
                }
            },
    
            incrementMushroomCount: function (y) {
                if (inPlayerArea(y, globalSettings.gameBoardHeight)) {
                    this.mushroomsInPlayerArea++;
                }
    
                this.mushroomsOnScreen++;
            },
    
            decrementMushroomCount: function (y) {
                if (inPlayerArea(y, globalSettings.gameBoardHeight)) {
                    this.mushroomsInPlayerArea--;
                }
    
                this.mushroomsOnScreen--;
            },
    
            playerAllowedToMove: function (currentX, currentY, direction) {
                var x = currentX;
                var y = currentY;
    
                switch (direction) {
                    case characterDirection.down:
                        y += 1;
                        break;
                    case characterDirection.up:
                        y -= 1;
                        break;
                    case characterDirection.right:
                        x += 1;
                        break;
                    case characterDirection.left:
                        x -= 1;
                        break;
                }
    
                if (x >= globalSettings.gameBoardWidth || x < 0 || y >= globalSettings.gameBoardHeight || y < 0 || !inPlayerArea(y, globalSettings.gameBoardHeight)) {
                    return false;
                }
    
                return this.map[y][x] == 0;
            },
    
            checkCollision: function (x, y, destroyLocation) {
                var mushroomSpace = this.map[y][x];
    
                if (destroyLocation) {
                    if (mushroomSpace < 0) {
                        this.map[y][x]++;
                    } else if (mushroomSpace > 0) {
                        this.map[y][x]--;
                    }
                    if (mushroomSpace !== 0 && this.map[y][x] === 0) {
                        this.decrementMushroomCount(y);
                    }
                }
    
                if (mushroomSpace > 0) {
                    return boardLocation.mushroom;
                } else if (mushroomSpace < 0) {
                    return boardLocation.poisonMushroom;
                } else {
                    return boardLocation.space;
                }
            },
    
            draw: function () {
                var incrementLevelTransitionCount = false;
    
                if (gameStateService.isCurrentlyInLevelTransition()) {
                    incrementLevelTransitionCount = true;
                    var levelTransitionLineCount = gameStateService.levelTransitionCount();
                    for (var w = 0; w < globalSettings.gameBoardWidth; w++) {
                        if (this.map[levelTransitionLineCount][w] < 0) {
                            this.map[levelTransitionLineCount][w] = -4;
                        } else if (this.map[levelTransitionLineCount][w] > 0) {
                            this.map[levelTransitionLineCount][w] = 4;
                        }
                    }
                }
    
                for (var h = 0; h < globalSettings.gameBoardHeight; h++) {
                    for (var w = 0; w < globalSettings.gameBoardWidth; w++) {
                        var mushroomStrength = this.map[h][w];
                        if (mushroomStrength) {
                            graphicsEngineService.drawImage(coordinateSystem.world, w, h, calculateImageType(h, mushroomStrength));
                        }
                    }
                }
    
                if (incrementLevelTransitionCount) {
                    gameStateService.incrementLevelTransitionLineCount();
                }
            }
        };
    }]);