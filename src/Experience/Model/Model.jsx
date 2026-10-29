
import { useEffect, useRef, useState } from "react";

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

  // ==========================================
  // MOBILE DETECTION
  // ==========================================

  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(max-width: 768px)"
    );

    const handleChange = (e) => {
      setIsMobile(e.matches);
      isHovered.current = false;
      document.body.style.cursor = "auto";
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
      document.body.style.cursor = "auto";
    };
  }, []);

  // ==========================================
  // LOAD MODEL
  // ==========================================

  const modelPath = `${import.meta.env.BASE_URL}Model.glb`;

  const { scene, animations } = useGLTF(modelPath);

  // ==========================================
  // MODEL TRANSFORMS
  // ==========================================

  const position = [-0.5, -0.1, 0.6];

  const rotation = [0.12, 1.37, -0.07];

  const scale = isMobile ? 0.8 : 1.07;

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
  // PLAY ANIMATION FORWARD
  // ==========================================

  const playForward = () => {
    const action = getAction();

    if (!action) return;

    action.enabled = true;
    action.paused = false;
    action.timeScale = Math.abs(animationSpeed);

    // Restart if animation has already finished
    if (action.time >= action.getClip().duration) {
      action.time = 0;
    }

    action.play();
  };

  // ==========================================
  // PLAY ANIMATION BACKWARD
  // ==========================================

  const playBackward = () => {
    const action = getAction();

    if (!action) return;

    action.enabled = true;
    action.paused = false;
    action.timeScale = -Math.abs(animationSpeed);

    action.play();
  };

  // ==========================================
  // DESKTOP HOVER
  // ==========================================

  const handlePointerOver = (e) => {
    e.stopPropagation();

    if (isMobile || isHovered.current) return;

    isHovered.current = true;

    document.body.style.cursor = "pointer";

    playForward();
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();

    if (isMobile || !isHovered.current) return;

    isHovered.current = false;

    document.body.style.cursor = "auto";

    playBackward();
  };

  // ==========================================
  // MOBILE CLICK / TAP
  // ==========================================

  const handleClick = (e) => {
    e.stopPropagation();

    if (!isMobile) return;

    isHovered.current = !isHovered.current;

    if (isHovered.current) {
      playForward();
    } else {
      playBackward();
    }
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
        onClick={handleClick}
      >
        <primitive object={scene} />
      </group>
    </Float>
  );
};

// ==========================================
// PRELOAD MODEL
// ==========================================

useGLTF.preload(
  `${import.meta.env.BASE_URL}Model.glb`
);

export default Model;
