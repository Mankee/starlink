import * as THREE from 'three';

import {DEFAULT_ROTATION, SCALER} from '@/constants';
import { Satellite } from '@/types';
import { StarlinkLabels } from './labels';
import {Earth} from '@/app/three';

export class StarlinkSatellites {
  points: THREE.Points;
  satellites: Satellite[];
  group: THREE.Group;
  labels: StarlinkLabels;

  constructor(earth: Earth, camera: THREE.Camera, group: THREE.Group, satellites: Satellite[]) {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];

    satellites.forEach(({ position }) => {
      const { x, y, z } = position;
      const vector = new THREE.Vector3(x, y, z);
      vertices.push(vector.x / SCALER, vector.z / SCALER, vector.y / SCALER);
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      size: .025,
      color: new THREE.Color('green'),
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);
    const labels = new StarlinkLabels(earth, points, camera, group)

    this.labels = labels;
    this.group = group;
    this.satellites = satellites;
    this.points = points;
  }

  animate() {
    this.points.geometry.rotateY(DEFAULT_ROTATION * 2)
    this.labels.animate()
  }
}