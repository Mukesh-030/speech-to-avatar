import React, { useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

function AvatarModel({ animationName, onAnimationComplete }) {
  const group = useRef();
  const { scene, animations } = useGLTF(`/${animationName}.glb`);
  const { actions, names, mixer } = useAnimations(animations, group);

  // 🎨 Assign custom material colors based on mesh names
  useEffect(() => {
    const materialColors = {
      Body: 0xffdbac,         // Light skin tone
      Eye: 0x5c5c5c,          // Dark gray
      EyeOcclusion: 0x3d3d3d, // Slightly darker
      Hair_Shape: 0x3b2f2f,   // Dark brown
      pants: 0x333333,        // Blackish
      sandals: 0x6f4e37,      // Brown
      Scalp_Male: 0x2f2f2f,   // Darker hair base
      Space_bun_B: 0x2f2f2f,  // Same as scalp
      TearLine: 0xd9ecff,     // Light bluish white
      Teeth: 0xffffff,        // Pure white
      Tongue: 0xcc3344,       // Reddish pink
      topcloth: 0x4a90e2      // Blue shirt
    };

    scene.traverse((child) => {
      if (child.isMesh) {
        const color = materialColors[child.name];
        if (color !== undefined) {
          child.material = new THREE.MeshStandardMaterial({ color });
          child.castShadow = true;
          child.receiveShadow = true;
          console.log(`🎨 ${child.name} → ${color.toString(16)}`);
        }
      }
    });
  }, [scene]);

  // 🕺 Play animation
  useEffect(() => {
    if (!actions || names.length === 0) return;

    const action = actions[names[0]];
    action.reset().setLoop(THREE.LoopOnce, 1).play();
    action.clampWhenFinished = true;

    const handleFinished = () => {
      if (onAnimationComplete) onAnimationComplete();
    };

    mixer.addEventListener("finished", handleFinished);

    return () => {
      mixer.removeEventListener("finished", handleFinished);
      action.stop();
    };
  }, [actions, names, mixer, onAnimationComplete]);

  return <primitive ref={group} object={scene} scale={2} />;
}

export default function AvatarViewer({ animationName, onAnimationComplete }) {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }} shadows>
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 2, 5]} intensity={1} castShadow />
      <OrbitControls />
      <Suspense fallback={null}>
        <AvatarModel
          animationName={animationName}
          onAnimationComplete={onAnimationComplete}
        />
      </Suspense>
    </Canvas>
  );
}
