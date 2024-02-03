import * as THREE from 'three';
import { DEFAULT_ROTATION, EARTH_RADIUS, SCALER } from '@/app/constants';
import { Coordinates, User } from '@/types';

const getCoordinatesFromLatLng = (latitude: number, longitude: number) => {
  const x = (EARTH_RADIUS * Math.cos(latitude) * Math.cos(longitude));
  const y = (EARTH_RADIUS * Math.cos(latitude) * Math.sin(longitude));
  const z = (EARTH_RADIUS * Math.sin(latitude));
  return { x, y, z } as Coordinates;
}

export class StarlinkUser {
  points: THREE.Points;

  constructor(group: THREE.Group, users: User[]) {
    // just testing to see if this works
    const portlandOR = getCoordinatesFromLatLng(45.512230, -122.658722)
    const vertices: number[] = [ portlandOR.x / SCALER, portlandOR.y / SCALER, portlandOR.z / SCALER ];

    users.forEach(({ coordinates }) => {
      const { x, y, z } = coordinates;
      const vector = new THREE.Vector3(x, y, z);
      vertices.push(vector.x / SCALER, vector.z / SCALER, vector.y / SCALER);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      size: .025,
      color: new THREE.Color('red'),
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    this.points = points
  }

  animate() {
    this.points.rotation.y += DEFAULT_ROTATION;
  }
}