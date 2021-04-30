// One screen is 50 x 25 engine units


// Load in textures for ease of use
const TEXTURE_cliff_thin_left = new Image(200, 1000);
TEXTURE_cliff_thin_left.src = 'images/sprites/cliff_thin_left.png';

const TEXTURE_cliff_thin_right = new Image(200, 1000);
TEXTURE_cliff_thin_right.src = 'images/sprites/cliff_thin_right.png';

const TEXTURE_cliff_wide_left = new Image(500, 1000);
TEXTURE_cliff_wide_left.src = 'images/sprites/cliff_wide_left.png';

const TEXTURE_cliff_wide_right = new Image(500, 1000);
TEXTURE_cliff_wide_right.src = 'images/sprites/cliff_wide_right.png';

const TEXTURE_platform_cloud = [
    new Image(300, 100),
    new Image(300, 100),
];
TEXTURE_platform_cloud[0].src = 'images/sprites/platform_cloud1.png';
TEXTURE_platform_cloud[1].src = 'images/sprites/platform_cloud2.png';

const TEXTURE_creature = [
    new Image(300, 100),
    new Image(300, 100),
];
TEXTURE_creature[0].src = 'images/sprites/skywhale.png';
TEXTURE_creature[1].src = 'images/sprites/skyfish.png';

const TEXTURE_wind_vertical = new Image(500, 1000);
TEXTURE_wind_vertical.src = 'images/effects/wind_vertical.png';
const TEXTURE_wind_horizontal = new Image(3000, 750);
TEXTURE_wind_horizontal.src = 'images/effects/background_wind.png';

const TEXTURE_indicator = new Image(216, 216);
TEXTURE_indicator.src = 'images/sprites/indicator1.png';

/**
 * @function pickRandomTexture
 * @summary Picks a random texture from the given texture array
 * @param {Image[]} textureArray Array of textures
 * @returns {Image} Returns a single textre
 */
function pickRandomTexture(textureArray) {
    return textureArray[Math.floor(Math.random() * textureArray.length)];
}
/**
 * @function genCreatures
 * @summary Generates X number of creatures and adds them to the background
 * @param {number} num Number of creatures to generate
 */
function genCreatures(num = 3, speed = 2, variance = 3) {
    for (let i = 0; i < num; i++) {
        background.push(
            new PBackgroundExtra(
                new Vector(50 * Math.random(), 25 * Math.random()),
                new Vector(3, 1.5),
                speed, // Speed
                variance,
                pickRandomTexture(TEXTURE_creature),
                Math.random() * 2 // Upscale
            )
        );
    }
}




// TUTORIAL A //
const tutorialA = new Level(new Vector(6, 10), new Vector(45, 20));
tutorialA.backgroundColor = '#66aaee';
tutorialA.backgroundWindSpeed /= 2;
tutorialA.setup = function () {
    const groundEnd = new Prop(new Vector(48, 9), new Vector(10, 20));
    groundEnd.sprite = TEXTURE_cliff_wide_right;
    groundEnd.spriteUpscale = 1.03;
    props.push(groundEnd);

    const platforms = [
        new Prop(new Vector(6, 8), new Vector(6, 1.7)), // Spawn platform
        new Prop(new Vector(16, 9), new Vector(4, 1)), // Single jump
        new Prop(new Vector(24, 13), new Vector(5, 1.2)), // Double jump
        new Prop(new Vector(39, 18), new Vector(4, 1)),
    ];

    // Set textures, properties
    for (let i = 0; i < platforms.length; i++) {
        platforms[i].sprite = pickRandomTexture(TEXTURE_platform_cloud);
        platforms[i].spriteUpscale = 1.4;
        platforms[i].friction = 1;
        platforms[i].elasticity = 0;

        props.push(platforms[i]);
    }
}
tutorialA.setupBackground = function () {
    genCreatures(1, 2, 3);

    const ind1 = new Prop(new Vector(9, 9.75), new Vector(2, 2));

    const ind2 = new Prop(new Vector(18, 10.4), new Vector(2, 2));
    const ind3 = new Prop(new Vector(19.5, 12.7), new Vector(1.25, 1.25));

    const ind4 = new Prop(new Vector(26.5, 14.5), new Vector(2, 2));
    const ind5 = new Prop(new Vector(31, 17), new Vector(1.25, 1.25));
    const ind6 = new Prop(new Vector(35.5, 18), new Vector(1.25, 1.25));

    ind1.sprite = TEXTURE_indicator;
    ind2.sprite = TEXTURE_indicator;
    ind3.sprite = TEXTURE_indicator;
    ind4.sprite = TEXTURE_indicator;
    ind5.sprite = TEXTURE_indicator;
    ind6.sprite = TEXTURE_indicator;

    background.push(ind1, ind2, ind3, ind4, ind5, ind6);
}


