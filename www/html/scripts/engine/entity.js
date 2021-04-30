/**
 * @name Entity
 * @class
 * @inheritdoc
 * @summary Physics Prop with health properties, terminal velocity, and controllers
 * @param {Vector} position Position of object
 * @param {Vector} size Size of object
 * @param {number} mass Mass of object in kilograms
 * @param {number} maxHP Maximum health of object
 * @param {number} jumpVelocity Y velocity set when a jump is performed
 * @param {number} maxVelocity Maximum horizontal velocity (0 for none)
 * @param {number} moveForce Max force movement can apply to this object
 * @param {number} airControl Proportion of move force that is usable while in the air
 */
function Entity(position, size, mass, maxHP, jumpVelocity, maxVelocity, moveForce, airControl) {
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
    this.terminalVelocity = maxVelocity;
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
    if (this.hp <= 0) return; // Don't jump if dead

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

    if (this.goalDir.length() > 0.1 && this.hp > 0) { // If movement is inputted, apply it (unless dead)
        if (this.goalDir.x < 0) this.flipped = true;
        else if (this.goalDir.x > 0) this.flipped = false;

        if (this.grounded) { // Grounded movement
            this.addForce("EntityMotion", this.goalDir.multiply(this.moveForce), 0.2);
        } else { // Air movement
            this.addForce("EntityMotion", this.goalDir.multiply(this.moveForce * this.airControl), 0.2);
        }
    } else {
        this.removeForce("EntityMotion"); // Stop force application
    }
}

/**
 * @function takeDamage
 * @summary Deals damage and knockback to this entity
 * @param {number} damage Damage this entity takes
 * @param {Vector} knockback Knockback to apply to this entity
 * @param {Prop} source Source of the damage
 * @returns {boolean} Returns true if the entity is killed, otherwise false
 */
Entity.prototype.takeDamage = function(damage, knockback, source) {
    this.hp -= damage;
    this.velocity = this.velocity.add(knockback);

    return (this.hp <= 0);
}

console.log("Module ENTITY loaded");