import * as THREE from "three";

const scaler = 2500
export const EARTH_RADIUS = 6378.1 / scaler; // ish
export const GEOMETRY_DETAIL = 16

export const getCoordinatesFromLatLng = function(latitude: number, longitude: number){
  const x = (EARTH_RADIUS * Math.cos(latitude) * Math.cos(longitude));
  const y = (EARTH_RADIUS * Math.cos(latitude) * Math.sin(longitude));
  const z = (EARTH_RADIUS * Math.sin(latitude));
  return { x, y, z };
}

export function getStarfield({ numStars = 500 } = {}) {
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
  return points;
}

export function addSatellites(scene: THREE.Scene, satellites: { x: number, y: number, z: number }[]) {
  const vertices: number[] = [];
  const rotation: number[] = [];
  satellites.forEach(({ x, y, z}) => {
    const vector = new THREE.Vector3(x, y, z);
    vertices.push(vector.x / scaler, vector.z / scaler, vector.y / scaler)
    rotation.push(vector.x / scaler, vector.z / scaler, vector.y / scaler)
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("rotation", new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    size: .025,
    color: new THREE.Color('green'),
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

export function addUsers(scene: THREE.Scene, users: { x: number, y: number, z: number }[]) {
  const vertices: number[] = [];
  const rotation: number[] = [];
  users.forEach(({ x, y, z}) => {
    const vector = new THREE.Vector3(x, y, z);
    vertices.push(vector.x / scaler, vector.z / scaler, vector.y / scaler)
    rotation.push(vector.x / scaler, 0.0004, vector.y / scaler)
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("rotation", new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    size: .025,
    color: new THREE.Color('red'),
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

export const addAxesHelper = (scene: THREE.Scene) => {
  const axesHelper = new THREE.AxesHelper( 4 );
  axesHelper.layers.enableAll();
  scene.add( axesHelper );
}

export const addEarth = (group: THREE.Group) => {
  const geometry = new THREE.IcosahedronGeometry(EARTH_RADIUS, GEOMETRY_DETAIL);
  const loader = new THREE.TextureLoader();
  // const earthMaterial = new THREE.MeshPhongMaterial( {
  //   map: textureLoader.load( 'textures/planets/earth_atmos_2048.jpg' ),
  //   specularMap: textureLoader.load( 'textures/planets/earth_specular_2048.jpg' ),
  //   normalMap: textureLoader.load( 'textures/planets/earth_normal_2048.jpg' ),
  //   normalScale: new THREE.Vector2( 0.85, 0.85 )
  // } );

  const earthMaterial = new THREE.MeshPhongMaterial({
    specular: 0x333333,
    shininess: 5,
    map: loader.load("/earthmap10k.jpg"),
    specularMap: loader.load("/earthspec10k.jpg"),
    bumpMap: loader.load("/earthbump10k.jpg"),
    bumpScale: 0.04,
  });
  const earthMesh = new THREE.Mesh(geometry, earthMaterial);
  group.add(earthMesh);
  return earthMesh
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
    // wireframe: true,
  });
  return fresnelMat;
}
export { getFresnelMat };