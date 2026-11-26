import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Minimize,
  Play,
  RotateCcw,
  Sparkles,
  Gamepad2,
  Globe,
  Sliders,
  Award,
  Users,
  ShieldCheck,
  BarChart3,
  Palette,
  Cpu,
  Database,
  Code2,
  Package,
  Send,
  Eye,
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Logo from '../../components/common/Logo';
import RequirementsChecker from './RequirementsChecker';
import PlayerSystemShowcase from './PlayerSystemShowcase';
import AdminPanelShowcase from './AdminPanelShowcase';
import TechnicalArchitectureShowcase from './TechnicalArchitectureShowcase';
import CustomizationDemo from './CustomizationDemo';
import api from '../../services/api';

/**
 * 16-Section Interactive Guided Product Tour
 * Designed for prospective publishers and B2B buyers with fullscreen presentation mode,
 * keyboard navigation, progress state, and live interactive feature components.
 */
export default function GuidedTour({ onExit, onLaunchPlayableDemo, onRequestQuote }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const totalSteps = 16;

  // Track session progress server-side (Zero PII)
  const trackTourStep = useCallback((stepIdx) => {
    const sessionId = sessionStorage.getItem('aervyn_buyer_demo_session') || ('tour_' + Math.random().toString(36).substring(2, 10));
    sessionStorage.setItem('aervyn_buyer_demo_session', sessionId);
    const token = sessionStorage.getItem('aervyn_buyer_demo_token');

    api.post('/buyer-demo/session/ping', {
      session_id: sessionId,
      token: token || null,
      section_id: `step_${stepIdx + 1}`,
      completed: stepIdx === totalSteps - 1
    }).catch(() => {});
  }, []);

  useEffect(() => {
    trackTourStep(currentStep);
  }, [currentStep, trackTourStep]);

  // Keyboard navigation listener (ArrowRight = Next, ArrowLeft = Prev, Escape = Exit)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        if (currentStep < totalSteps - 1) {
          setCurrentStep(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          setCurrentStep(prev => prev - 1);
        }
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (onExit) {
          onExit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, totalSteps, isFullscreen, onExit]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkipToEnd = () => {
    setCurrentStep(totalSteps - 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
  };

  // 16 Detailed Tour Content Slices
  const tourSections = [
    // 1. Product Introduction
    {
      title: '1. Product Introduction & Commercial Overview',
      subtitle: 'Native 3D browser action-adventure software package',
      render: () => (
        <div className="space-y-6">
          <div className="text-center py-6">
            <Logo size="lg" glow={true} showTagline={false} />
            <h3 className="text-2xl font-black text-white mt-4 uppercase tracking-widest">
              AERVYN: ECHOES OF TIME
            </h3>
            <p className="text-sm font-semibold text-cyan-400 font-mono mt-1">
              CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.
            </p>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto mt-4 leading-relaxed">
              A turnkey, production-grade 3D time-travel adventure game engineered to run natively inside standard web browsers without downloads, native client wrappers, or app store distribution friction.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
              <span className="text-xs text-gray-400 block mb-1">Architecture</span>
              <strong className="text-sm text-cyan-300">React 19 + Laravel 12</strong>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
              <span className="text-xs text-gray-400 block mb-1">3D Engine</span>
              <strong className="text-sm text-purple-300">Three.js / R3F</strong>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
              <span className="text-xs text-gray-400 block mb-1">Performance</span>
              <strong className="text-sm text-emerald-300">Target 60 FPS</strong>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
              <span className="text-xs text-gray-400 block mb-1">Commercial Rights</span>
              <strong className="text-sm text-amber-300">100% Royalty-Free</strong>
            </div>
          </div>
        </div>
      )
    },

    // 2. Game Story
    {
      title: '2. Narrative Campaign: The Fractured Continuum',
      subtitle: 'Story premise, temporal crisis, and chronological progression',
      render: () => (
        <div className="space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            When an ancient temporal catalyst—the <strong>Chrono Keystone</strong>—shattered into chronological fragments, the linear timeline fractured. The player is chosen as the timeline voyager to traverse collapsed historical eras, solve environmental puzzles, and face <strong>The Chronarch</strong> at the cosmic nexus.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
              <strong className="text-cyan-400 block mb-1">The Ancient Origin</strong>
              <p className="text-xs text-gray-400 leading-relaxed">
                World 1 reveals the lost civilization that originally harnessed chronological energy through runic dial mechanisms.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-500/20">
              <strong className="text-purple-400 block mb-1">The Broken Present</strong>
              <p className="text-xs text-gray-400 leading-relaxed">
                World 2 presents our modern metropolis shattered mid-collapse under seismic temporal tremors and flooded streets.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
              <strong className="text-emerald-400 block mb-1">The Fractured Future</strong>
              <p className="text-xs text-gray-400 leading-relaxed">
                World 3 tests spatial reflexes across floating cybernetic energy platforms and rogue automated security grids.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // 3. Game Worlds Explorer
    {
      title: '3. The 4 Dynamic Story Worlds',
      subtitle: 'Distinct atmospheric shaders, palettes, and level designs',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/30">
            <div className="flex justify-between items-center mb-1">
              <strong className="text-sm text-cyan-300">World 1: The Lost Kingdom</strong>
              <span className="font-mono text-cyan-400">Past -840</span>
            </div>
            <p className="text-gray-300 mb-2 leading-relaxed">
              Golden sandstone temples, sacred obelisks, and ancient clockwork dial mechanisms.
            </p>
            <span className="text-[11px] text-gray-400 font-mono">Highlights: Chrono Gauntlet, jumping stone steps, gate activation.</span>
          </div>

          <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-500/30">
            <div className="flex justify-between items-center mb-1">
              <strong className="text-sm text-amber-300">World 2: The Broken Present</strong>
              <span className="font-mono text-amber-400">Current 2026</span>
            </div>
            <p className="text-gray-300 mb-2 leading-relaxed">
              Collapsed urban overpasses, electrified puddles, and flickering holographic billboards.
            </p>
            <span className="text-[11px] text-gray-400 font-mono">Highlights: Circuit breaker alignment, environmental hazard avoidance.</span>
          </div>

          <div className="p-4 rounded-lg bg-purple-950/30 border border-purple-500/30">
            <div className="flex justify-between items-center mb-1">
              <strong className="text-sm text-purple-300">World 3: The Fractured Future</strong>
              <span className="font-mono text-purple-400">Future 2480</span>
            </div>
            <p className="text-gray-300 mb-2 leading-relaxed">
              Neon cyber platforms, quantum frequency barriers, and security sentries.
            </p>
            <span className="text-[11px] text-gray-400 font-mono">Highlights: Laser node alignment, anti-gravity platforming.</span>
          </div>

          <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
            <div className="flex justify-between items-center mb-1">
              <strong className="text-sm text-emerald-300">Final Chapter: The Last Timeline</strong>
              <span className="font-mono text-emerald-400">Nexus Horizon</span>
            </div>
            <p className="text-gray-300 mb-2 leading-relaxed">
              Floating celestial platforms at the convergence point of all timelines.
            </p>
            <span className="text-[11px] text-gray-400 font-mono">Highlights: Multi-phase Chronarch boss fight with Dual Narrative Endings.</span>
          </div>
        </div>
      )
    },

    // 4. Gameplay Mechanics
    {
      title: '4. 8 Production-Grade Gameplay Mechanics',
      subtitle: 'Engineered for smooth WASD keyboard, mouse orbit, and mobile touch',
      render: () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { title: 'Locomotion', desc: 'Fluid WASD, sprint velocity, physics gravity, and platform jumping.' },
            { title: 'Dynamic Camera', desc: 'Smooth third-person orbit tracking with collision clipping prevention.' },
            { title: 'Interactive Puzzles', desc: 'Runic dial alignment, power circuit junctions, quantum frequencies.' },
            { title: 'Collectibles', desc: 'Chrono Shards, keystones, and lore codex logs rewarding XP.' },
            { title: 'Boss Encounters', desc: 'Telegraphed cosmic shockwaves, shield phases, and vulnerability windows.' },
            { title: 'Cloud Persistence', desc: 'Automatic REST checkpoint synchronization to MySQL.' },
            { title: 'Web Audio Synth', desc: 'Dynamic procedural soundscapes without external audio bloat.' },
            { title: 'Cross-Device', desc: 'Responsive canvas scaling from smartphone touchscreens to 4K displays.' }
          ].map((m, idx) => (
            <div key={idx} className="p-3 bg-gray-900/60 rounded border border-gray-800">
              <strong className="text-cyan-400 block mb-1 font-bold">{m.title}</strong>
              <p className="text-gray-400 text-[11px] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      )
    },

    // 5. Time Travel System
    {
      title: '5. Dynamic Spacetime Shifting Engine',
      subtitle: 'Real-time portal transitions and cause-and-effect puzzles',
      render: () => (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-gray-300 leading-relaxed">
            A core technical differentiator: The game engine morphs environments dynamically as the player steps through temporal rifts without loading screens.
          </p>
          <div className="p-4 rounded-lg bg-gray-900/70 border border-purple-500/30 flex flex-col md:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-purple-300 flex-shrink-0">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <strong className="text-sm text-white block mb-1">Dual Campaign Climax Endings</strong>
              <p className="text-gray-300 leading-relaxed">
                After defeating The Chronarch, players make a defining choice: <strong>Ending A (Timeline Restoration)</strong> seals the portals to restore linear chronology, while <strong>Ending B (Timeline Transcendence)</strong> grants the player eternal multidimensional oversight.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // 6. Player Dashboard Showcase
    {
      title: '6. Player Dashboard & Progression Portal',
      subtitle: 'Read-only preview with isolated sample statistics (Zero PII)',
      render: () => (
        <PlayerSystemShowcase />
      )
    },

    // 7. Achievements & Gamification
    {
      title: '7. Gamification: 16 Achievements & XP Ranks',
      subtitle: 'Retention-driving progression mechanics with server-verified claims',
      render: () => (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-gray-300 leading-relaxed">
            The progression engine ties in-game exploration directly to persistent database awards. Achievements prevent duplicate claims via unique composite database constraints.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded bg-gray-900/60 border border-gray-800">
              <span className="text-[10px] text-cyan-400 font-mono uppercase block mb-1">Level Balancing</span>
              <strong className="text-white block mb-1">Adaptive XP Curves</strong>
              <p className="text-gray-400 text-[11px]">Levels scale progressively to maintain player engagement throughout the narrative campaign.</p>
            </div>
            <div className="p-4 rounded bg-gray-900/60 border border-gray-800">
              <span className="text-[10px] text-purple-400 font-mono uppercase block mb-1">Medal Rarities</span>
              <strong className="text-white block mb-1">Common, Rare & Epic</strong>
              <p className="text-gray-400 text-[11px]">Reward tiers incentivize puzzle completion, speedrunning, and thorough codex discovery.</p>
            </div>
            <div className="p-4 rounded bg-gray-900/60 border border-gray-800">
              <span className="text-[10px] text-amber-400 font-mono uppercase block mb-1">Speedrun Tracking</span>
              <strong className="text-white block mb-1">Competitive Milestones</strong>
              <p className="text-gray-400 text-[11px]">Milliseconds-precise checkpoint tracking drives replayability on public leaderboards.</p>
            </div>
          </div>
        </div>
      )
    },

    // 8. Social Features
    {
      title: '8. Online Social Hub & Community Layer',
      subtitle: 'Asynchronous challenges, friends roster, and player search',
      render: () => (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-gray-300 leading-relaxed">
            The social layer allows operators to foster a thriving community without requiring expensive real-time multiplayer networking server farms:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-gray-900/60 rounded border border-gray-800">
              <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
              <strong className="text-white block">Friends Roster</strong>
              <span className="text-[10px] text-gray-400">Request & accept flow</span>
            </div>
            <div className="p-3 bg-gray-900/60 rounded border border-gray-800">
              <Award className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
              <strong className="text-white block">Async Challenges</strong>
              <span className="text-[10px] text-gray-400">Time-trial duels</span>
            </div>
            <div className="p-3 bg-gray-900/60 rounded border border-gray-800">
              <Globe className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <strong className="text-white block">Global Rankings</strong>
              <span className="text-[10px] text-gray-400">Friends-only filter</span>
            </div>
            <div className="p-3 bg-gray-900/60 rounded border border-gray-800">
              <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <strong className="text-white block">Safe Moderation</strong>
              <span className="text-[10px] text-gray-400">Block & report queues</span>
            </div>
          </div>
        </div>
      )
    },

    // 9. Admin Panel Showcase
    {
      title: '9. 23-Module Enterprise Admin Suite',
      subtitle: 'Complete back-office control with sandboxed least-privilege preview',
      render: () => (
        <AdminPanelShowcase />
      )
    },

    // 10. Analytics
    {
      title: '10. Session Telemetry & Business Analytics',
      subtitle: 'Zero-PII gameplay metrics, completion funnels, and hardware insights',
      render: () => (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-gray-300 leading-relaxed">
            Built-in analytics track player health, device pixel ratios, retention drop-off per world, and commercial demo conversion funnels without collecting personal user PII.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded bg-gray-900/60 border border-gray-800">
              <BarChart3 className="w-5 h-5 text-cyan-400 mb-2" />
              <strong className="text-white block mb-1">Conversion Funnels</strong>
              <p className="text-gray-400 text-[11px]">Tracks start-to-finish demo slice completion rates and milestone drop-off points.</p>
            </div>
            <div className="p-4 rounded bg-gray-900/60 border border-gray-800">
              <Cpu className="w-5 h-5 text-purple-400 mb-2" />
              <strong className="text-white block mb-1">Hardware Telemetry</strong>
              <p className="text-gray-400 text-[11px]">Aggregates GPU vendors, device pixel ratios, and mobile vs desktop traffic splits.</p>
            </div>
            <div className="p-4 rounded bg-gray-900/60 border border-gray-800">
              <Clock className="w-5 h-5 text-emerald-400 mb-2" />
              <strong className="text-white block mb-1">Playtime Metrics</strong>
              <p className="text-gray-400 text-[11px]">Detailed breakdown of minutes spent per world, puzzle solve durations, and death counts.</p>
            </div>
          </div>
        </div>
      )
    },

    // 11. Customization Simulator
    {
      title: '11. Interactive White-Label & Reskin Simulator',
      subtitle: 'Test live branding, colors, and game title changes client-side',
      render: () => (
        <CustomizationDemo onRequestCustomization={onRequestQuote} />
      )
    },

    // 12. White-Label Foundation
    {
      title: '12. White-Label Architecture & Sub-Licensing',
      subtitle: 'How dynamic CSS theming enables instant brand re-skinning',
      render: () => (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-gray-300 leading-relaxed">
            The frontend uses a centralized <strong>BrandingContext</strong> that injects dynamic CSS variables into the root DOM. Operators can swap logos, color hex codes, and typography without touching build scripts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-900/80 border border-cyan-500/30">
              <Badge variant="cyan" size="sm" className="mb-2">AERVYN FACTORY IDENTITY</Badge>
              <h5 className="font-bold text-white text-sm mb-1">AERVYN: ECHOES OF TIME</h5>
              <p className="text-gray-400 text-[11px] mb-3">Official default styling with deep space blues, neon cyan accents, and temporal purple glows.</p>
              <span className="text-[10px] font-mono text-cyan-400">Protected Core Brand Asset</span>
            </div>

            <div className="p-4 rounded-lg bg-gray-900/80 border border-emerald-500/30">
              <Badge variant="green" size="sm" className="mb-2">BUYER CUSTOM RE-SKIN</Badge>
              <h5 className="font-bold text-white text-sm mb-1">YOUR BRAND IDENTITY</h5>
              <p className="text-gray-400 text-[11px] mb-3">Full customization of primary, secondary, and accent colors with your corporate logo and copyright.</p>
              <span className="text-[10px] font-mono text-emerald-400">100% White-Label Capable</span>
            </div>
          </div>
        </div>
      )
    },

    // 13. Technical Architecture Showcase
    {
      title: '13. Full-Stack Technical Architecture',
      subtitle: 'React 19 + Three.js + Laravel 12 + MySQL verified pipeline',
      render: () => (
        <TechnicalArchitectureShowcase />
      )
    },

    // 14. Installation & Deployment
    {
      title: '14. Automated Installation & Server Deployment',
      subtitle: 'Turnkey scripts for Linux/Ubuntu, Nginx, Apache, and Windows Server',
      render: () => (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-gray-300 leading-relaxed">
            The commercial handover package includes battle-tested automated setup scripts and production server configuration templates:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-900/60 rounded border border-gray-800">
              <span className="font-mono text-cyan-400 block mb-1">scripts/install-linux.sh</span>
              <p className="text-gray-400 text-[11px]">One-click Ubuntu 22.04+ installer for PHP 8.2, Composer, Node.js, and MySQL.</p>
            </div>
            <div className="p-3 bg-gray-900/60 rounded border border-gray-800">
              <span className="font-mono text-purple-400 block mb-1">scripts/install-windows.bat</span>
              <p className="text-gray-400 text-[11px]">Automated Windows development and staging deployment script.</p>
            </div>
            <div className="p-3 bg-gray-900/60 rounded border border-gray-800">
              <span className="font-mono text-emerald-400 block mb-1">deployment/nginx/</span>
              <p className="text-gray-400 text-[11px]">Production Nginx config with Gzip, SSL termination, and security headers.</p>
            </div>
          </div>
        </div>
      )
    },

    // 15. Commercial Packages
    {
      title: '15. Commercial Licensing Packages & Rights',
      subtitle: 'Zero ongoing royalties, full source ownership, and transparent options',
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-gray-900/70 border border-cyan-500/30">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">PACKAGE A</span>
            <strong className="text-base text-white block mb-1">Complete Game</strong>
            <p className="text-gray-400 text-[11px] mb-3">Full source code for frontend, backend, 4 worlds, and 23 admin modules.</p>
            <span className="text-sm font-black text-cyan-300 font-mono">Contact for Quote</span>
          </div>

          <div className="p-4 rounded-lg bg-gray-900/70 border border-purple-500/40 relative">
            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block mb-1">PACKAGE B</span>
            <strong className="text-base text-white block mb-1">Game + Customization</strong>
            <p className="text-gray-400 text-[11px] mb-3">Full source plus 40 hours of dedicated senior dev hours for custom mechanics.</p>
            <span className="text-sm font-black text-purple-300 font-mono">Contact for Quote</span>
          </div>

          <div className="p-4 rounded-lg bg-gray-900/70 border border-amber-500/30">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">PACKAGE C</span>
            <strong className="text-base text-white block mb-1">White-Label Edition</strong>
            <p className="text-gray-400 text-[11px] mb-3">Unrestricted white-label commercial distribution rights and multi-tenant setup.</p>
            <span className="text-sm font-black text-amber-300 font-mono">Contact for Quote</span>
          </div>
        </div>
      )
    },

    // 16. Contact & Next Steps
    {
      title: '16. Commercial Acquisition & Next Steps',
      subtitle: 'Direct commercial engineering engagement with < 24h SLA',
      render: () => (
        <div className="space-y-6 text-center py-4">
          <div className="max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Thank You for Exploring AERVYN: Echoes of Time
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              You have completed the full guided product walkthrough. To initiate a commercial acquisition discussion, request custom level commissioning, or evaluate live code access:
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="cyan"
                size="md"
                icon={Send}
                onClick={onRequestQuote}
              >
                Request a Quote / Full Source Package
              </Button>
              {onLaunchPlayableDemo && (
                <Button
                  variant="outline"
                  size="md"
                  icon={Play}
                  onClick={onLaunchPlayableDemo}
                >
                  Play Interactive 3D Sandbox Slice
                </Button>
              )}
            </div>

            <p className="text-[11px] text-gray-500 mt-6 font-mono">
              Direct Inquiries: sales@aervyn-game.com • SLA Response: &lt; 24 Business Hours
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentSection = tourSections[currentStep];

  return (
    <div className={`flex flex-col justify-between bg-[#050814] text-gray-200 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'min-h-[640px]'
    }`}>
      {/* Top Guided Tour Bar */}
      <div className="px-6 py-4 bg-[#090e1e] border-b border-gray-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={false} />
          <div>
            <h4 className="text-sm font-bold text-white tracking-wider uppercase">
              AERVYN Guided Product Tour
            </h4>
            <span className="text-[11px] text-cyan-400 font-mono">
              Step {currentStep + 1} of {totalSteps}: {currentSection.title}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Reduced Motion Toggle */}
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            title="Toggle Reduced Motion"
            className={`px-2 py-1 rounded text-[11px] font-mono transition-colors border ${
              reducedMotion
                ? 'bg-cyan-950 border-cyan-500/40 text-cyan-300'
                : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            {reducedMotion ? 'Reduced Motion' : 'Motion: On'}
          </button>

          {/* Fullscreen Presentation Mode Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Presentation Mode (Esc)' : 'Enter Presentation Mode'}
            className="p-1.5 rounded bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Exit Tour Button */}
          {onExit && (
            <button
              onClick={onExit}
              title="Exit Tour"
              className="p-1.5 rounded bg-gray-900 border border-gray-800 text-gray-400 hover:text-rose-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1 bg-gray-900">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Main Slide Content Area */}
      <div className={`p-6 sm:p-8 flex-1 overflow-y-auto ${reducedMotion ? '' : 'transition-opacity duration-300'}`}>
        <div className="mb-6">
          <Badge variant="cyan" size="sm" className="mb-1 font-mono">
            SECTION {currentStep + 1} OF {totalSteps}
          </Badge>
          <h2 className="text-2xl font-black text-white mt-1">
            {currentSection.title}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {currentSection.subtitle}
          </p>
        </div>

        {/* Dynamic Section Content */}
        <div className="min-h-[340px]">
          {currentSection.render()}
        </div>
      </div>

      {/* Bottom Navigation Control Bar */}
      <div className="px-6 py-4 bg-[#080d1a] border-t border-gray-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={ChevronLeft}
            disabled={currentStep === 0}
            onClick={handlePrev}
            className="text-xs"
          >
            Previous
          </Button>

          <Button
            variant="cyan"
            size="sm"
            disabled={currentStep === totalSteps - 1}
            onClick={handleNext}
            className="text-xs flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Direct Step Indicator Dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {tourSections.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-cyan-400 w-5'
                  : idx < currentStep
                  ? 'bg-cyan-700/60 hover:bg-cyan-600'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
              title={`Jump to Section ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={handleRestart}
              className="text-xs text-gray-400"
            >
              Restart
            </Button>
          )}

          {currentStep < totalSteps - 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSkipToEnd}
              className="text-xs text-gray-400"
            >
              Skip to Quote
            </Button>
          ) : (
            <Button
              variant="cyan"
              size="sm"
              icon={Send}
              onClick={onRequestQuote}
              className="text-xs"
            >
              Request Quotation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
