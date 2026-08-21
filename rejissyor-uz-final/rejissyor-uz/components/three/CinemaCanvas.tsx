"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import StarField from "./StarField";
import CameraRig from "./CameraRig";
import GenreGalaxy from "./GenreGalaxy";
import ScreenStage from "./ScreenStage";
import ChoiceOrbs from "./ChoiceOrbs";
import type { Genre, GenreId, SceneResponse } from "@/lib/types";

interface CinemaCanvasProps {
  genre: Genre | undefined;
  scene: SceneResponse | null;
  isLoading: boolean;
  errorMessage: string | null;
  onSelectGenre: (genreId: GenreId) => void;
  onChoose: (choiceText: string) => void;
  onRestart: () => void;
}

export default function CinemaCanvas({
  genre,
  scene,
  isLoading,
  errorMessage,
  onSelectGenre,
  onChoose,
  onRestart,
}: CinemaCanvasProps) {
  const mode: "galaxy" | "stage" = genre ? "stage" : "galaxy";

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ fov: 50, near: 0.1, far: 120, position: [0, 1.4, 8.5] }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => gl.setClearColor("#0a0a0c", 1)}
    >
      <Suspense
        fallback={
          <Html center style={{ pointerEvents: "none" }}>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-marquee">
              Zal tayyorlanmoqda…
            </p>
          </Html>
        }
      >
        <ambientLight intensity={0.35} color="#7a6f8f" />
        <pointLight position={[0, 3, 4]} intensity={1.1} color="#C9A227" />
        <pointLight position={[-4, 1, -3]} intensity={0.4} color="#A22C52" />

        <StarField />
        <CameraRig mode={mode} />

        {mode === "galaxy" && <GenreGalaxy onSelect={onSelectGenre} />}

        {mode === "stage" && genre && (
          <>
            <ScreenStage
              genre={genre}
              scene={scene}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
            {scene && !isLoading && !errorMessage && (
              <ChoiceOrbs
                optionA={scene.optionA}
                optionB={scene.optionB}
                isEnding={scene.isEnding}
                disabled={isLoading}
                onChoose={onChoose}
                onRestart={onRestart}
              />
            )}
          </>
        )}
      </Suspense>
    </Canvas>
  );
}
