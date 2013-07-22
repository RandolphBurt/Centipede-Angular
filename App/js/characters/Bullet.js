"use strict";
function Bullet(x, y, checkCollision) {
    this.x = x;
    this.y = y;
    this.checkCollision = checkCollision;
    this.bulletState = BulletState.Active;

    if (this.checkCollision(x, y)) {
        this.bulletState = BulletState.ExplosionStart;
    };
};

Bullet.prototype.move = function() {
    if (this.bulletState === BulletState.Active) {
        this.y--;
    }

    if (this.y < 0 || this.bulletState === BulletState.ExplosionEnd) {
        this.bulletState = BulletState.Dead;
    } else if (this.bulletState === BulletState.ExplosionStart) {
        this.bulletState = BulletState.ExplosionEnd;
    } else if (this.checkCollision(this.x, this.y)) {
        this.bulletState = BulletState.ExplosionStart;
    }
};

Bullet.prototype.calculateAnimation = function() {
    return {
        image: this.bulletState === BulletState.Active ? SpriteEnum.Bullet : SpriteEnum.Explosion,
        x: this.x,
        y: this.y
    };
};