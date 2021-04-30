const TEXTURE_phoenix = new Image(5120, 3720);
TEXTURE_phoenix.src = 'images/sprites/phoenix.png';

/**
 * @name EPhoenix
 * @class
 * @inheritdoc
 * @summary The Phoenix--pre-constructed phoenix object for spawning
 * @param {Vector} spawnPos Position to spawn the Phoenix at
 */
function EPhoenix(spawnPos) {
    this.position = spawnPos;
    this.lastPosition = spawnPos;

    this.sprite = TEXTURE_phoenix;
    this.spriteUpscale = 1.85;
    this.animated = true;

    this.friction = 0.95;
    this.jumpsMax = 2;

    this.jumpTimer = 2; // Time since last jump, for animation
}

EPhoenix.prototype = new Entity(new Vector(0, 0), new Vector(1.3, 1.3), 10, 1, 20, 10, 900, 0.8);
EPhoenix.prototype.constructor = EPhoenix;
EPhoenix.prototype._super_doJump = EPhoenix.prototype.doJump;
EPhoenix.prototype._super_takeDamage = EPhoenix.prototype.takeDamage;

EPhoenix.prototype.doJump = function(groundedJump) {
    this._super_doJump(groundedJump);

    this.jumpTimer = 0;
    this.animationTimer = 0;
}
EPhoenix.prototype.takeDamage = function(damage, knockback, source) {
    const ret = this._super_takeDamage(damage, knockback, source);
    this.animationTimer = 0;

    this.animationRow = 2;
    this.animationCol = 0;

    this.spriteUpscale += 0.5;

    return ret;
}

EPhoenix.prototype.tickAnimation = function(delta) {
    if (this.hp <= 0.1) { // Death animation
        this.animationTimer += delta * 3.5;

        this.spriteUpscale += delta * 3;

        this.animationRow = 2;
        this.animationCol = Math.min(Math.floor(this.animationTimer * 5), 4);

        console.log(this.animationCol);

    } else if (this.jumpTimer <= 1) { // Jump
        this.jumpTimer += delta * 5;

        this.animationRow = 1;
        this.animationCol = Math.min(Math.floor(this.jumpTimer * 3), 2);
    } else if (!this.grounded) { // Fall
        this.animationTimer += delta;

        this.animationRow = 1;
        this.animationCol = Math.floor(this.animationTimer % 5) + 5;
    } else if (this.getForce('EntityMotion') !== undefined) { // Walk / Run
        this.animationTimer += delta * (Math.abs(this.velocity.x) / this.terminalVelocity) * 15;

        this.animationRow = 0;
        this.animationCol = Math.floor(this.animationTimer % 5) + 5;
    } else {
        this.animationTimer += delta;

        this.animationRow = 0;
        this.animationCol = Math.floor(this.animationTimer % 5);
    }
}