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

/**
 * @type {Level}
 * @summary Level data
 */
let level = undefined;


/**
 * @function ENGINE_INTERNAL_reset
 * @summary Resets the level
 * @param {boolean} clearBackground If true, deletes background objects as well
 */
function ENGINE_INTERNAL_reset(clearBackground) {
    if (clearBackground) {
        background.splice(0, background.length);
    }
    props.splice(0, props.length);
    dynamics.splice(0, dynamics.length);

    if (level) {
        level.runTime = 0;
        level.setup(); // Call setup again to reload level

        ENGINE_INTERNAL_spawnPlayer(level.startPosition);
    }
}
/**
 * @function ENGINE_INTERNAL_spawnPlayer
 * @summary Spawns the player
 * @param {Vector} spawnPos Where to spawn the player
 */
function ENGINE_INTERNAL_spawnPlayer(spawnPos) {
    player = new Entity(spawnPos, new Vector(2, 2), 10, 1, 30, 1000, 0.8);
    player.friction = 0.9;
    player.jumpsMax = 2;
    player.terminalVelocity = 20;

    //player.sprite = new Image(5120, 3072);
    //player.sprite.src = "images/Flamingo.png";
    //player.spriteUpscale = 1.2;
    player.animated = true;

    dynamics.push(player);
}

function ENGINE_start(startLevel) {
    level = startLevel;
    level.setup(); // Call setup again to reload level
    ENGINE_INTERNAL_spawnPlayer(level.startPosition);
    console.log("Staring level!", startLevel);
}



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
    const skipTick = CONTROLS_apply();
    if (skipTick) return window.requestAnimationFrame(doFrame);

    if (level) level.tick(deltaTime); // Tick level if present

    PHYSICS_tick(deltaTime, dynamics, props);


    // Kill player if they fall below the bottom visual
    if (player && player.position.y + player.size.y / 2 <= 0) {
        player.hp = 0;
    }
    // Reset level if player dies
    if (player && player.hp <= 0) {
        player = null; // Remove player so we do not trigger death again
        render.setScreenWipe(new Vector(0, -1));
        
        // Reset level halfway through screen wipe effect (to hide teleporting)
        setTimeout(() => {
            ENGINE_INTERNAL_reset(false);

            if (level) {
            
            }
        }, 400);  
    }


    // DRAWING //

    // Update Frame Size by changing canvas height to stay proportional with width
    // Also update drawing proportions
    render.updateScaling();
    if (level) {
        render.clearFrame(level.backgroundColor)
    } else {
        render.clearFrame('#aaaabb');
    }


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


    // Tick screen wipe
    render.tickScreenWipe(deltaTime);


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