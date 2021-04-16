// Physics Module
// This is essentially a static class

// Gravity constant, though modifiable
let PHYSICS_gravity = 50;

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
            const veloX = Math.abs(obj.velocity.x);
            let fricForce = Math.max(10 - Math.log(3 * veloX + 1), 0)  * ((obj.groundedFriction + obj.friction ) / 2) * delta;
            if (obj instanceof Entity && !obj.getForce("EntityMotion")) { // Entities should have more slowdown when not moving
                fricForce *= 3;
            }
            const newVelo = Math.max(Math.abs(veloX - fricForce), 0);
            obj.velocity.x = newVelo * Math.sign(obj.velocity.x);
        }

        let deltaPos = obj.velocity.multiply(delta);
        if (obj.terminalVelocity > 0 && Math.abs(deltaPos.x) > obj.terminalVelocity * delta) {
            deltaPos.x = obj.terminalVelocity * Math.sign(deltaPos.x) * delta;
            obj.velocity.x = obj.terminalVelocity * Math.sign(obj.velocity.x);
        }
        // deltaPos.clamp(obj.terminalVelocity * delta, obj.terminalVelocity * delta);
        // obj.velocity.clamp(obj.terminalVelocity, obj.terminalVelocity);

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
            const result = statics[x].trace(rayCenter, false, 0);
            if (result.collided) {
                results.push(result);
            }
        }

        // Sort collisions from furthest to closest
        results.sort(PHYSICS_INTERNAL_sortCollision);

        // Perform collisions furthest to closest
        for (let x = 0; x < results.length; x++) {
            obj.position = obj.collide(results[x], results[x].hitInfo, obj.position);
        }

        /*if (closestResult && closestResult.hitInfo) {
            const collidedWith = closestResult.hitInfo;
            obj.position = obj.collide(closestResult, collidedWith, obj.position);
            //console.log(closestResult);
            //console.log(rayCenter);
        }*/

        // Finally, apply new position
        // obj.position = newPos;
    }
}


console.log("Module PHYSICS loaded");