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
    this.radius = size.length();
    this.collidable = collidable;
}

/**
 * @function getTopLeft
 * @summary Returns the top left corner position of this prop
 * @returns {Vector}
 */
Prop.prototype.getTopLeft = function() {
    return this.position.subtract(this.size.divide(2));
}
/**
 * @function getBotRight
 * @summary Returns the bottom right corner position of this prop
 * @returns {Vector}
 */
Prop.prototype.getBotRight = function() {
    return this.position.add(this.size.divide(2));
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
 * @returns {boolean}
 */
Prop.prototype.isPointInside = function(point) {
    const topLeft = this.getTopLeft();
    const botRight = this.getBotRight();

    return (
        point.x >= topLeft.x &&
        point.y <= topLeft.y &&
        point.x <= botRight.x &&
        point.y >= botRight.y
    );
}

console.log("Module PROP loaded");