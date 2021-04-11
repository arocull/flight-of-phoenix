/**
 * @name Force
 * @class
 * @summary A force with duration
 * @param {Vector} force Force vector, in Newtons
 * @param {number} duration Duration of force, in time
*/
function Force(force, duration) {
    this.force = force;
    this.duration = duration;
}

/**
 * @function getImpulse
 * @summary Returns the impulse of the given force
 * @param {number} delta Change in time in seconds
 * @returns {Vector} Impulse, in newton seconds
 */
Force.prototype.getImpulse = function(delta) {
    const t = Math.max(Math.min(delta, this.duration), 0);
    this.duration -= t;
    return this.force.multiply(t);
}


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
    this.position = position;
    this.size = size;
    this.radius = size.length() / 2; // Recalculate radius

    this.mass = mass;
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.elasticity = 0.5;
    this.grounded = false;

    this.lastPosition = position;

    // Use map object for forces (so we can organize them)
    /** @type {Map<String, Force>} */
    this.forces = new Map();
}

// Inherit Prop prototype
PhysProp.prototype = new Prop(new Vector(), new Vector(), true);
PhysProp.prototype.constructor = PhysProp;


// FORCE MANAGEMENT //
/**
 * @function applyImpulse
 * @summary Applies a given impulse on the object
 * @param {Vector} impulse Impulse on object, in Newton seconds
 */
PhysProp.prototype.applyImpulse = function(impulse) {
    this.velocity = this.velocity.add(impulse.divide(this.mass));
}
/**
 * @function tickForces
 * @summary Applies impulses from current forces, and removes expired forces
 * @param {number} delta Change in time in seconds
 */
PhysProp.prototype.tickForces = function(delta) {
    let impulseTotal = new Vector();

    // Iterate through each force (since it's a Map, we cannot use a regular for loop)
    this.forces.forEach( (force, key, forces) => {
        impulseTotal = impulseTotal.add(force.getImpulse(delta));

        // Remove force from object if it has expired
        if (force.duration <= 0) {
            forces.delete(key);
        }
    });

    this.applyImpulse(impulseTotal);
}
/**
 * @function addForce
 * @summary Adds the given force to the object. If the force already exists,
 * it updates the force's vector (if defined), and adds to the force duration
 * @param {string} forceName Label/Key for force
 * @param {Vector} forceVector Force Vector, leave undefined if you do not want to change it
 * @param {number} forceDuration Force duration, leave undefined if you do not want to change
 * @returns {Force} Force object affected / created
*/
PhysProp.prototype.addForce = function(forceName, forceVector, forceDuration) {
    if (this.forces.has(forceName)) {
        if (forceVector) this.forces.get(forceName).force = forceVector;
        this.forces.get(forceName).duration += forceDuration;
    } else if (forceVector) {
        this.forces.set(forceName, new Force(forceVector, forceDuration));
    }
    return this.forces.get(forceName);
}
/**
 * @function removeForce
 * @summary Removes the given force from the object's force list
 * @param {string} forceName Label of force to remove
*/
PhysProp.prototype.removeForce = function(forceName) {
    this.forces.delete(forceName);
}

/**
 * @function collide
 * @summary Collides this physics prop with the given prop
 * @param {TraceResult} collision Collision trace result
 * @param {Prop} b Prop to collide with
 * @param {Vector} currentPos Current position being considered for collision
 */
PhysProp.prototype.collide = function(collision, b, currentPos) {
    if (collision.topFaceCollision) {
        //currentPos.y = b.position.y + b.size.y / 2 + this.size.y / 2;
        currentPos.y = collision.position.y + this.size.y / 2;
        this.velocity.y = 0;
        this.land();
    } else {
        if (collision.normal.y < -0.9) { // Bottom face collision, snap to bottom
            currentPos.y = collision.position.y - this.size.y / 2;
        } else if (collision.normal.x < -0.9) { // Left face collision
            currentPos.x = collision.position.x - this.size.x / 2;
        } else if (collision.normal.x > 0.9) { // Right face collision
            currentPos.x = collision.position.x + this.size.x / 2;
        } else { // Try to position box around the prop as a circle haha
            currentPos = b.position.add(
                collision.normal.multiply(b.radius + this.radius)
            )
        }

        this.velocity = this.velocity.subtract(
            collision.normal.multiply(
                collision.normal.dot(this.velocity.unit()) * this.velocity.length() 
                * (1 + (this.elasticity + b.elasticity) / 2)
            )
        );
    }

    return currentPos;
}



// PROP FUNCTIONS //
/**
 * @function land
 * @summary Called whenever this object lands on a surface
 */
PhysProp.prototype.land = function() {
    this.grounded = true;
}


console.log("Module PHYSPROP loaded");