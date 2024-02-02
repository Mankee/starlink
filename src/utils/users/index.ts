import * as THREE from 'three';
import { EARTH_RADIUS, SCALER } from '@/utils';

const getCoordinatesFromLatLng = function(latitude: number, longitude: number){
  const x = (EARTH_RADIUS * Math.cos(latitude) * Math.cos(longitude));
  const y = (EARTH_RADIUS * Math.cos(latitude) * Math.sin(longitude));
  const z = (EARTH_RADIUS * Math.sin(latitude));
  return { x, y, z };
}

export function addUsers(group: THREE.Group, users: { x: number, y: number, z: number }[]) {
  const portland = getCoordinatesFromLatLng(45.512230, -122.658722)
  const vertices: number[] = [portland.x / SCALER, portland.y / SCALER, portland.z];

  users.forEach(({ x, y, z}) => {
    const vector = new THREE.Vector3(x, y, z);
    vertices.push(vector.x / SCALER, vector.z / SCALER, vector.y / SCALER);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

  const material = new THREE.PointsMaterial({
    size: .025,
    color: new THREE.Color('red'),
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, material);
  group.add(points);
  return points;
}