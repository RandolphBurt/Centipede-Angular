function Player(x, y) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.dx = 0;
    this.dy = 0;
    this.direction = DirectionEnum.None;
    this.isFiring = false;
};

Player.prototype.move = function(direction, isFiring){
    this.prevX = this.x;
    this.prevY = this.y;
    this.direction = direction;
    this.isFiring = isFiring;

    switch (direction) {
        case DirectionEnum.None:
            this.dx = 0;
            this.dy = 0;
            break;

        case DirectionEnum.Left:
            this.x -= 1;
            this.dx = -0.25;
            this.dy = 0;
            break;

        case DirectionEnum.Right:
            this.x += 1;
            this.dx = 0.25;
            this.dy = 0;
            break;

        case DirectionEnum.Up:
            this.y -= 1;
            this.dx = 0;
            this.dy = -0.25;
            break;

        case DirectionEnum.Down:
            this.y += 1;
            this.dx = 0;
            this.dy = 0.25;
            break;
    }
};

Player.prototype.calculateAnimation = function(animationCount) {
    var spriteEnum = SpriteEnum.PlayerStandStill;
    var destX = this.prevX + (animationCount * this.dx);
    var destY = this.prevY + (animationCount * this.dy);

    switch (this.direction)
    {
        case DirectionEnum.Right:
            switch (animationCount) {
                case 0:
                    spriteEnum = SpriteEnum.PlayerWalkRight1;
                    break;
                case 1:
                    spriteEnum = SpriteEnum.PlayerWalkRight2;
                    break;
                case 2:
                    spriteEnum = SpriteEnum.PlayerWalkRight3;
                    break;
                case 3:
                    spriteEnum = SpriteEnum.PlayerWalkRight4;
                    break;
            }
            break;

        case DirectionEnum.Left:
            switch (animationCount) {
                case 0:
                    spriteEnum = SpriteEnum.PlayerWalkLeft1;
                    break;
                case 1:
                    spriteEnum = SpriteEnum.PlayerWalkLeft2;
                    break;
                case 2:
                    spriteEnum = SpriteEnum.PlayerWalkLeft3;
                    break;
                case 3:
                    spriteEnum = SpriteEnum.PlayerWalkLeft4;
                    break;
            }
            break;

        case DirectionEnum.None:
            if (this.isFiring) {
                spriteEnum = SpriteEnum.PlayerFire;
            }
            break;
    }

    return {
        image: spriteEnum,
        x: destX,
        y: destY
    };
}
