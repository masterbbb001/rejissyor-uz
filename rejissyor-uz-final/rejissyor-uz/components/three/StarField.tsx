"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * The "kosmik kinozal" backdrop: a slowly-drifting starfield plus
 * fine golden dust, standing in for light scattering through a
 * projector beam in a vast dark hall.
 */
export default function StarField() {
  const starsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.006;
      starsRef.current.rotation.x += delta * 0.0015;
    }
  });

  return (
    <group>
      <Stars
        ref={starsRef as any}
        radius={80}
        depth={50}
        count={3500}
        factor={3}
        saturation={0}
        fade
        speed={0.4}
      />
      <Sparkles
        count={120}
        scale={[30, 14, 30]}
        size={2.2}
        speed={0.25}
        opacity={0.35}
        color="#C9A227"
      />
      <fogExp2 attach="fog" args={["#0a0a0c", 0.028]} />
    </group>
  );
}
