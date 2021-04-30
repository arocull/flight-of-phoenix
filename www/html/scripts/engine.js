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
 * @type {Prop}
 * @summary Player's end goal
 */
let objective = undefined;



// Pre-Load Player and Objective Textures
const TEXTURE_nest = new Image(512, 512);
TEXTURE_nest.src = 'images/sprites/nest.png';


/**
 * @function ENGINE_INTERNAL_reset
 * @summary Resets the level
 * @param {boolean} clearBackground If true, deletes background objects as well
 */
function ENGINE_INTERNAL_reset(clearBackground, newLevel) {
    if (clearBackground) {
        background.splice(0, background.length);
    }
    props.splice(0, props.length);
    dynamics.splice(0, dynamics.length);

    if (level) {
        if (clearBackground) level.setupBackground();

        level.runTime = 0;
        level.setup(); // Call setup again to reload level

        ENGINE_INTERNAL_spawnPlayer(level.startPosition);
        ENGINE_INTERNAL_spawnObjective(level.endPosition);
    }
}
/**
 * @function ENGINE_INTERNAL_spawnPlayer
 * @summary Spawns the player
 * @param {Vector} spawnPos Where to spawn the player
 */
function ENGINE_INTERNAL_spawnPlayer(spawnPos) {
    player = new EPhoenix(spawnPos);
    dynamics.push(player);
}
/**
 * @function ENGINE_INTERNAL_spawnObjective
 * @summary Spawns the objective
 * @param {Vector} spawnPos Where to spawn the objective
 */
function ENGINE_INTERNAL_spawnObjective(spawnPos) {
    objective = new Prop(spawnPos, new Vector(2.5, 2.5), false);
    objective.sprite = TEXTURE_nest;
    objective.spriteUpscale = 1.2;

    props.push(objective);
}

function ENGINE_start(startLevel) {
    level = startLevel;
    level.setupBackground();
    level.setup(); // Call setup again to reload level
    ENGINE_INTERNAL_spawnPlayer(level.startPosition);
    ENGINE_INTERNAL_spawnObjective(level.endPosition);
    console.log("Staring game!");
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

    if (level) {
        level.tickTimers(deltaTime);
        level.tick(deltaTime); // Tick level if present
    }

    // Process object ticks
    for (let i = 0; i < props.length; i++) {
        props[i].tick(deltaTime);
    }
    for (let i = 0; i < dynamics.length; i++) {
        dynamics[i].tick(deltaTime);
    }

    // Finally, do physics
    PHYSICS_tick(deltaTime, dynamics, props);


    // Kill player if they fall below the bottom visual
    if (player && player.position.y + player.size.y / 2 <= -0.5) {
        player.hp = 0;
    }
    // Reset level if player dies
    if (player && player.hp <= 0) {
        player = null; // Remove player so we do not trigger death again
        render.setScreenWipe(new Vector(0, -1));
        
        // Reset level halfway through screen wipe effect (to hide teleporting)
        setTimeout(() => {
            ENGINE_INTERNAL_reset(false);
        }, 600); 
    }
    // Change level if player reaches goal
    if (player && objective && objective.isPointInside(player.position, player.radius / 2)) {
        player.move(new Vector(0, 0));
        player = null; // Remove player as to not trigger death or movement

        render.setScreenWipe(new Vector(1, 0));

        // Cange level halfway through screen wipe effect (to hide teleporting)
        setTimeout(() => {
            if (level && level.nextLevel) { // If there is another screen after this, switch to it
                level = level.nextLevel;
                ENGINE_INTERNAL_reset(true);
            } else { // Redirect to end screen
                const url = window.location.toString().replace('game.html', 'feedback.html');
                window.location.replace(url);
            }

        }, 600); 
    }


    // DRAWING //

    // Update Frame Size by changing canvas height to stay proportional with width
    // Also update drawing proportions
    render.updateScaling();
    if (level) {
        render.clearFrame(level.backgroundColor)
        render.drawBackgroundWind(deltaTime, level.backgroundWindSpeed);
    } else {
        render.clearFrame('#aaaabb');
    }


    // Draw background props
    for (let i = 0; i < background.length; i++) {
        background[i].tickAnimation(deltaTime);
        render.drawProp(background[i]);
    }
    // Draw actual props
    for (let i = 0; i < props.length; i++) {
        props[i].tickAnimation(deltaTime);
        render.drawProp(props[i]);
    }
    // Draw physics props
    for (let i = 0; i < dynamics.length; i++) {
        dynamics[i].tickAnimation(deltaTime);
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

    // If user taps at all (using touch screen), display on-screen controls
    const controls = document.getElementById('controls');
    canvas.addEventListener('touchstart', (event) => {
        controls.hidden = false;
    });


    // Bind on-screen controls
    const cLeft = document.getElementById('left');
    const cRight = document.getElementById('right');
    const cJump = document.getElementById('jump');

    function leftDown(event) { CONTROLS_leftPressed = true };
    function leftUp(event) { CONTROLS_leftPressed = false };
    function rightDown(event) { CONTROLS_rightPressed = true };
    function rightUp(event) { CONTROLS_rightPressed = false };
    function jumpDown(event) { CONTROLS_upPressed = true };
    function jumpUp(event) { CONTROLS_upPressed = false };

    cLeft.ontouchstart = leftDown;
    cLeft.ontouchend = leftUp;
    cLeft.ontouchcancel = leftUp;
    cLeft.onmousedown = leftDown;
    cLeft.onmouseup = leftUp;

    cRight.ontouchstart = rightDown;
    cRight.ontouchend = rightUp;
    cRight.ontouchcancel = rightUp;
    cRight.onmousedown = rightDown;
    cRight.onmouseup = rightUp;

    cJump.ontouchstart = jumpDown;
    cJump.ontouchend = jumpUp;
    cJump.ontouchcancel = jumpUp;
    cJump.onmousedown = jumpDown;
    cJump.onmouseup = jumpUp;


    // Bind game loop
    window.requestAnimationFrame(doFrame);
};


console.log('Module ENGINE loaded');