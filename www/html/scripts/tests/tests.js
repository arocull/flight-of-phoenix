/**
 * @module TEST
 * @summary This module can be used to test code and functions,
 * without interfering with other code.
*/

console.warn('Note: A test module was loaded. This may create unecessary overhead in production.');

// Test top trace
const prop = new Prop(new Vector(0, 0), new Vector(8, 8), true);
const ray1 = new Ray(new Vector(0, 10), new Vector(0, 0));
const ray2 = new Ray(new Vector(0, 10), new Vector(10, 0));
const ray3 = new Ray(new Vector(0, 0), new Vector(0, 10));

console.log('\nProp bounding box:');
console.log(prop.getTopLeft());
console.log(prop.getBotRight());

console.log('\nProp point tests (on edge, inside, outside with radius boost, outside no boost):');
console.log(prop.isPointInside(new Vector(0, 4), 0));
console.log(prop.isPointInside(new Vector(0, 3.9), 0));
console.log(prop.isPointInside(new Vector(0, 4.1), 1));
console.log(prop.isPointInside(new Vector(0, 4.1), 0));

console.log('Prop ray traces (hit, miss but hit plane, miss but hit with boost, miss normal, hit normal):');
console.log(prop.trace(ray1, false, 0));
console.log(prop.trace(ray2, false, 0));
console.log(prop.trace(ray2, false, 3));
console.log(prop.trace(ray3, false, 0));
console.log(prop.trace(ray3, true, 0));


console.log('More prop ray traces (hit top left, hit bottom right, hit bottom');
const ray4 = new Ray(new Vector(-10, 3.5), new Vector(10, 3.5));
const ray5 = new Ray(new Vector(10, -3.5), new Vector(-10, -3.5));
console.log(prop.trace(ray4, false, 0));
console.log(prop.trace(ray5, false, 0));


console.log('\n\nBOX ray traces (hit top left, hit bottom right, hit bottom\n\n');
const ray6 = new RayBox(new Vector(-10, 3.5), new Vector(10, 3.5), new Vector(1.2, 1.2));
const ray7 = new RayBox(new Vector(10, -3.5), new Vector(-10, -3.5), new Vector(1.2, 1.2));

console.log('\n\n RESULT A: ', ray6);
const boxTraceA = prop.trace(ray6, false, 0.01);
console.log('Final ', boxTraceA);
console.log('\n\n RESULT B:', ray7);
const boxTraceB = prop.trace(ray7, true, 0);
console.log('Final ', boxTraceB);