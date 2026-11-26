import React, { useState, useEffect } from 'react';
import { BookOpen, Shield, Globe, Award, Lock, CheckCircle2, X, Search, Sparkles } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Badge from '../../components/common/Badge';
import GameState from '../engine/GameState';
import AudioSystem from '../systems/AudioSystem';

const JOURNAL_DATABASE = {
  lore: {
    name: 'Lore Archives',
    icon: BookOpen,
    color: '#F5B942',
    entries: [
      {
        id: 'prologue_origin',
        title: 'The Genesis of Chrono Energy',
        epoch: 'Antiquity',
        excerpt: 'Ancient texts describe raw temporal currents flowing beneath reality, discovered by the first civilization of Aervyn.',
        details: 'Centuries ago, the scholars of the First Realm uncovered an eternal fountain of Chrono Energy. They built monoliths and dials to harvest its power, believing it could grant endless prosperity. But manipulating the continuum without balance fractured the timeline into three divergent eras.',
        unlockedDefault: true
      },
      {
        id: 'lore_ancient_kingdom',
        title: 'The Fall of the Lost Kingdom',
        epoch: 'Timeline I',
        excerpt: 'How the grand citadel of antiquity was sealed within a temporal bubble.',
        details: 'When the ancient keystone began to destabilize, the elders sacrificed their kingdom to preserve the continuum, sealing their gates with runic puzzle mechanisms until an attuned bearer would awaken the core.',
        unlockedDefault: true
      },
      {
        id: 'lore_broken_metropolis',
        title: 'The Cataclysm of the Present',
        epoch: 'Timeline II',
        excerpt: 'The catastrophic rupture of the central Time Core in the modern industrial age.',
        details: 'In Timeline II, modern scientists attempted to harness the Chrono rift with quantum reactors. The resulting overload shattered urban skyscrapers, freezing moments in mid-air and spreading lethal temporal anomalies across the metropolis.',
        unlockedDefault: false
      },
      {
        id: 'lore_chronarch',
        title: 'The Chronarch’s Tragic Fall',
        epoch: 'Timeline III',
        excerpt: 'Once the supreme guardian of the future, driven to freeze time forever out of fear of collapse.',
        details: 'Witnessing the heat death and cosmic fractures of the future, the entity known as THE CHRONARCH chose absolute stasis over entropy. In doing so, it imprisoned eternity within a labyrinth of floating spires.',
        unlockedDefault: false
      },
      {
        id: 'lore_primordial_core',
        title: 'The Primordial Chrono Core',
        epoch: 'Zero Horizon',
        excerpt: 'The singularity at the Zero Horizon capable of restructuring reality itself.',
        details: 'Located outside normal spacetime, the Primordial Core is the heartbeat of all three timelines. Synchronizing the Antiquity, Quantum, and Singularity keystones unlocks the sovereign authority to determine the fate of existence.',
        unlockedDefault: false
      }
    ]
  },
  artifacts: {
    name: 'Timeline Artifacts',
    icon: Sparkles,
    color: '#00D9FF',
    entries: [
      {
        id: 'artifact_keystone',
        title: 'Chrono Keystone of Antiquity',
        epoch: 'Timeline I',
        excerpt: 'The primordial stone key capable of channeling temporal frequencies.',
        details: 'Forged from concentrated crystalline time ore, this ancient talisman allows its wielder to unlock runic seals and channel dormant portals.',
        unlockedDefault: true
      },
      {
        id: 'artifact_energy_fragments',
        title: 'Temporal Energy Fragments',
        epoch: 'Timeline I',
        excerpt: 'Resonant shards scattered across the ancient castle ruins.',
        details: 'When gathered in trios, their harmonic frequency can unlock the massive stone door of the inner chamber.',
        unlockedDefault: true
      },
      {
        id: 'artifact_quantum_cores',
        title: 'Quantum Energy Cores',
        epoch: 'Timeline II',
        excerpt: 'High-density zero-point cells designed to fuel the central Time Core.',
        details: 'Three stabilized isotopic cells recovered from the subway station, ruined lab, and highway bridge.',
        unlockedDefault: false
      },
      {
        id: 'artifact_chrono_shards',
        title: 'Chrono Shards of the End of Time',
        epoch: 'Timeline III',
        excerpt: 'Hyper-resonant crystals recovered from the floating sky islands.',
        details: 'The Genesis Shard, Flux Shard, and Singularity Shard, required to breach the Chronarch’s Research Spire.',
        unlockedDefault: false
      },
      {
        id: 'artifact_antiquity_keystone',
        title: 'Epoch Keystone: Antiquity',
        epoch: 'Zero Horizon',
        excerpt: 'Receptor anchoring the past timeline to the Continuum Matrix.',
        details: 'Aligned in the Zero Horizon, it hums with the warmth of ancient suns and stone ruins.',
        unlockedDefault: false
      },
      {
        id: 'artifact_quantum_flux',
        title: 'Epoch Keystone: Quantum Flux',
        epoch: 'Zero Horizon',
        excerpt: 'Receptor anchoring the present timeline to the Continuum Matrix.',
        details: 'Aligned in the Zero Horizon, it pulses with cybernetic cyan radiance and electronic harmonics.',
        unlockedDefault: false
      },
      {
        id: 'artifact_singularity_shard',
        title: 'Epoch Keystone: Singularity',
        epoch: 'Zero Horizon',
        excerpt: 'Receptor anchoring the future timeline to the Continuum Matrix.',
        details: 'Aligned in the Zero Horizon, it glows with deep astral violet cosmic starlight.',
        unlockedDefault: false
      }
    ]
  },
  characters: {
    name: 'Characters & Factions',
    icon: Shield,
    color: '#C084FC',
    entries: [
      {
        id: 'char_traveler',
        title: 'The Time Traveler',
        epoch: 'Protagonist',
        excerpt: 'The chosen wanderer gifted with the Aegis resonance.',
        details: 'Guided by the ancient echoes of Aervyn, you alone possess the physical ability to shift between timelines without experiencing cellular temporal decay.',
        unlockedDefault: true
      },
      {
        id: 'char_archivist',
        title: 'The Archivist of Antiquity',
        epoch: 'Timeline I',
        excerpt: 'The silent spirit preserving the history of the lost citadel.',
        details: 'Inscribed messages and guidance left behind across the courtyard pedestals to aid future seekers.',
        unlockedDefault: true
      },
      {
        id: 'char_engineers',
        title: 'Nova Prime Automated Sentinels',
        epoch: 'Timeline II',
        excerpt: 'Automated patrol drones still guarding the broken city.',
        details: 'Programmed during the evacuation, these defensive constructs remain stuck in a continuous loop.',
        unlockedDefault: false
      },
      {
        id: 'char_chronarch',
        title: 'The Chronarch, Architect of Stasis',
        epoch: 'Timeline III',
        excerpt: 'The cosmic entity wielding the Timeline Engine.',
        details: 'Formed from the collective will of a doomed future civilization, the Chronarch sought to freeze time so that no being would ever suffer loss again.',
        unlockedDefault: false
      }
    ]
  },
  history: {
    name: 'World History',
    icon: Globe,
    color: '#10B981',
    entries: [
      {
        id: 'history_world_1',
        title: 'Timeline I: The Lost Kingdom',
        epoch: 'Past Era',
        excerpt: 'A timeless medieval realm suspended in eternal dusk.',
        details: 'The origin point of the temporal fracture. Where the ancient stone gate, courtyard pedestal, and first time portal reside.',
        unlockedDefault: true
      },
      {
        id: 'history_world_2',
        title: 'Timeline II: The Broken Present',
        epoch: 'Present Era',
        excerpt: 'A collapsed cyberpunk metropolis trapped between moments.',
        details: 'Where futuristic technology clashed with uncontained temporal energy, resulting in the shattering of the Central Time Core.',
        unlockedDefault: false
      },
      {
        id: 'history_world_3',
        title: 'Timeline III: The Fractured Future',
        epoch: 'Future Era',
        excerpt: 'Floating crystalline islands orbiting a dying cosmic vortex.',
        details: 'The edge of entropy. Home to the Research Spire, the Temporal Labyrinth, and the Chronarch’s domain.',
        unlockedDefault: false
      },
      {
        id: 'history_world_final',
        title: 'Timeline IV: The Zero Horizon',
        epoch: 'Timeless Realm',
        excerpt: 'The singularity nexus outside the flow of entropy.',
        details: 'The sanctuary where all three eras reflect into the Continuum Synchronization Matrix and the Primordial Core.',
        unlockedDefault: false
      },
      {
        id: 'destiny_ending_a',
        title: 'Destiny: The Eternal Guardian (Ending A)',
        epoch: 'Restored Continuum',
        excerpt: 'Reality returned to its natural linear progression.',
        details: 'By choosing to Restore the Timeline, you severed the temporal paradoxes. Each world heals on its own natural timeline, and you remain the timeless watcher protecting the continuum.',
        unlockedDefault: false
      },
      {
        id: 'destiny_ending_b',
        title: 'Destiny: The Architect of Tomorrow (Ending B)',
        epoch: 'Unified Reality',
        excerpt: 'A new transcendent era forged from the union of all three worlds.',
        details: 'By synthesizing past magic, present cybernetics, and future science, you created an uncharted reality where humanity evolves free from linear decay.',
        unlockedDefault: false
      }
    ]
  }
};

