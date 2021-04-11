const propA = new Prop(new Vector(5, 5), new Vector(5, 5));
const propC = new Prop(new Vector(25, 7), new Vector(5, 5));

const propB = new Entity(new Vector(4.5, 50), new Vector(3, 3), 10, 1, 30, 50, 0.5);

props.push(propA, propC);
dynamics.push(propB);