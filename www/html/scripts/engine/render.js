/**
 * Render - Used for drawing onto the canvas
*/

const TEXTURE_BackgroundWind = new Image(3000, 750);
TEXTURE_BackgroundWind.src = 'images/effects/background_wind.png';

/**
 * @name Render
 * @class
 * @classdesc Canvas handler for rendering.
 * @param {HTMLCanvasElement} canvas HTML Canvas Element
 * @param {number} aspect Inversed aspect ratio of canvas, i.e. 2:1 ratio is 0.5
 * @param {number} unitsWidth Number of engine units across this canvas is
 * @property {CanvasRenderingContext2D} context Rendering Context
 */
function Render(canvas, aspect = 0.5, unitsWidth = 15) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.aspectRatio = aspect; // Height per width
    this.maxWidth = unitsWidth; // Width of canvas in engine units
    this.maxHeight = this.maxWidth * this.aspectRatio;
    this.scaling = 1;

    this.screenWipeImage = new Image(1750, 1000);
    this.screenWipeImage.src = 'images/effects/screen_wipe.png';
    this.screenWipeImage.alt = '';

    this.screenWipeStart = new Vector(1, 1);
    this.screenWipeEnd = new Vector(-1, -1);
    this.screenWipeTimer = 0;

    this.background_wind_pos = 0;

    this.updateScaling();
}


// UTILITY //
/**
 * @function updateScaling
 * @summary Updates the canvas height and scaling according
 * to aspect ratio and max width
 */
Render.prototype.updateScaling = function() {
    this.maxHeight = this.maxWidth * this.aspectRatio;

    const wid = this.canvas.width;
    this.canvas.height = this.aspectRatio * wid;
    const hei = this.canvas.height;

    this.scaling = wid / this.maxWidth;
}
/**
 * @function getDrawPos
 * @summary Converts an engine position to a canvas position
 * @param {Vector} pos Input engine position
 * @returns {Vector} Output canvas position
 */
Render.prototype.getDrawPos = function(pos) {
    return new Vector(pos.x * this.scaling, this.canvas.height - pos.y * this.scaling);
}
/**
 * @function getDrawSize
 * @summary Converts an engine scale to a canvas scale
 * @param {Vector} size Size of object in engine units
 * @returns {Vector} New scaled size in canvas units
 */
Render.prototype.getDrawSize = function(size) {
    return new Vector(size.x * this.scaling, size.y * this.scaling);
}


// DRAWING //
/**
 * @function clearFrame
 * @summary Draws over entire frame with a solid color
 * @param {String} color Background color to clear to
 */
Render.prototype.clearFrame = function(color) {
    this.context.fillStyle = color;
    // this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.fillRect(0, 0, canvas.width, canvas.height);
}
/**
 * @function drawProp
 * @summary Draws the given prop
 * @param {Prop} obj Prop to draw
 */
Render.prototype.drawProp = function(obj) {
    const pos = this.getDrawPos(obj.getTopLeft());
    const size = this.getDrawSize(obj.size);

    if (obj.animated && obj.sprite) { // Draw animated sprite
        const framePosX = obj.spriteWidth * obj.animationCol; // Pick column
        const framePosY = obj.spriteHeight * (obj.animationRow * 2) + (obj.flipped * obj.spriteHeight);
        // ^ Pick row--each row has a flipped variant immediately after it, so we need to double the row position
        // Bools act as 1 or 0 in math operations, so we can easily get the flipped row position this way

        const xOffset = (1 - obj.spriteUpscale) * size.x;
        const yOffset = (1 - obj.spriteUpscale) * size.y;

        this.drawPropSpecificUnderlay(obj, pos, size, xOffset, yOffset);

        this.context.drawImage(obj.sprite,
            framePosX, framePosY, obj.spriteWidth, obj.spriteHeight, // Source positions, width, and height
            pos.x + xOffset, pos.y + yOffset, // Draw position
            size.x * obj.spriteUpscale, size.y * obj.spriteUpscale // Draw width + height
        );
    } else if (obj.sprite) { // Draw full sprite
        const xOffset = (1 - obj.spriteUpscale) * size.x / 2;
        const yOffset = (1 - obj.spriteUpscale) * size.y / 2;

        this.drawPropSpecificUnderlay(obj, pos, size, xOffset, yOffset);

        this.context.drawImage(obj.sprite,
            pos.x + xOffset, pos.y + yOffset, // Draw position
            size.x * obj.spriteUpscale, size.y * obj.spriteUpscale // Draw width + height
        );
    } else { // Draw placeholder rectangle
        this.context.fillStyle = '#999999';
        this.context.fillRect(pos.x, pos.y, size.x, size.y);
    }
}
/**
 * @function drawPropSpecificUnderlay
 * @summary Helper function. Draws prop-specific underlays in a single call
 * @param {Prop} obj 
 * @param {Vector} pos 
 * @param {Vector} size 
 * @param {number} xOffset 
 * @param {number} yOffset 
 */
