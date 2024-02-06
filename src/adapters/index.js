const { magnitude, radius, length, distance} = require('../utils');

const EARTH_RADIUS = 6378.1; // ish

const adaptSatellites = (data) => {
  return data.satellites.reduce((satelliteAccumulator, satellite) => {
    const h = magnitude(satellite.position) - EARTH_RADIUS;
    const r = radius(h);

    const _baseSatellite = {
      users: {},
      position: satellite.position,
      id: satellite.id,
      userCount: 0,
      height: 0,
      radius: 0,
      length: 0,
      distance: 0
    };

    // if we have not seen this satellite before assign base satellite data structure
    if (!satelliteAccumulator[satellite.id]) satelliteAccumulator[satellite.id] = _baseSatellite;

    // iterate through raw user data for each satellite everytime
    satelliteAccumulator[satellite.id].users = data.users.reduce((userAccumulator, user) => {
      const d = distance(satellite.position, user.position)
      const l = length(d, h);

      // add user if within max range of satellite
      if (l <= r) {
        userAccumulator[user.id] = {
          id: user.id,
          position: user.position,
        }
        satelliteAccumulator[satellite.id].height = h;
        satelliteAccumulator[satellite.id].radius = r;
        satelliteAccumulator[satellite.id].distance = d;
        satelliteAccumulator[satellite.id].length = l;
        satelliteAccumulator[satellite.id].userCount += 1;
      }
      return userAccumulator
    }, {});
    return satelliteAccumulator;
  }, {});
}

const adaptUsers = (data) => {
  return data.users.reduce((userAccumulator, user) => {

    const _baseUser = {
      satellites: {},
      position: user.position,
      id: user.id,
      satelliteCount: 0,
      height: 0,
      radius: 0,
      length: 0,
      distance: 0,
    };

    // if we have not seen this user before assign base user data structure
    if (!userAccumulator[user.id]) userAccumulator[user.id] = _baseUser;

    // iterate through raw user data for each satellite everytime
    userAccumulator[user.id].satellites = data.satellites.reduce((satelliteAccumulator, satellite) => {
      const h = magnitude(satellite.position) - EARTH_RADIUS;
      const r = radius(h);
      const d = distance(satellite.position, user.position)
      const l = length(d, h);

      // add user if within max range of satellite
      if (l <= r) {
        satelliteAccumulator[satellite.id] = {
          id: satellite.id,
          position: satellite.position,
        }
        userAccumulator[user.id].satelliteCount += 1;
        userAccumulator[user.id].height = h;
        userAccumulator[user.id].radius = r;
        userAccumulator[user.id].distance = d;
        userAccumulator[user.id].length = l;
      }
      return satelliteAccumulator
    }, {});
    return userAccumulator;
  }, {});
}

module.exports = {
  adaptUsers,
  adaptSatellites
}