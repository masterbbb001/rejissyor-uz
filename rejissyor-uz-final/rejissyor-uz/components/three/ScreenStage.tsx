"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Genre, SceneResponse } from "@/lib/types";
import LoadingReel3D from "./LoadingReel3D";

interface ScreenStageProps {
  genre: Genre;
  scene: SceneResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
}

export default function ScreenStage({
  genre,
  scene,
  isLoading,
  errorMessage,
}: ScreenStageProps) {
  const beamRef = useRef<THREE.Mesh>(null);
  const accent = genre.accent === "curtain" ? "#A22C52" : "#C9A227";

  useFrame((state) => {
    if (beamRef.current) {
      const t = state.clock.getElapsedTime();
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + Math.sin(t * 1.3) * 0.015;
    }
  });

  return (
    <group position={[0, 0.3, -2]}>
      {/* Projector beam cone, aimed from "behind the audience" toward the screen */}
      <mesh
        ref={beamRef}
        position={[0, 1.6, 5.2]}
        rotation={[Math.PI, 0, 0]}
      >
        <coneGeometry args={[3.6, 8, 32, 1, true]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Screen frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[6.6, 3.9, 0.08]} />
        <meshStandardMaterial color="#050505" metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Screen surface */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[6.2, 3.3]} />
        <meshStandardMaterial
          color="#0f0e12"
          emissive={accent}
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Letterbox bars */}
      <mesh position={[0, 1.42, 0.01]}>
        <planeGeometry args={[6.2, 0.45]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0, -1.42, 0.01]}>
        <planeGeometry args={[6.2, 0.45]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 3D loading reel lives in the WebGL scene graph, not inside the Html DOM portal below */}
      {isLoading && <LoadingReel3D position={[0, 0, 0.5]} />}

      {/* Content overlay — DOM-only content (text, error, empty states) */}
      <Html
        center
        position={[0, 0, 0.05]}
        transform={false}
        style={{ pointerEvents: "none" }}
      >
        <div className="w-[min(90vw,560px)] px-4 text-center">
          {!isLoading && errorMessage && (
            <div className="animate-fade-up rounded-sm border border-curtain-bright/40 bg-curtain/10 p-4">
              <p className="font-display text-xs uppercase tracking-widest text-curtain-bright">
                Sahna uzildi
              </p>
              <p className="mt-2 font-body text-sm text-projector">
                {errorMessage}
              </p>
            </div>
          )}

          {!isLoading && !errorMessage && scene && (
            <div className="animate-fade-up space-y-2">
              <p
                className="font-display text-[10px] uppercase tracking-[0.3em]"
                style={{ color: accent }}
              >
                {genre.labelUz} —{" "}
                {scene.isEnding ? "Yakuniy sahna" : "Sahna davom etmoqda"}
              </p>
              <p className="font-body text-sm leading-relaxed text-projector md:text-base">
                {scene.sceneText}
              </p>
              <p className="font-body text-[11px] italic text-muted">
                Kadr: {scene.imagePrompt}
              </p>
            </div>
          )}

          {!isLoading && !errorMessage && !scene && (
            <p className="font-body text-sm text-muted">
              Namoyish boshlanishini kutmoqda…
            </p>
          )}
        </div>
      </Html>
    </group>
  );
}
