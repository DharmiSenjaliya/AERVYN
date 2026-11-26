import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Compass,
  Sparkles,
  Shield,
  Zap,
  Globe,
  Award,
  ChevronRight,
  ArrowRight,
  Cpu,
  Monitor,
  Package,
  Layers,
  CheckCircle,
  HelpCircle,
  Mail,
  Send,
  Gamepad2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';
import api from '../../services/api';

/**
 * Commercial Product Landing Page
 * Official Commercial Showcase for AERVYN: ECHOES OF TIME
 * Features Hero, Story, 4 Worlds Showcase, Systems & Features, What's Included,
 * System Requirements, and Interactive Commercial Inquiry Form.
 */
export default function LandingPage() {
  const { playClick, playPortal } = useAudio();

  // Commercial Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    inquiry_type: 'game_purchase',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const worlds = [
    {
      id: 'world-1',
      title: 'World 1: The Lost Kingdom',
      epoch: 'Past Era • Year -840',
      description: 'Ancient stone fortresses, overgrown mystic sanctums, and forgotten catacombs where the first Chrono Keystone was forged. Master the ancient runic dial mechanism to unseal the timeline gate.',
      gradient: 'linear-gradient(135deg, rgba(22, 140, 255, 0.2), rgba(0, 217, 255, 0.05))',
      border: 'var(--border-cyan)',
      tag: 'Ancient Mystery'
    },
    {
      id: 'world-2',
      title: 'World 2: The Broken Present',
      epoch: 'Current Era • Year 2026',
      description: 'A decaying urban metropolis caught in temporal tremors. Maneuver across collapsed transit corridors, bypass electrified puddles, and rewire corrupted electrical circuit hubs.',
      gradient: 'linear-gradient(135deg, rgba(245, 185, 66, 0.2), rgba(22, 140, 255, 0.05))',
      border: 'var(--border-gold)',
      tag: 'Urban Ruin'
    },
    {
      id: 'world-3',
      title: 'World 3: The Fractured Future',
      epoch: 'Future Era • Year 2480',
      description: 'A neon-lit cybernetic platform suspended high above an energy abyss. Dodge lethal defense barriers, synchronize quantum frequency nodes, and defeat robotic security drones.',
      gradient: 'linear-gradient(135deg, rgba(112, 71, 255, 0.2), rgba(0, 217, 255, 0.05))',
      border: 'var(--border-purple)',
      tag: 'Cyber Citadel'
    },
    {
      id: 'world-4',
      title: 'Final Chapter: The Last Timeline',
      epoch: 'Dimensional Rift • Zero Horizon',
      description: 'Floating celestial platforms adrift at the convergence of all timelines. Face The Chronarch in an epic multi-stage boss confrontation with dual branching campaign endings.',
      gradient: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(112, 71, 255, 0.05))',
      border: 'var(--border-cyan)',
      tag: 'Final Convergence'
    }
  ];

  const features = [
    {
      icon: Compass,
      title: 'Third-Person 3D Locomotion',
      description: 'Fluid movement, sprint acceleration, jumping physics, platform traversal, and a smooth orbit-tracking camera built with Three.js.'
    },
    {
      icon: Sparkles,
      title: 'Real-Time Spacetime Shifting',
      description: 'Traverse across ancient, contemporary, and futuristic realities through interactive temporal portals that alter physical terrain.'
    },
    {
      icon: Shield,
      title: 'Story Campaign & Dual Endings',
      description: 'Progress through 10+ narrative mission stages, restore timeline fragments, and make the final choice that determines the fate of the continuum.'
    },
    {
      icon: Cpu,
      title: 'Environmental & Spatial Puzzles',
      description: 'Interact with runic stone dials, circuit breakers, and laser beam frequency alignments to activate ancient gateways.'
    },
    {
      icon: Zap,
      title: 'Multi-Phase Boss Battles',
      description: 'Test your reflexes and spatial awareness against The Chronarch with telegraph attacks, temporal shockwaves, and barrier phases.'
    },
    {
      icon: Award,
      title: 'Persistent Cloud Progression',
      description: 'Automatic checkpoint synchronization with Laravel 12 & MySQL: player levels, XP, unlocked achievements, and mission journals.'
    },
    {
      icon: Globe,
      title: 'Optional Online Social Layer',
      description: 'Engage with other players via async time-trial challenges, friends system, public player search, and competitive leaderboards.'
    },
    {
      icon: Monitor,
      title: 'Zero Installation Web Access',
      description: 'Engineered entirely for standard modern web browsers with WebGL 2.0. No downloads, no emulators, no native launcher required.'
    }
  ];

  const packageIncludes = [
    { title: 'Full Frontend Source', desc: 'React 19 + Vite 8 SPA including 3D engine, game canvas, player portal, and admin panel.' },
    { title: 'Complete Laravel 12 Backend', desc: 'Production-ready REST API with Sanctum authentication, CORS, rate limiting, and migrations.' },
    { title: 'MySQL Relational Schema', desc: '14 optimized database tables with seeders for test accounts, achievements, and game world milestones.' },
    { title: '23-Module Admin Panel', desc: 'Comprehensive back-office suite to manage players, view analytics, inspect sessions, and triage inquiries.' },
    { title: 'Procedural 3D & Audio', desc: '100% royalty-free runtime procedural geometry and Web Audio API synthesized soundscapes.' },
    { title: 'E2E Automated Test Suite', desc: '54 automated PHPUnit feature tests with over 1,000 assertions verifying all gameplay and security systems.' },
    { title: 'Turnkey Commercial Rights', desc: 'Full ownership of delivered code with zero revenue share, platform royalty fees, or recurring seat costs.' },
    { title: 'Exhaustive Documentation', desc: 'Complete suite of guides: architecture, deployment on Linux/Nginx, API references, and admin ops.' }
  ];

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await api.post('/inquiries', formData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        country: '',
        inquiry_type: 'game_purchase',
        message: ''
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit inquiry. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* 1. CINEMATIC HERO SECTION */}
      <section
        style={{
          minHeight: 'calc(100vh - 74px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 35%, rgba(22, 140, 255, 0.18) 0%, rgba(112, 71, 255, 0.1) 35%, rgba(6, 9, 19, 0.98) 75%)'
        }}
      >
        {/* Ambient Glow Aura */}
        <div
          style={{
            position: 'absolute',
            width: '650px',
            height: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '940px' }}>
          {/* Official Brand Logo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <Logo size="hero" glow={true} showTagline={false} />
          </div>

          <Badge variant="cyan" size="md" style={{ marginBottom: '1.25rem', letterSpacing: '0.08em' }}>
            COMMERCIAL 3D WEB ADVENTURE • READY TO LICENSE
          </Badge>

          {/* Master Tagline */}
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3.8vw, 2.4rem)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 800,
              marginBottom: '1.25rem',
              color: '#FFFFFF',
              textShadow: '0 0 25px rgba(0, 217, 255, 0.4)'
            }}
          >
            CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              maxWidth: '760px',
              margin: '0 auto 2.5rem auto'
            }}
          >
            An original, story-driven 3D adventure through fractured timelines. Uncover the mystery of the ancient Chrono Keystone, traverse corrupted eras, solve environmental puzzles, and restore the continuum.
          </p>

          {/* 3 Main Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}
          >
            <Link to="/demo" onClick={() => { playPortal(); playClick(); }}>
              <Button variant="cyan" size="lg" icon={Play}>
                PLAY DEMO
              </Button>
            </Link>

            <a href="#worlds" onClick={playClick}>
              <Button variant="outline" size="lg" icon={Globe}>
                EXPLORE GAME
              </Button>
            </a>

            <a href="#features" onClick={playClick}>
              <Button variant="ghost" size="lg" icon={Sparkles}>
                VIEW FEATURES
              </Button>
            </a>
          </div>

          {/* Secondary Quick Jump */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
            <span>Commercial buyer or licensing partner?</span>
            <a href="#inquiry" style={{ color: 'var(--color-cyan)', fontWeight: 600, textDecoration: 'none' }}>
              Jump to Inquiry Form &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* 2. GAME INTRODUCTION & COMMERCIAL OVERVIEW */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            <Badge variant="gold" size="sm" style={{ marginBottom: '1rem' }}>
              PRODUCT OVERVIEW
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginBottom: '1.5rem' }}>
              A High-Performance Web-First 3D Gaming Product
            </h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              <strong>AERVYN: ECHOES OF TIME</strong> is a standalone, browser-executable 3D action-adventure title that demonstrates the full potential of contemporary WebGL and real-time graphics on the open web.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
              Built from the ground up without heavy external binary bloat, AERVYN pairs a responsive Three.js runtime with a battle-tested Laravel 12 backend to deliver seamless cross-platform performance, instant load times, and an immersive single-player campaign.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WORLDS SHOWCASE */}
      <section id="worlds" style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="cyan" size="sm" style={{ marginBottom: '1rem' }}>
              THE TIMELINES
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Four Fractured Worlds to Explore</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
              Each era has its own procedural atmospheric aesthetics, environmental hazards, and custom interactive puzzle mechanics.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {worlds.map((w) => (
              <Card
                key={w.id}
                title={w.title}
                subtitle={w.epoch}
                style={{
                  background: w.gradient,
                  borderColor: w.border
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {w.tag}
                  </span>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {w.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES & SYSTEMS GRID */}
      <section id="features" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="purple" size="sm" style={{ marginBottom: '1rem' }}>
              ENGINEERED CAPABILITIES
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Complete Modern Gameplay Systems</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              A cohesive gameplay loop integrating exploration, environmental deduction, and cloud persistence.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 217, 255, 0.15)',
                      border: '1px solid var(--border-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-cyan)'
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. BUYER-FACING PACKAGE ("WHAT'S INCLUDED") */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="gold" size="sm" style={{ marginBottom: '1rem' }}>
              COMMERCIAL DELIVERABLES
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>What Is Included In The Package</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
              The complete codebase, back-office administration suite, database assets, and technical documentation are transferred with full ownership.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {packageIncludes.map((pkg, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  borderLeft: '3px solid var(--color-cyan)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={18} color="var(--color-cyan)" />
                  <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', margin: 0 }}>{pkg.title}</h4>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {pkg.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/product" onClick={playClick}>
              <Button variant="outline" size="md" icon={Layers}>
                Review Full Architectural Specifications
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. SYSTEM REQUIREMENTS */}
      <section id="specs" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="cyan" size="sm" style={{ marginBottom: '1rem' }}>
              COMPATIBILITY & SPECS
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Realistic System Requirements</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Runs efficiently in any modern browser without specialized gaming hardware.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              maxWidth: '920px',
              margin: '0 auto'
            }}
          >
            <Card title="Minimum Browser Requirements" subtitle="30+ FPS Smooth Evaluation">
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', padding: 0, margin: 0 }}>
                <li><strong>OS:</strong> Windows 10/11, macOS 12+, Ubuntu 22+, iOS 15+, Android 11+</li>
                <li><strong>Browser:</strong> Chrome 95+, Edge 95+, Firefox 95+, Safari 15+</li>
                <li><strong>WebGL:</strong> WebGL 2.0 with Hardware Acceleration enabled</li>
                <li><strong>Memory:</strong> 4 GB System RAM (1.5 GB free)</li>
                <li><strong>Input:</strong> Keyboard & Mouse, Gamepad, or Touch gestures</li>
              </ul>
            </Card>

            <Card title="Recommended Hardware" subtitle="60 FPS Ultra Settings" accent="cyan">
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', padding: 0, margin: 0 }}>
                <li><strong>OS:</strong> Modern 64-bit Desktop OS</li>
                <li><strong>Browser:</strong> Latest Chromium-based browser or Firefox</li>
                <li><strong>GPU:</strong> Dedicated NVIDIA GeForce GTX 1060+ / AMD Radeon RX 580+ / Apple M-Series</li>
                <li><strong>Memory:</strong> 8 GB+ System RAM</li>
                <li><strong>Display:</strong> 1080p, 1440p, or 4K with 60Hz+ refresh rate</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. COMMERCIAL INQUIRY FORM */}
      <section id="inquiry" style={{ padding: '6rem 0', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="gold" size="sm" style={{ marginBottom: '1rem' }}>
              COMMERCIAL INQUIRIES
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Acquire or License AERVYN</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Directly submit an inquiry to our commercial engineering team for turnkey acquisition, B2B licensing, custom reskinning, or technical partnership.
            </p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '2.5rem',
              borderColor: 'var(--border-cyan)',
              boxShadow: '0 0 30px rgba(0, 217, 255, 0.1)'
            }}
          >
            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 217, 255, 0.2)',
                    color: 'var(--color-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                  }}
                >
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ color: '#FFFFFF', marginBottom: '0.75rem', fontSize: '1.4rem' }}>
                  Inquiry Received Successfully
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
                  Thank you for your interest in AERVYN: Echoes of Time. Your inquiry has been registered in our administrative management system. Our team will review your requirements and respond within 1–2 business days.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitSuccess(false)}
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {submitError && (
                  <div
                    style={{
                      padding: '0.9rem',
                      background: 'rgba(255, 71, 87, 0.15)',
                      border: '1px solid rgba(255, 71, 87, 0.4)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FF6B81',
                      fontSize: '0.88rem'
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(8, 11, 24, 0.8)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#FFFFFF',
                        fontSize: '0.92rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(8, 11, 24, 0.8)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#FFFFFF',
                        fontSize: '0.92rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Interactive"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(8, 11, 24, 0.8)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#FFFFFF',
                        fontSize: '0.92rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                      Country / Region
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. United States, Germany"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'rgba(8, 11, 24, 0.8)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#FFFFFF',
                        fontSize: '0.92rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    Inquiry Objective *
                  </label>
                  <select
                    value={formData.inquiry_type}
                    onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(8, 11, 24, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      fontSize: '0.92rem'
                    }}
                  >
                    <option value="game_purchase">Complete Game Purchase / Buyout</option>
                    <option value="b2b_licensing">B2B Non-Exclusive Web Licensing</option>
                    <option value="customization">Custom Gameplay / Level Commissioning</option>
                    <option value="reskin">Branded Game Reskin / Marketing Activation</option>
                    <option value="technical_inquiry">Technical / Engine Inquiry</option>
                    <option value="partnership">Publishing / Distribution Partnership</option>
                    <option value="other">General Commercial Inquiry</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    Message & Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your project, timeline, target audience, or specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'rgba(8, 11, 24, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button
                    type="submit"
                    variant="cyan"
                    size="lg"
                    icon={Send}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting Inquiry...' : 'Submit Commercial Inquiry'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 8. FOOTER CTA */}
      <section
        style={{
          padding: '5rem 1.5rem',
          textAlign: 'center',
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(22, 140, 255, 0.12) 100%)',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <Logo size="md" glow={true} showTagline={false} />
          <h2 style={{ margin: '1.5rem 0 1rem 0', color: '#FFFFFF', fontSize: '1.8rem' }}>
            Experience AERVYN in Real Time
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Evaluate the interactive sandbox demo right now in your browser, or jump directly into the full single-player campaign.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/demo" onClick={() => { playPortal(); playClick(); }}>
              <Button variant="cyan" size="lg" icon={Play}>
                Launch Buyer Demo
              </Button>
            </Link>
            <Link to="/play" onClick={() => { playPortal(); playClick(); }}>
              <Button variant="outline" size="lg" icon={Gamepad2}>
                Play Full Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
