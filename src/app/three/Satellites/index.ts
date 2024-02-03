import * as THREE from 'three';

import { SCALER } from '@/app/constants';
import { Satellite } from '@/types';
import { StarlinkLabel } from './labels';

export class Starlink {
  points: THREE.Points;
  satellites: Satellite[];
  group: THREE.Group;
  labels: StarlinkLabel[] | undefined;

  constructor(satellites: Satellite[], group: THREE.Group) {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];

    satellites.forEach(({ coordinates }) => {
      const { x, y, z } = coordinates;
      const vector = new THREE.Vector3(x, y, z);
      vertices.push(vector.x / SCALER, vector.z / SCALER, vector.y / SCALER);
    });

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
      size: .025,
      color: new THREE.Color('green'),
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const points =new THREE.Points(geometry, material);
    group.add(points);

    this.group = group;
    this.satellites = satellites;
    this.points = points;
  }

  addLabelsToSatellites(earth: THREE.Mesh, camera: THREE.Camera) {
    this.labels = this.satellites.map((satellite) => new StarlinkLabel(earth, camera, satellite, this.group));
    return this;
  }

  animate() {
    if (this.labels) this.labels.forEach((label) => label.animate());
    this.points.rotation.y += 0.0002;
  }
}