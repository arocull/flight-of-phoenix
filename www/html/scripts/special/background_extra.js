/**
 * @class
 * @name PBackgroundExtra
 * @inheritdoc
 * @summary Background object that flies toward the left side of the screen
 * @param {Vector} position Position for background extra to spawn
 * @param {Vector} size Size of object
 * @param {number} speed Speed object flies horizontally
 * @param {number} variance Vertical height variance
 * @param {Image} sprite Sprite for this object to use (since these objects are purely cosmetic)
 * @param {number} upscale Sprite upscale to use
 */
function PBackgroundExtra(position, size, speed, variance, sprite, upscale) {
    this.position = position.clone();
    this.basePosition = position.clone();

    this.size = size;

    this.speed = speed;
    this.variance = variance;
    this.frequency = Math.random() / 3;
    
    this.sprite = sprite;
    this.spriteUpscale = upscale;
    this.baseUpscale = upscale;

    this.alpha = 0.25;
}

PBackgroundExtra.prototype = new Prop(new Vector(), new Vector(1, 1), false);
PBackgroundExtra.prototype.constructor = PBackgroundExtra;

PBackgroundExtra.prototype.tickAnimation = function(DeltaTime) {
    this.animationTimer += DeltaTime;

    this.position.x -= DeltaTime * this.speed;
    this.position.y = this.basePosition.y + this.variance * Math.sin(this.animationTimer * this.frequency + this.basePosition.x);

    if (this.position.x < -5 - this.size.x / 2) {
        this.position.x = 55 + this.size.x;
    }

    this.spriteUpscale = this.baseUpscale + 0.05 * Math.sin(this.animationTimer * this.frequency + this.basePosition.y);
}