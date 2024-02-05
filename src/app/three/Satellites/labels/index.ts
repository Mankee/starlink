import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import {DEFAULT_ROTATION, EARTH_RADIUS, GEOMETRY_DETAIL, SCALER} from '@/constants';
import { Satellite } from '@/types';
import {Earth} from '@/app/three';
import {Camera} from 'three';

// https://github.com/gre/smoothstep/blob/master/index.js
const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x * x * (3 - 2 * x);
};

export class StarlinkLabels {
  group: THREE.Group;
  points: THREE.Points;
  earth: Earth;
  camera: Camera;
  labels: CSS2DObject[];

  constructor(earth: Earth, points: THREE.Points, camera: THREE.Camera, group: THREE.Group) {
    const satelliteVertices: THREE.Vector3[] = [];
    const satellitesPosition = points.geometry.getAttribute( 'position' );
    const labels: CSS2DObject[] = [];

    for ( let i = 0; i < satellitesPosition.count; i++ ) {
      const vertex = new THREE.Vector3(
        satellitesPosition.getX(i) * SCALER,
        satellitesPosition.getZ(i) * SCALER,
        satellitesPosition.getY(i) * SCALER,
      );
      satelliteVertices.push(vertex);
    }

    satelliteVertices.forEach((vertex, index) => {
      const element = document.createElement('div');
      element.className = 'label';
      element.style.backgroundColor = 'transparent';
      element.textContent = `${index}`;

      const label = new CSS2DObject(element);
      label.position.set(vertex.x / SCALER, vertex.z / SCALER, vertex.y / SCALER);

      label.userData = {
        cNormal: new THREE.Vector3(),
        cPosition: new THREE.Vector3(),
        mat4: new THREE.Matrix4(),
      }
      const userData = label.userData;
      userData.cNormal.copy(label.position).normalize().applyMatrix3(earth.mesh.normalMatrix);
      userData.cPosition.copy(label.position).applyMatrix4(userData.mat4.multiplyMatrices(camera.matrixWorldInverse, earth.mesh.matrixWorld));
      let d = userData.cPosition.negate().normalize().dot(userData.cNormal);
      d = smoothstep(0.4, 0.7, d);
      element.style.opacity = d;
      if (d > .4) {
        group.add(label)
        labels.push()
      }
    });

    this.labels = labels;
    this.group = group;
    this.earth = earth;
    this.camera = camera;
    this.points = points;
  }

  animate() {
    for (const children of this.points.children ) {
      this.points.remove(children);
      // this.group.remove(this.labels)
      // this.points.remove(this.labels)
    }

    const satelliteVertices: THREE.Vector3[] = [];
    const satellitesPosition = this.points.geometry.getAttribute( 'position' );

    for ( let i = 0; i < satellitesPosition.count; i++ ) {
      const vertex = new THREE.Vector3(
        satellitesPosition.getX(i) * SCALER,
        satellitesPosition.getZ(i) * SCALER,
        satellitesPosition.getY(i) * SCALER,
      );
      satelliteVertices.push(vertex);
    }

    satelliteVertices.forEach((vertex, index) => {
      const element = document.createElement( 'div' );
      element.className = 'label';
      element.style.backgroundColor = 'transparent';
      element.textContent = `${index}`;

      const label = new CSS2DObject(element);
      label.position.set(vertex.x / SCALER, vertex.z / SCALER, vertex.y / SCALER);

      // https://codepen.io/prisoner849/pen/oNopjyb
      label.userData = {
        cNormal: new THREE.Vector3(),
        cPosition: new THREE.Vector3(),
        mat4: new THREE.Matrix4(),
        trackVisibility: () => { // the closer to the edge, the less opacity
          let userData = label.userData;
          userData.cNormal.copy(label.position).normalize().applyMatrix3(this.earth.mesh.normalMatrix);
          userData.cPosition.copy(label.position).applyMatrix4(userData.mat4.multiplyMatrices(this.camera.matrixWorldInverse, this.earth.mesh.matrixWorld));
          let opacity = userData.cPosition.negate().normalize().dot(userData.cNormal);
          opacity = smoothstep(0.4, 0.7, opacity);
          element.style.opacity = opacity;
          return opacity;
        }
      }

      const opacity = label.userData.trackVisibility();
      if (opacity >= .4) this.points.add(label);
    });
  }
}