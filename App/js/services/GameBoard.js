gameApp.factory("GameBoard", function(GlobalSettings, Utils, GraphicsEngine, GameState) {
    return {
        initialise: function() {
            this.map = [];
            this.mushroomsInPlayerArea = 0;
            this.mushroomsOnScreen = 0;

            this.generateMushrooms();
        },

        generateMushrooms: function() {
            for (var h = 0; h < GlobalSettings.gameBoardHeight; h++) {
                this.map.push([]);
                for (var w = 0; w < GlobalSettings.gameBoardWidth; w++) {
                    this.map[h].push(0);

                    // no mushrooms on the bottom row
                    if (h < GlobalSettings.gameBoardHeight - 1) {
                        if (Utils.random(inPlayerArea(h, GlobalSettings.gameBoardHeight) ? GlobalSettings.mushroomChancePlayerArea : GlobalSettings.mushroomChanceNonPlayerArea) === 0) {
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

        poisonMushroom: function(x, y) {
            if (this.map[y][x] > 0) {
                this.map[y][x] *= -1;
            }
        },

        destroyMushroom: function(x, y) {
            if (this.checkCollision(x, y) !== BoardLocationEnum.Space) {
                this.decrementMushroomCount(y);
                this.map[y][x] = BoardLocationEnum.Space;
            }
        },

        incrementMushroomCount: function(y) {
            if (inPlayerArea(y, GlobalSettings.gameBoardHeight)) {
                this.mushroomsInPlayerArea++;
            }

            this.mushroomsOnScreen++;
        },

        decrementMushroomCount: function(y) {
            if (inPlayerArea(y, GlobalSettings.gameBoardHeight)) {
                this.mushroomsInPlayerArea--;
            }

            this.mushroomsOnScreen--;
        },

        playerAllowedToMove: function(currentX, currentY, direction) {
            var x = currentX;
            var y = currentY;

            switch (direction) {
                case DirectionEnum.Down:
                    y += 1;
                    break;
                case DirectionEnum.Up:
                    y -= 1;
                    break;
                case DirectionEnum.Right:
                    x += 1;
                    break;
                case DirectionEnum.Left:
                    x -= 1;
                    break;
            }

            if (x >= GlobalSettings.gameBoardWidth || x < 0 || y >= GlobalSettings.gameBoardHeight || y < 0 || !inPlayerArea(y, GlobalSettings.gameBoardHeight)) {
                return false;
            }

            return this.map[y][x] == 0;
        },

        checkCollision: function(x, y, destroyLocation) {
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
                return BoardLocationEnum.Mushroom;
            } else if (mushroomSpace < 0) {
                return BoardLocationEnum.PoisonMushroom;
            } else {
                return BoardLocationEnum.Space;
            }
        },

        draw: function() {
            for (var h = 0; h < GlobalSettings.gameBoardHeight; h++) {
                for (var w = 0; w < GlobalSettings.gameBoardWidth; w++) {
                    var mushroomStrength = this.map[h][w];
                    if (mushroomStrength) {
                        GraphicsEngine.drawImage(
                            GraphicsEngine.convertGameXCoordinateToPixels(w),
                            GraphicsEngine.convertGameYCoordinateToPixels(h),
                            calculateImageType(mushroomStrength));
                    }
                }
            }
        }
    }

    function calculateImageType(mushroomStrength) {
        var mushroomImage = 0;

        switch (mushroomStrength) {
            case 4:
                mushroomImage = SpriteEnum.MushroomRed100;
                break;
            case 3:
                mushroomImage = SpriteEnum.MushroomRed75;
                break;
            case 2:
                mushroomImage = SpriteEnum.MushroomRed50;
                break;
            case 1:
                mushroomImage = SpriteEnum.MushroomRed25;
                break;
            case -4:
                mushroomImage = SpriteEnum.MushroomGreen100;
                break;
            case -3:
                mushroomImage = SpriteEnum.MushroomGreen75;
                break;
            case -2:
                mushroomImage = SpriteEnum.MushroomGreen50;
                break;
            case -1:
                mushroomImage = SpriteEnum.MushroomGreen25;
                break;
        }

        if (GameState.isCurrentLevelHighSpeed()) {
            mushroomImage += 8
        }

        return mushroomImage;
    }

    function inPlayerArea(row, height) {
        return row > height - GlobalSettings.playerAreaHeight;
    }
});