/* Engine created by Alan O'Cull for CGT 141 class at Purdue University
 *
 * I used online resources to learn specific practices in JavaScript
 * like prototypes and inheritance.
 * 
 * https://www.tutorialsteacher.com/javascript/prototype-in-javascript
 * https://www.tutorialsteacher.com/javascript/inheritance-in-javascript
*/


// DECLARE GLOBALS //
let canvas;
let context;


// GAME LOOP //
let lastTime = 0;
function doFrame(newTime) {
    // Get change in time, and convert it to seconds
    const deltaTime = (newTime - lastTime) / 1000;
    // Update lastTime to this new time
    lastTime = newTime;

    // Lock canvas height to stay proportional with width
    canvas.height = canvas.width * 1/2;

    // Game Loop

    return window.requestAnimationFrame(doFrame);
}


// ON PAGE LOAD //
window.onload = function() {
    console.log("Page loaded! Starting engine.");

    // Set global variables
    canvas = document.getElementById('game');
    context = canvas.getContext('2d');

    // Bind game loop
    window.requestAnimationFrame(doFrame);
};


console.log('Module ENGINE loaded');