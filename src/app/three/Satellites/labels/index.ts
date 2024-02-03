import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { SCALER } from '@/app/constants';
import { Satellite } from '@/types';

// https://github.com/gre/smoothstep/blob/master/index.js
const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x * x * (3 - 2 * x);
};

export class StarlinkLabel {
  satellite: Satellite;
  label: CSS2DObject;
  group: THREE.Group;

  constructor(earth: THREE.Mesh, camera: THREE.Camera, satellite: Satellite, group: THREE.Group) {
    const element = document.createElement( 'div' );

    element.className = 'label';
    element.style.backgroundColor = 'transparent';
    element.textContent = `sat ${satellite.id}`;

    const label = new CSS2DObject(element);
    const { x, y, z } = satellite.coordinates;
    label.position.set(x / SCALER, z / SCALER, y / SCALER);
    label.center.set(0, 0);

    // https://codepen.io/prisoner849/pen/oNopjyb
    label.userData = {
      cNormal: new THREE.Vector3(),
      cPosition: new THREE.Vector3(),
      mat4: new THREE.Matrix4(),
      trackVisibility: () => { // the closer to the edge, the less opacity
        let userData = label.userData;
        userData.cNormal.copy(label.position).normalize().applyMatrix3(earth.normalMatrix);
        userData.cPosition.copy(label.position).applyMatrix4(userData.mat4.multiplyMatrices(camera.matrixWorldInverse, earth.matrixWorld));
        let d = userData.cPosition.negate().normalize().dot(userData.cNormal);
        d = smoothstep(0.2, 0.7, d);
        element.style.opacity = d;
      }
    }

    earth.add(label);

    this.group = group;
    this.satellite = satellite;
    this.label = label;
  }

  animate() {
    this.label.rotation.y += 0.0002;
    this.label.userData.trackVisibility();
  }
}