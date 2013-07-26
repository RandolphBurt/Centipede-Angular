"use strict";

function Centipede(x, y, bodyLength, upBoundary, downBoundary, leftBoundary, rightBoundary, framesPerMove, previousDirection, currentDirection, gameBoardCollisionCheck, onNewCentipedeGenerated) {
    this.upBoundary = upBoundary;
    this.downBoundary = downBoundary;
    this.rightBoundary = rightBoundary;
    this.leftBoundary = leftBoundary;
    this.x = x;
    this.y = y;
    this.previousDirection = previousDirection;
    this.currentDirection = currentDirection;
    this.fallingStraightDown = false;
    this.framesPerMove = framesPerMove;
    this.gameBoardCollisionCheck = gameBoardCollisionCheck;
    this.onNewCentipedeGenerated = onNewCentipedeGenerated;
    this.characterState = CharacterState.Alive;

    this.setPositionFromDirection();

    this.centipedeBody = [];

    var xBody = this.x;
    var yBody = this.y;

    var yDiff = this.y - this.prevY;
    var xDiff = this.x - this.prevX;

    for (var i = 0; i < bodyLength; i++) {
        xBody -= xDiff;
        yBody -= yDiff;
        this.centipedeBody.push(new CentipedeBody(xBody, this.y, xBody - xDiff, yBody - yDiff, this.framesPerMove))
    }
};

Centipede.prototype.setSpeed = function() {
    this.dx = (this.x - this.prevX) / this.framesPerMove;
    this.dy = (this.y - this.prevY) / this.framesPerMove;
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

Centipede.prototype.move = function(animation) {
    if ((animation + 1) % this.framesPerMove !== 0) {
        return;
    }

    var collisionType = this.gameBoardCollisionCheck(this.x, this.y);

    if (this.fallingStraightDown || collisionType === BoardLocationEnum.PoisonMushroom) {
        if (this.y === this.downBoundary) {
            this.fallingStraightDown = false;
        } else {
            this.fallingStraightDown = true;
            this.currentDirection = DirectionEnum.Down;
        }
    }

    if (!this.fallingStraightDown) {
        if (this.currentDirection === DirectionEnum.Right) {
            if (this.x >= this.rightBoundary || collisionType === BoardLocationEnum.Mushroom) {
                this.setDirectionVertical();
                this.previousDirection = DirectionEnum.Right;
            }
        } else if (this.currentDirection === DirectionEnum.Left) {
            if (this.x <= this.leftBoundary || collisionType == BoardLocationEnum.Mushroom) {
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

    this.setPositionFromDirection();

    var prevBodyX = this.prevX;
    var prevBodyY = this.prevY;
    for (var i in this.centipedeBody) {
        this.centipedeBody[i].move(prevBodyX, prevBodyY);
        prevBodyX = this.centipedeBody[i].prevX;
        prevBodyY = this.centipedeBody[i].prevY;
    }

    this.setSpeed();
};

Centipede.prototype.setPositionFromDirection = function() {
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
}

Centipede.prototype.calculateAnimation = function(animation) {
    var destX = this.prevX + (((animation + 1) % this.framesPerMove) * this.dx);
    var destY = this.prevY + (((animation + 1) % this.framesPerMove) * this.dy);

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

Centipede.prototype.checkCollision = function(x, y, causeSplit) {
    var hit = false;

    if (!causeSplit) {
        if (this.x === x && this.y === y) {
            hit = true;
        }

        if (!hit) {
            for(var i = 0; i < this.centipedeBody.length; i++) {
                if (this.centipedeBody[i].checkCollision(x, y)) {
                    hit = true;
                    break;
                }
            }
        }
    } else {
        if (this.x === x && this.y === y) {
            // we've hit the head of the centipede
            if (this.centipedeBody.length === 0) {
                this.characterState = CharacterState.Dead;
            } else {
                // make the first part of the body the head - and then remove that body part
                this.x = this.centipedeBody[0].x;
                this.y = this.centipedeBody[0].y;
                this.centipedeBody.splice(0, 1);
            }
            hit = true;

        } else if (this.centipedeBody.length > 0) {
            if (this.centipedeBody[this.centipedeBody.length - 1].checkCollision(x, y)) {
                // hit the end of the tail/body - so just remove that bit - no new centipede to create
                this.centipedeBody.pop();
                hit = true;
            } else {
                for (var i = 0; i < this.centipedeBody.length - 1; i++) {
                    if (this.centipedeBody[i].checkCollision(x, y)) {
                        // split centipede
                        var newCentipede = new Centipede(
                            this.centipedeBody[i + 1].x,
                            this.centipedeBody[i + 1].y,
                            0,
                            this.upBoundary,
                            this.downBoundary,
                            this.leftBoundary,
                            this.rightBoundary,
                            this.framesPerMove,
                            (this.currentDirection === DirectionEnum.Down || this.currentDirection === DirectionEnum.Up) ? this.previousDirection : this.currentDirection,
                            DirectionEnum.Down,
                            this.gameBoardCollisionCheck,
                            this.onNewCentipedeGenerated);

                        if (i < this.centipedeBody.length - 2) {
                            // transfer the body across to the new centipede
                            newCentipede.centipedeBody = this.centipedeBody.splice(i + 2, this.centipedeBody.length - (i + 2));
                        }
                        // finally remove the part of the centipede body that is the new head.
                        this.centipedeBody.pop();
                        this.onNewCentipedeGenerated(newCentipede);
                        hit = true;
                        break;
                    }
                }
            }
        }
    }
    return hit;
}