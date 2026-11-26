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
  Sparkles,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import GameSettings from '../ui/GameSettings';
import StoryJournalModal from '../ui/StoryJournalModal';
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
  const [showJournal, setShowJournal] = useState(false);
  const [missionWorldTab, setMissionWorldTab] = useState('world_1');
  const [muted, setMuted] = useState(false);

  const handleSelectWorld = (worldId) => {
    AudioSystem.playPortalActivate();
    GameState.setWorld(worldId);
    setModalOpen(null);
    onStartGame();
  };

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
            variant="gold"
            fullWidth
            size="sm"
            icon={BookOpen}
            onClick={() => { AudioSystem.playInteract(); setShowJournal(true); }}
          >
            Story Journal
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
        maxWidth="520px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          {/* World 1 Card */}
          <div
            style={{
              padding: '1rem',
              background: 'rgba(22, 140, 255, 0.12)',
              border: '1px solid var(--border-cyan)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>World 1: The Lost Kingdom</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-cyan)', fontWeight: 700 }}>PAST ERA</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Ancient castle courtyard, stone pathways, 3 energy fragments, alignment puzzle, and time portal dais.
            </p>
            <div style={{ marginTop: '0.4rem' }}>
              <Button
                variant="cyan"
                size="sm"
                fullWidth
                icon={Play}
                onClick={() => handleSelectWorld('world_1')}
              >
                Launch World 1 (Past)
              </Button>
            </div>
          </div>

          {/* World 2 Card */}
          <div
            style={{
              padding: '1rem',
              background: 'rgba(112, 71, 255, 0.14)',
              border: '1px solid var(--border-purple)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>World 2: The Broken Present</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-purple)', fontWeight: 700 }}>PRESENT ERA (2026)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Destroyed futuristic city, cracked highways, 3 Quantum Cores, underground research lab, and the Central Time Core.
            </p>
            <div style={{ marginTop: '0.4rem' }}>
              <Button
                variant="purple"
                size="sm"
                fullWidth
                icon={Play}
                onClick={() => handleSelectWorld('world_2')}
              >
                Launch World 2 (Present)
              </Button>
            </div>
          </div>

          {/* World 3 Card */}
          <div
            style={{
              padding: '1rem',
              background: 'rgba(245, 185, 66, 0.14)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>World 3: The Fractured Future</div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-gold)', fontWeight: 700 }}>FUTURE ERA (3140)</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Floating islands over the void, broken sky bridges, 3 Chrono Shards, Time Labyrinth, and The Chronarch boss encounter.
            </p>
            <div style={{ marginTop: '0.4rem' }}>
              <Button
                variant="gold"
                size="sm"
                fullWidth
                icon={Play}
                onClick={() => handleSelectWorld('world_3')}
              >
                Launch World 3 (Future)
              </Button>
            </div>
          </div>

          {/* World 4 Card (The Last Timeline) */}
          <div
            style={{
              padding: '1rem',
              background: 'rgba(56, 189, 248, 0.14)',
              border: '1px solid var(--border-cyan)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFFFFF' }}>World 4: The Last Timeline</div>
              <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>THE ZERO HORIZON</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Celestial singularity nexus outside time. Solve the Continuum Synchronization Matrix, commune with the Primordial Core, and choose the destiny of reality.
            </p>
            <div style={{ marginTop: '0.4rem' }}>
              <Button
                variant="cyan"
                size="sm"
                fullWidth
                icon={Play}
                onClick={() => handleSelectWorld('world_final')}
              >
                Launch World 4 (Zero Horizon)
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* 2. Missions Modal */}
      <Modal
        isOpen={modalOpen === 'missions'}
        onClose={() => setModalOpen(null)}
        title="Story Missions Matrix"
        maxWidth="540px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* World Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <button
              onClick={() => setMissionWorldTab('world_1')}
              style={{
                flex: 1,
                padding: '0.45rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                border: missionWorldTab === 'world_1' ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
                background: missionWorldTab === 'world_1' ? 'rgba(0, 217, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: missionWorldTab === 'world_1' ? '#FFFFFF' : 'var(--color-text-dim)',
                cursor: 'pointer'
              }}
            >
              World 1: Past (10)
            </button>
            <button
              onClick={() => setMissionWorldTab('world_2')}
              style={{
                flex: 1,
                padding: '0.45rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                border: missionWorldTab === 'world_2' ? '1px solid var(--border-purple)' : '1px solid var(--border-subtle)',
                background: missionWorldTab === 'world_2' ? 'rgba(112, 71, 255, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: missionWorldTab === 'world_2' ? '#FFFFFF' : 'var(--color-text-dim)',
                cursor: 'pointer'
              }}
            >
              World 2: Present (7)
            </button>
            <button
              onClick={() => setMissionWorldTab('world_3')}
              style={{
                flex: 1,
                padding: '0.45rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                border: missionWorldTab === 'world_3' ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                background: missionWorldTab === 'world_3' ? 'rgba(245, 185, 66, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: missionWorldTab === 'world_3' ? '#FFFFFF' : 'var(--color-text-dim)',
                cursor: 'pointer'
              }}
            >
              World 3: Future (7)
            </button>
            <button
              onClick={() => setMissionWorldTab('world_final')}
              style={{
                flex: 1,
                padding: '0.45rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-xs)',
                border: missionWorldTab === 'world_final' ? '1px solid #38BDF8' : '1px solid var(--border-subtle)',
                background: missionWorldTab === 'world_final' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: missionWorldTab === 'world_final' ? '#FFFFFF' : 'var(--color-text-dim)',
                cursor: 'pointer'
              }}
            >
              World 4: Final (4)
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
            {missionWorldTab === 'world_1' ? (
              [
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
                <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem', color: '#FFFFFF' }}>
                  {m}
                </div>
              ))
            ) : missionWorldTab === 'world_2' ? (
              [
                '1. Infiltrate Destroyed Cyber Metropolis & Boot City Terminal',
                '2. Calibrate the Highway Comm Relay Dish on the Shattered Overpass',
                '3. Reclaim 3 Scattered Quantum Energy Cores (Alpha, Beta, Gamma)',
                '4. Unlock the Sub-Level Research Facility Armored Bulkhead',
                '5. Align 3 Holographic Phase Prisms to Zero-Point Resonance',
                '6. Stabilize and Overcharge the Central Time Core Reactor',
                '7. Step Into the Stabilized Timeline Gateway to Mend Present Day'
              ].map((m, i) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'rgba(112, 71, 255, 0.08)', borderLeft: '3px solid var(--color-purple)', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem', color: '#FFFFFF' }}>
                  {m}
                </div>
              ))
            ) : missionWorldTab === 'world_3' ? (
              [
                '1. Arrival at the End of Time — Calibrate the Chrono Beacon',
                '2. The Fallen Sky City — Activate the solid-light Phase Bridge',
                '3. The Three Chrono Shards — Reclaim Genesis, Flux, and Singularity Shards',
                '4. The Time Labyrinth — Synchronize the 3 temporal resonator switches',
                '5. The Chronarch\'s Secret — Access archive terminal & uncover Chronarch lore',
                '6. The Final Confrontation — Defeat THE CHRONARCH in the Timeline Engine Arena',
                '7. The Fractured Future — Restore the Master Timeline Engine & save the universe'
              ].map((m, i) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'rgba(245, 185, 66, 0.08)', borderLeft: '3px solid var(--color-gold)', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem', color: '#FFFFFF' }}>
                  {m}
                </div>
              ))
            ) : (
              [
                '1. The Zero Horizon — Cross the celestial bridge toward the Primordial Core',
                '2. Continuum Synchronization — Harmonize the 3 Epoch Keystones (Antiquity, Quantum, Singularity)',
                '3. The Nexus Decision — Commune with the Primordial Core and determine the fate of reality',
                '4. Epilogue — Witness the destiny of Aervyn (The Eternal Guardian vs The Architect of Tomorrow)'
              ].map((m, i) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', background: 'rgba(56, 189, 248, 0.08)', borderLeft: '3px solid #38BDF8', borderRadius: 'var(--radius-xs)', fontSize: '0.82rem', color: '#FFFFFF' }}>
                  {m}
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* 3. Achievements Modal */}
      <Modal
        isOpen={modalOpen === 'achievements'}
        onClose={() => setModalOpen(null)}
        title="Temporal Achievements"
        maxWidth="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto' }}>
          {/* World 1 Achievements */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(245, 185, 66, 0.1)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#F5B942" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>First Steps Through Time</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Claim the Chrono Keystone artifact in World 1. (+100 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(0, 217, 255, 0.1)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#00D9FF" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Fragment Collector</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Collect all 3 temporal fragments in World 1. (+250 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(22, 140, 255, 0.1)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#168CFF" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Gateway Master</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Align dials and activate the World 1 Time Portal. (+500 XP)</div>
            </div>
          </div>

          {/* World 2 Achievements */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(112, 71, 255, 0.12)', border: '1px solid var(--border-purple)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#C084FC" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Cyber Overpass Explorer</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Boot terminal and calibrate highway comm dish. (+150 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(192, 132, 252, 0.12)', border: '1px solid var(--border-purple)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#C084FC" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Quantum Reclaimer</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Secure all 3 Quantum Cores avoiding drone fire. (+300 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(245, 185, 66, 0.12)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#F5B942" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Temporal Stabilizer</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Repair the Central Time Core & save the Present. (+750 XP)</div>
            </div>
          </div>

          {/* World 3 Achievements */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(0, 217, 255, 0.12)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#00D9FF" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Sky City Ascendant</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Calibrate Chrono Beacon & cross solid-light Phase Bridge. (+200 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(245, 185, 66, 0.12)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#F5B942" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Chrono Shard Master</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Recover Genesis, Flux, and Singularity Chrono Shards. (+350 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(112, 71, 255, 0.12)', border: '1px solid var(--border-purple)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#C084FC" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Labyrinth Synchronizer</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Align all three resonator switches in the Time Labyrinth. (+400 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(239, 68, 68, 0.14)', border: '1px solid #EF4444', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#EF4444" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Vanquisher of the Chronarch</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Defeat the Chronarch & restore the Master Timeline Engine. (+1000 XP)</div>
            </div>
          </div>

          {/* World 4 Achievements */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38BDF8', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#38BDF8" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>Continuum Master</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Harmonize all 3 Epoch Keystones in the Synchronization Matrix. (+500 XP)</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem', background: 'rgba(245, 185, 66, 0.12)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)' }}>
            <Award size={24} color="#F5B942" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFFFFF' }}>The Eternal Guardian / Architect</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Complete the Grand Story Campaign & determine reality’s fate. (+1500 XP)</div>
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

      {/* Story Journal Modal */}
      <StoryJournalModal
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
      />
    </div>
  );
}
