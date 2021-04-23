/**
 * @name OStormCloud
 * @class
 * @inheritdoc
 * @summary (Obstacle) Storm Cloud, a position-and-place obstacle with built-in visuals and functionality
 * @param {Vector} position Position to place the stormcloud at
 * @param {number} timeOffset Time offset for animation (in seconds), to prevent all clouds looking the same
 */
function OStormCloud(position, timeOffset = Math.random()) {
    this.position = position;
    this.basePosition = position.clone();

    this.timer = timeOffset;
    this.animationTimer = timeOffset;

    this.spriteUpscale = 1.7;
    this.sprite = new Image(512, 512);
    this.sprite.src = 'images/sprites/storm_cloud.png';
    this.sprite.alt = 'Storm Cloud';
}

OStormCloud.prototype = new Obstacle(new Vector(), new Vector(4.25, 3));
OStormCloud.prototype.constructor = OStormCloud;

/**
 * @function tickAnimation
 * @summary Ticks the animation of this prop by the given amount of time
 * @description Does nothing by default--override in inherited objects
 * @param {number} DeltaTime Change in time since last frame
 */
OStormCloud.prototype.tickAnimation = function(DeltaTime) {
    this.animationTimer += DeltaTime;

}

/**
 * @function tick
 * @summary Ticks this prop by the given amount of time
 * @description Does nothing by default--override in inherited objects
 * @param {number} DeltaTime Change in time since last frame
 */
OStormCloud.prototype.tick = function(DeltaTime) {
    this.timer += DeltaTime;
    this.position.y = Math.sin(this.timer) * 0.75 + this.basePosition.y;
}