function Player(x, y, fireBullet) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.dx = 0;
    this.dy = 0;
    this.direction = DirectionEnum.None;
    this.isFiring = false;
    this.playerState = CharacterState.Active;
    this.fireBullet = fireBullet;
};

Player.prototype.die = function() {
    this.playerState = CharacterState.ExplosionStart;
};

Player.prototype.move = function(direction, isFiring){
    if (this.playerState != CharacterState.Active) {
        switch (this.playerState) {
            case CharacterState.ExplosionStart:
                this.playerState = CharacterState.ExplosionEnd;
                break;
            case CharacterState.ExplosionEnd:
                this.playerState = CharacterState.Dead;
        }
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

Player.prototype.calculateAnimation = function(animation) {
    var destX;
    var destY;
    var spriteEnum;

    if (this.playerState != CharacterState.Active) {
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
