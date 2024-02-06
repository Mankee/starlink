const data = require('../public/data.json');
const { adaptUsers, adaptSatellites } = require('./adapters');
const { constraintOne } = require('./constraints');

const main = (data) => {
  const satellites = adaptSatellites(data);
  const users = adaptUsers(data);

  // start pairing down and optimizing connections (mutates satellite and users object)
  constraintOne(satellites, users);

  // filter users without a satellite connection
  const satellitesWithoutUsers = Object.values(satellites).filter(satellite => satellite.userCount <= 0);
  const usersWithoutSatellites = Object.values(users).filter(user => user.satelliteCount <= 0);
  console.log(`Satellites without users: ${satellitesWithoutUsers.length}`)
  console.log(`Users without satellites: ${usersWithoutSatellites.length}`)
}

main(data);