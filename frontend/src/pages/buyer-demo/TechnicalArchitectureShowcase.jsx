import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Layers,
  Server,
  Code2,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import Badge from '../../components/common/Badge';

/**
 * Technical Architecture & Database Showcase Component
 * Clear technical diagram and documentation of the real React 19 + Three.js + Laravel 12 stack.
 * Zero invented services; zero sensitive secrets or credentials displayed.
 */
export default function TechnicalArchitectureShowcase() {
  const [activeTechTab, setActiveTechTab] = useState('diagram');

  return (
    <div className="rounded-xl bg-[#090e1c] border border-cyan-500/30 overflow-hidden text-gray-200">
      <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Technical Architecture & Engineering Stack
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Production-proven, web-first engineering stack built entirely on open, permissive, standard technologies.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-gray-900/80 p-1 rounded-lg border border-gray-800">
          {[
            { id: 'diagram', label: 'Architecture Flow', icon: Layers },
            { id: 'database', label: 'Database Schema', icon: Database },
            { id: 'apis', label: 'API Endpoints', icon: Code2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTechTab(tab.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTechTab === tab.id
                  ? 'bg-cyan-500 text-black shadow-sm shadow-cyan-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Tab 1: Architecture Flow Diagram */}
        {activeTechTab === 'diagram' && (
          <div className="space-y-6">
            {/* 3D Engine Flow */}
            <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                1. 3D Real-Time Gameplay Client Pipeline
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-[#0d152b] rounded border border-cyan-500/20">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1">Layer 1</span>
                  <strong className="text-white block">React 19 + Vite</strong>
                  <span className="text-[11px] text-gray-400">UI overlay & state</span>
                </div>
                <div className="p-3 bg-[#0d152b] rounded border border-cyan-500/20">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1">Layer 2</span>
                  <strong className="text-cyan-300 block">React Three Fiber</strong>
                  <span className="text-[11px] text-gray-400">Declarative scene graph</span>
                </div>
                <div className="p-3 bg-[#0d152b] rounded border border-cyan-500/20">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1">Layer 3</span>
                  <strong className="text-purple-300 block">Three.js (R187)</strong>
                  <span className="text-[11px] text-gray-400">Mesh & shader engine</span>
                </div>
                <div className="p-3 bg-[#0d152b] rounded border border-cyan-500/20">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1">Layer 4</span>
                  <strong className="text-emerald-300 block">Browser WebGL 2.0</strong>
                  <span className="text-[11px] text-gray-400">Native 60 FPS GPU canvas</span>
                </div>
              </div>
            </div>

            {/* Cloud Persistence Flow */}
            <div className="p-4 rounded-lg bg-gray-900/60 border border-gray-800">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3">
                2. Enterprise Cloud Persistence & Security Pipeline
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-[#110e26] rounded border border-purple-500/20">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1">Client</span>
                  <strong className="text-white block">Axios REST Client</strong>
                  <span className="text-[11px] text-gray-400">Bearer token injection</span>
                </div>
                <div className="p-3 bg-[#110e26] rounded border border-purple-500/20">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1">Middleware</span>
                  <strong className="text-purple-300 block">Laravel Sanctum</strong>
                  <span className="text-[11px] text-gray-400">Rate limiting & auth</span>
                </div>
                <div className="p-3 bg-[#110e26] rounded border border-purple-500/20">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1">Application</span>
                  <strong className="text-cyan-300 block">Laravel 12 API</strong>
                  <span className="text-[11px] text-gray-400">Controllers & policies</span>
                </div>
                <div className="p-3 bg-[#110e26] rounded border border-purple-500/20">
                  <span className="text-[10px] text-gray-400 font-mono block mb-1">Storage</span>
                  <strong className="text-emerald-300 block">MySQL 8.0+ Database</strong>
                  <span className="text-[11px] text-gray-400">Indexed schema</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Database Schema Overview */}
        {activeTechTab === 'database' && (
          <div className="space-y-4 text-xs">
            <p className="text-gray-400">
              The relational schema comprises 14 normalized, indexed tables optimized for high-throughput single-player saves and real-time administrative telemetry:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'users', role: 'Operative credentials, hashed passwords, roles (player/admin), active status' },
                { name: 'player_progress', role: 'World unlocked status, XP, checkpoints, story journal entries' },
                { name: 'game_worlds', role: '4 world records: epoch name, lore narrative, active toggles' },
                { name: 'game_missions', role: 'Step-by-step quest goals, objectives, and XP rewards' },
                { name: 'achievements', role: '16 milestone medals, unlock conditions, and rarity classifications' },
                { name: 'game_sessions', role: 'Playtime telemetry, hardware DPR, and ending selections' },
                { name: 'social_friendships', role: 'Two-way authenticated player friendships' },
                { name: 'social_challenges', role: 'Asynchronous speedrun duels, target times, and verified outcomes' },
                { name: 'buyer_inquiries', role: 'Lead CRM records, budget ranges, priority tags, and follow-up notes' },
                { name: 'buyer_demo_access', role: 'Private buyer links, SHA-256 token hashes, limits, expiration' },
                { name: 'buyer_demo_sessions', role: 'Buyer demo engagement metrics, sections viewed, feedback scores' },
                { name: 'product_settings', role: 'Dynamic white-label colors, logo URL, and marketing CMS copy' }
              ].map((table, idx) => (
                <div key={idx} className="p-3 rounded bg-gray-900/60 border border-gray-800">
                  <strong className="text-cyan-400 font-mono block mb-1">{table.name}</strong>
                  <span className="text-gray-400 text-[11px] leading-relaxed">{table.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: API Endpoints Catalog */}
        {activeTechTab === 'apis' && (
          <div className="space-y-3 text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 bg-gray-900/40">
                    <th className="p-2.5">Method</th>
                    <th className="p-2.5 font-mono">Route Path</th>
                    <th className="p-2.5">Access</th>
                    <th className="p-2.5">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-gray-300">
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">POST</td>
                    <td className="p-2.5 font-mono text-cyan-300">/api/buyer-demo/validate-token</td>
                    <td className="p-2.5"><Badge variant="gray" size="sm">Public</Badge></td>
                    <td className="p-2.5 text-gray-400">Verifies private buyer token hash, expiry & access count</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-cyan-400 font-bold">GET</td>
                    <td className="p-2.5 font-mono text-cyan-300">/api/buyer-demo/sample-data</td>
                    <td className="p-2.5"><Badge variant="gray" size="sm">Public</Badge></td>
                    <td className="p-2.5 text-gray-400">Returns safe read-only demo statistics with disclaimer</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">POST</td>
                    <td className="p-2.5 font-mono text-cyan-300">/api/buyer-demo/session/ping</td>
                    <td className="p-2.5"><Badge variant="gray" size="sm">Public</Badge></td>
                    <td className="p-2.5 text-gray-400">Tracks walkthrough sections viewed and completion</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">POST</td>
                    <td className="p-2.5 font-mono text-cyan-300">/api/inquiries</td>
                    <td className="p-2.5"><Badge variant="gray" size="sm">Public</Badge></td>
                    <td className="p-2.5 text-gray-400">Captures prospective buyer quote requests and CRM leads</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-cyan-400 font-bold">GET</td>
                    <td className="p-2.5 font-mono text-purple-300">/api/admin/buyer-demo/links</td>
                    <td className="p-2.5"><Badge variant="purple" size="sm">Admin</Badge></td>
                    <td className="p-2.5 text-gray-400">Lists private demo access links with usage stats</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">POST</td>
                    <td className="p-2.5 font-mono text-purple-300">/api/admin/buyer-demo/links</td>
                    <td className="p-2.5"><Badge variant="purple" size="sm">Admin</Badge></td>
                    <td className="p-2.5 text-gray-400">Generates high-entropy private buyer demo token</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">POST</td>
                    <td className="p-2.5 font-mono text-purple-300">/api/admin/buyer-demo/links/{'{id}'}/revoke</td>
                    <td className="p-2.5"><Badge variant="purple" size="sm">Admin</Badge></td>
                    <td className="p-2.5 text-gray-400">Instantly blocks access for a revoked demo link</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
