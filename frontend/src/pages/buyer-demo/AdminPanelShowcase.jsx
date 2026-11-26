import React, { useState } from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Globe,
  Scroll,
  BarChart3,
  Mail,
  Palette,
  FileText,
  AlertTriangle,
  Lock,
  Search,
  Eye,
  Sliders,
  CheckCircle,
  Clock
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

/**
 * Admin Panel Showcase Component
 * Demonstrates the 23-module operational admin back-office suite in a secure, read-only demo mode.
 * Contains ZERO live admin credentials and prevents modification of production data.
 */
export default function AdminPanelShowcase() {
  const [activeAdminModule, setActiveAdminModule] = useState('dashboard');

  return (
    <div className="rounded-xl bg-[#070b18] border border-purple-500/30 overflow-hidden text-gray-200">
      {/* Official Required Disclaimer Banner */}
      <div className="bg-purple-950/70 border-b border-purple-500/40 px-4 py-2 flex items-center justify-between text-xs text-purple-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="font-mono font-bold tracking-wide">
            ADMIN DEMONSTRATION MODE — NO LIVE PRODUCTION MODIFICATIONS
          </span>
        </div>
        <span className="text-[11px] text-purple-300/80 hidden sm:inline">
          Least-Privilege Architectural Preview • Sandboxed Sample Data
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              23-Module Enterprise Admin Operations Console
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Full operational control over player accounts, game balance parameters, narrative missions, lead CRM, and white-label branding.
            </p>
          </div>

          {/* Module Selector */}
          <div className="flex items-center gap-1.5 flex-wrap bg-gray-900/80 p-1 rounded-lg border border-gray-800">
            {[
              { id: 'dashboard', label: 'Studio KPIs', icon: LayoutDashboard },
              { id: 'players', label: 'Player Accounts', icon: Users },
              { id: 'worlds', label: 'Game Worlds', icon: Globe },
              { id: 'leads', label: 'Lead CRM', icon: Mail },
              { id: 'branding', label: 'Branding Suite', icon: Palette }
            ].map(mod => (
              <button
                key={mod.id}
                onClick={() => setActiveAdminModule(mod.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeAdminModule === mod.id
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <mod.icon className="w-3.5 h-3.5" />
                {mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* View 1: Studio KPIs */}
        {activeAdminModule === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Total Registrations</span>
                <strong className="text-2xl text-white font-mono">1,420</strong>
                <span className="text-[10px] text-emerald-400 block mt-1">+14% this week</span>
              </div>
              <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">Active Sessions</span>
                <strong className="text-2xl text-cyan-300 font-mono">84</strong>
                <span className="text-[10px] text-gray-400 block mt-1">Live concurrency</span>
              </div>
              <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block mb-1">Campaign Completions</span>
                <strong className="text-2xl text-purple-300 font-mono">312</strong>
                <span className="text-[10px] text-purple-300 block mt-1">21.9% completion rate</span>
              </div>
              <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">Average Session</span>
                <strong className="text-2xl text-amber-300 font-mono">28.4m</strong>
                <span className="text-[10px] text-gray-400 block mt-1">Desktop & Mobile</span>
              </div>
            </div>

            {/* Simulated Ending Distribution Bar */}
            <div className="p-4 rounded-lg bg-gray-900/40 border border-gray-800">
              <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Campaign Climax Ending Choices</h4>
              <div className="flex h-3 rounded-full overflow-hidden mb-2">
                <div style={{ width: '58%' }} className="bg-cyan-500" title="Ending A: Timeline Restoration (58%)" />
                <div style={{ width: '42%' }} className="bg-purple-600" title="Ending B: Timeline Transcendence (42%)" />
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Ending A: Timeline Restoration (58%)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Ending B: Timeline Transcendence (42%)</span>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Player Accounts */}
        {activeAdminModule === 'players' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span>Sample Account Moderation Queue</span>
              <span className="text-[11px] text-purple-400 font-mono">Actions disabled in demo mode</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 bg-gray-900/40">
                    <th className="p-3">Operative ID</th>
                    <th className="p-3">Callsign</th>
                    <th className="p-3">Level / XP</th>
                    <th className="p-3">Current World</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  <tr>
                    <td className="p-3 font-mono text-gray-500">#USR-1084</td>
                    <td className="p-3 font-semibold text-white">VortexWalker</td>
                    <td className="p-3 font-mono text-cyan-300">Lvl 19 (24,100 XP)</td>
                    <td className="p-3">World 4: Final Chapter</td>
                    <td className="p-3"><Badge variant="green" size="sm">ACTIVE</Badge></td>
                    <td className="p-3 text-right"><span className="text-gray-500 text-[11px]">Inspect (Disabled)</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-gray-500">#USR-1085</td>
                    <td className="p-3 font-semibold text-white">ChronoGhost</td>
                    <td className="p-3 font-mono text-cyan-300">Lvl 12 (12,850 XP)</td>
                    <td className="p-3">World 2: Broken Present</td>
                    <td className="p-3"><Badge variant="green" size="sm">ACTIVE</Badge></td>
                    <td className="p-3 text-right"><span className="text-gray-500 text-[11px]">Inspect (Disabled)</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-gray-500">#USR-1086</td>
                    <td className="p-3 font-semibold text-white">GlitchAbuser99</td>
                    <td className="p-3 font-mono text-cyan-300">Lvl 3 (1,200 XP)</td>
                    <td className="p-3">World 1: Lost Kingdom</td>
                    <td className="p-3"><Badge variant="danger" size="sm">SUSPENDED</Badge></td>
                    <td className="p-3 text-right"><span className="text-gray-500 text-[11px]">Review Report</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 3: Game Worlds */}
        {activeAdminModule === 'worlds' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { id: 1, name: 'World 1: The Lost Kingdom', epoch: 'Past Era -840', status: 'Published', players: 412 },
              { id: 2, name: 'World 2: The Broken Present', epoch: 'Current Era 2026', status: 'Published', players: 384 },
              { id: 3, name: 'World 3: The Fractured Future', epoch: 'Future Era 2480', status: 'Published', players: 298 },
              { id: 4, name: 'Final Chapter: The Last Timeline', epoch: 'Nexus Convergence', status: 'Published', players: 312 }
            ].map(w => (
              <div key={w.id} className="p-4 rounded-lg bg-gray-900/60 border border-gray-800 flex items-center justify-between">
                <div>
                  <strong className="text-sm text-white block mb-0.5">{w.name}</strong>
                  <span className="text-[11px] text-gray-400 font-mono">{w.epoch} • {w.players} active/completed</span>
                </div>
                <Badge variant="cyan" size="sm">{w.status}</Badge>
              </div>
            ))}
          </div>
        )}

        {/* View 4: Lead CRM */}
        {activeAdminModule === 'leads' && (
          <div className="space-y-3">
            <div className="p-3 rounded bg-gray-900/60 border border-gray-800 flex justify-between items-center text-xs">
              <span className="text-gray-300">Demonstrates B2B buyer lead capture with priority triage, budget ranges, and safe CSV export.</span>
              <span className="font-mono text-cyan-400">Export CSV: Enabled in Live Admin</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 bg-gray-900/40">
                    <th className="p-3">Priority</th>
                    <th className="p-3">Prospect / Company</th>
                    <th className="p-3">Inquiry Type</th>
                    <th className="p-3">Budget Range</th>
                    <th className="p-3">Pipeline Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  <tr>
                    <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-400 border border-red-500/40">URGENT</span></td>
                    <td className="p-3 font-semibold text-white">Acme Interactive (US)</td>
                    <td className="p-3 text-cyan-300">Package A: Source Buyout</td>
                    <td className="p-3 font-mono text-purple-300">$25k-$50k</td>
                    <td className="p-3"><Badge variant="gold" size="sm">NEGOTIATION</Badge></td>
                  </tr>
                  <tr>
                    <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-500/40">HIGH</span></td>
                    <td className="p-3 font-semibold text-white">Hyperion Media (EU)</td>
                    <td className="p-3 text-cyan-300">Package C: White-Label</td>
                    <td className="p-3 font-mono text-purple-300">$50k+</td>
                    <td className="p-3"><Badge variant="purple" size="sm">IN DISCUSSION</Badge></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 5: Branding Suite */}
        {activeAdminModule === 'branding' && (
          <div className="space-y-4 text-xs">
            <p className="text-gray-400">
              The live White-Label Branding Suite (`/admin/branding`) dynamically updates CSS custom properties across the entire application without needing code compilation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Primary Brand Accent</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border border-gray-600 bg-[#00d9ff]" />
                  <span className="font-mono text-white">#00d9ff (Cyan)</span>
                </div>
              </div>
              <div className="p-3 rounded bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Secondary Theme Accent</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border border-gray-600 bg-[#7047ff]" />
                  <span className="font-mono text-white">#7047ff (Purple)</span>
                </div>
              </div>
              <div className="p-3 rounded bg-gray-900/60 border border-gray-800">
                <span className="text-gray-400 block mb-1">Highlight Gold Accent</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded border border-gray-600 bg-[#f5b942]" />
                  <span className="font-mono text-white">#f5b942 (Gold)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
