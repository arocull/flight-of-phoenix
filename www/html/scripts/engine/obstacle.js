/**
 * @name Obstacle
 * @class
 * @summary A static prop that does damage
 * @param {Vector} position Position of obstacle
 * @param {Vector} size Size of obstacle
 */
function Obstacle(position, size) {
    this.position = position;
    this.size = size;
    this.radius = size.length() / 2; // Recalculate radius
}

Obstacle.prototype = new Prop(new Vector(), new Vector(), true);
Obstacle.prototype.constructor = Obstacle;

/**
 * @function onHit
 * @summary Performs a function after another object collides into this object
 * @param {Prop} hit Other prop that hit this one
 */
Obstacle.prototype.onHit = function(hit) {
    if (hit instanceof Entity) {
        const knockback = (hit.position.subtract(this.position)).unit().multiply(10);
        hit.takeDamage(1, knockback, this);
    }
}