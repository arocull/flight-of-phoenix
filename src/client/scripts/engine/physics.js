// Physics Module
// This is essentially a static class

// Gravity constant, though modifiable
let PHYSICS_gravity = 20;

function PHYSICS_INTERNAL_propTrace() {

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

    for (let i = 0; i < dynamics.length; i++) {
        const obj = dynamics[i];
        const wasGrounded = obj.grounded;

        // Apply existing object forces
        obj.tickForces(delta);

        // Apply gravity (negative Y axis)
        obj.velocity.y -= PHYSICS_gravity * delta;
        obj.grounded = false;

        // Estimate new position
        let newPos = obj.position.add(obj.velocity.multiply(delta));

        // Ray for each corner
        // const topLeft = obj.getTopLeft();
        // const botRight = obj.getBotRight();
        // const ray1 = new Ray(topLeft, topLeft);
        const rayCenter = new Ray(obj.position, newPos);
        
        for (let x = 0; x < statics.length; x++) {
            const result = statics[x].trace(rayCenter, false, obj.radius / 2);
            if (result.collided) {
                newPos = obj.collide(result, statics[x], newPos);
            }
        }


        // Finally, apply new position
        obj.position = newPos;
    }
}


console.log("Module PHYSICS loaded");