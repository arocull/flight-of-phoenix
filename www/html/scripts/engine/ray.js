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

    const dir = end.subtract(start);
    this.length = dir.length();
    this.direction = dir.unit();
}

/**
 * @function clone
 * @summary Clones the ray object
 * @returns {Ray}
 */
Ray.prototype.clone = function() {
    return new Ray(start, end);
}

/**
 * @function tracePlaneSingle
 * @summary Performs a 2D ray trace on the given plane information (BUT RETURNS SINGLE OBJECT, NOT ARRAY)
 * @param {Vector} center Center point of plane 
 * @param {Vector} normal Normalized direction the surface is facing
 * @param {boolean} dualSided If this is true, traces from either side of the normal are valid 
 * @param {number} radiusBoost Adds to the maximum check distance
 * @returns {TraceResult} TraceResult (SINGLE OBJECT)
 */
Ray.prototype.tracePlaneSingle = function(center, normal, dualSided = false, radiusBoost = 0) {
    const result = new TraceResult();

    // Default result values (in case there is no hit)
    result.distance = this.length; // Ray went the full distance
    result.position = this.end; // Ray end position

    const denom = this.direction.dot(normal);
    if (denom < 0 || (dualSided && denom > 0)) { // Ray is facing plane, or not perpendicular if dual-sided
        const t = (center.subtract(this.start)).dot(normal) / denom;
        if (t >= 0) { // Trace hit plane, find collision position
            result.position = this.start.add(this.direction.multiply(t));
            result.normal = normal;
            result.distance = this.start.subtract(result.position).length();
            if (result.distance <= this.length + radiusBoost) { // Ensure ray was long enough to hit plane
                result.collided = true;
            }
        }
    }

    return result;
}
/**
 * @function tracePlane
 * @summary Performs a 2D ray trace on the given plane information
 * @param {Vector} center Center point of plane 
 * @param {Vector} normal Normalized direction the surface is facing
 * @param {boolean} dualSided If this is true, traces from either side of the normal are valid 
 * @param {number} radiusBoost Adds to the maximum check distance
 * @returns {TraceResult[]} TraceResult (ARRAY)
 */
Ray.prototype.tracePlane = function(center, normal, dualSided = false, radiusBoost = 0) {
    return [this.tracePlaneSingle(center, normal, dualSided, radiusBoost)];
}
/**
 * @function pointDistance
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



/**
 * @function RayBox
 * @summary Box-shaped ray object for performing traces
 * @extends Ray
 * @inheritdoc
 * @param {Vector} start Start position of ray
 * @param {Vector} end End position of ray
 * @param {Vector} dimensions Physical dimensions of box (width, height)
 */
function RayBox(start, end, dimensions) {
    this.startOrigin = start;
    this.endOrigin = end;

    const dir = end.subtract(start);
    this.length = dir.length();
    this.direction = dir.unit();

    const topRight = new Vector(dimensions.x / 2, dimensions.y / 2); // Declare once so we don't have to keep dividing dimensions
    this.offsets = [
        topRight,
        new Vector(-topRight.x, topRight.y),
        new Vector(-topRight.x, -topRight.y),
        new Vector(topRight.x, -topRight.y),
        new Vector(0, 0), // Also do center position, just in case
    ];

    this.offsets[0].y -= 0.001;  // Offset top trace starts slightly downward so they do not stick to ceilings
    this.offsets[1].y -= 0.001;

    // Pre-compute start and end positions for all four corners
    this.starts = [];
    this.ends = [];
    for (let i = 0; i < 5; i++) {
        this.starts.push(
            start.add(
                this.offsets[i] // Offset by cube position
            )
        );
        this.ends.push(end.add(this.offsets[i]));
    }
}

// Inherit Prop prototype
RayBox.prototype = new Ray(new Vector(), new Vector());
RayBox.prototype.constructor = RayBox;

/**
 * @function tracePlane
 * @summary Performs a 2D box-trace on the given plane information
 * @param {Vector} center Center point of plane 
 * @param {Vector} normal Normalized direction the surface is facing
 * @param {boolean} dualSided If this is true, traces from either side of the normal are valid 
 * @param {number} radiusBoost Adds to the maximum check distance
 * @returns {TraceResult[]} TraceResult
 */
RayBox.prototype.tracePlane = function(center, normal, dualSided = false, radiusBoost = 0) {
    /** @type {TraceResult[]} */
    let results = [];

    for (let i = 0; i < 5; i++) {
        // Update start and end variables for current corner so we can use inherited trace function
        this.start = this.starts[i];
        this.end = this.ends[i];
        
        // Trace the plane from this box corner
        const lastResult = this.tracePlaneSingle(center, normal, dualSided, radiusBoost);

        // Add trace result to list
        // Normally I tried filtering for the closest result here, but that led to issues
        // What if the closest trace result hit the plane, but not the object (since planes are infinite)?
        results.push(lastResult);
    }

    // Return trace result array
    return results;
}

console.log("Module RAY loaded");