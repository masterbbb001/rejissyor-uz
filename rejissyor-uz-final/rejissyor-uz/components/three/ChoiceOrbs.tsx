"use client";

import { useRef, useState, FormEvent } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface ChoiceSlabProps {
  position: [number, number, number];
  label: string;
  text: string;
  accent: string;
  disabled: boolean;
  onClick: () => void;
}

function ChoiceSlab({ position, label, text, accent, disabled, onClick }: ChoiceSlabProps) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    const targetScale = hovered && !disabled ? 1.08 : 1;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
  });

  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!disabled) {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
    >
      <RoundedBox args={[2.7, 1.0, 0.08]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color="#151318"
          emissive={accent}
          emissiveIntensity={disabled ? 0.05 : hovered ? 0.4 : 0.14}
          metalness={0.3}
          roughness={0.6}
          transparent
          opacity={disabled ? 0.5 : 1}
        />
      </RoundedBox>
      <Html
        center
        transform
        distanceFactor={4.4}
        position={[0, 0, 0.06]}
        style={{ pointerEvents: "none" }}
      >
        <div className="w-[260px] px-3 text-center">
          <p
            className="font-display text-[10px] uppercase tracking-[0.25em]"
            style={{ color: accent }}
          >
            {label}
          </p>
          <p className="mt-1 font-body text-sm text-projector">{text || "…"}</p>
        </div>
      </Html>
    </group>
  );
}

interface ChoiceOrbsProps {
  optionA: string;
  optionB: string;
  isEnding: boolean;
  disabled: boolean;
  onChoose: (choiceText: string) => void;
  onRestart: () => void;
}

export default function ChoiceOrbs({
  optionA,
  optionB,
  isEnding,
  disabled,
  onChoose,
  onRestart,
}: ChoiceOrbsProps) {
  const [customText, setCustomText] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = customText.trim();
    if (!trimmed || disabled) return;
    onChoose(trimmed);
    setCustomText("");
  }

  if (isEnding) {
    return (
      <group position={[0, -1.55, -1.2]}>
        <Html center transform={false} style={{ pointerEvents: "auto" }}>
          <div className="animate-fade-up text-center">
            <p className="mb-3 font-display text-xs uppercase tracking-[0.3em] text-marquee">
              Parda tushdi
            </p>
            <button
              onClick={onRestart}
              className="rounded-sm border border-marquee bg-marquee/10 px-8 py-3 font-display text-sm uppercase tracking-widest text-marquee-bright transition-colors hover:bg-marquee/20 focus-visible:outline-2 focus-visible:outline-marquee"
            >
              Yangi namoyish boshlash
            </button>
          </div>
        </Html>
      </group>
    );
  }

  return (
    <group position={[0, -1.55, -1.2]}>
      <ChoiceSlab
        position={[-2.9, 0.15, 0]}
        label="Variant A"
        text={optionA}
        accent="#C9A227"
        disabled={disabled}
        onClick={() => onChoose(optionA)}
      />
      <ChoiceSlab
        position={[2.9, 0.15, 0]}
        label="Variant B"
        text={optionB}
        accent="#A22C52"
        disabled={disabled}
        onClick={() => onChoose(optionB)}
      />

      {/* Custom-text console, kept as legible screen-anchored HTML for real typing/mobile keyboards */}
      <Html
        center
        position={[0, -1.15, 0]}
        transform={false}
        style={{ pointerEvents: "auto" }}
      >
        <form onSubmit={handleSubmit} className="flex w-[min(90vw,480px)] gap-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            disabled={disabled}
            placeholder="O'z variantingizni yozing..."
            aria-label="O'z variantingizni yozing"
            className="flex-1 rounded-sm border border-grain bg-screen/90 px-4 py-3 font-body text-sm text-projector placeholder:text-muted backdrop-blur focus:border-marquee focus:outline-none disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={disabled || !customText.trim()}
            className="rounded-sm border border-marquee bg-void/60 px-5 py-3 font-display text-xs uppercase tracking-widest text-marquee-bright backdrop-blur transition-colors hover:bg-marquee/10 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-marquee"
          >
            Yuborish
          </button>
        </form>
      </Html>
    </group>
  );
}
