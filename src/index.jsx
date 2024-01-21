// import React from 'react'
import * as THREE from "three";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useLoader } from "@react-three/fiber";
import { Leva } from "leva";
import { OrbitControls, Environment } from "@react-three/drei";
import { ShaderHelper } from "./helpers/ShaderHelper";

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
      {textures.map((texture, index) => (
        <meshBasicMaterial
          name="mat"
          key={index}
          map={texture}
          attach={`material-${index}`}
        />
      ))}
      <ShaderHelper />
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