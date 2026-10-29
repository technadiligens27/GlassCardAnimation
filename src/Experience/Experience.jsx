
import {
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import Model from "./Model/Model";
import "./Experience.css";

// =====================================
// DIRECTIONAL LIGHT
// =====================================

const MainLight = () => {
  const lightRef = useRef();

  return (
    <directionalLight
      ref={lightRef}
      position={[-242.7, -197.6, 42.4]}
      intensity={5}
      color="#ffffff"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-15}
      shadow-camera-right={15}
      shadow-camera-top={15}
      shadow-camera-bottom={-15}
      shadow-bias={-0.0001}
    >
      <object3D
        attach="target"
        position={[1.5, 0.6, -4.0]}
      />
    </directionalLight>
  );
};

// =====================================
// EXPERIENCE
// =====================================

const Experience = () => {
  return (
    <div className="experience-container">
      <Canvas
        camera={{
          position: [5, 4, 7],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        {/* ENVIRONMENT LIGHTING */}
        <Environment
          preset="studio"
          environmentIntensity={1}
        />

        {/* GENERAL LIGHTING */}
        <ambientLight intensity={0.3} />

        {/* DIRECTIONAL LIGHT */}
        <MainLight />

        {/* MODEL */}
        <Model />

        {/* SOFT SHADOW */}
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.4}
          scale={12}
          blur={3.5}
          far={10}
          resolution={1024}
          color="#666666"
        />

        {/* CAMERA CONTROLS */}
        {/* <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={30}
        /> */}
      </Canvas>
    </div>
  );
};

export default Experience;
