/**
 * @name Level
 * @class
 * @summary Level, holds prop data for levels and where player should spawn
 * @param {Vector} playerStartPos Position player should spawn in
 * @param {Vector} objectivePos Position the objective (phoenix nest) should spawn in
 */
function Level(playerStartPos, objectivePos) {
    this.startPosition = playerStartPos;
    this.endPosition = objectivePos;

    this.backgroundColor = '#99ccee';
    this.backgroundWindSpeed = 0.05;

    /**
     * @type {Level}
     * @summary New level to progress to once this one has been beaten
     */
    this.nextLevel = undefined;

    /** @description Total time this level has been running */
    this.totalTime = 0;
    /** @description Time since last spawn */
    this.runTime = 0;
}

/**
 * @function setup
 * @summary Override this function with whatever prop and object spawns you want
 */
Level.prototype.setup = function () {};
/**
 * @function setupBackground
 * @summary Level setup specifically for background elements
 */
Level.prototype.setupBackground = function() {};
/**
 * @function tick
 * @summary Ticks level by X seconds, in case special functionality is wanted
 * @param {number} delta Change in time since last frame
 */
Level.prototype.tick = function (delta) {};
/**
 * @function tickTimers
 * @summary Updates timers in level
 * @param {number} delta Change in time since last frame
 */
Level.prototype.tickTimers = function (delta) {
    this.totalTime += delta;
    this.runTime += delta;
};