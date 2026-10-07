// Habitat 1: a coral reef seen through the glass walls: fish, a school, manta ray,
// sea turtle, jellyfish, coral, kelp, light shafts and drifting bubbles.

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { ROOM, rand, Wings, LightShafts } from './shared';
import type { Tod } from './timeOfDay';

function Fish({ i }: { i: number }) {
  const group = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const p = useMemo(() => {
    const colors = ['#ff7a3c', '#ffd23f', '#3cc7ff', '#ff5d8f', '#7cf29a', '#c58bff'];
    return {
      color: colors[i % colors.length],
      radius: ROOM + 1.2 + rand(i, 1) * 5,
      height: 0.5 + rand(i, 2) * 2.5,
      speed: 0.08 + rand(i, 3) * 0.14,
      dir: rand(i, 4) > 0.5 ? 1 : -1,
      phase: rand(i, 5) * Math.PI * 2,
      size: 0.25 + rand(i, 6) * 0.35,
    };
  }, [i]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = p.phase + p.dir * p.speed * t;
    if (group.current) {
      group.current.position.set(Math.cos(a) * p.radius, p.height + Math.sin(t * 0.7 + p.phase) * 0.25, Math.sin(a) * p.radius);
      group.current.rotation.y = -a - (p.dir * Math.PI) / 2;
    }
    if (tail.current) tail.current.rotation.y = Math.sin(t * 9 + p.phase) * 0.6;
  });

  return (
    <group ref={group} scale={p.size}>
      <mesh scale={[1, 0.55, 0.35]}>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshStandardMaterial color={p.color} roughness={0.35} metalness={0.2} />
      </mesh>
      <mesh position={[0.05, 0.38, 0]} rotation={[0, 0, -0.3]} scale={[1, 1, 0.15]}>
        <coneGeometry args={[0.22, 0.4, 4]} />
        <meshStandardMaterial color={p.color} />
      </mesh>
      <group ref={tail} position={[-0.6, 0, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]} scale={[1, 1, 0.3]}>
          <coneGeometry args={[0.35, 0.6, 4]} />
          <meshStandardMaterial color={p.color} />
        </mesh>
      </group>
      {[0.2, -0.2].map((z) => (
        <mesh key={z} position={[0.4, 0.08, z]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

// A dense school of small silver fish moving as one
function School({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        a: rand(i, 20) * 6.28,
        s: 0.5 + rand(i, 21) * 0.4,
        r: 0.5 + rand(i, 22) * 1.8,
        y: (rand(i, 23) - 0.5) * 1.4,
        w: rand(i, 24) * 6,
      })),
    [count]
  );
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    const tc = t * 0.06;
    const cx = Math.cos(tc) * 9;
    const cz = Math.sin(tc) * 9;
    const cy = 1.9 + Math.sin(t * 0.2) * 0.4;
    data.forEach((d, i) => {
      const a = d.a + t * d.s;
      dummy.position.set(cx + Math.cos(a) * d.r, cy + d.y + Math.sin(a * 2 + d.w) * 0.2, cz + Math.sin(a) * d.r);
      dummy.rotation.set(0, -a - Math.PI / 2, 0);
      dummy.scale.set(2, 0.8, 0.5);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.1, 8, 6]} />
      <meshStandardMaterial color="#d6ecff" metalness={0.7} roughness={0.25} />
    </instancedMesh>
  );
}

function Manta() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = 1 + t * 0.05;
    if (g.current) {
      g.current.position.set(Math.cos(a) * 10.5, 2.6 + Math.sin(t * 0.4) * 0.3, Math.sin(a) * 10.5);
      g.current.rotation.y = -a - Math.PI / 2;
    }
  });
  return (
    <group ref={g} scale={1.4}>
      <mesh scale={[1.2, 0.14, 0.7]}>
        <sphereGeometry args={[0.6, 16, 10]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.5} />
      </mesh>
      <mesh position={[-1.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.03, 1.4, 6]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <Wings span={1.5} chord={0.9} color="#34495e" speed={1.6} amp={0.35} />
    </group>
  );
}

