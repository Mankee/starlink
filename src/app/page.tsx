"use client"; // This is a client component 👈🏽

import * as THREE from 'three';
import React, { useEffect, useState, useRef } from 'react';
import satelliteData from '../../public/05_satellites.json'
// import satelliteData from '../../public/08_satellites.json'

// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import {
  getStarfield,
  getFresnelMat,
  addSatellites,
  addUsers,
  addEarth,
  addClouds,
  addGlow,
  addAxesHelper,
  EARTH_RADIUS,
  addCityLights
} from "../utils";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // window size
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);

    // @ts-ignore
    canvasRef.current.appendChild(renderer.domElement);

    new OrbitControls(camera, renderer.domElement);

    const axesHelper = new THREE.AxesHelper( 3 );
    axesHelper.layers.enableAll();
    scene.add( axesHelper );

    const group = new THREE.Group();
    group.rotation.z = -23.4 * Math.PI / 180;

    // grouped objects
    const earth = addEarth(group)
    const cityLights = addCityLights(group);
    const clouds = addClouds(group);
    const glow = addGlow(group)
    const satellites = addSatellites(group, satelliteData)

    // scene objects
    const stars = getStarfield({ numStars: 2000 });

    scene.add(group);
    scene.add(stars);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(1, 0, 0);
    scene.add(sunLight);

    function animate() {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.0002;
      satellites.rotation.y += 0.0002;
      cityLights.rotation.y += 0.0002;
      clouds.rotation.y += 0.00023;
      glow.rotation.y += 0.0002;
      stars.rotation.y -= 0.00002;
      renderer.render(scene, camera);
    }

    animate();
    // @ts-ignore
    return () => canvasRef.current.removeChild( renderer.domElement);
  }, []);

  return (
    // <main ref={canvasRef} className="flex min-h-screen flex-col items-center justify-between p-24"/>
    <main ref={canvasRef}/>
  );
}
