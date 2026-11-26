import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import LoadingScreen from '../../components/common/LoadingScreen';

/**
 * 3D Time Portal & Ancient Castle Courtyard
 * World 1: The Lost Kingdom initial 3D environment
 */
function CastleCourtyard({ isShifting, timelineEra }) {
  const portalRingRef = useRef();
  const portalInnerRef = useRef();
  const castleRef = useRef();

  useFrame((state, delta) => {
    if (portalRingRef.current) {
      portalRingRef.current.rotation.z += delta * 0.4;
      portalRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
    if (portalInnerRef.current) {
      portalInnerRef.current.rotation.z -= delta * 0.6;
    }
  });

  const portalColor =
    timelineEra === 'future'
      ? '#7047FF'
      : timelineEra === 'broken'
      ? '#F5B942'
      : '#00D9FF';

  return (
    <group>
      {/* Ground Courtyard Flagstones */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color={timelineEra === 'future' ? '#0d1527' : '#141b2d'}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Grid Floor Overlay for spatial awareness */}
      <gridHelper args={[100, 50, '#168CFF', '#0d182e']} position={[0, 0.01, 0]} />

      {/* Ancient Castle Ruins - Pillars and Archways */}
      {[-12, -4, 4, 12].map((x, i) => (
        <group key={i} position={[x, 0, -10]}>
          {/* Stone Column */}
          <mesh position={[0, 4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.9, 1.1, 8, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.9} />
          </mesh>
          {/* Capital */}
          <mesh position={[0, 8.2, 0]} castShadow>
            <boxGeometry args={[2.2, 0.6, 2.2]} />
            <meshStandardMaterial color="#334155" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Archway Crossbeam */}
      <mesh position={[0, 8.8, -10]} castShadow>
        <boxGeometry args={[28, 0.8, 2.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* The Central Time Portal */}
      <group position={[0, 4, -9.5]}>
        {/* Outer Torus Ring */}
        <mesh ref={portalRingRef} castShadow>
          <torusGeometry args={[3.2, 0.35, 16, 64]} />
          <meshStandardMaterial
            color={portalColor}
            emissive={portalColor}
            emissiveIntensity={isShifting ? 2.5 : 1.2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Inner Counter-Rotating Ring */}
        <mesh ref={portalInnerRef}>
          <torusGeometry args={[2.5, 0.15, 16, 48]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive={portalColor}
            emissiveIntensity={0.8}
            wireframe={true}
          />
        </mesh>

        {/* Portal Energy Disc Event Horizon */}
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[2.4, 32]} />
          <meshBasicMaterial
            color={portalColor}
            transparent={true}
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Portal Point Light Glow */}
        <pointLight
          color={portalColor}
          intensity={isShifting ? 60 : 30}
          distance={25}
          decay={2}
        />
      </group>
    </group>
  );
}

/**
 * Playable Character Controller
 * Locomotion, WASD keys, Jumping, Running, and Camera follow
 */
function PlayerCharacter({ onPositionUpdate }) {
  const playerRef = useRef();
  const [pos, setPos] = useState([0, 1, 0]);
  const [velocity, setVelocity] = useState([0, 0, 0]);
  const [isJumping, setIsJumping] = useState(false);

  // Active keyboard state
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    space: false
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.current.w = true;
      if (k === 'a' || k === 'arrowleft') keys.current.a = true;
      if (k === 's' || k === 'arrowdown') keys.current.s = true;
      if (k === 'd' || k === 'arrowright') keys.current.d = true;
      if (e.key === 'Shift') keys.current.shift = true;
      if (e.key === ' ') {
        if (!isJumping) {
          keys.current.space = true;
          setIsJumping(true);
        }
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') keys.current.w = false;
      if (k === 'a' || k === 'arrowleft') keys.current.a = false;
      if (k === 's' || k === 'arrowdown') keys.current.s = false;
      if (k === 'd' || k === 'arrowright') keys.current.d = false;
      if (e.key === 'Shift') keys.current.shift = false;
      if (e.key === ' ') keys.current.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping]);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const speed = (keys.current.shift ? 12 : 6) * delta;
    let dx = 0;
    let dz = 0;

    if (keys.current.w) dz -= speed;
    if (keys.current.s) dz += speed;
    if (keys.current.a) dx -= speed;
    if (keys.current.d) dx += speed;

    playerRef.current.position.x += dx;
    playerRef.current.position.z += dz;

    // Jumping physics simulation
    if (isJumping) {
      playerRef.current.position.y += velocity[1] * delta;
      setVelocity((prev) => [prev[0], prev[1] - 25 * delta, prev[2]]);

      if (playerRef.current.position.y <= 1) {
        playerRef.current.position.y = 1;
        setIsJumping(false);
        setVelocity([0, 0, 0]);
      }
    } else if (keys.current.space) {
      setVelocity([0, 10, 0]);
      setIsJumping(true);
    }

    // Gentle walking bob
    if (dx !== 0 || dz !== 0) {
      playerRef.current.rotation.y = Math.atan2(dx, dz);
    }
  });

  return (
    <group ref={playerRef} position={[0, 1, 6]}>
      {/* Character Protagonist Model Placeholder (Armor & Chrono Core) */}
      {/* Torso */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.7, 8, 16]} />
        <meshStandardMaterial color="#168CFF" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Head / Helmet */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial color="#0B132B" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Glowing Chrono Visor */}
      <mesh position={[0, 1.12, 0.2]}>
        <boxGeometry args={[0.3, 0.08, 0.12]} />
        <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={1.8} />
      </mesh>

      {/* Backpack Chrono Relic */}
      <mesh position={[0, 0.5, -0.32]} castShadow>
        <boxGeometry args={[0.35, 0.45, 0.2]} />
        <meshStandardMaterial color="#F5B942" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Character Light */}
      <pointLight color="#00D9FF" intensity={8} distance={8} position={[0, 1, 0]} />
    </group>
  );
}

/**
 * Main 3D Game Canvas View
 */
export default function GameView() {
  const [isShifting, setIsShifting] = useState(false);
  const [timelineEra, setTimelineEra] = useState('lost_kingdom');

  useEffect(() => {
    // Listen for shift trigger from GameLayout HUD
    const handleShift = () => {
      setIsShifting(true);
      setTimeout(() => {
        setTimelineEra((prev) => (prev === 'lost_kingdom' ? 'future' : prev === 'future' ? 'broken' : 'lost_kingdom'));
        setIsShifting(false);
      }, 1200);
    };

    window.addEventListener('aervyn:time-shift', handleShift);
    return () => window.removeEventListener('aervyn:time-shift', handleShift);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Suspense fallback={<LoadingScreen message="Loading 3D World Geometry..." />}>
        <Canvas
          shadows
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ background: '#080B18' }}
        >
          {/* Atmospheric Cinematic Lighting & Fog */}
          <color attach="background" args={['#080B18']} />
          <fog attach="fog" args={['#080B18', 15, 60]} />

          <ambientLight intensity={0.4} />
          <directionalLight
            position={[15, 25, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Deep Space / Celestial Sky */}
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

          {/* World 1 Environment */}
          <CastleCourtyard isShifting={isShifting} timelineEra={timelineEra} />

          {/* Protagonist Character Controller */}
          <PlayerCharacter />

          {/* Interactive Third-Person Orbit Camera */}
          <PerspectiveCamera makeDefault position={[0, 4.5, 13]} fov={55} />
          <OrbitControls
            enableDamping={true}
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={4}
            maxDistance={25}
            target={[0, 1.5, 0]}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
