const levelA = new Level(new Vector(5, 25), new Vector(22, 10));
levelA.setup = function () {
    const propA = new Prop(new Vector(9, 6), new Vector(15, 5));
    const propB = new Prop(new Vector(21, 20), new Vector(4, 4));
    const propC = new Prop(new Vector(25, 8), new Vector(5, 5));
    const obst = new Obstacle(new Vector(33, 15), new Vector(3, 3));

    props.push(propA, propB, propC, obst);
}

ENGINE_start(levelA);