function Turtle() {
  const g = useRef<THREE.Group>(null);
  const f = useRef<THREE.Group[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = 2 - t * 0.07;
    if (g.current) {
      g.current.position.set(Math.cos(a) * 7.2, 1.5 + Math.sin(t * 0.5) * 0.2, Math.sin(a) * 7.2);
      g.current.rotation.y = -a + Math.PI / 2;
    }
    f.current.forEach((fl, i) => {
      if (fl) fl.rotation.x = Math.sin(t * 2 + (i % 2) * Math.PI) * 0.5 * (i < 2 ? 1 : -1);
    });
  });
  return (
    <group ref={g} scale={0.9}>
      <mesh scale={[1, 0.45, 0.8]}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshStandardMaterial color="#5b7a3a" roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0.55, 0.05, 0]}>
        <sphereGeometry args={[0.15, 12, 10]} />
        <meshStandardMaterial color="#8aa25f" />
      </mesh>
      {[
        [0.25, 0.3],
        [0.25, -0.3],
        [-0.25, 0.3],
        [-0.25, -0.3],
      ].map(([x, z], i) => (
        <group key={i} position={[x, -0.05, z]} ref={(el) => { if (el) f.current[i] = el; }}>
          <mesh position={[0, 0, Math.sign(z) * 0.22]}>
            <boxGeometry args={[0.3, 0.04, 0.45]} />
            <meshStandardMaterial color="#8aa25f" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Jelly({ position, phase }: { position: [number, number, number]; phase: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    if (!g.current) return;
    g.current.position.y = position[1] + Math.sin(t * 0.5) * 0.6;
    g.current.scale.set(1 + Math.sin(t * 2) * 0.08, 1 - Math.sin(t * 2) * 0.12, 1 + Math.sin(t * 2) * 0.08);
  });
  return (
    <group ref={g} position={position}>
      <mesh>
        <sphereGeometry args={[0.45, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ff9de6" emissive="#ff4fc3" emissiveIntensity={0.6} transparent opacity={0.7} />
      </mesh>
      {[0, 1, 2, 3, 4].map((k) => (
        <mesh key={k} position={[Math.cos(k * 1.26) * 0.2, -0.45, Math.sin(k * 1.26) * 0.2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.9, 5]} />
          <meshStandardMaterial color="#ffb3ee" emissive="#ff4fc3" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Kelp({ position, height, phase }: { position: [number, number, number]; height: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.8 + phase) * 0.15;
      ref.current.rotation.x = Math.cos(clock.elapsedTime * 0.6 + phase) * 0.1;
    }
  });
  return (
    <group position={position}>
      <mesh ref={ref} position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.07, height, 6]} />
        <meshStandardMaterial color="#2f9e57" />
      </mesh>
    </group>
  );
}

function Coral({ position, seed }: { position: [number, number, number]; seed: number }) {
  const colors = ['#ff6f91', '#ff9671', '#ffc75f', '#b85cff', '#f9f871'];
  const c = colors[seed % colors.length];
  return (
    <group position={position}>
      {Array.from({ length: 6 }, (_, k) => (
        <mesh key={k} position={[Math.cos(k * 1.05) * 0.25, 0.3, Math.sin(k * 1.05) * 0.25]} rotation={[Math.sin(k * 2) * 0.5, 0, Math.cos(k * 2) * 0.5]}>
          <cylinderGeometry args={[0.04, 0.09, 0.6 + rand(seed, k) * 0.5, 6]} />
          <meshStandardMaterial color={c} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.28, 12, 8]} />
        <meshStandardMaterial color={c} roughness={0.7} flatShading />
      </mesh>
    </group>
  );
}

export function Underwater({ tod }: { tod: Tod }) {
  const kelp = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => {
        const a = rand(i, 7) * Math.PI * 2;
        const r = ROOM + 0.8 + rand(i, 8) * 8;
        return { pos: [Math.cos(a) * r, 0, Math.sin(a) * r] as [number, number, number], h: 0.8 + rand(i, 9) * 2.2, phase: rand(i, 10) * 6 };
      }),
    []
  );
  const coral = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => {
        const a = rand(i, 30) * Math.PI * 2;
        const r = ROOM + 0.8 + rand(i, 31) * 8;
        return { pos: [Math.cos(a) * r, 0, Math.sin(a) * r] as [number, number, number], seed: i };
      }),
    []
  );
  const rocks = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const a = rand(i, 11) * Math.PI * 2;
        const r = ROOM + 1 + rand(i, 12) * 8;
        return { pos: [Math.cos(a) * r, 0.1, Math.sin(a) * r] as [number, number, number], s: 0.3 + rand(i, 13) * 0.7 };
      }),
    []
  );

  return (
    <>
      <color attach="background" args={[tod.water]} />
      <fog attach="fog" args={[tod.water, 3, 21]} />
      <ambientLight intensity={tod.ambient} color="#7fc8ff" />
      <directionalLight position={[3, 10, 2]} intensity={tod.sun} color={tod.sunColor} />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[18, 48]} />
        <meshStandardMaterial color="#d8c48f" roughness={1} />
      </mesh>
      <mesh position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[44, 44]} />
        <meshBasicMaterial color={tod.surface} transparent opacity={0.55} />
      </mesh>

      <LightShafts color={tod.sunColor} opacity={tod.shafts} />
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} scale={r.s}>
          <dodecahedronGeometry args={[0.6]} />
          <meshStandardMaterial color="#6f7a82" flatShading />
        </mesh>
      ))}
      {coral.map((c, i) => (
        <Coral key={i} position={c.pos} seed={c.seed} />
      ))}
      {kelp.map((s, i) => (
        <Kelp key={i} position={s.pos} height={s.h} phase={s.phase} />
      ))}

      {Array.from({ length: 30 }, (_, i) => (
        <Fish key={i} i={i} />
      ))}
      <School />
      <Manta />
      <Turtle />
      <Jelly position={[6, 3, 2]} phase={0} />
      <Jelly position={[-5, 2.5, 5]} phase={2} />
      <Jelly position={[-6, 3.2, -4]} phase={4} />
      <Jelly position={[3, 2.8, -7]} phase={1} />

      <Sparkles count={120} scale={[18, 6, 18]} position={[0, 3, 0]} size={3} speed={0.4} color="#ffffff" />
    </>
  );
}
