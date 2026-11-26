import React from 'react';
import { Link } from 'react-router-dom';
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle,
  Shield,
  Layers,
  Sparkles,
  Cpu,
  Monitor,
  Mail,
  Gamepad2,
  Clock,
  Award,
  Globe,
  Database,
  ExternalLink
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useBranding } from '../../context/BrandingContext';

/**
 * Commercial Web-Based Product Brochure Page (/brochure)
 * Formatted for both on-screen executive evaluation and crisp browser-native printing / PDF generation (window.print()).
 */
export default function ProductBrochurePage() {
  const { branding } = useBranding();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#060913] text-gray-200 print:bg-white print:text-gray-900 font-sans transition-colors selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Floating Action Bar (Hidden on Print) */}
      <div className="sticky top-0 z-50 bg-[#090d1a]/95 backdrop-blur-md border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between print:hidden shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Site
          </Link>
          <span className="text-gray-600">|</span>
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
            Official B2B Commercial Product Brochure
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/presentation">
            <Button variant="ghost" size="sm" className="text-xs border border-purple-500/30 text-purple-300">
              Launch Presentation Deck
            </Button>
          </Link>
          <Link to="/demo">
            <Button variant="secondary" size="sm" className="text-xs">
              Play Live Demo
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2 text-xs bg-cyan-600 hover:bg-cyan-500"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Brochure Document Container */}
      <div className="max-w-4xl mx-auto px-6 py-10 print:p-0 print:max-w-none">
        
        {/* Cover / Header Section */}
        <header className="border-b border-cyan-500/20 pb-8 mb-10 print:border-gray-300 print:pb-6 print:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Logo size="md" showText={false} />
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-white print:text-gray-950 uppercase">
                    {branding.gameTitle || 'AERVYN: ECHOES OF TIME'}
                  </h1>
                  <p className="text-xs tracking-widest text-cyan-400 print:text-cyan-700 uppercase font-semibold">
                    {branding.tagline || 'CHANGE THE PAST. SURVIVE THE PRESENT. DISCOVER THE FUTURE.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-left md:text-right print:text-right">
              <span className="inline-block px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 print:border-gray-400 print:text-gray-800 text-xs font-mono mb-1">
                COMMERCIAL SPECIFICATION v1.0
              </span>
              <p className="text-xs text-gray-400 print:text-gray-600">
                Single-Player 3D Action-Adventure Commercial Package
              </p>
            </div>
          </div>
        </header>

        {/* 1. Executive Summary */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-xl font-bold text-white print:text-gray-900 mb-3 flex items-center gap-2 border-l-4 border-cyan-500 pl-3">
            1. Executive Product Overview
          </h2>
          <p className="text-sm leading-relaxed text-gray-300 print:text-gray-700 mb-4">
            <strong className="text-white print:text-gray-900">{branding.gameTitle || 'AERVYN: ECHOES OF TIME'}</strong> is a turnkey, production-grade 3D time-travel action adventure engineered for direct browser execution. Built with React 19, Three.js, React Three Fiber, and a high-throughput Laravel 12 API backend, AERVYN delivers native desktop-tier 3D gaming directly in web browsers with <strong>zero client downloads, zero plugins, and zero installation friction</strong>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-gray-900/60 border border-cyan-500/20 print:border-gray-300 print:bg-gray-50">
              <span className="text-xs text-gray-400 print:text-gray-600 uppercase tracking-wider block mb-1">Engine</span>
              <span className="text-base font-bold text-cyan-400 print:text-cyan-800">Three.js / R3F</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/60 border border-cyan-500/20 print:border-gray-300 print:bg-gray-50">
              <span className="text-xs text-gray-400 print:text-gray-600 uppercase tracking-wider block mb-1">Backend</span>
              <span className="text-base font-bold text-purple-400 print:text-purple-800">Laravel 12 + Sanctum</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/60 border border-cyan-500/20 print:border-gray-300 print:bg-gray-50">
              <span className="text-xs text-gray-400 print:text-gray-600 uppercase tracking-wider block mb-1">Target FPS</span>
              <span className="text-base font-bold text-emerald-400 print:text-emerald-800">60 FPS Smooth</span>
            </div>
            <div className="p-4 rounded-lg bg-gray-900/60 border border-cyan-500/20 print:border-gray-300 print:bg-gray-50">
              <span className="text-xs text-gray-400 print:text-gray-600 uppercase tracking-wider block mb-1">Admin Modules</span>
              <span className="text-base font-bold text-amber-400 print:text-amber-800">23 Full Suites</span>
            </div>
          </div>
        </section>

        {/* 2. The 4 Story Worlds */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <h2 className="text-xl font-bold text-white print:text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-cyan-500 pl-3">
            2. The 4 Dynamic Story Worlds
          </h2>
          <p className="text-sm text-gray-300 print:text-gray-700 mb-6">
            The narrative campaign spans 4 chronologically distinct environments, each rendered with unique 3D atmospheric shaders, lighting palettes, and mechanic layers:
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0c1222] border border-cyan-500/20 print:border-gray-300 print:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-cyan-300 print:text-cyan-900 text-base">World 1: The Lost Kingdom</h3>
                <span className="text-xs font-mono text-cyan-400/80 print:text-gray-600">Era: Ancient Past</span>
              </div>
              <p className="text-xs text-gray-300 print:text-gray-700 leading-relaxed">
                Golden sandstone temples, sacred obelisks, and ancient clockwork mechanisms. Introduces the Chrono Gauntlet, basic platforming, energy crystal collection, and temporal gateway activation.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0c1222] border border-cyan-500/20 print:border-gray-300 print:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-purple-300 print:text-purple-900 text-base">World 2: The Broken Present</h3>
                <span className="text-xs font-mono text-purple-400/80 print:text-gray-600">Era: Fractured Present</span>
              </div>
              <p className="text-xs text-gray-300 print:text-gray-700 leading-relaxed">
                A shattered metropolis caught in mid-collapse. Neon signs flicker amidst frozen gravity fields, concrete debris fields, and timeline distortion tears requiring agile spatial navigation.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0c1222] border border-cyan-500/20 print:border-gray-300 print:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-emerald-300 print:text-emerald-900 text-base">World 3: The Fractured Future</h3>
                <span className="text-xs font-mono text-emerald-400/80 print:text-gray-600">Era: Synthetic Future</span>
              </div>
              <p className="text-xs text-gray-300 print:text-gray-700 leading-relaxed">
                A hyper-advanced synthetic megastructure overrun by rogue temporal AI. Laser security grids, anti-gravity bridges, holographic data terminals, and corrupted autonomous sentries.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#0c1222] border border-cyan-500/20 print:border-gray-300 print:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-amber-300 print:text-amber-900 text-base">Final Chapter: The Last Timeline</h3>
                <span className="text-xs font-mono text-amber-400/80 print:text-gray-600">Era: Temporal Nexus</span>
              </div>
              <p className="text-xs text-gray-300 print:text-gray-700 leading-relaxed">
                The cosmic nexus where all timelines converge. The player faces the Temporal Titan guardian and chooses between Dual Story Endings: Timeline Restoration or Timeline Transcendence.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Core Technical Architecture */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-xl font-bold text-white print:text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-cyan-500 pl-3">
            3. Technical Architecture & Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 print:text-cyan-800 mb-2">
                3D Client Engine (Frontend)
              </h3>
              <ul className="space-y-2 text-xs text-gray-300 print:text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 print:text-gray-600" />
                  <span><strong>React 19 + Three.js + R3F:</strong> Declarative, high-performance canvas rendering.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 print:text-gray-600" />
                  <span><strong>GSAP Animation Suite:</strong> Cinematic camera transitions and portal sequences.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 print:text-gray-600" />
                  <span><strong>Web Audio Synthesizer:</strong> Dynamic sci-fi sound effects and spatial ambience without external audio bloat.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 print:text-gray-600" />
                  <span><strong>Production Footprint:</strong> Zero heavy external assets required to boot; sub-500kB gzip build.</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 print:text-purple-800 mb-2">
                Backend API & Data Layer
              </h3>
              <ul className="space-y-2 text-xs text-gray-300 print:text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5 print:text-gray-600" />
                  <span><strong>Laravel 12 Framework:</strong> Enterprise PHP foundation with clean MVC architecture.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5 print:text-gray-600" />
                  <span><strong>Laravel Sanctum Authentication:</strong> Token-based security with brute-force rate limiting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5 print:text-gray-600" />
                  <span><strong>MySQL 8.0+ Database:</strong> Relational schema with indexed queries and full data integrity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5 print:text-gray-600" />
                  <span><strong>Automated Test Coverage:</strong> 59+ PHPUnit tests passing 1,170+ assertions.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Complete Admin & CRM Suite */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <h2 className="text-xl font-bold text-white print:text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-cyan-500 pl-3">
            4. Enterprise Admin Suite (23 Modules)
          </h2>
          <p className="text-sm text-gray-300 print:text-gray-700 mb-4">
            A complete operational backend enables publishers, studios, and operators to manage all game parameters without editing raw code:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-gray-900/40 border border-gray-800 print:border-gray-200 rounded">
              <strong className="text-white print:text-gray-900 block mb-1">Player Management</strong>
              <span className="text-gray-400 print:text-gray-600">Ban/unban, XP adjustment, profile moderation.</span>
            </div>
            <div className="p-3 bg-gray-900/40 border border-gray-800 print:border-gray-200 rounded">
              <strong className="text-white print:text-gray-900 block mb-1">World & Mission Tuning</strong>
              <span className="text-gray-400 print:text-gray-600">Toggle worlds, unlock requirements, quest targets.</span>
            </div>
            <div className="p-3 bg-gray-900/40 border border-gray-800 print:border-gray-200 rounded">
              <strong className="text-white print:text-gray-900 block mb-1">Lead CRM & Funnel</strong>
              <span className="text-gray-400 print:text-gray-600">Priority triage, follow-up calendar, safe CSV export.</span>
            </div>
            <div className="p-3 bg-gray-900/40 border border-gray-800 print:border-gray-200 rounded">
              <strong className="text-white print:text-gray-900 block mb-1">White-Label Branding</strong>
              <span className="text-gray-400 print:text-gray-600">Live logo, color palettes, product name reskin.</span>
            </div>
            <div className="p-3 bg-gray-900/40 border border-gray-800 print:border-gray-200 rounded">
              <strong className="text-white print:text-gray-900 block mb-1">Product Content CMS</strong>
              <span className="text-gray-400 print:text-gray-600">Edit landing copy, taglines, and marketing packages.</span>
            </div>
            <div className="p-3 bg-gray-900/40 border border-gray-800 print:border-gray-200 rounded">
              <strong className="text-white print:text-gray-900 block mb-1">Analytics & Telemetry</strong>
              <span className="text-gray-400 print:text-gray-600">Session lengths, conversion funnels, zero-PII metrics.</span>
            </div>
          </div>
        </section>

        {/* 5. Commercial Packages & Deliverables */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-xl font-bold text-white print:text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-cyan-500 pl-3">
            5. Commercial Package Options
          </h2>
          <div className="border border-cyan-500/20 print:border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-900/80 print:bg-gray-100 text-gray-300 print:text-gray-700 border-b border-gray-800 print:border-gray-300">
                  <th className="p-3 font-bold">Deliverable / Capability</th>
                  <th className="p-3 font-bold text-center text-cyan-400 print:text-cyan-800">Package A (Standard)</th>
                  <th className="p-3 font-bold text-center text-purple-400 print:text-purple-800">Package B (Custom)</th>
                  <th className="p-3 font-bold text-center text-amber-400 print:text-amber-800">Package C (White-Label)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 print:divide-gray-200 text-gray-300 print:text-gray-700">
                <tr>
                  <td className="p-3">Full Source Code (Frontend & Backend)</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-3">All 4 Story Worlds & Dual Endings</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-3">23 Admin Modules & CRM Suite</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                  <td className="p-3 text-center text-emerald-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-3">White-Label Branding Engine</td>
                  <td className="p-3 text-center text-gray-500">—</td>
                  <td className="p-3 text-center text-emerald-400">Assisted</td>
                  <td className="p-3 text-center text-emerald-400">Full & Unrestricted</td>
                </tr>
                <tr>
                  <td className="p-3">Deployment Scripts (Linux/Windows)</td>
                  <td className="p-3 text-center text-emerald-400">Included</td>
                  <td className="p-3 text-center text-emerald-400">Included</td>
                  <td className="p-3 text-center text-emerald-400">Custom Setup Assisted</td>
                </tr>
                <tr>
                  <td className="p-3">Ongoing Royalties / Per-Seat Fees</td>
                  <td className="p-3 text-center font-bold text-emerald-400">$0 (100% Royalty Free)</td>
                  <td className="p-3 text-center font-bold text-emerald-400">$0 (100% Royalty Free)</td>
                  <td className="p-3 text-center font-bold text-emerald-400">$0 (100% Royalty Free)</td>
                </tr>
                <tr>
                  <td className="p-3">Pricing Structure</td>
                  <td className="p-3 text-center font-mono font-bold text-cyan-300 print:text-gray-900">Contact for Quote</td>
                  <td className="p-3 text-center font-mono font-bold text-purple-300 print:text-gray-900">Contact for Quote</td>
                  <td className="p-3 text-center font-mono font-bold text-amber-300 print:text-gray-900">Contact for Quote</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. System Requirements */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-xl font-bold text-white print:text-gray-900 mb-4 flex items-center gap-2 border-l-4 border-cyan-500 pl-3">
            6. System Requirements & Hosting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-gray-900/30 border border-gray-800 print:border-gray-300 rounded">
              <h3 className="font-bold text-white print:text-gray-900 mb-2">Server Specifications</h3>
              <ul className="space-y-1 text-gray-400 print:text-gray-600">
                <li>• <strong>OS:</strong> Ubuntu 22.04+ LTS, Debian, or Windows Server</li>
                <li>• <strong>PHP:</strong> 8.2+ with PDO, BCMath, OpenSSL, Ctype</li>
                <li>• <strong>Database:</strong> MySQL 8.0+ or MariaDB 10.5+</li>
                <li>• <strong>Web Server:</strong> Nginx or Apache with URL rewrite support</li>
                <li>• <strong>Node.js:</strong> v18+ for compiling client bundles</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-900/30 border border-gray-800 print:border-gray-300 rounded">
              <h3 className="font-bold text-white print:text-gray-900 mb-2">Client Browser Compatibility</h3>
              <ul className="space-y-1 text-gray-400 print:text-gray-600">
                <li>• <strong>Desktop:</strong> Chrome 90+, Edge 90+, Firefox 88+, Safari 15+</li>
                <li>• <strong>Mobile / Tablet:</strong> iOS Safari, Chrome Android (WebGL 2.0)</li>
                <li>• <strong>Graphics:</strong> Any standard integrated or dedicated GPU</li>
                <li>• <strong>Network:</strong> Normal broadband or 4G/5G mobile connection</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. Commercial Contact & Inquiries */}
        <footer className="border-t border-cyan-500/20 pt-8 print:border-gray-300 print:pt-6">
          <div className="p-6 rounded-lg bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-blue-950/40 border border-cyan-500/30 print:bg-gray-100 print:border-gray-400">
            <h3 className="text-base font-bold text-white print:text-gray-900 mb-2">
              Commercial Acquisition & Licensing Inquiries
            </h3>
            <p className="text-xs text-gray-300 print:text-gray-700 mb-4 leading-relaxed">
              To request full source access, arrange a private technical demonstration, or obtain licensing quotes, contact our commercial development team:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div>Email: <strong className="text-cyan-400 print:text-cyan-800">sales@aervyn-game.com</strong></div>
                <div>Turnaround: <span className="text-gray-400 print:text-gray-600">Responses within 24 business hours</span></div>
              </div>
              <div className="print:hidden flex items-center gap-2">
                <Link to="/#inquiry">
                  <Button variant="primary" size="sm" className="text-xs bg-cyan-600 hover:bg-cyan-500">
                    Submit In-App Inquiry
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-500 print:text-gray-600 text-xs">
            © {new Date().getFullYear()} {branding.gameTitle || 'AERVYN: ECHOES OF TIME'}. All Rights Reserved. Commercial Handover Specification.
          </div>
        </footer>

      </div>
    </div>
  );
}
