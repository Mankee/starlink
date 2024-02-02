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
  // @ts-ignore
  material.map.colorSpace = THREE.SRGBColorSpace;
  const earth = new THREE.Mesh(geometry, material);
  earth.layers.enableAll();

  const earthDiv = document.createElement( 'div' );
  earthDiv.className = 'label';
  earthDiv.textContent = 'Earth';
  earthDiv.style.backgroundColor = 'transparent';

  const earthLabel = new CSS2DObject( earthDiv );
  earthLabel.position.set( 1.5 * EARTH_RADIUS, 0, 0);
  earthLabel.center.set( 0, 1 );
  earth.add( earthLabel );
  earthLabel.layers.set( 0 );
  group.add(earth);
  return earth
}