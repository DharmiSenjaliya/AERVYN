import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import LostKingdom from '../worlds/lost-kingdom/LostKingdom';
import PlayerCharacter from '../characters/PlayerCharacter';
import ThirdPersonCamera from '../camera/ThirdPersonCamera';
import LoadingScreen from '../../components/common/LoadingScreen';
import useGraphicsSettings from '../engine/useGraphicsSettings';

/**
 * World 1: The Lost Kingdom 3D Canvas Scene
 * Manages lighting, shadows, camera tracking, and world geometry rendering.
 */
export default function LostKingdomScene({ mobileInput = null }) {
  const playerRef = useRef();
  const graphics = useGraphicsSettings();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<LoadingScreen message="Assembling The Lost Kingdom..." />}>
        <Canvas
          shadows={graphics.shadows}
          dpr={graphics.dpr}
          gl={{
            antialias: graphics.antialias,
            powerPreference: graphics.powerPreference,
            toneMappingExposure: graphics.toneMappingExposure
          }}
          style={{ background: '#080B18' }}
        >
          {/* Atmospheric Cinematic Environment */}
          <color attach="background" args={['#080B18']} />
          <fog attach="fog" args={['#080B18', 18, 70]} />

          {/* Celestial Cosmic Sky */}
          <Stars radius={90} depth={50} count={graphics.starCount} factor={4} saturation={0.6} fade speed={1.2} />

          {/* Primary Ambient Light */}
          <ambientLight intensity={0.45} />

          {/* Moonlight / Temporal Blue Key Directional Light */}
          <directionalLight
            position={[20, 30, 15]}
            intensity={1.3}
            color="#C8E0FF"
            castShadow={graphics.shadows}
            shadow-mapSize-width={graphics.shadowMapSize}
            shadow-mapSize-height={graphics.shadowMapSize}
            shadow-camera-near={0.5}
            shadow-camera-far={80}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />

          {/* Ancient Castle & Courtyard World Geometry */}
          <LostKingdom />

          {/* Playable Protagonist Character */}
          <PlayerCharacter playerRef={playerRef} mobileInput={mobileInput} />

          {/* Third-Person Dynamic Orbit Camera */}
          <PerspectiveCamera makeDefault position={[0, 4.5, 13]} fov={55} />
          <ThirdPersonCamera targetRef={playerRef} />
        </Canvas>
      </Suspense>
    </div>
  );
}
