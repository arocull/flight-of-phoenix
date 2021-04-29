// Physics Module
// This is essentially a static class

// Gravity constant, though modifiable
let PHYSICS_gravity = 70;
let PHYSICS_friction = 100;

function PHYSICS_INTERNAL_propTrace() {

}
/**
 * @function PHYSICS_INTERNAL_sortCollision
 * @summary Compares two TraceResult lengths
 * @param {TraceResult} a Result A
 * @param {TraceResult} b Result B
 * @returns {number}
 */
function PHYSICS_INTERNAL_sortCollision(a, b) {
    return b.length - a.length;
}

/**
 * @function PHYSICS_tick
 * @summary Ticks physics by the given amount of time
 * @param {number} delta Change in time since last frame
 * @param {PhysProp[]} dynamics Moving PhysProp object array
 * @param {Prop[]} statics Non-moving Prop object array
 */
function PHYSICS_tick(delta, dynamics, statics) {
    // const collideables = [].concat(dynamics, statics); // Combine both arrays for collision detection

    // First, calculate all new physics positions
    for (let i = 0; i < dynamics.length; i++) {
        const obj = dynamics[i];
        const wasGrounded = obj.grounded;

        if (obj instanceof Entity) { // Update entity movement
            obj.tickMovement();
        }

        obj.lastPosition = obj.position;

        // Apply existing object forces
        obj.tickForces(delta);

        // Apply gravity (negative Y axis)
        obj.velocity.y -= PHYSICS_gravity * delta;
        obj.grounded = false;

        // Apply friction
        if (wasGrounded) {
            const veloX = Math.abs(obj.velocity.x); // Get horizontal speed

            // Get frictional force
            let fricForce = Math.max(2 - Math.log(veloX + 1), 0.6);

            // Apply friction as an acceleration
            let fricAccel = fricForce * PHYSICS_friction * delta * ((obj.groundedFriction + obj.friction) / 2);

            // Make sure change in velocity by friction isn't any greater than velocity itself
            if (fricAccel > veloX) fricAccel = veloX;

            // Give slight acceleration boost to player if they are trying to move from a low velocity
            if (fricForce > 1 && obj instanceof Entity && obj.getForce("EntityMotion")) {
                fricAccel *= Math.max(1 - fricForce * 2, 0);
            }


            // Apply friction to velocity
            obj.velocity.x -= fricAccel * Math.sign(obj.velocity.x);
        }

        let deltaPos = obj.velocity.multiply(delta); // Get change in position
        if (obj.terminalVelocity > 0 && Math.abs(deltaPos.x) > obj.terminalVelocity * delta) { // If object has a terminal velocity...
            // Clamp horizontal velocity and position to fit it
            deltaPos.x = obj.terminalVelocity * Math.sign(deltaPos.x) * delta;
            obj.velocity.x = obj.terminalVelocity * Math.sign(obj.velocity.x);
        }

        // Estimate new position
        obj.position = obj.position.add(deltaPos);
    }


    // COLLISIONS //
    // Then, go through and check positions
    for (let i = 0; i < dynamics.length; i++) {
        const obj = dynamics[i];
        const rayCenter = new RayBox(obj.lastPosition, obj.position, obj.size);

        /** @type {TraceResult[]} */
        let results = [];
        
        for (let x = 0; x < statics.length; x++) {
            if (statics[x].collidable) {
                const result = statics[x].trace(rayCenter, false, 0);
                if (result.collided) {
                    results.push(result);
                }
            }
        }

        // Sort collisions from furthest to closest
        results.sort(PHYSICS_INTERNAL_sortCollision);

        // Perform collisions furthest to closest
        for (let x = 0; x < results.length; x++) {
            obj.position = obj.collide(results[x], results[x].hitInfo, obj.position);
        }
    }
}


console.log("Module PHYSICS loaded");