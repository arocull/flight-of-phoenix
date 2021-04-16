/**
 * @type {Entity}
 * @summary Entity for player to control. If the entity's health hits zero, the level restarts.
*/
let player = undefined;

const CONTROLS_dir = new Vector(0, 0);
let CONTROLS_upPressed = false;
let CONTROLS_downPressed = false;
let CONTROLS_rightPressed = false;
let CONTROLS_leftPressed = false;
let CONTROLS_waitForUpLetGo = false;

/** @description DEBUG TOOL, set this to true to enable frame advance (press F to move onto the next frame) */
let enableFrameAdvance = false;
let CONTROLS_frameAdvance = false;
let CONTROLS_frameAdvanceToggle = false;

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case ' ':
            CONTROLS_upPressed = true;
            break;
        case 'ArrowDown':
        case 's':
            CONTROLS_downPressed = true;
            break;
        case 'ArrowRight':
        case 'd':
            CONTROLS_rightPressed = true;
            break;
        case 'ArrowLeft':
        case 'a':
            CONTROLS_leftPressed = true;
            break;
        // DEBUG TOOLS //
        case 'f':
            CONTROLS_frameAdvance = true;
            break;
        case 'g':
            CONTROLS_frameAdvanceToggle = !CONTROLS_frameAdvanceToggle;
            break;
        default: break;
    }
});
document.addEventListener('keyup', (event) => {
    CONSTROLS_shiftHeld = event.shiftKey;
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case ' ':
            CONTROLS_upPressed = false;
            break;
        case 'ArrowDown':
        case 's':
            CONTROLS_downPressed = false;
            break;
        case 'ArrowRight':
        case 'd':
            CONTROLS_rightPressed = false;
            break;
        case 'ArrowLeft':
        case 'a':
            CONTROLS_leftPressed = false;
            break;
        default: break;
    }
});

/**
 * @function CONTROLS_apply
 * @summary Applies the currently pressed controls to the character
 * @returns {boolean} Returns true if the engine should not tick this frame
 */
function CONTROLS_apply() {
    CONTROLS_dir.x = CONTROLS_rightPressed - CONTROLS_leftPressed;
    CONTROLS_dir.y = 0;

    if (player) player.move(CONTROLS_dir);

    if (CONTROLS_upPressed && !CONTROLS_waitForUpLetGo) {
        CONTROLS_waitForUpLetGo = true;
        if (player) player.jump();
    } else if (!CONTROLS_upPressed) {
        CONTROLS_waitForUpLetGo = false;
    }

    if (enableFrameAdvance) {
        const doAdvanceFrame = (CONTROLS_frameAdvance || CONTROLS_frameAdvanceToggle);
        CONTROLS_frameAdvance = false; // Disable immeadietly
        return !doAdvanceFrame;
    }
    return false;
}


console.log("Module CONTROLS loaded");