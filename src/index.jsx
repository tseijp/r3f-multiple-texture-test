// import React from 'react'
import * as THREE from "three";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useLoader } from "@react-three/fiber";
import { Leva } from "leva";
import { OrbitControls, Environment } from "@react-three/drei";
import { ShaderHelper, UniformHelper } from "./helpers";
import  * as SHADERS from "./shaders";

const TEXTURES = [
  "/Brick.jpg",
  "/Cracks.jpg",
  "/Metal.jpg",
  "/Stone.jpg",
  "/Rust.jpg",
  "/Wood.jpg",
];

const Sphere = () => {
  const textures = useLoader(THREE.TextureLoader, TEXTURES);

  return (
    <mesh name="sphere">
      <boxGeometry />
      <meshBasicMaterial
        name="mat"
        map={textures[0]}
      />
      <ShaderHelper {...SHADERS} />
      <UniformHelper xxx={1} />
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
    <Leva flat collapsed={false} />
  </>
);