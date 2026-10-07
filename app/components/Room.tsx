// The furnished viewing room: wood floor, ceiling lights, bed, sofa, lamp, coffee table
// and glass walls on all four sides.

import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ROOM, WALL_H } from './shared';

type V3 = [number, number, number];

function Box({ p, s, c, r = 0.8, rot }: { p: V3; s: V3; c: string; r?: number; rot?: V3 }) {
  return (
    <mesh position={p} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={r} />
    </mesh>
  );
}

// One glass wall with steel frame and reflection streaks. Local +z faces into the room.
function GlassWall({ rotY, position }: { rotY: number; position: V3 }) {
  const W = ROOM * 2;
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* the glass itself: tinted, glossy, and clearly visible */}
      <mesh position={[0, WALL_H / 2, 0]}>
        <planeGeometry args={[W, WALL_H]} />
        <meshPhysicalMaterial
          color="#a9dcf5"
          transparent
          opacity={0.2}
          roughness={0.02}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* diagonal reflection streaks */}
      {[-3, -1, 1, 3].map((x) => (
        <group key={x}>
          <mesh position={[x - 0.2, WALL_H / 2, 0.005]} rotation={[0, 0, 0.45]}>
            <planeGeometry args={[0.25, WALL_H * 1.1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.1} depthWrite={false} />
          </mesh>
          <mesh position={[x + 0.2, WALL_H / 2, 0.005]} rotation={[0, 0, 0.45]}>
            <planeGeometry args={[0.06, WALL_H * 1.1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.12} depthWrite={false} />
          </mesh>
        </group>
      ))}
      {/* steel frame: rails + mullions */}
      <Box p={[0, 0.1, 0]} s={[W + 0.2, 0.2, 0.18]} c="#1b2229" r={0.35} />
      <Box p={[0, WALL_H - 0.06, 0]} s={[W + 0.2, 0.12, 0.18]} c="#1b2229" r={0.35} />
      {[-4, -2, 0, 2, 4].map((x) => (
        <Box key={x} p={[x, WALL_H / 2, 0]} s={[0.1, WALL_H, 0.14]} c="#1b2229" r={0.35} />
      ))}
      {/* horizontal transom bar */}
      <Box p={[0, WALL_H * 0.72, 0]} s={[W, 0.05, 0.1]} c="#1b2229" r={0.35} />
    </group>
  );
}

function Bed({ position, night }: { position: V3; night: number }) {
  return (
    <group position={position}>
      <Box p={[0, 0.2, 0]} s={[2, 0.3, 2.2]} c="#5a3b22" />
      <Box p={[0, 0.5, 0]} s={[1.9, 0.28, 2.1]} c="#f1ede4" r={1} />
      <Box p={[0, 0.9, -1.1]} s={[2.1, 1, 0.12]} c="#4a2f1b" />
      <Box p={[-0.45, 0.72, -0.8]} s={[0.7, 0.16, 0.4]} c="#ffffff" r={1} />
      <Box p={[0.45, 0.72, -0.8]} s={[0.7, 0.16, 0.4]} c="#ffffff" r={1} />
      <Box p={[0, 0.66, 0.35]} s={[1.95, 0.08, 1.3]} c="#1f4e79" r={1} />
      <Box p={[0, 0.7, 0.9]} s={[1.95, 0.1, 0.3]} c="#e0a458" r={1} />
      {/* bedside table with a small lamp */}
      <Box p={[1.4, 0.3, -0.9]} s={[0.5, 0.6, 0.5]} c="#5a3b22" />
      <mesh position={[1.4, 0.75, -0.9]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial color="#ffe2a8" emissive="#ffc46b" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[1.4, 0.95, -0.9]} color="#ffbf73" intensity={1.5 + night * 3} distance={5} />
    </group>
  );
}

function Sofa({ position, rotY }: { position: V3; rotY: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <Box p={[0, 0.25, 0]} s={[2.4, 0.4, 0.95]} c="#7c8a6e" r={1} />
      <Box p={[0, 0.65, -0.4]} s={[2.4, 0.6, 0.2]} c="#7c8a6e" r={1} />
      <Box p={[-1.2, 0.45, 0]} s={[0.2, 0.55, 0.95]} c="#6b785e" r={1} />
      <Box p={[1.2, 0.45, 0]} s={[0.2, 0.55, 0.95]} c="#6b785e" r={1} />
      <Box p={[0.85, 0.7, 0.05]} s={[0.55, 0.05, 0.9]} c="#c9503c" r={1} rot={[0, 0, -0.5]} />
      <Box p={[-0.5, 0.58, 0.05]} s={[0.5, 0.4, 0.15]} c="#e0a458" r={1} rot={[-0.3, 0, 0]} />
      <Box p={[0.5, 0.58, 0.05]} s={[0.5, 0.4, 0.15]} c="#1f4e79" r={1} rot={[-0.3, 0, 0]} />
    </group>
  );
}

