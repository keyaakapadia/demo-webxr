// Constants and small helpers shared by the room and the two habitats.

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ROOM = 4; // half-width of the viewing room in metres
export const WALL_H = 3.2;

// Deterministic pseudo-random so the scene is stable across renders
export const rand = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// A pair of flapping wings. Forward is +x; wings extend along +/-z.
export function Wings({
  span,
  chord,
  color,
  speed = 8,
  amp = 0.6,
  phase = 0,
}: {
  span: number;
  chord: number;
  color: string;
  speed?: number;
  amp?: number;
  phase?: number;
}) {
  const l = useRef<THREE.Group>(null);
  const r = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const f = Math.sin(clock.elapsedTime * speed + phase) * amp;
    if (l.current) l.current.rotation.x = -f;
    if (r.current) r.current.rotation.x = f;
  });
  return (
    <>
      <group ref={l}>
        <mesh position={[0, 0, span / 2]}>
          <boxGeometry args={[chord, 0.02, span]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group ref={r}>
        <mesh position={[0, 0, -span / 2]}>
          <boxGeometry args={[chord, 0.02, span]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
}

// Soft slanted shafts of light falling from above
export function LightShafts({ color, count = 7, height = 8, radius = 1.6, opacity = 0.07 }: { color: string; count?: number; height?: number; radius?: number; opacity?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = rand(i, 40) * Math.PI * 2;
        const r = ROOM + 3 + rand(i, 41) * 7;
        return (
          <mesh key={i} position={[Math.cos(a) * r, height / 2, Math.sin(a) * r]} rotation={[0, 0, (rand(i, 42) - 0.5) * 0.3]}>
            <coneGeometry args={[radius * (0.7 + rand(i, 43)), height, 16, 1, true]} />
            <meshBasicMaterial color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </>
  );
}
