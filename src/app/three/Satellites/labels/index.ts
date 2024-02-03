import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { SCALER } from '@/constants';
import { Satellite } from '@/types';

// https://github.com/gre/smoothstep/blob/master/index.js
const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value-min)/(max-min)));
  return x * x * (3 - 2 * x);
};

export class StarlinkLabel {
  satellite: Satellite;
  label: CSS2DObject;
  group: THREE.Group;

  constructor(earth: THREE.Mesh, camera: THREE.Camera, satellite: Satellite, group: THREE.Group) {
    const element = document.createElement( 'div' );

    element.className = 'label';
    element.style.backgroundColor = 'transparent';
    element.textContent = satellite.name;


    //
    // const rad = 5;
    // const markerCount = 30;
    // // mMarker.defines = { USE_UV: " " }; // needed to be set to be able to work with UVs
    // // let markers = new THREE.InstancedMesh(gMarker, mMarker, markerCount);
    //
    // let markerInfo: any[] = []; // information on markers
    // let dummy = new THREE.Object3D();
    // for (let i = 0; i < markerCount; i++) {
    //   dummy.position.randomDirection().setLength(rad + 0.1);
    //   dummy.lookAt(dummy.position.clone().setLength(rad + 1));
    //   dummy.updateMatrix();
    //   markers.setMatrixAt(i, dummy.matrix);
    //
    //   markerInfo.push({
    //     id: i + 1,
    //     mag: THREE.MathUtils.randInt(1, 10),
    //     crd: dummy.position.clone()
    //   });
    // }
    //
    // // <Interaction>
    // let pointer = new THREE.Vector2();
    // let raycaster = new THREE.Raycaster();
    // let intersections;
    // let divID = document.getElementById("idNum");
    // let divMag = document.getElementById("magnitude");
    // let divCrd = document.getElementById("coordinates");
    // window.addEventListener("pointerdown", event => {
    //   pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    //   pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //   raycaster.setFromCamera(pointer, camera);
    //   intersections = raycaster.intersectObject(markers).filter(m => {
    //     return (m.uv.subScalar(0.5).length() * 2) < 0.25; // check, if we're in the central circle only
    //   });
    //   //console.log(intersections);
    //   if (intersections.length > 0 && divID && divMag && divCrd) {
    //     let iid = intersections[0].instanceId;
    //     let mi = markerInfo[iid];
    //     divID.innerHTML = `ID: <b>${mi.id}</b>`;
    //     divMag.innerHTML = `Mag: <b>${mi.mag}</b>`;
    //     divCrd.innerHTML = `X: <b>${mi.crd.x.toFixed(2)}</b>; Y: <b>${mi.crd.y.toFixed(2)}</b>; Z: <b>${mi.crd.z.toFixed(2)}</b>`;
    //     label.position.copy(mi.crd);
    //     label.element.animate([
    //       {width: "0px", height: "0px", marginTop: "0px", marginLeft: "0px"},
    //       {width: "230px", height: "50px", marginTop: "-25px", maginLeft: "120px"}
    //     ],{
    //       duration: 250
    //     });
    //     label.element.classList.remove("hidden");
    //   }
    //
    // })



    const label = new CSS2DObject(element);
    const { x, y, z } = satellite.position;
    label.position.set(x / SCALER, z / SCALER, y / SCALER);

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
        d = smoothstep(0.4, 0.7, d);
        element.style.opacity = d;
      }
    }

    earth.add(label);

    this.group = group;
    this.satellite = satellite;
    this.label = label;
  }

  animate() {
    this.label.rotation.y += 0.0002;
    this.label.userData.trackVisibility();
  }
}