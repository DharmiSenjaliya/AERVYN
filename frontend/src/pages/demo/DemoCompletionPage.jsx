import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Layers,
  ShieldCheck,
  Cpu,
  Mail,
  ExternalLink,
  Award,
  Globe
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';

/**
 * Buyer Demo Completion Screen
 * Displays evaluation slice summary, full game systems breakdown,
 * and commercial next steps for prospective buyers / licensing partners.
 */
export default function DemoCompletionPage() {
  const navigate = useNavigate();
  const { playClick, playPortal } = useAudio();

  const fullGameHighlights = [
    {
      title: '4 Hand-Crafted Timelines',
      description: 'The Lost Kingdom (Year -840), The Broken Present (Year 2026), The Fractured Future (Year 2480), and The Forgotten Horizon.'
    },
    {
      title: 'Boss Battle: The Chronarch',
      description: 'Multi-phase climactic boss encounter featuring dynamic attack telegraphs, temporal shielding, and dual branching endings.'
    },
    {
      title: 'Full Commercial Architecture',
      description: 'Complete with Player Dashboard, XP/Level system, Achievements, Leaderboards, optional Social Layer, and 23-module Admin Panel.'
    },
    {
      title: '100% Production Ready',
      description: 'Zero external commercial 3D asset dependencies — fully procedural Three.js geometry, Web Audio API soundscape, and Laravel 12 Sanctum backend.'
    }
  ];

  const commercialHighlights = [
    { label: 'Frontend', val: 'React 19 + Vite 8 + Three.js + R3F + GSAP' },
    { label: 'Backend', val: 'Laravel 12 + PHP 8.2+ + MySQL' },
    { label: 'Auth & Security', val: 'Laravel Sanctum + Rate Limiting + CORS' },
    { label: 'Delivery Model', val: 'Full Source Code, Self-Hosted, No Royalties' }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#060913',
        color: 'var(--color-text)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.12) 0%, rgba(112, 71, 255, 0.05) 50%, transparent 75%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '960px', width: '100%', position: 'relative', zIndex: 2 }}>
        {/* Header Branding */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <Logo size="hero" glow={true} showTagline={false} />
        </div>

        {/* Completion Hero Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, rgba(22, 140, 255, 0.15) 0%, rgba(112, 71, 255, 0.1) 50%, rgba(6, 9, 19, 0.8) 100%)',
            borderColor: 'var(--border-cyan)',
            boxShadow: '0 0 40px rgba(0, 217, 255, 0.2)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 217, 255, 0.2)',
              border: '2px solid var(--color-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: 'var(--color-cyan)',
              boxShadow: '0 0 25px rgba(0, 217, 255, 0.5)'
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <Badge variant="cyan" size="md" style={{ marginBottom: '1rem' }}>
            EVALUATION SLICE VERIFIED
          </Badge>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              color: '#FFFFFF',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 800,
              marginBottom: '1rem',
              textShadow: '0 0 25px rgba(0, 217, 255, 0.4)'
            }}
          >
            DEMO COMPLETE
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2rem auto',
              lineHeight: 1.7
            }}
          >
            You have successfully explored the ancient sanctuary of <strong style={{ color: '#FFFFFF' }}>The Lost Kingdom</strong>, retrieved the Chrono Keystone fragment, solved the temporal dial mechanism, and activated the continuum portal.
          </p>

          {/* Quick Action CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center'
            }}
          >
            <Link to="/#inquiry" onClick={playClick}>
              <Button variant="cyan" size="lg" icon={Mail}>
                License / Inquire About AERVYN
              </Button>
            </Link>

            <Link to="/product" onClick={playClick}>
              <Button variant="outline" size="lg" icon={Layers}>
                Product Specifications
              </Button>
            </Link>

            <Link to="/demo" onClick={playClick}>
              <Button variant="ghost" size="lg" icon={RotateCcw}>
                Replay Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Full Commercial Product Scope Grid */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.4rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Sparkles size={20} color="var(--color-cyan)" />
            What is Included in the Full Commercial Release
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {fullGameHighlights.map((item, idx) => (
              <Card key={idx} title={item.title} accent={idx === 0 ? 'cyan' : idx === 1 ? 'gold' : 'purple'}>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Commercial Specifications Overview */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            marginBottom: '2.5rem',
            background: 'rgba(8, 11, 24, 0.7)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="var(--color-gold)" />
            Technical Architecture & Deliverable Specs
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {commercialHighlights.map((tech, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                  {tech.label}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.35rem' }}>
                  {tech.val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <Link
            to="/"
            onClick={playClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text-secondary)',
              fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            Return to Product Showcase
          </Link>

          <Link to="/play" onClick={() => { playPortal(); playClick(); }}>
            <Button variant="cyan" size="md" icon={Globe}>
              Launch Full Game Campaign
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
