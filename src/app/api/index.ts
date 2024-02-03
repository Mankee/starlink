import { Satellite} from '@/types';
import { SATELLITE_LIMIT } from '@/constants';
import { EciVec3, Kilometer, propagate, twoline2satrec } from 'satellite.js';
import React from 'react';

export const fetchSatellites = async (setLoading: React.Dispatch<React.SetStateAction<boolean>>, setSatellites: React.Dispatch<React.SetStateAction<Satellite[]>>) => {
  setLoading(true);
  const entities = await fetch('https://api.spacexdata.com/v4/starlink').then(response => response.json())
  const adapted: Satellite[] = [];

  for (let i = 0; adapted.length <= SATELLITE_LIMIT; i++) {
    const tle0 = entities[i].spaceTrack.TLE_LINE0;
    const tle1 = entities[i].spaceTrack.TLE_LINE1;
    const tle2 = entities[i].spaceTrack.TLE_LINE2;
    const record = twoline2satrec(tle1, tle2);
    const positionAndVelocity = propagate(record, new Date());
    const position = positionAndVelocity.position as EciVec3<Kilometer>;

    adapted.push({
      type: 'sat',
      position: {
        x: position?.x,
        y: position?.y,
        z: position?.z
      },
      name: tle0.split(' ')[1],
      users: [],
    });
  }

  setSatellites(adapted);
  setLoading(false);
}