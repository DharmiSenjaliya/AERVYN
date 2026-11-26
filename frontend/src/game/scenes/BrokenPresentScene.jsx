import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import BrokenPresent from '../worlds/broken-present/BrokenPresent';
import PlayerCharacter from '../characters/PlayerCharacter';
import ThirdPersonCamera from '../camera/ThirdPersonCamera';
import LoadingScreen from '../../components/common/LoadingScreen';

/**
 * World 2: The Broken Present - 3D Canvas Scene
 * Futuristic atmospheric lighting, dark rain smog fog, neon specular tones,
 * character controller, and dynamic camera follow.
 */
export default function BrokenPresentScene({ mobileInput = null }) {
  const playerRef = useRef();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<LoadingScreen message="Assembling The Broken Present..." />}>
        <Canvas
          shadows
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMappingExposure: 1.15
          }}
          style={{ background: '#050814' }}
        >
          {/* Cyberpunk Dark Fog & Atmosphere */}
          <color attach="background" args={['#050814']} />
          <fog attach="fog" args={['#050814', 16, 68]} />

          {/* Deep Smoggy Stars */}
          <Stars radius={85} depth={45} count={2200} factor={3} saturation={0.8} fade speed={1.5} />

          {/* Ambient Cyber Lighting */}
          <ambientLight intensity={0.5} color="#90a4ce" />

          {/* Key Directional Light (Moonlight casting skyscraper shadows) */}
          <directionalLight
            position={[18, 32, 12]}
            intensity={1.4}
            color="#A8CFFF"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={85}
            shadow-camera-left={-32}
            shadow-camera-right={32}
            shadow-camera-top={32}
            shadow-camera-bottom={-32}
          />

          {/* Fill Purple Anomaly Light */}
          <directionalLight
            position={[-15, 20, -10]}
            intensity={0.6}
            color="#7047FF"
          />

          {/* World 2 3D Geometry */}
          <BrokenPresent />

          {/* Playable Protagonist */}
          <PlayerCharacter playerRef={playerRef} mobileInput={mobileInput} />

          {/* Dynamic Third-Person Camera */}
          <PerspectiveCamera makeDefault position={[0, 4.5, 18]} fov={55} />
          <ThirdPersonCamera targetRef={playerRef} />
        </Canvas>
      </Suspense>
    </div>
  );
}
