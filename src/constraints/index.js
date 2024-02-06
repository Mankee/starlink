const { createNewVector, angleBetweenVectors } = require('../utils');

// constraint #1 - no two connection vectors for the same satellite can be with 10 degrees of each other
// checks angles between each connection pair vector (a user ground target and a star link satellite)
const constraintOne = (satellites, users) => {
  for (let i = 0; i < Object.keys(satellites).length; i++) {
    const satellite = Object.values(satellites)[i];
    if (satellite.userCount > 0) {
      for (let j = 0; j < satellite.userCount; j++) {
        const userA = Object.values(satellite.users)[j];

        if (userA) {
          const vectorA = createNewVector(satellite.position, userA.position);

          for (let k = j + 1; k < satellite.userCount; k++) {
            const userB = Object.values(satellite.users)[k];

            if (userB) {
              const vectorB = createNewVector(satellite.position, userB.position);
              const angle = angleBetweenVectors(vectorA, vectorB);

              // check users object to make sure they both have the same common satellite pairing
              if (angle < 10) {
                // remove user A if they have more possible connections
                if (userA.connectionCount > userB.connectionCount) {
                  satellite.users[userA.id] = null;
                  satellite.userCount -= 1;
                  users[userA.id].satellites[satellite.id] = null;
                  users[userA.id].satelliteCount -= 1;
                } else {
                  // remove user B because they are either tied for connection counts or B is greater than A
                  satellite.users[userB.id] = null;
                  satellite.userCount -= 1;
                  users[userB.id].satellites[satellite.id] = null;
                  users[userB.id].satelliteCount -= 1;
                }
              }
            }
          }
        }
      }
    }
  }
}

module.exports = {
  constraintOne
}