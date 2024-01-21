// import React from 'react'
import * as THREE from "three";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useLoader } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { OrbitControls, Environment } from "@react-three/drei";
import { ShaderHelper, UniformHelper } from "./helpers";
import  * as SHADERS from "./shaders";

const TEXTURES = [
  "/Rust.jpg",
  "/Brick.jpg",
  "/Cracks.jpg",
  "/Wood.jpg",
  "/Stone.jpg",
  "/Metal.jpg",
];

const meshPhyiscalMaterialConfig = {
  emissive: { value: "#000000" },
  routhness: { value: 0.5, min: 0, max: 1 },
  metalness: { value: 0.5, min: 0, max: 1 },
  ior: { value: 1.5, min: 0, max: 2 },
  reflectivity: { value: 0.5, min: 0, max: 1 },
  iridescence: { value: 0.0, min: 0, max: 1 },
  iridescenceIOR: { value: 1.5, min: 0, max: 2 },
  sheen: { value: 0.0, min: 0, max: 1 },
  sheenRoughness: { value: 1.0, min: 0, max: 1 },
  sheenColor: { value: "#000000" },
  clearcoat: { value: 0.0, min: 0, max: 1 },
  clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
  specularIntensity: { value: 1.0, min: 0, max: 1 },
  specularColor: { value: "#ffffff" },
}

const Sphere = () => {
  const textures = useLoader(THREE.TextureLoader, TEXTURES);
  const config = useControls(
    "MeshPhysicalMaterial",
    meshPhyiscalMaterialConfig,
    { collapsed: true }
  );

  return (
    <mesh name="sphere">
      <torusKnotGeometry />
      <meshPhysicalMaterial name="mat" map={textures[0]} {...config} />
      <ShaderHelper {...SHADERS} />
      <UniformHelper xxx={1} textures={textures} />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas
      style={{ position: "fixed", top: 0, left: 0 }}
      camera={{ position: [5, 5, 5], fov: 21 }}
    >
      <color attach="background" args={["#493B45"]} />
      <Suspense>
        <Environment background preset="sunset" />
      </Suspense>
      <Suspense>
        <Sphere />
      </Suspense>
      <OrbitControls />
      <axesHelper />
    </Canvas>
  );
};

createRoot(document.getElementById("root")).render(
  <>
    <App />
    <Leva flat collapsed />
  </>
);