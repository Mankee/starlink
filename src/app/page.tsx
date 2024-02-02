"use client"; // This is a client component 👈🏽

import * as THREE from 'three';
import React, {useEffect, useState, useRef, LegacyRef} from 'react';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import data from '../../public/05_data.json'
// import data from '../../public/08_data.json'

// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import {
  getStarfield,
  addSatellites,
  addUsers,
  addEarth,
  addClouds,
  addGlow,
  addCityLights,
  addSunlight,
  addAxesHelper
} from "../utils";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const group = new THREE.Group();
    group.rotation.z = -23.5 * Math.PI / 180;

    // grouped objects
    const earth = addEarth(group);
    const cityLights = addCityLights(group);
    const clouds = addClouds(group);
    const glow = addGlow(group);
    const satellites = addSatellites(group, data.satellites);
    const users = addUsers(group, data.users);

    // scene objects
    const axes = addAxesHelper(scene)
    const stars = getStarfield(scene, { numStars: 2000 });
    const sunLight = addSunlight(scene);

    scene.add(group);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls( camera, labelRenderer.domElement );
    controls.minDistance = 3;
    controls.maxDistance = 50;

    function animate() {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.0002;
      satellites.rotation.y += 0.0002;
      users.rotation.y += 0.0002;
      cityLights.rotation.y += 0.0002;
      clouds.rotation.y += 0.00023;
      glow.rotation.y += 0.0002;
      stars.rotation.y -= 0.00002;
      renderer.render(scene, camera);
      labelRenderer.render( scene, camera );
    }

    animate();
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
        document.body.removeChild(labelRenderer.domElement);
      }
    }
  }, []);

  return (
    // <main ref={canvasRef} className="flex min-h-screen flex-col items-center justify-between p-24"/>
    <main ref={canvasRef}></main>
  );
}
