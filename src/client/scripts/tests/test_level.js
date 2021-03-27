const propA = new Prop(new Vector(5, 5), new Vector(5, 5));
const propC = new Prop(new Vector(25, 7), new Vector(5, 5));

const propB = new PhysProp(new Vector(4.5, 50), new Vector(3, 3), 10);

props.push(propA, propC);
dynamics.push(propB);