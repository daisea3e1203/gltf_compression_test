import "./style/main.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

// Setup dimensions
// +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+-
const sizes = {};
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
});

// Construct Scene
// ======================================================================
const scene = new THREE.Scene();
RectAreaLightUniformsLib.init(); // Initialize rect light related constants
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 2.8, 4.5);
scene.add(camera);

// Lights
// +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+-
const intensity1 = 25;
const intensity2 = 30;

[0, 1, 2].forEach((i) => {
  const offset = i * 2;
  const lookAt = [0, offset, 0];

  const lightPos1 = [2, 2 + offset, 1];
  const rectLight1 = new THREE.RectAreaLight(0xffdddd, intensity1, 1, 1);
  rectLight1.position.set(...lightPos1);
  rectLight1.lookAt(...lookAt);
  scene.add(rectLight1);
  const helper1 = new RectAreaLightHelper(rectLight1);
  rectLight1.add(helper1);

  const lightPos2 = [-2, -1 + offset, -1.5];
  const rectLight2 = new THREE.RectAreaLight(0xaaaaff, intensity2, 1, 1);
  rectLight2.position.set(...lightPos2);
  rectLight2.lookAt(...lookAt);
  scene.add(rectLight2);
  const helper2 = new RectAreaLightHelper(rectLight2);
  rectLight2.add(helper2);
});

// Geo
// +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+-
const group = new THREE.Group();
scene.add(group);

// 1. MeshOptimized GLTF
console.time("mo");
const moLoader = new GLTFLoader();
moLoader.setMeshoptDecoder(MeshoptDecoder);
moLoader.load(
  "rop_gltf_crag_mat_pack_cc.glb",
  (gltf) => {
    const pos = [0, 0, 0];

    const mesh = gltf.scene.getObjectByName("crag");
    console.log("mo");
    console.log(mesh);
    // ex) Change mat color to white.
    // mesh.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     child.material.color.set(0xffffff);
    //   }
    // });
    const model = new THREE.Group();
    model.add(mesh);
    model.position.set(...pos);
    group.add(model);
    console.timeEnd("mo");
  },
  undefined,
  (err) => {
    console.error(err);
  }
);

// 2. Draco Compressed GLTF
console.time("drc");
const drcLoader = new DRACOLoader();
drcLoader.setDecoderPath("draco/");
const drcGltfLoader = new GLTFLoader();
drcGltfLoader.setDRACOLoader(drcLoader);
drcGltfLoader.load(
  "rop_gltf_crag_mat_drc.glb",
  (gltf) => {
    console.log("draco");
    console.log(gltf);
    const pos = [0, 2, 0];

    const mesh = gltf.scene.getObjectByName("crag");
    const model = new THREE.Group();
    model.add(mesh);
    model.position.set(...pos);
    group.add(model);
    console.timeEnd("drc");
  },
  undefined,
  (err) => {
    console.error(err);
  }
);

// 3. Simple GLTF
console.time("raw");
const loader = new GLTFLoader();
loader.load("rop_gltf_crag_mat.glb", (gltf) => {
  const pos = [0, 4, 0];

  const mesh = gltf.scene.getObjectByName("crag");
  console.log("raw");
  console.log(mesh);
  const model = new THREE.Group();
  model.add(mesh);
  model.position.set(...pos);
  group.add(model);
  console.timeEnd("raw");
});

// Setup render loop
// ======================================================================
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector(".webgl"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

const loop = () => {
  // Update
  group.rotation.y += 0.01;

  // Render
  renderer.render(scene, camera);

  // Keep looping
  window.requestAnimationFrame(loop);
};
loop();
