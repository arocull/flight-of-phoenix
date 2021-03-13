const propA = new Prop(new Vector(5, 5), new Vector(5, 5));

const propB = new PhysProp(new Vector(5, 15), new Vector(5, 5), 10);


props.push(propA);
dynamics.push(propB);

console.log(propA);
console.log(propB);