// One screen is 50 x 25 engine units

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

const levelA = new Level(new Vector(2, 15), new Vector(25, 10));
levelA.backgroundColor = '#5599bb';
levelA.setup = function () {
    const groundStart = new Prop(new Vector(2, 0), new Vector(4, 20));
    groundStart.sprite = TEXTURE_cliff_thin_left;
    groundStart.spriteUpscale = 1.1;
    const groundEnd = new Prop(new Vector(48, 9), new Vector(4, 20));
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

ENGINE_start(levelA);