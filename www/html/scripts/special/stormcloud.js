// Pre-load texture, and only use one instance of the texture to reduce overhead
const TEXTURE_StormCloud = new Image(540, 540);
TEXTURE_StormCloud.src = 'images/sprites/storm_cloud.png'; // File paths referenced from HTML document's position
TEXTURE_StormCloud.alt = 'Storm Cloud'; // Alt-text, dunno why we would need this but here it is just in case

// Draw actual thunder as a separate sprite, since it is actually below the cloud position
const TEXTURE_StormCloudLightning = new Image(540, 540);
TEXTURE_StormCloudLightning.src = 'images/sprites/storm_cloud_lightning.png';
TEXTURE_StormCloudLightning.alt = 'Lightning Bolt';

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

    this.spriteUpscale = 1.2;
    this.spriteUpscaleBase = this.spriteUpscale;
    this.sprite = TEXTURE_StormCloud; // Use pre-loaded asset

    /**
     * @type {number}
     * @description Length of lightning bolt, in engine units (starts from middle of cloud, ends at tip of bolt)
     */
    this.lightningLength = 4;

    /**
     * @type {boolean}
     * @description If true, this cloud will damage the player, and the renderer will draw lightning beneath it
     */
    this.active = true;
}

OStormCloud.prototype = new Obstacle(new Vector(), new Vector(2.5, 2));
OStormCloud.prototype.constructor = OStormCloud;
OStormCloud.prototype._super_onHit = Obstacle.prototype.onHit; // Store on-hit function since we will be overriding it

/**
 * @function onHit
 * @summary Performs a function after another object collides into this object
 * @param {Prop} hit Other prop that hit this one
 */
OStormCloud.prototype.onHit = function(hit) {
    if (this.active) { // Only damage when cloud is active
        this._super_onHit(hit);
    }
}

/**
 * @function tickAnimation
 * @summary Ticks the animation of this prop by the given amount of time
 * @description Does nothing by default--override in inherited objects
 * @param {number} DeltaTime Change in time since last frame
 */
OStormCloud.prototype.tickAnimation = function(DeltaTime) {
    this.animationTimer += DeltaTime;
    this.spriteUpscale = this.spriteUpscaleBase + Math.cos(this.animationTimer / 1.3) * 0.05;
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

    if (this.active && player) {
        const boltEnd = this.position.clone();
        boltEnd.y -= this.lightningLength * 0.97; // Get position of where the bolt ends

        const leftRayPos = this.position.clone();
        leftRayPos.x -= this.size / 2;
        const rightRayPos = this.position.clone();
        rightRayPos.x += this.size / 2;

        // Form a triangle of rays
        const rays = [
            new Ray(leftRayPos, boltEnd),
            new Ray(this.position, boltEnd),
            new Ray(rightRayPos, boltEnd),
        ];

        for (let i = 0; i < rays.length; i++) {
            const result = player.trace(rays[i], true, 0);
            if (result && result.collided) {
                player.velocity = new Vector(0, 0); // Zero out player velocity as a fun effect
                this.onHit(player); // Play on-hit effect
                break; // End loop
            }
        }
    }
}