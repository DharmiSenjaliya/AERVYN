import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import FracturedFuture from '../worlds/fractured-future/FracturedFuture';
import PlayerCharacter from '../characters/PlayerCharacter';
import ThirdPersonCamera from '../camera/ThirdPersonCamera';
import LoadingScreen from '../../components/common/LoadingScreen';

/**
 * World 3: The Fractured Future - 3D Canvas Scene
 * Deep cosmic violet and cyan atmospheric lighting, floating islands over the abyss,
 * character controller, camera follow, and boss encounter orchestration.
 */
export default function FracturedFutureScene({ mobileInput = null }) {
  const playerRef = useRef();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<LoadingScreen message="Transcending to The Fractured Future..." />}>
        <Canvas
          shadows
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            toneMappingExposure: 1.2
          }}
          style={{ background: '#060412' }}
        >
          {/* Deep Cosmic Void Background & Atmospheric Fog */}
          <color attach="background" args={['#060412']} />
          <fog attach="fog" args={['#060412', 18, 75]} />

          {/* Celestial Cosmic Starfield */}
          <Stars radius={95} depth={50} count={3000} factor={4} saturation={0.9} fade speed={2.0} />

          {/* Ambient Cosmic Fill Light */}
          <ambientLight intensity={0.55} color="#8b7ab8" />

          {/* Key Directional Starlight (Celestial Violet Starlight casting shadows) */}
          <directionalLight
            position={[20, 38, 16]}
            intensity={1.5}
            color="#D8B4FE"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={95}
            shadow-camera-left={-36}
            shadow-camera-right={36}
            shadow-camera-top={36}
            shadow-camera-bottom={-36}
          />

          {/* Fill Deep Cyan Anomaly Starlight */}
          <directionalLight
            position={[-18, 26, -18]}
            intensity={0.7}
            color="#00D9FF"
          />

          {/* World 3 3D Environment & Boss */}
          <FracturedFuture playerRef={playerRef} />

          {/* Playable Protagonist */}
          <PlayerCharacter playerRef={playerRef} mobileInput={mobileInput} />

          {/* Dynamic Third-Person Camera follow */}
          <PerspectiveCamera makeDefault position={[0, 4.5, 30]} fov={55} />
          <ThirdPersonCamera targetRef={playerRef} />
        </Canvas>
      </Suspense>
    </div>
  );
}
