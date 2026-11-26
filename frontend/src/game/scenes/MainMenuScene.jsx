import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  RotateCcw,
  Globe,
  Scroll,
  Award,
  Sliders,
  Users,
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import GameSettings from '../ui/GameSettings';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';
import SaveSystem from '../systems/SaveSystem';

/**
 * Cinematic Main Game Menu
 * 3D-inspired background, official logo, and 8 fully functional menu actions.
 */
export default function MainMenuScene({ onStartGame = () => {}, onContinueGame = () => {} }) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(null); // 'worlds' | 'missions' | 'achievements' | 'settings' | 'credits'
  const [muted, setMuted] = useState(false);

  const handleNewGame = () => {
    AudioSystem.playPortalActivate();
    GameState.reset();
    onStartGame();
  };

  const handleContinue = async () => {
    AudioSystem.playInteract();
    await SaveSystem.loadProgress();
    onContinueGame();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#080B18',
        backgroundImage: 'radial-gradient(circle at center, rgba(22, 140, 255, 0.15) 0%, rgba(112, 71, 255, 0.08) 40%, #080B18 80%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Background Animated Time Ring FX */}
      <div
        className="animate-spin-slow"
        style={{
          position: 'absolute',
          width: '540px',
          height: '540px',
          borderRadius: '50%',
          border: '2px dashed rgba(0, 217, 255, 0.2)',
          boxShadow: '0 0 45px rgba(0, 217, 255, 0.15)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      <div
        className="animate-spin-reverse"
        style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          border: '1px solid rgba(112, 71, 255, 0.25)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Main Menu Box */}
      <div
        className="glass-panel-heavy"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          borderColor: 'var(--border-cyan)',
          boxShadow: 'var(--shadow-glow-cyan)'
        }}
      >
        {/* Official Brand Logo */}
        <div style={{ marginBottom: '1.75rem' }}>
          <Logo size="lg" glow={true} showTagline={true} />
        </div>

        {/* 8 Menu Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <Button
            variant="cyan"
            fullWidth
            size="md"
            icon={Play}
            onClick={handleNewGame}
            style={{ fontWeight: 800 }}
          >
            New Game
          </Button>

          <Button
            variant="primary"
            fullWidth
            size="md"
            icon={RotateCcw}
            onClick={handleContinue}
          >
            Continue Game
          </Button>

          <Button
            variant="secondary"
            fullWidth
            size="sm"
            icon={Globe}
            onClick={() => { AudioSystem.playInteract(); setModalOpen('worlds'); }}
          >
            Select World
          </Button>

          <Button
            variant="secondary"
            fullWidth
            size="sm"
            icon={Scroll}
            onClick={() => { AudioSystem.playInteract(); setModalOpen('missions'); }}
          >
            Story Missions
          </Button>

          <Button
            variant="secondary"
            fullWidth
            size="sm"
            icon={Award}
            onClick={() => { AudioSystem.playInteract(); setModalOpen('achievements'); }}
          >
            Achievements
          </Button>

          <Button
            variant="secondary"
            fullWidth
            size="sm"
            icon={Sliders}
            onClick={() => { AudioSystem.playInteract(); setModalOpen('settings'); }}
          >
            Settings
          </Button>

          <Button
            variant="ghost"
            fullWidth
            size="sm"
            icon={Users}
            onClick={() => { AudioSystem.playInteract(); setModalOpen('credits'); }}
          >
            Credits
          </Button>

          <Button
            variant="ghost"
            fullWidth
            size="sm"
            icon={ArrowLeft}
            onClick={() => { AudioSystem.playInteract(); navigate('/'); }}
          >
            Back to Website
          </Button>
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* 1. Worlds Modal */}
      <Modal
        isOpen={modalOpen === 'worlds'}
        onClose={() => setModalOpen(null)}
        title="Timeline World Matrix"
        maxWidth="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ padding: '0.85rem', background: 'rgba(22, 140, 255, 0.15)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>World 1: The Lost Kingdom</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-cyan)' }}>Current Playable World &bull; Past Era</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0.4rem 0 0 0' }}>
              Ancient castle ruins, stone pathways, energy fragments, and the first time portal.
            </p>
          </div>

          <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', opacity: 0.65 }}>
            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>World 2: The Broken Present</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>Locked &bull; Present Era</div>
          </div>

          <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', opacity: 0.65 }}>
            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>World 3: The Future Collapse</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>Locked &bull; Future Era</div>
          </div>

          <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', opacity: 0.65 }}>
            <div style={{ fontWeight: 700, color: '#FFFFFF' }}>World 4: The Forgotten Timeline</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)' }}>Locked &bull; Zero Horizon</div>
          </div>
        </div>
      </Modal>

      {/* 2. Missions Modal */}
      <Modal
        isOpen={modalOpen === 'missions'}
        onClose={() => setModalOpen(null)}
        title="Story Missions (10 Objectives)"
        maxWidth="520px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            '1. Arrive at the Lost Kingdom Castle Courtyard',
            '2. Master Character Locomotion, Sprint, and Jump',
            '3. Discover the Ancient Pedestal & Altar',
            '4. Claim the Chrono Keystone Artifact',
            '5. Search the Ruins for 3 Temporal Energy Fragments',
            '6. Uncover Hidden Ruins along Eastern and Western Colonnades',
            '7. Channel Energy Fragments into the Ancient Stone Gate',
            '8. Solve the Chrono Alignment Dial Mechanism',
            '9. Activate the Central Time Portal Dais',
            '10. Leap Through the Active Portal to Restore the Continuum'
          ].map((m, i) => (
            <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem', color: i < 5 ? '#FFFFFF' : 'var(--color-text-muted)' }}>
              {m}
            </div>
          ))}
        </div>
      </Modal>

      {/* 3. Achievements Modal */}
      <Modal
        isOpen={modalOpen === 'achievements'}
        onClose={() => setModalOpen(null)}
        title="Temporal Achievements"
        maxWidth="480px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(245, 185, 66, 0.1)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#F5B942" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>First Steps Through Time</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Claim the Chrono Keystone artifact. (+100 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(0, 217, 255, 0.1)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#00D9FF" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Fragment Collector</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Collect all 3 temporal fragments in World 1. (+250 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(112, 71, 255, 0.1)', border: '1px solid var(--border-purple)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#C084FC" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Gateway Master</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Align dials and activate the World 1 Time Portal. (+500 XP)</div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 4. Settings Modal */}
      <Modal
        isOpen={modalOpen === 'settings'}
        onClose={() => setModalOpen(null)}
        title="Settings"
        maxWidth="440px"
      >
        <GameSettings onClose={() => setModalOpen(null)} />
      </Modal>

      {/* 5. Credits Modal */}
      <Modal
        isOpen={modalOpen === 'credits'}
        onClose={() => setModalOpen(null)}
        title="Credits & Studio"
        maxWidth="460px"
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <Logo size="sm" glow={false} showTagline={true} />
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginTop: '1rem' }}>AERVYN Development Studio</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.5rem 0 1.5rem 0' }}>
            Original Commercial 3D Adventure Game Product
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <div>Engineered with Three.js, React Three Fiber & Laravel 12</div>
            <div>Original Game Design & Temporal Mechanics</div>
            <div>&copy; {new Date().getFullYear()} AERVYN. All rights reserved.</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
