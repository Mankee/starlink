
const getBeamAngleDegrees = (user, satellite) => {
  // x^2 + y^2 = l^2
  // l^2 + z^2 = d^2
  // x^2 + y^2 + z^2 = d^2
  // d = sqrt(x^2 + y^2 + z^2)
  const { x: x1, y: y1, z: z1} = user.position;
  const { x: x2, y: y2, z: z2} = satellite.position;
  const h = Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2) + ((z1 - z2) ** 2));

  if (h === 0) {
    console.log(`returning 0 degrees for satellite ${satellite.name} and user ${user.name} the calculated distance between them is 0`)
    return 0;
  }

  const radians = Math.acos(Math.abs(x1 - x2) / h);
  const degrees = (radians * 180) / Math.PI;
  return degrees;
  // The distance between the user and satellite on the z axis
  // const altitudeDistance = Math.abs(550 - user.altitude);
  // theta is the arc tangent of the coverage radius divided altitude distance between the user and the satellite

  // Use Math.atan2 to handle all cases and return the angle in radians
  // const thetaRadians = Math.atan2(altitudeDistance, (Math.abs(satellite.longitude - user.longitude)));
  // return (thetaRadians * 180) / Math.PI;
}

// Function to calculate the dot product of two vectors
const dotProduct = (vectorA, vectorB) => {
  return vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z;
}

// Function to calculate the magnitude (length) of a vector
const magnitude = (vector) => {
  return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
}

const radiansToDegrees = (radian) => {
  return (radian * 180) / Math.PI
}

// Function to calculate the angle between two vectors in degrees
function angleBetweenVectors(vectorA, vectorB) {
  const dot = dotProduct(vectorA, vectorB);
  const magA = magnitude(vectorA);
  const magB = magnitude(vectorB);

  // Ensure denominators are not zero
  if (magA === 0 || magB === 0) {
    throw new Error('Vectors cannot have zero magnitude.');
  }

  const cosTheta = dot / (magA * magB);
  const thetaRad = Math.acos(cosTheta);

  // Convert radians to degrees
  const thetaDegrees = radiansToDegrees(thetaRad);

  return thetaDegrees;
}

function createNewVector(userVertex, satelliteVertex) {
  return {
    x: satelliteVertex.x - userVertex.x,
    y: satelliteVertex.y - userVertex.y,
    z: satelliteVertex.z - userVertex.z,
  };
}

const radius = (height) => {
  return Math.abs(Math.tan(45) * height);
}

// get the distance between two objects in 3D space
const distance = (a, b) => {
  return Math.sqrt(((a.x - b.x) ** 2) + ((a.y - b.y) ** 2) + ((a.z - b.z) ** 2))
}

const length = (distance, height) => {
  return Math.sqrt((distance ** 2) - (height ** 2));
}

module.exports = {
  getBeamAngleDegrees,
  dotProduct,
  magnitude,
  radiansToDegrees,
  angleBetweenVectors,
  createNewVector,
  radius,
  distance,
  length
}