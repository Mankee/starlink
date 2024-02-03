"use client"; // This is a client component 👈🏽

import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import {twoline2satrec, propagate, Kilometer, EciVec3} from 'satellite.js';

import sampleData from '../../public/05_data.json';

// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
  StarField,
  Starlink,
  StarlinkUser,
  Earth,
  SunLight,
  Axes,
} from "./three";
import { Satellite } from '@/types';
import {EARTH_OBLIGUITY_DEGREES, SATELLITE_LIMIT} from '@/app/constants';

export default function Home() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetch('https://api.spacexdata.com/v4/starlink')
      .then(response => response.json())
      .then((entities) => {
        const adapted: Satellite[] = [];
        for (let i = 0; adapted.length <= SATELLITE_LIMIT; i++) {
          const tle0 = entities[i].spaceTrack.TLE_LINE0;
          const tle1 = entities[i].spaceTrack.TLE_LINE1;
          const tle2 = entities[i].spaceTrack.TLE_LINE2;
          const record = twoline2satrec(tle1, tle2);
          const positionAndVelocity = propagate(record, new Date());
          const position = positionAndVelocity.position as EciVec3<Kilometer>;

          adapted.push({
            type: 'sat',
            position: {
              x: position?.x,
              y: position?.y,
              z: position?.z
            },
            name: tle0.split(' ')[1],
            users: [],
          });
        }

        setSatellites(adapted);
        setLoading(false);
      });

    if (!canvasRef.current) return;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Planet Group
    const group = new THREE.Group();
    group.rotation.z = -EARTH_OBLIGUITY_DEGREES * Math.PI / 180;

    // Scene
    const scene = new THREE.Scene();
    scene.layers.enableAll()
    scene.add(group);

    // Grouped Entities
    const earth = new Earth(group);
    const starlink = new Starlink(satellites, group).addLabelsToSatellites(earth.mesh, camera);
    const users = new StarlinkUser(group, sampleData.users);
    const starField = new StarField(scene, {numStars: 2000});

    // scene objects
    new Axes(scene)
    new SunLight(scene);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 10;

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      earth.animate();
      starlink.animate();
      users.animate();
      starField.animate();
    }

    animate();

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
        document.body.removeChild(labelRenderer.domElement);
      }
    }
  }, [canvasRef, isLoading]);

  return isLoading ? <p>Loading...</p> : <main ref={canvasRef}></main>;
}
