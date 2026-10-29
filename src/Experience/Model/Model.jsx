
import { useEffect, useRef } from "react";

import {
  useGLTF,
  useAnimations,
  Float,
} from "@react-three/drei";

import * as THREE from "three";

const Model = ({
  // Floating controls
  floatSpeed = 7,
  floatIntensity = 1,
  rotationIntensity = 0.1,
  floatingRange = [-0.1, 0.1],

  // Animation controls
  animationSpeed = 1,
}) => {
  const isHovered = useRef(false);
  const modelPath = `${import.meta.env.BASE_URL}Model.glb`;

  const { scene, animations } = useGLTF(modelPath);

  // ==========================================
  // MODEL TRANSFORMS
  // ==========================================

  const position = [-0.5, -0.1, 0.6];

  const rotation = [0.12, 1.37, -0.07];

  const scale = 1.07;

  // ==========================================
  // ANIMATION SETUP
  // ==========================================

  const { actions, names } = useAnimations(
    animations,
    scene
  );

  const getAction = () => {
    if (!names.length) return null;

    return actions[names[0]] ?? null;
  };

  useEffect(() => {
    const action = getAction();

    if (!action) return;

    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.time = 0;
    action.play();
    action.paused = true;

    return () => {
      action.stop();
    };
  }, [actions, names]);

  // ==========================================
  // PLAY FORWARD ON HOVER
  // ==========================================

  const handlePointerOver = (e) => {
    e.stopPropagation();

    if (isHovered.current) return;

    const action = getAction();

    if (!action) return;

    isHovered.current = true;

    document.body.style.cursor = "pointer";

    action.paused = false;
    action.timeScale = Math.abs(animationSpeed);

    action.play();
  };

  // ==========================================
  // PLAY BACKWARD ON UNHOVER
  // ==========================================

  const handlePointerOut = (e) => {
    e.stopPropagation();

    if (!isHovered.current) return;

    const action = getAction();

    if (!action) return;

    isHovered.current = false;

    document.body.style.cursor = "auto";

    action.paused = false;
    action.timeScale = -Math.abs(animationSpeed);

    action.play();
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <Float
      speed={floatSpeed}
      floatIntensity={floatIntensity}
      rotationIntensity={rotationIntensity}
      floatingRange={floatingRange}
    >
      <group
        position={position}
        rotation={rotation}
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={scene} />
      </group>
    </Float>
  );
};

useGLTF.preload(
  `${import.meta.env.BASE_URL}Model.glb`
);

export default Model;
