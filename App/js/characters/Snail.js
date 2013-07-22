'use strict';

function Snail(y, onSnailMoved) {
    this.x = 0;
    this.y = y;
    this.dx = 0.25;
    this.prevX = this.x - 1;
    this.onSnailMoved = onSnailMoved;
};

Snail.prototype.move = function(animation) {
    if (animation !== 0) {
        return;
    }

    this.prevX = this.x;
    this.x++;

    this.onSnailMoved(this.prevX, this.x, this.y);
};

Snail.prototype.calculateAnimation = function(animation) {
    var destX = this.prevX + (animation * this.dx);

    var spriteEnum = SpriteEnum.SnailAnim1Left;

    switch (animation) {
        case 1:
        case 3:
            spriteEnum = SpriteEnum.SnailAnim2Left;
            break;

        case 2:
            spriteEnum = SpriteEnum.SnailAnim3Left;
            break;
    }

    return [ { image: spriteEnum,     x: destX,     y: this.y },
             { image: spriteEnum + 1, x: destX + 1, y: this.y } ];
};

Snail.prototype.checkCollision = function(x, y) {
    if ((this.x === x || this.x + 1 === x) && this.y === y) {
        return true;
    }

    return false;
};