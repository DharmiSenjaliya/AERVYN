import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import LastTimeline from '../worlds/last-timeline/LastTimeline';
import PlayerCharacter from '../characters/PlayerCharacter';
import ThirdPersonCamera from '../camera/ThirdPersonCamera';
import LoadingScreen from '../../components/common/LoadingScreen';
import useGraphicsSettings from '../engine/useGraphicsSettings';

/**
 * World 4: The Last Timeline (The Zero Horizon) - 3D Canvas Scene
 * Transcendent celestial starlight, floating golden/prismatic nexus,
 * player traversal, and ultimate temporal destiny orchestration.
 */
export default function LastTimelineScene({ mobileInput = null }) {
  const playerRef = useRef();
  const graphics = useGraphicsSettings();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<LoadingScreen message="Transcending to The Last Timeline (Zero Horizon)..." />}>
        <Canvas
          shadows={graphics.shadows}
          dpr={graphics.dpr}
          gl={{
            antialias: graphics.antialias,
            powerPreference: graphics.powerPreference,
            toneMappingExposure: graphics.toneMappingExposure
          }}
          style={{ background: '#04020C' }}
        >
          {/* Deep Transcendent Void Background & Celestial Fog */}
          <color attach="background" args={['#04020C']} />
          <fog attach="fog" args={['#04020C', 20, 85]} />

          {/* Celestial Cosmic Starfield */}
          <Stars radius={100} depth={55} count={graphics.starCount} factor={4.5} saturation={0.9} fade speed={1.5} />

          {/* Ambient Celestial Fill Light */}
          <ambientLight intensity={0.6} color="#C4B5FD" />

          {/* Key Solar / Golden Starlight */}
          <directionalLight
            position={[22, 42, 18]}
            intensity={1.8}
            color="#FEF08A"
            castShadow={graphics.shadows}
            shadow-mapSize-width={graphics.shadowMapSize}
            shadow-mapSize-height={graphics.shadowMapSize}
            shadow-camera-near={0.5}
            shadow-camera-far={95}
            shadow-camera-left={-35}
            shadow-camera-right={35}
            shadow-camera-top={35}
            shadow-camera-bottom={-35}
          />

          {/* Fill Prismatic Starlight */}
          <directionalLight
            position={[-20, 30, -20]}
            intensity={0.8}
            color="#38BDF8"
          />

          {/* Void Underside Starlight */}
          <directionalLight
            position={[0, -20, 0]}
            intensity={0.4}
            color="#A855F7"
          />

          {/* World 4 3D Environment & Puzzle Nexus */}
          <LastTimeline playerRef={playerRef} />

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
