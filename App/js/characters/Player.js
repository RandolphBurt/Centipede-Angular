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
            spriteEnum = SpriteEnum.PlayerWalkRight1 + animationCount;
            break;

        case DirectionEnum.Left:
            spriteEnum = SpriteEnum.PlayerWalkLeft1 + animationCount;
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