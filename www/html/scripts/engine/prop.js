// Prop - Static object with position and size, optional collisions

/**
 * @function Prop
 * @summary Static object with position and size
 * @param {Vector} position 2D center position of object, in game units
 * @param {Vector} size Width and height of object, in game units
 * @param {boolean} collidable If true, physics props can collide with this object
 */
function Prop(position, size, collidable = true) {
    /** @type {Vector} */
    this.position = position;
    /** @type {Vector} */
    this.size = size;
    this.radius = size.length() / 2;
    this.collidable = collidable;

    this.elasticity = 0.1;
    this.friction = 0.9;

    /** @description Animation only, will draw sprite backwards if true */
    this.flipped = false;

    /** @type {HTMLImageElement} */
    this.sprite = undefined;
    /** @description Sprite width, used for animation */
    this.spriteWidth = 512;
    /** @description Sprite height, used for animation */
    this.spriteHeight = 512;
    /** @description Sprite upscale */
    this.spriteUpscale = 1;
    /** @description Set to true if this sprite should use SpriteWidth + SpriteHeight */
    this.animated = false;
    /** @description Row of sprite to draw for animation */
    this.animationRow = 0;
    /** @description Column of sprite to draw for animation */
    this.animationCol = 0;
    /** @description General-use timer for animation */
    this.animationTimer = 0;

    this.alpha = 1;
}

/**
 * @function getTopLeft
 * @summary Returns the top left corner position of this prop
 * @returns {Vector}
 */
Prop.prototype.getTopLeft = function() {
    return new Vector(this.position.x - this.size.x / 2, this.position.y + this.size.y / 2);
}
/**
 * @function getBotRight
 * @summary Returns the bottom right corner position of this prop
 * @returns {Vector}
 */
Prop.prototype.getBotRight = function() {
    return new Vector(this.position.x + this.size.x / 2, this.position.y - this.size.y / 2);
}
/**
 * @function setSize
 * @summary Changes the size of the prop
 * @description
 * Changes the size of the prop, and updates its radius value
 * 
 * This function is not required for non-collideable props,
 * but is required for calculating potential physics collisions.
 * @param {Vector} newSize
 */
Prop.prototype.setSize = function(newSize) {
    this.size = newSize;
    this.radius = size.length();
}
/**
 * @function isPointInside
 * @summary Returns true if the given point is inside the prop, false otherwise
 * @param {Vector} point Point to test
 * @param {number} radiusBoost Numeric boost to detection radius, ideal for big targets
 * @returns {boolean}
 */
Prop.prototype.isPointInside = function(point, radiusBoost = 0) {
    const topLeft = this.getTopLeft();
    const botRight = this.getBotRight();

    return (
        point.x + radiusBoost >= topLeft.x &&
        point.y - radiusBoost <= topLeft.y &&
        point.x - radiusBoost <= botRight.x &&
        point.y + radiusBoost >= botRight.y
    );
}
/**
 * @function getPlaneCenter
 * @summary Quickly returns a point on the given side of this object
 * @param {number} xDirection Horizontal size offset multiplier, ideally -1 or 1
 * @param {number} yDirection Vertical size offset multiplier, ideally -1 or 1
 * @returns {Vector} Returns the center point of this face or corner
 */
Prop.prototype.getPlaneCenter = function(xDirection, yDirection) {
    return new Vector(
        this.position.x + (xDirection * this.size.x / 2),
        this.position.y + (yDirection * this.size.y / 2)
    );
}


/**
 * @function trace
 * @summary Performs a ray-trace on this object with the given ray
 * @param {Ray} ray Ray for testing collision with
 * @param {boolean} dualSided Whether to perform a dual-sided or single-sided trace
 * @param {number} radiusBoost Numeric boost to collision radius, ideal for big objects
 * @returns {TraceResult} Returns a trace result if there was a successful collision, or null
 */
Prop.prototype.trace = function(ray, dualSided = false, radiusBoost = 0) {
    const traces =  []; // Create list of all four traces

    traces.push(this.handlePlaneTrace(ray, EVectorDirection.up, dualSided, radiusBoost));
    traces.push(this.handlePlaneTrace(ray, EVectorDirection.left, dualSided, radiusBoost));
    traces.push(this.handlePlaneTrace(ray, EVectorDirection.right, dualSided, radiusBoost));
    traces.push(this.handlePlaneTrace(ray, EVectorDirection.down, dualSided, radiusBoost));

    if (traces[0] !== undefined) { // Top-face traces have a special property to indicate that the prop is grounded 
        traces[0].topFaceCollision = true;
    }


    let finalTrace = new TraceResult(); // Allocate a final trace
    finalTrace.distance = 1000;

    // Go through all traces and get the closest collision (prevents top-face collisions from always taking priority)
    for (let i = 0; i < traces.length; i++) {
        if (traces[i] && traces[i].distance < finalTrace.distance) {
            finalTrace = traces[i];
        }
    }

    return finalTrace; // Return final collision
}
/**
 * @function handlePlaneTrace
 * @summary Helper function for trace function
 * @description Traces the current object with the given ray and returns either a TraceResult or null
 * @param {Ray} ray Ray to perform trace with, can be a regular Ray, or a RayBox
 * @param {Vector} dir Plane surface normal direction (gets plane center using this automatically)
 * @param {boolean} dualSided Is this a trace with dual-sided normals?
 * @param {number} radiusBoost Numeric boost to trace radius
 * @returns {TraceResult} Final trace result, or undefined if none occurred
 */
Prop.prototype.handlePlaneTrace = function(ray, dir, dualSided, radiusBoost) {
    // Gather all trace results--we get multiple because a RayBox can result in multiple trace results
    const traces = ray.tracePlane(this.getPlaneCenter(dir.x, dir.y), dir, dualSided, radiusBoost);
    
    // We want to find the closest result that hit this object
    let finalTrace = undefined;
    for (let i = 0; i < traces.length; i++) {
        const trace = traces[i];

        if (trace.collided && this.isPointInside(trace.position, radiusBoost)) {
            if (finalTrace === undefined) { // If no final trace has been selected, select this trace since it actually hit the object
                finalTrace = trace;
            } else if (trace.distance < finalTrace.distance) { // If this collision was closer, use this collision instead!
                finalTrace = trace;
            }
        }
    }

    if (finalTrace) { // If the trace hit this object, default hitInfo to this object
        finalTrace.hitInfo = this;
    }

    return finalTrace;
}


/**
 * @function tickAnimation
 * @summary Ticks the animation of this prop by the given amount of time
 * @description Does nothing by default--override in inherited objects
 * @param {number} DeltaTime Change in time since last frame
 */
Prop.prototype.tickAnimation = function(DeltaTime) {
    // Does nothing by default
}

/**
 * @function tick
 * @summary Ticks this prop by the given amount of time
 * @description Does nothing by default--override in inherited objects
 * @param {number} DeltaTime Change in time since last frame
 */
Prop.prototype.tick = function(DeltaTime) {

}

/**
 * @function onHit
 * @summary Performs a function after another object collides into this object
 * @param {Prop} hit Other prop that hit this one
 */
Prop.prototype.onHit = function(hit) {

}

console.log("Module PROP loaded");