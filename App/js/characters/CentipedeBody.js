"use strict";

function CentipedeBody(x, y, prevX, prevY, framesPerMove) {
    this.prevX = prevX;
    this.prevY = prevY;
    this.x = x;
    this.y = y;
    this.framesPerMove = framesPerMove;

    this.setSpeed();
};

CentipedeBody.prototype.setSpeed = function() {
    this.dx = (this.x - this.prevX) / this.framesPerMove;
    this.dy = (this.y - this.prevY) / this.framesPerMove;
};

CentipedeBody.prototype.move = function(newX, newY) {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x = newX;
    this.y = newY;

    this.setSpeed();
};

CentipedeBody.prototype.checkCollision = function(x, y) {
    return this.x === x && this.y === y;
};

CentipedeBody.prototype.calculateAnimation = function(animation) {
    var destX = this.prevX + this.dx;
    var destY = this.prevY + this.dy;

    var spriteEnum = SpriteEnum.CentipedeBodyVertical1;

    if (this.dx > 0) {
        spriteEnum = SpriteEnum.CentipedeBodyRight1;
    } else if (this.dx < 0) {
        spriteEnum = SpriteEnum.CentipedeBodyLeft1;
    }

    spriteEnum += animation;

    return {
        image: spriteEnum,
        x: destX,
        y: destY
    };
};
