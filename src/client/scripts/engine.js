/* Engine created by Alan O'Cull for CGT 141 class at Purdue University
 *
 * I used online resources to learn specific practices in JavaScript
 * like prototypes and inheritance.
 * 
 * https://www.tutorialsteacher.com/javascript/prototype-in-javascript
 * https://www.tutorialsteacher.com/javascript/inheritance-in-javascript
*/


// DECLARE GLOBALS //
/** @type {HTMLCanvasElement} */
let canvas;
/** @type {Render} */
let render;
/** @type {Prop[]} */
const background = [];
/** @type {Prop[]} */
const props = [];

// GAME LOOP //
let lastTime = 0;
function doFrame(newTime) {
    // Get change in time, and convert it to seconds
    const deltaTime = (newTime - lastTime) / 1000;
    // Update lastTime to this new time
    lastTime = newTime;


    // GAME LOOP //


    // DRAWING //

    // Update Frame Size by changing canvas height to stay proportional with width
    // Also update drawing proportions
    render.updateScaling();


    // Draw background props
    for (let i = 0; i < background.length; i++) {
        render.drawProp(background[i]);
    }
    // Draw actual props
    for (let i = 0; i < props.length; i++) {
        render.drawProp(props[i]);
    }


    return window.requestAnimationFrame(doFrame);
}


// ON PAGE LOAD //
window.onload = function() {
    console.log("Page loaded! Starting engine.");

    // Set global variables
    canvas = document.getElementById('game');
    render = new Render(canvas, 0.5, 50);

    // Bind game loop
    window.requestAnimationFrame(doFrame);
};


console.log('Module ENGINE loaded');