import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { EARTH_RADIUS, SCALER } from '../';

export function addSatellites(group: THREE.Group, satellites: { x: number, y: number, z: number }[]) {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  satellites.forEach((satellite) => {
    const { x, y, z } = satellite;
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
  const points = new THREE.Points(geometry, material);
  group.add(points);
  return points;
}