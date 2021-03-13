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
Render.prototype.clearFrame = function() {
    this.context.fillStyle = '#000000';
    this.context.clearRect(0, 0, canvas.width, canvas.height);
}
/**
 * @function drawProp
 * @summary Draws the given prop
 * @param {Prop} obj Prop to draw
 */
Render.prototype.drawProp = function(obj) {
    const pos = this.getDrawPos(obj.getTopLeft());
    const size = this.getDrawSize(obj.size);

    this.context.fillStyle = '#999999';
    this.context.fillRect(pos.x, pos.y, size.x, size.y);
}


console.log("Module RENDER loaded");