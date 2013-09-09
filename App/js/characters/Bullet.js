"use strict";
function Bullet(x, y, delayAfterDeathBeforeBulletDispose, checkCollision) {
    this.x = x;
    this.y = y;
    this.delayAfterDeathBeforeBulletDispose = delayAfterDeathBeforeBulletDispose;
    this.checkCollision = checkCollision;
    this.bulletState = CharacterStateEnum.Active;
    this.animationDeadCount = 0;

    if (this.checkCollision(x, y)) {
        this.bulletState = CharacterStateEnum.Dead;
    };
};

Bullet.prototype.move = function() {
    if (this.bulletState === CharacterStateEnum.Active) {
        this.y--;
    }

    if (this.y < 0 || (this.bulletState === CharacterStateEnum.Active && this.checkCollision(this.x, this.y))) {
        this.bulletState = CharacterStateEnum.Dead;
    }

    if (this.bulletState === CharacterStateEnum.Dead) {
        this.animationDeadCount++;
    }
};

Bullet.prototype.shouldDispose = function() {
    if (this.y < 0) {
        return true;
    }

    if (this.bulletState === CharacterStateEnum.Dead && this.animationDeadCount > this.delayAfterDeathBeforeBulletDispose) {
        return true;
    }
};

Bullet.prototype.calculateAnimation = function() {
    return {
        image: this.bulletState === CharacterStateEnum.Active ? SpriteEnum.Bullet : SpriteEnum.Explosion,
        x: this.x,
        y: this.y
    };
};