import * as THREE from 'three';
import { DEFAULT_ROTATION, EARTH_RADIUS, SCALER } from '@/constants';
import {Position, User} from '@/types';

const getCoordinatesFromLatLng = (latitude: number, longitude: number) => {
  const x = (EARTH_RADIUS * Math.cos(latitude) * Math.cos(longitude));
  const y = (EARTH_RADIUS * Math.cos(latitude) * Math.sin(longitude));
  const z = (EARTH_RADIUS * Math.sin(latitude));
  return { x, y, z } as Position;
}

export class StarlinkUsers {
  points: THREE.Points;
  users: User[];
  group: THREE.Group;

  constructor(group: THREE.Group, users: User[]) {
    const vertices: number[] = [];

    users.forEach(({ position }) => {
      const { x, y, z } = position;
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

    this.points = points;
    this.group = group;
    this.users = [];
  }

  animate() {
    this.points.geometry.rotateY(DEFAULT_ROTATION)
    // this.points.rotation.y += DEFAULT_ROTATION;
    // this.points.updateMatrixWorld(true);
  }
}