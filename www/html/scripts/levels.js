// One screen is 50 x 25 engine units


// Load in textures for ease of use
const TEXTURE_cliff_thin_left = new Image(200, 1000);
TEXTURE_cliff_thin_left.src = 'images/sprites/cliff_thin_left.png';

const TEXTURE_cliff_thin_right = new Image(200, 1000);
TEXTURE_cliff_thin_right.src = 'images/sprites/cliff_thin_right.png';

const TEXTURE_platform_cloud = [
    new Image(300, 100),
    new Image(300, 100),
];
TEXTURE_platform_cloud[0].src = 'images/sprites/platform_cloud1.png';
TEXTURE_platform_cloud[1].src = 'images/sprites/platform_cloud2.png';

const TEXTURE_wind_vertical = new Image(500, 1000);
TEXTURE_wind_vertical.src = 'images/effects/wind_vertical.png';



const levelA = new Level(new Vector(2, 15), new Vector(48.4, 18));
levelA.backgroundColor = '#5599bb';
levelA.setup = function () {
    const groundStart = new Prop(new Vector(2, 0), new Vector(4, 20));
    groundStart.sprite = TEXTURE_cliff_thin_left;
    groundStart.spriteUpscale = 1.1;
    const groundEnd = new Prop(new Vector(48, 7), new Vector(4, 20));
    groundEnd.sprite = TEXTURE_cliff_thin_right;
    groundEnd.spriteUpscale = 1.1;

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

        const textureNum = Math.floor(Math.random() * TEXTURE_platform_cloud.length);
        platforms[i].sprite = TEXTURE_platform_cloud[textureNum];
        platforms[i].spriteUpscale = 1.5;

        props.push(platforms[i]);
    }
    for (let i = 0; i < stormClouds.length; i++) {
        props.push(stormClouds[i]);
    }
}


const levelB = new Level(new Vector(2, 25), new Vector(48.4, 18));
levelB.backgroundColor = '#3377aa';
levelB.backgroundWindSpeed = 0.08;
levelB.setup = function() {
    const groundStart = new Prop(new Vector(2, 10), new Vector(4, 20));
    groundStart.sprite = TEXTURE_cliff_thin_left;
    groundStart.spriteUpscale = 1.1;
    const groundEnd = new Prop(new Vector(48, 7), new Vector(4, 20));
    groundEnd.sprite = TEXTURE_cliff_thin_right;
    groundEnd.spriteUpscale = 1.1;

    props.push(groundStart, groundEnd);

    this.wind1 = new Prop(new Vector(25, 0), new Vector(15, 25), false);
    this.wind2 = new Prop(new Vector(25, 20), new Vector(15, 25), false);
    this.wind1.sprite = TEXTURE_wind_vertical;
    this.wind2.sprite = TEXTURE_wind_vertical;

    const windBlock = new Prop(new Vector(25, 26.5), new Vector(15, 1)); // Stops player from flying up offscreen
    windBlock.elasticity = 0;

    props.push(this.wind1, this.wind2, windBlock);
}
levelB.tick = function(delta) {
    const t = (this.runTime * 20) % 25 - 12.5;
    this.wind1.position = new Vector(this.wind1.position.x, t);
    this.wind2.position = new Vector(this.wind2.position.x, t + 25);


    if (player) {
        const radiusBoost = player.radius / 2;
        if (this.wind1.isPointInside(player.position, radiusBoost) || this.wind2.isPointInside(player.position, radiusBoost)) {
            player.addForce('wind_vertical', new Vector(0, PHYSICS_gravity * 7), 0.1);
            player.jumpsUsed = 0; // Refresh player jumps
            console.log("hi");
        } else {
            player.removeForce('wind_vertical');
        }
    }
}


levelA.nextLevel = levelB;

ENGINE_start(levelA);