export default function StoryJournalModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('lore');
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const syncState = () => {
      const state = GameState.getState();
      const journal = state.storyJournal || [];
      const worldId = state.worldId;

      // Automatically unlock world progress entries
      const autoUnlocked = [...journal];
      if (worldId === 'world_2' || worldId === 'world_3' || worldId === 'world_final') {
        autoUnlocked.push('lore_broken_metropolis', 'history_world_2', 'artifact_quantum_cores', 'char_engineers');
      }
      if (worldId === 'world_3' || worldId === 'world_final') {
        autoUnlocked.push('lore_chronarch', 'history_world_3', 'artifact_chrono_shards', 'char_chronarch');
      }
      if (worldId === 'world_final') {
        autoUnlocked.push('lore_primordial_core', 'history_world_final');
      }
      if (state.endingSelected) {
        autoUnlocked.push(`destiny_${state.endingSelected}`);
      }

      setUnlockedIds(Array.from(new Set(autoUnlocked)));
    };

    syncState();
    const unsub = GameState.subscribe(syncState);
    return unsub;
  }, [isOpen]);

  // Handle [J] / [ESC] keys
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'j' || e.key === 'J') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCategory = JOURNAL_DATABASE[activeTab];
  const allEntries = currentCategory.entries;

  const filteredEntries = allEntries.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.epoch.toLowerCase().includes(query) ||
      entry.excerpt.toLowerCase().includes(query)
    );
  });

  const totalClues = Object.values(JOURNAL_DATABASE).reduce(
    (acc, cat) => acc + cat.entries.length,
    0
  );
  const totalUnlocked = Object.values(JOURNAL_DATABASE).reduce(
    (acc, cat) =>
      acc +
      cat.entries.filter(
        (e) => e.unlockedDefault || unlockedIds.includes(e.id)
      ).length,
    0
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(5, 7, 16, 0.92)',
        backdropFilter: 'blur(16px)',
        zIndex: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      <div
        className="glass-panel-heavy cyber-border"
        style={{
          width: 'min(94vw, 980px)',
          height: 'min(90vh, 720px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(10, 13, 26, 0.96)',
          borderColor: currentCategory.color,
          borderRadius: 'var(--radius-md)',
          boxShadow: `0 0 40px rgba(0, 0, 0, 0.8), 0 0 20px ${currentCategory.color}22`,
          overflow: 'hidden'
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Logo size="sm" glow={false} showTagline={false} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                  CHRONO CODEX & STORY JOURNAL
                </h2>
                <Badge variant="gold" size="sm">
                  {totalUnlocked} / {totalClues} Discovered
                </Badge>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Chronicles of the Continuum, Artifacts of Power, and the History of Aervyn [J]
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              AudioSystem.playInteract();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Categories Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1.75rem',
            background: 'rgba(0, 0, 0, 0.25)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {Object.entries(JOURNAL_DATABASE).map(([tabKey, category]) => {
            const Icon = category.icon;
            const isActive = activeTab === tabKey;
            const catUnlocked = category.entries.filter(
              (e) => e.unlockedDefault || unlockedIds.includes(e.id)
            ).length;

            return (
              <button
                key={tabKey}
                onClick={() => {
                  AudioSystem.playInteract();
                  setActiveTab(tabKey);
                  setSelectedEntry(null);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isActive ? `1px solid ${category.color}` : '1px solid transparent',
                  background: isActive ? `${category.color}15` : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={isActive ? category.color : 'currentColor'} />
                <span>{category.name}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: isActive ? category.color : 'var(--color-text-muted)',
                    marginLeft: '4px'
                  }}
                >
                  ({catUnlocked}/{category.entries.length})
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area: Split View (List + Details) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', flex: 1, minHeight: 0 }}>
          {/* Entries List Column */}
          <div
            style={{
              borderRight: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '0.5rem'
              }}
            >
              <Search size={14} color="var(--color-text-muted)" />
              <input
                type="text"
                placeholder="Filter chronicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>

            {/* Entry Items */}
            {filteredEntries.map((entry) => {
              const isUnlocked = entry.unlockedDefault || unlockedIds.includes(entry.id);
              const isSelected = selectedEntry?.id === entry.id;

              return (
                <div
                  key={entry.id}
                  onClick={() => {
                    if (isUnlocked) {
                      AudioSystem.playInteract();
                      setSelectedEntry(entry);
                    }
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected
                      ? `1px solid ${currentCategory.color}`
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    background: isSelected
                      ? `${currentCategory.color}15`
                      : isUnlocked
                      ? 'rgba(255, 255, 255, 0.02)'
                      : 'rgba(0, 0, 0, 0.25)',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    opacity: isUnlocked ? 1 : 0.45
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.72rem', color: isUnlocked ? currentCategory.color : 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      {entry.epoch}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 size={13} color="#10B981" />
                    ) : (
                      <Lock size={13} color="var(--color-text-muted)" />
                    )}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isUnlocked ? '#FFFFFF' : 'var(--color-text-muted)' }}>
                    {isUnlocked ? entry.title : 'Encrypted Temporal Entry'}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {isUnlocked ? entry.excerpt : 'Explore the timelines or solve ancient puzzles to decipher this record.'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details Pane Column */}
          <div
            style={{
              padding: '1.75rem',
              overflowY: 'auto',
              background: 'rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {selectedEntry ? (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Badge variant="cyan" size="sm">
                    {selectedEntry.epoch}
                  </Badge>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    ARCHIVE RECORD // #{selectedEntry.id.toUpperCase()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', letterSpacing: '0.02em' }}>
                  {selectedEntry.title}
                </h3>

                <div
                  style={{
                    padding: '0.85rem 1rem',
                    background: `${currentCategory.color}10`,
                    borderLeft: `3px solid ${currentCategory.color}`,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    color: '#E2E8F0',
                    lineHeight: 1.5,
                    marginBottom: '1.5rem',
                    fontStyle: 'italic'
                  }}
                >
                  "{selectedEntry.excerpt}"
                </div>

                <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Deciphered Inscription
                </h4>

                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {selectedEntry.details}
                </p>
              </div>
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  padding: '2rem'
                }}
              >
                <BookOpen size={42} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  Select an Unlocked Chronicle
                </div>
                <div style={{ fontSize: '0.8rem', maxWidth: '320px', marginTop: '0.5rem' }}>
                  Choose any entry from the archive list on the left to review discovered lore, artifacts, and timeline history.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
