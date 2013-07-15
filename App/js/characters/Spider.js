'use strict';

function Spider(x, y, maxY, minY, onSpiderMoved) {
    this.x = x;
    this.y = y;
    this.maxY = maxY;
    this.minY = minY;
    this.startDx = x === 0 ? 0.25 : -0.25;
    this.dx = this.startDx;
    this.dy = -0.25;
    this.prevX = x - 4 * this.dx;
    this.prevY = y - 4 * this.dy;
    this.onSpiderMoved = onSpiderMoved;
};

Spider.prototype.move = function(animation) {
    if (animation !== 0) {
        return;
    }

    var changeX = true;

    // bounce up and down...
    if (this.y >= this.maxY) {
        this.dy = -0.25;
    } else if (this.y <= this.minY) {
        this.dy = 0.25;
    } else {
        changeX = false;
    }

    if (changeX) {
        if (Math.floor(Math.random() * 4) === 0) {
            this.dx = 0;
        } else {
            this.dx = this.startDx;
        }
    }

    this.prevY = this.y;
    this.prevX = this.x;

    this.x += (4 * this.dx);
    this.y += (4 * this.dy);

    this.onSpiderMoved(this.prevX, this.prevY, this.x, this.y);
};

Spider.prototype.calculateAnimation = function(animationCount) {
    var destX = this.prevX + (animationCount * this.dx);
    var destY = this.prevY + (animationCount * this.dy);

    var spriteEnum = SpriteEnum.SpiderAnim1Left;

    if (animationCount % 2) {
        spriteEnum += 2;
    }

    return [ { image: spriteEnum,     x: destX,     y: destY },
             { image: spriteEnum + 1, x: destX + 1, y: destY } ];
}
