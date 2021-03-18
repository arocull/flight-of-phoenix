const propA = new Prop(new Vector(5, 5), new Vector(5, 5));
const propC = new Prop(new Vector(10, 7), new Vector(5, 5));

const propB = new PhysProp(new Vector(5, 50), new Vector(5, 5), 10);

props.push(propA, propC);
dynamics.push(propB);