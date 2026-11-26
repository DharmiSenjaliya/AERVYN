import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  Compass, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import LostKingdomScene from '../../game/scenes/LostKingdomScene';
import DesktopControls from '../../game/controls/DesktopControls';
import MobileControls from '../../game/controls/MobileControls';
import AudioSystem from '../../game/systems/AudioSystem';

/**
 * AERVYN: Echoes of Time - Buyer Demo Mode
 * A sandboxed, controlled evaluation slice for prospective publishers and B2B buyers.
 * Runs completely in-memory without polluting or modifying production player saves.
 */
export default function BuyerDemoPage() {
  const navigate = useNavigate();
  const [demoPhase, setDemoPhase] = useState('briefing'); // briefing | playing | completed
  const [mobileInput, setMobileInput] = useState({ x: 0, y: 0, jump: false, sprint: false });
  const [isMobile, setIsMobile] = useState(false);

  // In-Memory Sandboxed Demo State
  const [demoStep, setDemoStep] = useState(1);
  const [hasFragment, setHasFragment] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [portalActive, setPortalActive] = useState(false);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [puzzleDial, setPuzzleDial] = useState(45); // target: 180 degrees
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const checkMobile = () => {
      const touchAvailable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(touchAvailable || window.innerWidth <= 840);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    DesktopControls.init();
    AudioSystem.startAmbience();

    return () => {
      window.removeEventListener('resize', checkMobile);
      DesktopControls.destroy();
    };
  }, []);

  const handleStartSlice = () => {
    AudioSystem.playInteract();
    setDemoPhase('playing');
    showNotification('Objective: Explore the ancient courtyard & collect the Chrono Fragment.');
  };

  const handleCollectFragment = () => {
    if (hasFragment) return;
    AudioSystem.playCollect();
    setHasFragment(true);
    setDemoStep(2);
    showNotification('Chrono Fragment acquired! Approach the central pedestal to align the rune dial.');
  };

  const handleOpenPuzzle = () => {
    if (!hasFragment) {
      showNotification('The pedestal is inactive. Recover the Chrono Fragment first.');
      return;
    }
    AudioSystem.playInteract();
    setShowPuzzleModal(true);
  };

  const handleRotateDial = () => {
    AudioSystem.playInteract();
    const nextAngle = (puzzleDial + 45) % 360;
    setPuzzleDial(nextAngle);

    if (nextAngle === 180) {
      AudioSystem.playPuzzleSolved();
      setPuzzleSolved(true);
      setShowPuzzleModal(false);
      setPortalActive(true);
      setDemoStep(3);
      showNotification('Runic alignment stabilized! The Gateway Portal is now active.');
    }
  };

  const handleStepIntoPortal = () => {
    if (!portalActive) return;
    AudioSystem.playPortalTeleport();
    setDemoPhase('completed');
    navigate('/demo/complete');
  };

  // Keyboard shortcut listener for in-slice interactions [E]
  useEffect(() => {
    if (demoPhase !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'e' || e.key === 'E') {
        if (!hasFragment) {
          handleCollectFragment();
        } else if (!puzzleSolved) {
          handleOpenPuzzle();
        } else if (portalActive) {
          handleStepIntoPortal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [demoPhase, hasFragment, puzzleSolved, portalActive, puzzleDial]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#080B18',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* 1. DEMO WATERMARK & EVALUATION HUD PILL */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '20px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Logo size="sm" glow={false} showTagline={false} />
        </Link>
        <div
          style={{
            background: 'rgba(16, 24, 48, 0.85)',
            border: '1px solid rgba(0, 217, 255, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 15px rgba(0, 217, 255, 0.2)'
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00D9FF' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.05em' }}>
            BUYER DEMO SLICE
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>• Sandboxed Evaluation</span>
        </div>
      </div>

      {/* Exit Demo Button */}
      <div style={{ position: 'absolute', top: '16px', right: '20px', zIndex: 100 }}>
        <Link to="/">
          <Button variant="secondary" size="sm">
            Exit Demo
          </Button>
        </Link>
      </div>

      {/* In-Game Slice HUD Notification */}
      {notification && (
        <div
          style={{
            position: 'absolute',
            top: '75px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: 'rgba(8, 12, 26, 0.92)',
            border: '1px solid #00D9FF',
            borderRadius: '12px',
            padding: '8px 20px',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <Zap size={16} color="#00D9FF" />
          <span>{notification}</span>
        </div>
      )}

      {/* 2. DEMO PHASE: BRIEFING OVERLAY */}
      {demoPhase === 'briefing' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 200,
            backgroundColor: 'rgba(8, 11, 24, 0.94)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              background: 'rgba(17, 24, 48, 0.9)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '24px',
              padding: '36px 32px',
              textAlign: 'center',
              boxShadow: '0 0 50px rgba(0, 217, 255, 0.15)'
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <Logo size="md" glow={true} showTagline={false} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                borderRadius: '20px',
                background: 'rgba(0, 217, 255, 0.1)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                color: '#00D9FF',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginBottom: '16px'
              }}
            >
              <ShieldCheck size={14} />
              <span>COMMERCIAL EVALUATION SLICE</span>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
              Welcome, Prospective Partner
            </h2>

            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
              This controlled demo showcases the core traversal, 3D environment rendering, environmental puzzle solving, and temporal portal activation in World 1: <em>The Lost Kingdom</em>.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '28px',
                textAlign: 'left'
              }}
            >
              <div style={{ background: 'rgba(8, 12, 24, 0.8)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <p style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Step 1</p>
                <p style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 600, marginTop: '2px' }}>Explore Ruins</p>
              </div>
              <div style={{ background: 'rgba(8, 12, 24, 0.8)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <p style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Step 2</p>
                <p style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 600, marginTop: '2px' }}>Solve Rune Dial</p>
              </div>
              <div style={{ background: 'rgba(8, 12, 24, 0.8)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <p style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Step 3</p>
                <p style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 600, marginTop: '2px' }}>Activate Portal</p>
              </div>
            </div>

            <Button variant="cyan" size="lg" fullWidth icon={Play} onClick={handleStartSlice}>
              Begin Demo Slice
            </Button>
          </div>
        </div>
      )}

      {/* 3. ACTIVE 3D CANVAS SCENE */}
      <LostKingdomScene mobileInput={mobileInput} />

      {/* 4. ACTIVE DEMO SLICE INTERACTIVE HUD */}
      {demoPhase === 'playing' && (
        <>
          {/* Target Milestone Tracker */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '20px',
              zIndex: 90,
              background: 'rgba(8, 12, 26, 0.88)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '14px 18px',
              maxWidth: '340px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00D9FF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Slice Objectives
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{demoStep} of 3 Complete</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: hasFragment ? '#4ADE80' : '#FFFFFF' }}>
                <CheckCircle2 size={15} color={hasFragment ? '#4ADE80' : '#64748B'} />
                <span>1. Collect Ancient Chrono Fragment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: puzzleSolved ? '#4ADE80' : '#FFFFFF' }}>
                <CheckCircle2 size={15} color={puzzleSolved ? '#4ADE80' : '#64748B'} />
                <span>2. Align Pedestal Rune Dial [E]</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: portalActive ? '#4ADE80' : '#FFFFFF' }}>
                <CheckCircle2 size={15} color={portalActive ? '#4ADE80' : '#64748B'} />
                <span>3. Step through Activated Gateway</span>
              </div>
            </div>

            {/* Quick Action Trigger Button for instant evaluator traversal */}
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {!hasFragment ? (
                <button
                  onClick={handleCollectFragment}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 217, 255, 0.15)',
                    border: '1px solid #00D9FF',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#00D9FF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Inspect & Collect Fragment [E]
                </button>
              ) : !puzzleSolved ? (
                <button
                  onClick={handleOpenPuzzle}
                  style={{
                    width: '100%',
                    background: 'rgba(245, 185, 66, 0.15)',
                    border: '1px solid #F5B942',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#F5B942',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Align Pedestal Rune Dial [E]
                </button>
              ) : (
                <button
                  onClick={handleStepIntoPortal}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #00D9FF, #168CFF)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#080B18',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Step into Gateway Portal & Complete Demo [E]
                </button>
              )}
            </div>
          </div>

          {/* Mobile Touch Controls if on touch device */}
          {isMobile && (
            <MobileControls
              onMobileMove={(vec) => setMobileInput((prev) => ({ ...prev, x: vec.x, y: vec.y }))}
              onMobileStop={() => setMobileInput((prev) => ({ ...prev, x: 0, y: 0 }))}
              onJump={() => {
                setMobileInput((prev) => ({ ...prev, jump: true }));
                setTimeout(() => setMobileInput((prev) => ({ ...prev, jump: false })), 150);
              }}
              onSprintToggle={() => setMobileInput((prev) => ({ ...prev, sprint: !prev.sprint }))}
              isSprinting={mobileInput.sprint}
            />
          )}
        </>
      )}

      {/* 5. INTERACTIVE RUNE DIAL PUZZLE MODAL */}
      {showPuzzleModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 300,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#0D1322',
              border: '1px solid #00D9FF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 0 40px rgba(0, 217, 255, 0.3)'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Ancient Runic Dial
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '20px' }}>
              Rotate the dial until the cosmic harmonics align with the southern alignment marker (180°).
            </p>

            {/* Dial Graphic */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '3px dashed #00D9FF',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${puzzleDial}deg)`,
                transition: 'transform 0.3s ease',
                background: 'rgba(0, 217, 255, 0.05)'
              }}
            >
              <div style={{ width: '8px', height: '40px', backgroundColor: '#F5B942', borderRadius: '4px' }} />
            </div>

            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00D9FF', marginBottom: '20px' }}>
              Current Angle: {puzzleDial}° (Target: 180°)
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="secondary" size="md" fullWidth onClick={() => setShowPuzzleModal(false)}>
                Cancel
              </Button>
              <Button variant="cyan" size="md" fullWidth icon={RotateCcw} onClick={handleRotateDial}>
                Rotate Dial (+45°)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
