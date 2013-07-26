"use strict";

function ScoreMarker(x, y, score) {
    this.score = score;
    this.x = x;
    this.y = y;
    this.stopY = y - 1;
    this.dy = -0.125;
    this.characterState = CharacterState.Active;
    this.colour = 'gold';
};

ScoreMarker.prototype.move = function(animation) {
    this.y += this.dy;

    if (this.y - this.stopY < 0.75) {
        if (this.y - this.stopY < 0.5) {
            this.colour = 'darkgoldenrod';
        } else {
            this.colour = 'goldenrod';
        }
    }

    if (this.y === this.stopY) {
        this.characterState = CharacterState.Dead;
    }
};

ScoreMarker.prototype.calculateAnimation = function() {
    return {
        text: this.score,
        x: this.x,
        y: this.y,
        colour: this.colour
    };
};
