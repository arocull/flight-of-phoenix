
/**
 * @name PhysProp
 * @class
 * @extends Prop
 * @inheritdoc
 * @summary Dynamic object with position, size, velocity, acceleration, and mass
 * @param {Vector} position 2D center position of object, in game units
 * @param {Vector} size Width and height of object, in game units
 * @param {number} mass Weight of object in kilograms
 */
function PhysProp (position, size, mass) {
    this.position = position
    this.size = size;
    this.radius = size.length(); // Recalculate radius

    this.mass = mass;
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.elasticity = 0.5;
}

// Inherit Prop prototype
PhysProp.prototype = new Prop(new Vector(), new Vector(), true);
PhysProp.prototype.constructor = PhysProp;



console.log("Module PHYSPROP loaded");