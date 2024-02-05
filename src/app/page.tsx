"use client"; // This is a client component 👈🏽

import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { fetchSatellites } from '@/app/api';
import data from '../../public/data.json';
import Stats from 'stats.js';

// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
  StarField,
  StarlinkSatellites,
  StarlinkUsers,
  Earth,
  SunLight,
  Axes,
  Connections
} from "./three";

import { Satellite, User } from '@/types';
import { EARTH_OBLIGUITY_DEGREES, EARTH_RADIUS, SCALER } from '@/constants';

export default function Home() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetchSatellites(setLoading, setSatellites);

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

    // Stats
    const stats = new Stats();
    stats.showPanel( 2 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // Grouped Entities
    const earth = new Earth(group);
    const starlinkUsers = new StarlinkUsers(group, data.users)
    const starlinkSatellites = new StarlinkSatellites(earth, camera, group, satellites)
    const connections = new Connections(group, starlinkSatellites, starlinkUsers);
    const starField = new StarField(scene, { numStars: 2000 });

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
    canvasRef.current.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.minDistance = 2.9;
    controls.maxDistance = 10;


    const animate = () => {
      stats.begin();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
      earth.animate();
      starlinkSatellites.animate();
      starlinkUsers.animate();
      connections.animate()
      starField.animate();
      stats.end();
    }

    animate();

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
        document.body.removeChild(labelRenderer.domElement);
        document.body.removeChild(stats.dom);
      }
    }
  }, [isLoading]);

  return isLoading ? <p>Loading...</p> : <main ref={canvasRef}></main>;
}
