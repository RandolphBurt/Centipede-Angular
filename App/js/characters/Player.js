function Player(x, y, delayAfterDeathBeforePlayerRegeneration, fireBullet) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.dx = 0;
    this.dy = 0;
    this.delayAfterDeathBeforePlayerRegeneration = delayAfterDeathBeforePlayerRegeneration;
    this.direction = DirectionEnum.None;
    this.animationDeadCount = 0;
    this.isFiring = false;
    this.playerState = CharacterStateEnum.Active;
    this.fireBullet = fireBullet;
};

Player.prototype.die = function() {
    this.playerState = CharacterStateEnum.Dead;
};

Player.prototype.regenerate = function() {
    this.playerState = CharacterStateEnum.Active;
    this.prevX = this.x;
    this.prevY = this.y;
    this.dx = 0;
    this.dy = 0;
    this.direction = DirectionEnum.None;
};

Player.prototype.move = function(direction, isFiring){
    if (this.playerState != CharacterStateEnum.Active) {
        this.animationDeadCount++;
        return;
    }

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
            this.dx = -0.5;
            this.dy = 0;
            break;

        case DirectionEnum.Right:
            this.x += 1;
            this.dx = 0.5;
            this.dy = 0;
            break;

        case DirectionEnum.Up:
            this.y -= 1;
            this.dx = 0;
            this.dy = -0.5;
            break;

        case DirectionEnum.Down:
            this.y += 1;
            this.dx = 0;
            this.dy = 0.5;
            break;
    }

    if (this.isFiring) {
        this.fireBullet(this.prevX, this.prevY - 1);
    }
};

Player.prototype.shouldRegenerate = function() {
    return this.playerState === CharacterStateEnum.Dead && this.animationDeadCount > this.delayAfterDeathBeforePlayerRegeneration;
};

Player.prototype.isAlive = function() {
    return this.playerState === CharacterStateEnum.Active;
};

Player.prototype.calculateAnimation = function(animation) {
    var destX;
    var destY;
    var spriteEnum;

    if (this.playerState != CharacterStateEnum.Active) {
        spriteEnum = SpriteEnum.Explosion;
        destX = this.x;
        destY = this.y;
    } else {
        spriteEnum = SpriteEnum.PlayerStandStill;
        destX = this.prevX + ((animation % 2) * this.dx);
        destY = this.prevY + ((animation % 2) * this.dy);

        switch (this.direction)
        {
            case DirectionEnum.Right:
                spriteEnum = SpriteEnum.PlayerWalkRight1 + animation;
                break;

            case DirectionEnum.Left:
                spriteEnum = SpriteEnum.PlayerWalkLeft1 + animation;
                break;

            case DirectionEnum.None:
                if (this.isFiring) {
                    spriteEnum = SpriteEnum.PlayerFire;
                }
                break;
        }
    }

    return {
        image: spriteEnum,
        x: destX,
        y: destY
    };
}
