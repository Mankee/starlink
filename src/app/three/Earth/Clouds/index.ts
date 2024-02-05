import * as THREE from 'three';
import {EARTH_RADIUS, SCALER} from '@/constants';

export class Clouds {
  mesh: THREE.Mesh
  constructor(group: THREE.Group) {
    const geometry = new THREE.IcosahedronGeometry(EARTH_RADIUS / SCALER, 12);
    const loader = new THREE.TextureLoader();

    const cloudsMat = new THREE.MeshStandardMaterial({
      map: loader.load("/earthcloudmap.jpg"),
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.25,
      alphaMap: loader.load('/earthcloudmaptrans.jpg'),
    });

    const mesh = new THREE.Mesh(geometry, cloudsMat);
    mesh.scale.setScalar(1.003);
    group.add(mesh);

    this.mesh = mesh;
  }

  animate() {
    this.mesh.rotation.y += 0.00023;
  }
}