function FloorLamp({ position, night }: { position: V3; night: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.15, 0.28, 0.35, 16, 1, true]} />
        <meshStandardMaterial color="#ffe2a8" emissive="#ffbf73" emissiveIntensity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 1.5, 0]} color="#ffbf73" intensity={3 + night * 6} distance={8} />
    </group>
  );
}

function Plant({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.25, 0.18, 0.5, 14]} />
        <meshStandardMaterial color="#b5653a" roughness={0.9} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.05) * 0.18, 0.85 + (i % 2) * 0.15, Math.sin(i * 1.05) * 0.18]} rotation={[Math.sin(i) * 0.4, 0, Math.cos(i) * 0.4]}>
          <coneGeometry args={[0.12, 0.8, 5]} />
          <meshStandardMaterial color="#3f8f4f" flatShading />
        </mesh>
      ))}
    </group>
  );
}


// Warm fairy lights draped along the top of all four walls
function StringLights({ glow }: { glow: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const pts = useMemo(() => {
    const out: V3[] = [];
    const n = 22;
    const e = ROOM - 0.25;
    const corners: [number, number][] = [[-e, -e], [e, -e], [e, e], [-e, e], [-e, -e]];
    for (let w = 0; w < 4; w++) {
      const [x1, z1] = corners[w];
      const [x2, z2] = corners[w + 1];
      for (let k = 0; k < n; k++) {
        const u = k / n;
        out.push([x1 + (x2 - x1) * u, WALL_H - 0.2 - Math.sin(Math.PI * ((k % 11) / 11)) * 0.18, z1 + (z2 - z1) * u]);
      }
    }
    return out;
  }, []);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const d = new THREE.Object3D();
    const cols = ['#ffd9a0', '#ffb36b', '#ffe8c2', '#ff9f80'];
    pts.forEach((p, i) => {
      d.position.set(...p);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
      m.setColorAt(i, new THREE.Color(cols[i % cols.length]));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [pts]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, pts.length]} frustumCulled={false}>
      <sphereGeometry args={[0.045, 8, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.35 + glow * 0.65} toneMapped={false} />
    </instancedMesh>
  );
}

function Bookshelf({ position, rotY }: { position: V3; rotY: number }) {
  const cols = ['#b44c3a', '#1f4e79', '#e0a458', '#4f7f5a', '#7a4a8c', '#d9d2c3'];
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <Box p={[0, 1, 0]} s={[1.6, 2, 0.35]} c="#4a2f1b" />
      {[0.2, 0.7, 1.2, 1.7].map((y, r) => (
        <group key={y}>
          <Box p={[0, y, 0.02]} s={[1.5, 0.04, 0.33]} c="#5a3b22" />
          {Array.from({ length: 11 }, (_, k) => (
            <Box
              key={k}
              p={[-0.65 + k * 0.13, y + 0.2, 0.03]}
              s={[0.09, 0.3 + ((k * 7 + r * 3) % 4) * 0.05, 0.22]}
              c={cols[(k + r * 2) % cols.length]}
              r={0.9}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function Telescope({ position }: { position: V3 }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2 + 0.5, 0]}>
      {[0, 1, 2].map((k) => (
        <mesh key={k} position={[Math.cos(k * 2.1) * 0.18, 0.55, Math.sin(k * 2.1) * 0.18]} rotation={[Math.sin(k * 2.1) * 0.2, 0, -Math.cos(k * 2.1) * 0.2]}>
          <cylinderGeometry args={[0.015, 0.015, 1.1, 6]} />
          <meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2 - 0.35]}>
        <cylinderGeometry args={[0.06, 0.08, 0.9, 16]} />
        <meshStandardMaterial color="#c9cdd2" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Beanbag({ position, color }: { position: V3; color: string }) {
  return (
    <mesh position={position} scale={[1, 0.62, 1]}>
      <sphereGeometry args={[0.52, 24, 16]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}

function HangingPlant({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, (WALL_H - 2.3) / 2 + 2.3, 0]}>
        <cylinderGeometry args={[0.008, 0.008, WALL_H - 2.3, 4]} />
        <meshStandardMaterial color="#8a7a5a" />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.17, 14, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#d9d2c3" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 7 }, (_, k) => (
        <mesh key={k} position={[Math.cos(k * 0.9) * 0.12, 1.95 - (k % 3) * 0.15, Math.sin(k * 0.9) * 0.12]} rotation={[Math.sin(k) * 0.15, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.01, 0.55 + (k % 3) * 0.15, 5]} />
          <meshStandardMaterial color="#3f9e4a" />
        </mesh>
      ))}
    </group>
  );
}

function Pendant({ position, glow }: { position: V3; glow: number }) {
  return (
    <group position={position}>
      <mesh position={[0, (WALL_H - position[1]) / 2 + 0.2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, WALL_H - position[1], 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh>
        <coneGeometry args={[0.3, 0.25, 24, 1, true]} />
        <meshStandardMaterial color="#e0a458" emissive="#ffb35c" emissiveIntensity={0.6 + glow} side={THREE.DoubleSide} metalness={0.4} roughness={0.4} />
      </mesh>
      <pointLight position={[0, -0.15, 0]} color="#ffb870" intensity={1 + glow * 4} distance={6} />
    </group>
  );
}

function TableDecor() {
  return (
    <group position={[0, 0.445, 0]}>
      {/* candle */}
      <mesh position={[0.15, 0.07, 0.1]}>
        <cylinderGeometry args={[0.04, 0.04, 0.14, 12]} />
        <meshStandardMaterial color="#f4ead2" />
      </mesh>
      <mesh position={[0.15, 0.17, 0.1]}>
        <sphereGeometry args={[0.02, 8, 6]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} />
      </mesh>
      <pointLight position={[0.15, 0.25, 0.1]} color="#ffb35c" intensity={0.8} distance={3} />
      {/* mug */}
      <mesh position={[-0.2, 0.05, -0.1]}>
        <cylinderGeometry args={[0.05, 0.045, 0.1, 14]} />
        <meshStandardMaterial color="#1f4e79" roughness={0.4} />
      </mesh>
      {/* stack of books */}
      <Box p={[-0.05, 0.02, 0.25]} s={[0.3, 0.04, 0.22]} c="#b44c3a" r={0.9} rot={[0, 0.3, 0]} />
      <Box p={[-0.05, 0.06, 0.25]} s={[0.26, 0.04, 0.2]} c="#e0a458" r={0.9} rot={[0, -0.2, 0]} />
    </group>
  );
}

export function Room({ night = 0 }: { night?: number }) {
  // Procedural wood-plank floor texture
  const floorTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const g = c.getContext('2d')!;
    const tones = ['#8b6a47', '#7d5d3d', '#946f4a', '#82633f'];
    for (let i = 0; i < 8; i++) {
      g.fillStyle = tones[i % tones.length];
      g.fillRect(0, i * 64, 512, 64);
      g.fillStyle = 'rgba(0,0,0,0.25)';
      g.fillRect(0, i * 64, 512, 2);
      for (let j = 0; j < 14; j++) {
        g.fillStyle = 'rgba(60,35,15,0.08)';
        g.fillRect(Math.random() * 512, i * 64 + 4 + Math.random() * 56, 80 + Math.random() * 120, 1.5);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  }, []);

  return (
    <>
      {/* floor + ceiling */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM * 2, ROOM * 2]} />
        <meshStandardMaterial map={floorTex} roughness={0.55} />
      </mesh>
      <mesh position={[0, WALL_H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM * 2, ROOM * 2]} />
        <meshStandardMaterial color="#e8e2d6" roughness={1} />
      </mesh>
      {[-2, 2].map((x) =>
        [-2, 2].map((z) => (
          <group key={`${x}${z}`}>
            <mesh position={[x, WALL_H - 0.03, z]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.2, 1.2]} />
              <meshStandardMaterial color="#fff6e0" emissive="#ffe9bf" emissiveIntensity={1.4 - night * 1.1} />
            </mesh>
            <pointLight position={[x, WALL_H - 0.4, z]} color="#ffe9bf" intensity={2.5 - night * 1.9} distance={9} />
          </group>
        ))
      )}

      {/* glass walls */}
      <GlassWall position={[0, 0, -ROOM]} rotY={0} />
      <GlassWall position={[0, 0, ROOM]} rotY={Math.PI} />
      <GlassWall position={[-ROOM, 0, 0]} rotY={Math.PI / 2} />
      <GlassWall position={[ROOM, 0, 0]} rotY={-Math.PI / 2} />

      {/* furniture */}
      <StringLights glow={night} />
      <Bookshelf position={[-3.75, 0, 0.3]} rotY={Math.PI / 2} />
      <Telescope position={[-3, 0, 2.2]} />
      <Beanbag position={[-1.3, 0.3, 2.9]} color="#e07a5f" />
      <Beanbag position={[-2.2, 0.28, 3.3]} color="#3d5a80" />
      <HangingPlant position={[3.5, 0, -1.5]} />
      <HangingPlant position={[-1.2, 0, -3.5]} />
      <Pendant position={[0.4, 2.2, 0.9]} glow={night} />
      <Bed position={[-2.3, 0, -2.5]} night={night} />
      <Sofa position={[2.2, 0, 3]} rotY={Math.PI} />
      <FloorLamp position={[3.3, 0, -3.2]} night={night} />
      <Plant position={[-3.3, 0, 3.2]} />
      <Plant position={[3.4, 0, 1]} />
      <mesh position={[0.4, 0.03, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.7, 40]} />
        <meshStandardMaterial color="#b44c3a" roughness={1} />
      </mesh>
      <mesh position={[0.4, 0.03, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.3, 40]} />
        <meshStandardMaterial color="#f1ede4" roughness={1} />
      </mesh>

      {/* coffee table */}
      <group position={[0.4, 0, 0.9]}>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.05, 32]} />
          <meshStandardMaterial color="#4a2f1b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.06, 0.1, 0.4, 12]} />
          <meshStandardMaterial color="#1b2229" metalness={0.7} roughness={0.3} />
        </mesh>
        <TableDecor />
      </group>
    </>
  );
}
