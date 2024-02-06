// import data from '../../public/data.json';
const data = require('../../public/data.json');
const optimize = require("next/dist/server/optimize-amp");

const SCALER = 2500
const EARTH_RADIUS = 6378.1; // ish
const GEOMETRY_DETAIL = 16;
const DEFAULT_ROTATION = 0.0002;
const SATELLITE_LIMIT = 500;
const EARTH_OBLIGUITY_DEGREES = 23.44;

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

const main = (satellites, users) => {
  const allConnections = [];
  const userConnections = {};
  const satelliteConnections = {};

  satellites.forEach((satellite, satelliteId) => {
    const height = (Math.sqrt((satellite.position.x ** 2) + (satellite.position.z ** 2) + (satellite.position.y ** 2)) - EARTH_RADIUS);
    const radius = Math.abs(Math.tan(45) * height);
    users.forEach((user, userId) => {
      // distance between the user and the satellite xyz space
      const distance = Math.sqrt(((satellite.position.x - user.position.x) ** 2) + ((satellite.position.y - user.position.y) ** 2) + ((satellite.position.z - user.position.z) ** 2))

      // distance between the user and the satellite xy space
      const length = Math.sqrt((distance ** 2) - (height ** 2));

      if (length <= radius) {
        user.connectionCount += 1;
        satellite.users.push(user)
        user.satellites.push(satellite)
      }
    });
  });

  // constraint #1 - no two connection vectors for the same satellite can be with 10 degrees of each other
  // checks angles between each connection pair vector (a user ground target and a star link satellite)
  for (let i = 0; i < satellites.length; i++) {
    const satellite = satellites[i];
    if (satellite.users.length) {
      for (let j = 0; j < satellite.users.length; j++) {
        const userA = satellite.users[j];
        const vectorA = createNewVector(satellite.position, userA.position);
        for (let k = j + 1; k < satellite.users.length; k++) {
          const userB = satellite.users[k];
          const vectorB = createNewVector(satellite.position, userB.position);
          const angle = angleBetweenVectors(vectorA, vectorB);

          console.log(`The angle between the vectors is ${angle} degrees.`);

          if (angle < 10) {
            const userId = parseInt(satellite.users[j].name, 10) - 1;
            if (userId === 0) {
              // debugger
            }
            if (userA.connectionCount > userB.connectionCount) {
              users[userId].connectionCount -= 1;
              satellite.users.splice(j, 1)
            } else {
              const userId = parseInt(satellite.users[k].name, 10) - 1;
              users[userId].connectionCount -= 1;
              satellite.users.splice(k, 1)
            }
          }
        }
      }
    }
  }

  console.log(`user count: ${users.length}`)
  const remaining = users.filter((user) => {
    if (user.connectionCount <= 0) return true
  });

  console.log(remaining)
  debugger
}

main(data.satellites, data.users)