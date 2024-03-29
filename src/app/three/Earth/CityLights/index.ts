import * as THREE from 'three';
import {DEFAULT_ROTATION, EARTH_RADIUS, GEOMETRY_DETAIL, SCALER} from '@/constants';

export class CityLights {
  mesh: THREE.Mesh
  constructor(group: THREE.Group) {
    const geometry = new THREE.IcosahedronGeometry(EARTH_RADIUS / SCALER, GEOMETRY_DETAIL);
    const loader = new THREE.TextureLoader();

    const lightsMaterial = new THREE.MeshBasicMaterial({
      map: loader.load("/earthlights4k.jpg"),
      blending: THREE.AdditiveBlending,
      opacity: .2,
    });

    const mesh = new THREE.Mesh(geometry, lightsMaterial);
    group.add(mesh);

    this.mesh = mesh;
  }

  animate() {
    this.mesh.rotateY(DEFAULT_ROTATION)
    // this.mesh.rotation.y += DEFAULT_ROTATION;
  }
}
