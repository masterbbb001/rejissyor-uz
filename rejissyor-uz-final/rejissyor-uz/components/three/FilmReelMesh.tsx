"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FilmReelMeshProps {
  color?: string;
  scale?: number;
  spinSpeed?: number;
  position?: [number, number, number];
}

/**
 * A procedural 3D film reel — outer ring, hub, and six spokes — built
 * from primitive geometries so it needs no external model files.
 * Used both as the loading indicator and as decoration on genre panels.
 */
export default function FilmReelMesh({
  color = "#C9A227",
  scale = 1,
  spinSpeed = 1,
  position = [0, 0, 0],
}: FilmReelMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * spinSpeed;
    }
  });

  const spokeCount = 6;
  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (i / spokeCount) * Math.PI * 2;
    return (
      <mesh
        key={i}
        position={[Math.cos(angle) * 0.28, Math.sin(angle) * 0.28, 0]}
        rotation={[0, 0, angle]}
      >
        <boxGeometry args={[0.5, 0.05, 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
    );
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh>
        <torusGeometry args={[0.55, 0.06, 16, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.08, 24]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      {spokes}
    </group>
  );
}
