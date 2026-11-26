import React, { useState, useEffect } from 'react';
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
  ChevronDown,
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
  ShieldAlert,
  Clock,
  Database,
  Sliders,
  Maximize2,
  X,
  FileText,
  Phone,
  DollarSign,
  BarChart3,
  Users,
  Smartphone,
  Laptop,
  Check,
  Video
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useAudio } from '../../context/AudioContext';
import { useBranding } from '../../context/BrandingContext';
import api from '../../services/api';

/**
 * Commercial Sales Platform & Product Landing Page
 * Official Commercial Showcase for AERVYN: ECHOES OF TIME
 * 22+ comprehensive B2B sections with buyer demo, presentation deck, interactive screenshot gallery,
 * package matrix, and lead CRM integration.
 */
export default function LandingPage() {
  const { playClick, playPortal } = useAudio();
  const { branding } = useBranding();

  // Dynamic Product Content from Admin CMS
  const [content, setContent] = useState({
    hero_title: branding.gameTitle || 'AERVYN: ECHOES OF TIME',
    tagline: branding.tagline || 'CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.',
    intro_text: 'An original, story-driven 3D adventure through fractured timelines. Uncover the mystery of the ancient Chrono Keystone, traverse corrupted eras, solve environmental puzzles, and restore the continuum.',
    overview_heading: 'A High-Performance Web-First 3D Gaming Product',
    overview_text: 'Built from the ground up without heavy external binary bloat, AERVYN pairs a responsive Three.js runtime with a battle-tested Laravel 12 backend to deliver seamless cross-platform performance, instant load times, and an immersive single-player campaign.',
    contact_email: 'sales@aervyn-game.com',
    contact_phone: '+1 (555) 019-2834'
  });

  useEffect(() => {
    api.get('/config/product-content')
      .then(res => {
        if (res.data?.data) {
          setContent(prev => ({ ...prev, ...res.data.data }));
        }
      })
      .catch(() => {
        // Fallback to default branding
      });
  }, [branding]);

  // Commercial Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    inquiry_type: 'game_purchase',
    budget_range: '$10k-$25k',
    preferred_contact: 'email',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Screenshot Gallery Lightbox State
  const [activeGalleryTab, setActiveGalleryTab] = useState('worlds');
  const [lightboxImage, setLightboxImage] = useState(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
    playClick();
  };

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
        phone: '',
        company: '',
        country: '',
        inquiry_type: 'game_purchase',
        budget_range: '$10k-$25k',
        preferred_contact: 'email',
        message: ''
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit inquiry. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // 4 Story Worlds
  const worlds = [
    {
      id: 'world-1',
      title: 'World 1: The Lost Kingdom',
      epoch: 'Past Era • Year -840',
      description: 'Ancient stone fortresses, overgrown mystic sanctums, and forgotten catacombs where the first Chrono Keystone was forged. Master the ancient runic dial mechanism to unseal the timeline gate.',
      gradient: 'linear-gradient(135deg, rgba(22, 140, 255, 0.2), rgba(0, 217, 255, 0.05))',
      border: 'var(--border-cyan)',
      tag: 'Ancient Mystery',
      color: '#00d9ff'
    },
    {
      id: 'world-2',
      title: 'World 2: The Broken Present',
      epoch: 'Current Era • Year 2026',
      description: 'A decaying urban metropolis caught in temporal tremors. Maneuver across collapsed transit corridors, bypass electrified puddles, and rewire corrupted electrical circuit hubs.',
      gradient: 'linear-gradient(135deg, rgba(245, 185, 66, 0.2), rgba(22, 140, 255, 0.05))',
      border: 'var(--border-gold)',
      tag: 'Urban Ruin',
      color: '#f5b942'
    },
    {
      id: 'world-3',
      title: 'World 3: The Fractured Future',
      epoch: 'Future Era • Year 2480',
      description: 'A neon-lit cybernetic platform suspended high above an energy abyss. Dodge lethal defense barriers, synchronize quantum frequency nodes, and defeat robotic security sentries.',
      gradient: 'linear-gradient(135deg, rgba(112, 71, 255, 0.2), rgba(0, 217, 255, 0.05))',
      border: 'var(--border-purple)',
      tag: 'Cyber Citadel',
      color: '#7047ff'
    },
    {
      id: 'world-4',
      title: 'Final Chapter: The Last Timeline',
      epoch: 'Dimensional Rift • Zero Horizon',
      description: 'Floating celestial platforms adrift at the convergence of all timelines. Face The Chronarch in an epic multi-stage boss confrontation with dual branching campaign endings.',
      gradient: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(112, 71, 255, 0.05))',
      border: 'var(--border-cyan)',
      tag: 'Final Convergence',
      color: '#38ef7d'
    }
  ];

  // 8 Gameplay Mechanics
  const mechanics = [
    {
      icon: Compass,
      title: 'Third-Person 3D Locomotion',
      description: 'Fluid WASD movement, sprint dash, precise platform jumping, and collision response powered by Three.js vectors.'
    },
    {
      icon: Monitor,
      title: 'Smooth Dynamic Orbit Camera',
      description: 'Cinematic third-person tracking with smooth interpolation, manual mouse orbit, collision clipping avoidance, and zoom presets.'
    },
    {
      icon: Clock,
      title: 'Real-Time Spacetime Shifting',
      description: 'Traverse across ancient, contemporary, and futuristic realities through interactive temporal portals that alter physical terrain.'
    },
    {
      icon: Cpu,
      title: 'Environmental & Spatial Puzzles',
      description: 'Interact with runic stone dials, power circuit junctions, and quantum laser alignment nodes to unlock progression gates.'
    },
    {
      icon: Sparkles,
      title: 'Collectibles & Artifact System',
      description: 'Discover Chrono Shards, temporal keystones, lore logs, and secret codex entries that award player XP and enrich lore.'
    },
    {
      icon: Zap,
      title: 'Telegraphed Boss Confrontation',
      description: 'Epic multi-phase battle against The Chronarch featuring ground shockwaves, summon waves, shield absorption, and vulnerability windows.'
    },
    {
      icon: Award,
      title: 'Persistent Cloud Progression',
      description: 'Automatic checkpoint synchronization with Laravel 12 & MySQL: player levels, XP, unlocked achievements, and mission journals.'
    },
    {
      icon: Globe,
      title: 'Zero-Install Browser Engine',
      description: 'Engineered entirely for standard modern web browsers with WebGL 2.0. No downloads, no emulators, no native launcher required.'
    }
  ];

  // Screenshot Gallery Items
  const galleryItems = {
    worlds: [
      { id: 1, title: 'World 1: Ancient Temple Ruins', subtitle: 'Atmospheric sandstone lighting with runic obelisks', category: 'World 1', gradient: 'from-amber-900/60 to-cyan-900/40' },
      { id: 2, title: 'World 2: Neon Urban Tremors', subtitle: 'Flooded streets and flickering holographic billboards', category: 'World 2', gradient: 'from-blue-900/60 to-amber-900/40' },
      { id: 3, title: 'World 3: Cybernetic Platform Core', subtitle: 'Suspended energy grids and quantum defense lasers', category: 'World 3', gradient: 'from-purple-900/60 to-cyan-900/40' },
      { id: 4, title: 'Final Chapter: The Celestial Rift', subtitle: 'Cosmic nexus with converging timeline fragments', category: 'Final Chapter', gradient: 'from-cyan-900/60 to-purple-900/40' }
    ],
    hud: [
      { id: 5, title: 'Interactive In-Game HUD', subtitle: 'Health gauge, Chrono Energy meter, compass radar, and active quest prompt', category: 'Gameplay HUD', gradient: 'from-cyan-950 to-blue-900' },
      { id: 6, title: 'Runic Dial Puzzle Interface', subtitle: 'Interactive 3D puzzle overlay with real-time feedback audio', category: 'Puzzle UI', gradient: 'from-indigo-950 to-cyan-900' },
      { id: 7, title: 'Story Journal & Quest Tracker', subtitle: 'Live mission objectives with chronological codex entries', category: 'Player Journal', gradient: 'from-purple-950 to-blue-950' }
    ],
    dashboard: [
      { id: 8, title: 'Player Dashboard Overview', subtitle: 'Player level, XP progress bar, unlocked achievements, and session timeline', category: 'Player Portal', gradient: 'from-blue-950 to-slate-900' },
      { id: 9, title: 'Global Leaderboards & Medals', subtitle: 'Competitive speedrun time trials and score rankings', category: 'Competitive', gradient: 'from-amber-950 to-slate-900' },
      { id: 10, title: 'Online Social Hub & Challenges', subtitle: 'Friend requests, time-trial async challenges, and player search', category: 'Social Hub', gradient: 'from-cyan-950 to-purple-950' }
    ],
    admin: [
      { id: 11, title: '23-Module Admin Console', subtitle: 'Live telemetry, player moderation, mission tuning, and system metrics', category: 'Admin Panel', gradient: 'from-slate-950 to-cyan-950' },
      { id: 12, title: 'Commercial Lead CRM & Funnel', subtitle: 'B2B inquiry triage, priority tags, follow-up calendar, and safe CSV export', category: 'Lead CRM', gradient: 'from-slate-950 to-purple-950' },
      { id: 13, title: 'White-Label Branding Suite', subtitle: 'Live theme picker, color customization, logo upload, and brand reset', category: 'White-Label', gradient: 'from-slate-950 to-amber-950' }
    ]
  };

  // FAQ Items
  const faqList = [
    {
      q: 'Can AERVYN be deployed on our existing private server infrastructure?',
      a: 'Yes, absolutely. AERVYN requires standard Linux or Windows web hosting with PHP 8.2+, MySQL 8.0+, and Nginx or Apache. Automated deployment scripts and ready-to-use Nginx and Apache server configuration files are included in the handover package.'
    },
    {
      q: 'Are there any recurring royalties, seat license fees, or revenue shares?',
      a: 'None whatsoever. All commercial packages include 100% turnkey source code ownership. You keep 100% of any player monetization, subscriptions, or sponsorships with zero ongoing royalties or reporting obligations.'
    },
    {
      q: 'Do players need to install any native apps, plugins, or browser extensions?',
      a: 'No. AERVYN executes natively inside standard modern web browsers (Chrome, Firefox, Safari, Edge) via standard WebGL 2.0. Players simply click a link and are in the game in seconds.'
    },
    {
      q: 'How easily can the game be white-labeled with our own branding?',
      a: 'Extremely easily. The built-in White-Label Branding Suite allows administrators to change the game title, logo, primary and secondary color palettes, font family, and marketing copy directly from the admin panel without modifying code.'
    },
    {
      q: 'Is the backend scalable to support thousands of concurrent players?',
      a: 'Yes. The backend is built with Laravel 12 and indexed MySQL schemas with Sanctum token authentication, session pooling, and rate limiting. It can be easily load-balanced behind Redis and Cloudflare for high-concurrency environments.'
    },
    {
      q: 'What level of technical documentation is provided with the commercial package?',
      a: 'The project includes 25+ comprehensive documentation manuals covering system architecture, installation, database schemas, API routes, 3D engine internals, white-label configuration, deployment scripts, and B2B buyer checklists.'
    },
    {
      q: 'Does the game require third-party paid asset licenses or proprietary SDKs?',
      a: 'No. All 3D geometry is procedurally generated at runtime, and all sound effects are synthesized dynamically using the browser-native Web Audio API. There are zero third-party licensing liabilities or external asset royalties.'
    },
    {
      q: 'What is the turnaround time for inquiry responses and technical demos?',
      a: 'Our commercial engineering team reviews and responds to all commercial inquiries within 24 business hours. Live technical walkthroughs can typically be scheduled within 2 to 3 business days.'
    }
  ];

  return (
    <div className="commercial-sales-platform">
      
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
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '980px' }}>
          {/* Official Brand Logo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <Logo size="hero" glow={true} showTagline={false} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <Badge variant="cyan" size="md">
              COMMERCIAL 3D WEB ADVENTURE • B2B TURNKEY PACKAGE
            </Badge>
            <Badge variant="purple" size="md">
              ZERO ROYALTIES • FULL SOURCE
            </Badge>
          </div>

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
            {content.tagline}
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.65,
              maxWidth: '800px',
              margin: '0 auto 2.5rem auto'
            }}
          >
            {content.intro_text}
          </p>

          {/* 5 Main Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}
          >
            <Link to="/buyer-demo" onClick={() => { playPortal(); playClick(); }}>
              <Button variant="cyan" size="lg" icon={Sparkles} style={{ background: 'linear-gradient(135deg, var(--color-cyan), #7047ff)' }}>
                BUYER DEMO ROOM
              </Button>
            </Link>

            <Link to="/demo" onClick={() => { playPortal(); playClick(); }}>
              <Button variant="outline" size="lg" icon={Play} className="border-cyan-400 text-cyan-300">
                PLAY DEMO
              </Button>
            </Link>

            <a href="#overview" onClick={playClick}>
              <Button variant="outline" size="lg" icon={Globe}>
                EXPLORE PRODUCT
              </Button>
            </a>

            <a href="#inquiry" onClick={playClick}>
              <Button variant="ghost" size="lg" icon={Send} style={{ border: '1px solid var(--border-gold)', color: 'var(--color-gold)' }}>
                REQUEST A QUOTE
              </Button>
            </a>

            <Link to="/presentation" onClick={playClick}>
              <Button variant="ghost" size="lg" icon={Monitor} style={{ border: '1px solid var(--border-purple)', color: '#d8b4fe' }}>
                BUYER PRESENTATION
              </Button>
            </Link>
          </div>

          {/* Secondary Quick Jump Navigation Links */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <a href="#worlds" className="hover:text-cyan-400 transition-colors">4 Story Worlds</a>
            <span>•</span>
            <a href="#mechanics" className="hover:text-cyan-400 transition-colors">Gameplay Mechanics</a>
            <span>•</span>
            <a href="#gallery" className="hover:text-cyan-400 transition-colors">Screenshot Gallery</a>
            <span>•</span>
            <a href="#packages" className="hover:text-cyan-400 transition-colors">Package Tiers</a>
            <span>•</span>
            <a href="#specs" className="hover:text-cyan-400 transition-colors">System Specs</a>
            <span>•</span>
            <Link to="/brochure" className="text-cyan-400 font-semibold hover:underline flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Printable Brochure
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CINEMATIC PRODUCT INTRO & FRACTURED CONTINUUM */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
            <Badge variant="cyan" size="sm" style={{ marginBottom: '1rem' }}>
              CINEMATIC PRELUDE
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF', marginBottom: '1.25rem' }}>
              The Mystery of the Fractured Continuum
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              When an ancient temporal catalyst—the <strong>Chrono Keystone</strong>—shattered into chronological fragments, the flow of linear time collapsed. Ancient kingdoms were frozen in eternal stasis, modern metropolises split under temporal seismic tremors, and cybernetic futures fractured into paradox loops.
            </p>
            <p style={{ fontSize: '0.98rem', lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
              As the temporal voyager, players manipulate spacetime portals, stabilize energetic distortions, decode ancient runic dial mechanisms, and face the cosmic guardian <strong>The Chronarch</strong> to choose the ultimate fate of reality.
            </p>
          </div>
        </div>
      </section>

      {/* 3. GAME OVERVIEW & CORE EXPLORATION LOOP */}
      <section id="overview" style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="gold" size="sm" style={{ marginBottom: '1rem' }}>
              PRODUCT OVERVIEW
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>{content.overview_heading}</h2>
            <p style={{ marginTop: '0.75rem', color: 'var(--color-text-secondary)', maxWidth: '780px', margin: '0.75rem auto 0 auto', lineHeight: 1.7 }}>
              {content.overview_text}
            </p>
          </div>

          {/* Core Player Experience Flow */}
          <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'rgba(8, 12, 26, 0.6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '1.5rem', textAlign: 'center', letterSpacing: '0.05em' }}>
              THE CORE 9-STEP PLAYER ENGAGEMENT LOOP
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', textAlign: 'center' }}>
              {[
                { step: '1. Discover', desc: 'Awaken in uncharted era' },
                { step: '2. Explore', desc: 'Survey 3D terrain' },
                { step: '3. Investigate', desc: 'Uncover lore codex' },
                { step: '4. Solve', desc: 'Align dial mechanisms' },
                { step: '5. Collect', desc: 'Gather Chrono Shards' },
                { step: '6. Travel', desc: 'Shift spacetime eras' },
                { step: '7. Survive', desc: 'Overcome hazards' },
                { step: '8. Decide', desc: 'Dual campaign ending' },
                { step: '9. Complete', desc: 'Synchronize cloud save' }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '1rem 0.5rem', background: 'rgba(22, 140, 255, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0, 217, 255, 0.15)' }}>
                  <div style={{ color: 'var(--color-cyan)', fontWeight: 'bold', fontSize: '0.88rem', marginBottom: '0.25rem' }}>
                    {item.step}
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. GAMEPLAY SHOWCASE (8 KEY MECHANICS) */}
      <section id="mechanics" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="purple" size="sm" style={{ marginBottom: '1rem' }}>
              GAME ENGINE CAPABILITIES
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>8 Production-Grade Gameplay Mechanics</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Built specifically for fluid browser execution at 60 FPS without external plugin dependencies.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {mechanics.map((m, idx) => {
              const Icon = m.icon;
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
                  <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0 }}>{m.title}</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {m.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. WORLDS SHOWCASE */}
      <section id="worlds" style={{ padding: '6rem 0', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="cyan" size="sm" style={{ marginBottom: '1rem' }}>
              THE 4 TIMELINE WORLDS
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Immersive Chronological Environments</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
              Each timeline features distinct procedural atmospheric shaders, lighting palettes, custom environmental obstacles, and puzzle challenges.
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
                      color: w.color,
                      letterSpacing: '0.05em',
                      fontWeight: 600
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

      {/* 6. TIME TRAVEL SYSTEM & DUAL CAMPAIGN ENDINGS */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <Badge variant="purple" size="sm" style={{ marginBottom: '1rem' }}>
                SPATIAL DYNAMICS
              </Badge>
              <h2 style={{ fontSize: '2.1rem', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Seamless Real-Time Chronological Portals
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Players activate ancient gateway arches to physically transition between eras. The environment morphs dynamically: crumbled stone walls in World 2 become intact ancient monuments in World 1, while flooded streets become synthetic laser corridors in World 3.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Cause-and-effect puzzles spanning across centuries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Chrono Energy fuel gating and cooldown mechanics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <span>Zero loading screens between local era phase shifts</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-gray-900/80 border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Branching Campaign Dual Endings
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                At the climax of the Final Chapter, players defeat The Chronarch and make a defining moral and temporal choice:
              </p>
              <div className="space-y-3">
                <div className="p-3 rounded bg-cyan-950/40 border border-cyan-500/20">
                  <strong className="text-cyan-300 text-xs block mb-1">Ending A: Timeline Restoration</strong>
                  <span className="text-xs text-gray-400">Sacrifice the Chrono Keystone to seal the rifts, restoring linear history at the cost of personal transcendence.</span>
                </div>
                <div className="p-3 rounded bg-purple-950/40 border border-purple-500/20">
                  <strong className="text-purple-300 text-xs block mb-1">Ending B: Timeline Transcendence</strong>
                  <span className="text-xs text-gray-400">Absorb the Keystone power to become the eternal watcher of all timelines, accepting perpetual detachment from mortal reality.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRODUCT SCREENSHOT GALLERY WITH LIGHTBOX */}
      <section id="gallery" style={{ padding: '6rem 0', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="cyan" size="sm" style={{ marginBottom: '1rem' }}>
              VISUAL ASSET SHOWCASE
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Product Screenshot Gallery</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Explore the 3D game worlds, player dashboard, and back-office administrative consoles.
            </p>

            {/* Gallery Category Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              {[
                { key: 'worlds', label: '3D Story Worlds' },
                { key: 'hud', label: 'Gameplay HUD & Puzzles' },
                { key: 'dashboard', label: 'Player Dashboard' },
                { key: 'admin', label: 'Admin CRM & Analytics' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveGalleryTab(tab.key); playClick(); }}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: activeGalleryTab === tab.key ? 'var(--color-cyan)' : 'rgba(255, 255, 255, 0.05)',
                    color: activeGalleryTab === tab.key ? '#000000' : 'var(--color-text-secondary)',
                    border: '1px solid ' + (activeGalleryTab === tab.key ? 'var(--color-cyan)' : 'var(--border-subtle)')
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Screenshot Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {galleryItems[activeGalleryTab]?.map(item => (
              <div
                key={item.id}
                onClick={() => setLightboxImage(item)}
                className="group cursor-pointer rounded-lg overflow-hidden border border-gray-800 hover:border-cyan-500/60 transition-all bg-[#0c1222] flex flex-col justify-between"
              >
                <div className={`h-48 bg-gradient-to-br ${item.gradient} p-4 flex flex-col justify-between relative`}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-black/40 text-cyan-300 border border-cyan-500/30">
                      {item.category}
                    </span>
                    <Maximize2 className="w-4 h-4 text-gray-300 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-center my-auto">
                    <Gamepad2 className="w-10 h-10 text-white/30 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-[11px] text-gray-400 italic">Click to expand preview</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {lightboxImage && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
            >
              <div
                className="relative max-w-2xl w-full bg-[#0d1326] border border-cyan-500/40 rounded-xl p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
                <span className="text-xs uppercase font-mono px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {lightboxImage.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">{lightboxImage.title}</h3>
                <p className="text-sm text-gray-300 mb-6">{lightboxImage.subtitle}</p>
                <div className={`h-64 rounded-lg bg-gradient-to-br ${lightboxImage.gradient} flex items-center justify-center border border-gray-700`}>
                  <div className="text-center p-6">
                    <Logo size="md" glow={true} showTagline={false} />
                    <p className="text-xs text-gray-400 mt-4 font-mono">
                      High-Resolution Visual Render • AERVYN 3D Engine Output
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. CINEMATIC VIDEO TRAILER PLACEHOLDER */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Badge variant="purple" size="sm" style={{ marginBottom: '1rem' }}>
              VIDEO PREVIEW
            </Badge>
            <h2 style={{ fontSize: '2.1rem', color: '#FFFFFF', marginBottom: '1rem' }}>
              Cinematic Gameplay Trailer
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Witness the temporal shifts, runic puzzles, and Chronarch boss encounter in action.
            </p>

            {/* Video Poster Frame */}
            <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-slate-900 to-[#080d1e] p-8 aspect-video flex flex-col items-center justify-center shadow-2xl group">
              <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
              
              <Link
                to="/demo"
                onClick={() => { playPortal(); playClick(); }}
                className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </Link>

              <span className="mt-4 text-sm font-bold uppercase tracking-widest text-white">
                GAMEPLAY TRAILER COMING SOON
              </span>
              <span className="text-xs text-cyan-400 mt-1">
                Click Play to Launch Live Interactive 3D Demo Now
              </span>

              <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/60 border border-gray-700 text-[11px] font-mono text-gray-300">
                02:14 • 1080p 60FPS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ENTERPRISE ADMIN SUITE & ANALYTICS SHOWCASE */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="gold" size="sm" style={{ marginBottom: '1rem' }}>
              COMPLETE OPERATIONAL CONTROL
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>23-Module Enterprise Admin Suite</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
              A full commercial back-office suite to manage players, adjust game parameters, inspect lead pipelines, and monitor telemetry in real time.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: 'Player Management', desc: 'Inspect registrations, grant XP, moderate accounts, and review play history.' },
              { title: 'Mission & World Tuning', desc: 'Enable/disable worlds, tune target score requirements, and inspect level metrics.' },
              { title: 'Commercial Lead CRM', desc: 'Triage B2B buyer inquiries, set priority tags, log follow-up notes, and export CSV.' },
              { title: 'White-Label Branding Suite', desc: 'Reskin logo, game title, and primary/secondary color schemes without code changes.' },
              { title: 'Product Marketing CMS', desc: 'Edit public landing page marketing copy, taglines, and contact details live.' },
              { title: 'Session Telemetry & Analytics', desc: 'Zero-PII conversion funnel metrics, completion duration, and error monitoring.' },
              { title: 'Social & Challenge Moderation', desc: 'Review async player challenges, time-trial medals, and global leaderboards.' },
              { title: 'Role-Based Access Control', desc: 'Multi-admin permissions, audit trail logging, and secure Sanctum session tokens.' }
            ].map((mod, idx) => (
              <div
                key={idx}
                className="p-5 rounded-lg bg-[#0b1020] border border-gray-800 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-sm text-white">{mod.title}</h4>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {mod.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/admin/login" onClick={playClick}>
              <Button variant="outline" size="md" icon={LockIcon}>
                Access Admin Portal Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. COMMERCIAL PACKAGE TIERS & COMPARISON TABLE */}
      <section id="packages" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="cyan" size="sm" style={{ marginBottom: '1rem' }}>
              COMMERCIAL TIERS
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Commercial Licensing Packages</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Transparent turnkey offerings with zero recurring royalties and 100% full source ownership.
            </p>
          </div>

          {/* 3 Package Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
            {/* Package A */}
            <div className="p-6 rounded-xl bg-gray-900/70 border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold">PACKAGE A</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-2">Complete Game Package</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Turnkey single-player 3D game with all 4 worlds, 23-module admin panel, and complete Laravel 12 + React source.
                </p>
                <div className="text-2xl font-black text-cyan-300 font-mono mb-4">
                  Contact for Quote
                </div>
                <ul className="space-y-2 text-xs text-gray-300 border-t border-gray-800 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Full Frontend & Backend Source</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> All 4 Worlds + Boss Battle</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 23 Admin Modules & CRM</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 59+ Automated Feature Tests</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 100% Royalty-Free Rights</li>
                </ul>
              </div>
              <a href="#inquiry" className="mt-6">
                <Button variant="cyan" size="sm" className="w-full">
                  Inquire for Package A
                </Button>
              </a>
            </div>

            {/* Package B */}
            <div className="p-6 rounded-xl bg-gray-900/70 border border-purple-500/40 relative flex flex-col justify-between shadow-lg shadow-purple-500/10">
              <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-600 text-white">
                POPULAR CHOICE
              </span>
              <div>
                <span className="text-xs font-mono uppercase text-purple-400 font-bold">PACKAGE B</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-2">Game + Customization</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Complete game source plus bespoke engineering hours for custom puzzle mechanics, branding reskin, or specific API integrations.
                </p>
                <div className="text-2xl font-black text-purple-300 font-mono mb-4">
                  Contact for Quote
                </div>
                <ul className="space-y-2 text-xs text-gray-300 border-t border-gray-800 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Everything in Package A</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Custom Branding & Logo Assets</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Dedicated Custom Development Hours</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Assisted Deployment on Your Cloud</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> 60-Day Technical Support Window</li>
                </ul>
              </div>
              <a href="#inquiry" className="mt-6">
                <Button variant="outline" size="sm" className="w-full border-purple-500 text-purple-300">
                  Inquire for Package B
                </Button>
              </a>
            </div>

            {/* Package C */}
            <div className="p-6 rounded-xl bg-gray-900/70 border border-amber-500/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-bold">PACKAGE C</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-2">White-Label Enterprise Edition</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Unrestricted white-label commercial distribution rights, master reskin architecture, multi-tenant deployment guide, and VIP SLA.
                </p>
                <div className="text-2xl font-black text-amber-300 font-mono mb-4">
                  Contact for Quote
                </div>
                <ul className="space-y-2 text-xs text-gray-300 border-t border-gray-800 pt-4">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Full White-Label Branding Engine</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Re-licensing & Sub-licensing Rights</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Dedicated Architecture Consultation</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Custom Database Sharding Config</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Priority 24/7 Developer Support</li>
                </ul>
              </div>
              <a href="#inquiry" className="mt-6">
                <Button variant="ghost" size="sm" className="w-full border border-amber-500/40 text-amber-300">
                  Inquire for Package C
                </Button>
              </a>
            </div>
          </div>

          {/* Package Comparison Table */}
          <div className="border border-cyan-500/20 rounded-xl overflow-hidden bg-[#090e1c]">
            <div className="p-4 bg-gray-900/80 border-b border-gray-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Comprehensive Package Deliverables Matrix
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 bg-gray-900/40">
                    <th className="p-3.5 font-bold">Feature / Component</th>
                    <th className="p-3.5 font-bold text-center text-cyan-400">Package A</th>
                    <th className="p-3.5 font-bold text-center text-purple-400">Package B</th>
                    <th className="p-3.5 font-bold text-center text-amber-400">Package C</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  <tr>
                    <td className="p-3.5">Complete React 19 + Three.js Source Code</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="p-3.5">Complete Laravel 12 Backend API & Sanctum</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="p-3.5">4 Story Worlds, Boss Battle, Dual Endings</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="p-3.5">23 Admin Modules & CRM Lead Management</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="p-3.5">White-Label Dynamic Theming Suite</td>
                    <td className="p-3.5 text-center text-gray-500">—</td>
                    <td className="p-3.5 text-center text-purple-400">Assisted Setup</td>
                    <td className="p-3.5 text-center text-emerald-400">Full & Unrestricted</td>
                  </tr>
                  <tr>
                    <td className="p-3.5">Production Deployment Scripts (Linux/Windows)</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="p-3.5">25 Architectural & Operational Manuals</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                    <td className="p-3.5 text-center text-emerald-400">✓ Included</td>
                  </tr>
                  <tr>
                    <td className="p-3.5">Recurring Royalties / Platform Revenue Share</td>
                    <td className="p-3.5 text-center font-bold text-emerald-400">$0 (100% Free)</td>
                    <td className="p-3.5 text-center font-bold text-emerald-400">$0 (100% Free)</td>
                    <td className="p-3.5 text-center font-bold text-emerald-400">$0 (100% Free)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container" style={{ maxWidth: '840px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="cyan" size="sm" style={{ marginBottom: '1rem' }}>
              FREQUENTLY ASKED QUESTIONS
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Commercial & Technical FAQ</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Clear, realistic answers for prospective publishers, studios, and enterprise buyers.
            </p>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-800 bg-[#0a0f20] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-sm font-bold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-300 leading-relaxed border-t border-gray-800/60 bg-gray-900/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. ENHANCED COMMERCIAL INQUIRY FORM */}
      <section id="inquiry" style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="gold" size="sm" style={{ marginBottom: '1rem' }}>
              COMMERCIAL INQUIRIES & ACQUISITION
            </Badge>
            <h2 style={{ fontSize: '2.2rem', color: '#FFFFFF' }}>Acquire or License AERVYN</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-muted)' }}>
              Directly submit an inquiry to our commercial engineering team. All submissions are automatically prioritized and triaged within our administrative CRM.
            </p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '2.5rem',
              borderColor: 'var(--border-cyan)',
              boxShadow: '0 0 35px rgba(0, 217, 255, 0.12)'
            }}
          >
            {submitSuccess ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 217, 255, 0.2)',
                    color: 'var(--color-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                  }}
                >
                  <CheckCircle size={34} />
                </div>
                <h3 style={{ color: '#FFFFFF', marginBottom: '0.75rem', fontSize: '1.4rem' }}>
                  Commercial Inquiry Received
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
                  Thank you for your interest in AERVYN: Echoes of Time. Your inquiry has been logged in our lead triage system. Our engineering and business development team will review your specifications and contact you within 24 business hours.
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

                {/* Name & Email */}
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

                {/* Phone & Company */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                      Phone / Mobile (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                </div>

                {/* Country, Budget Range & Preferred Contact */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
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

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                      Estimated Budget Range
                    </label>
                    <select
                      value={formData.budget_range}
                      onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
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
                      <option value="Under $10k">Under $10,000</option>
                      <option value="$10k-$25k">$10,000 – $25,000</option>
                      <option value="$25k-$50k">$25,000 – $50,000</option>
                      <option value="$50k+">$50,000+</option>
                      <option value="Undetermined">To Be Determined</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                      Preferred Contact
                    </label>
                    <select
                      value={formData.preferred_contact}
                      onChange={(e) => setFormData({ ...formData, preferred_contact: e.target.value })}
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
                      <option value="email">Email</option>
                      <option value="phone">Phone / WhatsApp</option>
                      <option value="video_call">Video Call (Google Meet / Zoom)</option>
                    </select>
                  </div>
                </div>

                {/* Inquiry Objective */}
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
                    <option value="game_purchase">Package A: Complete Game Source Buyout</option>
                    <option value="customization">Package B: Game + Customization & Bespoke Dev</option>
                    <option value="white_label">Package C: White-Label Enterprise Edition</option>
                    <option value="b2b_licensing">B2B Non-Exclusive Web Licensing</option>
                    <option value="technical_inquiry">Technical / Engine Evaluation</option>
                    <option value="partnership">Publishing / Distribution Partnership</option>
                    <option value="other">General Commercial Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>
                    Project Requirements & Timeline *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your organization, anticipated launch timeline, deployment preferences, or specific architectural questions..."
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

      {/* 13. COMMERCIAL TRUST & TRANSPARENCY SECTION */}
      <section style={{ padding: '4.5rem 0', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="app-container" style={{ maxWidth: '820px', textAlign: 'center' }}>
          <Badge variant="cyan" size="sm" style={{ marginBottom: '1rem' }}>
            COMMERCIAL TRANSPARENCY
          </Badge>
          <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '1rem' }}>
            Direct Engineering Integrity
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            We present real technical facts and verified architectural metrics. No manufactured corporate endorsements, fake customer reviews, or unverified claims. The code you test in our browser demo is the exact code delivered in your commercial handover.
          </p>
          <div className="flex justify-center gap-6 text-xs text-gray-400 font-mono">
            <span>Direct SLA: &lt; 24h</span>
            <span>•</span>
            <span>Direct Email: {content.contact_email}</span>
            <span>•</span>
            <span>Direct Phone: {content.contact_phone}</span>
          </div>
        </div>
      </section>

      {/* 14. FOOTER & COMPREHENSIVE NAVIGATION */}
      <footer
        style={{
          padding: '4.5rem 1.5rem 2.5rem 1.5rem',
          background: 'linear-gradient(180deg, var(--bg-secondary) 0%, #03050c 100%)',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        <div className="app-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <Logo size="md" glow={true} showTagline={false} />
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginTop: '1rem' }}>
                {content.tagline}
              </p>
              <div className="mt-4 text-xs text-gray-500 font-mono">
                Version 1.0.0 Commercial Release
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Commercial</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/demo" className="hover:text-cyan-400 transition-colors">Play Buyer Demo</Link></li>
                <li><Link to="/presentation" className="hover:text-cyan-400 transition-colors">Launch Presentation Deck</Link></li>
                <li><Link to="/brochure" className="hover:text-cyan-400 transition-colors">Printable Product Brochure</Link></li>
                <li><a href="#packages" className="hover:text-cyan-400 transition-colors">Licensing Package Tiers</a></li>
                <li><a href="#inquiry" className="hover:text-cyan-400 transition-colors">Submit Commercial Inquiry</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Product & Engine</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/play" className="hover:text-cyan-400 transition-colors">Launch Full 3D Game</Link></li>
                <li><Link to="/product" className="hover:text-cyan-400 transition-colors">Technical Specifications</Link></li>
                <li><a href="#worlds" className="hover:text-cyan-400 transition-colors">The 4 Story Worlds</a></li>
                <li><a href="#gallery" className="hover:text-cyan-400 transition-colors">Screenshot Gallery</a></li>
                <li><a href="#specs" className="hover:text-cyan-400 transition-colors">Browser Requirements</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Enterprise Access</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/admin/login" className="hover:text-cyan-400 transition-colors">Admin Panel Login</Link></li>
                <li><Link to="/login" className="hover:text-cyan-400 transition-colors">Player Portal Sign In</Link></li>
                <li><Link to="/register" className="hover:text-cyan-400 transition-colors">Create Player Account</Link></li>
                <li><span className="text-gray-500">Contact: {content.contact_email}</span></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <div>
              © {new Date().getFullYear()} {content.hero_title}. All Rights Reserved. Commercial Handover Package.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <span className="text-gray-500">React 19 + Three.js + Laravel 12</span>
              <span className="text-gray-500">100% Royalty Free</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Helper icon
function LockIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
