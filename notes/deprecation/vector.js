// Created by Alan O'Cull
// Vector module for 2D math and positioning

// This vector module is unused because static class functions
// are not supported in Safari browsers.
// Assuming we need to test this on mobile (as we need to
// package this into an app), we can not effectively test code
// that is not supported. Thus, we are using prototypes instead.
// This, however, can remain as a reference.

/**
 * @name Vector
 * @class
 * @summary A 2D number used for arithematic
 */
class Vector {
    /**
     * @constructor
     * @summary Creates a new vector from the given X and Y parameters
     * @param {number} x X length / position 
     * @param {number} y Y length / position
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }


    /**
     * @function VectorLength
     * @summary Returns the pythagorean length of this vector
     * @returns {number}
     */
    length() {
        return Math.sqrt(this.x ** 2, this.y ** 2);
    }
    /**
     * @function VectorClamp
     * @summary Clamps this vector between the two given lengths
     * @param {number} min 
     * @param {number} max 
     */
    clamp(min, max) {
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
    unit() {
        const len = this.length();
        return new Vector(this.x / len, this.y / len);
    }
    /**
     * @function VectorClone
     * @summary Returns a copy of this vector
     * @returns {Vector} Copied vector object
     */
    clone () {
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
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }
    /**
     * @function VectorSubtract
     * @summary Vector function A - B
     * @param {Vector} a
     * @param {Vector} b
     * @returns {Vector}
     */
    static subtract(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }
    /**
     * @function VectorMultiplyV
     * @summary Vector function A * B
     * @param {Vector} a
     * @param {Vector} b
     * @returns {Vector}
     */
    static multiplyV(a, b) {
        return new Vector(a.x * b.x, a.y * b.y);
    }
    /**
     * @function VectorMultiply
     * @summary Vector scalar function A * B
     * @param {Vector} a
     * @param {number} b Scalar
     * @returns {Vector}
     */
    static multiply(a, b) {
        return new Vector(a.x * b, a.y * b);
    }
    /**
     * @function VectorDivideV
     * @summary Vector function A / B
     * @param {Vector} a
     * @param {Vector} b
     * @returns {Vector}
     */
    static divideV(a, b) {
        return new Vector(a.x / b.x, a.y / b.y);
    }
    /**
     * @function VectorDivide
     * @summary Vector scalar function A / B
     * @param {Vector} a
     * @param {number} b Scalar
     * @returns {Vector}
     */
    static divide(a, b) {
        return new Vector(a.x / b, a.y / b);
    }
}

export { Vector as default };