Render.prototype.drawPropSpecificUnderlay = function(obj, pos, size, xOffset, yOffset) {
    if (obj instanceof OStormCloud) {
        this.drawProp_StormCloud(obj, pos, size, xOffset, yOffset);
    }
}


// PROP-SPECIFIC DRAWING //
/**
 * 
 * @param {OStormCloud} obj Storm Cloud object
 * @param {*} pos 
 * @param {*} size 
 */
Render.prototype.drawProp_StormCloud = function(obj, pos, size, xOffset, yOffset) {
    if (!obj.active) return; // Don't draw lightning if cloud is not active

    const lSize = this.getDrawSize(new Vector(obj.size.x, obj.lightningLength));
    pos = pos.clone(); // Don't edit data of original position
    pos.y += size.y / 2; // We want to start drawing from the vertical middle of the cloud

    this.context.drawImage(TEXTURE_StormCloudLightning,
        pos.x + xOffset, pos.y + yOffset, // Draw position
        lSize.x * obj.spriteUpscale, lSize.y * obj.spriteUpscale // Draw width + height
    );
}


// EFFECTS //
/**
 * @function setScreenWipe
 * @summary Set screen wipe position, in screen widths x screen heights. End position automatically determined
 * @param {Vector} newPos Start position of screen wipe
 */
Render.prototype.setScreenWipe = function(newPos) {
    this.screenWipeStart = newPos;
    this.screenWipeEnd = newPos.multiply(-1);
    this.screenWipeTimer = 1;
}
Render.prototype.tickScreenWipe = function(delta) {
    if (this.screenWipeTimer > 0) {
        this.screenWipeTimer -= delta * 0.95;

        const pos = this.screenWipeStart.lerp(this.screenWipeEnd, 1 - this.screenWipeTimer);

        const wid = this.canvas.width * 1.1666 * 1.25;
        const widOffset = (wid - this.canvas.width) / 2;
        const hei = this.canvas.height * 1.3333 * 1.25;
        const heiOffset = (hei - this.canvas.height) / 2;

        this.context.drawImage(this.screenWipeImage, pos.x * wid - widOffset, pos.y * hei - heiOffset, wid, hei);
    }
}

Render.prototype.drawBackgroundWind = function(delta, windSpeed) {
    this.background_wind_pos -= delta * windSpeed;
    if (this.background_wind_pos <= -2) this.background_wind_pos += 2; // Loop back to beginning

    this.context.globalAlpha = 0.5;

    const twoWidths = this.canvas.width * 2;

    // Draw left sprite
    this.context.drawImage(TEXTURE_BackgroundWind,
        this.background_wind_pos * this.canvas.width, 0,
        twoWidths, this.canvas.height
    );

    // Draw right sprite
    this.context.drawImage(TEXTURE_BackgroundWind,
        this.background_wind_pos * this.canvas.width + twoWidths, 0,
        twoWidths, this.canvas.height
    );

    this.context.globalAlpha = 1;
}


console.log("Module RENDER loaded");