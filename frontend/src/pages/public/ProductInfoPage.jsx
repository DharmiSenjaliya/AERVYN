import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Globe,
  Database,
  Award,
  Sparkles,
  ArrowRight,
  Download,
  CheckCircle,
  FileText,
  Mail,
  Gamepad2,
  Lock,
  Zap,
  Server
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';

/**
 * Commercial Product Information Page (/product)
 * Complete technical specification, deliverable inventory, and licensing overview.
 */
export default function ProductInfoPage() {
  const { playClick, playPortal } = useAudio();

  const deliverables = [
    {
      title: 'Complete Frontend Application',
      desc: 'React 19 + Vite 8 single-page application containing the full 3D game engine, cinematic cutscenes, player dashboard, social hub, and admin panel.'
    },
    {
      title: 'Robust Laravel 12 API Backend',
      desc: 'High-performance PHP 8.2+ REST backend powered by Laravel Sanctum, rate limiting, CORS security, and database migrations for MySQL.'
    },
    {
      title: 'Full Database Schema & Seeders',
      desc: 'Comprehensive relational schema across 14 tables including users, game_progress, inventory, achievements, social relationships, audit logs, and inquiries.'
    },
    {
      title: 'Procedural 3D Geometry & Audio',
      desc: '100% royalty-free runtime assets: procedural Three.js world meshes, procedural character rigging, and Web Audio API synthesized soundscapes.'
    },
    {
      title: '23-Module Admin Operations Suite',
      desc: 'Enterprise-grade administrative dashboard to manage players, monitor world progression, inspect active sessions, review analytics, and triage buyer inquiries.'
    },
    {
      title: 'Production Documentation Suite',
      desc: 'Exhaustive markdown guides covering architecture, API endpoints, buyer features, deployment on Linux/Nginx, and system requirements.'
    }
  ];

  const systemsBreakdown = [
    {
      system: '3D Gameplay Engine',
      tech: 'Three.js, R3F, Drei, GSAP',
      details: 'Third-person camera controller, raycast ground collision, jump/sprint physics, particle emitters, procedural lighting, and time distortion shaders.'
    },
    {
      system: 'Persistent Progression',
      tech: 'Laravel Sanctum + MySQL',
      details: 'Automatic cloud checkpoint saves, inventory management, multi-objective story missions, and dual branching final campaign endings.'
    },
    {
      system: 'Audio Synthesis',
      tech: 'Web Audio API',
      details: 'Zero external audio bandwidth. Synthesized ambient pads, footstep impacts, item pickup chords, portal resonance, and combat stingers.'
    },
    {
      system: 'Player Gaming Portal',
      tech: 'React, Tailwind-inspired CSS',
      details: 'Dedicated player dashboard with XP progression, Level tiers, unlocked achievements, global leaderboards, and detailed statistics.'
    },
    {
      system: 'Community & Social Layer',
      tech: 'REST API + Social Hub',
      details: 'Player search, mutual friend requests, async time-trial challenges, challenge leaderboards, and granular privacy controls.'
    },
    {
      system: 'Quality & Test Coverage',
      tech: 'PHPUnit, 54 Feature Tests',
      details: '1,000+ assertions verifying authentication, state save/load, achievement unlocking, admin authorization, and end-to-end player journeys.'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--color-text)', minHeight: '100vh' }}>
      {/* 1. Header Banner */}
      <section
        style={{
          padding: '5rem 1.5rem 3.5rem 1.5rem',
          textAlign: 'center',
          background: 'radial-gradient(circle at 50% 20%, rgba(22, 140, 255, 0.15) 0%, rgba(112, 71, 255, 0.08) 40%, rgba(8, 11, 24, 0.98) 80%)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Badge variant="cyan" size="sm" style={{ marginBottom: '1.25rem' }}>
            COMMERCIAL PRODUCT SPECIFICATION • VERSION 1.0.0
          </Badge>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
              color: '#FFFFFF',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 800,
              marginBottom: '1rem',
              textShadow: '0 0 25px rgba(0, 217, 255, 0.3)'
            }}
          >
            AERVYN: ECHOES OF TIME
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: '750px',
              margin: '0 auto 2.25rem auto'
            }}
          >
            A turnkey 3D indie action-adventure game built entirely for the modern web. Packaged with full commercial rights, self-hosted infrastructure, and zero third-party platform royalties.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/demo" onClick={playClick}>
              <Button variant="cyan" size="lg" icon={Gamepad2}>
                Play Evaluation Demo
              </Button>
            </Link>

            <Link to="/#inquiry" onClick={playClick}>
              <Button variant="outline" size="lg" icon={Mail}>
                Contact Commercial Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Commercial Deliverables Overview */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="gold" size="sm" style={{ marginBottom: '0.75rem' }}>
              COMPLETE INVENTORY
            </Badge>
            <h2 style={{ color: '#FFFFFF', fontSize: '2rem' }}>What You Receive With Purchase</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Every asset, source file, database migration, and test suite is delivered ready to deploy.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {deliverables.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle size={22} color="var(--color-cyan)" />
                  <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0 }}>{item.title}</h3>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Deep System Architecture */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="purple" size="sm" style={{ marginBottom: '0.75rem' }}>
              TECHNICAL SPECIFICATION
            </Badge>
            <h2 style={{ color: '#FFFFFF', fontSize: '2rem' }}>Subsystem Architecture & Technology</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Engineered using battle-tested industry standards for maximum performance and maintainability.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {systemsBreakdown.map((sys, idx) => (
              <Card key={idx} title={sys.system} subtitle={sys.tech} accent={idx % 2 === 0 ? 'cyan' : 'purple'}>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {sys.details}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Campaign & World Scope */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="cyan" size="sm" style={{ marginBottom: '0.75rem' }}>
              CAMPAIGN CONTENT
            </Badge>
            <h2 style={{ color: '#FFFFFF', fontSize: '2rem' }}>4 Distinct Playable Worlds</h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              Each timeline features custom procedural environments, unique collectible artifacts, and specific spatial puzzles.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.75rem', borderColor: 'var(--border-cyan)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                World 1 • Past (-840)
              </div>
              <h3 style={{ color: '#FFFFFF', margin: '0.5rem 0' }}>The Lost Kingdom</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Ancient stone towers, cobblestone corridors, runic pedestal dial puzzles, and the initial Chrono Keystone recovery.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem', borderColor: 'var(--border-gold)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', fontWeight: 700 }}>
                World 2 • Present (2026)
              </div>
              <h3 style={{ color: '#FFFFFF', margin: '0.5rem 0' }}>The Broken Present</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Dilapidated metropolis towers, hazardous electrified street grids, circuit fuse-box puzzles, and subterranean tunnels.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem', borderColor: 'var(--border-purple)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-purple)', textTransform: 'uppercase', fontWeight: 700 }}>
                World 3 • Future (2480)
              </div>
              <h3 style={{ color: '#FFFFFF', margin: '0.5rem 0' }}>The Fractured Future</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Cybernetic sky platforms, pulsing neon laser barriers, quantum frequency alignment puzzles, and hovering energy drones.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem', borderColor: 'var(--color-cyan)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                Final Chapter • Horizon
              </div>
              <h3 style={{ color: '#FFFFFF', margin: '0.5rem 0' }}>The Last Timeline</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Floating celestial sanctuary at the event horizon. Confront The Chronarch in an epic multi-stage boss battle with dual endings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise Licensing & Commercial Terms */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-primary)' }}>
        <div className="app-container" style={{ maxWidth: '850px' }}>
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderColor: 'var(--border-cyan)' }}>
            <Logo size="md" glow={true} showTagline={false} />
            <h2 style={{ color: '#FFFFFF', marginTop: '1.5rem', marginBottom: '1rem' }}>
              Commercial Inquiries & B2B Licensing
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Whether you are acquiring AERVYN as a turnkey commercial gaming product, licensing the 3D web engine, or ordering a custom branded reskin for enterprise engagement, our team provides complete source access and deployment support.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/#inquiry" onClick={playClick}>
                <Button variant="cyan" size="lg" icon={Mail}>
                  Submit Commercial Inquiry
                </Button>
              </Link>
              <Link to="/play" onClick={() => { playPortal(); playClick(); }}>
                <Button variant="outline" size="lg" icon={Gamepad2}>
                  Test Full Experience
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
