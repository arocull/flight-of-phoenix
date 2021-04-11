/**
 * @name Entity
 * @class
 * @summary Physics Prop with health properties, terminal velocity, and controllers
 * @param {Vector} position Position of object
 * @param {Vector} size Size of object
 * @param {number} mass Mass of object in kilograms
 * @param {number} maxHP Maximum health of object
 * @param {number} jumpVelocity Y velocity set when a jump is performed
 * @param {number} moveForce Max force movement can apply to this object
 * @param {number} airControl Proportion of move force that is usable while in the air
 */
function Entity(position, size, mass, maxHP, jumpVelocity, moveForce, airControl) {
    this.position = position;
    this.size = size;
    this.radius = size.length() / 2; // Recalculate radius

    this.mass = mass;
    this.lastPosition = position;

    this.hpMax = maxHP;
    this.hp = maxHP;

    this.jumpsMax = 1; // Maximum number of double jumps
    this.jumpsUsed = 0;
    this.jumpVelo = jumpVelocity;
    this.moveForce = moveForce;
    this.airControl = airControl;
    this.goalDir = new Vector(0, 0);
}

// Inherit PhysProp prototype
Entity.prototype = new PhysProp(new Vector(), new Vector(), 1);
Entity.prototype.constructor = Entity;


/**
 * @function doJump
 * @summary Forces a jump
 * @param {boolean} groundedJump True if jump was off the ground, false if air jump
 */
Entity.prototype.doJump = function(groundedJump) {
    this.velocity.y = this.jumpVelo;
    this.position.y += 0.01; // Slight offset to prevent ray-traces from snapping back to object surfaces
}
/**
 * @function jump
 * @summary Attempts to perform a jump off the ground, or a double jump.
 */
Entity.prototype.jump = function() {
    if (this.grounded) {
        this.doJump(true);
    } else if (this.jumpsUsed < this.jumpsMax) {
        this.doJump(false);
        this.jumpsUsed++;
    }
}
/**
 * @function land
 * @summary Called whenever this object lands on a surface
 */
Entity.prototype.land = function() {
    this.grounded = true;
    this.jumpsUsed = 0;
}

/**
 * @function move
 * @summary Sets entities goal movement direction
 * @param {Vector} dir Vector direction to move
 */
Entity.prototype.move = function(dir) {
    this.goalDir = dir.unit(); // Normalize vector. If you prefer a range (i.e. joystick), use .clamp(0, 1) instead
}
/**
 * @function tickMovement
 * @summary Ticks entity movement, updates force application and manages air control
 */
Entity.prototype.tickMovement = function() {
    if (this.grounded) this.jumpsUsed = 0;

    if (this.goalDir.length() > 0.1) {
        if (this.grounded) { // Grounded movement
            this.addForce("EntityMotion", this.goalDir.multiply(this.moveForce), 0.2);
        } else { // Air movement
            this.addForce("EntityMotion", this.goalDir.multiply(this.moveForce * this.airControl), 0.2);
        }
    } else {
        this.removeForce("EntityMotion"); // Stop force application
    }
}

console.log("Module ENTITY loaded");