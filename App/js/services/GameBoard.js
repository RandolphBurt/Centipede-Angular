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
                    if (Utils.random(inPlayerArea(h, this.height) ? GlobalSettings.mushroomChancePlayerArea : GlobalSettings.mushroomChanceNonPlayerArea) === 0) {
                        this.createMushroom(w, h);
                    }
                }
            }
        },

        createMushroom: function (x, y) {
            if (!this.map[y][x]) {
                if (inPlayerArea(y, this.height)) {
                    this.mushroomsInPlayerArea++;
                }

                this.mushroomsOnScreen++;
            }

            this.map[y][x] = 4;
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