import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export const SCALER = 2500
export const EARTH_RADIUS = 6378.1 / SCALER; // ish
export const GEOMETRY_DETAIL = 16

export { addEarth } from './earth';
export { addSatellites } from './satellites';
export { addUsers } from './users';

export function addStarField(scene: THREE.Scene, { numStars = 500 } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6,
      minDist: radius,
    };
  }
  const verts = [];
  const colors = [];
  const positions = [];
  let col;
  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load("/circle.png"),
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);
  return points;
}

export const addAxesHelper = (scene: THREE.Scene) => {
  const axesHelper = new THREE.AxesHelper( 4 );
  axesHelper.layers.enableAll();
  scene.add( axesHelper );
  return axesHelper;
}

export const addCityLights = (group: THREE.Group) => {
  const geometry = new THREE.IcosahedronGeometry(EARTH_RADIUS, GEOMETRY_DETAIL);
  const loader = new THREE.TextureLoader();

  const lightsMaterial = new THREE.MeshBasicMaterial({
    map: loader.load("/earthlights10k.jpg"),
    blending: THREE.AdditiveBlending,
    opacity: .2
  });
  const lightsMesh = new THREE.Mesh(geometry, lightsMaterial);
  group.add(lightsMesh);
  return lightsMesh;
}

export const addSunlight = (scene: THREE.Scene) => {
  const sunLight = new THREE.DirectionalLight(0xffffff, 3);
  sunLight.position.set(1, 0, 0);
  scene.add(sunLight)
  return sunLight;
}

export const addClouds = (group: THREE.Group) => {
  const geometry = new THREE.IcosahedronGeometry(EARTH_RADIUS, 12);
  const loader = new THREE.TextureLoader();

  const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("/earthcloudmap.jpg"),
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.25,
    alphaMap: loader.load('/earthcloudmaptrans.jpg'),
  });
  const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
  cloudsMesh.scale.setScalar(1.003);
  group.add(cloudsMesh);
  return cloudsMesh;
}

export const addGlow = (group: THREE.Group) => {
  const geometry = new THREE.IcosahedronGeometry(EARTH_RADIUS, GEOMETRY_DETAIL);
  const fresnelMat = getFresnelMat();
  const glowMesh = new THREE.Mesh(geometry, fresnelMat);
  glowMesh.scale.setScalar(1.01);
  group.add(glowMesh);
  return glowMesh;
}

function getFresnelMat({rimHex = 0x0088ff, facingHex = 0x000000} = {}) {
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) },
    color2: { value: new THREE.Color(facingHex) },
    fresnelBias: { value: 0.1 },
    fresnelScale: { value: 1.0 },
    fresnelPower: { value: 4.0 },
  };
  const vs = `
  uniform float fresnelBias;
  uniform float fresnelScale;
  uniform float fresnelPower;
  
  varying float vReflectionFactor;
  
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  
    vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  
    vec3 I = worldPosition.xyz - cameraPosition;
  
    vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
  
    gl_Position = projectionMatrix * mvPosition;
  }
  `;
  const fs = `
  uniform vec3 color1;
  uniform vec3 color2;
  
  varying float vReflectionFactor;
  
  void main() {
    float f = clamp( vReflectionFactor, 0.0, 1.0 );
    gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
  }
  `;
  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  return fresnelMat;
}
export { getFresnelMat };

// https://github.com/gre/smoothstep/blob/master/index.js
const smoothstep = (min: number, max: number, value: number) => {
  var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x*x*(3 - 2*x);
};

export const addPointLabels = (earth: THREE.Mesh, camera: THREE.Camera, satellites: any) => {
  return satellites.map((satellite: any) => {
    const element = document.createElement( 'div' );
    element.className = 'label';
    element.style.backgroundColor = 'transparent';
    element.textContent = `sat ${satellite.id}`;
    const label = new CSS2DObject(element);
    label.position.set(satellite.x / SCALER, satellite.z / SCALER, satellite.y / SCALER);
    label.center.set(0, 0);
    // label.layers.set(0)

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
        console.log(d)
        element.style.opacity = d;
      }
    }

    earth.add(label);
    return label;
  });
}