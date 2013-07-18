"use strict";

function CentipedeBody(x, y, prevX, prevY, framesPerMove) {
    this.prevX = prevX;
    this.prevY = prevY;
    this.x = x;
    this.y = y;

    this.setSpeed(framesPerMove);
};

CentipedeBody.prototype.setSpeed = function(framesPerMove) {
    this.dx = (this.x - this.prevX) / framesPerMove;
    this.dy = (this.y - this.prevY) / framesPerMove;
};

CentipedeBody.prototype.move = function(newX, newY, framesPerMove) {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x = newX;
    this.y = newY;

    this.setSpeed(framesPerMove);
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

function Centipede(x, y, bodyLength, upBoundary, downBoundary, leftBoundary, rightBoundary, framesPerSecond) {
    this.upBoundary = upBoundary;
    this.downBoundary = downBoundary;
    this.rightBoundary = rightBoundary;
    this.leftBoundary = leftBoundary;
    this.x = x;
    this.y = y;
    this.previousDirection = DirectionEnum.Down;
    this.currentDirection = DirectionEnum.Right;
    this.fallingStraightDown = false;

    this.centipedeBody = [];

    this.prevX = x - 1;
    this.prevY = y;

    var xBody = this.x;
    for (var i = 0; i < bodyLength; i++) {
        xBody--;
        this.centipedeBody.push(new CentipedeBody(xBody, this.y, xBody - 1, this.y, framesPerSecond))
    }

    this.setSpeed(framesPerSecond);
};

Centipede.prototype.setSpeed = function(framesPerMove) {
    this.dx = (this.x - this.prevX) / framesPerMove;
    this.dy = (this.y - this.prevY) / framesPerMove;
};

Centipede.prototype.setDirectionVertical = function() {
    if (this.previousDirection === DirectionEnum.Down && this.y >= this.downBoundary) {
        this.currentDirection = DirectionEnum.Up;
    } else if (this.previousDirection === DirectionEnum.Up && this.y <= this.upBoundary) {
        this.currentDirection = DirectionEnum.Down;
    } else {
        this.currentDirection = this.previousDirection;
    }
};

Centipede.prototype.move = function(animation, framesPerMove) {
    if ((animation + 1) % framesPerMove !== 0) {
        return;
    }

    if (this.fallingStraightDown) {
        if (this.y == this.downBoundary) {
            this.fallingStraightDown = false;
        } else {
            this.y++;
        }
    }

    if (!this.fallingStraightDown) {
        if (this.currentDirection === DirectionEnum.Right) {
            if (this.x >= this.rightBoundary) {
                this.setDirectionVertical();
                this.previousDirection = DirectionEnum.Right;
            }
        } else if (this.currentDirection === DirectionEnum.Left) {
            if (this.x <= this.leftBoundary) {
                this.setDirectionVertical();
                this.previousDirection = DirectionEnum.Left;
            }
        } else {
            var nowDirection = this.currentDirection;
            if (this.previousDirection === DirectionEnum.Right) {
                this.currentDirection = DirectionEnum.Left;
            } else {
                this.currentDirection = DirectionEnum.Right;
            }
            this.previousDirection = nowDirection;

            if (this.currentDirection === DirectionEnum.Right && this.x >= this.rightBoundary) {
                this.currentDirection = DirectionEnum.Left;
            } else if (this.currentDirection === DirectionEnum.Left && this.x <= this.leftBoundary) {
                this.currentDirection = DirectionEnum.Right;
            }
        }
    }

    this.prevX = this.x;
    this.prevY = this.y;

    switch (this.currentDirection) {
        case DirectionEnum.Down:
            this.y++;
            break;
        case DirectionEnum.Up:
            this.y--;
            break;
        case DirectionEnum.Right:
            this.x++;
            break;
        case DirectionEnum.Left:
            this.x--;
            break;
    }

    var prevBodyX = this.prevX;
    var prevBodyY = this.prevY;
    for (var i in this.centipedeBody) {
        this.centipedeBody[i].move(prevBodyX, prevBodyY, framesPerMove);
        prevBodyX = this.centipedeBody[i].prevX;
        prevBodyY = this.centipedeBody[i].prevY;
    }

    this.setSpeed(framesPerMove);
};

Centipede.prototype.calculateAnimation = function(animation) {
    var destX = this.prevX + this.dx;
    var destY = this.prevY + this.dy;

    var spriteEnum = SpriteEnum.CentipedeHeadDown;

    if (this.dx > 0) {
        spriteEnum = SpriteEnum.CentipedeHeadRight;
    } else if (this.dx < 0) {
        spriteEnum = SpriteEnum.CentipedeHeadLeft;
    } else if (this.dy < 0) {
        spriteEnum = SpriteEnum.CentipedeHeadUp;
    }

    var animations = [ { image: spriteEnum, x: destX, y: destY }];

    for (var i in this.centipedeBody) {
        animations.push(this.centipedeBody[i].calculateAnimation(animation));
    }

    return animations;
};