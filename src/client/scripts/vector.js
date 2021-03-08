// Vector2 engine module designed by Alan O'Cull

/**
 * @function Vector
 * @summary Creates a new vector from the given X and Y parameters
 * @param {number} x X length / position 
 * @param {number} y Y length / position
 */
function Vector(x, y) {
    this.x = x;
    this.y = y;
}


// OBJECT DEPENDENT //
/**
 * @function VectorLength
 * @summary Returns the pythagorean length of this vector
 * @returns {number}
 */
Vector.prototype.length = function() {
    return Math.sqrt(this.x ** 2, this.y ** 2);
}
/**
 * @function VectorClamp
 * @summary Clamps this vector between the two given lengths
 * @param {number} min 
 * @param {number} max 
 */
Vector.prototype.clamp = function(min, max) {
    const len = this.length();
    this.x /= len; this.y /= len; // Get unit vector
    const newLen = Math.min(Math.max(len, min), max); // Clamp length
    this.x *= newLen; this.y *= newLen; // Apply new length
}
/**
 * @function VectorUnit
 * @summary Returns a normalized version of this vector with length 1
 * @returns {Vector} Normalized vector object
 */
Vector.prototype.unit = function() {
    const len = this.length();
    return new Vector(this.x / len, this.y / len);
}
/**
 * @function VectorClone
 * @summary Returns a copy of this vector
 * @returns {Vector} Copied vector object
 */
Vector.prototype.clone = function () {
    return new Vector(this.x, this.y);
}



// STATIC FUNCTIONS //
/**
 * @function VectorAdd
 * @summary Vector function A + B
 * @param {Vector} a
 * @param {Vector} b
 * @returns {Vector}
 */
Vector.prototype.add = function VectorAdd(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
}
/**
 * @function VectorSubtract
 * @summary Vector function A - B
 * @param {Vector} a
 * @param {Vector} b
 * @returns {Vector}
 */
Vector.prototype.subtract = function VectorSubtract(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
}
/**
 * @function VectorMultiplyV
 * @summary Vector function A * B
 * @param {Vector} a
 * @param {Vector} b
 * @returns {Vector}
 */
Vector.prototype.multiplyV = function VectorMultiplyV(a, b) {
    return new Vector(a.x * b.x, a.y * b.y);
}
/**
 * @function VectorMultiply
 * @summary Vector scalar function A * B
 * @param {Vector} a
 * @param {Vector} b Scalar
 * @returns {Vector}
 */
Vector.prototype.multiply = function VectorMultiply(a, b) {
    return new Vector(a.x * b, a.y * b);
}
/**
 * @function VectorDivideV
 * @summary Vector function A / B
 * @param {Vector} a
 * @param {Vector} b
 * @returns {Vector}
 */
Vector.prototype.divideV = function VectorDivideV(a, b) {
    return new Vector(a.x / b.x, a.y / b.y);
}
/**
 * @function VectorDivide
 * @summary Vector scalar function A / B
 * @param {Vector} a
 * @param {number} b Scalar
 * @returns {Vector}
 */
Vector.prototype.divide = function VectorDivide(a, b) {
    return new Vector(a.x / b, a.y / b);
}

console.log('VECTOR loaded');

export { Vector as default };