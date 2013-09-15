'use strict';

function Flea(x, onFleaMoved) {
    this.x = x;
    this.y = 0;
    this.prevY = 0;
    this.dy = 0;
    this.spriteEnum = SpriteEnum.Flea;
    this.onFleaMoved = onFleaMoved;
};

Flea.prototype.move = function(animation) {
    if ((animation % 2) !== 0) {
        return;
    }

    this.prevY = this.y;

    this.y += 1;
    this.dy = 0.5; // Flea moves at twice normal speed

    this.onFleaMoved(this.x, this.prevY, this.y);
};

Flea.prototype.calculateAnimation = function(animation) {
    var destY = this.prevY + ((animation % 2) * this.dy);

    return {
        image: this.spriteEnum,
        x: this.x,
        y: destY
    };
};

Flea.prototype.checkCollision = function(x, y) {
    if (this.x === x && (this.y === y  || this.prevY === y)) {
        return true;
    }

    return false;
};
