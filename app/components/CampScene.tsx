// A cozy moonlit campsite built only from primitive shapes.
// Click/tap (or pinch / trigger in XR) the fire to toggle it on and off.

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Pine tree: brown trunk + stacked green cones
function Tree({ position, height = 3 }: { position: [number, number, number]; height?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, height * 0.15, 0]}>
        <cylinderGeometry args={[0.12, 0.18, height * 0.3, 8]} />
        <meshStandardMaterial color="#4a3222" />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, height * (0.4 + i * 0.25), 0]}>
          <coneGeometry args={[(1 - i * 0.28) * height * 0.28, height * 0.45, 8]} />
          <meshStandardMaterial color={i % 2 ? '#1f5a3a' : '#17482f'} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// Simple A-frame tent
function Tent({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.6, 1.6, 4]} />
        <meshStandardMaterial color="#d9783c" flatShading />
      </mesh>
      {/* dark doorway */}
      <mesh position={[0, 0.5, 1.12]} rotation={[0.35, 0, 0]}>
        <planeGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#2b1a10" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Campfire: ring of stones, logs, flickering flame and warm light
function Campfire({ position }: { position: [number, number, number] }) {
  const [lit, setLit] = useState(true);
  const light = useRef<THREE.PointLight>(null);
  const flame = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flicker = 1 + Math.sin(t * 13) * 0.12 + Math.sin(t * 7.3) * 0.1;
    if (light.current) light.current.intensity = lit ? 14 * flicker : 0;
    if (flame.current) flame.current.scale.set(1, flicker * 1.1, 1);
  });

  const stones = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        return [Math.cos(a) * 0.7, 0.1, Math.sin(a) * 0.7] as [number, number, number];
      }),
    []
  );

  return (
    <group
      position={position}
      onClick={() => setLit((v) => !v)}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      {stones.map((p, i) => (
        <mesh key={i} position={p}>
          <dodecahedronGeometry args={[0.16]} />
          <meshStandardMaterial color="#6b6b70" flatShading />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.15, 0]} rotation={[Math.PI / 2 - 0.3, 0, (i * Math.PI * 2) / 3]}>
          <cylinderGeometry args={[0.07, 0.07, 0.9, 8]} />
          <meshStandardMaterial color="#3b2616" />
        </mesh>
      ))}
      {lit && (
        <>
          <mesh ref={flame} position={[0, 0.5, 0]}>
            <coneGeometry args={[0.25, 0.8, 8]} />
            <meshBasicMaterial color="#ffb347" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.13, 0.5, 8]} />
            <meshBasicMaterial color="#fff1a8" />
          </mesh>
          <Sparkles count={20} scale={[0.6, 2, 0.6]} position={[0, 1.2, 0]} size={3} speed={0.8} color="#ffb347" />
        </>
      )}
      <pointLight ref={light} position={[0, 0.8, 0]} color="#ff9a3c" distance={14} castShadow />
    </group>
  );
}

// Glowing moon
function Moon() {
  return (
    <group position={[-12, 14, -18]}>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#f4f1de" />
      </mesh>
      <directionalLight intensity={0.8} color="#9db4ff" />
    </group>
  );
}

// Log seats around the fire
function LogSeat({ position, rotationY }: { position: [number, number, number]; rotationY: number }) {
  return (
    <mesh position={position} rotation={[0, rotationY, Math.PI / 2]}>
      <cylinderGeometry args={[0.25, 0.25, 1.4, 12]} />
      <meshStandardMaterial color="#5a3b22" />
    </mesh>
  );
}

export function CampScene() {
  const trees = useMemo(() => {
    // Ring of trees around the clearing, deterministic so it doesn't change on re-render
    return Array.from({ length: 22 }, (_, i) => {
      const a = (i / 22) * Math.PI * 2;
      const r = 9 + ((i * 37) % 5);
      return {
        pos: [Math.cos(a) * r, 0, Math.sin(a) * r] as [number, number, number],
        h: 2.5 + ((i * 53) % 20) / 10,
      };
    });
  }, []);

  return (
    <>
      <color attach="background" args={['#0b1026']} />
      <fog attach="fog" args={['#0b1026', 12, 32]} />

      <Stars radius={80} depth={40} count={3000} factor={4} fade speed={0.5} />
      <Moon />
      <ambientLight intensity={0.25} color="#8fa3ff" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color="#1d3a2a" />
      </mesh>

      <Campfire position={[0, 0, 0]} />
      <LogSeat position={[2, 0.25, 0.5]} rotationY={0.3} />
      <LogSeat position={[-1.5, 0.25, 1.8]} rotationY={-0.9} />
      <Tent position={[-3.5, 0, -3]} rotation={[0, 0.7, 0]} />

      {trees.map((t, i) => (
        <Tree key={i} position={t.pos} height={t.h} />
      ))}

      {/* Fireflies drifting through the clearing */}
      <Sparkles count={40} scale={[10, 3, 10]} position={[0, 1.8, 0]} size={4} speed={0.3} color="#d4ff7a" />
    </>
  );
}
