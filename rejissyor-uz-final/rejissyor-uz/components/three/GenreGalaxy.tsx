"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { GENRES } from "@/lib/genres";
import type { GenreId } from "@/lib/types";
import FilmReelMesh from "./FilmReelMesh";

interface GenrePanelProps {
  index: number;
  total: number;
  labelUz: string;
  labelEn: string;
  tagline: string;
  accent: "gold" | "curtain";
  onSelect: () => void;
}

function GenrePanel({
  index,
  total,
  labelUz,
  labelEn,
  tagline,
  accent,
  onSelect,
}: GenrePanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const angle = (index / total) * Math.PI * 2;
  const radius = 4.6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const baseY = Math.sin(index * 1.7) * 0.4;

  const color = accent === "curtain" ? "#A22C52" : "#C9A227";

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = baseY + Math.sin(t * 0.6 + index) * 0.12;
    const targetScale = hovered ? 1.15 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12
    );
    // face the center
    groupRef.current.lookAt(0, groupRef.current.position.y, 0);
  });

  return (
    <group
      ref={groupRef}
      position={[x, baseY, z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <RoundedBox args={[1.7, 1.05, 0.08]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#151318"
          emissive={color}
          emissiveIntensity={hovered ? 0.35 : 0.12}
          metalness={0.35}
          roughness={0.55}
        />
      </RoundedBox>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.7, 1.05, 0.08)]} />
        <lineBasicMaterial color={color} transparent opacity={hovered ? 0.9 : 0.45} />
      </lineSegments>

      <Html
        center
        transform
        distanceFactor={5.2}
        position={[0, 0, 0.06]}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div className="w-[220px] px-3 text-center">
          <p
            className="font-display text-[10px] uppercase tracking-[0.2em]"
            style={{ color }}
          >
            {String(index + 1).padStart(2, "0")} · {labelEn}
          </p>
          <p className="mt-1 font-display text-lg uppercase leading-tight text-projector">
            {labelUz}
          </p>
          <p className="mt-1 font-body text-[11px] text-muted">{tagline}</p>
        </div>
      </Html>
    </group>
  );
}

interface GenreGalaxyProps {
  onSelect: (genreId: GenreId) => void;
}

export default function GenreGalaxy({ onSelect }: GenreGalaxyProps) {
  const outerRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += delta * 0.045;
    }
  });

  const genres = useMemo(() => GENRES, []);

  return (
    <group>
      {/* Central spinning reel — the "eye" of the theater */}
      <FilmReelMesh color="#C9A227" scale={1.4} spinSpeed={0.6} position={[0, 0, 0]} />

      <Html
        center
        position={[0, 1.9, 0]}
        style={{ pointerEvents: "none" }}
        transform={false}
      >
        <div className="text-center">
          <p className="font-display text-[11px] uppercase tracking-[0.4em] text-marquee">
            Bir martalik namoyish
          </p>
          <h1 className="mt-1 font-display text-3xl uppercase tracking-wide text-projector md:text-5xl">
            Rejissyor<span className="text-marquee">.uz</span>
          </h1>
          <p className="mx-auto mt-2 max-w-sm font-body text-xs text-muted md:text-sm">
            Janrni tanlang — kameralar aylanadi, sahna esa faqat siz uchun yoziladi.
          </p>
        </div>
      </Html>

      <group ref={outerRef}>
        {genres.map((genre, i) => (
          <GenrePanel
            key={genre.id}
            index={i}
            total={genres.length}
            labelUz={genre.labelUz}
            labelEn={genre.labelEn}
            tagline={genre.tagline}
            accent={genre.accent}
            onSelect={() => onSelect(genre.id)}
          />
        ))}
      </group>
    </group>
  );
}
