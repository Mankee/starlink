import * as THREE from 'three';

import {DEFAULT_ROTATION, EARTH_RADIUS, SCALER} from '@/constants';
import {StarlinkSatellites, StarlinkUsers} from '@/app/three';

export class Connections {
  group: THREE.Group;
  connections: THREE.Line<THREE.BufferGeometry<THREE.NormalBufferAttributes>>[] = [];
  satellites: StarlinkSatellites;
  users: StarlinkUsers;

  constructor(group: THREE.Group, satellites: StarlinkSatellites, users: StarlinkUsers) {
    const connections: THREE.Line<THREE.BufferGeometry<THREE.NormalBufferAttributes>>[] = [];

    const satelliteVertices = [];
    const satellitesPosition = satellites.points.geometry.getAttribute( 'position' );

    for (let i = 0; i < satellitesPosition.count / satellitesPosition.itemSize; i++) {
      const vertex = new THREE.Vector3(
        satellitesPosition.getX(i) * SCALER,
        satellitesPosition.getZ(i) * SCALER,
        satellitesPosition.getY(i) * SCALER,
      );

      satelliteVertices.push(vertex);
    }

    const userVertices: THREE.Vector3[] = [];
    const usersPosition = users.points.geometry.getAttribute( 'position' );

    for ( let i = 0; i < usersPosition.count / usersPosition.itemSize; i++ ) {
      const vertex = new THREE.Vector3(
        usersPosition.getX(i) * SCALER,
        usersPosition.getZ(i) * SCALER,
        usersPosition.getY(i) * SCALER,
      );

      userVertices.push(vertex);
    }

    // draw lines
    satelliteVertices.forEach((satelliteVertex) => {
      const h = (Math.sqrt((satelliteVertex.x ** 2) + (satelliteVertex.z ** 2) + (satelliteVertex.y ** 2)) - EARTH_RADIUS);
      // console.log(`height ${h}`);

      // plot radius point
      const radius = Math.abs(Math.tan(45) * h);
      // console.log(`radius ${radius}`)
      const circleGeometry = new THREE.CircleGeometry(radius / SCALER, 4);
      // geometry.setFromPoints([satellite])
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true
      });

      // const xPrime = satelliteVertex.x * Math.sqrt(EARTH_RADIUS / Math.sqrt((satelliteVertex.x ** 2) + (satelliteVertex.z ** 2) + (satelliteVertex.y ** 2)));
      // const zPrime = satelliteVertex.z * Math.sqrt(EARTH_RADIUS / Math.sqrt((satelliteVertex.x ** 2) + (satelliteVertex.z ** 2) + (satelliteVertex.y ** 2)));
      // const yPrime = satelliteVertex.y * Math.sqrt(EARTH_RADIUS / Math.sqrt((satelliteVertex.x ** 2) + (satelliteVertex.z ** 2) + (satelliteVertex.y ** 2)));
      // const tangentPoint = new THREE.Vector3(xPrime / SCALER, zPrime / SCALER, yPrime / SCALER)
      // const normal = new THREE.Vector3().copy(tangentPoint)
      //
      // const coverage = new THREE.Mesh(circleGeometry, material);
      // coverage.lookAt(normal)
      // coverage.position.copy(tangentPoint)
      // group.add(coverage);

      // vertices.push(satelliteVertex.x / SCALER, satelliteVertex.z / SCALER,userPosition.y / SCALER);
      userVertices.forEach((userVertex, index) => {
        const vertices = [
          satelliteVertex.x / SCALER, satelliteVertex.z / SCALER, satelliteVertex.y / SCALER,
          userVertex.x / SCALER, userVertex.z / SCALER, userVertex.y / SCALER
        ];
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        const connection = new THREE.Line(lineGeometry, lineMaterial);

        // distance between the user and the satellite xyz space
        const d = Math.sqrt(((satelliteVertex.x - userVertex.x) ** 2) + ((satelliteVertex.y - userVertex.y) ** 2) + ((satelliteVertex.z - userVertex.z) ** 2))
        // console.log(`d ${d}`);

        // distance between the user and the satellite xy space
        const l = Math.sqrt((d ** 2) - (h ** 2));
        // console.log(`l ${l}`)

        if (l <= radius) {
          group.add(connection);
          connections.push(connection)
        }
      })
    });

    this.satellites = satellites;
    this.users = users;
    this.group = group;
    this.connections = connections;
  }

  animate() {
    // memory management of all connections
    this.connections.forEach(connection => {
      connection.geometry.dispose();
      this.group.remove(connection)
    });

    const connections: THREE.Line<THREE.BufferGeometry<THREE.NormalBufferAttributes>>[] = [];

    const satelliteVertices = [];
    // satellites.points.rotateY(DEFAULT_ROTATION)
    // users.points.rotateY(DEFAULT_ROTATION)
    const satellitesPosition = this.satellites.points.geometry.getAttribute( 'position' );

    for ( let i = 0; i < satellitesPosition.count / satellitesPosition.itemSize; i++ ) {
      const vertex = new THREE.Vector3(
        satellitesPosition.getX(i) * SCALER,
        satellitesPosition.getZ(i) * SCALER,
        satellitesPosition.getY(i) * SCALER,
      );

      satelliteVertices.push(vertex);
    }

    const userVertices: THREE.Vector3[] = [];
    const usersPosition = this.users.points.geometry.getAttribute( 'position' );

    for ( let i = 0; i < usersPosition.count / usersPosition.itemSize; i++ ) {
      const vertex = new THREE.Vector3(
        usersPosition.getX(i) * SCALER,
        usersPosition.getZ(i) * SCALER,
        usersPosition.getY(i) * SCALER,
      );

      userVertices.push(vertex);
    }

    // draw lines
    satelliteVertices.forEach((satelliteVertex) => {
      const h = (Math.sqrt((satelliteVertex.x ** 2) + (satelliteVertex.z ** 2) + (satelliteVertex.y ** 2)) - EARTH_RADIUS);
      // console.log(`height ${h}`);

      // plot radius point
      const radius = Math.abs(Math.tan(45) * h);
      // console.log(`radius ${radius}`)
      const circleGeometry = new THREE.CircleGeometry(radius / SCALER, 4);
      // geometry.setFromPoints([satellite])
      const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        wireframe: true
      });

      // const xPrime = satelliteVertex.x * Math.sqrt(EARTH_RADIUS / Math.sqrt((satelliteVertex.x ** 2) + (satelliteVertex.z ** 2) + (satelliteVertex.y ** 2)));
      // const zPrime = satelliteVertex.z * Math.sqrt(EARTH_RADIUS / Math.sqrt((satelliteVertex.x ** 2) + (satelliteVertex.z ** 2) + (satelliteVertex.y ** 2)));
      // const yPrime = satelliteVertex.y * Math.sqrt(EARTH_RADIUS / Math.sqrt((satelliteVertex.x ** 2) + (satelliteVertex.z ** 2) + (satelliteVertex.y ** 2)));
      // const tangentPoint = new THREE.Vector3(xPrime / SCALER, zPrime / SCALER, yPrime / SCALER)
      // const normal = new THREE.Vector3().copy(tangentPoint)
      //
      // const coverage = new THREE.Mesh(circleGeometry, material);
      // coverage.lookAt(normal)
      // coverage.position.copy(tangentPoint)
      // group.add(coverage);

      // vertices.push(satelliteVertex.x / SCALER, satelliteVertex.z / SCALER,userPosition.y / SCALER);
      userVertices.forEach((userVertex, index) => {
        const vertices = [
          satelliteVertex.x / SCALER, satelliteVertex.z / SCALER, satelliteVertex.y / SCALER,
          userVertex.x / SCALER, userVertex.z / SCALER, userVertex.y / SCALER
        ];
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0x0000ff,
          opacity: .5
        });
        const connection = new THREE.Line(lineGeometry, lineMaterial);

        // distance between the user and the satellite xyz space
        const d = Math.sqrt(((satelliteVertex.x - userVertex.x) ** 2) + ((satelliteVertex.y - userVertex.y) ** 2) + ((satelliteVertex.z - userVertex.z) ** 2))
        // console.log(`d ${d}`);

        // distance between the user and the satellite xy space
        const l = Math.sqrt((d ** 2) - (h ** 2));
        // console.log(`l ${l}`)

        if (l <= radius) {
          this.group.add(connection);
          connections.push(connection)
        }
      })
    });
    this.connections = connections;
  }
}