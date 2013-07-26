"use strict";
function Bullet(x, y, checkCollision) {
    this.x = x;
    this.y = y;
    this.checkCollision = checkCollision;
    this.bulletState = CharacterState.Alive;

    if (this.checkCollision(x, y)) {
        this.bulletState = CharacterState.ExplosionStart;
    };
};

Bullet.prototype.move = function() {
    if (this.bulletState === CharacterState.Alive) {
        this.y--;
    }

    if (this.y < 0 || this.bulletState === CharacterState.ExplosionEnd) {
        this.bulletState = CharacterState.Dead;
    } else if (this.bulletState === CharacterState.ExplosionStart) {
        this.bulletState = CharacterState.ExplosionEnd;
    } else if (this.checkCollision(this.x, this.y)) {
        this.bulletState = CharacterState.ExplosionStart;
    }
};

Bullet.prototype.calculateAnimation = function() {
    return {
        image: this.bulletState === CharacterState.Alive ? SpriteEnum.Bullet : SpriteEnum.Explosion,
        x: this.x,
        y: this.y
    };
};