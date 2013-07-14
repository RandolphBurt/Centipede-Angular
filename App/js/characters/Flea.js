'use strict';

function Flea(x, createMushroomFunction) {
    this.x = x;
    this.y = 0;
    this.prevY = 0;
    this.dy = 0;
    this.spriteEnum = SpriteEnum.Flea;
    this.createMushroomFunction = createMushroomFunction;
};

Flea.prototype.move = function(){
    this.prevY = this.y;

    this.y += 1;
    this.dy = 0.5; // Flea moves at twice normal speed

    if (Math.floor(Math.random() * 3) === 0) {
        this.createMushroomFunction(this.x, this.prevY);
    }
};

Flea.prototype.calculateAnimation = function(animationCount) {
    var destY = this.prevY + ((animationCount % 2) * this.dy);

    return {
        image: this.spriteEnum,
        x: this.x,
        y: destY
    };
}
