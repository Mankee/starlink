import * as THREE from 'three';

export class Axes {
  constructor(scene: THREE.Scene) {
    const axesHelper = new THREE.AxesHelper( 4 );
    axesHelper.layers.enableAll();
    scene.add(axesHelper);
  }
}
