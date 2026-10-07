// This directive tells Next.js that this component runs on the client-side
// It's needed because we're using browser-specific features like 3D graphics and WebXR
'use client';

// Import required components for 3D rendering
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { Room } from './components/Room';
import { Underwater } from './components/Underwater';
import { getTimeOfDay, currentHour } from './components/timeOfDay';

// Import XR components for WebXR functionality (AR/VR)
import { XR, createXRStore, XROrigin } from '@react-three/xr';

// Create an XR store that manages the WebXR session state
// This store handles entering/exiting AR/VR modes and manages XR-specific functionality
const store = createXRStore();

// Main homepage component that renders our 3D scene with XR capabilities
export default function Home() {
  // Water colour follows the viewer's local time of day (re-checked every 30s)
  const [hour, setHour] = useState(12);
  useEffect(() => {
    setHour(currentHour());
    const id = setInterval(() => setHour(currentHour()), 30000);
    return () => clearInterval(id);
  }, []);
  const tod = getTimeOfDay(hour);
  return (
    // Container div that takes up the full viewport (100% width and height)
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, padding: '8px 14px', borderRadius: 999, background: 'rgba(0,0,0,0.45)', color: '#fff', fontWeight: 600 }}>
        {tod.label} · {String(Math.floor(hour)).padStart(2, '0')}:{String(Math.floor((hour % 1) * 60)).padStart(2, '0')}
      </div>
      
      {/* 
        Canvas is the main React Three Fiber component that creates a 3D scene
        It sets up WebGL context and handles rendering
        camera prop sets the initial camera position [x, y, z]
        
        The XR component will automatically provide the default "Enter XR" UI
        which intelligently shows AR/VR options based on device capabilities
      */}
      <Canvas camera={{ position: [0, 1.6, 0.1] }}>
        
        {/* 
          XR WRAPPER
          The XR component enables WebXR functionality for everything inside it
          It handles XR session management, input tracking, and rendering adjustments
          
          Using default settings which automatically:
          - Shows the built-in "Enter XR" UI in the top center
          - Detects device capabilities (AR/VR support)
          - Provides appropriate options based on the device
          - Handles session management and transitions
        */}
        <XR store={store}>
        
        {/* 
          XR ORIGIN - Controls where the user starts in VR/AR
          This positions the user at a good viewing distance from the scene objects
          Position [4, 1.6, 4] places the user:
          - 4 units away on X-axis (to the right)
          - 1.6 units up on Y-axis (average human eye height)
          - 4 units away on Z-axis (forward from scene center)
          This gives a nice diagonal view of both the cube and plant
        */}
        <XROrigin position={[0, 0, 0]} />
        
        {/* Scene: lights, ground, fire, tent, trees, sky */}
        <Room night={Math.min(1, Math.max(0, 1 - tod.sun / 1.4))} />
        <Underwater tod={tod} />

        {/* 
          CAMERA CONTROLS
          OrbitControls allows users to navigate around the 3D scene
          - Left click + drag: Rotate camera around the scene
          - Right click + drag: Pan the camera
          - Scroll wheel: Zoom in and out
          Note: OrbitControls work in both regular 3D mode and XR mode
        */}
        <OrbitControls 
          target={[0, 1.6, 0]}  // Look around from standing eye height in the room
          enablePan={false}
          enableZoom={false}
          enableRotate={true}   // Allow rotating around the scene
        />
        
        </XR> {/* End of XR wrapper - all 3D content above is now XR-enabled */}
      </Canvas>
    </div>
  );
}
