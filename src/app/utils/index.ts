import {Entity, Satellite, User} from '@/types';

export const getBeamAngleDegrees = (user: User, satellite: Satellite | Entity) => {
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