// LEVEL A - Thunderclouds //
const levelA = new Level(new Vector(2, 15), new Vector(48.4, 17.9));
levelA.backgroundColor = '#5599bb';
levelA.setup = function () {
    const groundStart = new Prop(new Vector(2, 0), new Vector(4, 20));
    groundStart.sprite = TEXTURE_cliff_thin_left;
    groundStart.spriteUpscale = 1.05;
    const groundEnd = new Prop(new Vector(48, 7), new Vector(4, 20));
    groundEnd.sprite = TEXTURE_cliff_thin_right;
    groundEnd.spriteUpscale = 1.05;

    props.push(groundStart, groundEnd);

    // Too lazy to declare a variable for each one, so just making an array
    // and we can iterate through all of them
    const platformSize = new Vector(3, 0.75);
    const platforms = [
        new Prop(new Vector(14, 9.5), platformSize),

        new Prop(new Vector(23, 16), platformSize),
        new Prop(new Vector(21, 5), platformSize),

        new Prop(new Vector(35.5, 14), platformSize),
        new Prop(new Vector(34, 5), platformSize),

        new Prop(new Vector(43.4, 9), platformSize),
    ];

    const stormClouds = [
        new OStormCloud(new Vector(8, 8)),
        
        new OStormCloud(new Vector(14.5, 18)),
        new OStormCloud(new Vector(16, 6.5)),

        new OStormCloud(new Vector(21, 23.5)),
        new OStormCloud(new Vector(24, 13)),

        new OStormCloud(new Vector(30, 24.3)),
        new OStormCloud(new Vector(31, 14.5)),
        new OStormCloud(new Vector(27, 4)),

        new OStormCloud(new Vector(39, 23)),
        new OStormCloud(new Vector(38.5, 7.5)),
    ];

    for (let i = 0; i < platforms.length; i++) {
        platforms[i].elasticity = 0;
        platforms[i].friction = 1;

        platforms[i].sprite = pickRandomTexture(TEXTURE_platform_cloud);
        platforms[i].spriteUpscale = 1.4;

        props.push(platforms[i]);
    }
    for (let i = 0; i < stormClouds.length; i++) {
        props.push(stormClouds[i]);
    }
}
levelA.setupBackground = function () {
    genCreatures(3, 4, 4);
}


// LEVEL B - Vertical Wind //
const levelB = new Level(new Vector(2, 22), new Vector(48.4, 17.9));
levelB.backgroundColor = '#3377aa';
levelB.backgroundWindSpeed = 0.08;
levelB.setup = function() {
    const groundStart = new Prop(new Vector(2, 10), new Vector(4, 20));
    groundStart.sprite = TEXTURE_cliff_thin_left;
    groundStart.spriteUpscale = 1.05;
    const groundEnd = new Prop(new Vector(48, 7), new Vector(4, 20));
    groundEnd.sprite = TEXTURE_cliff_thin_right;
    groundEnd.spriteUpscale = 1.05;

    props.push(groundStart, groundEnd);

    // Make wind props
    this.wind1 = new Prop(new Vector(25, 0), new Vector(15, 25), false);
    this.wind2 = new Prop(new Vector(25, 20), new Vector(15, 25), false);
    this.wind1.sprite = TEXTURE_wind_vertical;
    this.wind2.sprite = TEXTURE_wind_vertical;

    const windBlock = new Prop(new Vector(25, 26.5), new Vector(15, 1)); // Stops player from flying up offscreen
    windBlock.elasticity = 0;

    props.push(this.wind1, this.wind2, windBlock);
}
levelB.tick = function(delta) {
    // Animate props to be seamless
    const t = (this.runTime * 20) % 25 - 12.5;
    this.wind1.position = new Vector(this.wind1.position.x, t);
    this.wind2.position = new Vector(this.wind2.position.x, t + 25);


    if (player) { // Apply wind effects
        const radiusBoost = player.radius / 2;
        if (this.wind1.isPointInside(player.position, radiusBoost) || this.wind2.isPointInside(player.position, radiusBoost)) {
            player.addForce('wind_vertical', new Vector(0, PHYSICS_gravity * 7), 0.1); // Add wind force
            player.jumpsUsed = 0; // Refresh player jumps
        } else {
            player.removeForce('wind_vertical'); // Remove wind force once player exits field
        }
    }
}
levelB.setupBackground = function () {
    genCreatures(6, 5, 8);
}


