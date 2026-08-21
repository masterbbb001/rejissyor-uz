"use client";

import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import FilmReelMesh from "./FilmReelMesh";

const LINES = [
  "Kadr sozlanmoqda…",
  "Rejissyor stsenariyni yozmoqda…",
  "Yorug'lik sxemasi tayyorlanmoqda…",
  "Aktyorlar joylashmoqda…",
];

interface LoadingReel3DProps {
  position?: [number, number, number];
}

export default function LoadingReel3D({
  position = [0, 0, 0.6],
}: LoadingReel3DProps) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIndex((i) => (i + 1) % LINES.length);
    }, 1100);
    return () => clearInterval(id);
  }, []);

  return (
    <group position={position}>
      <FilmReelMesh color="#C9A227" scale={1.1} spinSpeed={2.2} />
      <Html center position={[0, -0.95, 0]} style={{ pointerEvents: "none" }}>
        <p
          role="status"
          aria-live="polite"
          className="whitespace-nowrap font-display text-[11px] uppercase tracking-[0.25em] text-marquee"
        >
          {LINES[lineIndex]}
        </p>
      </Html>
    </group>
  );
}
