// Ray - 2D ray tracing for physics and effects, written by Alan O'Cull
// Referenced Luchadores code, also written by Alan O'Cull
// Resources used in Luchadores:
// Check plane collision https://stackoverflow.com/questions/23975555/how-to-do-ray-plane-intersection
// Other primitives https://www.cs.princeton.edu/courses/archive/spring14/cos426/lectures/12-ray.pdf


/**
 * @function TraceResult
 * @summary Struct for holding information about a ray trace
 */
function TraceResult() {
    this.position = new Vector(); // Position trace collided (or end of trace)
    this.normal = new Vector(); // Surface normal of object
    this.collided = false; // Whether or not a collision occurred
    this.distance = 0; // Distance the ray traveled
    this.hitInfo = null; // Object collided with (if any)
    this.topFaceCollision = false; // True if this was the top of an object (treat as floor) 
}


/**
 * @function Ray
 * @summary Ray object for performing traces
 * @param {Vector} start Start position of ray
 * @param {Vector} end End position of ray
 */
function Ray(start, end) {
    this.start = start;
    this.end = end;

    const dir = end.substract(start);
    this.length = dir.length();
    this.direction = dir.unit();
}

/**
 * @function RayClone
 * @summary Clones the ray object
 * @returns {Ray}
 */
Ray.prototype.clone = function() {
    return new Ray(start, end);
}

/**
 * @function RayTracePlane
 * @summary Performs a 2D ray trace on the given plane information
 * @param {Vector} center Center point of plane 
 * @param {Vector} normal Normalized direction the surface is facing
 * @param {boolean} dualSided If this is true, traces from either side of the normal are valid 
 * @returns {TraceResult} TraceResult
 */
Ray.prototype.tracePlane = function(center, normal, dualSided = false) {
    const result = new TraceResult();

    // Default result values (in case there is no hit)
    result.distance = this.length; // Ray went ful distance
    result.position = this.end; // Ray end position

    const denom = this.direction.dot(normal);
    if (denom < 0 || (dualSided && denom > 0)) { // Ray is facing plane, or not perpendicular if dual-sided
        const t = center.subtract(this.start).dot(normal) / denom;
        if (t >= 0) { // Trace hit plane, find collision position
            result.position = this.start.add(this.direction.multiply(t));
            result.normal = normal;
            result.distance = this.start.subtract(result.position).length();
            if (result.distance <= this.length) { // Ensure ray was long enough to hit plane
                result.collided = true;
            }
        }
    }

    return result;
}
/**
 * @function RayPointDistance
 * @summary Returns the distance of the given point to this ray
 * @description
 * Returns distance of the given point to this ray. Does not account
 * for ray start and end positions--it treats the ray as a line instead.
 * 
 * Unsure if this formula is correct for 2D.
 * @param {Vector} point Point for finding distance
 * @returns {number} Distance from point to ray
 */
Ray.prototype.pointDistance = function(point) {
    const cross = point.subtract(this.start);
    return this.direction.cross(cross);
}