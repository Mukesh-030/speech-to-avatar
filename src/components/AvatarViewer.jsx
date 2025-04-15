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
      Body: 0xffdbac,
      Eye: 0x5c5c5c,
      EyeOcclusion: 0x3d3d3d,
      Hair_Shape: 0x3b2f2f,
      pants: 0x333333,
      sandals: 0x6f4e37,
      Scalp_Male: 0x2f2f2f,
      Space_bun_B: 0x2f2f2f,
      TearLine: 0xd9ecff,
      Teeth: 0xffffff,
      Tongue: 0xcc3344,
      topcloth: 0x4a90e2
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

    // Center the model (move it up)
    scene.position.set(0, -1, 0);
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

  return (
    <primitive
      ref={group}
      object={scene}
      scale={2}
      position={[0, 0, 0]} // No need to adjust here since we're setting scene.position
    />
  );
}

export default function AvatarViewer({ animationName, onAnimationComplete }) {
  return (
    <Canvas camera={{ position: [0, 2, 3], fov: 60 }} shadows>
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 2, 5]} intensity={1} castShadow />
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
      <Suspense fallback={null}>
        <AvatarModel
          animationName={animationName}
          onAnimationComplete={onAnimationComplete}
        />
      </Suspense>
    </Canvas>
  );
}
