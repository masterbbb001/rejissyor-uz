"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  mode: "galaxy" | "stage";
}

const FRAMING = {
  galaxy: {
    position: new THREE.Vector3(0, 1.4, 8.5),
    target: new THREE.Vector3(0, 0.3, 0),
  },
  stage: {
    position: new THREE.Vector3(0, 0.6, 4.2),
    target: new THREE.Vector3(0, 0.1, -2),
  },
};

/**
 * Sole driver of the camera: eases position/target toward the framing for
 * the current mode, plus a subtle pointer-parallax offset so the scene
 * still feels interactive without a free-fly orbit that could disorient
 * a guided, narrative experience.
 */
export default function CameraRig({ mode }: CameraRigProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const framing = FRAMING[mode];
    const lerpSpeed = 1 - Math.pow(0.001, delta);

    const parallaxX = state.pointer.x * 0.35;
    const parallaxY = state.pointer.y * 0.18;

    const desiredPosition = framing.position
      .clone()
      .add(new THREE.Vector3(parallaxX, parallaxY, 0));

    camera.position.lerp(desiredPosition, lerpSpeed);
    targetRef.current.lerp(framing.target, lerpSpeed);
    camera.lookAt(targetRef.current);
  });

  return null;
}
