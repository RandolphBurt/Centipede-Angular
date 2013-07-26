gameApp.factory("GameBoard", function(GlobalSettings, Utils, GraphicsEngine) {
    return {
        initialise: function(width, height) {
            this.height = height;
            this.width = width;
            this.map = [];
            this.mushroomsInPlayerArea = 0;
            this.mushroomsOnScreen = 0;

            for (var h = 0; h < this.height; h++) {
                this.map.push([]);
                for (var w = 0; w < this.width; w++) {
                    this.map[h].push(0);

                    // no mushrooms on the bottom row
                    if (h < this.height - 1) {
                        if (Utils.random(inPlayerArea(h, this.height) ? GlobalSettings.mushroomChancePlayerArea : GlobalSettings.mushroomChanceNonPlayerArea) === 0) {
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
            this.decrementMushroomCount(y);
            this.map[y][x] = 0;
        },

        incrementMushroomCount: function(y) {
            if (inPlayerArea(y, this.height)) {
                this.mushroomsInPlayerArea++;
            }

            this.mushroomsOnScreen++;
        },

        decrementMushroomCount: function(y) {
            if (inPlayerArea(y, this.height)) {
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

            if (x >= this.width || x < 0 || y >= this.height || y < 0 || !inPlayerArea(y, this.height)) {
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
            for (var h = 0; h < this.height; h++) {
                for (var w = 0; w < this.width; w++) {
                    var mushroomStrength = this.map[h][w];
                    if (mushroomStrength) {
                        GraphicsEngine.drawImage(w, h, calculateImageType(mushroomStrength));
                    }
                }
            }
        }
    }

    function calculateImageType(mushroomStrength) {
        switch (mushroomStrength) {
            case 4:
                return SpriteEnum.MushroomRed100;
            case 3:
                return SpriteEnum.MushroomRed75;
            case 2:
                return SpriteEnum.MushroomRed50;
            case 1:
                return SpriteEnum.MushroomRed25;
            case -4:
                return SpriteEnum.MushroomGreen100;
            case -3:
                return SpriteEnum.MushroomGreen75;
            case -2:
                return SpriteEnum.MushroomGreen50;
            case -1:
                return SpriteEnum.MushroomGreen25;
        }
    }

    function inPlayerArea(row, height) {
        return row > height - GlobalSettings.playerAreaHeight;
    }

});