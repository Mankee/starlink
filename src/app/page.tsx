"use client"; // This is a client component 👈🏽

import * as THREE from 'three';
import React, {useEffect, useRef } from 'react';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import data from '../../public/05_data.json'

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

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Planet Group
    const group = new THREE.Group();
    group.rotation.z = -23.5 * Math.PI / 180;

    // Scene
    const scene = new THREE.Scene();
    scene.layers.enableAll()
    scene.add(group);

    // Grouped Entities
    const earth = new Earth(group);
    const starlink = new Starlink(data.satellites, group).addLabelsToSatellites(earth.mesh, camera);
    const users = new StarlinkUser(group, data.users);
    const starField = new StarField(scene,{ numStars: 2000 });

    // scene objects
    new Axes(scene)
    new SunLight(scene);

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
  }, []);

  return <main ref={canvasRef}></main>;
}
