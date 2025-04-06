import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

function Avatar({ animationName, onAnimationComplete }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/avatar.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = actions[animationName];

    if (action) {
      action.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.2).play();
      action.clampWhenFinished = true;

      const mixer = action.getMixer();
      const handleFinished = () => {
        action.stop();
        if (onAnimationComplete) onAnimationComplete(); // ✅ Notify App when done
      };

      mixer.addEventListener("finished", handleFinished);

      return () => {
        mixer.removeEventListener("finished", handleFinished);
        action.stop();
      };
    }
  }, [animationName, actions, onAnimationComplete]);

  return <primitive ref={group} object={scene} scale={2} />;
}

export default function AvatarViewer({ animationName, onAnimationComplete }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 2, 5]} />
      <OrbitControls />
      <Avatar animationName={animationName} onAnimationComplete={onAnimationComplete} />
    </Canvas>
  );
}
