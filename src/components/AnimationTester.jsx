// src/components/AnimationTester.jsx

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const AnimatedAvatar = () => {
  const group = useRef();
  const { scene, animations } = useGLTF("/avatar.glb");
  const mixer = useRef();

  useEffect(() => {
    if (animations && animations.length > 0) {
      console.log("🎞️ Animations in file:", animations.map((a) => a.name));

      mixer.current = new THREE.AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]); // play first animation
      action.reset().play();

      group.current.add(scene);
    } else {
      console.warn("⚠️ No animations found in the GLB file.");
    }
  }, [animations, scene]);

  useFrame((state, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 5]} />
      <group ref={group} />
    </>
  );
};

const AnimationTester = () => {
  return (
    <Canvas style={{ height: "100vh", background: "#202020" }}>
      <AnimatedAvatar />
    </Canvas>
  );
};

export default AnimationTester;
