// Vector2 engine module designed by Alan O'Cull

/**
 * @function Vector
 * @summary Creates a new vector from the given X and Y parameters
 * @param {number} x X length / position 
 * @param {number} y Y length / position
 */
function Vector(x = 0, y = 0) {
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
 * @param {number} min Minimum allowed length of the vector
 * @param {number} max Maximum allowed length of the vector
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



// ARITHEMATIC //
/**
 * @function VectorAdd
 * @summary Vector function A + B
 * @param {Vector} b
 * @returns {Vector}
 */
Vector.prototype.add = function VectorAdd(b) {
    return new Vector(this.x + b.x, this.y + b.y);
}
/**
 * @function VectorSubtract
 * @summary Vector function A - B
 * @param {Vector} a
 * @param {Vector} b
 * @returns {Vector}
 */
Vector.prototype.subtract = function VectorSubtract(b) {
    return new Vector(this.x - b.x, this.y - b.y);
}
/**
 * @function VectorMultiplyV
 * @summary Vector function A * B
 * @param {Vector} b
 * @returns {Vector}
 */
Vector.prototype.multiplyV = function VectorMultiplyV(b) {
    return new Vector(this.x * b.x, this.y * b.y);
}
/**
 * @function VectorMultiply
 * @summary Vector scalar function A * B
 * @param {Vector} b Scalar
 * @returns {Vector}
 */
Vector.prototype.multiply = function VectorMultiply(b) {
    return new Vector(this.x * b, this.y * b);
}
/**
 * @function VectorDivideV
 * @summary Vector function A / B
 * @param {Vector} b
 * @returns {Vector}
 */
Vector.prototype.divideV = function VectorDivideV(b) {
    return new Vector(this.x / b.x, this.y / b.y);
}
/**
 * @function VectorDivide
 * @summary Vector scalar function A / B
 * @param {number} b Scalar
 * @returns {Vector}
 */
Vector.prototype.divide = function VectorDivide(b) {
    return new Vector(this.x / b, this.y / b);
}


// ALGEBRAIC //
/**
 * @function VectorDotProduct
 * @summary Returns the dot product of these two vectors (A dot B)
 * @description
 * A dot product is used to determine the relation between two vectors.
 * 
 * If two normalized vectors are parallel, this returns 1.
 * 
 * If two normalized vectors are perpendicular, this returns 0.
 * 
 * If two normalized vectors are anti-paralle, this returns -1.
 * @param {Vector} b Vector to perform the Dot Product with
 * @returns {number} Number (any range, between -1 and 1 if both vectors are normalized)
 */
Vector.prototype.dot = function VectorDotProduct(b) {
    return this.x * b.x + this.y * b.y;
}
/**
 * @function VectorCrossProduct
 * @summary Returns the cross product of these two vectors (A X B)
 * @description
 * Cross products are used to find kind of a vector perpendicular to the two given.
 * They are more useful in 3D than 2D, but still a necessary function for raycasting.
 * I am unsure if this 2D formula is entirely correct, as in 3D this returns a vector.
 * 
 * Used this resource: https://www.quora.com/Can-you-cross-product-2D-vectors
 * @param {Vector} b Vector to perform the Cross Product with
 * @returns {number} Number
 */
Vector.prototype.cross = function VectorCrossProduct(b) {
    return this.x * b.y - this.y * b.x;
}

console.log('Module VECTOR loaded');