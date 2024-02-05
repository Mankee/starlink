import * as THREE from 'three';

import {DEFAULT_ROTATION, EARTH_RADIUS, GEOMETRY_DETAIL, SCALER} from '@/constants';
import { Clouds } from './Clouds';
import { CityLights } from './CityLights';
import { Glow } from './Glow';

export class Earth {
  mesh: THREE.Mesh;
  clouds: Clouds;
  cityLights: CityLights;
  glow: Glow;

  constructor(group: THREE.Group) {
    const geometry = new THREE.IcosahedronGeometry(EARTH_RADIUS / SCALER, GEOMETRY_DETAIL);
    const loader = new THREE.TextureLoader();

    const material = new THREE.MeshPhongMaterial({
      map: loader.load("/earthmap10k.jpg"),
      specularMap: loader.load("/earthspec10k.jpg"),
      bumpMap: loader.load("/earthbump10k.jpg"),
      bumpScale: 0.04,
      // visible: false
    });

    const earth = new THREE.Mesh(geometry, material)
    group.add(earth);

    const clouds = new Clouds(group);
    const cityLights = new CityLights(group);
    const glow = new Glow(group);

    this.mesh = earth;
    this.clouds = clouds;
    this.cityLights = cityLights;
    this.glow = glow;
  }

  animate() {
    this.mesh.rotateY(DEFAULT_ROTATION)
    // this.mesh.rotation.y += DEFAULT_ROTATION;
    this.clouds.animate();
    this.cityLights.animate();
    this.glow.animate();
  }
}