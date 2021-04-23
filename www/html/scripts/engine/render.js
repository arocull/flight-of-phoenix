/**
 * Render - Used for drawing onto the canvas
*/

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

        this.context.drawImage(obj.sprite, framePosX, framePosY, obj.spriteWidth, obj.spriteHeight, pos.x, pos.y, size.x, size.y)
    } else if (obj.sprite) { // Draw full sprite
        this.context.drawImage(obj.sprite, pos.x, pos.y, size.x, size.y);
    } else { // Draw placeholder rectangle
        this.context.fillStyle = '#999999';
        this.context.fillRect(pos.x, pos.y, size.x, size.y);
    }
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


console.log("Module RENDER loaded");