// LEVEL C - Horizontal Wind and Obstacles //
const levelC = new Level(new Vector(2, 21), new Vector(48.4, 17.9));
levelC.backgroundColor = '#3377aa';
levelC.backgroundWindSpeed = 0.3;
levelC.setup = function() {
    const groundStart = new Prop(new Vector(5, 10), new Vector(10, 20));
    groundStart.sprite = TEXTURE_cliff_wide_left;
    groundStart.spriteUpscale = 1.03;

    const groundEnd = new Prop(new Vector(48, 7), new Vector(10, 20));
    groundEnd.sprite = TEXTURE_cliff_wide_right;
    groundEnd.spriteUpscale = 1.03;

    const windBlock = new Prop(new Vector(-0.75, 12.5), new Vector(1, 50)); // Stops player from flying left offscreen
    windBlock.elasticity = 0;

    props.push(groundStart, groundEnd, windBlock);

    // Platforms
    const platformSize = new Vector(3, 0.75);
    const platforms = [
        new Prop(new Vector(13.75, 9), platformSize),
        new Prop(new Vector(21, 5), platformSize),
        new Prop(new Vector(33.3, 5), platformSize),
        new Prop(new Vector(38, 12), platformSize),
    ];

    // Storm Clouds
    const stormClouds = [
        new OStormCloud(new Vector(18, 21)),
        new OStormCloud(new Vector(18.5, 14)),

        new OStormCloud(new Vector(22.5, 22)),
        new OStormCloud(new Vector(24, 15)),

        new OStormCloud(new Vector(31, 21.3)),
        new OStormCloud(new Vector(29, 15.5)),
        new OStormCloud(new Vector(27.5, 5)),

        new OStormCloud(new Vector(39, 23)),
        new OStormCloud(new Vector(38.5, 7.5)),
    ];

    for (let i = 0; i < platforms.length; i++) {
        platforms[i].elasticity = 0;
        platforms[i].friction = 1;

        platforms[i].sprite = pickRandomTexture(TEXTURE_platform_cloud);
        platforms[i].spriteUpscale = 1.4;

        props.push(platforms[i]);
    }
    for (let i = 0; i < stormClouds.length; i++) {
        props.push(stormClouds[i]);
    }
}
levelC.tick = function(delta) {
    if (player) { // Apply wind effects
        player.addForce('wind_horizontal', new Vector(-PHYSICS_gravity * 8, 0), 1);
    }
}
levelC.setupBackground = function () {
    genCreatures(3, 15, 5);
}


// LEVEL D - Sliding Platform //
const levelD = new Level(new Vector(2, 16), new Vector(43, 16));
levelD.backgroundColor = '#3377aa';
levelD.backgroundWindSpeed /= 2.5;
levelD.setup = function() {
    const groundStart = new Prop(new Vector(5, 5), new Vector(10, 20));
    groundStart.sprite = TEXTURE_cliff_wide_left;
    groundStart.spriteUpscale = 1.03;

    const groundEnd = new Prop(new Vector(45, 5), new Vector(10, 20));
    groundEnd.sprite = TEXTURE_cliff_wide_right;
    groundEnd.spriteUpscale = 1.03;


    // Platforms
    this.platform = new Prop(new Vector(18, 10), new Vector(4.5, 1.25));
    this.platform.elasticity = 0;
    this.platform.friction = 1;

    this.platform.sprite = pickRandomTexture(TEXTURE_platform_cloud);
    this.platform.spriteUpscale = 1.4;


    this.platform.tick = function(delta) { // Store delta time for position derivative
        this.delta = delta;
    }
    this.platform.onHit = function(hit) {
        if (hit instanceof PhysProp) {
            hit.position.x += Math.cos(levelD.runTime) * 3 * this.delta; // Move player with platform (cos is derivative of sin)
        }
    }

    props.push(groundStart, groundEnd, this.platform);
}
levelD.tick = function(delta) {
    this.platform.position.x = 25 + Math.sin(this.runTime) * 3;
}
levelD.setupBackground = function () {
    genCreatures(3, 2, 3);
}


// Set up order of levels
tutorialA.nextLevel = levelA;
levelA.nextLevel = levelB;
levelB.nextLevel = levelC;
levelC.nextLevel = levelD;
// Once a level with no indicated next level is completed, game ends

ENGINE_start(tutorialA); // Start game on the first level