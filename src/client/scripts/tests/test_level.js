const propA = new Prop(new Vector(9, 6), new Vector(15, 5));
const propB = new Prop(new Vector(21, 20), new Vector(4, 4));
const propC = new Prop(new Vector(25, 8), new Vector(5, 5));

const plr = new Entity(new Vector(4.5, 50), new Vector(3, 3), 10, 1, 30, 500, 0.5);
plr.friction = 0.9;
plr.jumpsMax = 2;
plr.terminalVelocity = 15;

props.push(propA, propB, propC);
dynamics.push(plr);

player = plr;