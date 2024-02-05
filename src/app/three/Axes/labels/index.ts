import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { SCALER } from '@/constants';
import { Satellite } from '@/types';

// https://github.com/gre/smoothstep/blob/master/index.js
const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x * x * (3 - 2 * x);
};

export class StarlinkLabel {
  label: CSS2DObject;
  group: THREE.Group;

  constructor(earth: THREE.Mesh, camera: THREE.Camera, group: THREE.Group) {
    const element = document.createElement( 'div' );

    element.className = 'label';
    element.style.backgroundColor = 'transparent';
    element.textContent = ``;

    const label = new CSS2DObject(element);
    // label.position.set(x / SCALER, z / SCALER, y / SCALER);
    label.center.set(0, 0);

    earth.add(label);

    this.group = group;
    this.label = label;
  }

  animate() {
    // this.label.rotation.y += 0.0002;
    // this.label.userData.trackVisibility();
  }
}