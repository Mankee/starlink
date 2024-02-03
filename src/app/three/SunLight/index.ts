import * as THREE from 'three';

export class SunLight {
  scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    const sunLight = new THREE.DirectionalLight(0xffffff, 3);
    sunLight.position.set(1, 0, 0);
    scene.add(sunLight)

    this.scene = scene;
  }
}

