// Prop - Static object with position and size, optional collisions

/**
 * @function Prop
 * @summary Static object with position and size
 * @param {Vector} position 2D center position of object, in game units
 * @param {Vector} size Width and height of object, in game units
 * @param {boolean} collidable If true, physics props can collide with this object
 */
function Prop(position, size, collidable = true) {
    this.position = position;
    this.size = size;
    this.radius = size.length() / 2;
    this.collidable = collidable;

    this.elasticity = 0.1;
    this.friction = 0.5;
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

    // Trace top side of object
    const topTrace = ray.tracePlane(this.getPlaneCenter(0, 1), EVectorDirection.up, dualSided, radiusBoost);
    if (topTrace.collided && this.isPointInside(topTrace.position, radiusBoost)) {
        topTrace.hitInfo = this;
        topTrace.topFaceCollision = true;
        return topTrace;
    }

    const leftTrace = ray.tracePlane(this.getPlaneCenter(-1, 0), EVectorDirection.left, dualSided, radiusBoost);
    if (leftTrace.collided && this.isPointInside(leftTrace.position, radiusBoost)) {
        leftTrace.hitInfo = this;
        return leftTrace;
    }

    const rightTrace = ray.tracePlane(this.getPlaneCenter(1, 0), EVectorDirection.right, dualSided, radiusBoost);
    if (rightTrace.collided && this.isPointInside(rightTrace.position, radiusBoost)) {
        rightTrace.hitInfo = this;
        return rightTrace;
    }

    const botTrace = ray.tracePlane(this.getPlaneCenter(0, -1), EVectorDirection.down, dualSided, radiusBoost);
    if (botTrace.collided && this.isPointInside(botTrace.position, radiusBoost)) {
        botTrace.hitInfo = this;
        return botTrace;
    }


    return new TraceResult(); // Nothing collided
}

console.log("Module PROP loaded");