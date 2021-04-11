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
/**
 * @type {Prop[]}
 * @summary Background props used solely for visuals
*/
const background = [];
/**
 * @type {Prop[]}
 * @summary Static props in foreground that can be collided with
 */
const props = [];
/**
 * @type {PhysProp[]}
 * @summary Physics props that can move around and be collided with
*/
const dynamics = [];

// GAME LOOP //
let lastTime = 0;
function doFrame(newTime) {
    // Get change in time, and convert it to seconds
    const deltaTime = (newTime - lastTime) / 1000;
    // Update lastTime to this new time
    lastTime = newTime;

    // If the animation frame took too long, skip it--the tab/window was not being viewed and game should have "paused"
    if (deltaTime > 0.1) {
        return window.requestAnimationFrame(doFrame);
    }


    // GAME LOOP //
    CONTROLS_apply();
    PHYSICS_tick(deltaTime, dynamics, props);

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
    // Draw physics props
    for (let i = 0; i < dynamics.length; i++) {
        render.drawProp(dynamics[i]);
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