import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { EARTH_RADIUS, GEOMETRY_DETAIL } from '@/utils';

export const addEarth = (group: THREE.Group) => {
  const geometry = new THREE.IcosahedronGeometry(EARTH_RADIUS, GEOMETRY_DETAIL);
  const loader = new THREE.TextureLoader();

  const material = new THREE.MeshPhongMaterial({
    map: loader.load("/earthmap10k.jpg"),
    specularMap: loader.load("/earthspec10k.jpg"),
    bumpMap: loader.load("/earthbump10k.jpg"),
    bumpScale: 0.04,
  });

  const earth = new THREE.Mesh(geometry, material);
  group.add(earth);
  return earth
}