import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Layers,
  Sparkles,
  ShieldCheck,
  Cpu,
  Mail,
  Gamepad2,
  Award,
  Globe,
  Sliders,
  Package,
  CheckCircle,
  FileText
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useBranding } from '../../context/BrandingContext';
import { useAudio } from '../../context/AudioContext';

/**
 * Interactive Buyer Presentation Mode (/presentation)
 * Guided, sequential B2B slide deck designed for publisher demos, investor presentations,
 * and executive reviews.
 */
export default function BuyerPresentationPage() {
  const navigate = useNavigate();
  const { branding } = useBranding();
  const { playClick, playPortal } = useAudio();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'intro',
      title: 'AERVYN: ECHOES OF TIME',
      badge: 'B2B COMMERCIAL PRESENTATION',
      subtitle: 'Commercial 3D Action-Adventure Web Game',
      content: (
        <div>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            A turnkey, standalone single-player game combining immersive 3D world exploration, environmental deduction, and temporal mechanics. Built directly for the open web with modern standards.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-cyan)' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Source Code Ownership</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-gold)' }}>0</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Runtime Seat Royalties</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-purple)' }}>4</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Fractured Timelines</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'story',
      title: 'The Narrative Premise',
      badge: 'STORY & LORE',
      subtitle: 'The Splintering of the Spacetime Continuum',
      content: (
        <div>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            Deep within the forgotten ruins of an ancient sanctuary, an explorer discovers the dormant <em>Temporal Keystone</em>. Upon its alignment, a cataclysmic temporal tremor splinters reality into distinct eras.
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
            To avert the permanent dissolution of the timeline, the operative must step through quantum portals, decipher ancient rune dials, rewire metropolitan junction grids, survive cybernetic laser barriers, and confront the Chronarch at the event horizon.
          </p>
        </div>
      )
    },
    {
      id: 'world-1',
      title: 'World 1: The Lost Kingdom',
      badge: 'ERA: PAST (YEAR -840)',
      subtitle: 'Ancient Stonework, Mystical Overgrowth, and Keystone Lore',
      content: (
        <div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            <li><strong>Atmosphere:</strong> Romanesque archways, moss-covered stone pillars, and sun-dappled courtyard pathways.</li>
            <li><strong>Traversal Mechanics:</strong> Jumping across ruined balustrades, sprint acceleration, and fluid orbital camera look.</li>
            <li><strong>Key Puzzle:</strong> Runic pedestal dial mechanism — align runic symbols to 180° to channel chrono energy.</li>
            <li><strong>Objective:</strong> Retrieve the initial Chrono Keystone fragment and ignite the first dimensional gateway portal.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'world-2',
      title: 'World 2: The Broken Present',
      badge: 'ERA: PRESENT (YEAR 2026)',
      subtitle: 'Urban Ruin, Electrified Hazards, and Infrastructure Repair',
      content: (
        <div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            <li><strong>Atmosphere:</strong> Decaying urban towers, cracked asphalt, flickering neon signage, and temporal tremors.</li>
            <li><strong>Environmental Hazards:</strong> Electrified water puddles, exposed conduit arcs, and collapsed transit tunnels.</li>
            <li><strong>Key Puzzle:</strong> Multi-circuit fuse box rewire — redirect high-voltage quantum power to unseal subway blast doors.</li>
            <li><strong>Objective:</strong> Harvest 3 Quantum Cores and stabilize the central temporal harmonic frequency.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'world-3',
      title: 'World 3: The Fractured Future',
      badge: 'ERA: FUTURE (YEAR 2480)',
      subtitle: 'Cybernetic Sky Citadels, Laser Defense Grids, and Drones',
      content: (
        <div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
            <li><strong>Atmosphere:</strong> Cybernetic platforms floating in deep space, holographic interfaces, and deep synthetic sub-bass.</li>
            <li><strong>Tactical Obstacles:</strong> Patrolling security drones, pulsing laser tripwires, and gravitational phase bridges.</li>
            <li><strong>Key Puzzle:</strong> Laser frequency resonator alignment — synchronize light beam wavelengths to disable forcefields.</li>
            <li><strong>Objective:</strong> Breach the core timeline engine and open the passage to the final convergence horizon.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'world-4',
      title: 'Final Chapter: The Last Timeline',
      badge: 'ERA: CONVERGENCE (ZERO HORIZON)',
      subtitle: 'The Chronarch Boss Battle & Dual Narrative Endings',
      content: (
        <div>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            A celestial sanctuary suspended at the nexus of all realities. The player faces <strong>The Chronarch</strong> in a multi-phase boss encounter with dynamic attack telegraphs and temporal shielding.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem', borderLeft: '3px solid var(--color-cyan)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-cyan)', fontSize: '0.95rem' }}>ENDING A: THE WEAVER</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.35rem 0 0 0' }}>
                Unify history into one restored, immutable continuum. Order is saved, but free divergence is lost.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '1rem', borderLeft: '3px solid var(--color-gold)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-gold)', fontSize: '0.95rem' }}>ENDING B: THE FRACTURE</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.35rem 0 0 0' }}>
                Shatter the Chrono Keystone to birth an infinite multiverse where all choices co-exist simultaneously.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'gameplay',
      title: 'Playable 3D Systems & Locomotion',
      badge: 'GAMEPLAY ENGINE',
      subtitle: 'Fluid Third-Person Physics & Collision Detection',
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h4 style={{ color: '#FFFFFF', margin: '0 0 0.35rem 0' }}>Third-Person Locomotion</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Smooth acceleration, sprint physics, jumping arc, and ground raycast collision detection.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h4 style={{ color: '#FFFFFF', margin: '0 0 0.35rem 0' }}>Dynamic Camera Orbit</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Smooth mouse look and touch swipe orbit camera with vertical pitch constraints and obstacle collision damping.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h4 style={{ color: '#FFFFFF', margin: '0 0 0.35rem 0' }}>Procedural Audio Engine</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Native Web Audio API procedural synthesis for ambient drones, footsteps, puzzle clicks, and portal resonance.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h4 style={{ color: '#FFFFFF', margin: '0 0 0.35rem 0' }}>Cloud State Persistence</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Automatic checkpoint saves to MySQL via Sanctum. Players can close their browser and resume seamlessly.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'admin',
      title: '23-Module Admin Operations Suite',
      badge: 'BACK-OFFICE CONTROL',
      subtitle: 'Complete Studio Telemetry, Content CMS & Lead Management',
      content: (
        <div>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            A comprehensive administration dashboard that gives publishers full command over players, world content, missions, analytics, buyer leads, and branding.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {['Dashboard KPIs', 'Player Accounts', 'Social Moderation', 'World Editor', 'Mission Objectives', 'Collectibles Catalog', 'Analytics Charts', 'Lead Management CRM', 'Product CMS', 'White-Label Branding', 'Media Library', 'Audit Activity Logs'].map((item, idx) => (
              <div key={idx} style={{ padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.85rem', color: '#FFFFFF' }}>
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'player',
      title: 'Player Gaming Portal & Community',
      badge: 'GAMIFICATION LAYER',
      subtitle: 'Levels, XP, Achievements, Friends & Challenges',
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h4 style={{ color: 'var(--color-cyan)', margin: '0 0 0.35rem 0' }}>Player Dashboard</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Level progression, XP progress bar, active worlds, inventory items, and unlocked lore journal entries.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h4 style={{ color: 'var(--color-gold)', margin: '0 0 0.35rem 0' }}>Achievements Engine</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                10+ persistent achievements with tier badges, completion timestamps, and anti-cheat claim validation.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h4 style={{ color: 'var(--color-purple)', margin: '0 0 0.35rem 0' }}>Online Social Hub</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Player search, mutual friend requests, asynchronous time-trial challenge duels, and granular privacy controls.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tech',
      title: 'Turnkey Technology Architecture',
      badge: 'SYSTEM ARCHITECTURE',
      subtitle: 'Modern Web Standards with Zero Proprietary Lock-In',
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', textTransform: 'uppercase' }}>Frontend Framework</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>React 19 + Vite 8</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>Lightning-fast ESM bundling, responsive layouts, GSAP transitions.</p>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase' }}>3D Graphics Runtime</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>Three.js + R3F + Drei</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>Hardware-accelerated WebGL 2.0 with dynamic graphics tier scaling.</p>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-purple)', textTransform: 'uppercase' }}>Backend API Engine</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>Laravel 12 + Sanctum</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>High-performance PHP 8.2+ REST API with token authorization & rate limiting.</p>
            </div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#10B981', textTransform: 'uppercase' }}>Data Storage</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.2rem' }}>MySQL 8.0+ Database</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>14 normalized InnoDB tables, indexes, and automated migrations.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'customization',
      title: 'Customization Matrix & Scope',
      badge: 'COMMERCIAL FLEXIBILITY',
      subtitle: 'Supported Now vs. Future Custom Development',
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid #10B981' }}>
              <div style={{ fontWeight: 700, color: '#10B981', marginBottom: '0.5rem', fontSize: '0.95rem' }}>SUPPORTED OUT-OF-THE-BOX</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <li>✓ Custom product name & marketing tagline</li>
                <li>✓ Custom logo and browser favicon upload</li>
                <li>✓ CSS color theme overrides (Primary/Secondary/Accent)</li>
                <li>✓ Publisher company name, website & support email</li>
                <li>✓ Feature flags toggle (Demo, Social, Leaderboard, etc.)</li>
                <li>✓ Public marketing text & FAQ CMS</li>
                <li>✓ Self-hosted deployment on any Linux VPS</li>
              </ul>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--color-gold)' }}>
              <div style={{ fontWeight: 700, color: 'var(--color-gold)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>AVAILABLE VIA CUSTOM COMMISSION</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                <li>⚡ Brand-specific corporate storytelling & character skins</li>
                <li>⚡ Custom 3D architectural environments & buildings</li>
                <li>⚡ Custom puzzle logic for training / educational games</li>
                <li>⚡ SSO integration (OAuth2, SAML, Google, Apple)</li>
                <li>⚡ Payment gateway & virtual item microtransactions</li>
                <li>⚡ Native Electron desktop wrapper or iOS/Android webview</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'white-label',
      title: 'Controlled White-Label Architecture',
      badge: 'ENTERPRISE LICENSING',
      subtitle: 'Complete Brand Isolation with Zero Core Logic Tampering',
      content: (
        <div>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
            Our white-label layer completely isolates visual styling from core 3D gameplay code. Enterprise buyers can rebrand the platform effortlessly while ensuring 100% campaign stability.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Default Configuration</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>AERVYN: ECHOES OF TIME</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>Official Logo • Cyan/Purple Theme • Original Lore</div>
            </div>
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--color-gold)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>White-Label Active</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>YOUR BRAND / TITLE</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>Buyer Logo • Custom Hex Colors • Corporate Identity</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'packages',
      title: 'Commercial Acquisition Packages',
      badge: 'COMMERCIAL TIERS',
      subtitle: 'Flexible Licensing Models for Studios & Portals',
      content: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', borderTop: '3px solid var(--color-cyan)' }}>
              <h4 style={{ color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>Package A: Complete Game</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Full source code, React frontend, Laravel backend, MySQL schema, 3D engine, campaign worlds, and documentation.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', fontWeight: 600, marginTop: '0.75rem' }}>CONTACT FOR QUOTE</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', borderTop: '3px solid var(--color-gold)' }}>
              <h4 style={{ color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>Package B: Game + Customization</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Everything in Package A plus brand identity replacement, logo integration, custom UI color themes, and content tweaks.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 600, marginTop: '0.75rem' }}>CONTACT FOR QUOTE</div>
            </div>
            <div className="glass-panel" style={{ padding: '1.25rem', borderTop: '3px solid var(--color-purple)' }}>
              <h4 style={{ color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>Package C: White-Label Edition</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Full white-label deployment, complete source buyout, multi-tenant portal configuration, and deployment assistance.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-purple)', fontWeight: 600, marginTop: '0.75rem' }}>CONTACT FOR QUOTE</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'demo',
      title: 'Frictionless Evaluation Demo',
      badge: 'LIVE EVALUATION',
      subtitle: 'Experience World 1 Mechanics in Under 3 Minutes',
      content: (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0 auto 1.5rem auto', lineHeight: 1.7 }}>
            Test character movement, sprint acceleration, jumping physics, the ancient runic dial puzzle, and temporal portal activation in a sandboxed, zero-friction demo.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/demo" onClick={() => { playPortal(); playClick(); }}>
              <Button variant="cyan" size="lg" icon={Play}>
                Launch Buyer Evaluation Demo
              </Button>
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Initiate Commercial Discussion',
      badge: 'NEXT STEPS',
      subtitle: 'Turnkey Transfer, Commercial Quotations & Custom Licensing',
      content: (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0 auto 2rem auto', lineHeight: 1.7 }}>
            Our commercial engineering team is ready to provide code reviews, technical Q&A, custom feature scoping, and formal commercial licensing agreements.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/#inquiry" onClick={playClick}>
              <Button variant="cyan" size="lg" icon={Mail}>
                Submit Commercial Inquiry
              </Button>
            </Link>
            <Link to="/brochure" onClick={playClick}>
              <Button variant="outline" size="lg" icon={FileText}>
                View Product Brochure
              </Button>
            </Link>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  const handleNext = () => {
    playClick();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    playClick();
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#040711',
        color: 'var(--color-text)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Presentation Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          background: 'rgba(8, 11, 24, 0.95)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Logo size="sm" glow={true} showTagline={false} />
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
            Executive Presentation Mode
          </span>
        </div>

        {/* Slide Counter & Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <Link to="/" onClick={playClick}>
            <Button variant="ghost" size="sm" icon={X}>
              Exit Presentation
            </Button>
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)' }}>
        <div
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-cyan), var(--color-purple))',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {/* Main Slide Stage */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          position: 'relative'
        }}
      >
        {/* Background Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.08) 0%, rgba(112, 71, 255, 0.04) 50%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none'
          }}
        />

        <div
          className="glass-panel"
          style={{
            maxWidth: '960px',
            width: '100%',
            padding: '3rem',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 0 50px rgba(0, 217, 255, 0.1)',
            minHeight: '440px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Slide Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <Badge variant="cyan" size="sm">{current.badge}</Badge>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {current.subtitle}
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                color: '#FFFFFF',
                fontWeight: 800,
                letterSpacing: '0.04em',
                marginBottom: '1.75rem'
              }}
            >
              {current.title}
            </h2>

            {/* Slide Body */}
            <div>{current.content}</div>
          </div>

          {/* Slide Navigation Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <Button
              variant="outline"
              size="md"
              icon={ChevronLeft}
              disabled={currentSlide === 0}
              onClick={handlePrev}
            >
              Previous Slide
            </Button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/demo" onClick={playClick}>
                <Button variant="ghost" size="md" icon={Play}>
                  Skip to Demo
                </Button>
              </Link>

              {currentSlide < slides.length - 1 ? (
                <Button
                  variant="cyan"
                  size="md"
                  icon={ChevronRight}
                  onClick={handleNext}
                >
                  Next Slide
                </Button>
              ) : (
                <Link to="/#inquiry" onClick={playClick}>
                  <Button variant="cyan" size="md" icon={Mail}>
                    Submit Inquiry
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
