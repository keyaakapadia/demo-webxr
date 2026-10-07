// Maps the viewer's local time of day to the look of the water.
// Add ?hour=18.5 to the URL to preview any time.

import * as THREE from 'three';

type Key = { h: number; water: string; sun: number; ambient: number; sunColor: string };

const KEYS: Key[] = [
  { h: 0, water: '#030a1f', sun: 0.15, ambient: 0.25, sunColor: '#6f86d6' },
  { h: 5, water: '#0b2447', sun: 0.2, ambient: 0.3, sunColor: '#7f93d9' },
  { h: 6.5, water: '#3a6f9a', sun: 0.8, ambient: 0.5, sunColor: '#ffb98a' }, // dawn
  { h: 9, water: '#0a6a94', sun: 1.4, ambient: 0.6, sunColor: '#fff0cf' },
  { h: 12.5, water: '#10a8d0', sun: 1.9, ambient: 0.75, sunColor: '#ffffff' }, // noon turquoise
  { h: 16, water: '#0a7ca8', sun: 1.5, ambient: 0.65, sunColor: '#fff0cf' },
  { h: 18.5, water: '#2c5a78', sun: 0.8, ambient: 0.45, sunColor: '#ff9a62' }, // sunset
  { h: 20.5, water: '#0b2a50', sun: 0.25, ambient: 0.3, sunColor: '#7f93d9' },
  { h: 24, water: '#030a1f', sun: 0.15, ambient: 0.25, sunColor: '#6f86d6' },
];

export type Tod = { hour: number; water: string; surface: string; sun: number; ambient: number; sunColor: string; shafts: number; label: string };

export function getTimeOfDay(hour: number): Tod {
  let i = 0;
  while (i < KEYS.length - 2 && hour >= KEYS[i + 1].h) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = (hour - a.h) / (b.h - a.h);
  const mix = (x: string, y: string) => new THREE.Color(x).lerp(new THREE.Color(y), t);
  const water = mix(a.water, b.water);
  const sun = a.sun + (b.sun - a.sun) * t;
  const label =
    hour < 5 || hour >= 21 ? 'Night' : hour < 8 ? 'Dawn' : hour < 11 ? 'Morning' : hour < 15 ? 'Midday' : hour < 18 ? 'Afternoon' : 'Dusk';
  return {
    hour,
    water: '#' + water.getHexString(),
    surface: '#' + water.clone().multiplyScalar(1.8).getHexString(),
    sun,
    ambient: a.ambient + (b.ambient - a.ambient) * t,
    sunColor: '#' + mix(a.sunColor, b.sunColor).getHexString(),
    shafts: Math.min(0.1, sun * 0.05),
    label,
  };
}

export function currentHour(): number {
  const param = new URLSearchParams(window.location.search).get('hour');
  if (param !== null && !Number.isNaN(Number(param))) return Math.min(Math.max(Number(param), 0), 23.99);
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}
